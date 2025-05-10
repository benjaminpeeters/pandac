/**
 * Enhanced Markdown HTML Document Formatter
 * With image enhancement features, improved @ highlighting, and theme switching
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
  // Try to initialize twice with a delay to catch timing issues
  initializeDocument();

  // Second attempt after a delay to ensure everything is loaded
  setTimeout(initializeDocument, 500);

  // Initialize theme toggle
  initializeThemeToggle();
});

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
  enhanceImages(); // New function to enhance images
  
  // Handle window resizing
  window.addEventListener('resize', handleResize);
}

/**
 * Fix code blocks to ensure proper scrolling
 */
function fixCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach((block, index) => {
    // Skip if already processed
    if (block.hasAttribute('data-processed')) return;

    // Give block a unique ID
    const blockId = `code-block-${index}`;
    block.id = blockId;
    block.setAttribute('data-processed', 'true');

    // Force horizontal scrolling behavior
    block.style.overflowX = 'auto';
    block.style.whiteSpace = 'pre';
    block.style.maxWidth = '100%';

    // Ensure any code inside uses pre whitespace
    const codeElement = block.querySelector('code');
    if (codeElement) {
      codeElement.style.whiteSpace = 'pre';
    }

    // Create proper wrapper structure
    let wrapper;
    if (block.parentNode.classList.contains('code-block')) {
      wrapper = block.parentNode;
    } else {
      // Create new wrapper with background
      wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      // Replace block with wrapper and move block inside
      block.parentNode.insertBefore(wrapper, block);
      wrapper.appendChild(block);
    }

    // Check if we need to add our button (don't add if there's already one)
    if (!wrapper.querySelector('.copy-button') && typeof ClipboardJS !== 'undefined') {
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.setAttribute('data-clipboard-target', `#${blockId}`);
      button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      wrapper.appendChild(button);
    }
  });

  // Initialize clipboard functionality
  if (typeof ClipboardJS !== 'undefined') {
    const clipboard = new ClipboardJS('.copy-button');

    clipboard.on('success', function(e) {
      const button = e.trigger;

      // Show success state
      const originalHtml = button.innerHTML;
      button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      button.style.backgroundColor = '#e6f9e6';

      // Reset after delay
      setTimeout(function() {
        button.innerHTML = originalHtml;
        button.style.backgroundColor = '';
      }, 2000);

      e.clearSelection();
    });
  }
}

/**
 * Enhance images with viewing and copy functionality
 */
function enhanceImages() {
  // Find all images that haven't been processed yet
  const images = document.querySelectorAll('img:not([data-enhanced])');
  
  // Create lightbox container if it doesn't exist
  let lightbox = document.getElementById('image-lightbox');
  if (!lightbox) {
    lightbox = createLightbox();
    document.body.appendChild(lightbox);
  }
  
  // Process each image
  images.forEach((img, index) => {
    // Skip if already processed or if it's inside the lightbox
    if (img.hasAttribute('data-enhanced') || img.closest('#image-lightbox')) return;
    
    // Mark as processed
    img.setAttribute('data-enhanced', 'true');
    img.setAttribute('data-index', index);
    
    // Create container if image isn't already in one
    let container;
    if (img.parentNode.classList.contains('image-container')) {
      container = img.parentNode;
    } else {
      container = document.createElement('div');
      container.className = 'image-container';
      img.parentNode.insertBefore(container, img);
      container.appendChild(img);
    }
    
    // Add expand button
    const expandButton = document.createElement('button');
    expandButton.className = 'image-expand-button';
    expandButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
    expandButton.setAttribute('aria-label', 'Expand image');
    expandButton.setAttribute('title', 'Expand image');
    container.appendChild(expandButton);
    
    // Add click handler to both image and button
    function openImage() {
      showImage(img);
    }
    
    container.addEventListener('click', function(e) {
      // Only trigger if clicked on image or button
      if (e.target === img || e.target === expandButton || e.target.closest('.image-expand-button') === expandButton) {
        openImage();
      }
    });
  });
}

/**
 * Create lightbox element for displaying images
 */
