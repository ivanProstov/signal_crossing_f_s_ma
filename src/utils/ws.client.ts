import WebSocket from 'ws';
import { TypeWs } from '../enums/typeWs';

export class WSClient {
  private instance: WebSocket | null = null;
  private reconnectInterval = 5000; // 5 секунд
  private shouldReconnect = true;

  constructor(
    private readonly url: string,
    private readonly type?: TypeWs,
  ) {
    console.log('Waiting for WebSocket connection', this.type || '', '....');
    this.connect();
  }

  private connect() {
    this.instance = new WebSocket(this.url);

    this.instance.onopen = () => {
      console.log('✅ Connected to WebSocket:', this.type || this.url);
    };

    this.instance.onmessage = (event) => {
      // console.log("event.data >>> ", event.data);

      this.handleMessage?.(event.data);
    };

    this.instance.onerror = (err) => {
      console.error('❌ WebSocket error:', this.type, ' ', err);
    };

    this.instance.onclose = (event) => {
      console.warn('⚠️ WebSocket closed:', this.type, ' ', event.reason);
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };
  }

  private handleMessage?: (data: WebSocket.Data) => void;

  public onMessage(fn: (data: WebSocket.Data) => void) {
    this.handleMessage = fn;
  }

  public send(data: string) {
    if (this.instance?.readyState === WebSocket.OPEN) {
      this.instance.send(data);
    } else {
      console.warn('WebSocket not connected. Message not sent.');
    }
  }

  public close() {
    this.shouldReconnect = false;
    this.instance?.close();
  }
}
