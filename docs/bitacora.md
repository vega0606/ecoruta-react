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
| `index.html`, `puntos-reciclaje.html`, `registrar-punto.html`, `inscripcion-voluntariado.html`, `campanas.html` | Rutas `/`, `/acceso`, `/puntos`, `/puntos/:id` y página no encontrada |
| `api.js` (`fetch` + validación de estructura) | `services/puntos.js` con el cliente de Supabase |
| `consultas.js` (filtros sobre arreglos) | Filtros enviados a la API (`ilike`, `contains`) |
| `ui.js` (`crearTarjeta`) | Componente reutilizable `TarjetaPunto` |
| `auth.js` (Google con Supabase Auth) | `AuthProvider` + Context (`useAuth`) |
| Formularios que validaban pero no guardaban | `FormularioPunto` controlado con CRUD real |
| `config.js` con URL y clave | `.env.local` / `.env.example` y variables en Vercel |

## 3. Decisiones técnicas

- **Entidad principal:** `puntos_reciclaje`. Se agregó `user_id` para que cada punto tenga dueño y exista un detalle privado por cuenta.
- **Lectura pública retirada:** en el segundo corte la tabla se leía como `anon`. Con CRUD por cuenta y detalle privado, esa política permitiría ver filas ajenas, así que la migración la elimina y deja solo políticas por `user_id`.
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
| `npm test` (6 pruebas) | [ ] | |
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

- [ ] Ejecutar la migración SQL en Supabase.
- [ ] Autorizar las URL de redirección (local y producción) con la ruta `/acceso`.
- [ ] Publicar en Vercel y pegar la URL en el README.
- [ ] Dar acceso al docente si el repositorio es privado.
- [ ] Páginas del segundo corte aún sin migrar: campañas y voluntariado (fuera del CRUD principal).
