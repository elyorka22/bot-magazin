import { Context } from 'telegraf'
import { OrderService } from '../services/orderService'
import { MessageFormatter } from '../utils/messageFormatter'

export class CallbackHandlers {
  // Обработчик главного меню
  static async handleMainMenu(ctx: Context) {
    const welcomeMessage = `
🎉 *Добро пожаловать в магазин "Мужской стиль"!*

Здесь вы можете:
🛍 Просматривать товары
📦 Отслеживать заказы
💬 Получать поддержку

Используйте кнопки ниже для навигации:
    `

    await ctx.editMessageText(welcomeMessage, {
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

  // Обработчик "Мои заказы"
  static async handleMyOrders(ctx: Context) {
    try {
      const userId = ctx.from?.id
      if (!userId) {
        await ctx.answerCbQuery('❌ Ошибка: не удалось определить пользователя')
        return
      }

      const orders = await OrderService.getUserOrders(userId)
      const message = MessageFormatter.formatOrdersList(orders)

      await ctx.editMessageText(message, {
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
      await ctx.answerCbQuery('❌ Произошла ошибка при получении заказов')
    }
  }

  // Обработчик "Поддержка"
  static async handleSupport(ctx: Context) {
    const supportMessage = `
📞 *Поддержка*

Если у вас есть вопросы или нужна помощь:

*Телефон:* +7 (XXX) XXX-XX-XX
*Email:* support@example.com
*Время работы:* Пн-Пт 9:00-18:00

Или напишите нам прямо здесь, и мы ответим в ближайшее время.
    `

    await ctx.editMessageText(supportMessage, {
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

  // Обработчик "О магазине"
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

    await ctx.editMessageText(aboutMessage, {
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

  // Обработчик просмотра заказа
  static async handleViewOrder(ctx: Context, orderId: string) {
    try {
      const order = await OrderService.getOrderById(orderId)
      if (!order) {
        await ctx.answerCbQuery('❌ Заказ не найден')
        return
      }

      const items = await OrderService.getOrderItems(orderId)
      const message = MessageFormatter.formatOrderForUser(order, items)

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔙 К списку заказов', callback_data: 'my_orders' }
            ],
            [
              { text: '🛍 Новый заказ', web_app: { url: process.env.MINI_APP_URL! } }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Ошибка получения заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка при получении заказа')
    }
  }

  // Обработчик подтверждения заказа (для админов)
  static async handleConfirmOrder(ctx: Context, orderId: string) {
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (userId?.toString() !== adminChatId) {
      await ctx.answerCbQuery('❌ У вас нет доступа к этой функции')
      return
    }

    try {
      const success = await OrderService.updateOrderStatus(orderId, 'confirmed')
      if (success) {
        await ctx.answerCbQuery('✅ Заказ подтвержден')
        // Обновляем сообщение
        const order = await OrderService.getOrderById(orderId)
        const items = await OrderService.getOrderItems(orderId)
        if (order) {
          const message = MessageFormatter.formatOrderForAdmin(order, items)
          await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🚚 Отправить', callback_data: `ship_order_${orderId}` },
                  { text: '❌ Отменить', callback_data: `cancel_order_${orderId}` }
                ]
              ]
            }
          })
        }
      } else {
        await ctx.answerCbQuery('❌ Ошибка подтверждения заказа')
      }
    } catch (error) {
      console.error('Ошибка подтверждения заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }

  // Обработчик отправки заказа (для админов)
  static async handleShipOrder(ctx: Context, orderId: string) {
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (userId?.toString() !== adminChatId) {
      await ctx.answerCbQuery('❌ У вас нет доступа к этой функции')
      return
    }

    try {
      const success = await OrderService.updateOrderStatus(orderId, 'shipped')
      if (success) {
        await ctx.answerCbQuery('🚚 Заказ отправлен')
        // Обновляем сообщение
        const order = await OrderService.getOrderById(orderId)
        const items = await OrderService.getOrderItems(orderId)
        if (order) {
          const message = MessageFormatter.formatOrderForAdmin(order, items)
          await ctx.editMessageText(message, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🎉 Доставлен', callback_data: `deliver_order_${orderId}` }
                ]
              ]
            }
          })
        }
      } else {
        await ctx.answerCbQuery('❌ Ошибка отправки заказа')
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }

  // Обработчик доставки заказа (для админов)
  static async handleDeliverOrder(ctx: Context, orderId: string) {
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (userId?.toString() !== adminChatId) {
      await ctx.answerCbQuery('❌ У вас нет доступа к этой функции')
      return
    }

    try {
      const success = await OrderService.updateOrderStatus(orderId, 'delivered')
      if (success) {
        await ctx.answerCbQuery('🎉 Заказ доставлен')
        // Обновляем сообщение
        const order = await OrderService.getOrderById(orderId)
        const items = await OrderService.getOrderItems(orderId)
        if (order) {
          const message = MessageFormatter.formatOrderForAdmin(order, items)
          await ctx.editMessageText(message, {
            parse_mode: 'Markdown'
          })
        }
      } else {
        await ctx.answerCbQuery('❌ Ошибка обновления статуса')
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }

  // Обработчик отмены заказа (для админов)
  static async handleCancelOrder(ctx: Context, orderId: string) {
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (userId?.toString() !== adminChatId) {
      await ctx.answerCbQuery('❌ У вас нет доступа к этой функции')
      return
    }

    try {
      const success = await OrderService.updateOrderStatus(orderId, 'cancelled')
      if (success) {
        await ctx.answerCbQuery('❌ Заказ отменен')
        // Обновляем сообщение
        const order = await OrderService.getOrderById(orderId)
        const items = await OrderService.getOrderItems(orderId)
        if (order) {
          const message = MessageFormatter.formatOrderForAdmin(order, items)
          await ctx.editMessageText(message, {
            parse_mode: 'Markdown'
          })
        }
      } else {
        await ctx.answerCbQuery('❌ Ошибка отмены заказа')
      }
    } catch (error) {
      console.error('Ошибка отмены заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }
} 