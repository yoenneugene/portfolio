document.getElementById('dark-toggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }

  // GitHub API fetch
  fetch('https://api.github.com/users/yoenneugene/repos')
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById('github-projects');
      data.slice(0, 5).forEach((repo) => {
        const div = document.createElement('div');
        div.className = 'bg-gray-100 dark:bg-gray-700 p-4 rounded shadow';
        div.innerHTML = `<h4 class='font-bold'>${repo.name}</h4><p>${
          repo.description || 'Pas de description'
        }</p><a href='${
          repo.html_url
        }' class='text-blue-400 underline'>Voir sur GitHub</a>`;
        container.appendChild(div);
      });
    });
});
