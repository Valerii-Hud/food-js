function slider() {
  class Slider {
    constructor(slides, prev, next, current, total, slider) {
      this.slider = document.querySelector(slider);
      this.slides = document.querySelectorAll(slides);
      this.prevBtn = document.querySelector(prev);
      this.nextBtn = document.querySelector(next);
      this.currentCounter = document.querySelector(current);
      this.totalCounter = document.querySelector(total);
      this.slideIndex = 1;
      this.dotsArray = [];

      this.init();
    }

    init() {
      this.updateTotalCounter();
      this.createDots();
      this.showSlide(this.slideIndex);
      this.bindEvents();
    }

    updateTotalCounter() {
      this.totalCounter.textContent =
        this.slides.length < 10
          ? `0${this.slides.length}`
          : `${this.slides.length}`;
    }

    updateCurrentCounter() {
      this.currentCounter.textContent =
        this.slideIndex < 10 ? `0${this.slideIndex}` : `${this.slideIndex}`;
    }

    showSlide(index) {
      if (index > this.slides.length) {
        this.slideIndex = 1;
      } else if (index < 1) {
        this.slideIndex = this.slides.length;
      } else {
        this.slideIndex = index;
      }

      this.slides.forEach((slide) => (slide.style.display = 'none'));
      this.slides[this.slideIndex - 1].style.display = 'block';

      this.updateCurrentCounter();
      this.updateDots();
    }

    changeSlide(step) {
      this.showSlide(this.slideIndex + step);
    }

    createDots() {
      const indicators = document.createElement('ol');
      indicators.classList.add('carousel-indicators');
      indicators.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 15;
      display: flex;
      justify-content: center;
      margin-right: 15%;
      margin-left: 15%;
      list-style: none;
    `;

      this.slider.style.position = 'relative';

      this.slides.forEach((_, i) => {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin: 0 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: 0.5;
        transition: opacity 0.6s ease;
      `;

        dot.addEventListener('click', () => this.showSlide(i + 1));

        indicators.append(dot);
        this.dotsArray.push(dot);
      });

      this.slider.append(indicators);
    }

    updateDots() {
      this.dotsArray.forEach((dot) => (dot.style.opacity = '0.5'));
      if (this.dotsArray[this.slideIndex - 1]) {
        this.dotsArray[this.slideIndex - 1].style.opacity = '1';
      }
    }

    bindEvents() {
      this.prevBtn.addEventListener('click', () => this.changeSlide(-1));
      this.nextBtn.addEventListener('click', () => this.changeSlide(1));
    }
  }

  new Slider(
    '.offer__slide',
    '.offer__slider-prev',
    '.offer__slider-next',
    '#current',
    '#total',
    '.offer__slider'
  );
}

module.exports = slider;
