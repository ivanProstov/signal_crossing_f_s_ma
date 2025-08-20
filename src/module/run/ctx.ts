import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { BinanceService } from '../binance/binance.service';
import { BinanceUtilsAdapter } from '../binance/binance.utils.adapter';

const app = express();
const server = http.createServer(app);

// WebSocket сервер
// похоже можно будет заменить на сокет io
const wss = new WebSocket.Server({ server });

const binance = new BinanceService(new BinanceUtilsAdapter());

export let ctx = { app, server, wss, binance };

export type ICtx = typeof ctx;

export abstract class Context {
  protected ctx: ICtx = ctx;
}
