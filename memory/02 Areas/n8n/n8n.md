# n8n

Локальный экземпляр n8n запущен через [[docker-compose.yml]].

- Адрес: http://localhost:5678
- Данные: Docker volume `n8n_data`
- Первый вход: создать owner-аккаунт в браузере
- Режим: локальный HTTP; не публиковать этот compose напрямую в интернет

## Управление

```powershell
Set-Location 'D:\ObsidianVault\memory\02 Areas\n8n'
docker compose up -d
docker compose ps
docker compose logs -f n8n
docker compose down
```
