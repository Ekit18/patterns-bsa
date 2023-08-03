import { List } from '../../data/models/list';

export interface Memento {
    getState(): List[];

    getDate(): string;
}

export class ConcreteMemento implements Memento {
    private state: List[];

    private date: string;

    constructor(state: List[]) {
        this.state = state;
        this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    public getState(): List[] {
        return this.state;
    }

    public getDate(): string {
        return this.date;
    }
}