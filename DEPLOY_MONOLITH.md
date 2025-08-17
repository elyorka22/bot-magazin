# 🚀 Деплой монолитного репозитория на Railway

## 📋 Что такое монолитный репозиторий?

Монолитный репозиторий содержит и веб-приложение (Next.js), и Telegram бота в одном репозитории. Railway может деплоить оба сервиса из одного репозитория.

## 🏗️ Структура проекта

```
bot-magazin/
├── app/                    # Next.js приложение
├── bot/                    # Telegram бот
├── components/             # React компоненты
├── Dockerfile              # Для веб-приложения
├── bot/Dockerfile          # Для бота
├── docker-compose.yml      # Локальная разработка
├── railway.json            # Конфигурация Railway
└── package.json            # Корневой package.json
```

## ⚙️ Настройка Railway

### 1. Создание проекта в Railway

1. Зайдите на [railway.app](https://railway.app)
2. Создайте новый проект
3. Выберите "Deploy from GitHub repo"
4. Выберите репозиторий `elyorka22/bot-magazin`

### 2. Настройка переменных окружения

В Railway Dashboard → Variables добавьте:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hzvfnayrcwinqpaksdnm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dmZuYXlyY3dpbnFwYWtzZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDA5MzYsImV4cCI6MjA3MTAxNjkzNn0.TrnsqlL1hx48t4VUeqg_vFgXvb2ZUbdrZb8Ult3zL7o
SUPABASE_SERVICE_ROLE_KEY=ВАШ_SERVICE_ROLE_KEY

# Telegram Bot Configuration
BOT_TOKEN=7252780069:AAFScwII3euyAvqmZHuxxvAoKzovgkeKtVk
ADMIN_CHAT_ID=1129806592

# Environment
NODE_ENV=production
```

### 3. Настройка сервисов

Railway автоматически создаст два сервиса:

1. **web-app** - веб-приложение (Next.js)
2. **telegram-bot** - Telegram бот

### 4. Настройка доменов

После деплоя Railway создаст домены:
- `https://your-app-name.railway.app` - для веб-приложения
- `https://your-app-name-bot.railway.app` - для бота

Обновите переменную:
```env
MINI_APP_URL=https://your-app-name.railway.app
```

## 🔧 Локальная разработка

### Запуск всех сервисов:
```bash
npm run dev
```

### Запуск только веб-приложения:
```bash
npm run dev:web
```

### Запуск только бота:
```bash
npm run dev:bot
```

### Запуск через Docker:
```bash
docker-compose up --build
```

## 📱 Настройка Telegram бота

### 1. Настройка кнопки меню:
Отправьте @BotFather:
```
/setmenubutton
```

Выберите бота и введите:
- URL: `https://your-app-name.railway.app`
- Текст: `🛍 Открыть магазин`

### 2. Проверка работы бота:
1. Найдите бота в Telegram
2. Отправьте `/start`
3. Проверьте кнопку "🛍 Открыть магазин"

## 🚨 Устранение проблем

### Проблема: Бот не отвечает
1. Проверьте логи в Railway Dashboard → telegram-bot → Logs
2. Убедитесь, что переменные окружения настроены
3. Проверьте, что бот не заблокирован

### Проблема: Веб-приложение не загружается
1. Проверьте логи в Railway Dashboard → web-app → Logs
2. Убедитесь, что Supabase настроен
3. Проверьте переменные окружения

### Проблема: Ошибки сборки
1. Проверьте логи сборки в Railway
2. Убедитесь, что все зависимости установлены
3. Проверьте синтаксис TypeScript

## 🔄 Обновления

### Автоматический деплой:
- При пуше в main ветку Railway автоматически пересоберет и развернет оба сервиса

### Ручной деплой:
- В Railway Dashboard → Deployments → Deploy Now

## 📊 Мониторинг

### Логи:
- Railway Dashboard → web-app → Logs
- Railway Dashboard → telegram-bot → Logs

### Метрики:
- Railway предоставляет метрики для каждого сервиса
- Следите за производительностью и ошибками

## 💰 Стоимость

Railway предоставляет:
- **Бесплатный план**: $5 кредитов в месяц
- **Платный план**: $20/месяц за 1000 часов

Для монолитного репозитория с двумя сервисами может потребоваться платный план.

## ✅ Проверка деплоя

### 1. Проверка веб-приложения:
- Откройте URL веб-приложения
- Убедитесь, что сайт загружается
- Проверьте функциональность

### 2. Проверка бота:
- Найдите бота в Telegram
- Отправьте `/start`
- Проверьте команды и кнопки

### 3. Проверка интеграции:
- Нажмите кнопку "🛍 Открыть магазин" в боте
- Убедитесь, что открывается веб-приложение
- Проверьте функциональность Mini App 