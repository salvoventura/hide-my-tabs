/**
 * Hide My Tabs!
 * File: src/content/content.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Content Script - Runs on web pages to handle messaging
 * between page context and extension background.
 */

(function() {
  'use strict';

  /**
   * Message Handler for Content Script
   * Handles communication between content script and background
   */
  class MessageHandler {
    /**
     * Initialize message listener
     */
    static initialize() {
      browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleMessage(message, sender, sendResponse);
        return true; // Keep channel open for async
      });
    }

    /**
     * Handle incoming messages
     * @param {Object} message 
     * @param {Object} sender 
     * @param {Function} sendResponse 
     */
    static handleMessage(message, sender, sendResponse) {
      switch (message.action) {
        case 'checkHiddenStatus':
          sendResponse({ status: 'ready' });
          break;
        
        case 'prepareForHiding':
          this.preparePageForHiding();
          sendResponse({ success: true });
          break;
        
        default:
          sendResponse({ error: 'Unknown action' });
      }
    }

    /**
     * Prepare page for hiding (future enhancement)
     */
    static preparePageForHiding() {
      // Future: Save scroll position, form data, etc.
    }
  }

  // Initialize content script
  MessageHandler.initialize();
})();