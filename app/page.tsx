'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { CategoryCard } from '../components/CategoryCard'
import { initializeTelegramApp } from '../lib/telegram'
import { mockCategories, mockProducts } from '../data/mockData'
import { Product, Category, CartItem } from '../types'

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showMenu, setShowMenu] = useState(false)

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
        onCartClick={() => {/* TODO: Открыть корзину */}}
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

      <main className="p-4">
        {/* Категории */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-tg-light mb-4">Категории</h2>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-tg-light">
              {selectedCategory ? selectedCategory.name : 'Популярные товары'}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-tg-primary hover:text-tg-light transition-colors"
              >
                Показать все
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-tg-gray-400">Товары не найдены</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
} 