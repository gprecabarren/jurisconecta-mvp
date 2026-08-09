# JurisConecta MVP

Portal chileno para conectar personas con abogados.

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Publicacion

El sitio se publica desde GitHub en Cloudflare Pages. La exportacion estatica se genera con:

```bash
pnpm run build
```

La base de datos aislada del proyecto es `jurisconecta-db` en Cloudflare D1. Las tablas iniciales estan en `migrations/0001_initial_schema.sql`.

No hay integracion activa con Supabase, Vercel, R2 ni pagos en esta etapa.
