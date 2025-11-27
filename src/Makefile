# Hide My Tabs! - Build Makefile

EXTENSION_NAME = hide-my-tabs
VERSION = 1.0.0
SRC_DIR = src
BUILD_DIR = build
DIST_DIR = dist

CHROME_ZIP = $(DIST_DIR)/$(EXTENSION_NAME)-chrome-$(VERSION).zip
FIREFOX_XPI = $(DIST_DIR)/$(EXTENSION_NAME)-firefox-$(VERSION).xpi
FIREFOX_ZIP = $(DIST_DIR)/$(EXTENSION_NAME)-firefox-$(VERSION).zip

.PHONY: all clean chrome firefox

all: clean chrome firefox

chrome: $(CHROME_ZIP)

$(CHROME_ZIP):
	@echo "Building Chrome package..."
	@mkdir -p $(BUILD_DIR)/chrome $(DIST_DIR)
	@cp -r $(SRC_DIR)/* $(BUILD_DIR)/chrome/
	@cd $(BUILD_DIR)/chrome && zip -q -r ../../$(CHROME_ZIP) . -x "*.DS_Store"
	@echo "Created: $(CHROME_ZIP)"

firefox: $(FIREFOX_XPI) $(FIREFOX_ZIP)

$(FIREFOX_XPI):
	@echo "Building Firefox package (XPI)..."
	@mkdir -p $(BUILD_DIR)/firefox $(DIST_DIR)
	@cp -r $(SRC_DIR)/* $(BUILD_DIR)/firefox/
	@cd $(BUILD_DIR)/firefox && zip -q -r ../../$(FIREFOX_XPI) . -x "*.DS_Store"
	@echo "Created: $(FIREFOX_XPI)"

$(FIREFOX_ZIP):
	@echo "Building Firefox package (ZIP)..."
	@cd $(BUILD_DIR)/firefox && zip -q -r ../../$(FIREFOX_ZIP) . -x "*.DS_Store"
	@echo "Created: $(FIREFOX_ZIP)"

clean:
	@rm -rf $(BUILD_DIR) $(DIST_DIR)
	@echo "Cleaned build directories"