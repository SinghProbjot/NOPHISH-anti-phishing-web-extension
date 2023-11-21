import {Evaluator, EvaluatorInput} from '../Evaluator';
import {searchInPhishTankDb} from '../../data';
import {logD} from '../../misc';

export class PhishTankEvaluator implements Evaluator {
    async evaluate({url}: EvaluatorInput): Promise<number> {
        const urlFound = this.getUrl(url);

        logD(`PhishTankEvaluator: validate(): ${urlFound}`);

        return urlFound ? 0 : 100;
    }

    protected getUrl({origin}: URL) {
        return searchInPhishTankDb(origin);
    }
}
