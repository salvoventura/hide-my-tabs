/**
 * Hide My Tabs!
 * File: src/popup/popup.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Popup Manager - Main interface for hiding/showing tabs,
 * managing sessions, and selecting multiple tabs.
 */

// Polyfill for Chrome/Edge
if (typeof browser === 'undefined') {
  var browser = chrome;
}

class PopupManager {
  constructor() {
    this.currentTab = null;
    this.currentTabState = 'visible'; // 'visible' or 'hidden'
    this.allTabs = [];
    this.selectedTabIds = new Set();
    this.selectedTabsState = 'visible'; // 'visible' or 'hidden'
    this.hiddenTabIds = new Set();
    this.sessions = [];
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.render();
  }

  async loadData() {
    // Get current active tab
    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
    this.currentTab = activeTab;
    
    // Determine current tab state
    if (activeTab && activeTab.url.includes('mask/mask.html')) {
      this.currentTabState = 'hidden';
    } else {
      this.currentTabState = 'visible';
    }
    
    // Load all tabs in current window
    this.allTabs = await browser.tabs.query({ currentWindow: true });
    
    // Load hidden tabs
    const storage = await browser.storage.local.get(null);
    this.hiddenTabIds.clear();
    for (const key of Object.keys(storage)) {
      if (key.startsWith('hidden_tab_')) {
        const tabId = parseInt(key.replace('hidden_tab_', ''), 10);
        this.hiddenTabIds.add(tabId);
      }
    }

    // Determine selected tabs state
    this.updateSelectedTabsState();

    // Load saved sessions
    const result = await browser.storage.local.get('saved_sessions');
    this.sessions = result.saved_sessions || [];
  }

  updateSelectedTabsState() {
    if (this.selectedTabIds.size === 0) {
      this.selectedTabsState = 'visible';
      return;
    }

    // Check if all selected tabs are hidden
    let allHidden = true;
    let anyHidden = false;
    
    for (const tabId of this.selectedTabIds) {
      if (this.hiddenTabIds.has(tabId)) {
        anyHidden = true;
      } else {
        allHidden = false;
      }
    }

    // If all selected are hidden, state is 'hidden', otherwise 'visible'
    this.selectedTabsState = allHidden ? 'hidden' : 'visible';
  }

