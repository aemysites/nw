export default async function decorate(block) {
  const rows = [...block.children];

  // First row is the heading row — leave as-is
  // Remaining rows are card items (icon cell + text cell)
  rows.slice(1).forEach((row) => {
    row.classList.add('category-card');
    const cells = [...row.children];
    if (cells.length >= 2) {
      cells[0].classList.add('card-icon');
      cells[1].classList.add('card-content');
    }
  });
}
