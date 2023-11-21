import {Evaluator, EvaluatorInput} from '../Evaluator';
//const punycode = require('punycode/');
import {encode, toUnicode} from 'punycode';

export class syntacticCheckEvaluator implements Evaluator {
    async evaluate({url}: EvaluatorInput): Promise<number> {
        let score = 0;
        const encoded = toUnicode(url.toString());
        //se sono diversi non va bene
        //let visits = await this.getUrlVisitCount(url.toString());
        if (encoded != url.toString() || this.isIP(url.toString())) score = 0;
        else score = 100;
        // if (visits < 3) score = (score + 70) / 2;
        return score;
    }

    protected isIP(url: string): boolean {
        let reg = /\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}/;
        if (reg.exec(url) == null) {
            return false;
        } else {
            return true;
        }
    }
    //quanto un url è visitato
    protected async getUrlVisitCount(url: string) {
        const visits = await chrome.history.getVisits({url});
        let visitCount = 0;
        for (const visit of visits) {
            if (visit.transition !== 'reload') {
                visitCount++;
            }
        }

        return visitCount;
    }
}
