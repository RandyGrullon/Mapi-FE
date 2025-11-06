import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseServiceKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY')
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get(name: string) {
        const cookie = cookieStore.get(name)
        return cookie?.value ?? ''
      },
      set(name: string, value: string, options: CookieOptions = {}) {
        cookieStore.set({
          name,
          value,
          path: '/',
          ...options,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        })
      },
      remove(name: string, options: CookieOptions = {}) {
        cookieStore.delete(name)
      }
    }
  })
}