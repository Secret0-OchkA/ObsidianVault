function normalizeTag(value) {
  return String(value ?? '').replace(/^#/, '').trim();
}

function getHubFiles() {
  return app.vault.getMarkdownFiles().flatMap(file => {
    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
    if (frontmatter?.type !== 'hub' || !frontmatter.hub_tag) {
      return [];
    }

    return [{
      file,
      tag: normalizeTag(frontmatter.hub_tag)
    }];
  });
}

function getFileTags(file) {
  const cache = app.metadataCache.getFileCache(file);
  const inlineTags = (cache?.tags ?? []).map(item => item.tag);
  const frontmatterTags = cache?.frontmatter?.tags ?? [];
  const propertyTags = Array.isArray(frontmatterTags) ? frontmatterTags : [frontmatterTags];

  return new Set(
    [...inlineTags, ...propertyTags]
      .map(normalizeTag)
      .filter(Boolean)
  );
}

function normalizeLinkTarget(value) {
  return String(value)
    .replace(/\.md$/i, '')
    .split('/')
    .pop()
    .trim()
    .toLowerCase();
}

function getExistingLinks(content) {
  return new Set(
    [...content.matchAll(/\[\[([^|#\]]+)/g)]
      .map(match => normalizeLinkTarget(match[1]))
  );
}

function renderHubSection(content, links) {
  const existingLinks = getExistingLinks(content);
  const missingLinks = links.filter(link => !existingLinks.has(normalizeLinkTarget(link)));
  if (missingLinks.length === 0) {
    return content;
  }

  const lines = missingLinks.map(link => `- [[${link}]]`);
  const section = `## Hubs\n\n${lines.join('\n')}`;
  const sectionPattern = /^## Hubs\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/m;
  const existing = content.match(sectionPattern);

  if (!existing) {
    return `${content.trimEnd()}\n\n${section}\n`;
  }

  const replacement = `${existing[0].trimEnd()}\n${lines.join('\n')}\n\n`;
  return content.replace(existing[0], replacement);
}

module.exports = async function syncHubLinks() {
  const hubs = getHubFiles();
  let updatedFiles = 0;
  let addedLinks = 0;

  for (const file of app.vault.getMarkdownFiles()) {
    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
    if (frontmatter?.type === 'hub' || file.path.startsWith('_Templates/') || file.path.startsWith('_Scripts/')) {
      continue;
    }

    const tags = getFileTags(file);
    const matchingHubs = hubs
      .filter(hub => tags.has(hub.tag) && hub.file.path !== file.path)
      .map(hub => hub.file.path.replace(/\.md$/i, ''));

    if (matchingHubs.length === 0) {
      continue;
    }

    await app.vault.process(file, content => {
      const updatedContent = renderHubSection(content, matchingHubs);
      if (updatedContent !== content) {
        updatedFiles += 1;
        const existingLinks = getExistingLinks(content);
        addedLinks += matchingHubs.filter(hub => !existingLinks.has(normalizeLinkTarget(hub))).length;
      }
      return updatedContent;
    });
  }

  return `Hub links synchronized: ${updatedFiles} files updated, ${addedLinks} links added.`;
};
