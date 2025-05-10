/**
 * Content enhancement functionality for Pandac
 * Handles metadata, equations, and text highlighting
 */

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