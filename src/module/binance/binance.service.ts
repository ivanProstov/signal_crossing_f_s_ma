import { WSClient } from '../../utils/ws.client';
import { TypeWs } from '../../enums/typeWs';
import { env } from '../config/env';
import { BinanceRestAdapter } from './binance.rest.adapter';
import { BinanceUtilsAdapter } from './binance.utils.adapter';

const { SYMBOL, KLINE, WS_URL_BINANCE } = env;

export class BinanceService extends BinanceRestAdapter {
  private wsUrlPublic = `${WS_URL_BINANCE}/${SYMBOL}@kline_${KLINE}`;
  private wsPublic: WSClient | null = null;

  constructor(private readonly utilsAdapter: BinanceUtilsAdapter) {
    super();
  }

  public async init() {
    if (!this.wsPublic) {
      this.connectWsPublic();
    }
  }

  get wsClient() {
    return {
      [TypeWs.PUBLIC]: this.wsPublic,
    };
  }

  get restClient() {
    return {
      getKlines: this.getKlines,
    };
  }

  get utils() {
    return this.utilsAdapter;
  }

  private connectWsPublic() {
    this.wsPublic = new WSClient(this.wsUrlPublic, TypeWs.PUBLIC);
  }

}
