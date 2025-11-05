# Sistema de Borradores (Drafts) - Mapi

## 📋 Descripción General

El sistema de borradores permite a los usuarios guardar el progreso del wizard de planificación de viajes antes de completarlo. Los borradores se guardan automáticamente en `localStorage` y pueden ser restaurados en cualquier momento.

## 🎯 Características Principales

### ✅ Funcionalidades Implementadas

1. **Auto-guardado Automático**
   - Se guarda automáticamente cada 30 segundos
   - Solo cuando hay servicios seleccionados
   - No guarda si el wizard está completado

2. **Gestión de Borradores**
   - ✅ Crear borrador (manual o automático)
   - ✅ Listar borradores en el sidebar
   - ✅ Cargar borrador (restaurar estado del wizard)
   - ✅ Editar nombre del borrador
   - ✅ Eliminar borrador
   - ✅ Ver progreso del borrador (0-100%)

3. **UI/UX**
   - Badge "DRAFT" para distinguir de viajes completados
   - Círculo de progreso visual en vista colapsada
   - Barra de progreso en vista expandida
   - Tooltips informativos
   - Timestamps relativos (hace 5m, hace 2h, etc.)

4. **Persistencia**
   - Almacenamiento en `localStorage`
   - Sincronización automática
   - Limpieza al completar viaje

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── draft.ts                      # Tipos TypeScript para drafts
├── stores/
│   └── draftStore.ts                 # Zustand store para drafts
├── components/
│   └── drafts/
│       ├── index.ts                  # Exports
│       ├── DraftManager.tsx          # Auto-save manager
│       ├── DraftList.tsx             # Lista de drafts
│       └── DraftItem.tsx             # Item individual
└── modals/
    └── EditDraftNameModal.tsx        # Modal para editar nombre
```

## 🔧 Uso e Integración

### 1. Integración Básica

El sistema ya está integrado en las siguientes páginas:
- `/plan` - Página principal del wizard
- `/wizard-modular` - Wizard modular

### 2. Componentes Clave

#### DraftManager
```tsx
import { DraftManager } from "@/components/drafts/DraftManager";

// Agregar en el layout o página del wizard
<DraftManager />
```

Este componente:
- No renderiza nada visible
- Gestiona el auto-guardado
- Se activa/desactiva automáticamente

#### DraftList
```tsx
import { DraftList } from "@/components/drafts/DraftList";

<DraftList
  isCollapsed={false}
  onDraftClick={(draft) => handleLoadDraft(draft)}
  onEditDraftName={(draft, e) => handleEdit(draft, e)}
  onDeleteDraft={(draft, e) => handleDelete(draft, e)}
  selectedDraftId={currentDraftId}
/>
```

### 3. Usar el Store

```tsx
import { useDraftStore } from "@/stores/draftStore";

function MyComponent() {
  const { 
    drafts,              // Lista de todos los drafts
    currentDraftId,      // ID del draft actual
    saveDraft,           // Guardar draft
    loadDraft,           // Cargar draft
    deleteDraft,         // Eliminar draft
    updateDraftName,     // Actualizar nombre
    enableAutoSave,      // Habilitar auto-save
    disableAutoSave,     // Deshabilitar auto-save
  } = useDraftStore();
  
  // Usar las funciones...
}
```

## 📊 Estructura de Datos

### Draft Object
```typescript
interface Draft {
  id: string;                       // UUID único
  name: string;                     // Nombre generado o personalizado
  progress: number;                 // 0-100%
  
  // Estado del wizard
  selectedServices: ServiceType[];
  activeModules: ModuleState[];
  currentModuleIndex: number;
  completed: boolean;
  
  // Metadatos
  createdAt: string;                // ISO 8601
  updatedAt: string;                // ISO 8601
  
  // Preview (info rápida)
  previewInfo?: {
    origin?: string;
    destination?: string;
    dates?: string;
    travelers?: number;
  };
}
```

## 🎨 UI/UX Details

### Vista Expandida
```
┌─────────────────────────────────┐
│ ● Vuelos + Hotel - 5 Nov 14:30 │
│   DRAFT                      📝 🗑│
│   CUN → MEX                      │
│   10 Nov - 15 Nov                │
│   ████████░░░░░░░░ 45%          │
│   Hace 2m                        │
└─────────────────────────────────┘
```

### Vista Colapsada
```
┌────┐
│ 45%│  <- Círculo de progreso
│    │
└────┘
DRAFT
```

## 🔄 Flujo de Trabajo

### Crear un Nuevo Viaje
1. Usuario hace clic en "Nuevo Viaje"
2. Se resetea el wizard
3. Se limpia el `currentDraftId`
4. Usuario comienza a llenar el wizard
5. Auto-save se activa después de seleccionar servicios
6. Draft se guarda cada 30 segundos

### Cargar un Borrador
1. Usuario hace clic en un draft en el sidebar
2. `loadDraft()` restaura el estado del wizard
3. Usuario continúa desde donde lo dejó
4. Auto-save se mantiene activo
5. Los cambios actualizan el mismo draft

### Completar un Viaje
1. Usuario completa todos los pasos del wizard
2. Auto-save se desactiva automáticamente
3. (Futuro) Draft se convierte en Trip
4. (Futuro) Draft se elimina

## 🚀 Próximas Mejoras

### Migración a Supabase (Planificado)
- [ ] Sincronización entre dispositivos
- [ ] Compartir drafts con otros usuarios
- [ ] Historial de versiones
- [ ] Backup automático en la nube

### Características Adicionales
- [ ] Duplicar borrador
- [ ] Exportar borrador como JSON
- [ ] Importar borrador desde JSON
- [ ] Convertir draft a trip automáticamente
- [ ] Recordatorios para drafts antiguos
- [ ] Búsqueda y filtrado de drafts
- [ ] Ordenar por: fecha, progreso, nombre

## 🐛 Debugging

### Ver drafts en localStorage
```javascript
// En la consola del navegador
const drafts = JSON.parse(localStorage.getItem('mapi_drafts'));
console.log(drafts);
```

### Limpiar todos los drafts
```javascript
localStorage.removeItem('mapi_drafts');
```

### Ver estado del draft store
```javascript
// En un componente React con DevTools
const draftStore = useDraftStore.getState();
console.log(draftStore);
```

## 📝 Notas Importantes

1. **LocalStorage Limits**: 
   - Máximo ~5-10MB por dominio
   - Considerar limitar número de drafts (ej: máximo 20)

2. **Auto-save Timing**:
   - Intervalo: 30 segundos
   - Solo cuando hay cambios en el wizard
   - Se desactiva al completar o al salir

3. **Compatibilidad**:
   - Funciona en todos los navegadores modernos
   - Requiere JavaScript habilitado
   - No funciona en modo incógnito (datos se pierden al cerrar)

## 🔗 Referencias

- **Zustand**: https://github.com/pmndrs/zustand
- **LocalStorage API**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Next.js Client Components**: https://nextjs.org/docs/app/building-your-application/rendering/client-components

---

**Implementado por**: GitHub Copilot  
**Fecha**: Noviembre 2025  
**Versión**: 1.0.0
