/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo variant.
 * Base: columns. Source: https://www.nationwide.com
 * Selector: #p43655
 * Structure: 1 row with 2 columns - col 1 = feature list, col 2 = QR code image + caption
 */
export default function parse(element, { document }) {
  // Find the two column containers
  // Found in source: <div class="large-6 small-12 columns rtc-paragraph"> (2 of them)
  const columnDivs = Array.from(element.querySelectorAll('.rtc-paragraph, .columns.rtc-paragraph'));

  if (columnDivs.length < 2) return;

  // Column 1: Feature list with heading and checkmark items
  const col1 = columnDivs[0];
  const col1Content = [];

  // Get the intro text "Get easy 24/7 support on our"
  const introText = col1.querySelector('.nw-text-lg, div.nw-text-lg');
  if (introText) col1Content.push(introText);

  // Get the heading "mobile app"
  const heading = col1.querySelector('h3');
  if (heading) col1Content.push(heading);

  // Get feature list items (divs with checkmark images)
  const featureItems = Array.from(col1.querySelectorAll('span > div'));
  const ul = document.createElement('ul');
  featureItems.forEach((item) => {
    const text = item.textContent.trim().replace(/^\s*/, '');
    if (text) {
      const li = document.createElement('li');
      li.textContent = text;
      ul.append(li);
    }
  });
  if (ul.children.length > 0) col1Content.push(ul);

  // Column 2: QR code image and caption
  const col2 = columnDivs[1];
  const col2Content = [];

  const qrImage = col2.querySelector('img');
  if (qrImage) col2Content.push(qrImage);

  const caption = col2.querySelector('p');
  if (caption) col2Content.push(caption);

  const cells = [];
  if (col1Content.length > 0 || col2Content.length > 0) {
    cells.push([col1Content, col2Content]);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
    element.replaceWith(block);
  }
}
