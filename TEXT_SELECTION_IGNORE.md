# Text Selection Ignore Feature

## Overview
This feature allows you to disable the text selection popup in specific applications, similar to how `.gitignore` works for Git.

## How It Works

### Configuration
The configuration is stored in `userData/textSelectionIgnore.json` with the following structure:

```json
{
  "ignoredApplications": [
    "kiro.exe",
    "code.exe",
    "notepad.exe"
  ],
  "enabled": true
}
```

### Settings UI
1. Open Settings (gear icon in header)
2. Navigate to "Text Selection" tab
3. Toggle the feature on/off
4. Add application names to the ignore list
5. Click Save

### How Applications Are Matched
- The system checks the active window's owner name
- Matching is case-insensitive
- You can specify just the app name without `.exe` (e.g., "kiro" will match "kiro.exe")
- When text is selected in an ignored application, the translate popup will not appear

### Technical Details
- Uses `active-win` package to detect the currently active window
- Config is loaded when text selection monitoring starts
- Config can be reloaded without restarting the app by saving in Settings
- The check happens before showing the popup, so there's no performance impact

### Default Ignored Applications
By default, the following applications are ignored:
- `kiro.exe` - Kiro IDE
- `code.exe` - Visual Studio Code
- `notepad.exe` - Windows Notepad

### Examples
To ignore text selection in:
- **Chrome**: Add `chrome.exe` or just `chrome`
- **Firefox**: Add `firefox.exe` or just `firefox`
- **Sublime Text**: Add `sublime_text.exe` or just `sublime_text`
- **Any Electron app**: Add the app's executable name

## Implementation Files
- `electron/lib/textSelectionPopup.ts` - Main logic for text selection monitoring and ignore checking
- `src/components/settings/TextSelectionIgnoreSection.tsx` - Settings UI component
- `electron/lib/ipcHandlers.ts` - IPC handlers for loading/saving config
- `src/data/textSelectionIgnore.json` - Default config (not used at runtime, just for reference)
