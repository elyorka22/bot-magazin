'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { CategoryCard } from '../components/CategoryCard'
import { Cart } from '../components/Cart'
import { initializeTelegramApp } from '../lib/telegram'
import { mockCategories, mockProducts } from '../data/mockData'
import { Product, Category, CartItem } from '../types'

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    // Инициализация Telegram WebApp
    initializeTelegramApp()
  }, [])

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product_id === product.id)
    
    if (existingItem) {
      setCartItems(prev => 
        prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCartItems(prev => [...prev, {
        id: Math.random().toString(),
        product_id: product.id,
        product,
        quantity: 1
      }])
    }
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product_id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId))
  }

  const handleCheckout = async (orderData: any) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        // Очищаем корзину после успешного заказа
        setCartItems([])
        
        // Показываем уведомление об успешном заказе
        alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.')
      } else {
        throw new Error(result.error || 'Ошибка оформления заказа')
      }
    } catch (error) {
      console.error('Ошибка оформления заказа:', error)
      throw error
    }
  }

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setShowMenu(false)
  }

  const filteredProducts = selectedCategory 
    ? mockProducts.filter(product => product.category_id === selectedCategory.id)
    : mockProducts

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-tg-dark">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setShowCart(true)}
        onMenuClick={() => setShowMenu(!showMenu)}
      />

      {/* Мобильное меню */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-tg-gray-900 shadow-xl p-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-tg-light mb-4">Категории</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryClick(null as any)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  !selectedCategory ? 'bg-tg-primary text-tg-dark' : 'hover:bg-tg-gray-800 text-tg-light'
                }`}
              >
                Все товары
              </button>
              {mockCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory?.id === category.id ? 'bg-tg-primary text-tg-dark' : 'hover:bg-tg-gray-800 text-tg-light'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Корзина */}
      {showCart && (
        <Cart
          cartItems={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeCartItem}
          onCheckout={handleCheckout}
        />
      )}

      <main className="p-3">
        {/* Категории */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-tg-light mb-3">Категории</h2>
          <div className="grid grid-cols-2 gap-3">
            {mockCategories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </section>

        {/* Товары */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-tg-light">
              {selectedCategory ? selectedCategory.name : 'Популярные товары'}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-tg-primary hover:text-tg-light transition-colors text-sm"
              >
                Показать все
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-6">
              <p className="text-tg-gray-400 text-sm">Товары не найдены</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
} 