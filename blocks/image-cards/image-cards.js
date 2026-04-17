export default async function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    // cells[0] = image cell, cells[1] = text cell
    const imageCell = cells[0];
    const textCell = cells[1];

    if (imageCell) imageCell.classList.add('image-cards-image');
    if (textCell) textCell.classList.add('image-cards-text');

    // Wrap the entire row as a clickable card
    if (textCell) {
      const link = textCell.querySelector('a');
      if (link) {
        const cardLink = document.createElement('a');
        cardLink.href = link.href;
        cardLink.className = 'image-cards-link';
        cardLink.setAttribute('aria-label', link.textContent.trim());

        // Move all children into the link
        while (row.firstChild) {
          cardLink.appendChild(row.firstChild);
        }
        row.appendChild(cardLink);

        // Hide the original text link (the card itself is clickable)
        const buttonContainer = textCell.querySelector('.button-container, .button-wrapper');
        if (buttonContainer) buttonContainer.style.display = 'none';
        const pLink = link.closest('p');
        if (pLink) pLink.style.display = 'none';
      }
    }
  });
}
