# Telegram Bot для магазина "Мужской стиль"

Telegram бот для управления заказами интернет-магазина мужской одежды и аксессуаров.

## 🚀 Возможности

### Для пользователей:
- 🛍 Открытие Mini App магазина
- 📦 Просмотр истории заказов
- 📊 Отслеживание статуса заказов
- 💬 Связь с поддержкой
- ℹ️ Информация о магазине

### Для администраторов:
- 📋 Просмотр всех заказов
- ✅ Подтверждение заказов
- 🚚 Отправка заказов
- 🎉 Отметка о доставке
- ❌ Отмена заказов
- 📊 Статистика продаж

## 🛠 Технологии

- **Node.js** - среда выполнения
- **TypeScript** - типизация
- **Telegraf** - Telegram Bot API
- **Supabase** - база данных
- **dotenv** - переменные окружения

## 📦 Установка

### 1. Клонирование и установка зависимостей

```bash
cd bot
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `env.example`:

```bash
cp env.example .env
```

Заполните переменные в файле `.env`:

```env
# Telegram Bot Token
BOT_TOKEN=7252780069:AAFScwII3euyAvqmZHuxxvAoKzovgkeKtVk

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Mini App URL
MINI_APP_URL=https://your-app-url.railway.app

# Admin Chat ID (замените на ваш ID)
ADMIN_CHAT_ID=your_admin_chat_id

# Environment
NODE_ENV=development
```

### 3. Настройка Supabase

Убедитесь, что в вашей базе данных Supabase созданы следующие таблицы:

```sql
-- Пользователи (профили)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  telegram_id BIGINT UNIQUE,
  username TEXT,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Категории товаров
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Товары
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  images TEXT[],
  sizes TEXT[],
  colors TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Заказы
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  telegram_user_id BIGINT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_notes TEXT,
  delivery_method TEXT DEFAULT 'courier' CHECK (delivery_method IN ('courier', 'pickup')),
  delivery_cost DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP
);

-- Позиции заказов
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Запуск

### Режим разработки

```bash
npm run dev
```

### Продакшн

```bash
npm run build
npm start
```

### Слежение за изменениями

```bash
npm run watch
```

## 📱 Команды бота

### Основные команды:
- `/start` - Главное меню
- `/help` - Справка по использованию
- `/orders` - Мои заказы
- `/support` - Связь с поддержкой
- `/about` - О магазине

### Админские команды:
- `/stats` - Статистика заказов

## 🔧 Настройка бота

### 1. Создание бота через @BotFather

1. Найдите @BotFather в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Получите токен бота

### 2. Настройка WebApp

1. Отправьте @BotFather команду `/setmenubutton`
2. Выберите вашего бота
3. Укажите URL вашего Mini App
4. Установите текст кнопки (например, "🛍 Открыть магазин")

### 3. Настройка команд

Бот автоматически установит команды при запуске, но вы можете настроить их вручную:

```
/setcommands
start - Главное меню
help - Помощь
orders - Мои заказы
support - Поддержка
about - О магазине
```

## 📊 Структура проекта

```
bot/
├── src/
│   ├── config/
│   │   └── database.ts      # Конфигурация Supabase
│   ├── handlers/
│   │   ├── commandHandlers.ts   # Обработчики команд
│   │   └── callbackHandlers.ts  # Обработчики callback
│   ├── services/
│   │   ├── orderService.ts      # Сервис заказов
│   │   └── productService.ts    # Сервис товаров
│   ├── types/
│   │   └── index.ts             # TypeScript типы
│   ├── utils/
│   │   └── messageFormatter.ts  # Форматирование сообщений
│   └── index.ts                 # Основной файл бота
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🔄 Интеграция с Mini App

Бот интегрирован с Telegram Mini App и может:

1. **Получать данные от Mini App** - заказы, пользовательские данные
2. **Отправлять уведомления** - статус заказов, подтверждения
3. **Управлять заказами** - подтверждение, отправка, доставка

### Формат данных от Mini App:

```json
{
  "type": "order",
  "order": {
    "total_amount": 5000,
    "customer_name": "Иван Иванов",
    "customer_phone": "+79001234567",
    "delivery_address": "ул. Примерная, 123",
    "delivery_notes": "Домофон 123",
    "delivery_method": "courier",
    "delivery_cost": 300,
    "items": [
      {
        "product_id": "uuid",
        "quantity": 2,
        "price": 2500,
        "size": "L",
        "color": "Синий"
      }
    ]
  }
}
```

## 🚀 Деплой

### Railway

1. Подключите GitHub репозиторий к Railway
2. Настройте переменные окружения
3. Укажите команду запуска: `npm start`
4. Деплой произойдет автоматически

### Другие платформы

Бот можно развернуть на любой платформе, поддерживающей Node.js:
- Heroku
- DigitalOcean App Platform
- Vercel (с ограничениями)
- AWS Lambda

## 🔒 Безопасность

- Токен бота хранится в переменных окружения
- Админские функции защищены проверкой chat_id
- Все запросы к базе данных валидируются
- Обработка ошибок на всех уровнях

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи бота
2. Убедитесь в правильности переменных окружения
3. Проверьте подключение к Supabase
4. Убедитесь в корректности структуры базы данных

## 📄 Лицензия

MIT License 