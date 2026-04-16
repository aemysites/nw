/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-tile variant.
 * Base: cards. Source: https://www.nationwide.com
 * Selectors: #p30097, #p30087
 * Structure: 2 columns per row - cell 1 = tile image, cell 2 = heading as link
 * IMPORTANT: On the live page, tile images are CSS background-images on
 * .nw-tile-block__image divs (NOT img tags). Extract from style.backgroundImage.
 */
export default function parse(element, { document }) {
  const tileLinks = Array.from(element.querySelectorAll('a.nw-tile-block__tile'));

  if (tileLinks.length === 0) return;

  // Pre-collect all tile data before any DOM changes
  const tileData = tileLinks.map((tile) => {
    const imageDiv = tile.querySelector('.nw-tile-block__image');
    const headingEl = tile.querySelector('.nw-tile-block__content-subheader');

    // Extract background-image URL from style
    let bgUrl = null;
    if (imageDiv) {
      const bgStyle = imageDiv.style.backgroundImage || '';
      const match = bgStyle.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) {
        bgUrl = match[1];
        // Make relative URLs absolute
        if (bgUrl.startsWith('/')) {
          bgUrl = 'https://www.nationwide.com' + bgUrl;
        }
      }
    }

    // Fallback: check for an actual img tag (scraped HTML may have them)
    if (!bgUrl) {
      const imgEl = imageDiv ? imageDiv.querySelector('img') : tile.querySelector('img');
      if (imgEl) {
        bgUrl = imgEl.getAttribute('src') || imgEl.src || null;
      }
    }

    return {
      imgSrc: bgUrl,
      headingText: headingEl ? headingEl.textContent.trim() : null,
      href: tile.href || tile.getAttribute('href'),
    };
  });

  const cells = [];

  tileData.forEach((tile) => {
    // Create image element from background-image URL
    let img = null;
    if (tile.imgSrc) {
      img = document.createElement('img');
      img.src = tile.imgSrc;
      img.alt = tile.headingText || '';
    }

    // Create linked heading
    const contentCell = [];
    if (tile.headingText && tile.href) {
      const link = document.createElement('a');
      link.href = tile.href;
      link.textContent = tile.headingText;
      const h2 = document.createElement('h2');
      h2.append(link);
      contentCell.push(h2);
    }

    if (img && contentCell.length > 0) {
      cells.push([img, contentCell]);
    } else if (contentCell.length > 0) {
      cells.push(contentCell);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
    element.replaceWith(block);
  }
}
