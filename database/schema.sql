-- Создание таблиц для интернет-магазина

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

-- Вставка базовых категорий
INSERT INTO categories (name, slug, image_url, sort_order) VALUES
('Футболки и рубашки', 't-shirts-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=200&fit=crop', 1),
('Джинсы и брюки', 'jeans-pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=200&fit=crop', 2),
('Куртки и пальто', 'jackets-coats', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=200&fit=crop', 3),
('Спортивная одежда', 'sportswear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop', 4),
('Обувь', 'shoes', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=200&fit=crop', 5),
('Аксессуары', 'accessories', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=200&fit=crop', 6);

-- Вставка примеров товаров
INSERT INTO products (name, description, price, sale_price, images, sizes, colors, stock_quantity, category_id) VALUES
(
  'Классическая белая футболка',
  'Универсальная белая футболка из 100% хлопка. Идеально подходит для повседневной носки.',
  2500,
  1999,
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Белый', 'Черный', 'Серый'],
  15,
  (SELECT id FROM categories WHERE slug = 't-shirts-shirts')
),
(
  'Джинсы классического кроя',
  'Классические джинсы прямого кроя из качественного денима. Комфортные и стильные.',
  4500,
  NULL,
  ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'],
  ARRAY['30', '32', '34', '36'],
  ARRAY['Синий', 'Черный'],
  8,
  (SELECT id FROM categories WHERE slug = 'jeans-pants')
),
(
  'Кожаная куртка',
  'Стильная кожаная куртка для прохладной погоды. Качественная кожа и современный дизайн.',
  15000,
  12999,
  ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
  ARRAY['M', 'L', 'XL'],
  ARRAY['Черный', 'Коричневый'],
  5,
  (SELECT id FROM categories WHERE slug = 'jackets-coats')
); 