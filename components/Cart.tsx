import React, { useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { CartItem, Product } from '../types'
import { formatPrice } from '../lib/utils'

interface CartProps {
  cartItems: CartItem[]
  onClose: () => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: (orderData: any) => void
}

export const Cart: React.FC<CartProps> = ({
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  })

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price
    return sum + (price * item.quantity)
  }, 0)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(productId)
    } else {
      onUpdateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring')
      return
    }

    setIsCheckingOut(true)

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.sale_price || item.product.price
        })),
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          comment: formData.comment
        },
        total_price: totalPrice,
        payment_method: 'cash',
        status: 'pending'
      }

      await onCheckout(orderData)
      onClose()
    } catch (error) {
      console.error('Buyurtma berishda xatolik:', error)
      alert('Buyurtma berishda xatolik yuz berdi. Qaytadan urinib ko\'ring.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-tg-gray-900 rounded-xl p-6 max-w-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-tg-light">Savat</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-tg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center py-8">
            <ShoppingBag className="w-16 h-16 text-tg-gray-400 mx-auto mb-4" />
            <p className="text-tg-gray-400 mb-4">Savat bo'sh</p>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Xarid qilishni davom ettirish
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-tg-gray-900 rounded-xl w-full max-w-md max-h-[95vh] flex flex-col">
        <div className="p-4 border-b border-tg-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-tg-light">Savat</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-tg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-tg-gray-800 rounded-lg">
                <img
                  src={item.product.images[0] || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-tg-light text-sm truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-tg-primary font-bold text-sm">
                    {formatPrice(item.product.sale_price || item.product.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                    className="p-1 rounded hover:bg-tg-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="text-tg-light font-semibold min-w-[2rem] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                    className="p-1 rounded hover:bg-tg-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveItem(item.product_id)}
                    className="p-1 rounded hover:bg-tg-error/20 transition-colors text-tg-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-tg-gray-700 flex-shrink-0">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-tg-light">Jami:</span>
              <span className="text-tg-primary font-bold text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Buyurtma formasi */}
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Sizning ismingiz *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field text-sm"
            />

            <input
              type="tel"
              placeholder="Telefon raqam *"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="input-field text-sm"
            />

            <textarea
              placeholder="Yetkazib berish manzili *"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="input-field text-sm resize-none"
              rows={2}
            />

            <textarea
              placeholder="Buyurtma haqida izoh (ixtiyoriy)"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="input-field text-sm resize-none"
              rows={2}
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? 'Buyurtma berilmoqda...' : 'Buyurtma berish'}
          </button>
        </div>
      </div>
    </div>
  )
} 