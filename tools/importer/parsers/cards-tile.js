/* eslint-disable */
/* global WebImporter */
/** Parser for cards-tile. Base: cards. Source: https://www.nationwide.com/. */
export default function parse(element, { document }) {
  // Each tile is a .nw-tile-block__tile link in captured DOM
  const tileLinks = element.querySelectorAll('a.nw-tile-block__tile');
  const cells = [];

  tileLinks.forEach((tile) => {
    // Image: look for img in .nw-tile-block__image, or any img with a real src
    let img = tile.querySelector('.nw-tile-block__image img[src]');
    if (!img) img = tile.querySelector('img[src]');
    if (!img) {
      // Check for lazy-loaded images with data-src attribute
      const lazyImg = tile.querySelector('img[data-src]');
      if (lazyImg) {
        lazyImg.setAttribute('src', lazyImg.getAttribute('data-src'));
        img = lazyImg;
      }
    }
    // Also check for background-image on the tile image container
    if (!img) {
      const imgContainer = tile.querySelector('.nw-tile-block__image');
      if (imgContainer) {
        const bgStyle = imgContainer.style?.backgroundImage || '';
        const bgMatch = bgStyle.match(/url\(["']?([^"')]+)["']?\)/);
        if (bgMatch) {
          img = document.createElement('img');
          img.src = bgMatch[1];
        }
      }
    }

    // Text: .nw-tile-block__content-subheader (from captured DOM)
    const heading = tile.querySelector('.nw-tile-block__content-subheader, h2');

    const imageCell = img ? [img] : [];
    const textCell = [];

    // Create a link preserving the tile href with the heading text
    if (heading && tile.href) {
      const link = document.createElement('a');
      link.href = tile.href;
      link.textContent = heading.textContent.trim();
      textCell.push(link);
    } else if (heading) {
      textCell.push(heading);
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      // Cards block library: 2 columns per row — image | text
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
  element.replaceWith(block);
}
