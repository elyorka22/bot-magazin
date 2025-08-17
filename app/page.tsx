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
        setCartItems([])
        alert('Buyurtma muvaffaqiyatli berildi! Tez orada siz bilan bog\'lanamiz.')
      } else {
        throw new Error(result.error || 'Buyurtma berishda xatolik')
      }
    } catch (error) {
      console.error('Buyurtma berishda xatolik:', error)
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

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden">
          <div className="bg-tg-gray-900 h-full w-64 p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-tg-light">Menu</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="p-1 rounded-lg hover:bg-tg-gray-800 transition-colors"
              >
                <span className="text-tg-light text-xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-left p-3 rounded-lg hover:bg-tg-gray-800 transition-colors text-tg-light"
              >
                Barcha mahsulotlar
              </button>
              {mockCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="w-full text-left p-3 rounded-lg hover:bg-tg-gray-800 transition-colors text-tg-light"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Component */}
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
        {/* Categories Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-tg-light">Kategoriyalar</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-tg-primary hover:underline"
              >
                Hammasini ko'rsatish
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mockCategories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-tg-light">
              {selectedCategory ? selectedCategory.name : 'Barcha mahsulotlar'}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-tg-primary hover:underline"
              >
                Hammasini ko'rsatish
              </button>
            )}
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-tg-gray-400">Mahsulotlar topilmadi</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
} 