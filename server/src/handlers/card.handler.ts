import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import { IReorderCards } from '../common/types/cardType';
import { List } from '../data/models/list';

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.changeTitle.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.DUPLICATED_CARD, this.duplicateCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, '');
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list,
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: IReorderCards): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }

  private deleteCard(listId: string, cardId: string) {
    const lists = this.db.getData();
    const updatedList = lists.find((list) => list.id === listId);
    const updatedCards = updatedList.cards.filter((card) => card.id !== cardId);
    updatedList.setCards(updatedCards);
    const updatedLists = lists.map((list) => list.id === listId ? updatedList : list);
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private changeTitle(title: string, listId: string, cardId: string) {
    const lists = this.db.getData();
    const updatedList: List = lists.find((list) => list.id === listId);
    const updatedCard = updatedList.cards.find((card)=>card.id===cardId);
    updatedCard.setName(title);
    this.updateLists();
  }

  private changeDescription(description: string, listId: string, cardId: string) {
    const lists = this.db.getData();
    const updatedList: List = lists.find((list) => list.id === listId);
    const updatedCard = updatedList.cards.find((card)=>card.id===cardId);
    updatedCard.setDescription(description);
    this.updateLists();
  }
// PATTERN:Prototype

  private duplicateCard(listId: string, cardId: string) {
    const lists = this.db.getData();
    const updatedList = lists.find((list) => list.id === listId);
    const card = updatedList.cards.find((card) => card.id === cardId);
    const duplicatedCard = card.produceCard();
    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(duplicatedCard)) : list,
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }
}
