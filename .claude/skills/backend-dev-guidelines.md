# Backend Development Guidelines

**Version**: 1.0.0
**Last Updated**: 2025-01-02
**Purpose**: Comprehensive guidelines for Node.js + Express backend microservices with TypeScript

## Overview

This skill provides patterns and best practices for the Team Race backend services. The project uses a microservices architecture with 7 independent services managed by PM2.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript 5.3+
- **Process Management**: PM2
- **HTTP Client**: Axios
- **Caching**: node-cache
- **External API**: Yahoo Finance (yahoo-finance2 npm package)
- **Testing**: Vitest
- **Logging**: Winston (or pino)

## Architecture Pattern

All backend services follow: **Routes → Controllers → Services → Repositories**

```
Request
  ↓
Routes (Define endpoints)
  ↓
Controllers (Handle HTTP request/response)
  ↓
Services (Business logic)
  ↓
Repositories (Data access - API calls, DB, cache)
  ↓
Response
```

---

## Service Structure

### Standard Service Layout
```
backend/[service-name]/
├── src/
│   ├── routes/
│   │   ├── index.ts          # Export all routes
│   │   └── stockRoutes.ts    # Route definitions
│   ├── controllers/
│   │   ├── BaseController.ts # Base controller class
│   │   └── StockController.ts
│   ├── services/
│   │   └── StockService.ts   # Business logic
│   ├── repositories/
│   │   └── StockRepository.ts # Data access
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── validateRequest.ts
│   ├── types/
│   │   └── stock.ts          # TypeScript interfaces
│   ├── utils/
│   │   ├── cache.ts
│   │   └── retry.ts
│   ├── config/
│   │   └── index.ts          # Environment config
│   └── index.ts              # Entry point
├── logs/
│   ├── error.log
│   └── out.log
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── .env
```

---

## Layer Responsibilities

### 1. Routes Layer
**Responsibility**: Define HTTP endpoints and map to controllers

```typescript
// src/routes/stockRoutes.ts
import { Router } from 'express';
import { StockController } from '../controllers/StockController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const stockController = new StockController();

// GET /api/stocks/:ticker
router.get(
  '/:ticker',
  validateRequest('ticker'),
  stockController.getStock.bind(stockController)
);

// GET /api/stocks/batch
router.get(
  '/batch',
  stockController.getBatchStocks.bind(stockController)
);

// GET /api/stocks/:ticker/history
router.get(
  '/:ticker/history',
  stockController.getStockHistory.bind(stockController)
);

export default router;
```

### 2. Controllers Layer
**Responsibility**: Handle HTTP request/response, validation, error responses

```typescript
// src/controllers/StockController.ts
import { Request, Response, NextFunction } from 'express';
import { StockService } from '../services/StockService';
import { BaseController } from './BaseController';

export class StockController extends BaseController {
  private stockService: StockService;

  constructor() {
    super();
    this.stockService = new StockService();
  }

  async getStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticker } = req.params;

      const stock = await this.stockService.getStockData(ticker);

      return this.success(res, stock);
    } catch (error) {
      next(error);
    }
  }

  async getBatchStocks(req: Request, res: Response, next: NextFunction) {
    try {
      const tickers = req.query.tickers as string;

      if (!tickers) {
        return this.badRequest(res, 'Tickers parameter required');
      }

      const tickerArray = tickers.split(',').map(t => t.trim());
      const stocks = await this.stockService.getBatchStockData(tickerArray);

      return this.success(res, stocks);
    } catch (error) {
      next(error);
    }
  }

  async getStockHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticker } = req.params;
      const { start, end } = req.query;

      const history = await this.stockService.getHistoricalData(
        ticker,
        start as string,
        end as string
      );

      return this.success(res, history);
    } catch (error) {
      next(error);
    }
  }
}
```

