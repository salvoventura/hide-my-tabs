/**
 * Mask Page Script
 * Runs on the hidden tab mask page
 */

(function() {
  'use strict';

  class MaskPage {
    constructor() {
      this.init();
    }

    init() {
      this.preventNavigation();
      this.setupMessageListener();
    }

    /**
     * Prevent accidental navigation away from mask
     */
    preventNavigation() {
      // Future: Add confirmation if user tries to navigate
    }

    /**
     * Listen for messages from background
     */
    setupMessageListener() {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'updateMaskStyle') {
          this.updateStyle(message.style);
          sendResponse({ success: true });
        }
      });
    }

    /**
     * Update mask page style (future enhancement)
     * @param {string} style 
     */
    updateStyle(style) {
      // Future: Switch between different mask styles
      // newTab, blank, custom, etc.
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MaskPage());
  } else {
    new MaskPage();
  }
})();