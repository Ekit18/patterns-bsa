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
   // PATTERN:Observer 

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    try {
      const lists = this.db.getData();
      const reorderedLists = this.reorderService.reorder(
        lists,
        sourceIndex,
        destinationIndex,
      );
      this.db.setData(reorderedLists);
      this.updateLists();
      const date = new Date().toISOString();
      observer.notifySubscribers(logData, { action: 'Reorder lists', sourceIndex, destinationIndex, date });
    } catch (error) {
      observer.notifySubscribers(errorData, error);
    }
  }
   // PATTERN:Observer 

  private createList(name: string): void {
    try {
      const lists = this.db.getData();
      const newList = new List(name);
      this.db.setData(lists.concat(newList));
      this.updateLists();
      const date = new Date().toISOString();
      observer.notifySubscribers(logData, { action: 'Create list', name, date });
    } catch (error) {
      observer.notifySubscribers(errorData, error);
    }
  }
   // PATTERN:Observer 

  private deleteList(listId: string): void {
    try {
      this.db.deleteList(listId);
      this.updateLists();
      const date = new Date().toISOString();
      observer.notifySubscribers(logData, { action: 'Delete list', listId, date });
    } catch (error) {
      observer.notifySubscribers(errorData, error);
    }

  }
   // PATTERN:Observer 

  private renameList({ listId, newListName }: IRenameList): void {
    try {
      const lists = this.db.getData();
      const updatedList = lists.find((list) => list.id === listId);
      updatedList.setName(newListName);
      this.updateLists();
      const date = new Date().toISOString();
      observer.notifySubscribers(logData, { action: 'Rename list', listId, newListName, date });
    } catch (error) {
      observer.notifySubscribers(errorData, error);
    }
  }
}
