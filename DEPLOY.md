# 🚀 Деплой в Railway

## Подготовка к деплою

### 1. Создание аккаунта Railway
1. Зайдите на [railway.app](https://railway.app)
2. Создайте аккаунт или войдите через GitHub
3. Подключите ваш GitHub репозиторий

### 2. Настройка Supabase
1. Создайте проект в [supabase.com](https://supabase.com)
2. Получите URL и ключи доступа
3. Создайте таблицы базы данных (см. SQL скрипты в README)

### 3. Настройка Telegram Bot
1. Убедитесь, что бот создан через @BotFather
2. Токен бота: `7252780069:AAFScwII3euyAvqmZHuxxvAoKzovgkeKtVk`

## Деплой

### 1. Подключение репозитория
1. В Railway нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Выберите ваш репозиторий
4. Railway автоматически определит, что это Next.js проект

### 2. Настройка переменных окружения
В Railway Dashboard → Variables добавьте:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=7252780069:AAFScwII3euyAvqmZHuxxvAoKzovgkeKtVk

# Environment
NODE_ENV=production
```

### 3. Настройка домена (ПОДРОБНОЕ ОБЪЯСНЕНИЕ)

#### Что такое домен?
Домен - это адрес вашего сайта в интернете. Например: `https://my-shop.railway.app`

#### Как Railway создает домен:
1. **Автоматически**: Railway создает домен вида: `your-app-name.railway.app`
2. **Пример**: Если ваш проект называется "bot-magazin", то домен будет: `bot-magazin.railway.app`

#### Пошаговая настройка:

**Шаг 1: Получить домен**
1. После деплоя в Railway Dashboard найдите раздел "Settings"
2. В разделе "Domains" вы увидите автоматически созданный домен
3. Он будет выглядеть примерно так: `https://bot-magazin-production-1234.up.railway.app`

**Шаг 2: Скопировать URL**
1. Нажмите на домен, чтобы скопировать его
2. Или просто выделите и скопируйте URL

**Шаг 3: Обновить переменную окружения**
1. В Railway Dashboard → Variables
2. Добавьте новую переменную:
   ```
   NEXT_PUBLIC_MINI_APP_URL=https://bot-magazin-production-1234.up.railway.app
   ```
3. Замените URL на ваш реальный домен

#### Зачем это нужно?
- **Telegram Mini App** должен знать свой URL
- **Бот** использует этот URL для кнопки "Открыть магазин"
- **Пользователи** переходят по этому URL из Telegram

#### Примеры доменов:
```
✅ Правильно:
NEXT_PUBLIC_MINI_APP_URL=https://bot-magazin-production-1234.up.railway.app

❌ Неправильно:
NEXT_PUBLIC_MINI_APP_URL=your-app-url.railway.app
NEXT_PUBLIC_MINI_APP_URL=https://example.com
```

### 4. Настройка Telegram Bot
1. Отправьте @BotFather команду `/setmenubutton`
2. Выберите вашего бота
3. Укажите URL: `https://your-app-name.railway.app`
4. Установите текст кнопки: "🛍 Открыть магазин"

## Проверка деплоя

### 1. Проверка сайта
- Откройте URL вашего приложения
- Убедитесь, что сайт загружается
- Проверьте функциональность

### 2. Проверка бота
- Найдите вашего бота в Telegram
- Отправьте команду `/start`
- Проверьте кнопку "🛍 Открыть магазин"

### 3. Проверка интеграции
- Нажмите кнопку "🛍 Открыть магазин" в боте
- Убедитесь, что открывается ваш сайт
- Проверьте функциональность Mini App

## Мониторинг

### Логи
- В Railway Dashboard → Deployments → View Logs
- Следите за ошибками и предупреждениями

### Метрики
- Railway предоставляет метрики использования
- Следите за производительностью

## Обновления

### Автоматический деплой
- При пуше в main ветку Railway автоматически пересоберет и развернет приложение

### Ручной деплой
- В Railway Dashboard → Deployments → Deploy Now

## Устранение проблем

### Ошибки сборки
1. Проверьте логи сборки в Railway
2. Убедитесь, что все зависимости установлены
3. Проверьте синтаксис TypeScript

### Ошибки подключения к базе данных
1. Проверьте переменные окружения Supabase
2. Убедитесь, что база данных доступна
3. Проверьте права доступа

### Проблемы с ботом
1. Проверьте токен бота
2. Убедитесь, что URL Mini App правильный
3. Проверьте настройки @BotFather

## Стоимость

Railway предоставляет:
- **Бесплатный план**: $5 кредитов в месяц
- **Платный план**: $20/месяц за 1000 часов

Для небольшого проекта бесплатного плана достаточно. 