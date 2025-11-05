# Mapi AI - Documentación

Bienvenido a la documentación de Mapi AI, tu asistente inteligente para planificar viajes.

## 📚 Índice de Documentación

### Sistema de Borradores (Drafts)

El sistema de borradores permite a los usuarios guardar y continuar sus planificaciones de viaje en cualquier momento.

- **[DRAFT_SYSTEM_COMPLETE.md](./DRAFT_SYSTEM_COMPLETE.md)** - 📖 Documentación completa del sistema de borradores
  - Arquitectura completa
  - Interfaces y tipos TypeScript
  - Componentes y stores
  - Flujo de datos completo

- **[DRAFT_SYSTEM_SUMMARY.md](./DRAFT_SYSTEM_SUMMARY.md)** - 📋 Resumen ejecutivo del sistema de borradores
  - Vista rápida de características
  - Casos de uso principales
  - Integración con el wizard

- **[DRAFT_QUICK_START.md](./DRAFT_QUICK_START.md)** - 🚀 Guía de inicio rápido
  - Cómo usar los borradores como usuario
  - Tutorial paso a paso
  - Preguntas frecuentes

- **[DRAFT_SYSTEM_IMPLEMENTATION.md](./DRAFT_SYSTEM_IMPLEMENTATION.md)** - 🔧 Detalles de implementación técnica
  - Decisiones de arquitectura
  - Patrones de código utilizados
  - Consideraciones de rendimiento

- **[DRAFT_DELETION_IMPLEMENTATION.md](./DRAFT_DELETION_IMPLEMENTATION.md)** - 🗑️ Eliminación automática de borradores
  - Ciclo de vida de un borrador
  - Eliminación al finalizar viaje
  - Puntos de eliminación en el flujo

### Sistema Modular

- **[MODULAR_DRAFTS_SYSTEM.md](./MODULAR_DRAFTS_SYSTEM.md)** - 🧩 Integración del sistema modular con borradores
  - Wizard modular
  - Módulos dinámicos
  - Estados de progreso por módulo

### Mejoras de UI/UX

- **[SIDEBAR_DRAFTS_IMPROVEMENTS.md](./SIDEBAR_DRAFTS_IMPROVEMENTS.md)** - 🎨 Mejoras en el sidebar y visualización de borradores
  - Diseño responsive
  - Indicadores de progreso
  - Interacciones de usuario

### Migraciones y Futuro

- **[SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)** - 🔄 Plan de migración a Supabase
  - De localStorage a base de datos
  - Esquema de tablas
  - Estrategia de migración
  - Sincronización en tiempo real

- **[FUTURE_FEATURES.md](./FUTURE_FEATURES.md)** - 🔮 Características futuras planificadas
  - Roadmap del producto
  - Nuevas funcionalidades
  - Mejoras propuestas

## 🗂️ Organización de la Documentación

### Por Audiencia

**Para Usuarios:**
- [DRAFT_QUICK_START.md](./DRAFT_QUICK_START.md) - Empieza aquí
- [DRAFT_SYSTEM_SUMMARY.md](./DRAFT_SYSTEM_SUMMARY.md) - Resumen de funcionalidades

**Para Desarrolladores:**
- [DRAFT_SYSTEM_COMPLETE.md](./DRAFT_SYSTEM_COMPLETE.md) - Arquitectura completa
- [DRAFT_SYSTEM_IMPLEMENTATION.md](./DRAFT_SYSTEM_IMPLEMENTATION.md) - Implementación técnica
- [DRAFT_DELETION_IMPLEMENTATION.md](./DRAFT_DELETION_IMPLEMENTATION.md) - Lógica de eliminación
- [MODULAR_DRAFTS_SYSTEM.md](./MODULAR_DRAFTS_SYSTEM.md) - Sistema modular

**Para Product Managers:**
- [FUTURE_FEATURES.md](./FUTURE_FEATURES.md) - Roadmap
- [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) - Plan de escalabilidad

**Para Diseñadores:**
- [SIDEBAR_DRAFTS_IMPROVEMENTS.md](./SIDEBAR_DRAFTS_IMPROVEMENTS.md) - UI/UX

### Por Tema

**🎯 Funcionalidad Principal:**
1. Sistema de Borradores
2. Wizard Modular
3. Gestión de Viajes

**💾 Persistencia de Datos:**
1. localStorage (actual)
2. Supabase (futuro)

**🎨 Interfaz de Usuario:**
1. Sidebar
2. Indicadores de progreso
3. Modales y toasts

## 📖 Convenciones de Documentación

### Emojis Utilizados

- 📖 Documentación completa
- 📋 Resumen
- 🚀 Guía rápida
- 🔧 Implementación técnica
- 🗑️ Eliminación/Limpieza
- 🧩 Modular/Componentes
- 🎨 UI/UX
- 🔄 Migraciones
- 🔮 Futuro
- ✅ Completado
- 🔄 En progreso
- ⏳ Pendiente

### Estructura de Archivos

Cada documento de implementación sigue esta estructura:

1. **Overview** - Resumen ejecutivo
2. **Requisitos** - Requisitos del usuario o del sistema
3. **Implementación** - Detalles técnicos
4. **Archivos Modificados** - Lista de cambios
5. **Workflow** - Diagramas de flujo
6. **Testing** - Checklist de pruebas
7. **Notas** - Consideraciones adicionales

## 🔗 Enlaces Rápidos

### Archivos de Código Principal

**Tipos:**
- `src/types/draft.ts` - Interfaces TypeScript
- `src/types/wizard.ts` - Tipos del wizard

**Stores (Zustand):**
- `src/stores/draftStore.ts` - Estado de borradores
- `src/stores/wizardStore.ts` - Estado del wizard

**Componentes de Borradores:**
- `src/components/drafts/DraftManager.tsx` - Auto-guardado
- `src/components/drafts/DraftList.tsx` - Lista de borradores
- `src/components/drafts/DraftItem.tsx` - Item individual
- `src/components/drafts/SaveDraftButton.tsx` - Botón manual
- `src/components/drafts/DraftDebugPanel.tsx` - Panel de debug

**Páginas:**
- `src/app/plan/page.tsx` - Página de planificación
- `src/app/wizard-modular/page.tsx` - Wizard modular
- `src/app/packages/page.tsx` - Paquetes de viaje

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15.3.3 (App Router)
- **Lenguaje:** TypeScript 5
- **Estado:** Zustand 5.0.8
- **Estilos:** Tailwind CSS
- **Almacenamiento:** localStorage (migración a Supabase planificada)
- **UI Components:** Custom components + shadcn/ui

## 📝 Changelog

### 2024-11
- ✅ Sistema de borradores implementado
- ✅ Auto-guardado cada 30 segundos
- ✅ Eliminación automática al reservar
- ✅ Cálculo de progreso mejorado
- ✅ UI refinada (toasts en lugar de alerts)
- ✅ Botón "Volver a editar" en resumen
- ✅ Documentación organizada en carpeta `/docs`

## 🤝 Contribuir

Al agregar nueva funcionalidad:

1. **Documenta primero** - Crea o actualiza el archivo MD correspondiente
2. **Sigue las convenciones** - Usa la estructura estándar
3. **Actualiza este README** - Agrega enlaces a nueva documentación
4. **Usa emojis** - Para mejor legibilidad
5. **Ejemplos de código** - Incluye snippets cuando sea relevante

## 📧 Contacto

Para preguntas o sugerencias sobre la documentación, contacta al equipo de desarrollo.

---

**Última actualización:** Noviembre 2024  
**Versión:** 1.0.0  
**Mantenedor:** Equipo Mapi AI
