export default async function decorate(block) {
  // The footer-links block contains rows of footer content
  // No major restructuring needed — the CSS handles the layout
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      // Ensure images in the last row are displayed inline
      const imgs = cell.querySelectorAll('img');
      imgs.forEach((img) => {
        img.loading = 'lazy';
      });
    });
  });
}
