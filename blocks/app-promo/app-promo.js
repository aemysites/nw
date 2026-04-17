export default async function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  // cells[0] = text content, cells[1] = QR image, cells[2] = QR caption

  // Build the text side
  const textDiv = document.createElement('div');
  textDiv.className = 'app-promo-text';

  if (cells[0]) {
    const children = [...cells[0].children];
    children.forEach((child) => {
      if (child.tagName === 'P' && !child.querySelector('picture')) {
        const text = child.textContent.trim();
        if (text.startsWith('Get easy')) {
          child.className = 'app-promo-subtitle';
        } else if (text.startsWith('✓')) {
          child.className = 'app-promo-feature';
        }
      }
      textDiv.append(child);
    });
  }

  // Build the QR side
  const qrDiv = document.createElement('div');
  qrDiv.className = 'app-promo-qr';

  if (cells[1]) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'app-promo-qr-container';
    imgContainer.append(...cells[1].children);
    qrDiv.append(imgContainer);
  }

  if (cells[2]) {
    const captionP = cells[2].querySelector('p');
    if (captionP) {
      captionP.className = 'app-promo-qr-caption';
      qrDiv.append(captionP);
    }
  }

  // Replace block content
  row.replaceWith(textDiv, qrDiv);
}
