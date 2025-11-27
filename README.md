# Hide My Tabs!

An open source browser extension for quickly hiding and managing sensitive browser tabs with content masking. Features include session management, multi-tab selection, and cross-browser support.

## Why this tool

Privacy is critical in today's connected world. Whether you're working remotely, sharing your screen in video calls, presenting to clients, or simply want to keep your browsing private from shoulder surfers, you need a quick way to hide sensitive tabs without losing your session. Hide My Tabs! lets you instantly mask tab content while preserving your work - no need to close tabs or risk accidentally sharing confidential information during screen shares.

## Background

Privacy matters. Whether you're researching sensitive topics, managing personal information, or simply want to keep your browsing private from shoulder surfers, having a quick way to hide tabs is essential. Unlike minimizing or closing tabs, Hide My Tabs! preserves your session while showing only a neutral "New Tab" page.

## Installation

### Mozilla Firefox
[Firefox Add-ons Store](http://example.com)

### Google Chrome
[Chrome Web Store](http://example.com)

### Microsoft Edge
Use the Chrome Web Store (Edge supports Chrome extensions).

## Usage

### Quick Hide/Show

**Single Tab:**
1. Click the extension icon
2. In the "Current Tab" section, click "Hide This Tab"
3. Click "Show This Tab" to restore

**Multiple Tabs:**
1. Click the extension icon
2. Select tabs using checkboxes in the "Tab Sessions" section
3. Click "Hide Selected" or "Show Selected"

**Context Menu:**
- Right-click on any page → "Hide this tab"
- Right-click on any page → "Hide other tabs"
- Right-click anywhere → "Unhide all tabs"

**Firefox Only:**
- Right-click directly on tab strip for quick access

### Session Management

Save frequently-used tab selections:
1. Select tabs in the popup
2. Click "Save as Session"
3. Enter a session name
4. Load saved sessions with one click

Sessions persist across browser restarts and can be used to quickly hide the same set of tabs repeatedly.

## Features

- **Content Masking** - Hidden tabs show a neutral "New Tab" page
- **Multi-Tab Support** - Hide/show multiple tabs at once
- **Session Management** - Save and load tab selections
- **Context Menu** - Right-click integration for quick actions
- **Statistics Tracking** - Monitor your usage
- **100% Local** - All data stored locally, no external servers
- **Cross-Browser** - Works on Chrome, Edge, and Firefox
- **Manifest V3** - Future-proof implementation

## Options

Access options by clicking the gear icon in the popup.

### Appearance
Hidden tabs display a neutral "New Tab" style page with a privacy indicator.

### Privacy
**All data is stored locally** - No information is sent to external servers.

**What Gets Stored:**
- Original tab URLs
- Tab titles
- Favicon URLs
- Saved sessions
- Usage statistics

Data is automatically deleted when tabs are unhidden or closed.

### Actions
- **Show All Hidden Tabs** - Instantly restore all hidden tabs

### Statistics
Track your usage in the About tab:
- Total hides/unhides
- Sessions saved
- Last action timestamp
- Install date

Statistics can be reset at any time.

## Installation for Development

**Chrome/Edge:**
1. Navigate to `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `src` directory

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `src/manifest.json`

## Also from this author

### Save my Tabs!
Bookmark all open tabs at once with auto-save, multi-window support, and automatic cleanup.

- **GitHub Repository:** [https://github.com/salvoventura/save-my-tabs](https://github.com/salvoventura/save-my-tabs)
- **Download for Firefox:** [Firefox Add-ons Store](https://addons.mozilla.org/addon/save-all-my-tabs/)
- **Download for Chrome/Edge:** [Chrome Web Store](https://chrome.google.com/webstore/detail/save-my-tabs/kfoppgabigkfegjfafmadikhjllohfep)

## Version History

### 1.0.0
- Initial release
- Single and multi-tab hiding
- Session management
- Context menu integration
- Usage statistics
- Cross-browser support (Chrome, Edge, Firefox)
- Manifest V3 compliant
- Bootstrap UI

## License

**Hide My Tabs!** is released under the [MIT License](http://www.opensource.org/licenses/MIT).  
Source code available at [GitHub](https://github.com/)

## Credits

- **Icon:** [Invisible icons created by Andrean Prabowo - Flaticon](https://www.flaticon.com/free-icons/invisible)
- **UI Framework:** [Bootstrap 5](https://getbootstrap.com/)
- **Icons:** [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Cross-browser:** [WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill)

## Privacy

This extension operates entirely locally. No data collection, no analytics, no external servers. Your tab information never leaves your browser.