import React from 'react'
import { ShoppingCart, Menu } from 'lucide-react'

interface HeaderProps {
  cartItemsCount: number
  onCartClick: () => void
  onMenuClick: () => void
}

export const Header: React.FC<HeaderProps> = ({
  cartItemsCount,
  onCartClick,
  onMenuClick
}) => {
  return (
    <header className="tg-header p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-lg hover:bg-tg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Мужской стиль</h1>
        </div>
        
        <button
          onClick={onCartClick}
          className="relative p-1.5 rounded-lg hover:bg-tg-gray-800 transition-colors"
          disabled={cartItemsCount === 0}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-tg-primary text-tg-dark rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
} 