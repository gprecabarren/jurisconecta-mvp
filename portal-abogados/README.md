# JurisConecta

Portal chileno para conectar personas que necesitan orientación legal con abogados verificados. El sitio oficial es [jurisconecta.cl](https://jurisconecta.cl).

## Estado actual (9 de septiembre de 2026)

La aplicación es un frontend Next.js exportado como sitio estático y servido por el Worker `jurisconecta-mvp`. El mismo Worker atiende las rutas dinámicas que antes estaban preparadas como Cloudflare Pages Functions en `functions/`.

Infraestructura exclusiva de JurisConecta:

- Zona y dominios: `jurisconecta.cl` y `www.jurisconecta.cl`; `www` redirige al dominio principal.
- Worker: `jurisconecta-mvp`, con Static Assets y enrutamiento de API.
- D1: `jurisconecta-db` mediante el binding `DB`.
- R2: `jurisconecta-private-documents` mediante `LAWYER_DOCUMENTS`, únicamente para antecedentes privados de postulaciones profesionales.
- Repositorio: `gprecabarren/jurisconecta` (antes `gprecabarren/jurisconecta-mvp`).

No se debe usar, modificar ni desplegar ningún recurso de `chile3x.cl` desde este proyecto.

El proyecto heredado `jurisconecta-mvp.pages.dev` aún existe en Cloudflare Pages y conserva secretos cifrados que Cloudflare no permite recuperar. No sirve el dominio oficial y no fue modificado ni eliminado; conviene retirarlo solo después de terminar la migración del OAuth administrativo y confirmar que no queda ninguna dependencia.

### Control de costos

El Worker y D1 están configurados para el plan Free. La carga de documentos a R2 queda **desactivada por defecto** con `LAWYER_APPLICATION_UPLOADS_ENABLED=false`, porque R2 dispone de una franquicia gratuita pero puede generar cobros al superarla. No cambiar esta variable a `true` sin definir primero límites operativos, retención de archivos y alertas de consumo. No se activaron planes, integraciones ni complementos pagados durante esta configuración.

Ningún repositorio puede garantizar por sí solo que una cuenta de Cloudflare no genere cobros por uso o por productos previamente activados. Antes de aceptar postulaciones reales, revisar el consumo y las condiciones oficiales de [Workers](https://developers.cloudflare.com/workers/platform/pricing/), [D1](https://developers.cloudflare.com/d1/platform/pricing/) y [R2](https://developers.cloudflare.com/r2/pricing/). Las pruebas automatizadas no deben subir archivos a R2.

## Módulos existentes

- Registro e inicio de sesión por correo para personas y abogados.
- Sesión segura mediante cookie HTTP-only firmada.
- Área de cliente: datos personales, publicación, listado y cierre de casos.
- Área profesional: perfil, postulación, carga de documentos, planes, saldo de créditos, casos preferentes, pool y desbloqueo de contacto.
- Administración: OAuth con GitHub, revisión de postulaciones y documentos, aprobación de abogados, asignación de créditos, edición del costo de casos y contenido público.
- Contenido público: portada, equipo, ayuda, catálogo legal y búsqueda informativa.
- Protección en el Worker de las páginas privadas según rol.

## Rutas del Worker

| Ruta | Métodos | Uso |
| --- | --- | --- |
| `/api/health` | `GET`, `HEAD` | Estado del servicio |
| `/api/content` | `GET` | Equipo y centro de ayuda públicos |
| `/api/auth/register` | `POST` | Registro de persona o abogado |
| `/api/auth/login` | `POST` | Inicio de sesión |
| `/api/auth/logout` | `POST` | Cierre de sesión |
| `/api/auth/me` | `GET` | Usuario autenticado |
| `/api/auth/profile` | `PATCH` | Perfil básico del cliente |
| `/api/cases` | `GET`, `POST`, `PATCH` | Casos del cliente |
| `/api/lawyer/profile` | `GET`, `PATCH` | Perfil profesional |
| `/api/lawyer/application` | `POST` | Postulación y documentos |
| `/api/lawyer/plans` | `GET` | Planes y créditos |
| `/api/lawyer/cases` | `GET`, `POST` | Pool, preferentes y acceso a contacto |
| `/api/admin/content` | `GET`, `PUT` | Contenido administrable |
| `/api/admin/profiles` | `GET` | Profesionales registrados |
| `/api/admin/applications` | `GET`, `PATCH` | Revisión de postulaciones |
| `/api/admin/application-document/:id` | `GET` | Lectura privada de documentos |
| `/api/admin/cases` | `GET`, `PATCH` | Casos y costo en créditos |
| `/auth/github/login` | `GET` | Inicio OAuth de administración |
| `/auth/github/callback` | `GET` | Retorno OAuth de administración |

Las rutas privadas de páginas (`/cliente`, `/publicar-caso`, `/dashboard`, `/account`, `/casos`, `/planes`, `/postulacion-abogado`, `/evaluaciones` y `/admin`) también pasan primero por el Worker.

## Desarrollo y verificación

Requisitos: Node.js, pnpm y una sesión de Wrangler conectada a la cuenta correcta de Cloudflare.

```bash
pnpm install
pnpm dev
```

Antes de cada despliegue:

```bash
pnpm check
npx wrangler types worker-configuration.d.ts --env-interface CloudflareEnv --check
npx wrangler deploy --dry-run
```

Despliegue manual al Worker configurado:

```bash
pnpm run deploy:cloudflare
```

## Variables secretas

Nunca guardar valores reales en Git. El Worker requiere:

- `USER_AUTH_SECRET`: firma las sesiones de personas y abogados.
- `AUTH_SESSION_SECRET`: firma la sesión de administración.
- `GITHUB_CLIENT_SECRET`: secreto de la aplicación OAuth de GitHub.
- Opcionales: `GITHUB_CLIENT_ID` y `ADMIN_GITHUB_LOGIN`; hoy existen valores predeterminados para la aplicación y el administrador actuales.

Se administran con `wrangler secret put NOMBRE`. El callback autorizado de la aplicación OAuth debe incluir `https://jurisconecta.cl/auth/github/callback`.

`USER_AUTH_SECRET` y `AUTH_SESSION_SECRET` ya están configurados en el Worker. Falta agregar `GITHUB_CLIENT_SECRET`; hasta entonces `/auth/github/login` responde `503` y el panel administrativo no permite iniciar sesión.

## Ruta de prueba manual

1. Abrir `/api/health` y comprobar `status: ok`.
2. Abrir `/api/content` y comprobar las colecciones `team` y `help`.
3. Ir a `/registro`, crear una persona y confirmar que redirige a `/cliente`.
4. Desde `/publicar-caso`, crear un caso; comprobarlo en `/cliente` y luego cerrarlo.
5. Cerrar sesión en `/ingresar`, registrar un abogado y confirmar la redirección a `/postulacion-abogado`.
6. Probar la edición del perfil profesional. No subir documentos de prueba mientras no se confirme el control de consumo de R2.
7. Configurar OAuth, entrar por `/admin` y revisar contenido, perfiles, postulaciones y costos de casos.
8. Tras aprobar un abogado, comprobar `/casos/preferentes`, `/casos/pool`, el descuento de créditos y `/casos/accedidos` con datos que no sean reales.
9. Repetir en móvil y escritorio, revisando navegación por teclado, mensajes de error y cierre de sesión.

### Verificación realizada

El 9 de septiembre de 2026 se completaron:

- TypeScript, ESLint, exportación estática de 21 páginas, tipos generados por Wrangler y empaquetado de despliegue, sin errores.
- Pruebas HTTP locales de respuestas `200`, `401`, `404`, `405` y redirecciones de páginas privadas.
- Pruebas en `https://jurisconecta.cl` del dominio principal, redirección `www`, contenido público y controles de acceso.
- Flujo real de persona: registro, sesión, perfil, crear/listar/cerrar caso y limpieza posterior de todos los datos de prueba.
- Flujo real de abogado: registro, perfil en estado `draft`, tres planes disponibles y limpieza posterior de todos los datos de prueba.
- No se subieron archivos a R2 ni se probaron pagos.

## Trabajo pendiente y cronograma estimado

Estimación para una sola persona desarrollando y revisando. Puede cambiar al definir textos legales, proveedor de correo y pagos.

| Prioridad | Trabajo | Estimación |
| --- | --- | --- |
| Alta | Completar y probar OAuth de administración en el dominio oficial; confirmar secretos, callback y recuperación ante errores | 0,5-1 día |
| Alta | Pruebas end-to-end de registro, sesiones, roles, casos, aprobación y créditos; retirar o anonimizar cuentas/datos de demostración | 1-2 días |
| Alta | Endurecimiento previo a usuarios reales: rate limiting/Turnstile, política de documentos, validaciones de archivos, auditoría de permisos y recuperación de contraseña | 2-4 días |
| Media | Conectar realmente `/account`: edición profesional, cambio de contraseña y preferencias; hoy parte de esa pantalla solo guarda estado visual | 1-2 días |
| Media | Implementar propuestas/aceptación, coincidencias y notificaciones; la tabla `case_proposals` existe, pero todavía no tiene flujo de interfaz/API | 3-5 días |
| Media | Completar evaluaciones, soporte operativo, correos transaccionales y páginas legales (privacidad, términos y tratamiento de datos) | 3-5 días |
| Baja / comercial | Integrar Webpay u otro pago, renovaciones y conciliación. No activar hasta que se autoricen costos y condiciones comerciales | 4-7 días |
| Final | QA de accesibilidad, rendimiento, compatibilidad, respaldo/restore de D1 y checklist de lanzamiento | 2-3 días |

Con el alcance actual sin pagos —registro, casos, postulación y aprobación manual— faltan aproximadamente **3 a 5 días hábiles** para un piloto controlado. Para una versión comercial con propuestas, correos, evaluaciones, seguridad reforzada y pagos, la referencia es **3 a 5 semanas**.

## Migraciones

Las migraciones D1 están en `migrations/0001_initial_schema.sql` a `migrations/0006_case_views_and_catalog.sql`. No volver a ejecutar migraciones que contienen `ALTER TABLE` sin comprobar antes el estado de la base remota.
