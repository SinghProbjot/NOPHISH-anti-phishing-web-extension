import Dexie from 'dexie';
import {Reputation} from '../types';

export class Database extends Dexie {
    reputations!: Dexie.Table<Reputation, string>;

    constructor() {
        super('reputationsDB');

        this.version(1).stores({
            reputations: 'url, score, mark',
        });
    }
}
