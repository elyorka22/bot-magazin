'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { Product, Category } from '../../types'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Форма добавления товара
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    stockQuantity: '',
    sizes: '',
    colors: '',
    images: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Здесь будет загрузка данных из Supabase
      // Пока используем моковые данные
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
        category_id: formData.categoryId,
        stock_quantity: parseInt(formData.stockQuantity),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
        images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
        is_active: true
      }

      // Здесь будет отправка данных в Supabase
      console.log('Добавление товара:', productData)
      
      // Очистка формы
      setFormData({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        categoryId: '',
        stockQuantity: '',
        sizes: '',
        colors: '',
        images: ''
      })
      
      setShowAddForm(false)
      loadData() // Перезагрузка данных
    } catch (error) {
      console.error('Ошибка добавления товара:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-tg-dark flex items-center justify-center">
        <div className="text-tg-light">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tg-dark p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-tg-light">Админ-панель</h1>
          <Button onClick={() => setShowAddForm(true)}>
            + Добавить товар
          </Button>
        </div>

        {/* Форма добавления товара */}
        {showAddForm && (
          <div className="bg-tg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-tg-light mb-4">Добавить новый товар</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Название товара"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                
                <Input
                  label="Категория"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  required
                />
                
                <Input
                  label="Цена (₽)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
                
                <Input
                  label="Цена со скидкой (₽)"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                />
                
                <Input
                  label="Количество на складе"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                  required
                />
              </div>
              
              <Textarea
                label="Описание"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Размеры (через запятую)"
                  value={formData.sizes}
                  onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                  placeholder="S, M, L, XL"
                />
                
                <Input
                  label="Цвета (через запятую)"
                  value={formData.colors}
                  onChange={(e) => setFormData({...formData, colors: e.target.value})}
                  placeholder="Белый, Черный, Синий"
                />
                
                <Input
                  label="URL изображений (через запятую)"
                  value={formData.images}
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  Добавить товар
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Список товаров */}
        <div className="bg-tg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-tg-light mb-4">Товары</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-tg-light">
              <thead>
                <tr className="border-b border-tg-gray-700">
                  <th className="text-left p-2">Название</th>
                  <th className="text-left p-2">Категория</th>
                  <th className="text-left p-2">Цена</th>
                  <th className="text-left p-2">Скидка</th>
                  <th className="text-left p-2">Остаток</th>
                  <th className="text-left p-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-tg-gray-700">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.category_id}</td>
                    <td className="p-2">{product.price} ₽</td>
                    <td className="p-2">
                      {product.sale_price ? `${product.sale_price} ₽` : '-'}
                    </td>
                    <td className="p-2">{product.stock_quantity}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Редактировать</Button>
                        <Button size="sm" variant="secondary">Удалить</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 