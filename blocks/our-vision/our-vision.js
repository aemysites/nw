export default async function decorate(block) {
  // Each row is a card with a single cell containing h3 + p
  // No restructuring needed - CSS grid handles the layout
  const rows = [...block.children];
  rows.forEach((row, index) => {
    row.classList.add('vision-card');
    if (index === 0) {
      row.classList.add('vision-card-highlight');
    }
  });
}
