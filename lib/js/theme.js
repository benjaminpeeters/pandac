/**
 * Theme functionality for Pandac
 * Handles dark/light mode toggling and theme persistence
 */

/**
 * Initialize theme toggle button
 */
function initializeThemeToggle() {
  // Check if a theme toggle already exists
  if (document.querySelector('.theme-toggle')) return;
  
  // Create the theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
  themeToggle.setAttribute('title', 'Toggle dark/light mode');
  
  // Set initial icon based on system preference or stored preference
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('pandac-theme');
  const isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDarkMode);
  
  // Apply initial theme
  if (isDarkMode) {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    themeToggle.innerHTML = '☀️'; // Sun for dark mode
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    themeToggle.innerHTML = '🌒'; // Moon for light mode
  }
  
  // Add click handler
  themeToggle.addEventListener('click', toggleTheme);
  
  // Add to document
  document.body.appendChild(themeToggle);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (body.classList.contains('dark-theme')) {
    // Switch to light theme
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeToggle.innerHTML = '🌒'; // Moon
    localStorage.setItem('pandac-theme', 'light');
  } else {
    // Switch to dark theme
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeToggle.innerHTML = '☀️'; // Sun
    localStorage.setItem('pandac-theme', 'dark');
  }
  
  // Add subtle animation effect
  themeToggle.style.transform = 'scale(1.2)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1)';
  }, 200);
}