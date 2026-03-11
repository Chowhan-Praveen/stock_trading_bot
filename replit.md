# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── trading-bot/        # AI Trading Bot Dashboard (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## AI Trading Bot Dashboard

A full-featured AI-powered real-time stock trading bot monitoring dashboard with:

### Features
- **Dashboard**: Portfolio overview (value, day P&L, total P&L), 7-day equity curve chart, live system alerts
- **Live Trading**: Real-time trade feed with buy/sell/hold actions, confidence scores, watchlist with ML predictions
- **AI Strategies**: Manage 6 ML/RL strategies (DQN, PPO, LSTM, Transformer, Gradient Boost, Hybrid)
- **Risk Management**: Dynamic stop-loss, position sizing, portfolio diversification toggles with sliders
- **Market Intelligence**: Market regime detection (bull/bear/sideways/volatile), order book, news sentiment
- **Analytics**: Sharpe ratio, Sortino ratio, max drawdown, win/loss ratio, profit factor, backtest equity curve
- **System Logs**: Real-time bot activity logs with level color-coding
- **Safety Controls**: Start/Stop bot, Emergency Kill Switch, bot health status indicators

### Architecture
- **Frontend**: React + Vite + Tailwind CSS (dark terminal theme), Recharts for charts, Lucide icons
- **Backend**: Express 5 with full REST API (all endpoints simulate real trading bot data)
- **API Contract**: OpenAPI 3.1 spec, codegen via Orval (React Query hooks + Zod schemas)
- **Real-time**: Auto-refresh every 3 seconds for live-feel data updates

### API Endpoints
- `GET /api/portfolio` - Portfolio overview with positions
- `GET /api/portfolio/history?period=7d` - Portfolio value history
- `GET /api/trades` - Recent trades with ML strategy info
- `GET /api/strategies` - ML/RL strategy list
- `POST /api/strategies/{id}/activate|deactivate` - Strategy control
- `GET /api/risk` / `PUT /api/risk` - Risk settings CRUD
- `GET /api/market/regime` - Market regime detection
- `GET /api/market/watchlist` - Watchlist with ML predictions
- `GET /api/market/orderbook/{symbol}` - Order book data
- `GET /api/bot/status` - Bot operational status
- `POST /api/bot/start|stop|kill-switch` - Bot control
- `GET /api/bot/logs` - Activity logs
- `GET /api/sentiment` - News sentiment analysis
- `GET /api/performance` - Performance metrics (Sharpe, Sortino, etc.)
- `GET /api/performance/backtest` - Backtesting results

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; all trading bot API routes
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)

### `artifacts/trading-bot` (`@workspace/trading-bot`)

React + Vite trading bot monitoring dashboard.

- Dark terminal aesthetic, green/red for profits/losses
- Auto-refreshing every 3 seconds
- 7 pages: Dashboard, Live Trading, AI Strategies, Risk Management, Market Intel, Analytics, System Logs

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages.

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`.
