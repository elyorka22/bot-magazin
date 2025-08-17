import React, { useState, useEffect } from 'react'
import { Eye, Check, Truck, Package, X } from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  total_price: number
  status: string
  created_at: string
  items: any[]
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data.orders || [])
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadOrders() // Перезагрузка заказов
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error)
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'confirmed': return '✅'
      case 'shipped': return '🚚'
      case 'delivered': return '🎉'
      case 'cancelled': return '❌'
      default: return '❓'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения'
      case 'confirmed': return 'Подтвержден'
      case 'shipped': return 'Отправлен'
      case 'delivered': return 'Доставлен'
      case 'cancelled': return 'Отменен'
      default: return 'Неизвестно'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-tg-warning'
      case 'confirmed': return 'text-tg-primary'
      case 'shipped': return 'text-tg-info'
      case 'delivered': return 'text-tg-success'
      case 'cancelled': return 'text-tg-error'
      default: return 'text-tg-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-tg-light">Загрузка заказов...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-tg-light">Управление заказами</h2>
        <div className="text-tg-gray-400 text-sm">
          Всего заказов: {orders.length}
        </div>
      </div>

      {/* Список заказов */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-tg-gray-400">Заказов пока нет</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-tg-gray-900 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-tg-light">
                    Заказ #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-tg-gray-400 text-sm">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusEmoji(order.status)} {getStatusText(order.status)}
                  </span>
                  
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="p-1 rounded hover:bg-tg-gray-700 transition-colors text-tg-primary"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-tg-gray-400 text-sm">Клиент</p>
                  <p className="text-tg-light font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-tg-gray-400 text-sm">Телефон</p>
                  <p className="text-tg-light font-medium">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-tg-gray-400 text-sm">Сумма</p>
                  <p className="text-tg-primary font-bold">
                    {order.total_price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>

              {/* Детали заказа */}
              {selectedOrder?.id === order.id && (
                <div className="border-t border-tg-gray-700 pt-4">
                  <h4 className="font-semibold text-tg-light mb-3">Детали заказа</h4>
                  
                  <div className="mb-4">
                    <p className="text-tg-gray-400 text-sm">Адрес доставки</p>
                    <p className="text-tg-light">{order.customer_address}</p>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-tg-gray-400 text-sm mb-2">Товары</p>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-tg-gray-800 rounded p-2">
                            <span className="text-tg-light">{item.product?.name || 'Товар'}</span>
                            <span className="text-tg-gray-400">
                              {item.quantity} × {item.price?.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Кнопки управления статусом */}
                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="btn-primary flex items-center gap-2 text-xs"
                        >
                          <Check className="w-3 h-3" />
                          Подтвердить
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="btn-secondary flex items-center gap-2 text-xs"
                        >
                          <X className="w-3 h-3" />
                          Отменить
                        </button>
                      </>
                    )}
                    
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="btn-primary flex items-center gap-2 text-xs"
                      >
                        <Truck className="w-3 h-3" />
                        Отправить
                      </button>
                    )}
                    
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="btn-primary flex items-center gap-2 text-xs"
                      >
                        <Package className="w-3 h-3" />
                        Доставлен
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 