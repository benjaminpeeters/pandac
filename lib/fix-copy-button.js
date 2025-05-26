/**
 * This script fixes the copy button issue by removing all existing buttons
 * and adding a new single copy button to each code block.
 */

(function() {
  // Run immediately, then again after a delay to catch any buttons added by other scripts
  fixCopyButtons();
  setTimeout(fixCopyButtons, 500);

  function fixCopyButtons() {
    // First, remove all buttons from the document
    document.querySelectorAll('button').forEach(button => {
      // Keep only our necessary buttons
      if (!button.classList.contains('theme-toggle') && 
          !button.classList.contains('sidebar-toggle') &&
          !button.classList.contains('image-expand-button') &&
          !button.classList.contains('lightbox-button') &&
          !button.classList.contains('lightbox-close')) {
        button.remove();
      }
    });

    // Find all code blocks
    document.querySelectorAll('pre').forEach((pre, index) => {
      // Skip if already processed
      if (pre.hasAttribute('data-copy-fixed')) return;
      
      // Give each pre element a unique ID
      const preId = `code-block-${index}`;
      pre.id = preId;
      pre.setAttribute('data-copy-fixed', 'true');

      // Create a wrapper div if not already wrapped
      let wrapper;
      if (pre.parentNode.classList.contains('code-block')) {
        wrapper = pre.parentNode;
      } else {
        wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      // Add our custom copy button
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.setAttribute('data-clipboard-target', `#${preId}`);
      button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      wrapper.appendChild(button);
    });

    // Initialize clipboard functionality
    if (typeof ClipboardJS !== 'undefined') {
      // Clean up any previous instances
      if (window._clipboardInstance) {
        window._clipboardInstance.destroy();
      }
      
      // Create new clipboard instance
      window._clipboardInstance = new ClipboardJS('.copy-button');
      
      window._clipboardInstance.on('success', function(e) {
        const button = e.trigger;
        const originalHtml = button.innerHTML;
        
        // Show success state with checkmark
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

  // Monitor DOM changes and fix any new code blocks
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let needsFix = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) { // Element node
              if (node.nodeName === 'BUTTON' || 
                  node.nodeName === 'PRE' || 
                  node.querySelector('button') || 
                  node.querySelector('pre')) {
                needsFix = true;
                break;
              }
            }
          }
        }
      });
      
      if (needsFix) {
        fixCopyButtons();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();