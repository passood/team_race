# Team Race - Claude Code Project Guide

## Quick Project Info

**Project**: Stock Sector Chart Race Visualization
**Timeline**: 8-week development roadmap (simplified from 11 weeks)
**Stack**: React 18 + Vite + D3.js + GitHub Actions
**Architecture**: Serverless - Static frontend + GitHub Actions for data fetching
**Data Source**: Yahoo Finance API (via GitHub Actions daily cron job)

## Quick Start Commands

### Development
```bash
# Install all dependencies
npm install

# Start frontend development server
npm run dev

# Build frontend
npm run build

# Run tests
npm run test

# Fetch stock data manually (normally runs via GitHub Actions)
npm run fetch-stock-data
```

### Data Management
```bash
# Fetch latest stock data from Yahoo Finance
npm run fetch-stock-data

# Check data files
ls -lh frontend/public/data/

# View metadata
cat frontend/public/data/metadata.json
```

### GitHub Actions
The project uses GitHub Actions to automatically fetch stock data daily:
- **Workflow**: `.github/workflows/fetch-stock-data.yml`
- **Schedule**: Daily at 10 PM UTC (after US market close)
- **Manual trigger**: Available via GitHub Actions UI
- **Output**: JSON files in `frontend/public/data/`

## Documentation Structure

### Core Documentation
- **CLAUDE.md** (this file): Quick commands and project specifics
- **PROJECT_KNOWLEDGE.md**: Architecture overview and system design
- **TROUBLESHOOTING.md**: Common issues and solutions
- **PRD.md**: Complete product requirements document

### Additional Resources
- `docs/architecture/`: System architecture diagrams and documentation
- `docs/dev/active/`: Active development task tracking
- `.claude/skills/`: Skills for auto-activation system
- `.claude/hooks/`: Hooks for quality control
- `.github/workflows/`: GitHub Actions workflows

## Skills System

Skills are automatically activated based on context (keywords, file paths, content patterns).

### Available Skills
1. **frontend-dev-guidelines**: React 19, Vite, D3.js, TailwindCSS, TanStack Router/Query patterns
2. **d3-visualization-guidelines**: D3.js v7 + React integration, chart race animations, 60fps optimization
3. **testing-guidelines**: Vitest, Playwright E2E testing strategies
4. **skill-developer**: Meta-skill for creating new skills

Skills automatically load when relevant. Manual activation: `/skill <skill-name>`

## Dev Docs System

### Starting Large Tasks

When exiting plan mode with an accepted plan:

1. **Create Task Directory**:
   ```bash
   mkdir -p docs/dev/active/[task-name]/
   ```

2. **Create Documents**:
   - `[task-name]-plan.md` - The accepted plan
   - `[task-name]-context.md` - Key files, decisions, architecture notes
   - `[task-name]-tasks.md` - Checklist of work items

3. **Update Regularly**: Mark tasks complete immediately, add context as you discover it

### Continuing Tasks

- Check `docs/dev/active/` for existing tasks
- Read all three files before proceeding
- Update "Last Updated" timestamps
- Use `/dev-docs-update` before auto-compaction

## Project-Specific Configuration

### Stock Tickers
Blue Team vs White Team stock tickers are centrally defined in:
- `shared/config/stock-tickers.ts`

Reference this file for all ticker-related logic.

### Color System
Project uses specific color coding for Blue Team (future-focused) vs White Team (traditional):
- See `.claude/skills/resources/color-system.md` for complete color palette
- All colors must meet WCAG 2.1 AA accessibility standards

### Yahoo Finance API
- **Integration**: Via `yahoo-finance2` npm package
- **Fetching**: Daily via GitHub Actions cron job
- **Rate Limiting**: Batch processing (5 stocks at a time) to respect API limits
- **Caching Strategy**: Static JSON files updated daily
- **Error Handling**: 3-retry logic with exponential backoff
- **Data Storage**: JSON files in `frontend/public/data/`
- **Script**: `scripts/fetch-stock-data.ts`

## Data Architecture

### Serverless Data Flow
```
GitHub Actions (Daily Cron)
    ↓
fetch-stock-data.ts script
    ↓
Yahoo Finance API (32 stocks × 5 years)
    ↓
Static JSON files (stocks-latest.json, stocks-YYYY-MM-DD.json)
    ↓
Served via CDN (Vercel/Netlify/Cloudflare Pages)
    ↓
Frontend fetches JSON directly
```

### Data Files
- `stocks-latest.json`: Always contains most recent data (~9.6MB)
- `stocks-YYYY-MM-DD.json`: Dated archives for historical reference
- `metadata.json`: Metadata about last update, stock counts, etc.

