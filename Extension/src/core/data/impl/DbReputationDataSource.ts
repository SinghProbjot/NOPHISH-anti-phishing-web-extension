import {ReputationDataSource} from '../ReputationDataSource';
import {Reputation} from '../../types';

export class DbReputationDataSource implements ReputationDataSource {
    readonly db: any;

    constructor() {
        this.db = {};
    }

    addReputation(rep: Reputation): void {
        throw new Error('Method not implemented.');
    }

    getReputation(url: string): Reputation | null {
        throw new Error('Method not implemented.');
    }

    getReputationsByDistance(url: string, min: number, max: number): Reputation[] {
        throw new Error('Method not implemented.');
    }

    async addReputationAsync(rep: Reputation): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async getReputationAsync(url: string): Promise<Reputation | null> {
        throw new Error('Method not implemented.');
    }
}
