const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Kotlin: '#F18E33',
  Swift: '#ffac45',
};

const CARD_ANIMATION_DELAY_MS = 60;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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

  const container = document.getElementById('github-projects');
  if (!container) return;

  fetch('https://api.github.com/users/yoenneugene/repos?sort=updated&per_page=9')
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-400 py-10">Aucun repository trouvé.</p>';
        return;
      }

      const locale = navigator.language || 'fr-FR';

      data.forEach((repo, i) => {
        const langColor = repo.language ? (LANG_COLORS[repo.language] || '#8b949e') : null;
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        const updatedAt = new Date(repo.updated_at).toLocaleDateString(locale, { year: 'numeric', month: 'short' });

        const card = document.createElement('div');
        card.className = 'repo-card card-hover bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex flex-col';
        card.style.animationDelay = `${i * CARD_ANIMATION_DELAY_MS}ms`;

        // Build description node safely to avoid XSS
        const descText = repo.description ? escapeHtml(repo.description) : '<span class="italic">Pas de description</span>';

        const langBadge = langColor
          ? `<span class="flex items-center gap-1"><span style="background:${escapeHtml(langColor)}" class="w-3 h-3 rounded-full inline-block"></span>${escapeHtml(repo.language)}</span>`
          : '';

        card.innerHTML = `
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="font-semibold text-base truncate">${escapeHtml(repo.name)}</h4>
            <svg class="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed mb-4">${descText}</p>
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-3">
              ${langBadge}
              ${stars > 0 ? `<span class="flex items-center gap-1">⭐ ${stars}</span>` : ''}
              ${forks > 0 ? `<span class="flex items-center gap-1">🍴 ${forks}</span>` : ''}
            </div>
            <span>${escapeHtml(updatedAt)}</span>
          </div>
          <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer"
            class="mt-4 block text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg py-2 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950">
            Voir sur GitHub →
          </a>
        `;
        container.appendChild(card);
      });
    })
    .catch(() => {
      if (container) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-400 py-10">Impossible de charger les repositories.</p>';
      }
    });
});
