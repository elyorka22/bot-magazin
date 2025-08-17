declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        sendData: (data: string) => void
        MainButton: {
          text: string
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
        }
        BackButton: {
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
        }
        viewportHeight: number
        onEvent: (eventType: string, callback: (event: any) => void) => void
      }
    }
  }
}

export const initializeTelegramApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    // Готовность приложения
    window.Telegram.WebApp.ready()
    
    // Расширение на полную высоту
    window.Telegram.WebApp.expand()
    
    // Настройка темы
    const theme = window.Telegram.WebApp.themeParams
    if (theme.bg_color) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg_color)
    }
    if (theme.text_color) {
      document.documentElement.style.setProperty('--tg-theme-text-color', theme.text_color)
    }
    
    return true
  }
  return false
}

export const sendDataToBot = (data: any) => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(data))
  }
}

export const closeApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.close()
  }
}

export const getUserData = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe?.user
  }
  return null
}

export const setMainButton = (text: string, onClick: () => void) => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.MainButton.text = text
    window.Telegram.WebApp.MainButton.onClick(onClick)
    window.Telegram.WebApp.MainButton.show()
  }
}

export const hideMainButton = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.MainButton.hide()
  }
} 