/**
 * Hide My Tabs!
 * File: src/options/options.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Options Page - Handles settings interface, statistics display,
 * and documentation for the extension.
 */

// Polyfill for Chrome/Edge
if (typeof browser === 'undefined') {
  var browser = chrome;
}

import { StorageManager } from '../lib/storage.js';
import { TabManager } from '../lib/tabManager.js';

class OptionsPage {
  constructor() {
    this.toast = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.initializeToast();
    await loadStatistics();
  }

  setupEventListeners() {
    document.getElementById('clearAllHidden').addEventListener('click', () => {
      this.clearAllHidden();
    });

    document.getElementById('clearAllHidden').addEventListener('click', () => {
      this.clearAllHidden();
    });

    document.getElementById('reset-stats')?.addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        await resetStatistics();
        await loadStatistics();
      }
    });
  }

  initializeToast() {
    const toastElement = document.getElementById('statusToast');
    this.toast = new bootstrap.Toast(toastElement);
  }

  async clearAllHidden() {
    if (!confirm('Are you sure you want to show all hidden tabs?')) {
      return;
    }

    await TabManager.showAllHiddenTabs();
    this.showToast('All hidden tabs restored!', 'success');
  }

  showToast(message, type = 'success') {
    const toastElement = document.getElementById('statusToast');
    const toastBody = toastElement.querySelector('.toast-body');
    const toastHeader = toastElement.querySelector('.toast-header');
    
    const iconMap = {
      success: 'check-circle-fill text-success',
      info: 'info-circle-fill text-info',
      warning: 'exclamation-triangle-fill text-warning',
      danger: 'x-circle-fill text-danger'
    };
    
    const icon = toastHeader.querySelector('i');
    icon.className = `bi ${iconMap[type] || iconMap.success} me-2`;
    
    toastBody.textContent = message;
    this.toast.show();
  }
}

async function loadStatistics() {
  const stats = await browser.storage.local.get('statistics');
  const statistics = stats.statistics || getDefaultStatistics();

  document.getElementById('stat-total-hides').textContent = statistics.totalHides || 0;
  document.getElementById('stat-sessions-saved').textContent = statistics.sessionsSaved || 0;
  document.getElementById('stat-total-unhides').textContent = statistics.totalUnhides || 0;
  
  const lastAction = statistics.lastAction ? new Date(statistics.lastAction).toLocaleString() : 'Never';
  document.getElementById('stat-last-action').textContent = lastAction;
  
  const installDate = statistics.installDate ? new Date(statistics.installDate).toLocaleDateString() : '-';
  document.getElementById('stat-install-date').textContent = installDate;
}

async function resetStatistics() {
  const defaultStats = getDefaultStatistics();
  await browser.storage.local.set({ statistics: defaultStats });
}

function getDefaultStatistics() {
  return {
    totalHides: 0,
    totalUnhides: 0,
    sessionsSaved: 0,
    lastAction: null,
    installDate: Date.now()
  };
}

// Initialize options page when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new OptionsPage());
} else {
  new OptionsPage();
}