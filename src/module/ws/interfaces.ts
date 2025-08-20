export interface IBinanceKlineWebSocketMessage {
  e: 'kline'; // Тип события (kline)
  E: number; // Время события (event time) в Unix timestamp (ms)
  s: string; // Символ торговой пары (например, 'BTCUSDT')
  k: {
    t: number; // Время начала свечи (open time)
    T: number; // Время закрытия свечи (close time)
    s: string; // Символ торговой пары
    i: string; // Интервал свечи (например, '1m', '15m', '1h')
    f: number; // ID первой сделки в свече
    L: number; // ID последней сделки в свече
    o: string; // Цена открытия
    c: string; // Цена закрытия
    h: string; // Наибольшая цена
    l: string; // Наименьшая цена
    v: string; // Объем базового актива (например, BTC)
    n: number; // Количество сделок в свече
    x: boolean; // Закрыта ли свеча?
    q: string; // Объем котируемого актива (например, USDT)
    V: string; // Объем активных покупок (taker buy base asset volume)
    Q: string; // Объем активных покупок в котируемом активе (taker buy quote asset volume)
    B: string; // Игнорируемое поле
  };
}