### BaseController Pattern
```typescript
// src/controllers/BaseController.ts
import { Response } from 'express';

export class BaseController {
  protected success<T>(res: Response, data: T, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  protected created<T>(res: Response, data: T) {
    return this.success(res, data, 201);
  }

  protected badRequest(res: Response, message: string) {
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  protected notFound(res: Response, message: string) {
    return res.status(404).json({
      success: false,
      error: message,
    });
  }

  protected serverError(res: Response, message: string) {
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
}
```

### 3. Services Layer
**Responsibility**: Business logic, orchestration, data transformation

```typescript
// src/services/StockService.ts
import { StockRepository } from '../repositories/StockRepository';
import type { Stock, StockHistory } from '../types/stock';

export class StockService {
  private stockRepository: StockRepository;

  constructor() {
    this.stockRepository = new StockRepository();
  }

  async getStockData(ticker: string): Promise<Stock> {
    // Validate ticker format
    if (!this.isValidTicker(ticker)) {
      throw new Error(`Invalid ticker format: ${ticker}`);
    }

    const stock = await this.stockRepository.fetchStock(ticker);

    // Transform/enrich data
    return this.enrichStockData(stock);
  }

  async getBatchStockData(tickers: string[]): Promise<Stock[]> {
    // Batch processing logic
    const validTickers = tickers.filter(this.isValidTicker);

    const stocks = await this.stockRepository.fetchBatchStocks(validTickers);

    return stocks.map(this.enrichStockData);
  }

  async getHistoricalData(
    ticker: string,
    startDate: string,
    endDate: string
  ): Promise<StockHistory> {
    const history = await this.stockRepository.fetchHistoricalData(
      ticker,
      startDate,
      endDate
    );

    // Calculate additional metrics
    return this.calculateMetrics(history);
  }

  private isValidTicker(ticker: string): boolean {
    return /^[A-Z]{1,5}$/.test(ticker);
  }

  private enrichStockData(stock: Stock): Stock {
    // Add calculated fields, formatting, etc.
    return {
      ...stock,
      formattedPrice: `$${stock.price.toFixed(2)}`,
      changePercent: ((stock.change / stock.previousClose) * 100).toFixed(2),
    };
  }

  private calculateMetrics(history: StockHistory): StockHistory {
    // Calculate moving averages, volatility, etc.
    return history;
  }
}
```

### 4. Repositories Layer
**Responsibility**: Data access (API calls, database, cache)

```typescript
// src/repositories/StockRepository.ts
import yahooFinance from 'yahoo-finance2';
import { cache } from '../utils/cache';
import { retry } from '../utils/retry';
import type { Stock } from '../types/stock';

export class StockRepository {
  async fetchStock(ticker: string): Promise<Stock> {
    // Check cache first
    const cacheKey = `stock:${ticker}`;
    const cached = cache.get<Stock>(cacheKey);

    if (cached) {
      return cached;
    }

    // Fetch from Yahoo Finance with retry logic
    const data = await retry(
      () => yahooFinance.quote(ticker),
      { attempts: 3, delay: 1000 }
    );

    const stock = this.transformYahooData(data);

    // Cache for 24 hours
    cache.set(cacheKey, stock, 86400);

    return stock;
  }

  async fetchBatchStocks(tickers: string[]): Promise<Stock[]> {
    const cacheKey = `stocks:batch:${tickers.sort().join(',')}`;
    const cached = cache.get<Stock[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Fetch in parallel
    const promises = tickers.map(ticker =>
      yahooFinance.quote(ticker).catch(err => {
        console.error(`Failed to fetch ${ticker}:`, err);
        return null;
      })
    );

    const results = await Promise.all(promises);
    const stocks = results
      .filter(Boolean)
      .map(this.transformYahooData);

    cache.set(cacheKey, stocks, 86400);

    return stocks;
  }

  async fetchHistoricalData(
    ticker: string,
    startDate: string,
    endDate: string
  ) {
    const cacheKey = `stock:${ticker}:history:${startDate}:${endDate}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await retry(
      () => yahooFinance.historical(ticker, {
        period1: startDate,
        period2: endDate,
      }),
      { attempts: 3, delay: 1000 }
    );

    cache.set(cacheKey, data, 3600); // 1 hour for historical

    return data;
  }

  private transformYahooData(data: any): Stock {
    return {
      ticker: data.symbol,
      name: data.longName || data.shortName,
      price: data.regularMarketPrice,
      change: data.regularMarketChange,
      previousClose: data.regularMarketPreviousClose,
      marketCap: data.marketCap,
      volume: data.regularMarketVolume,
    };
  }
}
```

---

## Error Handling

### 1. Custom Error Classes
```typescript
// src/utils/errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded') {
    super(429, message);
    this.name = 'RateLimitError';
  }
}
```

### 2. Global Error Handler Middleware
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Handle known errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
```

