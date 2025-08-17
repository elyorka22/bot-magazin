import { Order, OrderItem, Product } from '../types'

export class MessageFormatter {
  // Форматирование заказа для админа
  static formatOrderForAdmin(order: Order, items: OrderItem[]): string {
    const statusEmoji = {
      'pending': '⏳',
      'confirmed': '✅',
      'shipped': '🚚',
      'delivered': '🎉',
      'cancelled': '❌'
    }

    const statusText = {
      'pending': 'Ожидает подтверждения',
      'confirmed': 'Подтвержден',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    }

    let message = `🛍 *Новый заказ #${order.id.slice(0, 8)}*\n\n`
    message += `👤 *Клиент:* ${order.customer_name}\n`
    message += `📞 *Телефон:* ${order.customer_phone}\n`
    message += `📍 *Адрес:* ${order.delivery_address}\n`
    if (order.delivery_notes) {
      message += `📝 *Заметки:* ${order.delivery_notes}\n`
    }
    message += `🚚 *Доставка:* ${order.delivery_method === 'courier' ? 'Курьер' : 'Самовывоз'}\n`
    message += `💰 *Сумма:* ${order.total_amount.toLocaleString('ru-RU')} ₽\n`
    message += `📊 *Статус:* ${statusEmoji[order.status]} ${statusText[order.status]}\n`
    message += `📅 *Дата:* ${new Date(order.created_at).toLocaleDateString('ru-RU')}\n\n`

    if (items.length > 0) {
      message += `*Товары:*\n`
      items.forEach((item, index) => {
        const price = item.product.sale_price || item.product.price
        message += `${index + 1}. ${item.product.name}\n`
        message += `   ${item.quantity} шт. × ${price.toLocaleString('ru-RU')} ₽\n`
        if (item.size) message += `   Размер: ${item.size}\n`
        if (item.color) message += `   Цвет: ${item.color}\n`
        message += `\n`
      })
    }

    return message
  }

  // Форматирование заказа для пользователя
  static formatOrderForUser(order: Order, items: OrderItem[]): string {
    const statusEmoji = {
      'pending': '⏳',
      'confirmed': '✅',
      'shipped': '🚚',
      'delivered': '🎉',
      'cancelled': '❌'
    }

    const statusText = {
      'pending': 'Ожидает подтверждения',
      'confirmed': 'Подтвержден',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    }

    let message = `🛍 *Заказ #${order.id.slice(0, 8)}*\n\n`
    message += `💰 *Сумма:* ${order.total_amount.toLocaleString('ru-RU')} ₽\n`
    message += `📊 *Статус:* ${statusEmoji[order.status]} ${statusText[order.status]}\n`
    message += `📅 *Дата:* ${new Date(order.created_at).toLocaleDateString('ru-RU')}\n\n`

    if (items.length > 0) {
      message += `*Товары:*\n`
      items.forEach((item, index) => {
        const price = item.product.sale_price || item.product.price
        message += `${index + 1}. ${item.product.name}\n`
        message += `   ${item.quantity} шт. × ${price.toLocaleString('ru-RU')} ₽\n`
      })
    }

    return message
  }

  // Форматирование списка заказов
  static formatOrdersList(orders: Order[]): string {
    if (orders.length === 0) {
      return 'У вас пока нет заказов. Сделайте первый заказ в нашем магазине!'
    }

    let message = '🛍 *Ваши заказы:*\n\n'
    
    orders.forEach((order, index) => {
      const statusEmoji = {
        'pending': '⏳',
        'confirmed': '✅',
        'shipped': '🚚',
        'delivered': '🎉',
        'cancelled': '❌'
      }

      message += `${statusEmoji[order.status]} *Заказ #${order.id.slice(0, 8)}*\n`
      message += `💰 Сумма: ${order.total_amount.toLocaleString('ru-RU')} ₽\n`
      message += `📅 Дата: ${new Date(order.created_at).toLocaleDateString('ru-RU')}\n\n`
    })

    return message
  }

  // Форматирование статистики
  static formatStats(stats: any): string {
    let message = '📊 *Статистика заказов:*\n\n'
    message += `📦 Всего заказов: ${stats.total}\n`
    message += `⏳ Ожидают: ${stats.pending}\n`
    message += `✅ Подтверждены: ${stats.confirmed}\n`
    message += `🚚 Отправлены: ${stats.shipped}\n`
    message += `🎉 Доставлены: ${stats.delivered}\n`
    message += `❌ Отменены: ${stats.cancelled}\n\n`
    message += `💰 Общая выручка: ${stats.totalRevenue.toLocaleString('ru-RU')} ₽`

    return message
  }

  // Форматирование товара
  static formatProduct(product: Product): string {
    let message = `🛍 *${product.name}*\n\n`
    message += `📝 ${product.description}\n\n`
    
    if (product.sale_price && product.sale_price < product.price) {
      const discount = Math.round((1 - product.sale_price / product.price) * 100)
      message += `💰 Цена: ~~${product.price.toLocaleString('ru-RU')}~~ ${product.sale_price.toLocaleString('ru-RU')} ₽ (-${discount}%)\n`
    } else {
      message += `💰 Цена: ${product.price.toLocaleString('ru-RU')} ₽\n`
    }
    
    message += `📦 В наличии: ${product.stock_quantity} шт.\n`
    
    if (product.sizes && product.sizes.length > 0) {
      message += `📏 Размеры: ${product.sizes.join(', ')}\n`
    }
    
    if (product.colors && product.colors.length > 0) {
      message += `🎨 Цвета: ${product.colors.join(', ')}\n`
    }

    return message
  }
} 