import type { Socket } from 'socket.io';

import { ListEvent } from '../common/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { IRenameList } from '../common/types/listType';
import { errorData, logData, observer } from '../patterns/observer/observer';

export class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  // PATTERN:Proxy, Memento mori

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    this.caretaker.backup();
    const lists = this.db.getData();
    const reorderedLists = this.reorderProxyService.reorder(
      lists,
      sourceIndex,
      destinationIndex,
    );
    this.db.setData(reorderedLists);
    this.originator.preserveData(this.db.getData());
    this.updateLists();
  }
  // PATTERN:Observer, Memento mori

  private createList(name: string): void {
    try {
      this.caretaker.backup();
      const lists = this.db.getData();
      const newList = new List(name);
      this.db.setData(lists.concat(newList));
      this.updateLists();
      this.originator.preserveData(this.db.getData());
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Create list', name, date });
    } catch (error) {
      observer.log(errorData, error);
    }
  }
  // PATTERN:Observer, Memento mori

  private deleteList(listId: string): void {
    try {
      this.caretaker.backup();
      this.db.deleteList(listId);
      this.updateLists();
      this.originator.preserveData(this.db.getData());
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Delete list', listId, date });
    } catch (error) {
      observer.log(errorData, error);
    }

  }
  // PATTERN:Observer, Memento mori

  private renameList({ listId, newListName }: IRenameList): void {
    try {
      this.caretaker.backup();
      const lists = this.db.getData();
      const updatedList = lists.find((list) => list.id === listId);
      updatedList.setName(newListName);
      this.updateLists();
      this.originator.preserveData(this.db.getData());
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Rename list', listId, newListName, date });
    } catch (error) {
      observer.log(errorData, error);
    }
  }
}
