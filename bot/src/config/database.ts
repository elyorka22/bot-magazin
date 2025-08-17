import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Проверка подключения
export const testConnection = async () => {
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