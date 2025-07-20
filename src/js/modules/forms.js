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
