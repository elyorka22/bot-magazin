import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Создаем клиент Supabase только если переменные настроены
export const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Проверка подключения
export const testConnection = async () => {
  if (!supabase) {
    console.log('⚠️  Supabase не настроен. Бот будет работать в режиме тестирования.')
    return false
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Ошибка подключения к Supabase:', error.message)
      return false
    }
    
    console.log('✅ Подключение к Supabase успешно')
    return true
  } catch (error) {
    console.error('❌ Ошибка подключения к Supabase:', error)
    return false
  }
} 