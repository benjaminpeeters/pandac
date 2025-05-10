/**
 * Pandac Main JavaScript File
 * Entry point that imports and initializes all modules
 */

/**
 * Main initialization function
 */
function initializeDocument() {
  // First fix code blocks since they're independent of layout
  fixCodeBlocks();

  // Set up the appropriate layout
  if (window.innerWidth < 1024) {
    setupMobileLayout();
  } else {
    setupDesktopLayout();
  }

  // These functions work on the layout after it's established
  moveMetadataToFooter();
  fixEquationDisplay();
  applyTextHighlighting();
  enhanceImages(); // Function to enhance images

  // Remove any duplicate buttons - this is a final cleanup
  removeDuplicateButtons();
}

/**
 * Remove any duplicate buttons that might have been added
 */
function removeDuplicateButtons() {
  // Find all code blocks
  const codeBlocks = document.querySelectorAll('.code-block, pre');

  codeBlocks.forEach(block => {
    // Get all buttons within this block
    const buttons = block.querySelectorAll('button');

    // If more than one button, keep only the first one with SVG
    if (buttons.length > 1) {
      let svgButtonFound = false;

      buttons.forEach(button => {
        // Skip sidebar and theme toggles
        if (button.classList.contains('sidebar-toggle') ||
            button.classList.contains('theme-toggle')) {
          return;
        }

        // If we already found an SVG button and this is another button, remove it
        if (svgButtonFound && button.parentNode) {
          button.parentNode.removeChild(button);
        }

        // If this button has SVG and we haven't found one yet, keep it
        if (!svgButtonFound && button.querySelector('svg')) {
          svgButtonFound = true;
        } else if (button.parentNode) {
          // Otherwise, remove the button
          button.parentNode.removeChild(button);
        }
      });
    }
  });

  // Make sure sidebar toggle is displayed in desktop mode
  if (window.innerWidth >= 1024) {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    // If we have a sidebar but no toggle, create one
    if (sidebar && !sidebarToggle) {
      const toggleButton = document.createElement('button');
      toggleButton.className = 'sidebar-toggle sidebar-visible';
      toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>';
      toggleButton.setAttribute('aria-label', 'Toggle table of contents');
      toggleButton.setAttribute('title', 'Toggle table of contents');

      // Add click handler
      toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-hidden');
        const isSidebarHidden = document.body.classList.contains('sidebar-hidden');

        if (isSidebarHidden) {
          toggleButton.classList.remove('sidebar-visible');
          toggleButton.classList.add('sidebar-hidden');
          toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>';
          document.body.appendChild(toggleButton);
        } else {
          toggleButton.classList.remove('sidebar-hidden');
          toggleButton.classList.add('sidebar-visible');
          toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>';
          sidebar.appendChild(toggleButton);
        }
      });

      sidebar.appendChild(toggleButton);
    }
  }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
  // Try to initialize twice with a delay to catch timing issues
  initializeDocument();

  // Second attempt after a delay to ensure everything is loaded
  setTimeout(initializeDocument, 500);

  // Initialize theme toggle
  initializeThemeToggle();

  // Final cleanup after everything else has loaded
  setTimeout(removeDuplicateButtons, 1000);
});

/**
 * Handle window resize events
 */
function handleResize() {
  const isMobile = window.innerWidth < 1024;
  const isMobileView = document.body.classList.contains('mobile-view');

  // Only change layout if crossing the breakpoint
  if (isMobile !== isMobileView) {
    if (isMobile) {
      setupMobileLayout();
    } else {
      setupDesktopLayout();
    }

    // Fix equations and code blocks after layout change
    fixEquationDisplay();
    fixCodeBlocks();
    enhanceImages();
    removeDuplicateButtons();
  }
}

// Set up window resize handler
window.addEventListener('resize', handleResize);