  setupEventListeners() {
    // Current tab toggle
    document.getElementById('toggleCurrentTab').addEventListener('click', () => this.toggleCurrentTab());

    // Session actions
    document.getElementById('toggleSelected').addEventListener('click', () => this.toggleSelectedTabs());
    document.getElementById('unhideAll').addEventListener('click', () => this.unhideAllTabs());
    document.getElementById('saveSession').addEventListener('click', () => this.showSaveModal());

    // Selection tools
    document.getElementById('selectAll').addEventListener('click', () => this.selectAllTabs());
    document.getElementById('selectNone').addEventListener('click', () => this.deselectAllTabs());
    document.getElementById('invertSelection').addEventListener('click', () => this.invertSelection());

    // Save session
    document.getElementById('confirmSave').addEventListener('click', () => this.saveSession());
    document.getElementById('sessionName').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveSession();
    });

    // Options
    document.getElementById('openOptions').addEventListener('click', () => this.openOptions());
  }

  render() {
    this.renderCurrentTab();
    this.renderToggleButton();
    this.renderSessions();
    this.renderTabs();
  }

  renderToggleButton() {
    const button = document.getElementById('toggleSelected');
    const buttonText = document.getElementById('toggleSelectedText');
    
    if (this.selectedTabIds.size === 0) {
      button.disabled = true;
      button.className = 'btn btn-sm btn-secondary w-100 mb-2';
      buttonText.innerHTML = '<i class="bi bi-eye-slash-fill me-2"></i>Hide Selected';
      return;
    }

    button.disabled = false;
    
    if (this.selectedTabsState === 'hidden') {
      button.className = 'btn btn-sm btn-success w-100 mb-2';
      buttonText.innerHTML = '<i class="bi bi-eye-fill me-2"></i>Show Selected';
    } else {
      button.className = 'btn btn-sm btn-primary w-100 mb-2';
      buttonText.innerHTML = '<i class="bi bi-eye-slash-fill me-2"></i>Hide Selected';
    }
  }

  renderCurrentTab() {
    const container = document.getElementById('currentTabInfo');
    const button = document.getElementById('toggleCurrentTab');
    const buttonText = document.getElementById('currentTabButtonText');
    
    if (!this.currentTab) {
      container.innerHTML = '<div class="text-muted text-center py-2 small">No active tab</div>';
      return;
    }
    
    // Update button based on state
    if (this.currentTabState === 'hidden') {
      button.className = 'btn btn-sm btn-success w-100';
      buttonText.innerHTML = '<i class="bi bi-eye-fill me-2"></i>Show This Tab';
    } else {
      button.className = 'btn btn-sm btn-primary w-100';
      buttonText.innerHTML = '<i class="bi bi-eye-slash-fill me-2"></i>Hide This Tab';
    }

    // Render current tab info
    const card = document.createElement('div');
    card.className = 'current-tab-card';

    const favicon = document.createElement('img');
    favicon.className = 'current-tab-favicon';
    if (this.currentTab.favIconUrl) {
      favicon.src = this.currentTab.favIconUrl;
      favicon.onerror = () => {
        favicon.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'current-tab-favicon placeholder';
        placeholder.innerHTML = '<i class="bi bi-file-earmark"></i>';
        card.insertBefore(placeholder, card.firstChild);
      };
    } else {
      favicon.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.className = 'current-tab-favicon placeholder';
      placeholder.innerHTML = '<i class="bi bi-file-earmark"></i>';
      card.appendChild(placeholder);
    }

    const details = document.createElement('div');
    details.className = 'current-tab-details';

    const title = document.createElement('div');
    title.className = 'current-tab-title';
    title.textContent = this.currentTab.title || 'Untitled';

    const url = document.createElement('div');
    url.className = 'current-tab-url';
    try {
      const urlObj = new URL(this.currentTab.url);
      url.textContent = urlObj.hostname || this.currentTab.url;
    } catch {
      url.textContent = this.currentTab.url;
    }

    details.appendChild(title);
    details.appendChild(url);

    const status = document.createElement('div');
    status.className = 'current-tab-status';
    if (this.currentTabState === 'hidden') {
      status.innerHTML = '<span class="badge bg-warning">Hidden</span>';
    }

    if (this.currentTab.favIconUrl) card.appendChild(favicon);
    card.appendChild(details);
    card.appendChild(status);

    container.innerHTML = '';
    container.appendChild(card);
  }

  renderSessions() {
    const sessionsList = document.getElementById('sessionsList');
    
    if (this.sessions.length === 0) {
      sessionsList.innerHTML = '<div class="text-muted text-center py-2 small">No saved sessions</div>';
      return;
    }

    sessionsList.innerHTML = '';
    
    this.sessions.forEach((session, index) => {
      const item = document.createElement('div');
      item.className = 'session-item';

      const info = document.createElement('div');
      info.className = 'session-item-info';

      const name = document.createElement('div');
      name.className = 'session-item-name';
      name.textContent = session.name;

      const count = document.createElement('div');
      count.className = 'session-item-count';
      count.textContent = `${session.tabIds.length} tab${session.tabIds.length !== 1 ? 's' : ''}`;

      info.appendChild(name);
      info.appendChild(count);

      const actions = document.createElement('div');
      actions.className = 'session-item-actions';

      const loadBtn = document.createElement('button');
      loadBtn.className = 'btn btn-sm btn-outline-primary';
      loadBtn.innerHTML = '<i class="bi bi-check-square"></i>';
      loadBtn.title = 'Load session';
      loadBtn.onclick = (e) => {
        e.stopPropagation();
        this.loadSession(index);
      };

      const hideBtn = document.createElement('button');
      hideBtn.className = 'btn btn-sm btn-outline-secondary';
      hideBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
      hideBtn.title = 'Hide tabs';
      hideBtn.onclick = (e) => {
        e.stopPropagation();
        this.hideSessionTabs(index);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-outline-danger';
      deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
      deleteBtn.title = 'Delete';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        this.deleteSession(index);
      };

      actions.appendChild(loadBtn);
      actions.appendChild(hideBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(actions);

      item.addEventListener('click', () => this.loadSession(index));

      sessionsList.appendChild(item);
    });
  }

  renderTabs() {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = '';

    this.allTabs.forEach(tab => {
      // Skip current tab (already shown above)
      if (tab.id === this.currentTab?.id) return;

      const tabIsHidden = this.hiddenTabIds.has(tab.id);
      const isSelected = this.selectedTabIds.has(tab.id);
      
      const tabItem = document.createElement('div');
      tabItem.className = `tab-item ${isSelected ? 'selected' : ''} ${tabIsHidden ? 'hidden' : ''}`;
      tabItem.dataset.tabId = tab.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-check-input tab-checkbox';
      checkbox.checked = isSelected;
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        this.toggleTabSelection(tab.id);
      });

      const favicon = document.createElement('img');
      favicon.className = 'tab-favicon';
      if (tab.favIconUrl) {
        favicon.src = tab.favIconUrl;
        favicon.onerror = () => {
          favicon.style.display = 'none';
          const placeholder = document.createElement('div');
          placeholder.className = 'tab-favicon placeholder';
          placeholder.innerHTML = '<i class="bi bi-file-earmark"></i>';
          favicon.parentNode.insertBefore(placeholder, favicon);
        };
      } else {
        favicon.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'tab-favicon placeholder';
        placeholder.innerHTML = '<i class="bi bi-file-earmark"></i>';
        tabItem.appendChild(placeholder);
      }

      const tabInfo = document.createElement('div');
      tabInfo.className = 'tab-info';

      const title = document.createElement('div');
      title.className = 'tab-title';
      title.textContent = tab.title || 'Untitled';

      const url = document.createElement('div');
      url.className = 'tab-url';
      try {
        const urlObj = new URL(tab.url);
        url.textContent = urlObj.hostname || tab.url;
      } catch {
        url.textContent = tab.url;
      }

      tabInfo.appendChild(title);
      tabInfo.appendChild(url);

      const statusBadge = document.createElement('div');
      statusBadge.className = 'tab-status';
      if (tabIsHidden) {
        statusBadge.innerHTML = '<span class="badge bg-warning">Hidden</span>';
      }

      tabItem.appendChild(checkbox);
      if (tab.favIconUrl) tabItem.appendChild(favicon);
      tabItem.appendChild(tabInfo);
      tabItem.appendChild(statusBadge);

      tabItem.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          this.toggleTabSelection(tab.id);
        }
      });

      tabsList.appendChild(tabItem);
    });
  }

  async toggleCurrentTab() {
    if (!this.currentTab) return;

    // Update state
    if (this.currentTabState === 'hidden') {
      this.currentTabState = 'visible';
    } else {
      this.currentTabState = 'hidden';
    }
    
    // Update UI immediately
    this.renderCurrentTab();
    
    // Perform corresponding action
    if (this.currentTabState === 'visible') {
      await browser.runtime.sendMessage({
        action: 'showTab',
        tabId: this.currentTab.id
      });
    } else {
      await browser.runtime.sendMessage({
        action: 'hideTab',
        tab: this.currentTab
      });
    }
  }

  toggleTabSelection(tabId) {
    if (this.selectedTabIds.has(tabId)) {
      this.selectedTabIds.delete(tabId);
    } else {
      this.selectedTabIds.add(tabId);
    }
    this.updateSelectedTabsState();
    this.render();
  }

  selectAllTabs() {
    this.allTabs.forEach(tab => {
      if (tab.id !== this.currentTab?.id) {
        this.selectedTabIds.add(tab.id);
      }
    });
    this.updateSelectedTabsState();
    this.render();
  }

  deselectAllTabs() {
    this.selectedTabIds.clear();
    this.updateSelectedTabsState();
    this.render();
  }

  invertSelection() {
    const newSelection = new Set();
    this.allTabs.forEach(tab => {
      if (tab.id !== this.currentTab?.id && !this.selectedTabIds.has(tab.id)) {
        newSelection.add(tab.id);
      }
    });
    this.selectedTabIds = newSelection;
    this.updateSelectedTabsState();
    this.render();
  }

  async toggleSelectedTabs() {
    if (this.selectedTabIds.size === 0) return;

    // Update state
    if (this.selectedTabsState === 'hidden') {
      this.selectedTabsState = 'visible';
    } else {
      this.selectedTabsState = 'hidden';
    }
    
    // Update UI immediately
    this.renderToggleButton();
    
    const selectedTabs = this.allTabs.filter(tab => this.selectedTabIds.has(tab.id));
    
    // Perform corresponding action
    if (this.selectedTabsState === 'visible') {
      // Show selected tabs
      for (const tab of selectedTabs) {
        if (this.hiddenTabIds.has(tab.id)) {
          await browser.runtime.sendMessage({
            action: 'showTab',
            tabId: tab.id
          });
        }
      }
    } else {
      // Hide selected tabs
      for (const tab of selectedTabs) {
        if (!this.hiddenTabIds.has(tab.id)) {
          await browser.runtime.sendMessage({
            action: 'hideTab',
            tab: tab
          });
        }
      }
    }

    this.selectedTabIds.clear();
    await this.loadData();
    this.render();
  }

  async unhideAllTabs() {
    await browser.runtime.sendMessage({ action: 'unhideAll' });
    await this.loadData();
    this.render();
  }

  showSaveModal() {
    if (this.selectedTabIds.size === 0) {
      alert('No tabs selected');
      return;
    }

    const modal = new bootstrap.Modal(document.getElementById('saveModal'));
    document.getElementById('sessionName').value = '';
    modal.show();
    setTimeout(() => document.getElementById('sessionName').focus(), 100);
  }

  async saveSession() {
    const name = document.getElementById('sessionName').value.trim();
    if (!name) {
      alert('Please enter a session name');
      return;
    }

    const session = {
      name: name,
      tabIds: Array.from(this.selectedTabIds),
      created: Date.now()
    };

    this.sessions.push(session);
    await browser.storage.local.set({ saved_sessions: this.sessions });

    // Update statistics
    const stats = await browser.storage.local.get('statistics');
    const statistics = stats.statistics || { sessionsSaved: 0 };
    statistics.sessionsSaved = (statistics.sessionsSaved || 0) + 1;
    statistics.lastAction = Date.now();
    await browser.storage.local.set({ statistics });

    const modal = bootstrap.Modal.getInstance(document.getElementById('saveModal'));
    modal.hide();

    this.render();
  }

  loadSession(index) {
    const session = this.sessions[index];
    this.selectedTabIds = new Set(session.tabIds);
    this.render();
  }

  async hideSessionTabs(index) {
    const session = this.sessions[index];
    const tabsToHide = this.allTabs.filter(tab => session.tabIds.includes(tab.id));
    
    for (const tab of tabsToHide) {
      await browser.runtime.sendMessage({
        action: 'hideTab',
        tab: tab
      });
    }

    await this.loadData();
    this.render();
  }

  async deleteSession(index) {
    if (!confirm('Delete this session?')) return;
    
    this.sessions.splice(index, 1);
    await browser.storage.local.set({ saved_sessions: this.sessions });
    this.render();
  }

  openOptions() {
    browser.runtime.openOptionsPage();
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});