# Next.js + MongoDB + TraceMole Example

A sample NYC restaurant directory built with **Next.js** and **MongoDB**, wired for [TraceMole](https://www.tracemole.com/) query profiling. The app looks like a normal CRUD demo on the surface, but several API routes run **intentionally inefficient MongoDB queries** (collection scans, N+1 patterns) so you can compare them in the TraceMole dashboard after enabling tracing.

## What you get

- Restaurant list, search/browse, and add-restaurant flows
- Sample data seeding (~160 NYC restaurants into `restaurants_demo.restaurants`)
- OpenTelemetry tracing with MongoDB driver instrumentation
- MongoDB explain stats attached to spans via [`@tracemole/nextjs-mongodb-explain`](https://www.npmjs.com/package/@tracemole/nextjs-mongodb-explain)

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| [Node.js](https://nodejs.org/) | LTS or current release |
| MongoDB | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier works |
| TraceMole account | [Sign up](https://www.tracemole.com/) for an API key and OTLP ingest URL |

## Quick start

### 1. Clone and install

```bash
git clone <this-repo>
cd nextjs-tracemole-example
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
TRACE_MOLE_API_KEY=<your-trace-mole-api-key>
TRACEMOLE_OTLP_TRACES_ENDPOINT=<your-trace-mole-otlp-endpoint>
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string from Atlas (or self-hosted) |
| `TRACE_MOLE_API_KEY` | Yes | API key from your TraceMole project |
| `TRACEMOLE_OTLP_TRACES_ENDPOINT` | Yes | OTLP traces URL from TraceMole (e.g. `https://…/v1/traces`) |
| `OTEL_SERVICE_NAME` | No | Service name in traces (defaults to `my-next-app`) |

These values are **yours** — the app does not ship defaults for the TraceMole endpoint or API key. Restart the dev server after changing env vars.

Optional: disable explain queries in production:

```env
TRACE_MOLE_MONGO_EXPLAIN=0
```

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Load sample data

1. Go to **Setup** (`/data`)
2. Click **Load sample data**

This inserts 160 restaurant documents into `restaurants_demo.restaurants`. No Atlas sample dataset is required.

### 5. Generate traces

Use the app normally — each action hits API routes that query MongoDB:

| Action | Route | Query behavior (intentional) |
|--------|-------|------------------------------|
| Home page | `GET /api/restaurants` | Sort on unindexed field + N+1 cuisine lookups |
| Dashboard stats | `GET /api/stats` | Full collection scan + per-borough count loop |
| Browse / search | `GET /api/browse` | Loads entire collection, filters in Node |
| Add restaurant | `POST /api/restaurants` | Regex collection scans after insert |

Then open the [TraceMole dashboard](https://www.tracemole.com/) to inspect query explain plans, scan types, and slow operations.

## How tracing is wired

### OpenTelemetry (`src/instrumentation.ts`)

On server startup, Next.js loads `instrumentation.ts`, which:

1. Starts the OpenTelemetry Node SDK
2. Exports traces to your `TRACEMOLE_OTLP_TRACES_ENDPOINT` with `x-api-key` header
3. Instruments MongoDB operations via `@opentelemetry/instrumentation-mongodb`

Tracing only works when `TRACEMOLE_OTLP_TRACES_ENDPOINT` is set. If it is missing, the SDK falls back to `http://localhost:4318/v1/traces` (useful only if you run a local OTLP collector).

### MongoDB explain listener (`src/lib/mongodb.ts`)

The shared MongoDB client registers TraceMole’s command listener:

```ts
registerTraceMoleListener(client, { slowThreshold: 50 });
```

Queries slower than 50ms get an explain plan attached to the active span as `db.mongodb.explain.*` attributes.

## Project structure

```
src/
├── app/
│   ├── page.tsx              # All restaurants + add form
│   ├── browse/page.tsx       # Search by borough, name, cuisine
│   ├── data/page.tsx         # Seed / clear sample data
│   └── api/
│       ├── restaurants/      # List + create
│       ├── browse/           # Filtered search
│       ├── stats/            # Dashboard counts
│       └── seed/             # Load / clear sample data
├── components/               # UI (tables, forms, shell)
├── instrumentation.ts        # OpenTelemetry + TraceMole export
└── lib/
    ├── mongodb.ts            # MongoDB client + explain listener
    ├── queries.ts            # Intentionally bad query patterns
    ├── seed-data.ts          # Base restaurant documents
    └── seed-build.ts         # Expands seed to 160 docs
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
```

## Troubleshooting

**`Invalid/Missing environment variable: "MONGODB_URI"`**  
Add `MONGODB_URI` to `.env.local` and restart the dev server.

**No traces in TraceMole**  
- Confirm `TRACE_MOLE_API_KEY` and `TRACEMOLE_OTLP_TRACES_ENDPOINT` are set in `.env.local`
- Restart `npm run dev` after editing env vars
- Use the app (browse, add a restaurant) to generate traffic
- Check Atlas network access allows your IP

**Empty restaurant list**  
Go to **Setup** and load sample data, or add a restaurant from the home page.

**MongoDB connection test fails**  
Verify the URI, database user password, and Atlas IP allowlist.

## Related links

- [TraceMole](https://www.tracemole.com/)
- [@tracemole/nextjs-mongodb-explain on npm](https://www.npmjs.com/package/@tracemole/nextjs-mongodb-explain)
- [Next.js instrumentation docs](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [MongoDB Node.js driver](https://www.mongodb.com/docs/drivers/node/current/)
