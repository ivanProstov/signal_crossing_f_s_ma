import { env } from '../config/env';
import { IBinanceRestAdapter, IKlineArray } from './interfaces';

const {  REST_URL_BINANCE, DEMO_MODE, SYMBOL, KLINE } = env;

export class BinanceRestAdapter implements IBinanceRestAdapter {
  public async getKlines(): Promise<IKlineArray[]> {
    if (!DEMO_MODE) {
      console.log('class BinanceRestAdapter, method getKlines >>>> added url');
    }
    const path = !DEMO_MODE ? '' : `/fapi/v1/klines?symbol=${SYMBOL}&interval=${KLINE}&limit=1000`;
    const response = await fetch(`${REST_URL_BINANCE}${path}`, {
      method: 'GET',
    });

    return await response.json();
  }
}
