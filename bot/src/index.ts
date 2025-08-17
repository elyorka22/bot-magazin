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
  bot.on('text', async (ctx) => {
    const message = ctx.message.text
    console.log('📝 Получено сообщение:', message)

    // Обработка нажатий на кнопки
    switch (message) {
      case '🛍 Открыть магазин':
        await ctx.reply('Открываю магазин...', {
          reply_markup: {
            keyboard: [
              [{ text: '🛍 Открыть магазин', web_app: { url: process.env.MINI_APP_URL! } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '📦 Мои заказы':
        await CommandHandlers.handleOrders(ctx)
        break

      case '📞 Поддержка':
        await CommandHandlers.handleSupport(ctx)
        break

      case 'ℹ️ О магазине':
        await CommandHandlers.handleAbout(ctx)
        break

      case '⚙️ Админ-панель':
        // Проверяем, является ли пользователь админом
        const adminChatId0 = process.env.ADMIN_CHAT_ID
        const userId0 = ctx.from?.id

        if (!adminChatId0 || userId0?.toString() !== adminChatId0) {
          await ctx.reply('❌ У вас нет доступа к этой функции')
          return
        }

        await ctx.reply('Открываю админ-панель...', {
          reply_markup: {
            keyboard: [
              [{ text: '⚙️ Админ-панель', web_app: { url: `${process.env.MINI_APP_URL}/admin` } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '🔙 Главное меню':
        await CommandHandlers.handleStart(ctx)
        break

      case '🛍 Сделать первый заказ':
      case '🛍 Сделать новый заказ':
      case '🛍 Перейти в магазин':
        await ctx.reply('Открываю магазин...', {
          reply_markup: {
            keyboard: [
              [{ text: '🛍 Открыть магазин', web_app: { url: process.env.MINI_APP_URL! } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '➕ Добавить товар':
        // Проверяем, является ли пользователь админом
        const adminChatId1 = process.env.ADMIN_CHAT_ID
        const userId1 = ctx.from?.id

        if (!adminChatId1 || userId1?.toString() !== adminChatId1) {
          await ctx.reply('❌ У вас нет доступа к этой функции')
          return
        }

        await ctx.reply('Открываю админ-панель...', {
          reply_markup: {
            keyboard: [
              [{ text: '➕ Добавить товар', web_app: { url: `${process.env.MINI_APP_URL}/admin` } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '📦 Все заказы':
        // Проверяем, является ли пользователь админом
        const adminChatId2 = process.env.ADMIN_CHAT_ID
        const userId2 = ctx.from?.id

        if (!adminChatId2 || userId2?.toString() !== adminChatId2) {
          await ctx.reply('❌ У вас нет доступа к этой функции')
          return
        }

        try {
          const orders = await OrderService.getAllOrders()
          
          if (orders.length === 0) {
            await ctx.reply('📦 Заказов пока нет', {
              reply_markup: {
                keyboard: [
                  ['➕ Добавить товар'],
                  ['🔙 Главное меню']
                ],
                resize_keyboard: true,
                one_time_keyboard: false
              }
            })
            return
          }

          const message = MessageFormatter.formatOrdersList(orders)
          await ctx.reply(message, {
            parse_mode: 'Markdown',
            reply_markup: {
              keyboard: [
                ['➕ Добавить товар'],
                ['📊 Статистика', '🔙 Главное меню']
              ],
              resize_keyboard: true,
              one_time_keyboard: false
            }
          })
        } catch (error) {
          console.error('Ошибка получения заказов админа:', error)
          await ctx.reply('❌ Произошла ошибка при получении заказов')
        }
        break

      case '📊 Статистика':
        // Проверяем, является ли пользователь админом
        const adminChatId3 = process.env.ADMIN_CHAT_ID
        const userId3 = ctx.from?.id

        if (!adminChatId3 || userId3?.toString() !== adminChatId3) {
          await ctx.reply('❌ У вас нет доступа к этой функции')
          return
        }

        await CommandHandlers.handleStats(ctx)
        break

      default:
        // Обработка сообщений поддержки
        const adminChatId4 = process.env.ADMIN_CHAT_ID
        if (adminChatId4) {
          const user = ctx.from
          const userInfo = `👤 Пользователь: ${user?.first_name} ${user?.last_name || ''}\n`
          const username = user?.username ? `@${user.username}\n` : ''
          const userId = `ID: ${user?.id}\n\n`
          const fullMessage = userInfo + username + userId + message

          try {
            await ctx.telegram.sendMessage(adminChatId4, fullMessage)
            await ctx.reply('✅ Ваше сообщение отправлено в поддержку. Мы ответим вам в ближайшее время.')
          } catch (error) {
            console.error('Ошибка отправки сообщения админу:', error)
            await ctx.reply('❌ Произошла ошибка при отправке сообщения. Попробуйте позже.')
          }
        } else {
          await ctx.reply('💬 Спасибо за ваше сообщение! Мы скоро с вами свяжемся.')
        }
        break
    }
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