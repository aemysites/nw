/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner variant.
 * Base: hero. Source: https://www.nationwide.com
 * Selector: .nw-home-quote-banner
 * Structure: Row 1 = background image, Row 2 = heading + subtitle + CTAs
 */
export default function parse(element, { document }) {
  // Extract background/promotional image
  // Found in source: <img src="./images/08ae2f830e0196d62d25ac672678804c.png"> inside .bg-image-container
  const bgImage = element.querySelector('.bg-image-container img, .large-shrink img');

  // Extract heading
  // Found in source: <h1 class="nw-heading-tiempos-md nw-banner-media__title banner-title">
  const heading = element.querySelector('h1, h2.nw-heading-tiempos-md, .banner-title');

  // Extract subtitle
  // Found in source: <h2>For your insurance and financial needs...</h2>
  const subtitle = element.querySelector('.nw-banner-inpage__content h2, .banner-content-custom h2');

  // Extract CTA links
  // Found in source: <a class="nw-text-sm find-an-agent-link"> elements
  const ctaLinks = Array.from(element.querySelectorAll('a.find-an-agent-link, .nw-banner-inpage__content a'));

  const cells = [];

  // Row 1: Background image (optional per block library)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell - heading + subtitle + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);
  ctaLinks.forEach((link) => contentCell.push(link));
  if (contentCell.length > 0) cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
