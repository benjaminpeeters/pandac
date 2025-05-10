/**
 * Image functionality for Pandac
 * Handles image enhancement, lightbox, and viewing functionality
 */

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