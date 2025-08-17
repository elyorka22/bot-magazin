import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Создаем клиент Supabase только если переменные окружения доступны
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration is missing')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - получение всех товаров
export async function GET() {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}

// POST - создание нового товара
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
} 