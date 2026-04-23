/* eslint-disable */
/* global WebImporter */
/** Parser for columns-promo. Base: columns. Source: https://www.nationwide.com/. */
export default function parse(element, { document }) {
  // Two columns in .row > .rtc-paragraph divs (from captured DOM)
  const columnEls = element.querySelectorAll('.rtc-paragraph, .columns');
  const cells = [];

  if (columnEls.length >= 2) {
    // Column 1: app features text (from captured DOM)
    const col1 = columnEls[0];
    const col1Content = [];
    const col1Elements = col1.querySelectorAll('div, h3, p, span > *');
    col1Elements.forEach((el) => {
      if (el.textContent.trim()) col1Content.push(el);
    });
    // Use the whole column content if individual extraction is complex
    if (col1Content.length === 0) col1Content.push(col1);

    // Column 2: QR code image (from captured DOM)
    const col2 = columnEls[1];
    const col2Content = [];
    const qrImage = col2.querySelector('img');
    const qrText = col2.querySelector('p');
    if (qrImage) col2Content.push(qrImage);
    if (qrText) col2Content.push(qrText);
    if (col2Content.length === 0) col2Content.push(col2);

    // Columns block library: N columns per row
    cells.push([col1Content, col2Content]);
  } else {
    // Fallback: use entire element content as single column
    cells.push([[element]]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
