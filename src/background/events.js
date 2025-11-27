/**
 * Hide My Tabs!
 * File: src/background/events.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Event Manager - Coordinates browser events and manages
 * communication between different extension components.
 */

import { TabManager } from '../lib/tabManager.js';
import { StorageManager } from '../lib/storage.js';
import { ContextMenuManager } from './contextMenu.js';

export class EventManager {
  /**
   * Initialize all event listeners
   */
  static initialize() {
    this.setupInstallListener();
    this.setupContextMenuListener();
    this.setupTabListeners();
    this.setupMessageListener();
  }

  /**
   * Handle extension installation
   */
  static setupInstallListener() {
    browser.runtime.onInstalled.addListener(() => {
      ContextMenuManager.initialize();
    });
  }

  /**
   * Handle context menu clicks
   */
  static setupContextMenuListener() {
    browser.contextMenus.onClicked.addListener(async (info, tab) => {
      await ContextMenuManager.handleClick(info, tab);
    });
  }

  /**
   * Handle tab events
   */
  static setupTabListeners() {
    // Clean up closed tabs
    browser.tabs.onRemoved.addListener(async (tabId) => {
      const hiddenTab = await StorageManager.getHiddenTab(tabId);
      if (hiddenTab) {
        await StorageManager.removeHiddenTab(tabId);
      }
    });

    // Future: Handle tab updates, activations, etc.
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      // Future: Update badge, check for restoration, etc.
    });

    browser.tabs.onActivated.addListener(async (activeInfo) => {
      // Future: Update UI based on active tab state
    });
  }

  /**
   * Handle messages from content scripts or popup
   */
  static setupMessageListener() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep channel open for async response
    });
  }

  /**
   * Handle incoming messages
   * @param {Object} message 
   * @param {Object} sender 
   * @param {Function} sendResponse 
   */
  static async handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'getHiddenStatus':
        const hiddenTabs = await StorageManager.getAllHiddenTabs();
        sendResponse({ hiddenTabs });
        break;
      
      case 'hideTab':
        if (message.tab) {
          await TabManager.hideTab(message.tab);
        } else if (message.tabId) {
          const tab = await browser.tabs.get(message.tabId);
          await TabManager.hideTab(tab);
        }
        sendResponse({ success: true });
        break;
      
      case 'showTab':
        await TabManager.showTab(message.tabId);
        sendResponse({ success: true });
        break;
      
      case 'unhideAll':
        await TabManager.showAllHiddenTabs();
        sendResponse({ success: true });
        break;
      
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }
}