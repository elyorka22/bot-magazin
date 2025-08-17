import { supabase } from '../config/database'
import { Product, Category } from '../types'

export class ProductService {
  // Получить все товары
  static async getAllProducts(): Promise<Product[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Ошибка получения товаров:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Ошибка получения товаров:', error)
      return []
    }
  }

  // Получить товары по категории
  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Ошибка получения товаров по категории:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Ошибка получения товаров по категории:', error)
      return []
    }
  }

  // Получить товар по ID
  static async getProductById(productId: string): Promise<Product | null> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем null.')
      return null
    }

    try {
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
    } catch (error) {
      console.error('Ошибка получения товара:', error)
      return null
    }
  }

  // Получить все категории
  static async getAllCategories(): Promise<Category[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) {
        console.error('Ошибка получения категорий:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Ошибка получения категорий:', error)
      return []
    }
  }

  // Получить популярные товары (с наибольшим количеством заказов)
  static async getPopularProducts(limit: number = 5): Promise<Product[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
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
    } catch (error) {
      console.error('Ошибка получения популярных товаров:', error)
      return this.getAllProducts()
    }
  }

  // Обновить количество товара на складе
  static async updateStockQuantity(productId: string, quantity: number): Promise<boolean> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Операция не выполнена.')
      return false
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: quantity })
        .eq('id', productId)
      
      if (error) {
        console.error('Ошибка обновления количества товара:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Ошибка обновления количества товара:', error)
      return false
    }
  }

  // Поиск товаров по названию
  static async searchProducts(query: string): Promise<Product[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Ошибка поиска товаров:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Ошибка поиска товаров:', error)
      return []
    }
  }
} 