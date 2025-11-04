import * as yahooFinance from 'yahoo-finance2';

console.log('Yahoo Finance module:', yahooFinance);
console.log('\nKeys:', Object.keys(yahooFinance));
console.log('\nDefault export:', (yahooFinance as any).default);
console.log('\nDefault keys:', (yahooFinance as any).default ? Object.keys((yahooFinance as any).default) : 'no default');
