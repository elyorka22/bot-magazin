import express from 'express'
import cors from 'cors'

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
    port: PORT
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
  console.log('🎉 Приложение полностью готово к работе!')
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Получен сигнал SIGINT, останавливаем сервер...')
  server.close(() => {
    console.log('✅ Сервер остановлен')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('🛑 Получен сигнал SIGTERM, останавливаем сервер...')
  server.close(() => {
    console.log('✅ Сервер остановлен')
    process.exit(0)
  })
}) 