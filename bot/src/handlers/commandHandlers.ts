import { Context } from 'telegraf'
import { MessageFormatter } from '../utils/messageFormatter'
import { OrderService } from '../services/orderService'

export class CommandHandlers {
  static async handleStart(ctx: Context) {
    const userId = ctx.from?.id
    const adminChatId = process.env.ADMIN_CHAT_ID
    const isAdmin = adminChatId && userId?.toString() === adminChatId

    const welcomeMessage = `
🎉 *"Erkaklar uslubi" do'koniga xush kelibsiz!*

Bu yerda siz:
• 🛍 Mahsulotlarni ko'rishingiz mumkin
• 📦 Buyurtma berishingiz mumkin
• 💳 Yetkazib berishda naqd pul bilan to'lashingiz mumkin
• 📞 Qo'llab-quvvatlash olishingiz mumkin

Amalni tanlang:
    `

    // Admin va oddiy foydalanuvchi uchun turli xil klaviaturalar
    const keyboard = isAdmin 
      ? [
          ['🛍 Do\'konni ochish'],
          ['📦 Mening buyurtmalarim', '📞 Qo\'llab-quvvatlash'],
          ['⚙️ Admin paneli'],
          ['ℹ️ Do\'kon haqida']
        ]
      : [
          ['🛍 Do\'konni ochish'],
          ['📦 Mening buyurtmalarim', '📞 Qo\'llab-quvvatlash'],
          ['ℹ️ Do\'kon haqida']
        ]

    await ctx.reply(welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard,
        resize_keyboard: true,
        one_time_keyboard: false
      }
    })
  }

  static async handleHelp(ctx: Context) {
    const userId = ctx.from?.id
    const adminChatId = process.env.ADMIN_CHAT_ID
    const isAdmin = adminChatId && userId?.toString() === adminChatId

    const helpMessage = `
🤝 *Botdan foydalanish bo'yicha yordam*

*Asosiy buyruqlar:*
/start - Bosh menyu
/orders - Mening buyurtmalarim
/support - Qo'llab-quvvatlash xizmati
/about - Do'kon haqida

*Buyurtma qanday beriladi:*
1. "🛍 Do'konni ochish" tugmasini bosing
2. Mahsulotlarni tanlang va savatga qo'shing
3. Buyurtma formasini to'ldiring
4. Tasdiqlash uchun qo'ng'iroqni kuting

*To'lov:* yetkazib berishda naqd pul bilan
*Yetkazib berish:* sizning manzilingizga

Amalni tanlang:
    `

    // Admin va oddiy foydalanuvchi uchun turli xil klaviaturalar
    const keyboard = isAdmin 
      ? [
          ['🛍 Do\'konni ochish'],
          ['📦 Mening buyurtmalarim', '📞 Qo\'llab-quvvatlash'],
          ['⚙️ Admin paneli'],
          ['ℹ️ Do\'kon haqida']
        ]
      : [
          ['🛍 Do\'konni ochish'],
          ['📦 Mening buyurtmalarim', '📞 Qo\'llab-quvvatlash'],
          ['ℹ️ Do\'kon haqida']
        ]

    await ctx.reply(helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard,
        resize_keyboard: true,
        one_time_keyboard: false
      }
    })
  }

  static async handleOrders(ctx: Context) {
    const userId = ctx.from?.id
    if (!userId) {
      await ctx.reply('❌ Xatolik: foydalanuvchini aniqlab bo\'lmadi')
      return
    }

    try {
      const orders = await OrderService.getUserOrders(userId)
      
      if (orders.length === 0) {
        await ctx.reply('📦 Sizda hali buyurtmalar yo\'q', {
          reply_markup: {
            keyboard: [
              ['🛍 Birinchi buyurtma berish'],
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
            ['🛍 Yangi buyurtma berish'],
            ['🔙 Bosh menyu']
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      })
    } catch (error) {
      console.error('Buyurtmalarni olishda xatolik:', error)
      await ctx.reply('❌ Buyurtmalarni olishda xatolik yuz berdi')
    }
  }

  static async handleSupport(ctx: Context) {
    const supportMessage = `
📞 *Qo'llab-quvvatlash xizmati*

Agar sizda buyurtmalar, yetkazib berish yoki mahsulotlar bo'yicha savollaringiz bo'lsa, bizga xabar yozing va biz tez orada javob beramiz.

*Ish vaqti:* 9:00 - 21:00 (Toshkent vaqti)
*Bog'lanish usullari:*
• Ushbu bot orqali
• Telefon: +998 (XX) XXX-XX-XX
• Email: support@example.com

Savolingizni yozing:
    `

    await ctx.reply(supportMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          ['🔙 Bosh menyu']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    })
  }

  static async handleAbout(ctx: Context) {
    const aboutMessage = `
🏪 *"Erkaklar uslubi" do'koni haqida*

Biz sifatli erkaklar kiyimi va aksessuarlariga ixtisoslashganmiz.

*Bizning afzalliklarimiz:*
• ✅ Sifatli materiallar
• 🚚 Tez yetkazib berish
• 💳 Yetkazib berishda to'lov
• 🔄 14 kun ichida qaytarish
• 📞 24/7 qo'llab-quvvatlash

*Mahsulot kategoriyalari:*
• 👔 Kostyumlar va pidjaklar
• 👕 Ko'ylaklar va futbolkalar
• 👖 Shimlar va jinsi
• 👟 Oyoq kiyim
• 🎒 Aksessuarlar

*Yetkazib berish:* butun O'zbekiston bo'ylab
*To'lov:* yetkazib berishda naqd pul bilan
    `

    await ctx.reply(aboutMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          ['🛍 Do\'konga o\'tish'],
          ['🔙 Bosh menyu']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    })
  }

  static async handleStats(ctx: Context) {
    // Foydalanuvchining admin ekanligini tekshiramiz
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (!adminChatId || userId?.toString() !== adminChatId) {
      await ctx.reply('❌ Sizda bu buyruqni bajarish huquqi yo\'q')
      return
    }

    try {
      const stats = await OrderService.getOrderStats()
      const statsMessage = `
📊 *Do\'kon statistikasi*

*Buyurtmalar:*
• Jami buyurtmalar: ${stats.total}
• Yangi buyurtmalar: ${stats.pending}
• Tasdiqlangan: ${stats.confirmed}
• Yuborilgan: ${stats.shipped}
• Yetkazib berilgan: ${stats.delivered}
• Bekor qilingan: ${stats.cancelled}
    `

      await ctx.reply(statsMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            ['➕ Mahsulot qo\'shish'],
            ['📦 Barcha buyurtmalar', '🔙 Bosh menyu']
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      })
    } catch (error) {
      console.error('Statistikani olishda xatolik:', error)
      await ctx.reply('❌ Statistikani olishda xatolik yuz berdi')
    }
  }
} 