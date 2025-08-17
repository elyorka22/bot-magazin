import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Мужской стиль - Telegram Mini App',
  description: 'Интернет-магазин мужской одежды и аксессуаров',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        {/* Telegram WebApp Script */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body>
        <div id="telegram-app" className="tg-app">
          {children}
        </div>
      </body>
    </html>
  )
} 