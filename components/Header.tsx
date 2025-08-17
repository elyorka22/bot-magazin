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
    <header className="tg-header p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-tg-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Мужской стиль</h1>
        </div>
        
        <button
          onClick={onCartClick}
          className="relative p-2 rounded-lg hover:bg-tg-gray-800 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-tg-primary text-tg-dark rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
} 