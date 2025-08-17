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

// Создаем Express сервер для health check
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'telegram-bot',
    timestamp: new Date().toISOString() 
  })
})

// Запускаем HTTP сервер
app.listen(PORT, () => {
  console.log(`🌐 HTTP сервер запущен на порту ${PORT}`)
})

// Проверяем наличие токена
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в переменных окружения')
  process.exit(1)
}

// Создаем экземпляр бота
const bot = new Telegraf(process.env.BOT_TOKEN)

// Middleware для логирования
bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date().getTime() - start.getTime()
  console.log('⏱', ctx.updateType, 'за', ms, 'ms')
})

// Обработчики команд
bot.start(CommandHandlers.handleStart)
bot.help(CommandHandlers.handleHelp)
bot.command('orders', CommandHandlers.handleOrders)
bot.command('support', CommandHandlers.handleSupport)
bot.command('about', CommandHandlers.handleAbout)
bot.command('stats', CommandHandlers.handleStats)

// Обработчики callback запросов
bot.action('main_menu', CallbackHandlers.handleMainMenu)
bot.action('my_orders', CallbackHandlers.handleMyOrders)
bot.action('support', CallbackHandlers.handleSupport)
bot.action('about', CallbackHandlers.handleAbout)

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

// Обработчик текстовых сообщений
bot.on('text', async (ctx) => {
  const message = ctx.message.text
  
  // Если сообщение начинается с /, игнорируем (это команды)
  if (message.startsWith('/')) {
    return
  }

  // Обработка сообщений поддержки
  const adminChatId = process.env.ADMIN_CHAT_ID
  if (adminChatId) {
    const user = ctx.from
    const userInfo = `👤 Пользователь: ${user?.first_name} ${user?.last_name || ''}\n`
    const username = user?.username ? `@${user.username}\n` : ''
    const userId = `ID: ${user?.id}\n\n`
    const fullMessage = userInfo + username + userId + message

    try {
      await ctx.telegram.sendMessage(adminChatId, fullMessage)
      await ctx.reply('✅ Ваше сообщение отправлено в поддержку. Мы ответим вам в ближайшее время.')
    } catch (error) {
      console.error('Ошибка отправки сообщения админу:', error)
      await ctx.reply('❌ Произошла ошибка при отправке сообщения. Попробуйте позже.')
    }
  } else {
    await ctx.reply('💬 Спасибо за ваше сообщение! Мы скоро с вами свяжемся.')
  }
})

// Обработчик данных от Mini App
bot.on('web_app_data', async (ctx) => {
  try {
    const data = JSON.parse(ctx.message.web_app_data.data)
    console.log('📱 Данные от Mini App:', data)

    // Обработка заказа от Mini App
    if (data.type === 'order') {
      const orderData = data.order
      const userId = ctx.from?.id

      if (!userId) {
        await ctx.reply('❌ Ошибка: не удалось определить пользователя')
        return
      }

      // Создаем заказ
      const orderId = await OrderService.createOrder({
        ...orderData,
        telegram_user_id: userId,
        user_id: userId.toString(),
        status: 'pending',
        payment_method: 'cash',
        payment_status: 'pending'
      })

      if (orderId) {
        // Получаем созданный заказ и его позиции
        const order = await OrderService.getOrderById(orderId)
        const items = await OrderService.getOrderItems(orderId)

        if (order && items) {
          const message = MessageFormatter.formatOrderForUser(order, items)
          
          await ctx.reply('🎉 *Заказ успешно создан!*', { parse_mode: 'Markdown' })
          await ctx.reply(message, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🛍 Сделать еще заказ', web_app: { url: process.env.MINI_APP_URL! } }
                ],
                [
                  { text: '📦 Мои заказы', callback_data: 'my_orders' }
                ]
              ]
            }
          })

          // Уведомляем админа о новом заказе
          const adminChatId = process.env.ADMIN_CHAT_ID
          if (adminChatId) {
            const adminMessage = MessageFormatter.formatOrderForAdmin(order, items)
            await ctx.telegram.sendMessage(adminChatId, adminMessage, {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: '✅ Подтвердить', callback_data: `confirm_order_${orderId}` },
                    { text: '❌ Отменить', callback_data: `cancel_order_${orderId}` }
                  ]
                ]
              }
            })
          }
        }
      } else {
        await ctx.reply('❌ Произошла ошибка при создании заказа')
      }
    }
  } catch (error) {
    console.error('Ошибка обработки данных от Mini App:', error)
    await ctx.reply('❌ Произошла ошибка при обработке данных')
  }
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
    
    // Проверяем подключение к базе данных
    const dbConnected = await testConnection()
    if (!dbConnected) {
      console.log('⚠️  Бот запускается в режиме тестирования без базы данных')
    }

    // Запускаем бота
    await bot.launch()
    console.log('✅ Бот успешно запущен!')
    console.log('🤖 Имя бота:', (await bot.telegram.getMe()).first_name)
    
    // Устанавливаем команды бота
    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Главное меню' },
      { command: 'help', description: 'Помощь' },
      { command: 'orders', description: 'Мои заказы' },
      { command: 'support', description: 'Поддержка' },
      { command: 'about', description: 'О магазине' }
    ])

    // Graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
    
  } catch (error) {
    console.error('❌ Ошибка запуска бота:', error)
    process.exit(1)
  }
}

// Запускаем бота
startBot() 