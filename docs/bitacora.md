# Bitácora principal — EcoRuta (React)

> Documentación principal del proyecto. Completar los campos marcados con **[ ]** con los resultados reales de cada integrante antes de la sustentación.

## 1. Enlaces

- Repositorio React (entrega): _[pegar]_
- Commit final evaluado: _[pegar]_
- Aplicación publicada: _[pegar]_
- Repositorio del segundo corte (referencia): https://github.com/JuanDParra-01/Desarrollo_Web
- Prototipo de navegación (Stitch): https://stitch.withgoogle.com/projects/16908401492191944501

## 2. Qué migramos

| Segundo corte (HTML + JS) | Tercer corte (React) |
|---|---|
| `index.html` | Página `Inicio` (buscador, cómo funciona, materiales, destacados) |
| `puntos-reciclaje.html` + `puntos.js` (Leaflet, filtros, «Cerca de mí») | Página `PuntosReciclaje` con el componente `MapaPuntos` |
| `campanas.html` | Página `Campanas` con datos en `src/data/campanas.js` |
| `inscripcion-voluntariado.html` | Página `Voluntariado` con formulario controlado (el envío sigue siendo de prueba) |
| `registrar-punto.html` (no guardaba) | `/puntos`: `FormularioPunto` controlado con CRUD real; `/registrar-punto` redirige |
| `api.js` (`fetch` + validación de estructura) | `services/puntos.js` con el cliente de Supabase |
| `consultas.js` (filtros sobre arreglos) | `services/consultas.js` (mismas funciones, con pruebas) y filtros enviados a la API en «Mis puntos» |
| `ui.js` (`crearTarjeta`) | Componente reutilizable `TarjetaPunto` |
| `auth.js` (Google con Supabase Auth) | `AuthProvider` + Context (`useAuth`) |
| `diseño.css` | `src/index.css` (global), `Marco.module.css` y `TarjetaPunto.module.css` |
| `app.js` (menú activo) | `NavLink` con `aria-current` en `Marco` |
| `config.js` con URL y clave | `.env.local` / `.env.example` y variables en Vercel |

## 3. Decisiones técnicas

- **Entidad principal:** `puntos_reciclaje`. Se agregó `user_id` para que cada punto tenga dueño y exista un detalle privado por cuenta.
- **Lectura pública acotada:** en el segundo corte la tabla se leía como `anon` sin restricción. Con CRUD por cuenta y detalle privado, esa política permitiría ver filas ajenas, así que la migración la elimina y crea políticas por `user_id`. Luego `migracion_puntos_publicos.sql` abre solo la lectura de las filas sin dueño (los 4 puntos de ejemplo) para que el inicio y el mapa funcionen sin sesión.
- **Dos controles distintos:** React Router decide qué pantalla se muestra; RLS decide qué filas puede leer o modificar cada cuenta.
- **Sesión con Context:** un solo cliente de Supabase; el proveedor escucha `onAuthStateChange` y solo expone el usuario, no los tokens. Mientras la sesión es `undefined` no se muestra contenido privado.
- **Efecto solo para sincronizar con lo externo:** `usePuntos` (lectura con debounce de 300 ms y cancelación) y el listener de sesión. Guardar y eliminar viven en manejadores de eventos.
- **Hook propio reutilizable:** `useMenuCompacto` (localStorage) y `usePuntos`.
- **Componente reutilizado:** `TarjetaPunto` se usa en la lista y en el detalle; recibe datos por props y las acciones por `children`.
- **Localización:** geolocalización bajo demanda con alternativa manual. _[Confirmar con el docente que cubre el requisito.]_
- **Despliegue:** Vercel + rewrites a `index.html` por usar `BrowserRouter`.

## 4. Aportes por integrante

| Integrante | Aportes |
|---|---|
| Juan Pablo | [ ] |
| Diego Armando Vega Rey | [ ] |
| Juan David Parra Martinez | [ ] |

## 5. Pruebas y evidencias

Registrar aquí resultado real y enlace a la captura (sin tokens ni correos reales).

| Prueba | Resultado | Evidencia |
|---|---|---|
| `npm run build` compila | [ ] | |
| `npm test` (13 pruebas) | [ ] | |
| Mapa: marcadores, filtro por categoría y `?id=` desde el inicio | [ ] | |
| `/puntos` sin sesión redirige a `/acceso` | [ ] | |
| Crear, consultar, editar y eliminar un punto ficticio | [ ] | |
| Los cambios siguen tras recargar | [ ] | |
| Recargar `/puntos/:id` en producción | [ ] | |
| Cuenta B no ve el punto de la cuenta A | [ ] | |
| Búsqueda sin resultados y error con «Reintentar» | [ ] | |
| Interfaz en móvil y escritorio | [ ] | |

## 6. Problemas resueltos

_[Anotar aquí los fallos reales que aparecieron y cómo se corrigieron: redirección de OAuth, políticas RLS, variables en Vercel, etc.]_

## 7. Pendiente

- [ ] Ejecutar las dos migraciones SQL en Supabase (`migracion_crud_por_usuario.sql` y luego `migracion_puntos_publicos.sql`).
- [ ] Autorizar las URL de redirección (local y producción) con la ruta `/acceso`.
- [ ] Publicar en Vercel y pegar la URL en el README.
- [ ] Dar acceso al docente si el repositorio es privado.
- [ ] El formulario de voluntariado valida pero no guarda (igual que en el segundo corte); no hay tabla de inscripciones.
- [ ] Los botones «Ver más» e «Inscribirse» de campañas solo muestran un aviso.
- [ ] El `npm run build` avisa que el paquete supera 500 kB (por Leaflet y Bootstrap); no afecta el funcionamiento.
