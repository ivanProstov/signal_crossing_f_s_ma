import { ctx } from './module/run/ctx';
import { env } from './module/config/env';
import { run } from './module/run/run';

const { PORT } = env;
const { server, app } = ctx;

ctx.binance.init().then(async () => {
  await run();
});

// Маршрут Express для примера
app.get('/', async (_req, res) => {
  res.send(ctx.binance.utils.cache);
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}`);
});
