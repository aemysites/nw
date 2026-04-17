export default async function decorate(block) {
  const slides = [...block.children];
  const slideCount = slides.length;
  let currentSlide = 0;
  let autoplayInterval = null;

  // Mark rows as slides and set first active
  slides.forEach((s) => s.classList.add('slide'));
  slides[0].classList.add('active');

  // Create navigation dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  block.appendChild(dotsContainer);

  // Create navigation arrows
  const prevArrow = document.createElement('button');
  prevArrow.className = 'carousel-arrow prev';
  prevArrow.setAttribute('aria-label', 'Previous slide');
  prevArrow.innerHTML = '&#8592;';
  prevArrow.addEventListener('click', () => goToSlide((currentSlide - 1 + slideCount) % slideCount));

  const nextArrow = document.createElement('button');
  nextArrow.className = 'carousel-arrow next';
  nextArrow.setAttribute('aria-label', 'Next slide');
  nextArrow.innerHTML = '&#8594;';
  nextArrow.addEventListener('click', () => goToSlide((currentSlide + 1) % slideCount));

  block.appendChild(prevArrow);
  block.appendChild(nextArrow);

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');
    resetAutoplay();
  }

  function resetAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % slideCount);
    }, 5000);
  }

  // Start autoplay
  resetAutoplay();

  // Pause on hover
  block.addEventListener('mouseenter', () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
  });
  block.addEventListener('mouseleave', () => {
    resetAutoplay();
  });
}
