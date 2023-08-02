/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { ISubscriber } from '../../common/types/observerType';
import * as  fs from 'fs';

export class Publisher {
    private observers: ISubscriber[] = [];

    subscribe(observer: ISubscriber): void {
        this.observers.push(observer);
    }

    unsubscribe(deletedSubscriber: ISubscriber): void {
        this.observers = this.observers.filter((subscriber) => subscriber !== deletedSubscriber);
    }

    log(observer: ISubscriber, data: any): void {
        observer.notify(data);
    }
}

export const observer = new Publisher();

export const logData: ISubscriber = {
    notify: (data) => {
        fs.appendFileSync('./logs.txt', `${JSON.stringify(data)}\n`);
    },
};

export const errorData: ISubscriber = {
    notify: (data) => {
        console.log(data);
    },
};

observer.subscribe(logData);
observer.subscribe(errorData);