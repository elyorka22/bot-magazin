import { Context } from 'telegraf'
import { MessageFormatter } from '../utils/messageFormatter'
import { OrderService } from '../services/orderService'

export class CommandHandlers {
  static async handleStart(ctx: Context) {
    const userId = ctx.from?.id
    const adminChatId = process.env.ADMIN_CHAT_ID
    const isAdmin = adminChatId && userId?.toString() === adminChatId

    const welcomeMessage = `
🎉 *Добро пожаловать в магазин "Мужской стиль"!*

Здесь вы можете:
• 🛍 Просматривать товары
• 📦 Оформлять заказы
• 💳 Оплачивать наличными при получении
• 📞 Получать поддержку

Выберите действие:
    `

    // Разные клавиатуры для админа и обычного пользователя
    const keyboard = isAdmin 
      ? [
          ['🛍 Открыть магазин'],
          ['📦 Мои заказы', '📞 Поддержка'],
          ['⚙️ Админ-панель'],
          ['ℹ️ О магазине']
        ]
      : [
          ['🛍 Открыть магазин'],
          ['📦 Мои заказы', '📞 Поддержка'],
          ['ℹ️ О магазине']
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
🤝 *Помощь по использованию бота*

*Основные команды:*
/start - Главное меню
/orders - Мои заказы
/support - Служба поддержки
/about - О магазине

*Как сделать заказ:*
1. Нажмите "🛍 Открыть магазин"
2. Выберите товары и добавьте в корзину
3. Заполните форму заказа
4. Ожидайте звонка для подтверждения

*Оплата:* наличными при получении
*Доставка:* по вашему адресу

Выберите действие:
    `

    // Разные клавиатуры для админа и обычного пользователя
    const keyboard = isAdmin 
      ? [
          ['🛍 Открыть магазин'],
          ['📦 Мои заказы', '📞 Поддержка'],
          ['⚙️ Админ-панель'],
          ['ℹ️ О магазине']
        ]
      : [
          ['🛍 Открыть магазин'],
          ['📦 Мои заказы', '📞 Поддержка'],
          ['ℹ️ О магазине']
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
      await ctx.reply('❌ Ошибка: не удалось определить пользователя')
      return
    }

    try {
      const orders = await OrderService.getUserOrders(userId)
      
      if (orders.length === 0) {
        await ctx.reply('📦 У вас пока нет заказов', {
          reply_markup: {
            keyboard: [
              ['🛍 Сделать первый заказ'],
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
            ['🛍 Сделать новый заказ'],
            ['🔙 Главное меню']
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      })
    } catch (error) {
      console.error('Ошибка получения заказов:', error)
      await ctx.reply('❌ Произошла ошибка при получении заказов')
    }
  }

  static async handleSupport(ctx: Context) {
    const supportMessage = `
📞 *Служба поддержки*

Если у вас есть вопросы по заказам, доставке или товарам, напишите нам сообщение, и мы ответим в ближайшее время.

*Время работы:* 9:00 - 21:00 (МСК)
*Способы связи:*
• Через этот бот
• Телефон: +7 (XXX) XXX-XX-XX
• Email: support@example.com

Напишите ваш вопрос:
    `

    await ctx.reply(supportMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          ['🔙 Главное меню']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    })
  }

  static async handleAbout(ctx: Context) {
    const aboutMessage = `
🏪 *О магазине "Мужской стиль"*

Мы специализируемся на качественной мужской одежде и аксессуарах.

*Наши преимущества:*
• ✅ Качественные материалы
• 🚚 Быстрая доставка
• 💳 Оплата при получении
• 🔄 Возврат в течение 14 дней
• 📞 Поддержка 24/7

*Категории товаров:*
• 👔 Костюмы и пиджаки
• 👕 Рубашки и футболки
• 👖 Брюки и джинсы
• 👟 Обувь
• 🎒 Аксессуары

*Доставка:* по всей России
*Оплата:* наличными при получении
    `

    await ctx.reply(aboutMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          ['🛍 Перейти в магазин'],
          ['🔙 Главное меню']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    })
  }

  static async handleStats(ctx: Context) {
    // Проверяем, является ли пользователь админом
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (!adminChatId || userId?.toString() !== adminChatId) {
      await ctx.reply('❌ У вас нет доступа к этой команде')
      return
    }

    try {
      const stats = await OrderService.getOrderStats()
      const statsMessage = `
📊 *Статистика магазина*

*Заказы:*
• Всего заказов: ${stats.total}
• Новых заказов: ${stats.pending}
• Подтвержденных: ${stats.confirmed}
• Отправленных: ${stats.shipped}
• Доставленных: ${stats.delivered}
• Отмененных: ${stats.cancelled}
    `

      await ctx.reply(statsMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            ['➕ Добавить товар'],
            ['📦 Все заказы', '🔙 Главное меню']
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      })
    } catch (error) {
      console.error('Ошибка получения статистики:', error)
      await ctx.reply('❌ Произошла ошибка при получении статистики')
    }
  }
} 