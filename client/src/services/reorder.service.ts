import type { DraggableLocation } from '@hello-pangea/dnd';

import { Card, List } from '../common/types';

export const reorderLists = (
  items: List[],
  startIndex: number,
  endIndex: number,
): List[] => {
  return reorderItems(items, startIndex, endIndex);
};

export const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation,
): List[] => {
  const { droppableId: sourceId, index: sourceIndex } = source;
  const { droppableId: destinationId, index: destinationIndex } = destination;

  const current: Card[] =
    lists.find((list) => list.id === sourceId)?.cards || [];
  const next: Card[] =
    lists.find((list) => list.id === destinationId)?.cards || [];
  const target: Card = current[sourceIndex];

  const isMovingInSameList = sourceId === destinationId;

  if (isMovingInSameList) {
    const reordered = reorderItems(current, sourceIndex, destinationIndex);

    return lists.map((list) =>
      list.id === sourceId ? { ...list, cards: reordered } : list,
    );
  }

  const updatedSource = removeItem(current, sourceIndex);
  const updatedDestination = insertItem(next, destinationIndex, target);

  return lists.map((list) => {
    switch (list.id) {
      case sourceId:
        return { ...list, id: sourceId, cards: updatedSource };
      case destinationId:
        return { ...list, id: destinationId, cards: updatedDestination };
      default:
        return list;
    }
  });
};

export const removeItem = <T>(array: T[], index: number): T[] =>
  array.slice(0, index).concat(array.slice(index + 1));

export const insertItem = <T>(array: T[], index: number, item: T): T[] =>
  array.slice(0, index).concat(item).concat(array.slice(index));

export const reorderItems = <T>(
  array: T[],
  startIndex: number,
  endIndex: number,
): T[] =>
  [...array].splice(endIndex, 0, array.slice(startIndex, 1)[0]) && array;