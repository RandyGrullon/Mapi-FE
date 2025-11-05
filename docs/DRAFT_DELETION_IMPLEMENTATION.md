# Draft Deletion Implementation

## Overview
This document describes the implementation of automatic draft deletion when a trip is finalized or booked.

## User Requirement
> "si a una planificaicon o a un draft le doy a finalizar y a reservar un packete o selecciono yo todo invidivual el draft deberia dejar de existir por que ya se creo el viaje"

Translation: When a draft/plan is finalized and a package is booked (or individual selections are made), the draft should be deleted because the trip has been created.

## Implementation

### Files Modified

#### 1. `src/components/forms/SearchButton.tsx`
**Purpose:** Delete draft when user searches for packages (transitioning from planning to booking)

**Changes:**
- Added imports: `useDraftStore`, `useWizardStore`
- Added hooks in component: `currentDraftId`, `deleteDraft`, `clearCurrentDraft`, `resetWizard`
- In `handleSearch()` function, before navigation:
  ```typescript
  if (currentDraftId) {
    console.log('🗑️ Eliminando draft al buscar paquetes:', currentDraftId);
    deleteDraft(currentDraftId);
    clearCurrentDraft();
  }
  resetWizard();
  ```

**Reason:** When user clicks "Buscar paquetes", they're moving from the planning phase to the booking phase, so the draft is no longer needed.

---

#### 2. `src/components/travel/TravelPackagesPage.tsx`
**Purpose:** Delete draft when user books a package or creates custom package

**Changes:**
- Added imports: `useDraftStore`, `useWizardStore`
- Added hooks in component: `currentDraftId`, `deleteDraft`, `clearCurrentDraft`, `resetWizard`

**Modified Functions:**

##### a) `handleSelectPackage()` - Line ~73
When user selects a pre-built travel package:
```typescript
// Eliminar el draft actual ya que se creó un viaje
if (currentDraftId) {
  console.log('🗑️ Eliminando draft al reservar paquete:', currentDraftId);
  deleteDraft(currentDraftId);
  clearCurrentDraft();
}

// Resetear el wizard para la próxima vez
resetWizard();
```

##### b) `createCustomPackage()` - Line ~117
When user creates a custom package with individual selections:
```typescript
// Eliminar el draft actual ya que se creó un viaje personalizado
if (currentDraftId) {
  console.log('🗑️ Eliminando draft al crear paquete personalizado:', currentDraftId);
  deleteDraft(currentDraftId);
  clearCurrentDraft();
}

// Resetear el wizard para la próxima vez
resetWizard();
```

---

## Complete Workflow

