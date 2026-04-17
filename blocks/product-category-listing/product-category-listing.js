export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row is the header (title + description) — leave it as-is
  const headerRow = rows[0];

  // Remaining rows are category cards (each row = 1 card with image cell + text cell)
  const cardRows = rows.slice(1);

  // Create a grid container for the cards
  const grid = document.createElement('div');
  grid.className = 'pcl-grid';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const textCell = cells[1];

    const img = imgCell?.querySelector('img');
    const link = textCell?.querySelector('a');
    const labelText = link?.textContent?.trim() || textCell?.textContent?.trim() || '';

    // Create card element
    const card = document.createElement('a');
    card.className = 'pcl-card';
    card.href = link?.href || '#';
    card.title = labelText;

    if (img) {
      const picture = imgCell.querySelector('picture');
      if (picture) {
        card.append(picture);
      } else {
        card.append(img);
      }
    }

    const label = document.createElement('span');
    label.className = 'pcl-label';
    label.textContent = labelText;
    card.append(label);

    grid.append(card);
    row.remove();
  });

  block.append(grid);
}
