# 🤖 Настройка Telegram бота

## 📋 Требования

1. **Supabase проект** настроен
2. **Telegram бот** создан через @BotFather
3. **Node.js** установлен

## ⚙️ Настройка переменных окружения

### 1. Откройте файл `.env` в папке `bot/`

### 2. Замените placeholder значения на реальные:

```env
# Telegram Bot Token (уже настроен)
BOT_TOKEN=7252780069:AAFScwII3euyAvqmZHuxxvAoKzovgkeKtVk

# Supabase Configuration
SUPABASE_URL=https://ВАШ-PROJECT-ID.supabase.co
SUPABASE_ANON_KEY=ВАШ_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=ВАШ_SERVICE_ROLE_KEY

# Mini App URL (пока оставьте как есть)
MINI_APP_URL=https://your-app-url.railway.app

# Admin Chat ID (ваш Telegram ID)
ADMIN_CHAT_ID=ВАШ_TELEGRAM_ID

# Environment
NODE_ENV=development
```

## 🔍 Где взять данные Supabase

### 1. Откройте [supabase.com](https://supabase.com)
### 2. Выберите ваш проект
### 3. Перейдите в "Settings" → "API"
### 4. Скопируйте данные:

```
Project URL: https://your-project-id.supabase.co
anon public: your_anon_key_here
service_role secret: your_service_role_key_here
```

## 🆔 Как получить ваш Telegram ID

### Способ 1: Через бота @userinfobot
1. Найдите бота @userinfobot в Telegram
2. Отправьте ему любое сообщение
3. Он ответит вашим ID

### Способ 2: Через бота @RawDataBot
1. Найдите бота @RawDataBot в Telegram
2. Отправьте ему сообщение
3. В ответе найдите "id": 123456789

## 🚀 Запуск бота

### 1. Установите зависимости:
```bash
cd bot
npm install
```

### 2. Запустите бота:
```bash
npm run dev
```

### 3. Проверьте работу:
- Найдите вашего бота в Telegram
- Отправьте команду `/start`
- Бот должен ответить

## ✅ Проверка настройки

### Успешный запуск выглядит так:
```
🚀 Запуск Telegram бота...
✅ Подключение к Supabase успешно
✅ Бот успешно запущен!
🤖 Имя бота: Your Bot Name
```

### Если есть ошибки:
1. **Проверьте переменные окружения** в файле `.env`
2. **Убедитесь, что Supabase проект активен**
3. **Проверьте токен бота**

## 🔧 Команды бота

После запуска бот поддерживает команды:
- `/start` - главное меню
- `/help` - помощь
- `/orders` - мои заказы
- `/support` - поддержка
- `/about` - о магазине
- `/stats` - статистика (только для админа)

## 📱 Тестирование

### 1. Отправьте боту `/start`
### 2. Проверьте кнопки меню
### 3. Попробуйте команду `/help`
### 4. Проверьте команду `/orders` (должна быть пустой)

## 🚨 Устранение проблем

### Ошибка "Invalid URL":
- Проверьте `SUPABASE_URL` в файле `.env`
- URL должен начинаться с `https://`

### Ошибка "Invalid token":
- Проверьте `BOT_TOKEN` в файле `.env`
- Убедитесь, что бот не заблокирован

### Ошибка подключения к Supabase:
- Проверьте `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Убедитесь, что проект активен в Supabase

### Бот не отвечает:
- Проверьте, что бот запущен (`npm run dev`)
- Убедитесь, что нет ошибок в консоли
- Проверьте, что бот не заблокирован пользователем 