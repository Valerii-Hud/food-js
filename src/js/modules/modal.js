export function openModal(modalSelector, modalTimerId) {
  const modal = document.querySelector(modalSelector);

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  console.log(modalTimerId);
  if (modalTimerId) clearInterval(modalTimerId);
}

export function closeModal(modalSelector) {
  const modal = document.querySelector(modalSelector);

  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
  const modal = document.querySelector(modalSelector);

  function showModal(triggerSelector) {
    const btns = document.querySelectorAll(triggerSelector);
    btns.forEach((btn) =>
      btn.addEventListener('click', () =>
        openModal(modalSelector, modalTimerId)
      )
    );

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.getAttribute('data-close') === '') {
        closeModal(modalSelector);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && getComputedStyle(modal).display === 'block') {
        closeModal(modalSelector);
      }
    });

    function showModalByScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >=
        document.documentElement.scrollHeight - 1
      ) {
        openModal(modalSelector, modalTimerId);
        window.removeEventListener('scroll', showModalByScroll);
      }
    }

    window.addEventListener('scroll', showModalByScroll);
  }

  showModal(triggerSelector);
}
export default modal;
export { closeModal, openModal };
