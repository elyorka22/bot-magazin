import React from 'react'
import { ShoppingCart, Menu, Settings } from 'lucide-react'

interface HeaderProps {
  cartItemsCount: number
  onCartClick: () => void
  onMenuClick: () => void
  isAdmin?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  cartItemsCount,
  onCartClick,
  onMenuClick,
  isAdmin = false
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
          <h1 className="text-lg font-bold">
            {isAdmin ? 'Admin paneli' : 'Erkaklar uslubi'}
          </h1>
          {isAdmin && (
            <div className="flex items-center gap-1 text-tg-primary text-xs">
              <Settings className="w-3 h-3" />
              <span>Admin</span>
            </div>
          )}
        </div>
        
        {!isAdmin && (
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
        )}
      </div>
    </header>
  )
} 