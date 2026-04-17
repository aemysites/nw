export default async function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    // cells[0] = image cell, cells[1] = text cell
    const imgCell = cells[0];
    const textCell = cells[1];

    // Create card structure
    row.classList.add('image-card');
    if (index === 0) row.classList.add('image-card-small');
    if (index === 1) row.classList.add('image-card-large');

    // Get the image and make it a background
    const img = imgCell.querySelector('img');
    if (img) {
      row.style.backgroundImage = `url(${img.src})`;
      imgCell.remove();
    }

    // Wrap text content in overlay
    if (textCell) {
      textCell.classList.add('image-card-overlay');
      // Hide the link text since title is the heading
      const link = textCell.querySelector('a');
      const h2 = textCell.querySelector('h2');
      if (link && h2) {
        // Make the whole card clickable
        const cardLink = document.createElement('a');
        cardLink.href = link.href;
        cardLink.className = 'image-card-link';
        cardLink.setAttribute('aria-label', h2.textContent);
        row.appendChild(cardLink);
        // Remove the paragraph with link, keep just h2
        const p = link.closest('p');
        if (p) p.remove();
      }
    }
  });
}
