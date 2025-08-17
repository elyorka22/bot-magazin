import { supabase } from '../config/database'
import { Order, OrderItem } from '../types'

export class OrderService {
  // Получить все заказы
  static async getAllOrders(): Promise<Order[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Ошибка получения заказов:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Ошибка получения заказов:', error)
      return []
    }
  }

  // Получить заказы пользователя
  static async getUserOrders(telegramUserId: number): Promise<Order[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('telegram_user_id', telegramUserId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Ошибка получения заказов пользователя:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Ошибка получения заказов пользователя:', error)
      return []
    }
  }

  // Получить заказ по ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем null.')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) {
        console.error('Ошибка получения заказа:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Ошибка получения заказа:', error)
      return null
    }
  }

  // Получить позиции заказа
  static async getOrderItems(orderId: string): Promise<OrderItem[]> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустой массив.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(id, name, price, sale_price, images)
        `)
        .eq('order_id', orderId)

      if (error) {
        console.error('Ошибка получения позиций заказа:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Ошибка получения позиций заказа:', error)
      return []
    }
  }

  // Обновить статус заказа
  static async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Операция не выполнена.')
      return false
    }

    try {
      const updateData: any = { status }
      
      // Добавляем временную метку в зависимости от статуса
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString()
      } else if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString()
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      if (error) {
        console.error('Ошибка обновления статуса заказа:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Ошибка обновления статуса заказа:', error)
      return false
    }
  }

  // Создать новый заказ
  static async createOrder(orderData: any): Promise<string | null> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Заказ не создан.')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single()

      if (error) {
        console.error('Ошибка создания заказа:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Ошибка создания заказа:', error)
      return null
    }
  }

  // Получить статистику заказов
  static async getOrderStats(): Promise<any> {
    if (!supabase) {
      console.log('⚠️  Supabase не настроен. Возвращаем пустую статистику.')
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      }
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')

      if (error) {
        console.error('Ошибка получения статистики:', error)
        return {
          total: 0,
          pending: 0,
          confirmed: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        }
      }

      const stats = {
        total: data?.length || 0,
        pending: data?.filter(o => o.status === 'pending').length || 0,
        confirmed: data?.filter(o => o.status === 'confirmed').length || 0,
        shipped: data?.filter(o => o.status === 'shipped').length || 0,
        delivered: data?.filter(o => o.status === 'delivered').length || 0,
        cancelled: data?.filter(o => o.status === 'cancelled').length || 0
      }

      return stats
    } catch (error) {
      console.error('Ошибка получения статистики:', error)
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      }
    }
  }
} 