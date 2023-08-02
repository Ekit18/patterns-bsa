import { Server, Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { Database } from '../data/database';
import { ReorderService } from '../services/reorder.service';
import { ReorderServiceProxy } from '../patterns/proxy/redorderSerivceProxy';

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderService;

  protected io: Server;

  protected  reorderProxyService:ReorderServiceProxy;

  public constructor(io: Server, db: Database, reorderService: ReorderService, reorderProxyService) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
    this.reorderProxyService =  reorderProxyService;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
}

export { SocketHandler };
