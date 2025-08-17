# 🛍 Руководство по добавлению товаров

## Способы добавления товаров

### 1. **Через Supabase Dashboard (Рекомендуется для начала)**

#### Шаг 1: Настройка базы данных
1. Зайдите в [supabase.com](https://supabase.com)
2. Создайте новый проект
3. В разделе "SQL Editor" выполните скрипт из `database/schema.sql`

#### Шаг 2: Добавление товаров через интерфейс
1. В Supabase Dashboard перейдите в "Table Editor"
2. Выберите таблицу "products"
3. Нажмите "Insert row" и заполните поля:

```json
{
  "name": "Название товара",
  "description": "Подробное описание товара",
  "price": 2500,
  "sale_price": 1999,
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Белый", "Черный"],
  "stock_quantity": 15,
  "category_id": "uuid-категории"
}
```

### 2. **Через админ-панель (После деплоя)**

1. Откройте ваш сайт: `https://your-app.railway.app/admin`
2. Нажмите "Добавить товар"
3. Заполните форму и сохраните

### 3. **Через API (Для разработчиков)**

```bash
# Добавление товара через API
curl -X POST https://your-app.railway.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Название товара",
    "description": "Описание",
    "price": 2500,
    "category_id": "uuid-категории",
    "stock_quantity": 10,
    "images": ["https://example.com/image.jpg"],
    "sizes": ["S", "M", "L"],
    "colors": ["Белый"]
  }'
```

## 📋 Структура товара

### Обязательные поля:
- `name` - название товара
- `description` - описание
- `price` - цена (число)
- `category_id` - ID категории
- `stock_quantity` - количество на складе
- `images` - массив URL изображений

### Опциональные поля:
- `sale_price` - цена со скидкой
- `sizes` - массив размеров
- `colors` - массив цветов
- `is_active` - активен ли товар (по умолчанию true)

## 🖼️ Изображения товаров

### Рекомендации:
- **Размер**: 800x800 пикселей
- **Формат**: JPG или PNG
- **Вес**: до 2MB
- **Количество**: 3-5 изображений на товар

### Бесплатные источники изображений:
- [Unsplash](https://unsplash.com) - высококачественные фото
- [Pexels](https://pexels.com) - бесплатные стоковые фото
- [Pixabay](https://pixabay.com) - бесплатные изображения

### Примеры URL изображений:
```
https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop
https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop
https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop
```

## 📊 Категории товаров

### Доступные категории:
1. **Футболки и рубашки** (`t-shirts-shirts`)
2. **Джинсы и брюки** (`jeans-pants`)
3. **Куртки и пальто** (`jackets-coats`)
4. **Спортивная одежда** (`sportswear`)
5. **Обувь** (`shoes`)
6. **Аксессуары** (`accessories`)

### Добавление новой категории:
```sql
INSERT INTO categories (name, slug, image_url, sort_order) 
VALUES ('Новая категория', 'new-category', 'https://example.com/image.jpg', 7);
```

## 💰 Ценообразование

### Рекомендации по ценам:
- **Футболки**: 1500-3000 ₽
- **Рубашки**: 3000-6000 ₽
- **Джинсы**: 4000-8000 ₽
- **Куртки**: 8000-20000 ₽
- **Обувь**: 5000-15000 ₽
- **Аксессуары**: 1000-5000 ₽

### Скидки:
- Устанавливайте `sale_price` меньше `price`
- Рекомендуемая скидка: 10-30%
- Пример: цена 3000 ₽, скидка 2400 ₽ (скидка 20%)

## 📦 Управление остатками

### Рекомендации:
- **Низкий остаток**: 1-5 штук
- **Средний остаток**: 6-20 штук
- **Высокий остаток**: 20+ штук
- **Нет в наличии**: 0 штук

### Автоматическое обновление:
После каждого заказа остатки автоматически уменьшаются.

## 🔧 Полезные SQL запросы

### Получить все товары с категориями:
```sql
SELECT p.*, c.name as category_name 
FROM products p 
JOIN categories c ON p.category_id = c.id 
WHERE p.is_active = true;
```

### Товары со скидкой:
```sql
SELECT * FROM products 
WHERE sale_price IS NOT NULL 
AND sale_price < price;
```

### Товары с низким остатком:
```sql
SELECT * FROM products 
WHERE stock_quantity <= 5 
AND is_active = true;
```

### Обновить остатки:
```sql
UPDATE products 
SET stock_quantity = 10 
WHERE id = 'product-uuid';
```

## 🚀 Массовое добавление товаров

### Через SQL:
```sql
INSERT INTO products (name, description, price, category_id, stock_quantity, images, sizes, colors) VALUES
('Товар 1', 'Описание 1', 2500, 'category-uuid', 15, ARRAY['image1.jpg'], ARRAY['S', 'M', 'L'], ARRAY['Белый']),
('Товар 2', 'Описание 2', 3500, 'category-uuid', 10, ARRAY['image2.jpg'], ARRAY['M', 'L'], ARRAY['Черный']),
('Товар 3', 'Описание 3', 4500, 'category-uuid', 8, ARRAY['image3.jpg'], ARRAY['L', 'XL'], ARRAY['Синий']);
```

### Через CSV импорт:
1. Подготовьте CSV файл с товарами
2. В Supabase Dashboard → Table Editor → Import
3. Загрузите CSV файл

## 📱 Проверка товаров

### В магазине:
1. Откройте ваш сайт
2. Проверьте отображение товаров
3. Убедитесь, что цены и остатки корректны

### В боте:
1. Отправьте боту команду `/start`
2. Нажмите "🛍 Открыть магазин"
3. Проверьте товары в Mini App

## 🛠️ Устранение проблем

### Товар не отображается:
1. Проверьте `is_active = true`
2. Убедитесь, что `stock_quantity > 0`
3. Проверьте правильность `category_id`

### Ошибки изображений:
1. Проверьте доступность URL
2. Убедитесь, что изображения загружаются
3. Используйте HTTPS ссылки

### Проблемы с ценами:
1. Проверьте, что `price` - число
2. Убедитесь, что `sale_price < price`
3. Проверьте формат цен (без символа ₽ в базе) 