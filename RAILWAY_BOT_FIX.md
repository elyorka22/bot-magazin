# 🔧 Решение проблемы с ботом на Railway

## 🚨 Проблема
Бот не запускается на Railway с ошибкой "service unavailable" или "Attempt #1 failed with service unavailable".

## ✅ Решение

### 1. Проверьте переменные окружения

В Railway Dashboard → telegram-bot → Variables убедитесь, что установлены:

```env
# Обязательные переменные
BOT_TOKEN=7252780069:AAFScwII3euyAvqmZHuxxvAoKzovgkeKtVk
ADMIN_CHAT_ID=1129806592
NODE_ENV=production
PORT=3001

# Supabase (опционально для тестирования)
SUPABASE_URL=https://hzvfnayrcwinqpaksdnm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dmZuYXlyY3dpbnFwYWtzZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDA5MzYsImV4cCI6MjA3MTAxNjkzNn0.TrnsqlL1hx48t4VUeqg_vFgXvb2ZUbdrZb8Ult3zL7o
```

### 2. Проверьте настройки сервиса

В Railway Dashboard → telegram-bot → Settings:

- **Root Directory**: `bot`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`
- **Health Check Timeout**: `300` (увеличено с 100)

### 3. Проверьте логи

В Railway Dashboard → telegram-bot → Logs ищите:

```
🚀 Инициализация бота...
✅ BOT_TOKEN найден
🚀 Запуск Telegram бота...
🤖 Запуск бота...
🌐 HTTP сервер запущен на порту 3001
🏥 Health check доступен по адресу: http://0.0.0.0:3001/health
✅ HTTP сервер готов принимать запросы
✅ Бот успешно запущен!
🎉 Бот полностью готов к работе!
```

### 4. Проверьте health check

Откройте URL бота: `https://your-bot-name.railway.app/health`

Должен вернуться:
```json
{
  "status": "ok",
  "timestamp": "2025-08-17T15:45:51.353Z",
  "bot": "running",
  "uptime": 123.456
}
```

### 5. Перезапустите сервис

В Railway Dashboard → telegram-bot → Deployments → Deploy Now

## 🔍 Диагностика

### Если бот не отвечает в Telegram:

1. **Проверьте токен бота**:
   - Отправьте `/start` боту в Telegram
   - Если бот не отвечает, проверьте токен

2. **Проверьте логи Railway**:
   - Ищите ошибки подключения к Telegram API
   - Проверьте, что бот не заблокирован

3. **Проверьте переменные окружения**:
   - Убедитесь, что все переменные установлены
   - Проверьте правильность значений

### Если health check не работает:

1. **Проверьте порт**:
   - Убедитесь, что `PORT=3001` установлен
   - Проверьте, что порт не занят

2. **Проверьте сборку**:
   - Убедитесь, что `npm run build` проходит успешно
   - Проверьте, что файлы в папке `dist/` созданы

3. **Проверьте HTTP сервер**:
   - Убедитесь, что сервер запускается на `0.0.0.0:3001`
   - Проверьте, что нет ошибок в логах

## 🚀 Быстрое решение

1. **Перезапустите сервис** в Railway
2. **Проверьте переменные окружения**
3. **Проверьте логи** на наличие ошибок
4. **Проверьте health check** URL

## 🔧 Что было исправлено

### В последнем обновлении:
- ✅ **Увеличен health check timeout** с 100 до 300 секунд
- ✅ **Улучшен HTTP сервер** - добавлена обработка ошибок
- ✅ **Добавлено подробное логирование** для диагностики
- ✅ **Исправлен запуск сервера** на `0.0.0.0:3001`
- ✅ **Упрощен код бота** для стабильности

### Ключевые изменения:
1. **railway.json**: увеличен `healthcheckTimeout` до 300
2. **HTTP сервер**: добавлена обработка ошибок и логирование
3. **Health check**: добавлены дополнительные поля (uptime, bot status)
4. **Логирование**: подробные сообщения о каждом этапе запуска

## 📞 Поддержка

Если проблема не решается:

1. Скопируйте логи из Railway
2. Проверьте все переменные окружения
3. Убедитесь, что бот не заблокирован в Telegram
4. Проверьте, что токен бота действителен
5. Попробуйте временно отключить health check для диагностики 