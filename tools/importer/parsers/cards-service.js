/* eslint-disable */
/* global WebImporter */
/** Parser for cards-service. Base: cards. Source: https://www.nationwide.com/. */
export default function parse(element, { document }) {
  // Each card is a .custom-tri-promo or a .column with content in captured DOM
  let cardEls = element.querySelectorAll('.custom-tri-promo');
  if (cardEls.length === 0) {
    cardEls = element.querySelectorAll(':scope > .row > .column, :scope > div > .column');
  }
  const cells = [];

  cardEls.forEach((card) => {
    // Icon: SVG inline img or any img inside the icon container
    // Live DOM uses data:image/svg+xml;base64 encoded SVGs inside bolt-icon or nw-fg-rebrand-vibrant-blue
    let icon = card.querySelector('.nw-fg-rebrand-vibrant-blue img');
    if (!icon) icon = card.querySelector('bolt-icon img, svg, img[src^="data:image/svg"]');
    if (!icon) {
      // Fallback: first img in the card that looks like an icon (SVG or small)
      const imgs = card.querySelectorAll('img');
      for (const img of imgs) {
        const src = img.getAttribute('src') || '';
        if (src.startsWith('data:image/svg') || src.includes('.svg')) {
          icon = img;
          break;
        }
      }
    }

    // Text content: heading + description + CTA
    const heading = card.querySelector('h3, .nw-heading-sm, .mopHeading, .custom-heading');
    const description = card.querySelector('p, .mopDesc');
    const cta = card.querySelector('a.button, a[class*="button"], a[class*="nw-button"]');

    const imageCell = icon ? [icon] : [];
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (cta) textCell.push(cta);

    if (textCell.length > 0) {
      // Cards block library: 2 columns per row — image | text
      cells.push(imageCell.length > 0 ? [imageCell, textCell] : [textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
