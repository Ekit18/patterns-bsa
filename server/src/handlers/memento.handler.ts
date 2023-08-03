import type { Server, Socket } from 'socket.io';
import { MementoEvent } from '../common/enums/memento.enums';
import { Caretaker } from '../patterns/memento/caretaker';
import { ListEvent } from '../common/enums';
import { Database } from '../data/database';

export class MementoHandler {

    public constructor(public caretaker: Caretaker, private io: Server, private db: Database) {
    }

    public handleConnection(socket: Socket): void {
        socket.on(MementoEvent.UNDO, this.undo.bind(this));
        socket.on(MementoEvent.REDO, this.redo.bind(this));
    }
    // PATTERN:Observer 

    private undo() {
        this.caretaker.undo();
        this.updateLists();
    }

    private redo() {
        this.caretaker.redo();
        this.updateLists();
    }

    private updateLists(): void {
        this.io.emit(ListEvent.UPDATE, this.db.getData());
    }
}
