# Modificaciones a componentes de shadcn/ui

Al actualizar componentes con `npx shadcn add <component>`, los archivos en `src/components/ui/` se sobreescriben. Re-aplicar los siguientes cambios manualmente después de cada actualización.

---

## `src/components/ui/alert-dialog.tsx`

### 1. Z-index elevado en overlay y popup

**Por qué:** Al abrir un `AlertDialog` de confirmación sobre un `Dialog` fullscreen (modal de gráfica), el overlay y el popup quedaban detrás del modal porque ambos usaban `z-50`, igual que el modal. Se subió a `z-[200]` para garantizar que siempre estén encima.

**En `AlertDialogOverlay`**, cambiar `z-50` por `z-[200]` en el className:

```tsx
// ANTES
"fixed inset-0 isolate z-50 bg-black/30 ..."

// DESPUÉS
"fixed inset-0 isolate z-[200] bg-black/30 ..."
```

**En `AlertDialogContent`**, cambiar `z-50` por `z-[200]` en el className del `AlertDialogPrimitive.Popup`:

```tsx
// ANTES
"... fixed top-1/2 left-1/2 z-50 grid ..."

// DESPUÉS
"... fixed top-1/2 left-1/2 z-[200] grid ..."
```

---

### 2. `forceRender` en el overlay cuando está anidado

**Por qué:** Base UI suprime automáticamente el backdrop cuando detecta que el dialog está anidado dentro de otro (`nested = true` en `DialogBackdrop.js`: `enabled: forceRender || !nested`). Como el `AlertDialog` se abre desde dentro del modal fullscreen, el overlay nunca se renderizaba. `forceRender` fuerza el renderizado independientemente del anidamiento.

**En `AlertDialogContent`**, agregar `forceRender` al `AlertDialogOverlay`:

```tsx
// ANTES
<AlertDialogOverlay />

// DESPUÉS
<AlertDialogOverlay forceRender />
```

---

## `src/components/ui/dialog.tsx`

### 1. Prop `overlayClassName` en `DialogContent`

**Por qué:** Para poder personalizar el z-index del overlay del `Dialog` en casos específicos (por ejemplo, si en el futuro se necesita un dialog encima de otro con z-index diferente).

**En `DialogContent`**, agregar la prop `overlayClassName` y pasarla al `DialogOverlay`:

```tsx
// ANTES
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      ...

// DESPUÉS
function DialogContent({
  className,
  children,
  showCloseButton = true,
  overlayClassName,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  overlayClassName?: string
}) {
  return (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />
      ...
```
