# Noty AI - Aplicación de Notas con Firebase

Una aplicación de notas moderna inspirada en Google Keep, construida con Next.js, React, Tailwind CSS y Firebase.

## 🚀 Características

### ✅ Autenticación
- **Login con email y contraseña**
- **Autenticación con Google**
- **Registro de nuevos usuarios**
- **Gestión de sesiones automática**

### 📝 Gestión de Notas
- **Crear notas** con título y contenido
- **Editar notas** haciendo clic en ellas
- **Eliminar notas**
- **Cambiar colores** de las notas
- **Búsqueda en tiempo real**
- **Vista de cuadrícula/lista**
- **Sincronización automática** con Firebase

### 🎨 Diseño
- **Paleta de colores personalizada**:
  - Red Crayola (`#ed254e`) - Color principal
  - Naples Yellow (`#f9dc5c`) - Amarillo
  - Tea Green (`#c2eabd`) - Verde
  - Oxford Blue (`#011936`) - Azul oscuro
  - Charcoal (`#465362`) - Gris carbón

- **Interfaz tipo Google Keep**
- **Responsive design**
- **Animaciones suaves**

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Hosting**: Listo para desplegar

## 🏗️ Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página principal
│   └── globals.css     # Estilos globales
├── components/         # Componentes reutilizables
│   ├── AuthForm.tsx    # Formulario de autenticación
│   └── LoadingSpinner.tsx # Spinner de carga
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Hook de autenticación
│   └── useNotes.ts     # Hook de gestión de notas
└── lib/                # Utilidades y configuración
    └── firebase/       # Configuración de Firebase
        ├── config.ts   # Configuración de Firebase
        ├── auth.ts     # Funciones de autenticación
        └── firestore.ts # Funciones de base de datos
```

## 🔧 Configuración de Firebase

El proyecto está configurado con Firebase para:

### Firestore Database
- Colección `notes` con los siguientes campos:
  - `title`: string
  - `content`: string
  - `color`: string
  - `userId`: string (ID del usuario propietario)
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

### Authentication
- Autenticación por email/contraseña
- Autenticación con Google
- Gestión automática de sesiones

## 🚀 Cómo Usar

1. **Acceder a la aplicación**: Ve a http://localhost:3000
2. **Registrarse/Iniciar sesión**: 
   - Usa tu email y contraseña
   - O inicia sesión con Google
3. **Crear notas**: 
   - Haz clic en "Crear una nota..."
   - Escribe un título y contenido
   - Selecciona un color
   - Haz clic en "Listo"
4. **Editar notas**: Haz clic en cualquier nota para editarla
5. **Buscar notas**: Usa la barra de búsqueda en el header
6. **Cambiar vista**: Alterna entre vista de cuadrícula y lista

## 📱 Funcionalidades

### Gestión de Notas
- Las notas se guardan automáticamente en Firebase
- Cada usuario solo ve sus propias notas
- Búsqueda instantánea por título y contenido
- Colores personalizables para organización visual

### Seguridad
- Autenticación requerida para acceder
- Cada nota está asociada al usuario que la creó
- Reglas de seguridad de Firebase (a implementar)

## 🎯 Próximas Funcionalidades

- [ ] Etiquetas para notas
- [ ] Notas fijadas
- [ ] Archivado de notas
- [ ] Modo oscuro
- [ ] Compartir notas
- [ ] Recordatorios
- [ ] Notas con imágenes
- [ ] Exportar notas

## 🔒 Seguridad

Recuerda configurar las reglas de seguridad de Firestore en la consola de Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🎨 Personalización

Los colores se pueden modificar en `tailwind.config.ts` y las variables CSS están definidas con nombres semánticos para fácil personalización.

---

¡Disfruta usando Noty AI para organizar tus ideas! 📝✨