# 🚚 Export Shipping Dashboard — Reflectiv

Dashboard interno para que el equipo de export gestione el envío diario de pedidos: subir PDFs, asignar a quien lo prepara, marcar estado, ver estadísticas.

---

## ⚡ ESTADO ACTUAL

### ✅ Lo que ya funciona
- **HTML dashboard** listo (`index.html`) — diseño, vistas, gráficos, autenticación PIN
- **Apps Script** escrito (`apps-script.gs`) — endpoints `?action=list`, `upload`, `save`
- **PIN auth** `220202`, válido 8 horas, guardado en localStorage
- **Hasta 4 PDFs por orden** con drag-and-drop
- **Todos los campos opcionales** (ref, client, tracking pueden ir vacíos)
- **Multi-vista:** Active / All orders / Analytics
- **Filtros de fecha:** Today / 7 days / 30 days / 90 days / All time
- **Charts:** timeline, status donut, carrier bar, assignee bar
- **Auto-sync** cada 30 segundos
- **5 usuarios:** Diana (DI), Daniel (DA), Martina (MA), Carla (CA), Other (OT)
- **3 estados:** Pending 🖨️ / Delivered ✅ / Issue ⚠️

### ❌ Lo que NO funciona / pendiente

> **El problema reportado:** "Error: Failed to fetch" al guardar. Nada se guarda en sheet, drive, ni dashboard.

**Causa raíz identificada:**
- Apps Script NO soporta requests CORS preflight (OPTIONS)
- Cuando el navegador manda POST con `Content-Type: application/json`, dispara preflight → falla
- **Solución aplicada en el código:** mandar POST como `Content-Type: text/plain;charset=utf-8` (evita preflight)
- Apps Script parsea JSON server-side desde `e.postData.contents`

**PENDIENTE confirmar que funcione:**
1. ⚠️ Usuario debe redeployar Apps Script con el código nuevo (`apps-script.gs`)
2. ⚠️ Copiar la NUEVA URL del deployment
3. ⚠️ Pegarla en `index.html` línea ~485: `const SCRIPT_URL = '...'`
4. ⚠️ Probar guardar una orden y ver si aparece en Sheet + Drive

---

## 🔧 INFRAESTRUCTURA

### Google
- **Sheet ID:** `1Drlne7fFWV2HAIhtbHXZb3xn2IlgBdX_KvW6b1xmsxA`
- **Sheet tab:** `Daily`
- **Drive folder:** `1FO_oW2dDCt3PmALIg2RBvX6OhPqPQyHQ`
- **Cuenta:** `common@reflectiv.com` (Google Workspace dominio reflectiv.com)
- **Apps Script URL actual (puede estar desactualizada):**
  `https://script.google.com/a/macros/reflectiv.com/s/AKfycbzsxon5Ek1yYUS8n8Z51gCxzQfumrDCN7pN75i4kDnSQUkxkdUDNjdIOlZXkbRK-iying/exec`

### Schema Sheet "Daily" (13 columnas)
| Col | Field |
|-----|-------|
| A | ID (unique) |
| B | Ref |
| C | Client |
| D | Carrier (UPS/Dascher/Lyseo/Hecny/Other) |
| E | Tracking |
| F | Status (pending/delivered/issue) |
| G | Notes |
| H | Assigned (DI/DA/MA/CA/OT) |
| I | CreatedAt (ISO date) |
| J | Invoice (TRUE/FALSE) |
| K | BL (TRUE/FALSE) |
| L | Label (TRUE/FALSE) |
| M | PDF_URLs (pipe-separated `\|`) |

### Hosting
**Plan:** GitHub Pages
- Crear repo `export` (público, gratis)
- Subir `index.html`
- Settings → Pages → Deploy from main → /(root)
- URL queda: `https://<usuario>.github.io/export/`
- Compartir con equipo (entran con PIN `220202`)

**Probado y descartado:**
- ❌ Drive preview — muestra source code, no ejecuta JS
- ❌ Google Sites — CORS bug, muestra editor preview al compartir

---

## 👤 USUARIO

**Diana Revelo** — ADV Export, HQ
- Sola con acceso a impresora + bodega (warehouse)
- Comunica primarily en español informal
- Workflow físico actual: imprime factura + BL + label UPS → carpeta → entrega a bodega
- CRM actual: Reflectiv CRM genera facturas/BL/devis por email como PDFs
- Labels UPS las hace manualmente en ups.com

**Equipo (todos sin Claude account):**
- Diana (DI), Daniel (DA), Martina (MA), Carla (CA)

---

## 🎯 OBJETIVO DEL DASHBOARD

Centralizar el workflow post-documento:
1. Llegan PDFs por email del CRM
2. Diana (u otro) crea orden en dashboard, sube PDFs a Drive
3. Asigna estado (pending → delivered) y persona responsable
4. Marca checkboxes: Invoice ✓, BL ✓, Label ✓
5. Bodega ve la orden lista → imprime → empaqueta → entrega
6. Stats / analytics para reporting

---

## 🔐 SEGURIDAD

- **PIN 6 dígitos:** `220202`
- **Sesión:** 8 horas en localStorage del navegador
- **Botón "Lock dashboard"** para cerrar sesión manualmente
- **Cambiar PIN:** editar `const ACCESS_PIN = '220202'` en `index.html`
- **Cambiar duración:** editar `const PIN_VALID_HOURS = 8`

---

## 📋 PRÓXIMOS PASOS

1. **Redeployar Apps Script:**
   - Sheet → Extensiones → Apps Script
   - Borrar todo el código viejo
   - Pegar `apps-script.gs` completo
   - Save → Deploy → New deployment
   - Type: Web app
   - Execute as: `common@reflectiv.com`
   - Who has access: `Anyone` (no `Anyone with Google account`)
   - Deploy → Copiar URL

2. **Actualizar `index.html`:**
   - Buscar línea: `const SCRIPT_URL = '...'`
   - Reemplazar con la URL nueva

3. **Probar local primero:**
   - Abrir `index.html` doble click
   - PIN: `220202`
   - Crear orden de prueba con un PDF
   - Verificar:
     - ✅ Aparece en dashboard
     - ✅ Aparece en Sheet "Daily"
     - ✅ PDF aparece en Drive folder

4. **Si funciona local → subir a GitHub:**
   - github.com → New repo `export` (public)
   - Upload files → arrastrar `index.html`
   - Settings → Pages → main branch → root → Save
   - Esperar 1-2 min
   - URL pública: `https://<usuario>.github.io/export/`

---

## 🐛 SI SIGUE FALLANDO

Posibles causas:
- **403 Forbidden** → Apps Script deployment está como "Anyone with Google account" en vez de "Anyone"
- **CORS error en consola** → la URL del SCRIPT_URL no se actualizó después de redeploy
- **404 Not Found** → Apps Script no está deployado
- **"Sheet not found"** → la pestaña no se llama exactamente `Daily`
- **Upload falla pero save funciona** → permisos del folder Drive, verificar que Apps Script tenga acceso

Abrir DevTools (F12) → Console → Ver el error exacto antes de seguir.

---

## 📁 ARCHIVOS

- `index.html` — Dashboard completo (subir a GitHub Pages)
- `apps-script.gs` — Backend code (pegar en Apps Script del Sheet)
- `README.md` — Este archivo

---

## 💬 LENGUAJE

- **UI:** inglés
- **Conversación con Diana:** español informal preferido
