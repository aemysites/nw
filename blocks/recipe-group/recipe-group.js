export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  // Row 0: Header (h2 + subtitle) — leave as-is
  // Row 1: Tabs
  const tabsRow = rows[1];
  const tabTexts = [...tabsRow.querySelectorAll('p')].map((p) => p.textContent.trim());

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'recipe-group-tabs';
  tabTexts.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
    tabsContainer.appendChild(btn);
  });
  tabsRow.replaceWith(tabsContainer);

  // Rows 2..n-1: Recipe cards
  const cardRows = rows.slice(2, rows.length - 1);
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'recipe-group-cards';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const imgCell = cells[0];
    const textCell = cells[1];

    const img = imgCell.querySelector('img');
    const paragraphs = [...textCell.querySelectorAll('p')];
    const h4 = textCell.querySelector('h4');
    const link = textCell.querySelector('a');

    const card = document.createElement('a');
    card.className = 'recipe-card';
    card.href = link ? link.href : '#';

    // Image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'recipe-card-image';
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      newImg.loading = 'lazy';
      imageDiv.appendChild(newImg);
    }
    card.appendChild(imageDiv);

    // Body
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'recipe-card-body';

    // Category tag (first p)
    if (paragraphs.length > 0) {
      const tag = document.createElement('p');
      tag.className = 'recipe-card-tag';
      tag.textContent = paragraphs[0].textContent.trim();
      bodyDiv.appendChild(tag);
    }

    // Title
    if (h4) {
      const title = document.createElement('h4');
      title.className = 'recipe-card-title';
      title.textContent = h4.textContent.trim();
      bodyDiv.appendChild(title);
    }

    // Footer: time + difficulty
    if (paragraphs.length >= 3) {
      const footer = document.createElement('div');
      footer.className = 'recipe-card-footer';
      const timeSpan = document.createElement('span');
      timeSpan.textContent = `⏱ ${paragraphs[1].textContent.trim()}`;
      const levelSpan = document.createElement('span');
      levelSpan.textContent = `👨‍🍳 ${paragraphs[2].textContent.trim()}`;
      footer.appendChild(timeSpan);
      footer.appendChild(levelSpan);
      bodyDiv.appendChild(footer);
    }

    card.appendChild(bodyDiv);
    cardsContainer.appendChild(card);

    row.remove();
  });

  // Insert cards container after tabs
  block.insertBefore(cardsContainer, rows[rows.length - 1]);

  // Last row: View All CTA
  const ctaRow = rows[rows.length - 1];
  ctaRow.className = 'recipe-group-cta';
}
