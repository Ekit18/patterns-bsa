/* eslint-disable no-console */
import { ConcreteMemento, Memento } from './memento';
import { Originator } from './originator';

export class Caretaker {
    private mementos: Memento[] = [];

    private redoMementos: Memento[] = [];

    private originator: Originator;

    constructor(originator: Originator) {
        this.originator = originator;
    }

    public backup(): void {
        this.mementos.push(this.originator.save());
        this.redoMementos = [];
    }

    public undo(): void {
        if (!this.mementos.length) {
            return;
        }
        const memento = this.mementos.pop();
        this.redoMementos.push(new ConcreteMemento(this.originator.getState()));

        this.originator.restore(memento);
    }

    public redo(): void {

        if (!this.redoMementos.length) {
            return;
        }
        const memento = this.redoMementos.pop();
        this.mementos.push(new ConcreteMemento(this.originator.getState()));
        this.originator.restore(memento);
    }

    public showHistory(): void {
        console.log('Caretaker: Here\'s the list of mementos:');
        for (const memento of this.mementos) {
            console.log(memento.getState());
        }
    }
}