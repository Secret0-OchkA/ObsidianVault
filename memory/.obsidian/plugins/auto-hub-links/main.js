const { Plugin, Notice } = require('obsidian');

const SETTINGS_KEY = 'autoHubLinks';
const DEFAULT_SETTINGS = {
  enabled: true,
  debounceMs: 700
};

function normalizeTag(value) {
  return String(value ?? '').replace(/^#/, '').trim();
}

function normalizeLinkTarget(value) {
  return String(value)
    .replace(/\.md$/i, '')
    .split('/')
    .pop()
    .trim()
    .toLowerCase();
}

class AutoHubLinksPlugin extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.pendingFiles = new Set();
    this.syncTimer = undefined;
    this.isSyncing = false;

    this.registerEvent(this.app.metadataCache.on('changed', file => {
      if (file.extension !== 'md' || !this.settings.enabled) {
        return;
      }

      if (this.isHub(file)) {
        this.scheduleFullSync();
        return;
      }

      this.scheduleFileSync(file);
    }));

    this.addCommand({
      id: 'sync-all',
      name: 'Sync all hub links',
      callback: () => this.syncAll(true)
    });

    this.addCommand({
      id: 'toggle',
      name: 'Toggle automatic hub links',
      callback: async () => {
        this.settings.enabled = !this.settings.enabled;
        await this.saveData(this.settings);
        new Notice(`Auto Hub Links: ${this.settings.enabled ? 'enabled' : 'disabled'}`);
      }
    });

    this.app.workspace.onLayoutReady(() => {
      if (this.settings.enabled) {
        this.syncAll(false);
      }
    });
  }

  onunload() {
    if (this.syncTimer) {
      window.clearTimeout(this.syncTimer);
    }
  }

  isIgnored(file) {
    return file.path.startsWith('.obsidian/')
      || file.path.startsWith('_Templates/')
      || file.path.startsWith('_Scripts/');
  }

  getFrontmatter(file) {
    return this.app.metadataCache.getFileCache(file)?.frontmatter;
  }

  isHub(file) {
    return this.getFrontmatter(file)?.type === 'hub';
  }

  getHubs() {
    return this.app.vault.getMarkdownFiles()
      .filter(file => !this.isIgnored(file))
      .flatMap(file => {
        const frontmatter = this.getFrontmatter(file);
        if (frontmatter?.type !== 'hub' || !frontmatter.hub_tag) {
          return [];
        }

        return [{
          file,
          tag: normalizeTag(frontmatter.hub_tag),
          path: file.path.replace(/\.md$/i, '')
        }];
      });
  }

  getTags(file) {
    const cache = this.app.metadataCache.getFileCache(file);
    const inlineTags = (cache?.tags ?? []).map(item => item.tag);
    const frontmatterTags = cache?.frontmatter?.tags ?? [];
    const propertyTags = Array.isArray(frontmatterTags) ? frontmatterTags : [frontmatterTags];

    return new Set(
      [...inlineTags, ...propertyTags]
        .map(normalizeTag)
        .filter(Boolean)
    );
  }

  getExistingLinks(content) {
    return new Set(
      [...content.matchAll(/\[\[([^|#\]]+)/g)]
        .map(match => normalizeLinkTarget(match[1]))
    );
  }

  updateHubSection(content, matchingHubs) {
    const sectionStart = content.search(/^## Hubs\r?$/m);
    const nextHeadingOffset = sectionStart < 0
      ? -1
      : content.slice(sectionStart + 7).search(/^## /m);
    const sectionEnd = nextHeadingOffset < 0
      ? content.length
      : sectionStart + 7 + nextHeadingOffset;

    const section = matchingHubs.length === 0
      ? ''
      : `## Hubs\n\n<!-- Auto-managed by Auto Hub Links -->\n${matchingHubs.map(hub => `- [[${hub.path}]]`).join('\n')}\n`;

    if (sectionStart < 0) {
      return section ? `${content.trimEnd()}\n\n${section}` : content;
    }

    const before = content.slice(0, sectionStart).trimEnd();
    const after = content.slice(sectionEnd).trimStart();
    return [before, section.trimEnd(), after].filter(Boolean).join('\n\n') + '\n';
  }

  async syncFile(file) {
    if (this.isIgnored(file) || this.isHub(file)) {
      return false;
    }

    const tags = this.getTags(file);
    const matchingHubs = this.getHubs()
      .filter(hub => hub.file.path !== file.path && tags.has(hub.tag));

    let changed = false;
    await this.app.vault.process(file, content => {
      const existingLinks = this.getExistingLinks(content);
      const missingLinks = matchingHubs.filter(hub => !existingLinks.has(normalizeLinkTarget(hub.path)));
      const hasManagedSection = content.includes('<!-- Auto-managed by Auto Hub Links -->');

      if (missingLinks.length === 0 && (matchingHubs.length > 0 || !hasManagedSection)) {
        return content;
      }

      const updated = this.updateHubSection(content, matchingHubs);
      changed = updated !== content;
      return updated;
    });

    return changed;
  }

  scheduleFileSync(file) {
    this.pendingFiles.add(file.path);
    this.scheduleSync();
  }

  scheduleFullSync() {
    this.pendingFiles.clear();
    this.pendingFiles.add('*');
    this.scheduleSync();
  }

  scheduleSync() {
    if (this.syncTimer) {
      window.clearTimeout(this.syncTimer);
    }

    this.syncTimer = window.setTimeout(() => this.flushSync(), this.settings.debounceMs);
  }

  async flushSync() {
    const fullSync = this.pendingFiles.has('*');
    const paths = [...this.pendingFiles];
    this.pendingFiles.clear();

    if (fullSync) {
      await this.syncAll(false);
      return;
    }

    for (const path of paths) {
      const file = this.app.vault.getAbstractFileByPath(path);
      if (file?.extension === 'md') {
        await this.syncFile(file);
      }
    }
  }

  async syncAll(showNotice) {
    if (this.isSyncing) {
      return;
    }

    this.isSyncing = true;
    let updatedFiles = 0;

    try {
      for (const file of this.app.vault.getMarkdownFiles()) {
        if (await this.syncFile(file)) {
          updatedFiles += 1;
        }
      }

      if (showNotice) {
        new Notice(`Auto Hub Links: ${updatedFiles} files updated.`);
      }
    } finally {
      this.isSyncing = false;
    }
  }
}

module.exports = AutoHubLinksPlugin;
