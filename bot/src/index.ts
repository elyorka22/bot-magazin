import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

// Загружаем переменные окружения
dotenv.config()

console.log('🚀 Инициализация бота...')

// Проверяем наличие токена
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в переменных окружения')
  process.exit(1)
}

console.log('✅ BOT_TOKEN найден')

// Создаем Express сервер для health check
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
    bot: 'running',
    uptime: process.uptime()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint запрос получен')
  res.status(200).json({ 
    status: 'ok', 
    service: 'telegram-bot',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Запускаем HTTP сервер
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🌐 HTTP сервер запущен на порту ${PORT}`)
  console.log(`🏥 Health check доступен по адресу: http://0.0.0.0:${PORT}/health`)
})

// Обработка ошибок сервера
server.on('error', (error) => {
  console.error('❌ Ошибка HTTP сервера:', error)
  process.exit(1)
})

server.on('listening', () => {
  console.log('✅ HTTP сервер готов принимать запросы')
})

// Создаем экземпляр бота
const bot = new Telegraf(process.env.BOT_TOKEN)

// Простой обработчик команды start
bot.start((ctx) => {
  console.log('👋 Получена команда /start от пользователя:', ctx.from?.id)
  ctx.reply('Привет! Я бот магазина мужской одежды. 🛍')
})

// Простой обработчик команды help
bot.help((ctx) => {
  ctx.reply('Доступные команды:\n/start - Главное меню\n/help - Помощь')
})

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

// Функция запуска бота
async function startBot() {
  try {
    console.log('🚀 Запуск Telegram бота...')
    
    // Запускаем бота
    console.log('🤖 Запуск бота...')
    await bot.launch()
    
    console.log('✅ Бот успешно запущен!')
    
    try {
      const botInfo = await bot.telegram.getMe()
      console.log('🤖 Имя бота:', botInfo.first_name)
      console.log('🤖 Username бота:', botInfo.username)
    } catch (error) {
      console.error('❌ Ошибка получения информации о боте:', error)
    }
    
    // Graceful stop
    process.once('SIGINT', () => {
      console.log('🛑 Получен сигнал SIGINT, останавливаем бота...')
      bot.stop('SIGINT')
    })
    process.once('SIGTERM', () => {
      console.log('🛑 Получен сигнал SIGTERM, останавливаем бота...')
      bot.stop('SIGTERM')
    })
    
    console.log('🎉 Бот полностью готов к работе!')
    
  } catch (error) {
    console.error('❌ Ошибка запуска бота:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'Unknown error')
    process.exit(1)
  }
}

// Запускаем бота
startBot() 