import { IReorderService } from '../../common/types/proxyType';
import { List } from '../../data/models/list';
import { ReorderService } from '../../services/reorder.service';
import { logData, observer } from '../observer/observer';

export class ReorderServiceProxy implements IReorderService {
    private reorderService: ReorderService;

    constructor(reorderService: ReorderService) {
        this.reorderService = reorderService;
    }

    public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
        const result = this.reorderService.reorder(items, startIndex, endIndex);
        observer.log(logData, { action: 'Reorder list', items, startIndex, endIndex });

        return result;
    }

    public reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
    }: {
        lists: List[];
        sourceIndex: number;
        destinationIndex: number;
        sourceListId: string;
        destinationListId: string;
    }): List[] {
        const result = this.reorderService.reorderCards({
            lists,
            sourceIndex,
            destinationIndex,
            sourceListId,
            destinationListId });
        observer.log(logData, {
            action: 'Reorder cards', lists, sourceIndex, destinationIndex, sourceListId, destinationListId });

        return result;
    }
}