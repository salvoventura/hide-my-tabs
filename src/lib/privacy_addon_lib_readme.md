# Libraries Directory

This directory contains third-party libraries used by the extension.

## Required Libraries

### 1. Browser Polyfill
**File**: `browser-polyfill.min.js`  
**Source**: https://github.com/mozilla/webextension-polyfill  
**Version**: Latest (v0.10.0 or newer recommended)  
**Purpose**: Cross-browser compatibility (converts chrome.* API to browser.* with Promises)

**Download**:
```bash
wget https://unpkg.com/webextension-polyfill@latest/dist/browser-polyfill.min.js
```

### 2. Bootstrap CSS
**File**: `bootstrap.min.css`  
**Source**: https://getbootstrap.com/  
**Version**: 5.3.x  
**Purpose**: UI styling framework

**Download**:
```bash
wget https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css
```

### 3. Bootstrap Bundle JS
**File**: `bootstrap.bundle.min.js`  
**Source**: https://getbootstrap.com/  
**Version**: 5.3.x  
**Purpose**: Bootstrap JavaScript components (includes Popper.js)

**Download**:
```bash
wget https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js
```

### 4. Bootstrap Icons
**File**: `bootstrap-icons.min.css`  
**Source**: https://icons.getbootstrap.com/  
**Version**: 1.11.x or newer  
**Purpose**: Icon font library

**Download**:
```bash
wget https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css
```

**Note**: Also download the fonts directory and place it alongside the CSS file:
```bash
wget -r -np -nH --cut-dirs=5 https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/fonts/
```

## Quick Setup Script

Create a file named `download-libs.sh`:

```bash
#!/bin/bash

# Create lib directory
mkdir -p lib
cd lib

# Download Browser Polyfill
wget -O browser-polyfill.min.js https://unpkg.com/webextension-polyfill@latest/dist/browser-polyfill.min.js

# Download Bootstrap CSS
wget -O bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css

# Download Bootstrap JS Bundle
wget -O bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js

# Download Bootstrap Icons CSS
wget -O bootstrap-icons.min.css https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css

# Download Bootstrap Icons Fonts
mkdir -p fonts
cd fonts
wget https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/fonts/bootstrap-icons.woff
wget https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/fonts/bootstrap-icons.woff2
cd ..

echo "All libraries downloaded successfully!"
```

Run it:
```bash
chmod +x download-libs.sh
./download-libs.sh
```

## Alternative: Using NPM

If you prefer using npm:

```bash
npm install webextension-polyfill bootstrap bootstrap-icons
```

Then copy files to lib directory:
```bash
cp node_modules/webextension-polyfill/dist/browser-polyfill.min.js lib/
cp node_modules/bootstrap/dist/css/bootstrap.min.css lib/
cp node_modules/bootstrap/dist/js/bootstrap.bundle.min.js lib/
cp node_modules/bootstrap-icons/font/bootstrap-icons.min.css lib/
cp -r node_modules/bootstrap-icons/font/fonts lib/
```

## File Structure

After setup, your lib directory should look like:

```
lib/
├── browser-polyfill.min.js
├── bootstrap.min.css
├── bootstrap.bundle.min.js
├── bootstrap-icons.min.css
├── fonts/
│   ├── bootstrap-icons.woff
│   └── bootstrap-icons.woff2
└── README.md
```

## License Information

- **Browser Polyfill**: Mozilla Public License 2.0
- **Bootstrap**: MIT License
- **Bootstrap Icons**: MIT License

All libraries are free and open source.