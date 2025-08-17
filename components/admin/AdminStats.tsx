import React, { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
  }>
}

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // В реальном приложении здесь будет загрузка из API
      // Пока используем моковые данные
      const mockStats: Stats = {
        totalOrders: 156,
        totalRevenue: 1250000,
        pendingOrders: 23,
        completedOrders: 133,
        averageOrderValue: 8012,
        topProducts: [
          { name: 'Классический костюм', orders: 45, revenue: 360000 },
          { name: 'Джинсы премиум', orders: 38, revenue: 285000 },
          { name: 'Рубашка хлопковая', orders: 32, revenue: 128000 },
          { name: 'Кроссовки спортивные', orders: 28, revenue: 224000 },
          { name: 'Куртка зимняя', orders: 25, revenue: 200000 }
        ]
      }
      
      setStats(mockStats)
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-tg-light">Загрузка статистики...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-tg-gray-400">Статистика недоступна</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-tg-light">Статистика магазина</h2>
        <div className="text-tg-gray-400 text-sm">
          Обновлено: {new Date().toLocaleDateString('ru-RU')}
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-tg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-tg-gray-400 text-sm">Всего заказов</p>
              <p className="text-2xl font-bold text-tg-light">{stats.totalOrders}</p>
            </div>
            <div className="bg-tg-primary/20 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-tg-primary" />
            </div>
          </div>
        </div>

        <div className="bg-tg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-tg-gray-400 text-sm">Общая выручка</p>
              <p className="text-2xl font-bold text-tg-primary">
                {stats.totalRevenue.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="bg-tg-success/20 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-tg-success" />
            </div>
          </div>
        </div>

        <div className="bg-tg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-tg-gray-400 text-sm">Ожидают обработки</p>
              <p className="text-2xl font-bold text-tg-warning">{stats.pendingOrders}</p>
            </div>
            <div className="bg-tg-warning/20 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-tg-warning" />
            </div>
          </div>
        </div>

        <div className="bg-tg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-tg-gray-400 text-sm">Средний чек</p>
              <p className="text-2xl font-bold text-tg-info">
                {stats.averageOrderValue.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="bg-tg-info/20 p-2 rounded-lg">
              <Users className="w-6 h-6 text-tg-info" />
            </div>
          </div>
        </div>
      </div>

      {/* Детальная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Статусы заказов */}
        <div className="bg-tg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-tg-light mb-4">Статусы заказов</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-tg-light">Выполнено</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-tg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-tg-success h-2 rounded-full" 
                    style={{ width: `${(stats.completedOrders / stats.totalOrders) * 100}%` }}
                  ></div>
                </div>
                <span className="text-tg-success font-semibold">{stats.completedOrders}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-tg-light">Ожидают обработки</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-tg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-tg-warning h-2 rounded-full" 
                    style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                  ></div>
                </div>
                <span className="text-tg-warning font-semibold">{stats.pendingOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Популярные товары */}
        <div className="bg-tg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-tg-light mb-4">Популярные товары</h3>
          
          <div className="space-y-3">
            {stats.topProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-tg-light text-sm truncate">{product.name}</p>
                  <p className="text-tg-gray-400 text-xs">
                    {product.orders} заказов • {product.revenue.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="text-tg-primary font-semibold text-sm">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* График выручки (заглушка) */}
      <div className="bg-tg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-tg-light mb-4">Выручка по месяцам</h3>
        
        <div className="h-32 flex items-end justify-between gap-2">
          {['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'].map((month, index) => {
            const height = Math.random() * 80 + 20 // Случайная высота для демонстрации
            return (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-tg-primary rounded-t w-full"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-tg-gray-400 text-xs mt-2">{month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 