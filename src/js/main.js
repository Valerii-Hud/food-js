window.addEventListener('DOMContentLoaded', () => {
  // TABS
  const tabsParent = document.querySelector('.tabheader__items'),
    tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent');

  function hideTabContent(active) {
    tabsContent.forEach((text) => {
      text.classList.add('hide');
      text.classList.remove('show', 'fade');
    });
    tabs.forEach((tab) => {
      tab.classList.remove(active);
    });
  }
  function showTabContent(index = 0, active) {
    tabsContent[index].classList.add('show', 'fade');
    tabsContent[index].classList.remove('hide');
    tabs[index].classList.add(active);
  }

  hideTabContent('tabheader__item_active');
  showTabContent(0, 'tabheader__item_active');

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, index) => {
        if (target == tab) {
          hideTabContent('tabheader__item_active');
          showTabContent(index, 'tabheader__item_active');
        }
      });
    }
  });
  // TIMER

  const deadline = '2025-07-02';

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;

    const total = Date.parse(endtime) - Date.parse(new Date());
    if (total <= 0) {
      days = hours = minutes = seconds = 0;
    } else {
      days = Math.floor(total / (1000 * 60 * 60 * 24));
      hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((total / 1000 / 60) % 60);
      seconds = Math.floor((total / 1000) % 60);
    }
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
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
      if (!total.total || total.total <= 0) clearInterval(updateClock);
    }
  }
  setClock('.timer', deadline);
});
