/**
 * Hide My Tabs!
 * File: src/lib/tabManager.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Tab Manager - Handles all tab-related operations including
 * hiding, showing, and managing hidden tab state.
 */

import { StorageManager } from './storage.js';

export class TabManager {
  /**
   * Hide a single tab
   * @param {Object} tab - Tab object
   */
  static async hideTab(tab) {
    // Don't hide if already a placeholder or options page
    if (!tab.url || tab.url.includes('mask.html') || tab.url.includes('options.html')) {
      return;
    }

    // Save tab data
    await StorageManager.saveHiddenTab(tab.id, {
      url: tab.url,
      title: tab.title,
      icon: tab.favIconUrl
    });

    // Navigate to mask page
    const maskUrl = browser.runtime.getURL('mask/mask.html');
    await browser.tabs.update(tab.id, { url: maskUrl });

    // Update statistics
    const stats = await StorageManager.getStatistics();
    await StorageManager.updateStatistics({ totalHides: stats.totalHides + 1 });
  }

  /**
   * Hide multiple tabs
   * @param {Array} tabs - Array of tab objects
   */
  static async hideTabs(tabs) {
    for (const tab of tabs) {
      await this.hideTab(tab);
    }
  }

  /**
   * Hide all tabs except specified one(s)
   * @param {Object} activeTab - The tab to keep visible
   */
  static async hideOtherTabs(activeTab) {
    const tabs = await browser.tabs.query({ windowId: activeTab.windowId });
    
    for (const tab of tabs) {
      if (tab.id !== activeTab.id) {
        await this.hideTab(tab);
      }
    }
  }

  /**
   * Show/restore a single hidden tab
   * @param {number} tabId 
   */
  static async showTab(tabId) {
    const savedData = await StorageManager.getHiddenTab(tabId);
    
    if (!savedData) {
      return;
    }

    try {
      const tab = await browser.tabs.get(tabId);
      if (tab.url.includes('mask.html')) {
        await browser.tabs.update(tabId, { url: savedData.url });
      }
    } catch (error) {
      // Tab was closed
      console.log('Tab no longer exists:', tabId);
    }

    await StorageManager.removeHiddenTab(tabId);

    // Update statistics
    const stats = await StorageManager.getStatistics();
    await StorageManager.updateStatistics({ totalUnhides: stats.totalUnhides + 1 });
  }

  /**
   * Show all hidden tabs
   */
  static async showAllHiddenTabs() {
    const hiddenTabs = await StorageManager.getAllHiddenTabs();
    
    for (const tabId of Object.keys(hiddenTabs)) {
      await this.showTab(parseInt(tabId, 10));
    }
  }

  /**
   * Get highlighted (selected) tabs in a window
   * @param {number} windowId 
   * @returns {Promise<Array>}
   */
  static async getHighlightedTabs(windowId) {
    return await browser.tabs.query({ 
      highlighted: true, 
      windowId: windowId 
    });
  }
}