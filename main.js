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
            // 2. Register code block processor
            this.registerMarkdownCodeBlockProcessor("toc", (source, el, ctx) => {
                void this.renderToc(source, el, ctx);
            });
            // 3. Command
            this.addCommand({
                id: "insert-toc-block",
                name: "Insert dynamic table of contents",
                editorCallback: (editor) => {
                    editor.replaceSelection("```toc\n```");
                }
            });
            // 4. File Menu
            this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
                if (file instanceof obsidian_1.TFile && file.extension === 'md') {
                    menu.addItem((item) => {
                        item
                            .setTitle("Insert dynamic toc")
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
                                new obsidian_1.Notice(`Dynamic toc added to ${file.basename}`);
                            }
                        }));
                    });
                }
            }));
        });
    }
    renderToc(source, el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.app.metadataCache.getCache(ctx.sourcePath);
            if (!(cache === null || cache === void 0 ? void 0 : cache.headings)) {
                new obsidian_1.Notice(`No headings found in ${ctx.sourcePath}`);
                return;
            }
            const markdownList = this.buildTocMarkdown(cache.headings);
            if (markdownList.length === 0) {
                el.createEl("p", { text: "Table of contents is empty (check settings).", cls: "toc-empty-notice" });
                return;
            }
            yield obsidian_1.MarkdownRenderer.render(this.app, markdownList, el, ctx.sourcePath, null);
        });
    }
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
class TocSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        // 1. Header
        new obsidian_1.Setting(containerEl)
            .setName('Dynamic table of contents')
            .setHeading();
        containerEl.createEl('p', {
            text: 'This plugin generates a dynamic table of contents based on your document structure. The table of contents updates automatically in reading mode.'
        });
        // 2. Settings
        new obsidian_1.Setting(containerEl)
            .setName('Heading configuration')
            .setHeading();
        containerEl.createEl('div', {
            text: 'Select which heading levels should be included in the generated table of contents:',
            cls: 'setting-item-description'
        });
        new obsidian_1.Setting(containerEl)
            .setName('Include level 1 (H1)')
            .setDesc('Main document titles')
            .addToggle(t => t
            .setValue(this.plugin.settings.showH1)
            .onChange((v) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.showH1 = v;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Include level 2 (H2)')
            .setDesc('Major sections')
            .addToggle(t => t
            .setValue(this.plugin.settings.showH2)
            .onChange((v) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.showH2 = v;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Include level 3 (H3)')
            .setDesc('Subsections')
            .addToggle(t => t
            .setValue(this.plugin.settings.showH3)
            .onChange((v) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.showH3 = v;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Include level 4 (H4)')
            .addToggle(t => t
            .setValue(this.plugin.settings.showH4)
            .onChange((v) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.showH4 = v;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Include level 5 (H5)')
            .addToggle(t => t
            .setValue(this.plugin.settings.showH5)
            .onChange((v) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.showH5 = v;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Include level 6 (H6)')
            .addToggle(t => t
            .setValue(this.plugin.settings.showH6)
            .onChange((v) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.showH6 = v;
            yield this.plugin.saveSettings();
        })));
        // 3. Demo Video
        const demoContainer = containerEl.createDiv({ cls: 'toc-demo-container' });
        demoContainer.createEl('video', {
            attr: {
                src: 'https://private-user-images.githubusercontent.com/56166718/541665589-58662563-1c98-4256-b13b-f9b8e305ba46.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Njk2MTE3OTYsIm5iZiI6MTc2OTYxMTQ5NiwicGF0aCI6Ii81NjE2NjcxOC81NDE2NjU1ODktNTg2NjI1NjMtMWM5OC00MjU2LWIxM2ItZjliOGUzMDViYTQ2Lm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAxMjglMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMTI4VDE0NDQ1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWRiZjk5ZmZkNzUzODFmYWU4ZWZkMTE0M2IxOTZjZTQwOTExN2M0NWFiMWI1YjhmNzUzNzNmNmNmZjhhZjg1NDImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.YsdEhJIBLLS2NVVdzSS8ZmV8Ko-WKnlyeT1cz2TRLXg',
                controls: '',
                autoplay: '',
                loop: '',
                muted: ''
            },
            cls: 'toc-demo-video'
        });
        // 4. Usage
        containerEl.createEl('hr');
        new obsidian_1.Setting(containerEl)
            .setName('Usage guide')
            .setHeading();
        // Method 1
        new obsidian_1.Setting(containerEl)
            .setName('Method 1: Command palette')
            .setHeading();
        const ul1 = containerEl.createEl('ul');
        ul1.createEl('li', { text: 'Open the Command Palette (Ctrl/Cmd + P).' });
        ul1.createEl('li', { text: 'Search for "Insert dynamic table of contents".' });
        // Method 2
        new obsidian_1.Setting(containerEl)
            .setName('Method 2: File menu')
            .setHeading();
        const ul2 = containerEl.createEl('ul');
        ul2.createEl('li', { text: 'Click the 3 dots (options) on the top right of your note.' });
        ul2.createEl('li', { text: 'Select "Insert dynamic toc".' });
        ul2.createEl('li', { text: 'If you do this from the file explorer, the toc is added to the top of the file.' });
        // Method 3
        new obsidian_1.Setting(containerEl)
            .setName('Method 3: Manual code block')
            .setHeading();
        const pManual = containerEl.createEl('p');
        pManual.setText('Simply type the following code block anywhere in your note:');
        // Code Block preview
        const pre = containerEl.createEl('pre');
        pre.createEl('code', { text: '```toc\n```' });
        // 5. Footer
        containerEl.createEl('hr');
        const footer = containerEl.createDiv({ cls: 'toc-settings-footer' });
        footer.createSpan({ text: 'Find this plugin on ' });
        footer.createEl('a', {
            text: 'GitHub Repository',
            href: 'https://github.com/lpj.app/obsidian-dynamic-toc-plugin'
        });
        footer.createSpan({ text: '.' });
    }
}
