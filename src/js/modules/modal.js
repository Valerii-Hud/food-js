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
