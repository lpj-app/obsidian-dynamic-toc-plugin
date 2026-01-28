"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const DEFAULT_SETTINGS = {
    showH1: true,
    showH2: true,
    showH3: true,
    showH4: true,
    showH5: true,
    showH6: true
};
class TocPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            // 1. Settings
            this.addSettingTab(new TocSettingTab(this.app, this));
            // 2. Register code block processor for auto updating the ToC
            this.registerMarkdownCodeBlockProcessor("toc", (source, el, ctx) => {
                this.renderToc(source, el, ctx);
            });
            // 3. Command
            this.addCommand({
                id: "insert-toc-block",
                name: "Insert Dynamic Table of Contents",
                editorCallback: (editor) => {
                    editor.replaceSelection("```toc\n```");
                }
            });
            // 4. File Menu
            this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
                if (file instanceof obsidian_1.TFile && file.extension === 'md') {
                    menu.addItem((item) => {
                        item
                            .setTitle("Insert ToC")
                            .setIcon("list")
                            .onClick(() => __awaiter(this, void 0, void 0, function* () {
                            const activeView = this.app.workspace.getActiveViewOfType(obsidian_1.MarkdownView);
                            const tocBlock = "```toc\n```\n";
                            if (activeView && activeView.file && activeView.file.path === file.path) {
                                activeView.editor.replaceSelection(tocBlock);
                            }
                            else {
                                // Add ToC at file start
                                yield this.app.vault.process(file, (data) => {
                                    return tocBlock + data;
                                });
                                new obsidian_1.Notice(`Dynamic ToC added to ${file.basename}`);
                            }
                        }));
                    });
                }
            }));
        });
    }
    // Render code block for ToC
    renderToc(source, el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the file using the path from the context
            const cache = this.app.metadataCache.getCache(ctx.sourcePath);
            if (!(cache === null || cache === void 0 ? void 0 : cache.headings)) {
                // No headings found
                //el.createEl("p", { text: "No headings found.", cls: "toc-empty-notice" });
                new obsidian_1.Notice(`No headings found in ${ctx.sourcePath}`);
                return;
            }
            // Build markdown list based on settings
            const markdownList = this.buildTocMarkdown(cache.headings);
            if (markdownList.length === 0) {
                el.createEl("p", { text: "ToC empty (check settings).", cls: "toc-empty-notice" });
                return;
            }
            // Render the markdown list into the element
            // Links will work now [[#Heading]]
            yield obsidian_1.MarkdownRenderer.render(this.app, markdownList, el, ctx.sourcePath, this);
        });
    }
    // String builder
    buildTocMarkdown(headings) {
        let result = "";
        for (const h of headings) {
            if (h.level === 1 && !this.settings.showH1)
                continue;
            if (h.level === 2 && !this.settings.showH2)
                continue;
            if (h.level === 3 && !this.settings.showH3)
                continue;
            if (h.level === 4 && !this.settings.showH4)
                continue;
            if (h.level === 5 && !this.settings.showH5)
                continue;
            if (h.level === 6 && !this.settings.showH6)
                continue;
            const indent = "  ".repeat(h.level - 1);
            // Obsidian syntax for internal links
            const link = h.heading;
            result += `${indent}- [[#${link}]]\n`;
        }
        return result;
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
exports.default = TocPlugin;
// Settings
class TocSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        // Header
        containerEl.createEl('strong', { text: 'Dynamic Table of Contents' });
        containerEl.createEl('p', {
            text: 'This plugin generates a dynamic table of contents based on your document structure. The ToC updates automatically in Reading Mode.'
        });
        // Settings
        containerEl.createEl('strong', { text: 'Heading Configuration' });
        containerEl.createEl('div', {
            text: 'Select which heading levels should be included in the generated table of contents:',
            cls: 'setting-item-description'
        });
        new obsidian_1.Setting(containerEl)
            .setName('Include Level 1 (H1)')
            .setDesc('Main document titles')
            .addToggle(t => t.setValue(this.plugin.settings.showH1).onChange((v) => __awaiter(this, void 0, void 0, function* () { this.plugin.settings.showH1 = v; yield this.plugin.saveSettings(); })));
        new obsidian_1.Setting(containerEl)
            .setName('Include Level 2 (H2)')
            .setDesc('Major sections')
            .addToggle(t => t.setValue(this.plugin.settings.showH2).onChange((v) => __awaiter(this, void 0, void 0, function* () { this.plugin.settings.showH2 = v; yield this.plugin.saveSettings(); })));
        new obsidian_1.Setting(containerEl)
            .setName('Include Level 3 (H3)')
            .setDesc('Subsections')
            .addToggle(t => t.setValue(this.plugin.settings.showH3).onChange((v) => __awaiter(this, void 0, void 0, function* () { this.plugin.settings.showH3 = v; yield this.plugin.saveSettings(); })));
        new obsidian_1.Setting(containerEl)
            .setName('Include Level 4 (H4)')
            .addToggle(t => t.setValue(this.plugin.settings.showH4).onChange((v) => __awaiter(this, void 0, void 0, function* () { this.plugin.settings.showH4 = v; yield this.plugin.saveSettings(); })));
        new obsidian_1.Setting(containerEl)
            .setName('Include Level 5 (H5)')
            .addToggle(t => t.setValue(this.plugin.settings.showH5).onChange((v) => __awaiter(this, void 0, void 0, function* () { this.plugin.settings.showH5 = v; yield this.plugin.saveSettings(); })));
        new obsidian_1.Setting(containerEl)
            .setName('Include Level 6 (H6)')
            .addToggle(t => t.setValue(this.plugin.settings.showH6).onChange((v) => __awaiter(this, void 0, void 0, function* () { this.plugin.settings.showH6 = v; yield this.plugin.saveSettings(); })));
        // Usage
        containerEl.createEl('hr');
        containerEl.createEl('h1', { text: 'Usage Guide' });
        const usageContainer = containerEl.createDiv();
        // Method 1
        usageContainer.createEl('h3', { text: 'Method 1: Command Palette' });
        const ul1 = usageContainer.createEl('ul');
        ul1.createEl('li', { text: 'Open the Command Palette (Ctrl/Cmd + P).' });
        ul1.createEl('li', { text: 'Search for "Insert Dynamic Table of Contents".' });
        // Method 2
        usageContainer.createEl('h3', { text: 'Method 2: File Menu' });
        const ul2 = usageContainer.createEl('ul');
        ul2.createEl('li', { text: 'Click the 3 dots (options) on the top right of your note.' });
        ul2.createEl('li', { text: 'Select "Insert Dynamic ToC".' });
        ul2.createEl('li', { text: 'If you do this from the File Explorer, the ToC is added to the top of the file.' });
        // Method 3
        usageContainer.createEl('h3', { text: 'Method 3: Manual Code Block' });
        const pManual = usageContainer.createEl('p');
        pManual.setText('Simply type the following code block anywhere in your note:');
        // Code Block preview
        const pre = usageContainer.createEl('pre');
        pre.createEl('code', { text: '```toc\n```' });
        // Footer
        containerEl.createEl('hr');
        const footer = containerEl.createDiv({ cls: 'toc-settings-footer' });
        footer.style.textAlign = 'center';
        footer.style.marginTop = '20px';
        footer.style.color = 'var(--text-muted)';
        footer.createSpan({ text: 'Find this plugin on ' });
        const link = footer.createEl('a', {
            text: 'GitHub Repository',
            href: 'https://github.com/lpj.app/obsidian-dynamic-toc-plugin'
        });
        footer.createSpan({ text: '.' });
    }
}
