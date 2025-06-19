/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
window.addEventListener('DOMContentLoaded', () => {
  const tabsParent = document.querySelector('.tabheader__items'),
    tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent');
  function hideTabContent(active) {
    tabsContent.forEach(text => {
      text.classList.add('hide');
      text.classList.remove('show', 'fade');
    });
    tabs.forEach(tab => {
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
  tabsParent.addEventListener('click', event => {
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
});
/******/ })()
;
//# sourceMappingURL=script.js.map