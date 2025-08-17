import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-tg-gray-600 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border border-tg-gray-300 rounded-lg focus:border-tg-primary focus:ring-2 focus:ring-tg-primary/20 outline-none transition-all resize-none ${error ? 'border-tg-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-tg-error">{error}</p>
      )}
    </div>
  )
} 