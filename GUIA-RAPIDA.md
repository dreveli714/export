# 🚀 GUÍA RÁPIDA — Diana

## ⚠️ HACER EN ORDEN (importante)

---

## PASO 1 — Actualizar Apps Script (5 min)

1. Abre tu Google Sheet "Daily"
2. Arriba: **Extensiones** → **Apps Script**
3. **BORRA TODO** el código que esté ahí
4. Abre el archivo `apps-script.gs` (este folder)
5. **Copia TODO** y pégalo en Apps Script
6. Click **💾 Guardar** (Ctrl+S)
7. Arriba derecha: **Implementar** → **Nueva implementación**
8. Click el ⚙️ → **Aplicación web**
9. Configurar:
   - **Descripción:** "Export v3"
   - **Ejecutar como:** Yo (common@reflectiv.com)
   - **Quién tiene acceso:** **Cualquier usuario** ⚠️ MUY IMPORTANTE
10. Click **Implementar**
11. **COPIA la URL** que aparece (termina en `/exec`)

---

## PASO 2 — Actualizar el HTML (1 min)

1. Abre `index.html` con cualquier editor (Bloc de notas sirve)
2. Busca esta línea (cerca de la línea 485):
   ```
   const SCRIPT_URL = 'https://script.google.com/a/macros/reflectiv.com/s/...';
   ```
3. Reemplaza por la URL nueva que copiaste en el Paso 1
4. Guarda el archivo

---

## PASO 3 — Probar LOCAL antes de subir (2 min)

1. Doble click en `index.html`
2. Se abre en tu navegador
3. Ingresa PIN: `220202`
4. Click **"+ New order"**
5. Arrastra un PDF de prueba
6. Pon cualquier referencia o déjala vacía
7. Click **Save order**

**¿Apareció en el dashboard?** ✅ Bien
**¿Aparece en el Sheet "Daily"?** Abre el Sheet → debe estar la fila
**¿El PDF está en el Drive folder?** Abre Drive → folder `1FO_oW2dDCt3PmALIg2RBvX6OhPqPQyHQ`

Si los 3 están ✅ → al Paso 4.
Si falla → abre F12 en el navegador → pestaña Console → mándame el error.

---

## PASO 4 — Subir a GitHub (10 min)

### Si NO tienes cuenta GitHub:
1. Ve a github.com → **Sign up**
2. Usa tu email
3. Verifica el email

### Crear el repo:
1. github.com → arriba derecha **+** → **New repository**
2. **Repository name:** `export`
3. ✅ **Public** (es obligatorio gratis)
4. ✅ Add a README file
5. Click **Create repository**

### Subir el archivo:
1. Dentro del repo: **Add file** → **Upload files**
2. Arrastra **solo** `index.html` (NO el .gs, NO el README)
3. Abajo: **Commit changes**

### Activar GitHub Pages:
1. Click pestaña **Settings** (arriba derecha del repo)
2. Menú izquierdo: **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** main / (root)
5. Click **Save**
6. **Espera 2 minutos** ⏰
7. Refresca la página de Settings → Pages
8. Te mostrará: **Your site is live at https://tu-usuario.github.io/export/**

### Compartir:
Ese link `https://tu-usuario.github.io/export/` es **lo que mandas a Daniel, Martina, Carla**.

Cada uno:
- Abre el link
- Mete PIN: `220202`
- Está dentro 8 horas

---

## 🆘 PROBLEMAS COMUNES

**"Failed to fetch" al guardar:**
- No actualizaste la SCRIPT_URL en el HTML después de redeploy
- O no pusiste "Cualquier usuario" en el deployment

**Sale página de login de Google:**
- En el deployment de Apps Script pusiste "Anyone with Google account"
- Hay que ponerlo en "Anyone" (Cualquier usuario)

**El sheet no se actualiza:**
- La pestaña del Sheet no se llama exactamente `Daily`
- Renómbrala a `Daily` (con mayúscula D)

**El PDF no sube al Drive:**
- El folder no es accesible por la cuenta del script
- Verifica que el folder `1FO_oW2dDCt3PmALIg2RBvX6OhPqPQyHQ` existe y es de common@reflectiv.com

---

## 🔑 DATOS IMPORTANTES

- **PIN:** `220202`
- **Sesión dura:** 8 horas
- **Cambiar PIN:** editar `const ACCESS_PIN = '220202'` en index.html
- **5 personas en el equipo:** Diana (DI), Daniel (DA), Martina (MA), Carla (CA), Other (OT)
- **Sheet:** https://docs.google.com/spreadsheets/d/1Drlne7fFWV2HAIhtbHXZb3xn2IlgBdX_KvW6b1xmsxA
- **Drive:** https://drive.google.com/drive/folders/1FO_oW2dDCt3PmALIg2RBvX6OhPqPQyHQ
