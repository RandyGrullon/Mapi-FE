# Migración de Firebase a Supabase en Mapi-FE

Este documento detalla el proceso completo para migrar la aplicación Mapi de Firebase a Supabase, incluyendo la instalación, configuración, migración de servicios y actualización de componentes.

## 📋 Resumen de Cambios

Supabase reemplazará Firebase para:
- **Autenticación**: Auth de usuarios (login, registro, logout)
- **Base de datos**: Almacenamiento de viajes, conversaciones y mensajes
- **Seguridad**: Políticas RLS (Row Level Security) en lugar de Firestore Rules

## 🛠️ Paso 1: Instalación y Configuración Inicial

### 1.1 Instalar Dependencias

```bash
npm install @supabase/supabase-js
# o
yarn add @supabase/supabase-js
# o
pnpm add @supabase/supabase-js
```

### 1.2 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se configure (puede tomar unos minutos)
4. Ve a Settings > API para obtener las credenciales

### 1.3 Configurar Variables de Entorno

Actualiza o crea `.env.local`:

```env
# Supabase Configuration (reemplaza las de Firebase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Mantén Google AI (no cambia)
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## 🗄️ Paso 2: Configuración de Base de Datos

### 2.1 Crear Tablas en Supabase

Ve al SQL Editor en Supabase y ejecuta:

```sql
-- Tabla de usuarios (extiende auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de viajes
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'completed', 'cancelled')),
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de conversaciones
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de mensajes
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para mejor rendimiento
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trips
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_conversations
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

### 2.2 Configurar Políticas RLS (Row Level Security)

