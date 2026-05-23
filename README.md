# Personal Hub

Aplicacion movil Android hecha con Expo, React Native y TypeScript para unificar productividad, finanzas y salud.

## Estado actual

- Home principal para navegar entre Productividad, Finanzas, Salud, Widgets y Backup.
- Productividad: calendario CRUD local, Google Calendar sync via backend, snapshot canonico de foco/eventos y foco estilo Pomodoro.
- Finanzas: presupuesto mensual, gastos diarios, capacidad de ahorro, wishlist multimoneda y consejero educativo de inversiones.
- Salud: motor metabolico, nutricion diaria, agua, rutinas por dia, GIFs de tecnica, logs de series, descanso automatico y progresion.
- Widgets: snapshots para proximo evento, calorias restantes, resumen financiero, acceso rapido de gasto y providers nativos Android con deep links.
- Backup: exportacion/restauracion JSON de datos locales de AsyncStorage.
- Backend Spring Boot en `backend/` con Flyway, H2 dev, Google Calendar OAuth, usuario por instalacion y endpoints de sync.

## Instalacion movil

```bash
npm install
```

## Ejecutar app

```bash
npm run start
```

La app usa por defecto `http://10.0.2.2:8080` para llegar al backend desde un emulador Android. Esa URL se puede cambiar desde la pantalla de sincronizacion de Calendar.

## Validacion movil

```bash
npm run typecheck
```

Para validar el bundle Android con Metro activo:

```bash
curl "http://127.0.0.1:8081/node_modules/expo/AppEntry.bundle?platform=android&dev=true&hot=false&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&unstable_transformProfile=hermes-stable"
```

## Backend

El backend esta en `backend/`.

Endpoints principales:

- `GET /api/health`
- `POST /api/productivity/sync`
- `POST /api/finance/sync`
- `POST /api/finance/advisor/analyze`
- `POST /api/health-tracker/sync`
- `GET /api/auth/google/start`
- `GET /api/auth/google/callback`
- `GET /api/auth/google/status`
- `GET /api/calendar/google/import`

Para ejecutarlo se necesita Maven:

```bash
cd backend
mvn spring-boot:run
```

## Proximos pasos

1. Instalar Maven y compilar backend.
2. Probar sync end-to-end con H2 y luego Postgres.
3. Probar OAuth real de Google Calendar.
4. Endurecer auth multiusuario real sobre el header de usuario por instalacion.
5. Conectar el consejero financiero a AI y datos de mercado.
6. Ejecutar `expo prebuild` y validar widgets nativos en Android.

## Deep links

La app registra el esquema `personalhub://`. Los widgets nativos abren rutas como `personalhub://productivity`, `personalhub://health` y `personalhub://widgets`.
