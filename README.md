# ToC Generator for Obsidian

A simple Obsidian plugin that generates a **dynamic Table of Contents** for your notes.

The plugin uses a code block approach. 
This means the table of contents stays **automatically updated** as you write, rename, or reorder your headings.

## Table of Contents

- [ToC Generator for Obsidian](#toc-generator-for-obsidian)
    - [Features](#features)
    - [Usage](#usage)
        - [Method 1: Manual Code Block](#method-1-manual-code-block)
        - [Method 2: Command Palette](#method-2-command-palette)
        - [Method 3: File Menu / Context Menu](#method-3-file-menu--context-menu)
    - [Settings](#settings)
    - [Installation](#installation)
    - [License](#license)

## Features

- **Dynamic Updates:** The ToC updates automatically in Reading Mode and Live Preview. No manual refreshing needed.
- **Configurable Levels:** Choose exactly which heading levels (H1–H6) to display via settings.
- **Context Menu Integration:** - Insert ToC at your cursor position.
    - Right-click a file in the explorer to prepend a ToC to the very top of the note.
- **Command Palette:** Quickly insert via `Ctrl/Cmd + P`.

## Usage

### Method 1: Manual Code Block
Simply type the following code block anywhere in your note:

    ```toc
    ```

### Method 2: Command Palette
1. Open the Command Palette (`Ctrl/Cmd + P`).
2. Search for `ToC Generator`.
3. Press Enter to insert the block at your cursor.

### Method 3: File Menu / Context Menu
- **Inside a note:** Click the 3-dots menu (top right) -> `Insert ToC`.
- **File Explorer:** Right-click any Markdown file -> `Insert ToC`. *This will add the ToC to the very beginning of the file.*

## Settings

Go to **Settings > ToC Generator** to customize your experience.
You can toggle visibility for each heading level (H1 through H6) individually.

## Installation

1. Download the `main.js` and `manifest.json` from the latest release
2. Create a folder named `toc-generator` in your vault's `.obsidian/plugins/` directory.
3. Paste the files into that folder.
4. Reload Obsidian and enable the plugin in Community Plugins.

---
## License

See [LICENSE](./LICENSE).

--- 

&copy; [lpj.app](https://github.com/lpj-app). Licensed under MIT.