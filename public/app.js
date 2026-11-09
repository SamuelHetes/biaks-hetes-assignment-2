const $ = (selector) => document.querySelector(selector);

let version = 'vulnerable';

document.querySelectorAll('input[name="version"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    version = radio.value;
    document.body.classList.toggle('secure', version === 'secure');
    logout();
  });
});

$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = await api('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: $('#username').value, password: $('#password').value }),
  });

  if (!data.ok) {
    $('#login-error').textContent = data.error ?? data.message;
    return;
  }

  $('#current-user').textContent = data.user.username;
  $('#current-role').textContent = data.user.role;
  $('#user-box').hidden = false;
  $('#login-page').hidden = true;
  $('#shop-page').hidden = false;
  search('');
});

$('#logout').addEventListener('click', logout);

function logout() {
  $('#login-form').reset();
  $('#login-error').textContent = '';
  $('#q').value = '';
  $('#products').replaceChildren();
  $('#search-error').textContent = '';
  $('#no-results').hidden = true;
  $('#user-box').hidden = true;
  $('#shop-page').hidden = true;
  $('#login-page').hidden = false;
}

$('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  search($('#q').value);
});

async function search(q) {
  const data = await api(`/search?q=${encodeURIComponent(q)}`);
  $('#products').replaceChildren();
  $('#search-error').textContent = data.ok ? '' : data.error ?? data.message;
  $('#no-results').hidden = !data.ok || data.rows.length > 0;
  if (!data.ok) return;

  for (const p of data.rows) {
    const tr = document.createElement('tr');
    for (const value of [p.id, p.name, p.description, formatPrice(p.price)]) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    $('#products').append(tr);
  }
}

function formatPrice(price) {
  return typeof price === 'number'
    ? price.toLocaleString('sk-SK', { style: 'currency', currency: 'EUR' })
    : price;
}

document.querySelectorAll('[data-user]').forEach((btn) => {
  btn.addEventListener('click', () => {
    $('#username').value = btn.dataset.user;
    $('#password').value = btn.dataset.pass;
    $('#username').focus();
  });
});

document.querySelectorAll('[data-search]').forEach((btn) => {
  btn.addEventListener('click', () => {
    $('#q').value = btn.dataset.search;
    $('#q').focus();
  });
});

async function api(path, options) {
  try {
    const res = await fetch(`/api/${version}${path}`, options);
    return await res.json();
  } catch {
    return { ok: false, message: 'Server nie je dostupný.' };
  }
}
