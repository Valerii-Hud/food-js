/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calc.js":
/*!********************************!*\
  !*** ./src/js/modules/calc.js ***!
  \********************************/
/***/ ((module) => {

function calc() {
  const result = document.querySelector('.calculating__result span');
  let sex, height, weight, age, ratio;

  if (localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex');
  } else {
    sex = 'female';
    localStorage.setItem('sex', sex);
  }

  if (localStorage.getItem('ratio')) {
    ratio = +localStorage.getItem('ratio');
  } else {
    ratio = 1.375;
    localStorage.setItem('ratio', ratio);
  }

  function initLocalSettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) => {
      elem.classList.remove(activeClass);

      if (elem.getAttribute('id') === localStorage.getItem('sex')) {
        elem.classList.add(activeClass);
      }

      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        elem.classList.add(activeClass);
      }
    });
  }

  initLocalSettings('#gender div', 'calculating__choose-item_active');
  initLocalSettings(
    '.calculating__choose_big div',
    'calculating__choose-item_active'
  );

  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = '____';
      return;
    }

    if (sex === 'female') {
      result.textContent = Math.round(
        (447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
      );
    } else {
      result.textContent = Math.round(
        (88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
      );
    }
  }

  function getStaticInformation(parentSelector, activeClass) {
    const container = document.querySelector(parentSelector);
    const elements = container.querySelectorAll('div');

    elements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
          localStorage.setItem('ratio', ratio);
        } else {
          sex = e.target.getAttribute('id');
          localStorage.setItem('sex', sex);
        }

        elements.forEach((el) => el.classList.remove(activeClass));
        e.target.classList.add(activeClass);

        calcTotal();
      });
    });
  }

  function getInputInformation(selector) {
    const input = document.querySelector(selector);
    input.addEventListener('input', () => {
      const val = +input.value;
      if (!val || val <= 0) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
        switch (input.getAttribute('id')) {
          case 'height':
            height = val;
            break;
          case 'weight':
            weight = val;
            break;
          case 'age':
            age = val;
            break;
        }
      }
      calcTotal();
    });
  }

  getStaticInformation('#gender', 'calculating__choose-item_active');
  getStaticInformation(
    '.calculating__choose_big',
    'calculating__choose-item_active'
  );

  getInputInformation('#height');
  getInputInformation('#weight');
  getInputInformation('#age');

  calcTotal();
}

module.exports = calc;


/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ ((module) => {

function cards() {
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes.length ? classes : ['menu__item'];
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeUSDtoUAH();
    }

    changeUSDtoUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const card = document.createElement('div');
      this.classes.forEach((className) => card.classList.add(className));
      card.innerHTML = `
        <img src="${this.src}" alt="${this.alt}" />
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      this.parent.append(card);
    }
  }

  const getResourse = async (url, data) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  axios.get('http://localhost:3000/menu').then((data) => {
    data.data.forEach(({ img, altimg, title, descr, price }) => {
      new MenuCard(
        img,
        altimg,
        title,
        descr,
        price,
        '.menu .container'
      ).render();
    });
  });
}

module.exports = cards;


/***/ }),

/***/ "./src/js/modules/forms.js":
/*!*********************************!*\
  !*** ./src/js/modules/forms.js ***!
  \*********************************/
/***/ ((module) => {

function forms() {
  const forms = document.querySelectorAll('form');
  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...',
  };

  forms.forEach((form) => {
    bindPostData(form);
  });

  async function postData(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    const contentType = res.headers.get('content-type');
    if (!res.ok) {
      throw new Error(`Ошибка сервера: ${res.status}`);
    }

    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Ожидался JSON, получено:\n${text}`);
    }
  }

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
    `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch((error) => {
          console.error('Ошибка запроса:', error);
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    openModal();

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.remove('hide');
      prevModalDialog.classList.add('show');
      closeModal();
    }, 4000);
  }

  function getDataFromDB(url) {
    fetch(url)
      .then((data) => data.json())
      .then((json) => json);
  }
  getDataFromDB('http://localhost:3000/menu');
}

module.exports = forms;


/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ ((module) => {

function modal() {
  const modal = document.querySelector('.modal');
  const modalTimerId = setTimeout(openModal, 10000);

  function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showModal(triggerSelector) {
    const btns = document.querySelectorAll(triggerSelector);
    btns.forEach((btn) => btn.addEventListener('click', openModal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.getAttribute('data-close') === '') {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && getComputedStyle(modal).display === 'block') {
        closeModal();
      }
    });

    function showModalByScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >=
        document.documentElement.scrollHeight - 1
      ) {
        openModal();
        window.removeEventListener('scroll', showModalByScroll);
      }
    }

    window.addEventListener('scroll', showModalByScroll);
  }

  showModal('[data-modal]');
}

module.exports = modal;


/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ ((module) => {

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


/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ ((module) => {

function tabs() {
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.style.display = 'none';
    });

    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target === item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });
}

module.exports = tabs;


/***/ }),

/***/ "./src/js/modules/timer.js":
/*!*********************************!*\
  !*** ./src/js/modules/timer.js ***!
  \*********************************/
/***/ ((module) => {

function timer() {
  const deadline = '2027-07-02';

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { total, days, hours, minutes, seconds };
  }

  function getZero(num) {
    return num >= 0 && num < 10 ? `0${num}` : num;
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds');

    const timerInterval = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);
      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timerInterval);
      }
    }
  }

  setClock('.timer', deadline);
}

module.exports = timer;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
document.addEventListener('DOMContentLoaded', () => {
  const tabs = __webpack_require__(/*! ./modules/tabs */ "./src/js/modules/tabs.js"),
    modal = __webpack_require__(/*! ./modules/modal */ "./src/js/modules/modal.js"),
    timer = __webpack_require__(/*! ./modules/timer */ "./src/js/modules/timer.js"),
    cards = __webpack_require__(/*! ./modules/cards */ "./src/js/modules/cards.js"),
    calc = __webpack_require__(/*! ./modules/calc */ "./src/js/modules/calc.js"),
    forms = __webpack_require__(/*! ./modules/forms */ "./src/js/modules/forms.js"),
    slider = __webpack_require__(/*! ./modules/slider */ "./src/js/modules/slider.js");

  tabs();
  modal();
  timer();
  cards();
  calc();
  forms();
  slider();
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map