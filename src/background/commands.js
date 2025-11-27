/**
 * Command Manager
 * Handles keyboard shortcuts and toolbar button actions
 */

import { TabManager } from '../lib/tabManager.js';

export class CommandManager {
  static COMMANDS = {
    TOGGLE_HIDDEN: 'toggle-hidden'
  };

  /**
   * Handle keyboard command
   * @param {string} command 
   */
  static async handleCommand(command) {
    switch (command) {
      case this.COMMANDS.TOGGLE_HIDDEN:
        await this.toggleAllHidden();
        break;
    }
  }

  /**
   * Handle toolbar button click
   */
  static async handleToolbarClick() {
    await this.toggleAllHidden();
  }

  /**
   * Toggle all hidden tabs
   * If any tabs are hidden, show them all
   * If no tabs are hidden, hide all except active
   */
  static async toggleAllHidden() {
    const hiddenTabIds = await TabManager.getHiddenTabIdsInWindow();
    
    if (hiddenTabIds.length > 0) {
      // Show all hidden tabs
      await TabManager.showAllHiddenTabs();
    } else {
      // Hide all tabs except active one
      const [activeTab] = await browser.tabs.query({ 
        active: true, 
        currentWindow: true 
      });
      
      if (activeTab) {
        await TabManager.hideOtherTabs([activeTab.id]);
      }
    }
  }

  /**
   * Future: Handle custom commands
   * @param {string} commandName 
   * @param {Object} params 
   */
  static async handleCustomCommand(commandName, params) {
    // Extensible for future custom commands
  }
}