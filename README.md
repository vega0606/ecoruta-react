# EcoRuta (versión React)

Plataforma para registrar y consultar **puntos de reciclaje**: dirección, horario, materiales y categorías. Cada cuenta gestiona sus propios puntos.

## Identificación

| | |
|---|---|
| Proyecto | EcoRuta — Desarrollo Web, 2026-II, tercer corte |
| Integrantes | Juan Pablo, Diego Armando Vega Rey, Juan David Parra Martinez |
| URL de producción | _(pegar aquí la URL de Vercel, no una vista previa temporal)_ |
| Commit de entrega | _(pegar aquí el hash del commit final)_ |
| Repositorio del segundo corte (referencia de la migración) | https://github.com/JuanDParra-01/Desarrollo_Web |
| Bitácora principal | [docs/bitacora.md](docs/bitacora.md) |

## Ejecución

**Requisitos:** Node.js 22 o superior y una cuenta de Supabase con el proyecto del segundo corte.

```bash
npm install
cp .env.example .env.local   # y completa los valores públicos
npm run dev                  # abre la dirección Local que imprime Vite
```

`.env.local` (no se sube a Git) usa estos nombres:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto (Supabase > Connect) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave `sb_publishable_...` |
| `VITE_TABLA_PUNTOS` | `puntos_reciclaje` |

Nunca uses `service_role`, claves `secret` ni el secreto de Google: todo valor `VITE_` llega al navegador.

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve la compilación localmente |
| `npm test` | Pruebas unitarias (ejecutor integrado de Node.js) |

### Preparar Supabase (una sola vez)

1. En **SQL Editor** ejecuta `supabase/migracion_crud_por_usuario.sql`. Agrega `user_id` a `puntos_reciclaje`, quita la lectura pública anterior y crea políticas RLS para que cada cuenta vea y cambie solo sus filas.
2. En **Authentication → URL Configuration → Redirect URLs** agrega `http://localhost:5173/acceso` y la URL pública de producción con la ruta `/acceso`. Es distinto del callback de Supabase configurado en Google, que no cambia.

## Recorrido

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | Inicio | Pública |
| `/acceso` | Entrar con Google | Pública |
| `/puntos` | Panel: crear, consultar, editar, eliminar | Requiere sesión |
| `/puntos/:id` | Detalle por id real | Requiere sesión |
| cualquier otra | Página no encontrada | Pública |

- **Entidad y tabla:** punto de reciclaje, tabla `puntos_reciclaje` de Supabase.
- **Quién puede qué:** una cuenta autenticada lee, crea, edita y elimina solo las filas con su `user_id`. Sin sesión no hay acceso a la tabla (RLS). El guardián de rutas solo decide qué pantalla se muestra; la protección de los datos la hacen las políticas.
- **Búsqueda:** por nombre (`ilike`) y categoría (`contains`), aplicada en la API.
- **Repetir el flujo con datos ficticios:** abre `/puntos/1` sin sesión (te lleva a `/acceso`) → entra con una cuenta de prueba → registra un punto ficticio → ábrelo desde «Ver detalle» y recarga → edítalo → cierra sesión desde el detalle → entra con una segunda cuenta de prueba y comprueba que no ve el punto de la primera.
- **Acceso de prueba sin publicar credenciales:** se entra con Google; para la evaluación, comparte con el docente los correos de las cuentas de prueba por el canal acordado, no en este repositorio.

## Estructura

```
src/pages/       Inicio, Acceso, Detalle
src/components/  Marco (menú), RutaPrivada, PanelPuntos, FormularioPunto, TarjetaPunto (reutilizada), Filtros, Ubicacion, AvisoError
src/context/     AuthProvider y useAuth (sesión compartida)
src/hooks/       usePuntos (lectura con efecto), useMenuCompacto (localStorage)
src/services/    puntos (CRUD), validarPunto y idRegistro (reglas puras)
src/lib/         cliente único de Supabase
tests/           pruebas unitarias
supabase/        migración con RLS
docs/bitacora.md Documentación principal
```

## Complementos del tercer corte

- **CSS Modules:** `Marco.module.css`, `TarjetaPunto.module.css`.
- **Librería visual:** React Bootstrap (`Alert` en `AvisoError`, estilos de formularios y botones).
- **localStorage:** preferencia «Menú compacto» (`ecoruta:menu-compacto:v1`).
- **Localización:** geolocalización bajo demanda en el formulario («Usar mi ubicación»), con alternativa manual de latitud y longitud. No se guarda nada hasta que la persona registra el punto.
- **Pruebas unitarias:** reglas de validación del punto y del id (`npm test`).

## Despliegue

Vercel Hobby: importar el repositorio, preset Vite, comando `npm run build`, salida `dist`. Agregar `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` y `VITE_TABLA_PUNTOS` y volver a desplegar. `vercel.json` reenvía las rutas internas a `index.html` para que `BrowserRouter` funcione al recargar.