function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'image-lightbox';
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'lightbox-content';
  lightbox.appendChild(content);
  
  // Add image element
  const img = document.createElement('img');
  img.className = 'lightbox-image';
  content.appendChild(img);
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '×';
  closeBtn.setAttribute('aria-label', 'Close');
  content.appendChild(closeBtn);
  
  // Create controls for desktop
  const controls = document.createElement('div');
  controls.className = 'lightbox-controls';
  content.appendChild(controls);
  
  // Add download button
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'lightbox-button download-button';
  downloadBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download';
  controls.appendChild(downloadBtn);
  
  // Add copy button
  const copyBtn = document.createElement('button');
  copyBtn.className = 'lightbox-button copy-image-button';
  copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
  controls.appendChild(copyBtn);
  
  // Add close handler
  lightbox.addEventListener('click', function(e) {
    // Close if clicking outside the image or explicitly on the close button
    if (e.target === lightbox || e.target === closeBtn) {
      hideLightbox();
    }
  });
  
  // Add keyboard handler for ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      hideLightbox();
    }
  });
  
  // Attach download handler
  downloadBtn.addEventListener('click', function() {
    const img = document.querySelector('.lightbox-image');
    if (img && img.src) {
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = img.src;
      a.download = getImageFilename(img.src);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
  
  // Attach copy handler
  copyBtn.addEventListener('click', function() {
    const img = document.querySelector('.lightbox-image');
    if (img && img.src) {
      copyImageToClipboard(img);
    }
  });
  
  return lightbox;
}

/**
 * Show image in lightbox
 */
function showImage(img) {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-image');
  
  // Set image source
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || 'Image';
  
  // Store original image reference for copy/download
  lightboxImg.setAttribute('data-original-src', img.src);
  
  // Show lightbox with a slight delay for smoother animation
  setTimeout(function() {
    lightbox.classList.add('active');
  }, 10);
  
  // Prevent scrolling on the body
  document.body.style.overflow = 'hidden';
}

/**
 * Hide lightbox
 */
function hideLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    
    // Re-enable scrolling
    document.body.style.overflow = '';
  }
}

/**
 * Copy image to clipboard
 */
function copyImageToClipboard(img) {
  const button = document.querySelector('.copy-image-button');
  const originalText = button.innerHTML;
  
  // Try to copy the image to clipboard
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Wait for the image to load
    if (img.complete) {
      performCopy();
    } else {
      img.onload = performCopy;
    }
    
    function performCopy() {
      // Set canvas dimensions to match the image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Draw the image to the canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert to blob and copy to clipboard
      canvas.toBlob(function(blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(function() {
          // Show success message
          button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
          
          // Reset button after delay
          setTimeout(function() {
            button.innerHTML = originalText;
          }, 2000);
        }).catch(function(err) {
          console.error('Failed to copy image: ', err);
          showFallbackCopy(img);
        });
      });
    }
  } catch (err) {
    console.error('Error in copy process: ', err);
    showFallbackCopy(img);
  }
}

/**
 * Fallback method for copying images on unsupported browsers
 */
function showFallbackCopy(img) {
  const button = document.querySelector('.copy-image-button');
  
  // Show alternative message
  button.innerHTML = 'Right-click to copy';
  button.style.width = 'auto';
  
  // Reset after a few seconds
  setTimeout(function() {
    button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
    button.style.width = '';
  }, 3000);
}

/**
 * Extract filename from image URL
 */
function getImageFilename(url) {
  // Extract filename from URL
  const parts = url.split('/');
  let filename = parts[parts.length - 1];
  
  // Remove query parameters if any
  filename = filename.split('?')[0];
  
  // Add .png extension if no extension exists
  if (!filename.includes('.')) {
    filename += '.png';
  }
  
  return filename;
}

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

/**
 * Fix equation display for better readability
 */
function fixEquationDisplay() {
  const mathElements = document.querySelectorAll('.math');
  const isMobile = window.innerWidth < 1024;
  
  mathElements.forEach(function(mathEl) {
    if (isMobile) {
      // Apply mobile-specific styling
      mathEl.style.fontSize = '9px'; // Reduced size for mobile
      mathEl.style.overflowX = 'auto';
      mathEl.style.whiteSpace = 'nowrap';
      mathEl.style.width = 'auto';
      mathEl.style.maxWidth = '100%';
      mathEl.style.display = 'block';
      mathEl.style.textAlign = 'left';
      mathEl.style.backgroundColor = '#f9f9f9';
      mathEl.style.padding = '8px 0';
      mathEl.style.borderRadius = '4px';
      mathEl.style.margin = '1em 0';
      
      // Find MathJax or KaTeX elements and fix them directly
      const mjx = mathEl.querySelectorAll('.MathJax, .MathJax_Display');
      const ktx = mathEl.querySelectorAll('.katex, .katex-display');
      
      if (mjx.length > 0) {
        mjx.forEach(function(el) {
          el.style.fontSize = '9px'; // Reduced size
          el.style.transform = 'scale(1)';
          el.style.margin = '0';
          el.style.padding = '0';
          el.style.maxWidth = 'none';
        });
      }
      
      if (ktx.length > 0) {
        ktx.forEach(function(el) {
          el.style.fontSize = '9px'; // Reduced size
          el.style.transform = 'scale(1)';
          el.style.maxWidth = 'none';
        });
      }
    } else {
      // Desktop styling
      mathEl.style.textAlign = 'center';
    }
  });
}

