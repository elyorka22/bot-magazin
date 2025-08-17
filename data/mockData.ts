import { Product, Category } from '../types'

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Футболки и рубашки',
    slug: 't-shirts-shirts',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=200&fit=crop',
    sort_order: 1
  },
  {
    id: '2',
    name: 'Джинсы и брюки',
    slug: 'jeans-pants',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=200&fit=crop',
    sort_order: 2
  },
  {
    id: '3',
    name: 'Куртки и пальто',
    slug: 'jackets-coats',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=200&fit=crop',
    sort_order: 3
  },
  {
    id: '4',
    name: 'Спортивная одежда',
    slug: 'sportswear',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    sort_order: 4
  },
  {
    id: '5',
    name: 'Обувь',
    slug: 'shoes',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=200&fit=crop',
    sort_order: 5
  },
  {
    id: '6',
    name: 'Аксессуары',
    slug: 'accessories',
    image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=200&fit=crop',
    sort_order: 6
  }
]

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Классическая белая футболка',
    description: 'Универсальная белая футболка из 100% хлопка. Идеально подходит для повседневной носки.',
    price: 2500,
    sale_price: 1999,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Белый', 'Черный', 'Серый'],
    stock_quantity: 15,
    is_active: true,
    category_id: '1',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Джинсы классического кроя',
    description: 'Классические джинсы прямого кроя из качественного денима. Комфортные и стильные.',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Синий', 'Черный'],
    stock_quantity: 8,
    is_active: true,
    category_id: '2',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Кожаная куртка',
    description: 'Стильная кожаная куртка для прохладной погоды. Качественная кожа и современный дизайн.',
    price: 15000,
    sale_price: 12999,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Черный', 'Коричневый'],
    stock_quantity: 5,
    is_active: true,
    category_id: '3',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Спортивные штаны',
    description: 'Удобные спортивные штаны для тренировок и активного отдыха. Быстросохнущий материал.',
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Черный', 'Серый', 'Синий'],
    stock_quantity: 12,
    is_active: true,
    category_id: '4',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Кроссовки Nike Air Max',
    description: 'Классические кроссовки Nike Air Max с технологией Air для максимального комфорта.',
    price: 12000,
    sale_price: 9999,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Белый', 'Черный'],
    stock_quantity: 0,
    is_active: true,
    category_id: '5',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Кожаный ремень',
    description: 'Качественный кожаный ремень с металлической пряжкой. Подходит для любого случая.',
    price: 2500,
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop'
    ],
    sizes: ['L', 'XL'],
    colors: ['Коричневый', 'Черный'],
    stock_quantity: 20,
    is_active: true,
    category_id: '6',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'Рубашка Oxford',
    description: 'Классическая рубашка Oxford из хлопка. Идеально подходит для офиса и повседневной носки.',
    price: 5500,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Белый', 'Голубой', 'Розовый'],
    stock_quantity: 10,
    is_active: true,
    category_id: '1',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Брюки чинос',
    description: 'Универсальные брюки чинос из хлопка. Комфортные и стильные для любого случая.',
    price: 4000,
    sale_price: 3200,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Бежевый', 'Синий', 'Зеленый'],
    stock_quantity: 7,
    is_active: true,
    category_id: '2',
    created_at: '2024-01-01T00:00:00Z'
  }
] 