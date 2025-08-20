export type IKlineArray = [
  number, // openTime
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number, // closeTime
  string, // quoteAssetVolume
  number, // tradesCount
  string, // takerBuyBaseVolume
  string, // takerBuyQuoteVolume
  string, // ignore
];

export interface IBinanceRestAdapter {
  getKlines: () => Promise<IKlineArray[]>;
}
