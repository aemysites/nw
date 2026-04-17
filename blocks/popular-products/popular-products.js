export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row is the header (title + subtitle)
  const headerRow = rows[0];

  // Remaining rows are product slides
  const slideRows = rows.slice(1);

  // Build carousel container
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'carousel-container';

  slideRows.forEach((row, i) => {
    const cells = [...row.children];
    const slide = document.createElement('div');
    slide.className = 'product-slide';
    if (i > 0) slide.setAttribute('aria-hidden', 'true');

    // Image cell
    const imageCell = cells[0];
    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'product-image';
      imageDiv.innerHTML = imageCell.innerHTML;
      slide.append(imageDiv);
    }

    // Text cell
    const textCell = cells[1];
    if (textCell) {
      const infoDiv = document.createElement('div');
      infoDiv.className = 'product-info';

      // Get h3, paragraphs, and links
      const h3 = textCell.querySelector('h3');
      const paragraphs = textCell.querySelectorAll('p');
      const link = textCell.querySelector('a');

      if (h3) infoDiv.append(h3.cloneNode(true));

      // Add description paragraphs (not the one with the link)
      paragraphs.forEach((p) => {
        if (!p.querySelector('a')) {
          const clone = p.cloneNode(true);
          infoDiv.append(clone);
        }
      });

      // Add Buy Now as styled link
      if (link) {
        const buyLink = document.createElement('a');
        buyLink.href = link.href;
        buyLink.className = 'buy-now';
        buyLink.textContent = link.textContent.trim() || 'Buy Now';
        buyLink.target = '_blank';
        buyLink.rel = 'noopener';
        infoDiv.append(buyLink);
      }

      slide.append(infoDiv);
    }

    carouselContainer.append(slide);
    row.remove();
  });

  // Add navigation arrows
  if (slideRows.length > 1) {
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    nav.innerHTML = '<button aria-label="Previous" class="prev">&#8249;</button><button aria-label="Next" class="next">&#8250;</button>';
    carouselContainer.append(nav);
  }

  block.append(carouselContainer);

  // Add dots
  if (slideRows.length > 1) {
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    slideRows.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.className = 'active';
      dots.append(dot);
    });
    block.append(dots);
  }

  // Carousel logic
  const slides = carouselContainer.querySelectorAll('.product-slide');
  const dotButtons = block.querySelectorAll('.carousel-dots button');
  let current = 0;

  function goTo(index) {
    slides[current].setAttribute('aria-hidden', 'true');
    if (dotButtons[current]) dotButtons[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].removeAttribute('aria-hidden');
    if (dotButtons[current]) dotButtons[current].classList.add('active');
  }

  const prevBtn = carouselContainer.querySelector('.prev');
  const nextBtn = carouselContainer.querySelector('.next');
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  dotButtons.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Auto-play every 3 seconds
  let autoPlay = setInterval(() => goTo(current + 1), 3000);

  block.addEventListener('mouseenter', () => clearInterval(autoPlay));
  block.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goTo(current + 1), 3000);
  });
}
