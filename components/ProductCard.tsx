import React from 'react'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  const hasDiscount = product.sale_price && product.sale_price < product.price
  const discountPercentage = hasDiscount 
    ? Math.round((1 - product.sale_price! / product.price) * 100)
    : 0

  return (
    <div className="product-card slide-in-up">
      <div className="relative">
        <img 
          src={product.images[0] || '/placeholder-product.jpg'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-tg-error text-white px-2 py-1 rounded-lg text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Нет в наличии</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-tg-light mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-tg-primary font-bold text-lg">
                  {product.sale_price?.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-tg-gray-400 line-through text-sm">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
              </>
            ) : (
              <span className="text-tg-light font-bold text-lg">
                {product.price.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock_quantity === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock_quantity === 0 ? 'Нет в наличии' : 'В корзину'}
        </button>
      </div>
    </div>
  )
} 