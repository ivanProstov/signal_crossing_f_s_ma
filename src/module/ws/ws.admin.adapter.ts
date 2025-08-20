import { Context } from '../run/ctx';
import { TypeWs } from '../../enums/typeWs';
import { WsService } from './ws.service';
import { Data } from 'ws';

export class WsAdminAdapter extends Context {
  constructor(private readonly wsService: WsService) {
    super();
  }

  get methodsForMessage() {
    return {
      [TypeWs.PUBLIC]: this.wsMessagePublic.bind(this),
    };
  }

  public async start() {
    this.ctx.binance.wsClient[TypeWs.PUBLIC]?.onMessage((data) => {
      this.methodsForMessage[TypeWs.PUBLIC](data);
    });
  }

  private wsMessagePublic(data: Data) {
    this.wsService.wsMessagePublic(data);
  }

}
