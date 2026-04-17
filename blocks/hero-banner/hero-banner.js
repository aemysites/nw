export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1: text (left) + image (right)
  if (rows.length > 0) {
    const cells = [...rows[0].children];
    if (cells.length >= 2) {
      cells[0].classList.add('hero-banner-text');
      cells[1].classList.add('hero-banner-image');
    }
  }

  // Row 2: caption text — move it as an overlay on the image cell
  if (rows.length > 1) {
    const captionRow = rows[1];
    const captionText = captionRow.textContent.trim();
    if (captionText) {
      const imageCell = block.querySelector('.hero-banner-image');
      if (imageCell) {
        const captionDiv = document.createElement('div');
        captionDiv.className = 'hero-banner-caption';
        captionDiv.textContent = captionText;
        imageCell.appendChild(captionDiv);
      }
    }
    captionRow.remove();
  }
}