### Draft Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User starts planning                                      │
│    → Opens /plan page                                        │
│    → Fills out wizard modules                                │
│    → Draft auto-saves every 30s + on changes                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User finishes planning                                    │
│    → Clicks "Buscar paquetes" in SearchButton                │
│    → **DRAFT DELETED** ✅                                    │
│    → Wizard reset                                            │
│    → Navigates to /packages page                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User books a trip                                         │
│    Option A: Select pre-built package                        │
│    → handleSelectPackage() called                            │
│    → Trip saved to completed trips                           │
│    → **DRAFT DELETED** ✅ (safety check)                    │
│    → Wizard reset                                            │
│                                                              │
│    Option B: Create custom package                           │
│    → createCustomPackage() called                            │
│    → Trip saved to completed trips                           │
│    → **DRAFT DELETED** ✅ (safety check)                    │
│    → Wizard reset                                            │
└──────────────────────────────────────────────────────────────┘
```

### Draft Deletion Points

1. **SearchButton (Primary deletion point)**
   - Trigger: User clicks "Buscar paquetes"
   - Effect: Draft deleted, wizard reset
   - Navigation: → `/packages`

2. **TravelPackagesPage - handleSelectPackage (Safety check)**
   - Trigger: User selects pre-built package
   - Effect: Draft deleted (if still exists), wizard reset, trip created
   - Navigation: → `/trip/[id]`

3. **TravelPackagesPage - createCustomPackage (Safety check)**
   - Trigger: User finalizes custom package
   - Effect: Draft deleted (if still exists), wizard reset, trip created
   - Navigation: → `/trip/[id]`

---

## Benefits

### 1. Clean State Management
- No orphaned drafts after trip creation
- Clear separation between "planning" and "completed" states
- Wizard is reset and ready for next trip

### 2. Data Integrity
- Single source of truth: either in draft or in trip, never both
- Prevents confusion about which data is current
- localStorage doesn't accumulate stale drafts

### 3. User Experience
- Smooth transition from planning to booking
- No manual draft cleanup needed
- Can start new trip without old draft data

### 4. Developer Experience
- Defensive programming with safety checks at multiple points
- Console logs for debugging draft lifecycle
- Clear code comments explaining each deletion point

---

## Testing Checklist

### Test Scenario 1: Complete Package Booking
1. ✅ Start new plan on `/plan`
2. ✅ Fill out wizard (destination, dates, travelers)
3. ✅ Verify draft appears in sidebar
4. ✅ Click "Buscar paquetes"
5. ✅ Verify draft deleted from sidebar
6. ✅ Select a pre-built package
7. ✅ Verify trip appears in completed trips
8. ✅ Verify no duplicate draft exists

### Test Scenario 2: Custom Package Creation
1. ✅ Start new plan on `/plan`
2. ✅ Fill out wizard
3. ✅ Verify draft appears in sidebar
4. ✅ Click "Buscar paquetes"
5. ✅ Verify draft deleted
6. ✅ Select individual flight, hotel, car, activities
7. ✅ Click "Crear Paquete Personalizado"
8. ✅ Verify trip appears in completed trips
9. ✅ Verify no duplicate draft exists

### Test Scenario 3: Multiple Drafts
1. ✅ Create Draft A for "Paris"
2. ✅ Create Draft B for "Tokyo"
3. ✅ Load Draft A from sidebar
4. ✅ Complete planning and book
5. ✅ Verify only Draft A deleted
6. ✅ Verify Draft B still exists

### Test Scenario 4: Edge Cases
1. ✅ Book without currentDraftId (direct navigation)
2. ✅ Verify no errors
3. ✅ Create draft, delete manually, then book
4. ✅ Verify no errors on redundant deletion

---

## Future Improvements

### 1. Archive Instead of Delete
Instead of permanently deleting drafts, consider archiving them:
```typescript
interface Draft {
  // ... existing fields
  isArchived: boolean;
  archivedAt?: string;
  convertedToTripId?: string;
}
```

Benefits:
- User can reference past plans
- Analytics on conversion rate (draft → trip)
- Undo functionality if booking fails

### 2. Confirmation Before Deletion
Add user confirmation before deleting draft on package search:
```typescript
const handleSearch = async () => {
  if (currentDraftId) {
    const confirm = await showModal({
      title: "¿Finalizar planificación?",
      message: "Tu borrador se eliminará al buscar paquetes. ¿Continuar?",
      confirmText: "Buscar paquetes",
      cancelText: "Seguir editando"
    });
    if (!confirm) return;
  }
  // ... continue with deletion
};
```

### 3. Supabase Sync
When migrating to Supabase:
- Soft delete drafts (deleted_at timestamp)
- Link draft to created trip (draft.trip_id → trips.id)
- Enable draft recovery for X days

---

## Console Logs

For debugging, the following logs are emitted:

```
🗑️ Eliminando draft al buscar paquetes: [draftId]
🗑️ Eliminando draft al reservar paquete: [draftId]
🗑️ Eliminando draft al crear paquete personalizado: [draftId]
```

To disable logs in production, search for `console.log('🗑️` and remove.

---

## Related Documentation

- `DRAFT_SYSTEM_COMPLETE.md` - Complete draft system architecture
- `DRAFT_SYSTEM_SUMMARY.md` - Quick reference for draft features
- `MODULAR_DRAFTS_SYSTEM.md` - Integration with modular wizard
- `SUPABASE_MIGRATION.md` - Future backend migration plan

---

## Implementation Date
- **Completed:** 2024 (based on user request timeline)
- **Developers:** AI Assistant + randy.grullon
- **Status:** ✅ Fully Implemented

---

## Notes

### Why Multiple Deletion Points?
We delete drafts at both the "search" and "booking" stages as a defensive programming strategy:

1. **SearchButton (primary):** Most users will click "Buscar paquetes" which deletes the draft immediately
2. **Package selection (safety):** In case user navigates directly to packages via URL or bookmark, we have a safety check

This prevents edge cases where a draft might survive the booking process.

### Why Reset Wizard?
After booking, we call `resetWizard()` to:
- Clear all wizard state (modules, selections, current step)
- Prepare for next trip planning session
- Prevent stale data from affecting new drafts

This ensures a clean slate for the next user interaction.
