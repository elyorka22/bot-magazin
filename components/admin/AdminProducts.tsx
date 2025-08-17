import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Product, Category } from '../../types'
import { mockCategories, mockProducts } from '../../data/mockData'

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Форма добавления/редактирования товара
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
      // В реальном приложении здесь будет загрузка из API
      setProducts(mockProducts)
      setCategories(mockCategories)
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

      if (editingProduct) {
        // Обновление товара
        console.log('Обновление товара:', productData)
      } else {
        // Добавление товара
        console.log('Добавление товара:', productData)
      }
      
      // Очистка формы
      resetForm()
      loadData() // Перезагрузка данных
    } catch (error) {
      console.error('Ошибка сохранения товара:', error)
    }
  }

  const resetForm = () => {
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
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.sale_price?.toString() || '',
      categoryId: product.category_id,
      stockQuantity: product.stock_quantity.toString(),
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      images: product.images?.join(', ') || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        console.log('Удаление товара:', productId)
        loadData() // Перезагрузка данных
      } catch (error) {
        console.error('Ошибка удаления товара:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-tg-light">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-tg-light">Управление товарами</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить товар
        </button>
      </div>

      {/* Форма добавления/редактирования товара */}
      {showAddForm && (
        <div className="bg-tg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-tg-light mb-4">
            {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  Название товара *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  Категория *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  Цена со скидкой (₽)
                </label>
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  Количество на складе *
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-tg-light text-sm font-medium mb-2">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-field resize-none"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  Размеры (через запятую)
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                  className="input-field"
                  placeholder="S, M, L, XL"
                />
              </div>
              
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  Цвета (через запятую)
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({...formData, colors: e.target.value})}
                  className="input-field"
                  placeholder="Белый, Черный, Синий"
                />
              </div>
              
              <div>
                <label className="block text-tg-light text-sm font-medium mb-2">
                  URL изображений (через запятую) *
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  className="input-field"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {editingProduct ? 'Обновить товар' : 'Добавить товар'}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className="btn-secondary"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список товаров */}
      <div className="bg-tg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-tg-light mb-4">Список товаров</h3>
        
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
                  <td className="p-2">
                    {categories.find(c => c.id === product.category_id)?.name || product.category_id}
                  </td>
                  <td className="p-2">{product.price.toLocaleString('ru-RU')} ₽</td>
                  <td className="p-2">
                    {product.sale_price ? `${product.sale_price.toLocaleString('ru-RU')} ₽` : '-'}
                  </td>
                  <td className="p-2">{product.stock_quantity}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1 rounded hover:bg-tg-gray-700 transition-colors text-tg-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 rounded hover:bg-tg-gray-700 transition-colors text-tg-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 