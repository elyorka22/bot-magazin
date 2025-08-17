export interface User {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface Order {
  id: string
  user_id: string
  telegram_user_id: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  customer_name: string
  customer_phone: string
  delivery_address: string
  delivery_notes?: string
  delivery_method: 'courier' | 'pickup'
  delivery_cost: number
  payment_method: 'cash'
  payment_status: 'pending' | 'paid'
  created_at: string
  confirmed_at?: string
  shipped_at?: string
  delivered_at?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product: {
    id: string
    name: string
    price: number
    sale_price?: number
    images: string[]
  }
  quantity: number
  price: number
  size?: string
  color?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  sale_price?: number
  images: string[]
  sizes?: string[]
  colors?: string[]
  stock_quantity: number
  is_active: boolean
  category_id: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
  sort_order: number
}

export interface BotContext {
  user?: User
  chat?: any
  message?: any
  callbackQuery?: any
} 