### 3. Async Error Wrapper
```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.get('/:ticker', asyncHandler(async (req, res) => {
  const stock = await stockService.getStockData(req.params.ticker);
  res.json({ success: true, data: stock });
}));
```

---

## Utility Patterns

### 1. Retry Logic
```typescript
// src/utils/retry.ts
interface RetryOptions {
  attempts: number;
  delay: number; // milliseconds
  exponential?: boolean;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { attempts, delay, exponential = true } = options;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) {
        throw error;
      }

      const waitTime = exponential ? delay * Math.pow(2, i) : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error('Retry failed');
}
```

### 2. Cache Utility
```typescript
// src/utils/cache.ts
import NodeCache from 'node-cache';

class CacheManager {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 3600, // Default 1 hour
      checkperiod: 600, // Check for expired keys every 10 minutes
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 0);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  keys(): string[] {
    return this.cache.keys();
  }
}

export const cache = new CacheManager();
```

### 3. Logger Utility
```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/out.log' }),
  ],
});

// Also log to console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

---

## Configuration Management

### Environment Variables
```typescript
// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // API Keys
  yahooFinanceApiKey: process.env.YAHOO_FINANCE_API_KEY,

  // Cache settings
  cacheDefaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10),

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

// Validate required env vars
const requiredEnvVars = ['PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

## Server Setup

### Entry Point
```typescript
// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import stockRoutes from './routes/stockRoutes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/stocks', stockRoutes);

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Data service listening on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
```

---

## Testing

### Unit Tests
```typescript
// tests/unit/StockService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { StockService } from '../../src/services/StockService';

vi.mock('../../src/repositories/StockRepository');

describe('StockService', () => {
  it('should get stock data', async () => {
    const service = new StockService();
    const stock = await service.getStockData('AAPL');

    expect(stock).toHaveProperty('ticker', 'AAPL');
    expect(stock).toHaveProperty('price');
  });

  it('should throw error for invalid ticker', async () => {
    const service = new StockService();

    await expect(service.getStockData('INVALID123'))
      .rejects.toThrow('Invalid ticker format');
  });
});
```

---

## Best Practices

### 1. TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 2. Input Validation
```typescript
import { z } from 'zod';

const stockQuerySchema = z.object({
  ticker: z.string().regex(/^[A-Z]{1,5}$/).toUpperCase(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
});

// Validate in controller
const validatedData = stockQuerySchema.parse(req.query);
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

---

## Checklist Before Committing

- [ ] No TypeScript errors
- [ ] All routes follow Routes → Controllers → Services → Repositories pattern
- [ ] Error handling in all async operations
- [ ] Caching implemented for external API calls
- [ ] Retry logic for Yahoo Finance API
- [ ] Proper logging
- [ ] Environment variables used (not hardcoded)
- [ ] Tests written for new features
- [ ] PM2 logs verified

---

**Last Updated**: 2025-01-02
**Skill Version**: 1.0.0
**Compatible With**: Node.js 18+, Express 4+, TypeScript 5.3+
