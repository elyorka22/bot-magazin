'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '../../components/Header'
import { AdminProducts } from '../../components/admin/AdminProducts'
import { AdminOrders } from '../../components/admin/AdminOrders'
import { AdminStats } from '../../components/admin/AdminStats'
import { initializeTelegramApp } from '../../lib/telegram'

type AdminTab = 'products' | 'orders' | 'stats'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('products')
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Инициализация Telegram WebApp
    initializeTelegramApp()
    
    // Проверка авторизации (в реальном приложении здесь должна быть проверка токена)
    // Пока что просто разрешаем доступ
    setIsAuthorized(true)
  }, [])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-tg-dark flex items-center justify-center">
        <div className="bg-tg-gray-900 rounded-xl p-6 max-w-sm w-full mx-4">
          <h1 className="text-xl font-bold text-tg-light mb-4">Доступ запрещен</h1>
          <p className="text-tg-gray-400">У вас нет доступа к админ-панели.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tg-dark">
      <Header 
        cartItemsCount={0}
        onCartClick={() => {}}
        onMenuClick={() => {}}
        isAdmin={true}
      />

      {/* Админ заголовок */}
      <div className="p-4 border-b border-tg-gray-700">
        <h1 className="text-xl font-bold text-tg-light">Админ-панель</h1>
        <p className="text-tg-gray-400 text-sm">Управление магазином</p>
      </div>

      {/* Навигация по вкладкам */}
      <div className="p-4 border-b border-tg-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'products'
                ? 'bg-tg-primary text-tg-dark'
                : 'bg-tg-gray-800 text-tg-light hover:bg-tg-gray-700'
            }`}
          >
            🛍 Товары
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-tg-primary text-tg-dark'
                : 'bg-tg-gray-800 text-tg-light hover:bg-tg-gray-700'
            }`}
          >
            📦 Заказы
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'bg-tg-primary text-tg-dark'
                : 'bg-tg-gray-800 text-tg-light hover:bg-tg-gray-700'
            }`}
          >
            📊 Статистика
          </button>
        </div>
      </div>

      {/* Контент вкладок */}
      <div className="p-4">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'stats' && <AdminStats />}
      </div>
    </div>
  )
} 