/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon variant.
 * Base: cards. Source: https://www.nationwide.com
 * Selectors: .row.text-center.align-center.nw-inner-bottom, #p43486 section.nw-container
 * Live page has inline SVG icons (not img tags) — use 1-column (no images) cards variant.
 * Structure: 1 column per row - heading + description + CTA
 * Element is the PARENT container holding multiple card children.
 */
export default function parse(element, { document }) {
  // Find card items within the parent container
  const cardItems = Array.from(element.querySelectorAll('.custom-tri-promo, .column.small-12.large-4'));

  if (cardItems.length === 0) return;

  const cells = [];

  cardItems.forEach((card) => {
    // Heading - h3 elements
    const heading = card.querySelector('h3');

    // Description - p element (first p only, skip form labels)
    const desc = card.querySelector(':scope > p, .mopDesc');

    // CTA - direct link child or button-styled link
    const cta = card.querySelector(':scope > a, a.button, a[class*="button"]');

    // Build single content cell (no images - icons are inline SVGs that don't import)
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (desc) contentCell.push(desc);
    if (cta) contentCell.push(cta);

    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
    element.replaceWith(block);
  }
}
