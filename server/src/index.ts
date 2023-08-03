import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { lists } from './assets/mockData';
import { Database } from './data/database';
import { CardHandler } from './handlers/card.handler';
import { ListHandler } from './handlers/list.handler';
import { ReorderService } from './services/reorder.service';
import { ReorderServiceProxy } from './patterns/proxy/redorderSerivceProxy';
import { Originator } from './patterns/memento/originator';
import { Caretaker } from './patterns/memento/caretaker';
import { ListEvent } from './common/enums';
import { MementoHandler } from './handlers/memento.handler';

const PORT = process.env.PORT || 3001;

const httpServer = createServer((req, res) => {
  // Set the response content type to text/plain
  res.setHeader('Content-Type', 'text/plain');
  // Write "Hello, World!" to the response
  res.end('Hello, World!');
});
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const db = Database.Instance;
const reorderService = new ReorderService();
const reorderProxyService = new ReorderServiceProxy(reorderService);
const originator = new Originator(lists, db);
const caretaker = new Caretaker(originator);

if (process.env.NODE_ENV !== 'production') {
  db.setData(lists);
}

const onConnection = (socket: Socket): void => {
  new ListHandler(io, db, reorderService, reorderProxyService, originator, caretaker).handleConnection(socket);
  new CardHandler(io, db, reorderService, reorderProxyService, originator, caretaker).handleConnection(socket);
  new MementoHandler(caretaker, io, db).handleConnection(socket);
};

io.on('connection', onConnection);

httpServer.listen(PORT,'0.0.0.0', () => console.log('listening on port: ' + PORT));

export { httpServer };
