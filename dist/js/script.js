/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
window.addEventListener('DOMContentLoaded', () => {
  // TABS
  const tabsParent = document.querySelector('.tabheader__items'),
    tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent');
  function hideTabContent(activeClass) {
    tabsContent.forEach(text => {
      text.classList.add('hide');
      text.classList.remove('show', 'fade');
    });
    tabs.forEach(tab => {
      tab.classList.remove(activeClass);
    });
  }
  function showTabContent(index = 0, activeClass) {
    tabsContent[index].classList.add('show', 'fade');
    tabsContent[index].classList.remove('hide');
    tabs[index].classList.add(activeClass);
  }
  hideTabContent('tabheader__item_active');
  showTabContent(0, 'tabheader__item_active');
  tabsParent.addEventListener('click', event => {
    const target = event.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, index) => {
        if (target === tab) {
          hideTabContent('tabheader__item_active');
          showTabContent(index, 'tabheader__item_active');
        }
      });
    }
  });

  // TIMER
  const deadline = '2025-07-02';
  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(total / (1000 * 60 * 60 * 24)),
      hours = Math.floor(total / (1000 * 60 * 60) % 24),
      minutes = Math.floor(total / 1000 / 60 % 60),
      seconds = Math.floor(total / 1000 % 60);
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }
  function getZero(num) {
    return num >= 0 && num < 10 ? `0${num}` : num;
  }
  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timerInterval = setInterval(updateClock, 1000);
    updateClock();
    function updateClock() {
      const total = getTimeRemaining(endtime);
      days.textContent = getZero(total.days);
      hours.textContent = getZero(total.hours);
      minutes.textContent = getZero(total.minutes);
      seconds.textContent = getZero(total.seconds);
      if (total.total <= 0) {
        clearInterval(timerInterval);
      }
    }
  }
  setClock('.timer', deadline);

  // MODAL
  const modal = document.querySelector('.modal');
  const modalTimerId = setTimeout(openModal, 10000); // Auto open modal

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
    btns.forEach(btn => {
      btn.addEventListener('click', openModal);
    });
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.getAttribute('data-close') === '') {
        closeModal();
      }
    });
    document.addEventListener('keydown', e => {
      if (e.code === 'Escape' && getComputedStyle(modal).display === 'block') {
        closeModal();
      }
    });
    function showModalByScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
        openModal();
        window.removeEventListener('scroll', showModalByScroll);
      }
    }
    window.addEventListener('scroll', showModalByScroll);
  }
  showModal('[data-modal]');

  // CARDS
  function showCards() {
    class MenuCard {
      constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeUSDtoUAH();
      }
      changeUSDtoUAH() {
        this.price = +this.price * this.transfer;
      }
      render() {
        const cardBlock = document.createElement('div');
        if (this.classes.length === 0) {
          this.cardBlock = 'menu__item';
          cardBlock.classList.add(this.cardBlock);
        } else {
          this.classes.forEach(className => cardBlock.classList.add(className));
        }
        cardBlock.innerHTML = `
          <img src=${this.src} alt=${this.alt} />
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>`;
        this.parent.append(cardBlock);
      }
    }
    new MenuCard('img/tabs/vegy.jpg', 'vegy', 'Меню "Фитнес"', `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей.`, 9, '.menu .container', 'menu__item').render();
    new MenuCard('img/tabs/elite.jpg', 'elite', 'Меню "Премиум"', `В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд.`, 14, '.menu .container', 'menu__item').render();
    new MenuCard('img/tabs/post.jpg', 'post', 'Меню "Постное"', `Меню “Постное” - это тщательный подбор ингредиентов без продуктов животного происхождения.`, 24, '.menu .container', 'menu__item').render();
  }
  showCards();

  // FORMS
  function formsListeners() {
    const forms = document.querySelectorAll('form');
    const message = {
      loading: 'img/form/spinner.svg',
      success: 'Success!',
      failure: 'Something went wrong'
    };
    forms.forEach(form => {
      postData(form);
    });
    function postData(form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
        display:block;
        margin: 0 auto;
        `;
        form.append(statusMessage);
        const req = new XMLHttpRequest();
        req.open('POST', 'server.php');
        req.setRequestHeader('Content-type', 'application/json');
        const formData = new FormData(form);
        const obj = {};
        formData.forEach((value, key) => {
          obj[key] = value;
        });
        const json = JSON.stringify(obj);
        req.send(json);
        req.addEventListener('load', () => {
          if (req.status === 200) {
            showThanksModal(message.success);
            form.reset();
            statusMessage.remove();
          } else {
            showThanksModal(message.failure);
          }
        });
      });
    }
    function showThanksModal(msg) {
      const prevModalDialog = document.querySelector('.modal__dialog');
      prevModalDialog.classList.add('hide');
      const thanksModal = document.createElement('div');
      thanksModal.classList.add('modal__dialog');
      thanksModal.innerHTML = `
        <div class="modal__content">
          <div class="modal__close" data-close>&times;</div>
          <div class="modal__title">${msg}</div>
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
  }
  formsListeners();
});
/******/ })()
;
//# sourceMappingURL=script.js.map