### Frontend API Layer
- Location: `frontend/src/services/stockApi.ts`
- Functions: `getAllStocks()`, `getStocksByDate()`, `getStockMetadata()`
- Caching: TanStack Query with infinite staleTime (data is pre-generated)

## Frontend Structure

### Key Technologies
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query v5
- **Styling**: TailwindCSS v3
- **Visualization**: D3.js v7
- **Icons**: Lucide React

### Component Organization
```
frontend/src/
├── components/       # Reusable components
│   └── ChartRace/   # D3.js chart race visualization
├── pages/           # Route pages
├── hooks/           # Custom React hooks
├── stores/          # Zustand stores
├── services/        # API client services
├── utils/           # Utility functions
└── types/           # TypeScript types
```

## Testing

### Frontend Tests
```bash
# Unit tests with Vitest
npm run test

# E2E tests with Playwright (when implemented)
npm run test:e2e
```

### Test Coverage Target
- Minimum: 70% code coverage
- Focus on: Data processing, chart race logic, UI components

## Animation Performance

**Critical Requirement**: 60fps chart race animations

### Performance Checklist
- ✅ Use `requestAnimationFrame` for all D3.js animations
- ✅ Implement easing functions (ease-in-out)
- ✅ Batch DOM updates
- ✅ Use CSS transforms instead of position changes
- ✅ Monitor with Chrome DevTools Performance tab
- ✅ Test on low-end devices

See `d3-visualization-guidelines` skill for detailed optimization techniques.

## Development Workflow

### Planning Process
1. **Always use planning mode** before implementing features
2. Use `/strategic-plan-architect` agent or `/dev-docs` command
3. Review plan thoroughly before proceeding
4. Create dev docs structure (`plan.md`, `context.md`, `tasks.md`)

### Code Review Process
1. Implement 1-2 sections at a time
2. Review code between each set of tasks
3. Use `/code-review` command for automated reviews
4. Check builds frequently (hooks will auto-check)

### Error Handling
- **Build errors**: Hooks will auto-detect and report
- **TypeScript errors**: Must be zero before moving to next task
- **Data fetching errors**: Check script output or GitHub Actions logs
- **Runtime errors**: Check browser console

## Hooks (Automated Quality Control)

Active hooks will automatically:
1. **skill-auto-activation**: Load relevant skills before you see prompts
2. **build-error-checker**: Run builds after edits, report errors immediately
3. **error-handling-reminder**: Check for proper try-catch and error handling
4. **performance-reminder**: Validate 60fps requirements in D3.js code

## Specialized Agents

Available agents for specific tasks:
- `/strategic-plan-architect`: Create detailed implementation plans
- `/code-review`: Architectural code review
- `/build-and-fix`: Run builds and fix all errors
- `/d3-animation-specialist`: Expert D3.js + React integration review

## Development Phases (8 weeks)

1. **Phase 1**: Project setup & data infrastructure (1 week) ✅ Complete
   - Serverless architecture setup
   - GitHub Actions workflow
   - Data fetching script
   - Frontend API layer
2. **Phase 2**: Frontend UI foundation (2 weeks)
   - Layout and routing
   - Basic components
   - State management
3. **Phase 3**: D3.js Chart Race implementation (3 weeks) ⚠️ Most complex
   - Chart race animation
   - Time controls
   - Interactive features
4. **Phase 4**: Stock details & comparison (1 week)
   - Detail modals
   - Team comparison charts
   - Sector analysis
5. **Phase 5**: Testing & QA (1 week)
   - Unit tests
   - E2E tests
   - Performance testing
6. **Phase 6**: Deployment (1 week)
   - Vercel/Netlify deployment
   - CI/CD pipeline
   - Documentation

## Important Reminders

- **Planning is king**: Never skip planning mode for non-trivial tasks
- **Dev docs prevent context loss**: Use them for any task >1 day
- **Build errors = blockers**: Zero tolerance for unresolved TypeScript errors
- **60fps is critical**: Performance testing required for all animations
- **Review frequently**: Better to catch issues early
- **Serverless simplicity**: No backend servers to manage or debug
- **Daily data updates**: Stock data refreshes automatically via GitHub Actions

## Quick Reference Links

- PRD: `PRD.md`
- Architecture: `docs/architecture/`
- Stock Tickers: `shared/config/stock-tickers.ts`
- Data Fetching Script: `scripts/fetch-stock-data.ts`
- Frontend API: `frontend/src/services/stockApi.ts`
- GitHub Actions: `.github/workflows/fetch-stock-data.yml`
- Color System: `.claude/skills/resources/color-system.md`
- Skills: `.claude/skills/`
- Active Tasks: `docs/dev/active/`
