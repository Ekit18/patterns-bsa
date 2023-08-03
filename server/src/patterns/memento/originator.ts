/* eslint-disable prefer-spread */
import { Database } from '../../data/database';
import { List } from '../../data/models/list';
import { ConcreteMemento, Memento } from './memento';

export class Originator {
    private state: List[];

    private db: Database;

    constructor(state: List[], db: Database) {
        this.state = state.map((list) => list.deepCopy());
        this.db = db;
    }

    public preserveData(state: List[]): void {
        this.state = state.map((list) => list.deepCopy());
    }

    public save(): Memento {
        return new ConcreteMemento(this.state);
    }

    public restore(memento: Memento): void {
        this.state = memento.getState();
        this.db.setData(memento.getState().map((list) => list.deepCopy()));
    }

    public getState() {
        return this.state;
    }
}
