# 🔧 Решение проблемы с ботом на Railway

## 🚨 Проблема
Бот не запускается на Railway, хотя веб-приложение работает нормально.

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

### 3. Проверьте логи

В Railway Dashboard → telegram-bot → Logs ищите:

```
🚀 Запуск Telegram бота...
📋 Проверка переменных окружения...
✅ BOT_TOKEN найден
✅ ADMIN_CHAT_ID найден
🔗 Проверка подключения к базе данных...
🤖 Запуск бота в polling режиме...
✅ Бот успешно запущен!
🎉 Бот полностью готов к работе!
```

### 4. Проверьте health check

Откройте URL бота: `https://your-bot-name.railway.app/health`

Должен вернуться:
```json
{"status":"ok","timestamp":"2025-08-17T15:45:51.353Z"}
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

## 🚀 Быстрое решение

1. **Перезапустите сервис** в Railway
2. **Проверьте переменные окружения**
3. **Проверьте логи** на наличие ошибок
4. **Проверьте health check** URL

## 📞 Поддержка

Если проблема не решается:

1. Скопируйте логи из Railway
2. Проверьте все переменные окружения
3. Убедитесь, что бот не заблокирован в Telegram
4. Проверьте, что токен бота действителен 