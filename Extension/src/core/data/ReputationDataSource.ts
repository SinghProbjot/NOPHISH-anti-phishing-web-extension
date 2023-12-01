import {Reputation} from '../types';

export interface ReputationDataSource {
    addReputation(rep: Reputation): void;

    getReputation(url: string): Reputation | null;

    getReputationsByDistance(url: string, min: number, max: number): Reputation[];

    addReputationAsync(rep: Reputation): Promise<void>;

    getReputationAsync(url: string): Promise<Reputation | null>;
    addBulk(rep: Reputation[]): Promise<void>;
}
