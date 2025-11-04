# 백엔드 개발 가이드라인

**버전**: 1.0.0
**최종 업데이트**: 2025-01-02
**목적**: TypeScript를 사용한 Node.js + Express 백엔드 마이크로서비스를 위한 종합 가이드라인

## 개요

이 스킬은 Team Race 백엔드 서비스를 위한 패턴과 모범 사례를 제공합니다. 이 프로젝트는 PM2로 관리되는 7개의 독립적인 서비스로 구성된 마이크로서비스 아키텍처를 사용합니다.

## 기술 스택

- **런타임**: Node.js 18+
- **프레임워크**: Express.js
- **언어**: TypeScript 5.3+
- **프로세스 관리**: PM2
- **HTTP 클라이언트**: Axios
- **캐싱**: node-cache
- **외부 API**: Yahoo Finance (yahoo-finance2 npm 패키지)
- **테스팅**: Vitest
- **로깅**: Winston (또는 pino)

## 아키텍처 패턴

모든 백엔드 서비스는 다음 패턴을 따릅니다: **Routes → Controllers → Services → Repositories**

```
Request
  ↓
Routes (엔드포인트 정의)
  ↓
Controllers (HTTP request/response 처리)
  ↓
Services (비즈니스 로직)
  ↓
Repositories (데이터 접근 - API 호출, DB, cache)
  ↓
Response
```

---

## 서비스 구조

### 표준 서비스 레이아웃
```
backend/[service-name]/
├── src/
│   ├── routes/
│   │   ├── index.ts          # 모든 라우트 export
│   │   └── stockRoutes.ts    # 라우트 정의
│   ├── controllers/
│   │   ├── BaseController.ts # 기본 controller 클래스
│   │   └── StockController.ts
│   ├── services/
│   │   └── StockService.ts   # 비즈니스 로직
│   ├── repositories/
│   │   └── StockRepository.ts # 데이터 접근
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── validateRequest.ts
│   ├── types/
│   │   └── stock.ts          # TypeScript 인터페이스
│   ├── utils/
│   │   ├── cache.ts
│   │   └── retry.ts
│   ├── config/
│   │   └── index.ts          # 환경 설정
│   └── index.ts              # 진입점
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

## 레이어 책임

### 1. Routes 레이어
**책임**: HTTP 엔드포인트 정의 및 컨트롤러에 매핑

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

### 2. Controllers 레이어
**책임**: HTTP request/response 처리, 검증, 에러 응답

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

### BaseController 패턴
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

### 3. Services 레이어
**책임**: 비즈니스 로직, 오케스트레이션, 데이터 변환

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
    // ticker 형식 검증
    if (!this.isValidTicker(ticker)) {
      throw new Error(`Invalid ticker format: ${ticker}`);
    }

    const stock = await this.stockRepository.fetchStock(ticker);

    // 데이터 변환/보강
    return this.enrichStockData(stock);
  }

  async getBatchStockData(tickers: string[]): Promise<Stock[]> {
    // 배치 처리 로직
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

    // 추가 메트릭 계산
    return this.calculateMetrics(history);
  }

  private isValidTicker(ticker: string): boolean {
    return /^[A-Z]{1,5}$/.test(ticker);
  }

  private enrichStockData(stock: Stock): Stock {
    // 계산된 필드, 포맷팅 등 추가
    return {
      ...stock,
      formattedPrice: `$${stock.price.toFixed(2)}`,
      changePercent: ((stock.change / stock.previousClose) * 100).toFixed(2),
    };
  }

  private calculateMetrics(history: StockHistory): StockHistory {
    // 이동 평균, 변동성 등 계산
    return history;
  }
}
```

### 4. Repositories 레이어
**책임**: 데이터 접근 (API 호출, 데이터베이스, 캐시)

```typescript
// src/repositories/StockRepository.ts
import yahooFinance from 'yahoo-finance2';
import { cache } from '../utils/cache';
import { retry } from '../utils/retry';
import type { Stock } from '../types/stock';

export class StockRepository {
  async fetchStock(ticker: string): Promise<Stock> {
    // 먼저 캐시 확인
    const cacheKey = `stock:${ticker}`;
    const cached = cache.get<Stock>(cacheKey);

    if (cached) {
      return cached;
    }

    // 재시도 로직으로 Yahoo Finance에서 가져오기
    const data = await retry(
      () => yahooFinance.quote(ticker),
      { attempts: 3, delay: 1000 }
    );

    const stock = this.transformYahooData(data);

    // 24시간 캐시
    cache.set(cacheKey, stock, 86400);

    return stock;
  }

  async fetchBatchStocks(tickers: string[]): Promise<Stock[]> {
    const cacheKey = `stocks:batch:${tickers.sort().join(',')}`;
    const cached = cache.get<Stock[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // 병렬로 가져오기
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

    cache.set(cacheKey, data, 3600); // 히스토리는 1시간

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

## 에러 처리

### 1. 커스텀 에러 클래스
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

### 2. 글로벌 에러 핸들러 미들웨어
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
  // 에러 로그
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // 알려진 에러 처리
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
  }

  // 알 수 없는 에러 처리
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
```

### 3. Async 에러 래퍼
```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 사용법
router.get('/:ticker', asyncHandler(async (req, res) => {
  const stock = await stockService.getStockData(req.params.ticker);
  res.json({ success: true, data: stock });
}));
```

---

## 유틸리티 패턴

### 1. 재시도 로직
```typescript
// src/utils/retry.ts
interface RetryOptions {
  attempts: number;
  delay: number; // 밀리초
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

### 2. 캐시 유틸리티
```typescript
// src/utils/cache.ts
import NodeCache from 'node-cache';

class CacheManager {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 3600, // 기본 1시간
      checkperiod: 600, // 10분마다 만료된 key 확인
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

### 3. 로거 유틸리티
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

// 개발 환경에서는 콘솔에도 로그
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

---

## 설정 관리

### 환경 변수
```typescript
// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // API Keys
  yahooFinanceApiKey: process.env.YAHOO_FINANCE_API_KEY,

  // 캐시 설정
  cacheDefaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10),

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // 로깅
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

// 필수 환경 변수 검증
const requiredEnvVars = ['PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

## 서버 설정

### 진입점
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

// 보안 미들웨어
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 라우트
app.use('/api/stocks', stockRoutes);

// 에러 처리 (마지막에 있어야 함)
app.use(errorHandler);

// 서버 시작
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

## 테스팅

### 유닛 테스트
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

## 모범 사례

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

### 2. Input 검증
```typescript
import { z } from 'zod';

const stockQuerySchema = z.object({
  ticker: z.string().regex(/^[A-Z]{1,5}$/).toUpperCase(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
});

// controller에서 검증
const validatedData = stockQuerySchema.parse(req.query);
```

### 3. 속도 제한
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // windowMs당 각 IP를 100 요청으로 제한
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

---

## 커밋 전 체크리스트

- [ ] TypeScript 에러 없음
- [ ] 모든 라우트가 Routes → Controllers → Services → Repositories 패턴 준수
- [ ] 모든 async 작업에 에러 처리
- [ ] 외부 API 호출에 캐싱 구현
- [ ] Yahoo Finance API에 재시도 로직
- [ ] 적절한 로깅
- [ ] 환경 변수 사용 (하드코딩 금지)
- [ ] 새 기능에 대한 테스트 작성
- [ ] PM2 로그 확인

---

**최종 업데이트**: 2025-01-02
**스킬 버전**: 1.0.0
**호환 가능**: Node.js 18+, Express 4+, TypeScript 5.3+