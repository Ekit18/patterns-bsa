import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import { IReorderCards } from '../common/types/cardType';
import { List } from '../data/models/list';
import { errorData, logData, observer } from '../patterns/observer/observer';

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.changeTitle.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.DUPLICATED_CARD, this.duplicateCard.bind(this));
  }
  // PATTERN:Observer, Memento mori

  public createCard(listId: string, cardName: string): void {
    try {
      this.caretaker.backup();
      const lists = this.db.getData();
      const newCard = new Card(cardName, '');

      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(newCard)) : list,
      );

      this.db.setData(updatedLists);
      this.originator.preserveData(this.db.getData());
      this.updateLists();
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Delete card', listId, cardName, date });
    } catch (error) {
      observer.log(errorData, error);
    }
  }
  // PATTERN:Proxy, Memento mori

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: IReorderCards): void {
    this.caretaker.backup();
    const lists = this.db.getData();
    const reordered = this.reorderProxyService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });

    this.db.setData(reordered);
    this.originator.preserveData(this.db.getData());
    this.updateLists();
  }
  // PATTERN:Observer, Memento mori

  private deleteCard(listId: string, cardId: string) {
    try {
      this.caretaker.backup();
      const lists = this.db.getData();
      const updatedList = lists.find((list) => list.id === listId);
      const updatedCards = updatedList.cards.filter((card) => card.id !== cardId);
      updatedList.setCards(updatedCards);
      const updatedLists = lists.map((list) => list.id === listId ? updatedList : list);
      this.db.setData(updatedLists);
      this.originator.preserveData(this.db.getData());
      this.updateLists();
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Delete card', listId, cardId, date });
    } catch (error) {
      observer.log(errorData, error);
    }

  }
  // PATTERN:Observer, Memento mori 

  private changeTitle(title: string, listId: string, cardId: string) {
    try {
      this.caretaker.backup();
      const lists = this.db.getData();
      const updatedList: List = lists.find((list) => list.id === listId);
      const updatedCard = updatedList.cards.find((card) => card.id === cardId);
      updatedCard.setName(title);
      this.updateLists();
      this.originator.preserveData(this.db.getData());
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Change card title', listId, cardId, title, date });
    } catch (error) {
      observer.log(errorData, error);
    }

  }
  // PATTERN:Observer, Memento mori 

  private changeDescription(description: string, listId: string, cardId: string) {
    try {
      this.caretaker.backup();
      const lists = this.db.getData();
      const updatedList: List = lists.find((list) => list.id === listId);
      const updatedCard = updatedList.cards.find((card) => card.id === cardId);
      updatedCard.setDescription(description);
      this.updateLists();
      this.originator.preserveData(this.db.getData());
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Change card description', listId, cardId, description, date });
    } catch (error) {
      observer.log(errorData, error);
    }

  }
  // PATTERN:Prototype, Observer, Memento mori

  private duplicateCard(listId: string, cardId: string) {
    try {
      this.caretaker.backup();
      const lists = this.db.getData();
      const updatedList = lists.find((list) => list.id === listId);
      const card = updatedList.cards.find((card) => card.id === cardId);
      const duplicatedCard = card.produceCard();
      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(duplicatedCard)) : list,
      );

      this.db.setData(updatedLists);
      this.originator.preserveData(this.db.getData());
      this.updateLists();
      const date = new Date().toISOString();
      observer.log(logData, { action: 'Duplicate card', listId, cardId, date });
    } catch (error) {
      observer.log(errorData, error);
    }
  }
}
