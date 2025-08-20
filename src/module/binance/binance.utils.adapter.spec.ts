import { BinanceUtilsAdapter } from './binance.utils.adapter';
import { IBinanceKlineWebSocketMessage } from '../ws/interfaces';
import { getMockKline, getMockKlineWSMessage } from './__mock__/binance.utils.adapter';
import { signalType } from '../../enums/signalType';
import { IKlineArray } from './interfaces';

// пример реальных данных
// fastMA: [118599.68666666666, 118599.69111111111, 118503.6274074074], // Предпоследнее и последнее значения fastMA
// slowMA: [118530.83999999997, 118535.54999999997, 118550.56499999999], // Предпоследнее и последнее значения slowMA

// валидные кейсы для BUY
// S F |   F
// F S |   S
//     | S
//     | F
// не валидные кейсы для BUY
// S
// F
//   F
//   S
// Валидные кейсы для SELL
// F S  | F
// S F  | S
//      |   S
//      |   F
// не валидные кейсы для SELL
//  S
//  F
//F
//S

describe('BinanceUtilsAdapter', () => {
  let binanceUtilsAdapter: BinanceUtilsAdapter;
  let kline: IKlineArray[];
  let KlineWSMessage: IBinanceKlineWebSocketMessage;

  beforeEach(() => {
    binanceUtilsAdapter = new BinanceUtilsAdapter();
    kline = getMockKline((data) => data);
    KlineWSMessage = getMockKlineWSMessage((data) => data);
    binanceUtilsAdapter.cache = kline;
    binanceUtilsAdapter.cacheCurrentKline = KlineWSMessage;
  });

  // Fast MA пересекает Slow MA снизу вверх
  it('тест 1: проверяем получения сигнала BUY на пересечении когда MA растут', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [100, 107], // Предпоследнее и последнее значения fastMA
      slowMA: [101, 106], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(signalType.BUY);
  });
  it('тест 2: не должен быть сигнал на BUY когда MA падают', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [100, 99], // Предпоследнее и последнее значения fastMA
      slowMA: [101, 98], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(undefined);
  });
  // Fast MA пересекает Slow MA сверху вниз
  it('тест 3: проверяем получения сигнала SELL на пересечении когда MA падает', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [105, 101], // Предпоследнее и последнее значения fastMA
      slowMA: [103, 102], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(signalType.SELL);
  });
  it('тест 4: не должен быть сигнал на SELL когда MA растут', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [105, 110], // Предпоследнее и последнее значения fastMA
      slowMA: [103, 111], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(undefined);
  });
  it('тест 5: получает сигнал на SELL, slow выросло', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [99, 3], // Предпоследнее и последнее значения fastMA
      slowMA: [35, 50], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(signalType.SELL);
  });

  it('тест 6: получает сигнал на BUY, slow упало', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [3, 90], // Предпоследнее и последнее значения fastMA
      slowMA: [35, 20], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(signalType.BUY);
  });
  it('тест 7: slow пересекает fast (сверху в низ) не валидный кейс', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [3, 2], // Предпоследнее и последнее значения fastMA
      slowMA: [35, 1], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(undefined);
  });
  it('тест 8: slow пересекает fast (снизу в верх) не валидный кейс', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [30, 40], // Предпоследнее и последнее значения fastMA
      slowMA: [20, 50], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(undefined);
  });
  it('тест 9: slow и fast не пересекаются', async () => {
    jest.spyOn(binanceUtilsAdapter, 'calculateMA').mockReturnValue({
      fastMA: [30, 40], // Предпоследнее и последнее значения fastMA
      slowMA: [20, 10], // Предпоследнее и последнее значения slowMA
    });

    const result = await binanceUtilsAdapter.runStrategyMA();

    expect(result?.signalType).toBe(undefined);
  });
});