```sql
-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para trips
CREATE POLICY "Users can view own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para conversations
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para messages
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🔧 Paso 3: Configuración del Cliente Supabase

### 3.1 Crear Archivo de Configuración

Crea `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para server-side (opcional, para API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 3.2 Tipos TypeScript

Actualiza o crea `lib/types.ts`:

```typescript
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Trip {
  id: string
  user_id: string
  title: string
  description?: string
  destination?: string
  start_date?: string
  end_date?: string
  budget?: number
  status: 'draft' | 'planned' | 'completed' | 'cancelled'
  preferences?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  user_id: string
  content: string
  role: 'user' | 'assistant'
  metadata?: Record<string, any>
  created_at: string
}
```

## 🔐 Paso 4: Migración de Autenticación

### 4.1 Crear Servicio de Auth

Crea `lib/auth.ts`:

```typescript
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export const authService = {
  // Registro
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    return { data, error }
  },

  // Login
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Obtener sesión
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Listener de cambios de auth
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
```

### 4.2 Actualizar Auth Context

Actualiza `lib/auth-context.tsx`:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { authService } from './auth'
import type { Profile } from './types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    authService.getSession().then(({ session }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listener de cambios
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
    setLoading(false)
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await authService.signUp(email, password, fullName)
    return result
  }

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password)
    return result
  }

  const signOut = async () => {
    const result = await authService.signOut()
    return result
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## 💬 Paso 5: Migración de Servicios de Chat

### 5.1 Servicio de Conversaciones

Crea `lib/chat.ts`:

```typescript
import { supabase } from './supabase'
import type { Conversation, Message } from './types'

export const chatService = {
  // Obtener conversaciones del usuario
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Crear nueva conversación
  async createConversation(userId: string, title: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obtener mensajes de una conversación
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Enviar mensaje
  async sendMessage(
    conversationId: string,
    userId: string,
    content: string,
    role: 'user' | 'assistant' = 'user'
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content,
        role
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Actualizar conversación (última actividad)
  async updateConversation(conversationId: string) {
    const { error } = await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    if (error) throw error
  }
}
```

### 5.2 Actualizar Chat Context

Actualiza `lib/chat-context.tsx`:

```typescript
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { chatService } from './chat'
import { useAuth } from './auth-context'
import type { Conversation, Message } from './types'

interface ChatContextType {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  createConversation: (title: string) => Promise<void>
  selectConversation: (conversation: Conversation) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  loadConversations: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const loadConversations = async () => {
    if (!user) return

    try {
      const convs = await chatService.getConversations(user.id)
      setConversations(convs)
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const createConversation = async (title: string) => {
    if (!user) return

    try {
      const newConv = await chatService.createConversation(user.id, title)
      setConversations(prev => [newConv, ...prev])
      setCurrentConversation(newConv)
      setMessages([])
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const selectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation)
    setLoading(true)

    try {
      const msgs = await chatService.getMessages(conversation.id)
      setMessages(msgs)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (!currentConversation || !user) return

    try {
      // Enviar mensaje del usuario
      const userMessage = await chatService.sendMessage(
        currentConversation.id,
        user.id,
        content,
        'user'
      )
      setMessages(prev => [...prev, userMessage])

      // Aquí iría la lógica para obtener respuesta de la IA
      // Por ahora, simulamos una respuesta
      setTimeout(async () => {
        const aiMessage = await chatService.sendMessage(
          currentConversation.id,
          user.id,
          'Esta es una respuesta simulada de la IA.',
          'assistant'
        )
        setMessages(prev => [...prev, aiMessage])
        await chatService.updateConversation(currentConversation.id)
      }, 1000)

    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  useEffect(() => {
    if (user) {
      loadConversations()
    } else {
      setConversations([])
      setCurrentConversation(null)
      setMessages([])
    }
  }, [user])

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversation,
      messages,
      loading,
      createConversation,
      selectConversation,
      sendMessage,
      loadConversations
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
```

## 🗺️ Paso 6: Migración de Servicios de Viajes

### 6.1 Servicio de Viajes

Crea `lib/trips.ts`:

```typescript
import { supabase } from './supabase'
import type { Trip } from './types'

export const tripService = {
  // Obtener viajes del usuario
  async getTrips(userId: string): Promise<Trip[]> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Crear viaje
  async createTrip(userId: string, tripData: Partial<Trip>): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: userId,
        ...tripData
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Actualizar viaje
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar viaje
  async deleteTrip(tripId: string): Promise<void> {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)

    if (error) throw error
  },

  // Obtener viaje por ID
  async getTrip(tripId: string): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single()

    if (error) throw error
    return data
  }
}
```

## 🔄 Paso 7: Actualización de Componentes

### 7.1 Actualizar Layout Principal

En `src/app/layout.tsx`, envuelve la app con los providers:

```typescript
import { AuthProvider } from '@/lib/auth-context'
import { ChatProvider } from '@/lib/chat-context'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 7.2 Actualizar Formularios de Auth

En los componentes de login/register, usa el nuevo auth context:

```typescript
import { useAuth } from '@/lib/auth-context'

export function LoginForm() {
  const { signIn } = useAuth()
  // ... lógica del formulario
}
```

### 7.3 Actualizar Componentes de Chat

En los componentes de chat, usa el nuevo chat context:

```typescript
import { useChat } from '@/lib/chat-context'

export function ChatInterface() {
  const { messages, sendMessage, currentConversation } = useChat()
  // ... lógica del componente
}
```

## 🧪 Paso 8: Testing y Validación

### 8.1 Probar Autenticación

1. Registra un nuevo usuario
2. Verifica que se cree el perfil en la tabla `profiles`
3. Inicia sesión y verifica la sesión
4. Cierra sesión

### 8.2 Probar Chat

1. Crea una conversación
2. Envía mensajes
3. Verifica que se guarden en la base de datos
4. Carga conversaciones existentes

### 8.3 Probar Viajes

1. Crea un viaje
2. Actualiza detalles
3. Lista viajes del usuario

## 🚀 Paso 9: Despliegue

### 9.1 Variables de Producción

Asegúrate de configurar las variables de entorno en tu plataforma de despliegue (Vercel, Netlify, etc.):

```
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_production_ai_key
```

### 9.2 Actualizar .gitignore

Asegúrate de que `.env.local` esté en `.gitignore`:

```
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🔧 Solución de Problemas

### Error de Conexión
- Verifica las variables de entorno
- Asegúrate de que la URL de Supabase sea correcta
- Comprueba que las keys no estén expiradas

### Errores de RLS
- Verifica que las políticas estén correctamente configuradas
- Asegúrate de que el usuario esté autenticado
- Revisa los logs de Supabase

### Problemas de Tipos
- Asegúrate de que los tipos TypeScript estén actualizados
- Verifica que las interfaces coincidan con las tablas

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Migración de Firebase a Supabase](https://supabase.com/docs/guides/migrations/firebase)
- [Referencia de la API de Supabase](https://supabase.com/docs/reference/javascript)

---

¡La migración a Supabase está completa! Ahora tienes una base de datos PostgreSQL robusta con autenticación integrada.