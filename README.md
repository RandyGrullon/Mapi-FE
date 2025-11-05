# Mapi - Asistente de IA para Planificación de Viajes

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3-orange)](https://firebase.google.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-0.24-green)](https://ai.google.dev/)

Una aplicación web moderna y responsiva para planificar viajes con asistencia inteligente de IA, construida con Next.js, React y TypeScript.

## 🌟 Características Principales

### 🗺️ Planificación de Viajes Guiada
- **Wizard interactivo**: Proceso paso a paso para planificar viajes
- **Paquetes personalizados**: Sugerencias de viajes basadas en preferencias
- **Gestión de borradores**: Guarda y continúa planes en progreso
- **Vista de detalles**: Información completa de cada viaje planificado

### 🤖 Asistente Conversacional
- **Chat inteligente**: Basado en Google Generative AI
- **Historial de conversaciones**: Mantén el contexto en múltiples sesiones
- **Interfaz intuitiva**: Diseño moderno y fácil de usar

### 🔐 Autenticación y Seguridad
- **Login/Register**: Sistema completo con Firebase Auth
- **Sesiones persistentes**: Mantén la sesión activa
- **Protección de datos**: Seguridad integrada con Firebase

### 🎨 Diseño y UX
- **Interfaz moderna**: Construida con Tailwind CSS y shadcn/ui
- **Responsive design**: Optimizada para móvil y desktop
- **Tema consistente**: Paleta de colores profesional
- **Animaciones suaves**: Experiencia fluida

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 15](https://nextjs.org/) con App Router
- **Lenguaje**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 18](https://reactjs.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **IA**: [Google Generative AI](https://ai.google.dev/)
- **Configuración**: ESLint, PostCSS, TypeScript

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm, yarn o pnpm
- Cuenta de Firebase
- API Key de Google AI

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/RandyGrullon/Mapi-FE.git
   cd Mapi-FE
   ```

2. **Instala dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configura variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google AI Configuration
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Configura Firebase**
   - Ve a la [consola de Firebase](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita Authentication y Firestore
   - Copia las credenciales al archivo `.env.local`

5. **Ejecuta la aplicación**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Uso

### Para Usuarios
1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Planificación**: Usa el wizard para crear un nuevo viaje
3. **Chat**: Consulta al asistente IA para recomendaciones
4. **Gestión**: Ve tus viajes y conversaciones guardadas

### Para Desarrolladores
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta ESLint

## � Documentación

Toda la documentación técnica y guías están organizadas en la carpeta `/docs`:

- **[Guía de Inicio Rápido](./docs/DRAFT_QUICK_START.md)** - Empieza aquí para usar el sistema de borradores
- **[Sistema de Borradores](./docs/DRAFT_SYSTEM_COMPLETE.md)** - Documentación completa del sistema de drafts
- **[Sistema Modular](./docs/MODULAR_DRAFTS_SYSTEM.md)** - Wizard modular y gestión de estados
- **[Mejoras de UI/UX](./docs/SIDEBAR_DRAFTS_IMPROVEMENTS.md)** - Diseño del sidebar y componentes
- **[Características Futuras](./docs/FUTURE_FEATURES.md)** - Roadmap y próximas funcionalidades
- **[Migración a Supabase](./docs/SUPABASE_MIGRATION.md)** - Plan de migración de backend

👉 **[Ver toda la documentación](./docs/README.md)**

## �📁 Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   ├── globals.css              # Estilos globales
│   ├── login/                   # Página de login
│   ├── plan/                    # Página de planificación
│   ├── packages/                # Paquetes de viaje
│   ├── trip/                    # Detalles de viaje
│   └── wizard-modular/          # Wizard modular
├── components/                  # Componentes React
│   ├── ui/                      # Componentes shadcn/ui
│   ├── drafts/                  # Componentes de borradores
│   ├── wizard/                  # Componentes del wizard
│   ├── sidebar/                 # Sidebar y navegación
│   ├── trips/                   # Gestión de viajes
│   ├── travel/                  # Paquetes de viaje
│   └── ...
├── lib/                         # Utilidades y configuración
│   ├── utils.ts                 # Funciones utilitarias
│   └── ...
├── stores/                      # Estado global (Zustand)
│   ├── wizardStore.ts           # Estado del wizard
│   ├── draftStore.ts            # Estado de borradores
│   └── ...
├── types/                       # Definiciones TypeScript
│   ├── wizard.ts                # Tipos del wizard
│   ├── draft.ts                 # Tipos de borradores
│   └── ...
└── hooks/                       # Custom hooks
    ├── use-mobile.tsx
    └── use-toast.ts
docs/                            # Documentación técnica
├── README.md                    # Índice de documentación
├── DRAFT_SYSTEM_COMPLETE.md
├── DRAFT_QUICK_START.md
└── ...
```

## 🔧 Configuración Avanzada

### Firebase Security Rules
Asegúrate de configurar las reglas de seguridad en Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para viajes
    match /trips/{tripId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    // Reglas para conversaciones
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Variables de Entorno
Todas las variables de entorno necesarias están documentadas arriba. Asegúrate de no commitear `.env.local` al repositorio.

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Usa commits descriptivos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework increíble
- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de estilos
- [Firebase](https://firebase.google.com/) por el backend
- [Google AI](https://ai.google.dev/) por la IA conversacional

---

¡Disfruta planificando tus viajes con Mapi! ✈️🌍