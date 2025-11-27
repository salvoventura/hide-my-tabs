/**
 * Hide My Tabs!
 * File: src/background/contextMenu.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Context Menu Manager - Handles creation and interaction of
 * right-click context menu items for hiding/showing tabs.
 */

import { TabManager } from '../lib/tabManager.js';

export class ContextMenuManager {
  static MENU_IDS = {
    HIDE_CURRENT_PAGE: 'hide-current-page',
    HIDE_CURRENT_TAB: 'hide-current-tab-strip',
    HIDE_OTHERS_PAGE: 'hide-others-page',
    HIDE_OTHERS_TAB: 'hide-others-tab-strip',
    UNHIDE_ALL: 'unhide-all'
  };

  /**
   * Initialize context menus
   */
  static initialize() {
    // Universal contexts (Page) - Works in all browsers
    browser.contextMenus.create({
      id: this.MENU_IDS.HIDE_CURRENT_PAGE,
      title: 'Hide this tab',
      contexts: ['all']
    });

    browser.contextMenus.create({
      id: this.MENU_IDS.HIDE_OTHERS_PAGE,
      title: 'Hide other tabs',
      contexts: ['all']
    });

    browser.contextMenus.create({
      id: this.MENU_IDS.UNHIDE_ALL,
      title: 'Unhide all tabs',
      contexts: ['all']
    });

    // Tab strip contexts (Firefox only)
    try {
      browser.contextMenus.create({
        id: this.MENU_IDS.HIDE_CURRENT_TAB,
        title: 'Hide this tab',
        contexts: ['tab']
      });

      browser.contextMenus.create({
        id: this.MENU_IDS.HIDE_OTHERS_TAB,
        title: 'Hide other tabs',
        contexts: ['tab']
      });
    } catch (e) {
      // Tab context not supported in Chrome/Edge
    }
  }

  /**
   * Handle context menu clicks
   * @param {Object} info 
   * @param {Object} tab 
   */
  static async handleClick(info, tab) {
    try {
      const menuId = info.menuItemId;

      // Hide current tab(s)
      if (menuId === this.MENU_IDS.HIDE_CURRENT_PAGE || 
          menuId === this.MENU_IDS.HIDE_CURRENT_TAB) {
        await this.handleHideCurrent(tab);
      }
      // Hide other tabs
      else if (menuId === this.MENU_IDS.HIDE_OTHERS_PAGE || 
               menuId === this.MENU_IDS.HIDE_OTHERS_TAB) {
        await this.handleHideOthers(tab);
      }
      // Unhide all
      else if (menuId === this.MENU_IDS.UNHIDE_ALL) {
        await this.handleUnhideAll();
      }
    } catch (error) {
      console.error('Context menu action failed:', error);
    }
  }

  /**
   * Handle hide current tab(s) - supports multi-select
   * @param {Object} tab 
   */
  static async handleHideCurrent(tab) {
    const targetTab = tab || (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    
    if (!targetTab) return;

    // Check for multi-selection (Shift+Click or Ctrl+Click)
    const highlightedTabs = await TabManager.getHighlightedTabs(targetTab.windowId);
    
    if (highlightedTabs.length > 1) {
      // Hide all selected tabs
      await TabManager.hideTabs(highlightedTabs);
    } else {
      // Hide just the one tab
      await TabManager.hideTab(targetTab);
    }
  }

  /**
   * Handle hide other tabs
   * @param {Object} tab 
   */
  static async handleHideOthers(tab) {
    const targetTab = tab || (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    
    if (targetTab) {
      await TabManager.hideOtherTabs(targetTab);
    }
  }

  /**
   * Handle unhide all tabs
   */
  static async handleUnhideAll() {
    await TabManager.showAllHiddenTabs();
  }
}