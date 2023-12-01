import {ReputationDataSource} from '../ReputationDataSource';
import {Reputation} from '../../types';
import {Database} from '../Database';

export class DbReputationDataSource implements ReputationDataSource {
    readonly db: Database;

    constructor() {
        this.db = new Database();
    }

    addReputation(rep: Reputation): void {
        this.addReputationAsync(rep);
    }

    getReputation(url: string): Reputation | null {
        throw new Error('Method not implemented.');
    }

    getReputationsByDistance(url: string, min: number, max: number): Reputation[] {
        throw new Error('Method not implemented.');
    }

    async addReputationAsync(rep: Reputation): Promise<void> {
        await this.db.reputations.put(rep);
    }

    async getReputationAsync(url: string): Promise<Reputation | null> {
        return (await this.db.reputations.where('url').equals(url).first()) ?? null;
    }

    async addBulk(rep: Reputation[]): Promise<void> {
        await this.db.reputations.bulkAdd(rep);
    }
}
