document.addEventListener('DOMContentLoaded', () => {
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

  // TIMER
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

  // MODAL
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

  // CARDS
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
  // FORMS
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
      .then((json) => console.log(json));
  }
  getDataFromDB('http://localhost:3000/menu');

  // Slider

  class Slider {
    constructor(slides, prev, next, current, total) {
      this.slides = document.querySelectorAll(slides);
      this.prev = document.querySelector(prev);
      this.next = document.querySelector(next);
      this.current = document.querySelector(current);
      this.total = document.querySelector(total);
      this.slideIndex = 1;
      this.showSlides(this.slideIndex);
      this.getTotalSlides();
    }
    getTotalSlides() {
      if (this.slides.length < 10) {
        this.total.textContent = `0${this.slides.length}`;
      } else {
        this.total.textContent = `${this.slides.length}`;
      }
    }
    showSlides(n) {
      if (n > this.slides.length) {
        this.slideIndex = 1;
      } else if (n < 1) {
        this.slideIndex = this.slides.length;
      } else {
        this.slideIndex = n;
      }
      this.slides.forEach((slide) => {
        slide.style.display = 'none';
      });
      this.slides[this.slideIndex - 1].style.display = 'block';
      if (this.slides.length < 10) {
        this.current.textContent = `0${this.slideIndex}`;
      } else {
        this.current.textContent = `${this.slideIndex}`;
      }
    }
    plusSlides(n) {
      this.showSlides((this.slideIndex += n));
    }

    render() {
      this.prev.addEventListener('click', () => this.plusSlides(-1));
      this.next.addEventListener('click', () => this.plusSlides(1));
    }
  }
  const offerSlider = new Slider(
    '.offer__slide',
    '.offer__slider-prev',
    '.offer__slider-next',
    '#current',
    '#total'
  );
  offerSlider.render();
});
