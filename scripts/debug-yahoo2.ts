import yahooFinance from 'yahoo-finance2';

console.log('Default import:', yahooFinance);
console.log('\nType:', typeof yahooFinance);
console.log('\nKeys:', Object.keys(yahooFinance));
console.log('\nPrototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(yahooFinance)));
console.log('\nChart method:', typeof yahooFinance.chart);
console.log('\nQuoteSummary method:', typeof yahooFinance.quoteSummary);

// Try to call chart
(async () => {
  try {
    const result = await yahooFinance.chart('AAPL', { period1: '2024-01-01', period2: '2024-01-31' });
    console.log('\nChart result:', result);
  } catch (error) {
    console.error('\nChart error:', error);
  }
})();
