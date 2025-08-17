import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { CommandHandlers } from './handlers/commandHandlers'
import { CallbackHandlers } from './handlers/callbackHandlers'
import { OrderService } from './services/orderService'
import { MessageFormatter } from './utils/messageFormatter'
import { testConnection } from './config/database'

// Muhit o'zgaruvchilarini yuklaymiz
dotenv.config()

console.log('🚀 Ilovani ishga tushirish...')

// Express server yaratamiz
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check so\'rovi qabul qilindi')
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
  console.log('🏠 Root endpoint so\'rovi qabul qilindi')
  res.status(200).json({ 
    status: 'ok', 
    service: 'telegram-bot',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Bot xizmati ishlamoqda'
  })
})

// Test endpoint
app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint so\'rovi qabul qilindi')
  res.status(200).json({ 
    status: 'ok', 
    message: 'Test endpoint ishlamoqda',
    timestamp: new Date().toISOString()
  })
})

// HTTP serverni ishga tushiramiz
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🌐 HTTP server ${PORT} portida ishga tushdi`)
  console.log(`🏥 Health check manzili: http://0.0.0.0:${PORT}/health`)
  console.log(`🏠 Root endpoint manzili: http://0.0.0.0:${PORT}/`)
  console.log(`🧪 Test endpoint manzili: http://0.0.0.0:${PORT}/test`)
})

// Server xatolarini qayta ishlash
server.on('error', (error) => {
  console.error('❌ HTTP server xatosi:', error)
  process.exit(1)
})

server.on('listening', () => {
  console.log('✅ HTTP server so\'rovlarni qabul qilishga tayyor')
})

// Bot namunasini yaratamiz (agar token mavjud bo'lsa)
let bot: Telegraf | null = null

