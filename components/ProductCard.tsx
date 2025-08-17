import React, { useState } from 'react'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  const [isAdding, setIsAdding] = useState(false)
  
  const hasDiscount = product.sale_price && product.sale_price < product.price
  const discountPercentage = hasDiscount 
    ? Math.round((1 - product.sale_price! / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.stock_quantity === 0) return
    
    setIsAdding(true)
    onAddToCart(product)
    
    // Возвращаем исходный текст через 1.5 секунды
    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  return (
    <div className="product-card slide-in-up">
      <div className="relative">
        <img 
          src={product.images[0] || '/placeholder-product.jpg'} 
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-1 right-1 bg-tg-error text-white px-1.5 py-0.5 rounded text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Нет в наличии</span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-tg-light mb-2 line-clamp-2 text-sm">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-tg-primary font-bold text-base">
                  {product.sale_price?.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-tg-gray-400 line-through text-xs">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
              </>
            ) : (
              <span className="text-tg-light font-bold text-base">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0 || isAdding}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-xs py-1.5 transition-all duration-200"
        >
          {product.stock_quantity === 0 
            ? 'Нет в наличии' 
            : isAdding 
              ? '✓ Добавлено!' 
              : 'В корзину'
          }
        </button>
      </div>
    </div>
  )
} 