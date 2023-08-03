import { Server, Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { Database } from '../data/database';
import { ReorderService } from '../services/reorder.service';
import { ReorderServiceProxy } from '../patterns/proxy/redorderSerivceProxy';
import { Originator } from '../patterns/memento/originator';
import { Caretaker } from '../patterns/memento/caretaker';

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderService;

  protected io: Server;

  protected reorderProxyService: ReorderServiceProxy;

  protected originator: Originator;

  protected caretaker: Caretaker;

  public constructor(io: Server, db: Database, reorderService: ReorderService, reorderProxyService: ReorderServiceProxy, originator: Originator, caretaker: Caretaker) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
    this.reorderProxyService = reorderProxyService;
    this.originator = originator;
    this.caretaker = caretaker;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
}

export { SocketHandler };
