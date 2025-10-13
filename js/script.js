const container = document.getElementById('book-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const themeToggle = document.getElementById('theme-toggle');

const ITEMS_PER_PAGE = 10;
let currentPage = parseInt(localStorage.getItem('page')) || 1;

function renderPage(page) {
  container.innerHTML = '';
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = BOOK_TEXT.slice(start, end);

  pageItems.forEach(item => {
    const block = document.createElement('div');
    block.classList.add('sentence');
    block.innerHTML = `
      <p>${item.en}</p>
      <p class="translation">${item.uk}</p>
    `;
    block.addEventListener('click', () => {
      const t = block.querySelector('.translation');
      t.style.display = t.style.display === 'block' ? 'none' : 'block';
    });
    container.appendChild(block);
  });

  pageInfo.textContent = `Сторінка ${page} з ${Math.ceil(BOOK_TEXT.length / ITEMS_PER_PAGE)}`;
  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === Math.ceil(BOOK_TEXT.length / ITEMS_PER_PAGE);

  localStorage.setItem('page', page);
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < Math.ceil(BOOK_TEXT.length / ITEMS_PER_PAGE)) {
    currentPage++;
    renderPage(currentPage);
  }
});

// 🌙 Тема
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️ Світла тема' : '🌙 Темна тема';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Завантаження теми при запуску
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️ Світла тема';
}

renderPage(currentPage);
