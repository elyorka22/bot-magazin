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
    // Telegram WebApp ni ishga tushirish
    initializeTelegramApp()
    
    // Avtorizatsiya tekshiruvi (haqiqiy ilovada bu yerda token tekshiruvi bo'lishi kerak)
    // Hozircha faqat ruxsat beramiz
    setIsAuthorized(true)
  }, [])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-tg-dark flex items-center justify-center">
        <div className="bg-tg-gray-900 rounded-xl p-6 max-w-sm w-full mx-4">
          <h1 className="text-xl font-bold text-tg-light mb-4">Kirish taqiqlangan</h1>
          <p className="text-tg-gray-400">Sizda admin paneliga kirish huquqi yo'q.</p>
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

      {/* Admin sarlavhasi */}
      <div className="p-4 border-b border-tg-gray-700">
        <h1 className="text-xl font-bold text-tg-light">Admin paneli</h1>
        <p className="text-tg-gray-400 text-sm">Do'konni boshqarish</p>
      </div>

      {/* Tab navigatsiyasi */}
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
            🛍 Mahsulotlar
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-tg-primary text-tg-dark'
                : 'bg-tg-gray-800 text-tg-light hover:bg-tg-gray-700'
            }`}
          >
            📦 Buyurtmalar
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'bg-tg-primary text-tg-dark'
                : 'bg-tg-gray-800 text-tg-light hover:bg-tg-gray-700'
            }`}
          >
            📊 Statistika
          </button>
        </div>
      </div>

      {/* Tab kontenti */}
      <div className="p-4">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'stats' && <AdminStats />}
      </div>
    </div>
  )
} 