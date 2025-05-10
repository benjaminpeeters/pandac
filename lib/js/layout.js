/**
 * Layout functionality for Pandac
 * Handles responsive layout, sidebar, and content organization
 */

/**
 * Set up mobile layout with inline TOC
 */
function setupMobileLayout() {
  const body = document.body;
  
  // If already in mobile layout, don't rebuild
  if (body.classList.contains('mobile-view')) return;
  
  // Mark as mobile
  body.classList.add('mobile-view');
  body.classList.remove('desktop-view', 'sidebar-hidden');
  
  // Clean up old layout elements
  cleanupLayoutElements();
  
  // Create main content container
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  
  // Get TOC if it exists anywhere in the document
  let toc = document.getElementById('TOC');
  let tocClone = null;
  
  if (toc) {
    // Clone TOC to preserve it
    tocClone = toc.cloneNode(true);
    
    // Remove original TOC from DOM to prevent conflicts
    if (toc.parentNode) {
      toc.parentNode.removeChild(toc);
    }
  }
  
  // Move all content to main content
  Array.from(body.children).forEach(child => {
    mainContent.appendChild(child);
  });
  
  // Find the first heading to insert TOC after
  const firstHeading = mainContent.querySelector('h1');
  
  // Create TOC container for mobile
  if (tocClone) {
    const mobileToc = document.createElement('div');
    mobileToc.className = 'mobile-toc';
    mobileToc.id = 'mobile-toc';
    
    const tocTitle = document.createElement('div');
    tocTitle.className = 'mobile-toc-title';
    tocTitle.textContent = 'Table of Contents';
    
    mobileToc.appendChild(tocTitle);
    mobileToc.appendChild(tocClone);
    
    // Insert TOC after first heading if found
    if (firstHeading) {
      firstHeading.insertAdjacentElement('afterend', mobileToc);
    } else {
      // Or at the beginning if no heading
      mainContent.insertBefore(mobileToc, mainContent.firstChild);
    }
  }
  
  // Create layout wrapper
  const layoutWrapper = document.createElement('div');
  layoutWrapper.className = 'layout-wrapper';
  
  // Replace body content
  body.innerHTML = '';
  layoutWrapper.appendChild(mainContent);
  body.appendChild(layoutWrapper);
  
  // Fix any code blocks that might have been added
  fixCodeBlocks();
  
  // Re-enhance images that might have been added/changed
  enhanceImages();
}

/**
 * Set up desktop layout with sidebar
 */
function setupDesktopLayout() {
  const body = document.body;
  
  // If already in desktop layout, don't rebuild
  if (body.classList.contains('desktop-view')) return;
  
  // Mark as desktop
  body.classList.add('desktop-view');
  body.classList.remove('mobile-view');
  
  // Clean up old layout elements
  cleanupLayoutElements();
  
  // Create sidebar and main content
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  
  // Find TOC - it could be in multiple places
  let toc = document.getElementById('TOC');
  let mobileToc = document.querySelector('#mobile-toc');
  let tocClone = null;
  
  // Check various locations for TOC
  if (toc) {
    tocClone = toc.cloneNode(true);
  } else if (mobileToc) {
    const mobileTocContent = mobileToc.querySelector('#TOC');
    if (mobileTocContent) {
      tocClone = mobileTocContent.cloneNode(true);
    }
  }
  
  // Move all content to main content
  Array.from(body.children).forEach(child => {
    if (child.id !== 'TOC' && 
        !child.classList.contains('mobile-toc') && 
        !child.classList.contains('sidebar') &&
        !child.id !== 'image-lightbox') {
      mainContent.appendChild(child);
    }
  });
  
  // Add TOC to sidebar
  if (tocClone) {
    sidebar.appendChild(tocClone);
  }
  
  // Create toggle button with improved icons
  const toggleButton = document.createElement('button');
  toggleButton.className = 'sidebar-toggle sidebar-visible';
  toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>';
  toggleButton.setAttribute('aria-label', 'Toggle table of contents');
  toggleButton.setAttribute('title', 'Toggle table of contents');

  // Add toggle functionality with enhanced animation
  toggleButton.addEventListener('click', function() {
    body.classList.toggle('sidebar-hidden');
    const isSidebarHidden = body.classList.contains('sidebar-hidden');

    // We don't need to manipulate padding directly, CSS handles it through the body:not(.sidebar-hidden) selector

    // Update button icon and position
    if (isSidebarHidden) {
      toggleButton.classList.remove('sidebar-visible');
      toggleButton.classList.add('sidebar-hidden');
      toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>';

      // Move button out of sidebar to fixed position
      document.body.appendChild(toggleButton);

      // Add ARIA attribute for accessibility
      toggleButton.setAttribute('aria-expanded', 'false');
    } else {
      toggleButton.classList.remove('sidebar-hidden');
      toggleButton.classList.add('sidebar-visible');
      toggleButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>';

      // Move button back to sidebar
      sidebar.appendChild(toggleButton);

      // Add ARIA attribute for accessibility
      toggleButton.setAttribute('aria-expanded', 'true');
    }

    // Add subtle animation effect to main content
    const mainContent = document.querySelector('.main-content');
    mainContent.style.transition = 'opacity 0.2s ease';
    mainContent.style.opacity = '0.9';
    setTimeout(() => {
      mainContent.style.opacity = '1';
    }, 200);
  });
  
  // Add button to sidebar initially
  sidebar.appendChild(toggleButton);
  
  // Create layout wrapper
  const layoutWrapper = document.createElement('div');
  layoutWrapper.className = 'layout-wrapper';
  
  // Add elements to layout
  layoutWrapper.appendChild(mainContent);
  layoutWrapper.appendChild(sidebar);
  
  // Replace body content
  body.innerHTML = '';
  body.appendChild(layoutWrapper);
  
  // Fix button position if sidebar should be hidden
  if (body.classList.contains('sidebar-hidden')) {
    toggleButton.click();
  }
  
  // Fix any code blocks that might have been added
  fixCodeBlocks();
  
  // Re-enhance images that might have been added/changed
  enhanceImages();
}

/**
 * Clean up existing layout elements to prevent duplication
 */
function cleanupLayoutElements() {
  // Remove existing layout wrapper
  const oldWrapper = document.querySelector('.layout-wrapper');
  if (oldWrapper && oldWrapper.parentNode) {
    // Move children back to body first
    while (oldWrapper.firstChild) {
      document.body.appendChild(oldWrapper.firstChild);
    }
    oldWrapper.parentNode.removeChild(oldWrapper);
  }
  
  // Remove existing sidebar toggle
  const oldToggle = document.querySelector('.sidebar-toggle');
  if (oldToggle && oldToggle.parentNode) {
    oldToggle.parentNode.removeChild(oldToggle);
  }
}