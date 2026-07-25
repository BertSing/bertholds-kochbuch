(() => {
  const cards = [...document.querySelectorAll('.recipe-card')];
  const search = document.querySelector('#search');
  const filters = [...document.querySelectorAll('.filter')];
  const categoryButtons = [...document.querySelectorAll('[data-filter].category-card')];
  const resultCount = document.querySelector('#resultCount');
  const emptyState = document.querySelector('#emptyState');
  let activeFilter = 'alle';

  const normalize = value => value.toLocaleLowerCase('de-DE').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function updateRecipes() {
    const term = normalize(search.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'alle' || card.dataset.category === activeFilter;
      const textMatch = !term || normalize(card.dataset.search).includes(term);
      const show = categoryMatch && textMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    resultCount.textContent = `${visible} ${visible === 1 ? 'Rezept' : 'Rezepte'}`;
    emptyState.hidden = visible !== 0;
  }

  function setFilter(filter) {
    activeFilter = filter;
    filters.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateRecipes();
    document.querySelector('#rezepte').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  search.addEventListener('input', updateRecipes);
  filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  categoryButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));

  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('#hauptnavigation');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });

  const themeToggle = document.querySelector('#themeToggle');
  const savedTheme = localStorage.getItem('bertholds-theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('bertholds-theme', next);
  });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
  updateRecipes();
})();
