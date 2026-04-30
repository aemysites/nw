/* eslint-disable */
/* global WebImporter */
/** Parser for hero-banner. Base: hero. Source: https://www.nationwide.com/. */
export default function parse(element, { document }) {
  // Extract promotional image from various possible locations in the banner
  // Live DOM: .bg-image-container img, or img inside the shrink column, or any img in the banner
  let bgImage = element.querySelector('.bg-image-container img');
  if (!bgImage) bgImage = element.querySelector('.large-shrink img, .large-shrink-custom img');
  if (!bgImage) {
    // Fallback: find any content image (not inline SVG icons) in the banner
    const allImgs = element.querySelectorAll('img[src]');
    for (const img of allImgs) {
      const src = img.getAttribute('src') || '';
      if (!src.startsWith('data:') && src.length > 0) {
        bgImage = img;
        break;
      }
    }
  }

  // Extract heading (h1 in captured DOM)
  const heading = element.querySelector('h1, .nw-banner-media__title, .banner-title');

  // Extract subheading (h2 in .nw-banner-inpage__content in captured DOM)
  const subheading = element.querySelector('.nw-banner-inpage__content h2, .banner-content-custom h2');

  // Extract CTA links (find-an-agent-link anchors in captured DOM)
  const ctaLinks = element.querySelectorAll('a.find-an-agent-link, a.nw-text-sm[href]');

  const cells = [];

  // Row 1: Background image (per hero block library)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Heading + subheading + CTA links
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  ctaLinks.forEach((link) => contentCell.push(link));
  if (contentCell.length > 0) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
