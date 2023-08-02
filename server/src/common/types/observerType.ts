/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISubscriber {
    notify(data: object): void;
}