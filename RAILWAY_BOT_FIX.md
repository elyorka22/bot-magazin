# 🔧 Решение проблемы с ботом на Railway

## 🚨 Проблема
Бот не запускается на Railway с ошибкой "service unavailable" или "Attempt #1 failed with service unavailable".

## ✅ Решение

### 1. Проверьте переменные окружения

В Railway Dashboard → telegram-bot → Variables убедитесь, что установлены:

```env
# Обязательные переменные
NODE_ENV=production
PORT=3001

# Telegram Bot (временно отключен для тестирования)
# BOT_TOKEN=7252780069:AAFScwII3euyAvqmZHuxxvAoKzovgkeKtVk
# ADMIN_CHAT_ID=1129806592

# Supabase (опционально для тестирования)
# SUPABASE_URL=https://hzvfnayrcwinqpaksdnm.supabase.co
# SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dmZuYXlyY3dpbnFwYWtzZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDA5MzYsImV4cCI6MjA3MTAxNjkzNn0.TrnsqlL1hx48t4VUeqg_vFgXvb2ZUbdrZb8Ult3zL7o
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
🚀 Инициализация приложения...
🌐 HTTP сервер запущен на порту 3001
🏥 Health check доступен по адресу: http://0.0.0.0:3001/health
🏠 Root endpoint доступен по адресу: http://0.0.0.0:3001/
🧪 Test endpoint доступен по адресу: http://0.0.0.0:3001/test
✅ HTTP сервер готов принимать запросы
🎉 Приложение полностью готово к работе!
```

### 4. Проверьте health check

Откройте URL бота: `https://your-bot-name.railway.app/health`

Должен вернуться:
```json
{
  "status": "ok",
  "timestamp": "2025-08-17T15:58:27.744Z",
  "service": "telegram-bot",
  "uptime": 6.254175021,
  "port": "3001"
}
```

### 5. Перезапустите сервис

В Railway Dashboard → telegram-bot → Deployments → Deploy Now

## 🔍 Диагностика

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

### Тестовые endpoints:

После успешного деплоя проверьте:

- **Health check**: `https://your-bot-name.railway.app/health`
- **Root endpoint**: `https://your-bot-name.railway.app/`
- **Test endpoint**: `https://your-bot-name.railway.app/test`

## 🚀 Быстрое решение

1. **Перезапустите сервис** в Railway
2. **Проверьте переменные окружения**
3. **Проверьте логи** на наличие ошибок
4. **Проверьте health check** URL

## 🔧 Что было исправлено

### В последнем обновлении:
- ✅ **Создана минимальная версия** - только HTTP сервер без Telegram API
- ✅ **Увеличен health check timeout** с 100 до 300 секунд
- ✅ **Улучшен HTTP сервер** - добавлена обработка ошибок
- ✅ **Добавлено подробное логирование** для диагностики
- ✅ **Исправлен запуск сервера** на `0.0.0.0:3001`
- ✅ **Добавлены тестовые endpoints** для диагностики

### Ключевые изменения:
1. **railway.json**: увеличен `healthcheckTimeout` до 300
2. **HTTP сервер**: добавлена обработка ошибок и логирование
3. **Health check**: добавлены дополнительные поля (uptime, port)
4. **Логирование**: подробные сообщения о каждом этапе запуска
5. **Тестовые endpoints**: `/`, `/health`, `/test` для диагностики

## 📋 Следующие шаги

После того как минимальная версия заработает на Railway:

1. **Подтвердите, что health check работает**
2. **Проверьте все тестовые endpoints**
3. **Добавьте обратно Telegram бота** (когда убедитесь, что HTTP сервер стабилен)
4. **Настройте переменные окружения** для Telegram API

## 📞 Поддержка

Если проблема не решается:

1. Скопируйте логи из Railway
2. Проверьте все переменные окружения
3. Попробуйте временно отключить health check для диагностики
4. Проверьте, что порт 3001 не занят другими сервисами 