export const postData = async (url, data) => {
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
};

export const getResourse = async (url, data) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }
  return await res.json();
};

export { postData, getResourse };
