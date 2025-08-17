import { supabase } from '../config/database'
import { Order, OrderItem } from '../types'

export class OrderService {
  // Получить все заказы
  static async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Ошибка получения заказов:', error)
      throw error
    }
    
    return data || []
  }

  // Получить заказы пользователя
  static async getUserOrders(telegramUserId: number): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('telegram_user_id', telegramUserId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Ошибка получения заказов пользователя:', error)
      throw error
    }
    
    return data || []
  }

  // Получить заказ по ID
  static async getOrderById(orderId: string): Promise<Order | null> {
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
  }

  // Получить позиции заказа
  static async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        *,
        product:products(id, name, price, sale_price, images)
      `)
      .eq('order_id', orderId)
    
    if (error) {
      console.error('Ошибка получения позиций заказа:', error)
      throw error
    }
    
    return data || []
  }

  // Обновить статус заказа
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    const updateData: any = { status }
    
    // Добавляем временную метку в зависимости от статуса
    switch (status) {
      case 'confirmed':
        updateData.confirmed_at = new Date().toISOString()
        break
      case 'shipped':
        updateData.shipped_at = new Date().toISOString()
        break
      case 'delivered':
        updateData.delivered_at = new Date().toISOString()
        break
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
  }

  // Создать новый заказ
  static async createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<string | null> {
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
  }

  // Получить статистику заказов
  static async getOrderStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('status, total_amount')
    
    if (error) {
      console.error('Ошибка получения статистики:', error)
      return null
    }
    
    const stats = {
      total: data.length,
      pending: data.filter(o => o.status === 'pending').length,
      confirmed: data.filter(o => o.status === 'confirmed').length,
      shipped: data.filter(o => o.status === 'shipped').length,
      delivered: data.filter(o => o.status === 'delivered').length,
      cancelled: data.filter(o => o.status === 'cancelled').length,
      totalRevenue: data.reduce((sum, order) => sum + order.total_amount, 0)
    }
    
    return stats
  }
} 