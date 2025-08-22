import dotenv from 'dotenv';
dotenv.config();

function parseBoolean(value: string) {
  return value === 'true';
}

const envDemo = {
  API_KEY_DEMO: process.env.API_KEY_DEMO || '',
  SECRET_KEY_DEMO: process.env.SECRET_KEY_DEMO || '',
  REST_URL_BINANCE_DEMO: process.env.REST_URL_BINANCE_DEMO || '',
  WS_URL_BINANCE_DEMO: process.env.WS_URL_BINANCE_DEMO || '',
  DEMO_MODE: parseBoolean(process.env.DEMO_MODE || 'true'),
};

export const env = {
  SYMBOL: process.env.SYMBOL || 'btcusdt',
  KLINE: process.env.KLINE || '1m',
  API_KEY: envDemo.DEMO_MODE ? envDemo.API_KEY_DEMO : process.env.API_KEY || '',
  SECRET_KEY: envDemo.DEMO_MODE ? envDemo.SECRET_KEY_DEMO : process.env.SECRET_KEY || '',
  WS_URL_BINANCE: envDemo.DEMO_MODE
    ? envDemo.WS_URL_BINANCE_DEMO
    : process.env.WS_URL_BINANCE || '',
  REST_URL_BINANCE: envDemo.DEMO_MODE
    ? envDemo.REST_URL_BINANCE_DEMO
    : process.env.REST_URL_BINANCE || '',
  PORT: process.env.PORT || 3000,
  EMA_PERIOD: Number(process.env.EMA_PERIOD) || 20,
  SMA_PERIOD: Number(process.env.SMA_PERIOD) || 50,
  OFFSET: Number(process.env.OFFSET) || 0.1,
  LIFETIME: Number(process.env.LIFETIME) || 5,
  MIN_SIGNAL_GAP: Number(process.env.MIN_SIGNAL_GAP) || 3,
  TG_BOT_URL: process.env.TG_BOT_URL,
  ...envDemo,
};
