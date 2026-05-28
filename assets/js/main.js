(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        menuButton.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  document.querySelectorAll('.faq-item').forEach((item) => {
    const summary = item.querySelector('summary');
    if (!summary) return;
    summary.setAttribute('aria-expanded', String(item.open));
    item.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(item.open)));
  });

  document.querySelectorAll('[data-copy-phone]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy-phone') || '+79034525151';
      try {
        await navigator.clipboard.writeText(value);
        const old = button.textContent;
        button.textContent = 'Телефон скопирован';
        setTimeout(() => { button.textContent = old; }, 1800);
      } catch {
        window.location.href = 'tel:+79034525151';
      }
    });
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const serviceCards = document.querySelectorAll('.service-card[data-group]');
  const serviceGroups = document.querySelectorAll('.service-group[id]');
  const anchorFilters = document.querySelectorAll('.anchor-row a[href^="#"]');
  const setServiceFilter = (filter) => {
    const active = filter || 'all';
    filterButtons.forEach((item) => item.classList.toggle('is-active', item.getAttribute('data-filter') === active));
    anchorFilters.forEach((item) => item.classList.toggle('is-active', item.getAttribute('href') === '#' + active));
    serviceGroups.forEach((group) => {
      const show = active === 'all' || group.id === active;
      group.classList.toggle('is-hidden', !show);
    });
    serviceCards.forEach((card) => {
      const show = active === 'all' || card.getAttribute('data-group') === active;
      card.classList.toggle('is-hidden', !show);
    });
  };
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setServiceFilter(button.getAttribute('data-filter')));
  });
  anchorFilters.forEach((link) => {
    link.addEventListener('click', (event) => {
      const filter = link.getAttribute('href').slice(1);
      event.preventDefault();
      setServiceFilter(filter);
      history.replaceState(null, '', '#' + filter);
      document.querySelector('.filter-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  if (serviceGroups.length && location.hash) {
    const hashFilter = location.hash.slice(1);
    if ([...serviceGroups].some((group) => group.id === hashFilter)) setServiceFilter(hashFilter);
  }

  const form = document.querySelector('[data-booking-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const service = String(data.get('service') || '').trim();
      const format = String(data.get('format') || '').trim();
      const comment = String(data.get('comment') || '').trim();
      if (!name || !phone || !service) {
        if (status) {
          status.textContent = 'Заполните имя, телефон и услугу. Если удобнее, можно просто позвонить: +7 903 452-51-51.';
          status.className = 'form-status is-error';
        }
        return;
      }
      const message = [
        'Здравствуйте, Антон. Хочу записаться на массаж.',
        'Имя: ' + name,
        'Телефон: ' + phone,
        'Услуга: ' + service,
        'Формат: ' + format,
        comment ? 'Комментарий: ' + comment : ''
      ].filter(Boolean).join('\n');
      if (status) {
        status.textContent = 'Открываю WhatsApp с готовым сообщением. Если окно не открылось, позвоните по телефону на странице.';
        status.className = 'form-status is-ok';
      }
      window.open('https://wa.me/79034525151?text=' + encodeURIComponent(message), '_blank', 'noopener');
    });
  }
})();
