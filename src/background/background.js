/**
 * Hide My Tabs!
 * File: src/background/background.js
 * Author: Salvatore Ventura <salvoventura@gmail.com>
 * Code assisted by Claude.ai
 * 
 * Background Service Worker - Main Entry Point
 */

// Polyfill for Chrome/Edge
if (typeof browser === 'undefined') {
  globalThis.browser = chrome;
}

import { EventManager } from './events.js';

// Initialize the extension
EventManager.initialize();