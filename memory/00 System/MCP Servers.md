# MCP Servers

Конфигурация MCP-серверов для текущего рабочего окружения. Секреты намеренно не хранятся в заметке: токен Obsidian остаётся только в локальном `mcp.json`.

## n8n

```json
{
  "n8n": {
    "type": "http",
    "url": "http://localhost:5678/mcp-server/http"
  }
}
```

Workflow URL: http://localhost:5678

## Obsidian

```json
{
  "obsidian": {
    "type": "http",
    "url": "http://127.0.0.1:27123/mcp/",
    "headers": {
      "Authorization": "Bearer <token из локального mcp.json>"
    }
  }
}
```

## Microsoft Docs

```json
{
  "microsoftdocs/mcp": {
    "type": "http",
    "url": "https://learn.microsoft.com/api/mcp",
    "gallery": "https://api.mcp.github.com",
    "version": "1.0.0"
  }
}
```

## Источник

Локальная конфигурация VS Code: `C:\Users\matvey.kuvin\AppData\Roaming\Code\User\mcp.json`
