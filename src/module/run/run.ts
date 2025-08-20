import { WsAdminAdapter } from '../ws/ws.admin.adapter';
import { WsService } from '../ws/ws.service';

export const run = async () => {
  const wsAdminAdapter = new WsAdminAdapter(new WsService());
  await wsAdminAdapter.start();
};
