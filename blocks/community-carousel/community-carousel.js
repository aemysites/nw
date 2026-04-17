export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row is the heading/subtitle
  const headerRow = rows[0];

  // Remaining rows are slides
  const slides = rows.slice(1);

  // Set up slide images as background and mark first as active
  slides.forEach((slide, index) => {
    slide.classList.add('slide');
    const imgCell = slide.children[0];
    const img = imgCell.querySelector('img');
    if (img) {
      slide.style.backgroundImage = `url('${img.src}')`;
    }
    if (index === 0) {
      slide.classList.add('active');
    }
  });

  // Create viewport wrapper for slides + arrows
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav-btn carousel-nav-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav-btn carousel-nav-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '&#8250;';

  // Move slides into viewport
  slides.forEach((slide) => viewport.append(slide));
  viewport.prepend(prevBtn);
  viewport.append(nextBtn);
  block.append(viewport);

  // Create dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.append(dot);
  });

  block.append(dotsContainer);

  let currentSlide = 0;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Auto-advance every 5 seconds
  let autoAdvance = setInterval(() => goToSlide(currentSlide + 1), 5000);

  // Pause auto-advance on hover
  block.addEventListener('mouseenter', () => clearInterval(autoAdvance));
  block.addEventListener('mouseleave', () => {
    autoAdvance = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });
}
