/**
 * Code block functionality for Pandac
 * Handles code formatting, scrolling, and copy buttons
 */

/**
 * Fix code blocks to ensure proper scrolling and add copy functionality
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