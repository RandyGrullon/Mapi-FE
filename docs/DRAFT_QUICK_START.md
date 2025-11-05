# Draft System - Quick Start Guide

## ✅ Implementation Complete!

The draft system has been successfully implemented in your Mapi travel planning app.

## 🎉 What's New

### Features Implemented

1. **Auto-Save**: Automatically saves wizard progress every 30 seconds
2. **Draft List**: View all saved drafts in the sidebar
3. **Load Draft**: Click any draft to continue where you left off
4. **Edit Names**: Rename drafts for better organization
5. **Delete Drafts**: Remove drafts you no longer need
6. **Progress Tracking**: Visual progress indicator (0-100%)
7. **Smart UI**: Collapsed/expanded views with tooltips

## 📍 Where to Find It

### Sidebar
- **Drafts Section**: Located above "Mis Viajes" in the sidebar
- **Badge**: Yellow "DRAFT" badge distinguishes drafts from completed trips
- **Expand/Collapse**: Click the arrow to show/hide the drafts list

### Visual Indicators
- **Progress Circle**: In collapsed sidebar view
- **Progress Bar**: In expanded sidebar view
- **Timestamp**: Shows when last updated (e.g., "Hace 2m")

## 🚀 How to Use

### Create a New Draft
1. Click "Nuevo Viaje" in the sidebar
2. Select services (Flights, Hotel, Car, Activities)
3. Start filling out the wizard
4. Draft is automatically saved every 30 seconds
5. You'll see it appear in the "Borradores" section

### Load a Draft
1. Go to the sidebar
2. Click on any draft in the "Borradores" section
3. The wizard will restore your previous progress
4. Continue from where you left off

### Edit Draft Name
1. Hover over a draft in expanded sidebar view
2. Click the pencil icon (📝)
3. Enter a new name
4. Click "Guardar"

### Delete a Draft
1. Hover over a draft in expanded sidebar view
2. Click the trash icon (🗑️)
3. Confirm deletion in the modal

## 🗂️ Files Created

```
src/
├── types/draft.ts
├── stores/draftStore.ts
├── components/
│   └── drafts/
│       ├── index.ts
│       ├── DraftManager.tsx
│       ├── DraftList.tsx
│       └── DraftItem.tsx
└── modals/
    └── EditDraftNameModal.tsx
```

## 🔧 Technical Details

### Storage
- Uses browser `localStorage`
- Key: `mapi_drafts`
- Persists across browser sessions
- ~5-10MB storage limit

### Auto-Save
- Interval: 30 seconds
- Only active when wizard is in progress
- Disabled when wizard is completed
- Disabled when no services selected

### State Management
- Zustand store for global state
- Syncs with wizard store
- Real-time updates

## 🧪 Testing Checklist

Try these scenarios to test the draft system:

- [ ] Start a new trip and see if draft is auto-saved
- [ ] Close the browser and reopen - draft should still be there
- [ ] Load a draft and continue editing
- [ ] Rename a draft
- [ ] Delete a draft
- [ ] Create multiple drafts
- [ ] View drafts in collapsed sidebar
- [ ] View drafts in expanded sidebar
- [ ] Check progress percentage updates
- [ ] Verify timestamp shows relative time

## 🐛 Known Limitations

1. **LocalStorage Only**: Currently uses localStorage (Supabase migration planned)
2. **No Sync**: Drafts don't sync between devices yet
3. **No Limit**: No maximum number of drafts enforced (consider adding)
4. **Incognito Mode**: Drafts are lost when closing incognito window

## 📝 Next Steps (Future Enhancements)

- [ ] Migrate to Supabase for cloud storage
- [ ] Add draft sharing between users
- [ ] Implement version history
- [ ] Add draft templates
- [ ] Auto-delete old drafts (e.g., after 30 days)
- [ ] Export/import drafts

## 💡 Tips

1. **Name Your Drafts**: Edit draft names to make them easy to find
2. **Clean Up**: Delete drafts you no longer need to keep things organized
3. **Progress Bar**: Green progress shows how much of the wizard is complete
4. **Auto-Save Indicator**: Toast notification appears when draft is saved

## 🎨 UI Color Scheme

- **Draft Badge**: Amber/Yellow (`bg-amber-100`, `text-amber-700`)
- **Progress Bar**: Amber (`bg-amber-500`)
- **Selected State**: Blue (`border-blue-500`, `bg-blue-100`)
- **Icons**: Gray (`text-gray-600`)

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Clear localStorage if needed: `localStorage.removeItem('mapi_drafts')`
3. Refresh the page
4. Check if browser has localStorage enabled

---

**Status**: ✅ Ready to Use  
**Version**: 1.0.0  
**Date**: November 2025
