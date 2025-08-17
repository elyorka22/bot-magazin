import React from 'react'
import { Category } from '../types'

interface CategoryCardProps {
  category: Category
  onClick: (category: Category) => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick
}) => {
  return (
    <div 
      className="card cursor-pointer hover:transform hover:-translate-y-1 transition-all duration-200 max-w-xs"
      onClick={() => onClick(category)}
    >
      <div className="relative h-24">
        <img 
          src={category.image_url || '/placeholder-category.jpg'} 
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white font-semibold text-sm">
            {category.name}
          </h3>
        </div>
      </div>
    </div>
  )
} 