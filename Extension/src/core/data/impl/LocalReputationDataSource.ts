import {ReputationDataSource} from '../ReputationDataSource';
import {Reputation} from '../../types';
import {levenshteinDistance} from '../../misc';

export class LocalReputationDataSource implements ReputationDataSource {
    private readonly reputations: Reputation[];

    constructor() {
        this.reputations = [];
    }

    getReputation(url: string): Reputation | null {
        return this.reputations.find(rep => rep.host === url) ?? null;
    }

    getReputationsByDistance(url: string, min: number, max: number): Reputation[] {
        const reputations: Reputation[] = [];

        for (let reputation of this.reputations) {
            const distance = levenshteinDistance(url, reputation.host);
            if (distance >= min && distance <= max) {
                reputations.push(reputation);
            }
        }

        return reputations;
    }

    addReputation(rep: Reputation) {
        if (this.getReputation(rep.host)) return;

        this.reputations.push(rep);
    }

    async addReputationAsync(rep: Reputation) {
        this.addReputation(rep);
    }

    async getReputationAsync(url: string) {
        return this.getReputation(url);
    }
}
