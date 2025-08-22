import WebSocket, { Data } from 'ws';
import { TypeWs } from '../../enums/typeWs';
import { Context } from '../run/ctx';
import { IBinanceKlineWebSocketMessage } from './interfaces';
import {env} from "../config/env";

const {
  TG_BOT_URL
} = env;

export class WsService extends Context {
  constructor() {
    super();
  }

  public async wsMessagePublic(data: Data) {
    const wsMessage: IBinanceKlineWebSocketMessage = JSON.parse(data.toString());

    const utils = this.ctx.binance.utils;

    if (!utils.isCache || wsMessage.k.x) {
      const klines = await this.ctx.binance.restClient.getKlines();
      utils.cache = klines;
      console.log('utils.cache: first element', utils.cache[0]);
      console.log('utils.cache: length', utils.cache.length);
      // вынести запрос в rest.adapter.ts
      try {
        await fetch(`${TG_BOT_URL}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"message": `update cache ${new Date().toISOString()}`,}),
        });
      }catch{
        console.log('error send message to telegram');
      }

    }
    utils.cacheCurrentKline = wsMessage;
    const signal = await utils.runStrategyMA();
    if(signal){
      try {
        // вынести запрос в rest.adapter.ts
        await fetch(`${TG_BOT_URL}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"message": signal}),
        });
      }catch{
        console.log('error send message to telegram');
      }

    }

    this.wssServerSend(data, TypeWs.PUBLIC);
  }

  private wssServerSend(data: Data, type: TypeWs) {
    this.ctx.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send({ title: type, body: data.toString() }.toString());
      }
    });
  }
}
