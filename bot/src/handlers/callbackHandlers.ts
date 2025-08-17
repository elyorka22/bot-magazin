import { Context } from 'telegraf'
import { MessageFormatter } from '../utils/messageFormatter'
import { OrderService } from '../services/orderService'

export class CallbackHandlers {
  static async handleMainMenu(ctx: Context) {
    const welcomeMessage = `
🎉 *Главное меню магазина "Мужской стиль"*

Выберите действие:
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

  static async handleMyOrders(ctx: Context) {
    const userId = ctx.from?.id
    if (!userId) {
      await ctx.answerCbQuery('❌ Ошибка: не удалось определить пользователя')
      return
    }

    try {
      const orders = await OrderService.getUserOrders(userId)
      
      if (orders.length === 0) {
        await ctx.editMessageText('📦 У вас пока нет заказов', {
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
      await ctx.editMessageText(message, {
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
      await ctx.answerCbQuery('❌ Произошла ошибка при получении заказов')
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

    await ctx.editMessageText(supportMessage, {
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

    await ctx.editMessageText(aboutMessage, {
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

  static async handleViewOrder(ctx: Context, orderId: string) {
    try {
      const order = await OrderService.getOrderById(orderId)
      const items = await OrderService.getOrderItems(orderId)

      if (!order || !items) {
        await ctx.answerCbQuery('❌ Заказ не найден')
        return
      }

      const message = MessageFormatter.formatOrderForUser(order, items)
      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🛍 Сделать еще заказ', web_app: { url: process.env.MINI_APP_URL! } }
            ],
            [
              { text: '📦 Мои заказы', callback_data: 'my_orders' },
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Ошибка просмотра заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка при просмотре заказа')
    }
  }

  static async handleConfirmOrder(ctx: Context, orderId: string) {
    try {
      const success = await OrderService.updateOrderStatus(orderId, 'confirmed')
      if (success) {
        await ctx.answerCbQuery('✅ Заказ подтвержден')
        await ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [
              { text: '📦 Отправить заказ', callback_data: `ship_order_${orderId}` },
              { text: '❌ Отменить заказ', callback_data: `cancel_order_${orderId}` }
            ],
            [
              { text: '🔙 К списку заказов', callback_data: 'admin_orders' }
            ]
          ]
        })
      } else {
        await ctx.answerCbQuery('❌ Ошибка подтверждения заказа')
      }
    } catch (error) {
      console.error('Ошибка подтверждения заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }

  static async handleShipOrder(ctx: Context, orderId: string) {
    try {
      const success = await OrderService.updateOrderStatus(orderId, 'shipped')
      if (success) {
        await ctx.answerCbQuery('📦 Заказ отправлен')
        await ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [
              { text: '✅ Доставлен', callback_data: `deliver_order_${orderId}` }
            ],
            [
              { text: '🔙 К списку заказов', callback_data: 'admin_orders' }
            ]
          ]
        })
      } else {
        await ctx.answerCbQuery('❌ Ошибка отправки заказа')
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }

  static async handleDeliverOrder(ctx: Context, orderId: string) {
    try {
      const success = await OrderService.updateOrderStatus(orderId, 'delivered')
      if (success) {
        await ctx.answerCbQuery('✅ Заказ доставлен')
        await ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [
              { text: '✅ Заказ выполнен', callback_data: 'admin_orders' }
            ]
          ]
        })
      } else {
        await ctx.answerCbQuery('❌ Ошибка обновления статуса')
      }
    } catch (error) {
      console.error('Ошибка доставки заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }

  static async handleCancelOrder(ctx: Context, orderId: string) {
    try {
      const success = await OrderService.updateOrderStatus(orderId, 'cancelled')
      if (success) {
        await ctx.answerCbQuery('❌ Заказ отменен')
        await ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [
              { text: '🔙 К списку заказов', callback_data: 'admin_orders' }
            ]
          ]
        })
      } else {
        await ctx.answerCbQuery('❌ Ошибка отмены заказа')
      }
    } catch (error) {
      console.error('Ошибка отмены заказа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка')
    }
  }

  static async handleAdminOrders(ctx: Context) {
    // Проверяем, является ли пользователь админом
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (!adminChatId || userId?.toString() !== adminChatId) {
      await ctx.answerCbQuery('❌ У вас нет доступа к этой функции')
      return
    }

    try {
      const orders = await OrderService.getAllOrders()
      
      if (orders.length === 0) {
        await ctx.editMessageText('📦 Заказов пока нет', {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '➕ Добавить товар', web_app: { url: `${process.env.MINI_APP_URL}/admin` } }
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
      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '➕ Добавить товар', web_app: { url: `${process.env.MINI_APP_URL}/admin` } }
            ],
            [
              { text: '📊 Статистика', callback_data: 'admin_stats' },
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Ошибка получения заказов админа:', error)
      await ctx.answerCbQuery('❌ Произошла ошибка при получении заказов')
    }
  }

  static async handleAdminStats(ctx: Context) {
    // Проверяем, является ли пользователь админом
    const adminChatId = process.env.ADMIN_CHAT_ID
    const userId = ctx.from?.id

    if (!adminChatId || userId?.toString() !== adminChatId) {
      await ctx.answerCbQuery('❌ У вас нет доступа к этой функции')
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

      await ctx.editMessageText(statsMessage, {
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
      await ctx.answerCbQuery('❌ Произошла ошибка при получении статистики')
    }
  }
} 