/**
 * Apply highlighting to special patterns in text
 * Updated to distinguish between @username and [@citation]
 */
function applyTextHighlighting() {
  const highlightPatterns = [
    { pattern: /\?question/ig, className: 'highlight-question' },
    { pattern: /\?q\b/ig, className: 'highlight-question' },
    { pattern: /\/!\\/ig, className: 'highlight-warning' },
    { pattern: /!TODO/ig, className: 'highlight-todo' },
    { 
      // Matches @username but not [@username] (citations)
      // This uses lookbehind to ensure there's no [ before the @
      pattern: /(?<!\[)@[a-z0-9_\-]+/gi, 
      className: 'highlight-contact' 
    }
  ];
  
  // Target only text-containing elements
  const selector = 'p, li, td, th, h1, h2, h3, h4, h5, h6, div:not(.layout-wrapper):not(.sidebar):not(.main-content):not(.mobile-toc):not(.mobile-toc-title)';
  
  document.querySelectorAll(selector).forEach(function(element) {
    // Skip if already processed
    if (element.hasAttribute('data-highlight-processed')) return;
    
    let html = element.innerHTML;
    let modified = false;
    
    // First check if the element contains both patterns
    const containsCitation = /\[@[^\]]+\]/g.test(html);
    const containsMention = /@[a-z0-9_\-]+/gi.test(html);
    
    if (containsCitation && containsMention) {
      // Use a more complex approach to handle both scenarios
      
      // 1. First save all citations to restore later
      const citations = [];
      html = html.replace(/\[@[^\]]+\]/g, function(match) {
        citations.push(match);
        return '[[CITATION_PLACEHOLDER_' + (citations.length - 1) + ']]';
      });
      
      // 2. Apply user mention highlighting
      html = html.replace(/@[a-z0-9_\-]+/gi, function(match) {
        modified = true;
        return '<span class="highlight-contact">' + match + '</span>';
      });
      
      // 3. Restore citations
      html = html.replace(/\[\[CITATION_PLACEHOLDER_(\d+)\]\]/g, function(match, index) {
        return citations[parseInt(index)];
      });
    } else {
      // Simple case - apply each pattern
      highlightPatterns.forEach(function({ pattern, className }) {
        if (pattern.test(html)) {
          // Reset pattern lastIndex
          pattern.lastIndex = 0;
          
          // Apply highlight
          html = html.replace(pattern, function(match) {
            modified = true;
            return '<span class="' + className + '">' + match + '</span>';
          });
        }
      });
    }
    
    if (modified) {
      element.innerHTML = html;
    }
    
    // Mark as processed
    element.setAttribute('data-highlight-processed', 'true');
  });
}

/**
 * Move metadata from header to footer
 */
function moveMetadataToFooter() {
  // Check if metadata already exists in footer to prevent duplication
  if (document.querySelector('.document-meta')) return;

  const header = document.querySelector('header');
  
  // Get author from header if available
  const author = header ? header.querySelector('.author') : null;
  
  // Use the current date formatted nicely
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Create footer metadata container
  const metaDiv = document.createElement('div');
  metaDiv.className = 'document-meta';
  
  // Add author if available
  if (author) {
    const authorP = document.createElement('p');
    authorP.className = 'author-info';
    const authorLabel = document.createElement('span');
    authorLabel.className = 'meta-label';
    authorLabel.textContent = 'Author:';
    authorP.appendChild(authorLabel);
    authorP.appendChild(document.createTextNode(' ' + author.textContent));
    metaDiv.appendChild(authorP);
  }
  
  // Always add current date
  const dateP = document.createElement('p');
  dateP.className = 'date-info';
  const dateLabel = document.createElement('span');
  dateLabel.className = 'meta-label';
  dateLabel.textContent = 'Date:';
  dateP.appendChild(dateLabel);
  dateP.appendChild(document.createTextNode(' ' + currentDate));
  metaDiv.appendChild(dateP);
  
  // Append to main content
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.appendChild(metaDiv);
  }
}



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
  }
}

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
