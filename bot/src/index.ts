import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { CommandHandlers } from './handlers/commandHandlers'
import { CallbackHandlers } from './handlers/callbackHandlers'
import { OrderService } from './services/orderService'
import { MessageFormatter } from './utils/messageFormatter'
import { testConnection } from './config/database'

// Загружаем переменные окружения
dotenv.config()

console.log('🚀 Инициализация приложения...')

// Создаем Express сервер
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check запрос получен')
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'telegram-bot',
    uptime: process.uptime(),
    port: PORT,
    bot: 'running'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint запрос получен')
  res.status(200).json({ 
    status: 'ok', 
    service: 'telegram-bot',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Bot service is running'
  })
})

// Test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint запрос получен')
  res.status(200).json({ 
    status: 'ok', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  })
})

// Запускаем HTTP сервер
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🌐 HTTP сервер запущен на порту ${PORT}`)
  console.log(`🏥 Health check доступен по адресу: http://0.0.0.0:${PORT}/health`)
  console.log(`🏠 Root endpoint доступен по адресу: http://0.0.0.0:${PORT}/`)
  console.log(`🧪 Test endpoint доступен по адресу: http://0.0.0.0:${PORT}/test`)
})

// Обработка ошибок сервера
server.on('error', (error) => {
  console.error('❌ Ошибка HTTP сервера:', error)
  process.exit(1)
})

server.on('listening', () => {
  console.log('✅ HTTP сервер готов принимать запросы')
})

// Создаем экземпляр бота (если токен доступен)
let bot: Telegraf | null = null

if (process.env.BOT_TOKEN) {
  console.log('✅ BOT_TOKEN найден, инициализируем бота...')
  bot = new Telegraf(process.env.BOT_TOKEN)

  // Обработчики команд
  bot.start(CommandHandlers.handleStart)
  bot.help(CommandHandlers.handleHelp)
  bot.command('orders', CommandHandlers.handleOrders)
  bot.command('support', CommandHandlers.handleSupport)
  bot.command('about', CommandHandlers.handleAbout)
  bot.command('stats', CommandHandlers.handleStats)

  // Обработчик всех текстовых сообщений
  bot.on('text', (ctx) => {
    console.log('📝 Получено сообщение:', ctx.message.text)
    ctx.reply('Спасибо за ваше сообщение! Мы скоро с вами свяжемся.')
  })

  // Обработчик ошибок
  bot.catch((err, ctx) => {
    console.error('❌ Ошибка бота:', err)
    ctx.reply('❌ Произошла ошибка. Попробуйте позже.')
  })

  // Обработчики callback запросов
  bot.action('main_menu', CallbackHandlers.handleMainMenu)
  bot.action('my_orders', CallbackHandlers.handleMyOrders)
  bot.action('support', CallbackHandlers.handleSupport)
  bot.action('about', CallbackHandlers.handleAbout)
  bot.action('admin_orders', CallbackHandlers.handleAdminOrders)
  bot.action('admin_stats', CallbackHandlers.handleAdminStats)

  // Обработчики действий с заказами
  bot.action(/view_order_(.+)/, async (ctx) => {
    const orderId = ctx.match[1]
    await CallbackHandlers.handleViewOrder(ctx, orderId)
  })

  bot.action(/confirm_order_(.+)/, async (ctx) => {
    const orderId = ctx.match[1]
    await CallbackHandlers.handleConfirmOrder(ctx, orderId)
  })

  bot.action(/ship_order_(.+)/, async (ctx) => {
    const orderId = ctx.match[1]
    await CallbackHandlers.handleShipOrder(ctx, orderId)
  })

  bot.action(/deliver_order_(.+)/, async (ctx) => {
    const orderId = ctx.match[1]
    await CallbackHandlers.handleDeliverOrder(ctx, orderId)
  })

  bot.action(/cancel_order_(.+)/, async (ctx) => {
    const orderId = ctx.match[1]
    await CallbackHandlers.handleCancelOrder(ctx, orderId)
  })

  // Запускаем бота
  bot.launch().then(() => {
    console.log('✅ Telegram бот успешно запущен!')
    console.log('🎉 Приложение полностью готово к работе!')
  }).catch((error) => {
    console.error('❌ Ошибка запуска Telegram бота:', error)
    console.log('⚠️  Приложение работает без Telegram бота')
  })
} else {
  console.log('⚠️  BOT_TOKEN не найден, приложение работает без Telegram бота')
  console.log('🎉 Приложение полностью готово к работе!')
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Получен сигнал SIGINT, останавливаем сервер...')
  if (bot) {
    bot.stop('SIGINT')
  }
  server.close(() => {
    console.log('✅ Сервер остановлен')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('🛑 Получен сигнал SIGTERM, останавливаем сервер...')
  if (bot) {
    bot.stop('SIGTERM')
  }
  server.close(() => {
    console.log('✅ Сервер остановлен')
    process.exit(0)
  })
}) 