export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const text = cell.textContent.trim();
      // Check if cell contains a YouTube URL
      if (text.includes('youtube.com/embed/') || text.includes('youtu.be/')) {
        let embedUrl = text;
        // Ensure it's an embed URL
        if (text.includes('youtu.be/')) {
          const videoId = text.split('youtu.be/')[1]?.split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        // Build responsive iframe container
        const wrapper = document.createElement('div');
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('frameborder', '0');
        iframe.title = 'Video';
        cell.textContent = '';
        cell.appendChild(iframe);
      }
    });
  });
}
