import { Context } from 'telegraf'
import { OrderService } from '../services/orderService'
import { ProductService } from '../services/productService'
import { MessageFormatter } from '../utils/messageFormatter'

export class CommandHandlers {
  // Обработчик команды /start
  static async handleStart(ctx: Context) {
    const welcomeMessage = `
🎉 *Добро пожаловать в магазин "Мужской стиль"!*

Здесь вы можете:
🛍 Просматривать товары
📦 Отслеживать заказы
💬 Получать поддержку

Используйте кнопки ниже для навигации:
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

  // Обработчик команды /help
  static async handleHelp(ctx: Context) {
    const helpMessage = `
📋 *Помощь по использованию бота*

*Основные команды:*
/start - Главное меню
/help - Эта справка
/orders - Мои заказы
/support - Связаться с поддержкой

*Как сделать заказ:*
1. Нажмите "🛍 Открыть магазин"
2. Выберите товары
3. Добавьте в корзину
4. Оформите заказ
5. Укажите контактные данные

*Оплата:* Наличными при получении

*Доставка:* Курьером или самовывоз
    `

    await ctx.reply(helpMessage, { parse_mode: 'Markdown' })
  }

  // Обработчик команды /orders
  static async handleOrders(ctx: Context) {
    try {
      const userId = ctx.from?.id
      if (!userId) {
        await ctx.reply('❌ Ошибка: не удалось определить пользователя')
        return
      }

      const orders = await OrderService.getUserOrders(userId)
      const message = MessageFormatter.formatOrdersList(orders)

      await ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🛍 Сделать новый заказ', web_app: { url: process.env.MINI_APP_URL! } }
            ],
            [
              { text: '🔙 Назад', callback_data: 'main_menu' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Ошибка получения заказов:', error)
      await ctx.reply('❌ Произошла ошибка при получении заказов')
    }
  }

  // Обработчик команды /support
  static async handleSupport(ctx: Context) {
    const supportMessage = `
📞 *Поддержка*

Если у вас есть вопросы или нужна помощь:

*Телефон:* +7 (XXX) XXX-XX-XX
*Email:* support@example.com
*Время работы:* Пн-Пт 9:00-18:00

Или напишите нам прямо здесь, и мы ответим в ближайшее время.
    `

    await ctx.reply(supportMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔙 Назад', callback_data: 'main_menu' }
          ]
        ]
      }
    })
  }

  // Обработчик команды /about
  static async handleAbout(ctx: Context) {
    const aboutMessage = `
🏪 *О магазине "Мужской стиль"*

Мы специализируемся на качественной мужской одежде и аксессуарах.

*Наши преимущества:*
✅ Качественные материалы
✅ Современный дизайн
✅ Быстрая доставка
✅ Удобная оплата
✅ Гарантия качества

*Категории товаров:*
👕 Футболки и рубашки
👖 Джинсы и брюки
🧥 Куртки и пальто
🏃 Спортивная одежда
👟 Обувь
🎩 Аксессуары

*Контакты:*
📍 Адрес: ул. Примерная, 123
📞 Телефон: +7 (XXX) XXX-XX-XX
🌐 Сайт: example.com
    `

    await ctx.reply(aboutMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛍 Перейти в магазин', web_app: { url: process.env.MINI_APP_URL! } }
          ],
          [
            { text: '🔙 Назад', callback_data: 'main_menu' }
          ]
        ]
      }
    })
  }

  // Обработчик команды /stats (только для админов)
  static async handleStats(ctx: Context) {
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (userId?.toString() !== adminChatId) {
      await ctx.reply('❌ У вас нет доступа к этой команде')
      return
    }

    try {
      const stats = await OrderService.getOrderStats()
      if (!stats) {
        await ctx.reply('❌ Ошибка получения статистики')
        return
      }

      const message = MessageFormatter.formatStats(stats)
      await ctx.reply(message, { parse_mode: 'Markdown' })
    } catch (error) {
      console.error('Ошибка получения статистики:', error)
      await ctx.reply('❌ Произошла ошибка при получении статистики')
    }
  }
} 