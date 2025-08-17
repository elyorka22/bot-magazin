import { Context } from 'telegraf'
import { MessageFormatter } from '../utils/messageFormatter'
import { OrderService } from '../services/orderService'

export class CommandHandlers {
  static async handleStart(ctx: Context) {
    const welcomeMessage = `
🎉 *Добро пожаловать в магазин "Мужской стиль"!*

Здесь вы можете:
• 🛍 Просматривать товары
• 📦 Оформлять заказы
• 💳 Оплачивать наличными при получении
• 📞 Получать поддержку

Выберите действие:
    `

    await ctx.reply(welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍 Открыть магазин', web_app: { url: process.env.MINI_APP_URL! } }
          ],
          [
            { text: '📦 Мои заказы', callback_data: 'my_orders' },
            { text: '📞 Поддержка', callback_data: 'support' }
          ],
          [
            { text: 'ℹ️ О магазине', callback_data: 'about' }
          ]
        ]
      }
    })
  }

  static async handleHelp(ctx: Context) {
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

    await ctx.reply(helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍 Открыть магазин', web_app: { url: process.env.MINI_APP_URL! } }
          ],
          [
            { text: '📦 Мои заказы', callback_data: 'my_orders' },
            { text: '📞 Поддержка', callback_data: 'support' }
          ],
          [
            { text: 'ℹ️ О магазине', callback_data: 'about' }
          ]
        ]
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
            inline_keyboard: [
              [
                { text: '🛍 Сделать первый заказ', web_app: { url: process.env.MINI_APP_URL! } }
              ],
              [
                { text: '🔙 Главное меню', callback_data: 'main_menu' }
              ]
            ]
          }
        })
        return
      }

      const message = MessageFormatter.formatOrdersList(orders)
      await ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🛍 Сделать новый заказ', web_app: { url: process.env.MINI_APP_URL! } }
            ],
            [
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
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
        inline_keyboard: [
          [
            { text: '🔙 Главное меню', callback_data: 'main_menu' }
          ]
        ]
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
        inline_keyboard: [
          [
            { text: '🛍 Перейти в магазин', web_app: { url: process.env.MINI_APP_URL! } }
          ],
          [
            { text: '🔙 Главное меню', callback_data: 'main_menu' }
          ]
        ]
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
          inline_keyboard: [
            [
              { text: '➕ Добавить товар', web_app: { url: `${process.env.MINI_APP_URL}/admin` } }
            ],
            [
              { text: '📦 Все заказы', callback_data: 'admin_orders' },
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Ошибка получения статистики:', error)
      await ctx.reply('❌ Произошла ошибка при получении статистики')
    }
  }
} 