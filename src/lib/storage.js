/**
 * Hide My Tabs!
 * File: src/lib/storage.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Storage Manager - Handles all storage operations for hidden tabs
 */

export class StorageManager {
  /**
   * Save hidden tab data
   * @param {number} tabId 
   * @param {Object} tabData - { url, title, icon }
   */
  static async saveHiddenTab(tabId, tabData) {
    const storageKey = `hidden_tab_${tabId}`;
    const data = {
      [storageKey]: {
        url: tabData.url,
        title: tabData.title,
        icon: tabData.icon
      }
    };
    await browser.storage.local.set(data);
  }

  /**
   * Get hidden tab data
   * @param {number} tabId 
   * @returns {Promise<Object|null>}
   */
  static async getHiddenTab(tabId) {
    const storageKey = `hidden_tab_${tabId}`;
    const result = await browser.storage.local.get(storageKey);
    return result[storageKey] || null;
  }

  /**
   * Remove hidden tab data
   * @param {number} tabId 
   */
  static async removeHiddenTab(tabId) {
    const storageKey = `hidden_tab_${tabId}`;
    await browser.storage.local.remove(storageKey);
  }

  /**
   * Get all hidden tabs
   * @returns {Promise<Object>} Object with tabId keys
   */
  static async getAllHiddenTabs() {
    const storage = await browser.storage.local.get(null);
    const hiddenTabs = {};
    
    for (const key of Object.keys(storage)) {
      if (key.startsWith('hidden_tab_')) {
        const tabId = parseInt(key.replace('hidden_tab_', ''), 10);
        hiddenTabs[tabId] = storage[key];
      }
    }
    
    return hiddenTabs;
  }

  /**
   * Clear all hidden tabs
   */
  static async clearAllHiddenTabs() {
    const storage = await browser.storage.local.get(null);
    const keys = Object.keys(storage).filter(k => k.startsWith('hidden_tab_'));
    await browser.storage.local.remove(keys);
  }

  /**
   * Get settings
   * @returns {Promise<Object>}
   */
  static async getSettings() {
    const result = await browser.storage.local.get('settings');
    return result.settings || this.getDefaultSettings();
  }

  /**
   * Save settings
   * @param {Object} settings 
   */
  static async saveSettings(settings) {
    await browser.storage.local.set({ settings });
  }

  /**
   * Get default settings
   * @returns {Object}
   */
  static getDefaultSettings() {
    return {
      clearOnClose: false
    };
  }

  /**
   * Get statistics
   * @returns {Promise<Object>}
   */
  static async getStatistics() {
    const result = await browser.storage.local.get('statistics');
    return result.statistics || this.getDefaultStatistics();
  }

  /**
   * Update statistics
   * @param {Object} updates - Partial statistics object
   */
  static async updateStatistics(updates) {
    const stats = await this.getStatistics();
    const updated = { ...stats, ...updates, lastAction: Date.now() };
    await browser.storage.local.set({ statistics: updated });
  }

  /**
   * Get default statistics
   * @returns {Object}
   */
  static getDefaultStatistics() {
    return {
      totalHides: 0,
      totalUnhides: 0,
      sessionsSaved: 0,
      lastAction: null,
      installDate: Date.now()
    };
  }
}