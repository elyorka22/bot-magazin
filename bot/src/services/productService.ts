import { supabase } from '../config/database'
import { Product, Category } from '../types'

export class ProductService {
  // Получить все товары
  static async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Ошибка получения товаров:', error)
      throw error
    }
    
    return data || []
  }

  // Получить товары по категории
  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Ошибка получения товаров по категории:', error)
      throw error
    }
    
    return data || []
  }

  // Получить товар по ID
  static async getProductById(productId: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()
    
    if (error) {
      console.error('Ошибка получения товара:', error)
      return null
    }
    
    return data
  }

  // Получить все категории
  static async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Ошибка получения категорий:', error)
      throw error
    }
    
    return data || []
  }

  // Получить популярные товары (с наибольшим количеством заказов)
  static async getPopularProducts(limit: number = 5): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        order_items!inner(count)
      `)
      .eq('is_active', true)
      .order('order_items.count', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Ошибка получения популярных товаров:', error)
      // Если запрос не работает, возвращаем обычные товары
      return this.getAllProducts()
    }
    
    return data || []
  }

  // Обновить количество товара на складе
  static async updateStockQuantity(productId: string, quantity: number): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', productId)
    
    if (error) {
      console.error('Ошибка обновления количества товара:', error)
      return false
    }
    
    return true
  }

  // Поиск товаров по названию
  static async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Ошибка поиска товаров:', error)
      throw error
    }
    
    return data || []
  }
} 