if (process.env.BOT_TOKEN) {
  console.log('✅ BOT_TOKEN topildi, botni ishga tushiramiz...')
  bot = new Telegraf(process.env.BOT_TOKEN)

  // Buyruq qayta ishlovchilari
  bot.start(CommandHandlers.handleStart)
  bot.help(CommandHandlers.handleHelp)
  bot.command('orders', CommandHandlers.handleOrders)
  bot.command('support', CommandHandlers.handleSupport)
  bot.command('about', CommandHandlers.handleAbout)
  bot.command('stats', CommandHandlers.handleStats)

  // Barcha matnli xabarlarni qayta ishlovchi
  bot.on('text', async (ctx) => {
    const message = ctx.message.text
    console.log('📝 Xabar qabul qilindi:', message)

    // Tugma bosishlarini qayta ishlash
    switch (message) {
      case '🛍 Do\'konni ochish':
        await ctx.reply('Do\'kon ochilmoqda...', {
          reply_markup: {
            keyboard: [
              [{ text: '🛍 Do\'konni ochish', web_app: { url: process.env.MINI_APP_URL! } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '📦 Mening buyurtmalarim':
        await CommandHandlers.handleOrders(ctx)
        break

      case '📞 Qo\'llab-quvvatlash':
        await CommandHandlers.handleSupport(ctx)
        break

      case 'ℹ️ Do\'kon haqida':
        await CommandHandlers.handleAbout(ctx)
        break

      case '⚙️ Admin paneli':
        // Foydalanuvchining admin ekanligini tekshiramiz
        const adminChatId0 = process.env.ADMIN_CHAT_ID
        const userId0 = ctx.from?.id

        if (!adminChatId0 || userId0?.toString() !== adminChatId0) {
          await ctx.reply('❌ Sizda bu funksiyaga kirish huquqi yo\'q')
          return
        }

        await ctx.reply('Admin paneli ochilmoqda...', {
          reply_markup: {
            keyboard: [
              [{ text: '⚙️ Admin paneli', web_app: { url: `${process.env.MINI_APP_URL}/admin` } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '🔙 Bosh menyu':
        await CommandHandlers.handleStart(ctx)
        break

      case '🛍 Birinchi buyurtma berish':
      case '🛍 Yangi buyurtma berish':
      case '🛍 Do\'konga o\'tish':
        await ctx.reply('Do\'kon ochilmoqda...', {
          reply_markup: {
            keyboard: [
              [{ text: '🛍 Do\'konni ochish', web_app: { url: process.env.MINI_APP_URL! } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '➕ Mahsulot qo\'shish':
        // Foydalanuvchining admin ekanligini tekshiramiz
        const adminChatId1 = process.env.ADMIN_CHAT_ID
        const userId1 = ctx.from?.id

        if (!adminChatId1 || userId1?.toString() !== adminChatId1) {
          await ctx.reply('❌ Sizda bu funksiyaga kirish huquqi yo\'q')
          return
        }

        await ctx.reply('Admin paneli ochilmoqda...', {
          reply_markup: {
            keyboard: [
              [{ text: '➕ Mahsulot qo\'shish', web_app: { url: `${process.env.MINI_APP_URL}/admin` } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
        break

      case '📦 Barcha buyurtmalar':
        // Foydalanuvchining admin ekanligini tekshiramiz
        const adminChatId2 = process.env.ADMIN_CHAT_ID
        const userId2 = ctx.from?.id

        if (!adminChatId2 || userId2?.toString() !== adminChatId2) {
          await ctx.reply('❌ Sizda bu funksiyaga kirish huquqi yo\'q')
          return
        }

        try {
          const orders = await OrderService.getAllOrders()
          
          if (orders.length === 0) {
            await ctx.reply('📦 Hali buyurtmalar yo\'q', {
              reply_markup: {
                keyboard: [
                  ['➕ Mahsulot qo\'shish'],
                  ['🔙 Bosh menyu']
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
                ['➕ Mahsulot qo\'shish'],
                ['📊 Statistika', '🔙 Bosh menyu']
              ],
              resize_keyboard: true,
              one_time_keyboard: false
            }
          })
        } catch (error) {
          console.error('Admin buyurtmalarini olishda xatolik:', error)
          await ctx.reply('❌ Buyurtmalarni olishda xatolik yuz berdi')
        }
        break

      case '📊 Statistika':
        // Foydalanuvchining admin ekanligini tekshiramiz
        const adminChatId3 = process.env.ADMIN_CHAT_ID
        const userId3 = ctx.from?.id

        if (!adminChatId3 || userId3?.toString() !== adminChatId3) {
          await ctx.reply('❌ Sizda bu funksiyaga kirish huquqi yo\'q')
          return
        }

        await CommandHandlers.handleStats(ctx)
        break

      default:
        // Qo'llab-quvvatlash xabarlarini qayta ishlash
        const adminChatId4 = process.env.ADMIN_CHAT_ID
        if (adminChatId4) {
          const user = ctx.from
          const userInfo = `👤 Foydalanuvchi: ${user?.first_name} ${user?.last_name || ''}\n`
          const username = user?.username ? `@${user.username}\n` : ''
          const userId = `ID: ${user?.id}\n\n`
          const fullMessage = userInfo + username + userId + message

          try {
            await ctx.telegram.sendMessage(adminChatId4, fullMessage)
            await ctx.reply('✅ Xabaringiz qo\'llab-quvvatlashga yuborildi. Tez orada javob beramiz.')
          } catch (error) {
            console.error('Admin xabarini yuborishda xatolik:', error)
            await ctx.reply('❌ Xabar yuborishda xatolik yuz berdi. Keyinroq urinib ko\'ring.')
          }
        } else {
          await ctx.reply('💬 Xabaringiz uchun rahmat! Tez orada siz bilan bog\'lanamiz.')
        }
        break
    }
  })

  // Xatolarni qayta ishlovchi
  bot.catch((err, ctx) => {
    console.error('❌ Bot xatosi:', err)
    ctx.reply('❌ Xatolik yuz berdi. Keyinroq urinib ko\'ring.')
  })

  // Callback so\'rovlarini qayta ishlovchilar
  bot.action('main_menu', CallbackHandlers.handleMainMenu)
  bot.action('my_orders', CallbackHandlers.handleMyOrders)
  bot.action('support', CallbackHandlers.handleSupport)
  bot.action('about', CallbackHandlers.handleAbout)
  bot.action('admin_orders', CallbackHandlers.handleAdminOrders)
  bot.action('admin_stats', CallbackHandlers.handleAdminStats)

  // Buyurtmalar bilan bog'liq amallarni qayta ishlovchilar
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

  // Botni ishga tushiramiz
  bot.launch().then(() => {
    console.log('✅ Telegram bot muvaffaqiyatli ishga tushdi!')
    console.log('🎉 Ilova to\'liq ishlashga tayyor!')
  }).catch((error) => {
    console.error('❌ Telegram botni ishga tushirishda xatolik:', error)
    console.log('⚠️  Ilova Telegram botsiz ishlamoqda')
  })
} else {
  console.log('⚠️  BOT_TOKEN topilmadi, ilova Telegram botsiz ishlamoqda')
  console.log('🎉 Ilova to\'liq ishlashga tayyor!')
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 SIGINT signali qabul qilindi, serverni to\'xtatamiz...')
  if (bot) {
    bot.stop('SIGINT')
  }
  server.close(() => {
    console.log('✅ Server to\'xtatildi')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signali qabul qilindi, serverni to\'xtatamiz...')
  if (bot) {
    bot.stop('SIGTERM')
  }
  server.close(() => {
    console.log('✅ Server to\'xtatildi')
    process.exit(0)
  })
}) 