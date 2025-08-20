import { EMA, SMA } from 'technicalindicators';
import { env } from '../config/env';
import { IKlineArray } from './interfaces';
import { IBinanceKlineWebSocketMessage } from '../ws/interfaces';
import { signalType } from '../../enums/signalType';


const {
  SYMBOL,
  KLINE,
  PORT,
  SMA_PERIOD,
  EMA_PERIOD,
} = env;

const keyKline = `${SYMBOL}-${KLINE}-${PORT}`;
const keyCurrentKline = `${SYMBOL}-${KLINE}-${PORT}-current`;

export class BinanceUtilsAdapter {
  private maCache = new Map<
    string,
    IKlineArray[] | IBinanceKlineWebSocketMessage | undefined
  >();
  set cache(value: IKlineArray[]) {
    this.maCache.set(keyKline, value);
  }
  get cache(): IKlineArray[] | undefined {
    return this.maCache.get(keyKline) as IKlineArray[];
  }

  get isCache() {
    return this.maCache.has(keyKline);
  }

  set cacheCurrentKline(value: IBinanceKlineWebSocketMessage) {
    this.maCache.set(keyCurrentKline, value);
  }
  get cacheCurrentKline() {
    return this.maCache.get(keyCurrentKline) as IBinanceKlineWebSocketMessage;
  }

  get isCacheCurrentKline() {
    return this.maCache.has(keyKline);
  }


  public calculateMA() {
    return {
      fastMA: this.calculateEMA(),
      slowMA: this.calculateSMA(),
    };
  }

  public async runStrategyMA() {
    // TODO: нужно провести тестирование метода runStrategyMA + проверить корректную работу calculateMA
    // TODO: нужно проверить что calculateMA присылает данные полученные на основе исторических данных + состояние свечи которая сейчас открыта
    const { fastMA, slowMA } = this.calculateMA();

    if (fastMA && slowMA) {
      const lastFastMA = fastMA[fastMA.length - 1];
      const lastSlowMA = slowMA[slowMA.length - 1];
      const prevFastMA = fastMA[fastMA.length - 2];
      const prevSlowMA = slowMA[slowMA.length - 2];
      const round = (num: number) => Math.round(num * 100) / 100;
      const prevFast = round(prevFastMA); // 105935.42
      const prevSlow = round(prevSlowMA); // 105944.94
      const lastFast = round(lastFastMA); // 105936.76
      const lastSlow = round(lastSlowMA); // 105935.38
      const isBuy =
        prevFast < prevSlow && lastFast > lastSlow && prevFast < lastFast && prevFast < lastSlow;
      const isSell =
        prevFast > prevSlow && lastFast < lastSlow && prevFast > lastFast && prevFast > lastSlow;
      console.log('_______________START STRATEGY_______________');
      console.log('BUY signal >>> ', isBuy);
      console.log('SELL signal >>> ', isSell);
      console.log('_______________FINISHED STRATEGY_______________');


      // Fast MA пересекает Slow MA снизу вверх
      if (isBuy) {
        console.log('BUY signal');
          return  {
            currentKline: this.cacheCurrentKline,
            signalType: signalType.BUY,
          };
      }
      // Fast MA пересекает Slow MA сверху вниз
      if (isSell) {
          console.log('SELL signal');
          return  {
            currentKline: this.cacheCurrentKline,
            signalType: signalType.SELL,
          };
      }
    }
    return
  }


  private calculateEMA() {
    return this.calculateTemplate(EMA, EMA_PERIOD);
  }

  private calculateSMA() {
    return this.calculateTemplate(SMA, SMA_PERIOD);
  }

  private calculateTemplate(method: typeof EMA | typeof SMA, period: number) {
    if (this.isCache && this.isCacheCurrentKline) {
      const closes = (this.cache as IKlineArray[]).map((k) => parseFloat(k[4]));
      const closesCurrent = parseFloat(this.cacheCurrentKline.k.c);
      return method.calculate({
        period: period,
        values: [...closes, closesCurrent],
      });
    }
    return undefined;
  }

}
