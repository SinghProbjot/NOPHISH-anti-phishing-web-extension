import Browser from 'webextension-polyfill';
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
        //if (visits < 3) score = (score + 85) / 2;
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
    protected async getUrlVisitCount(Url: string) {
        /*const visits = await chrome.history.getVisits({
            url: url,
        });
        let visitCount = 0;
        for (const visit of visits) {
            if (visit.transition !== 'reload') {
                visitCount++;
            }
        }

        return visitCount;

        var histories = [];
        var visits = [];

        chrome.history.search({text: '', maxResults: 0}, function (historyItems) {
            var historiesProcessed = 0;
            for (var i = 0; i < historyItems.length; i++) {
                histories.push(historyItems[i]);
                chrome.history.getVisits({url: historyItems[i].url}, function (visitItems) {
                    for (var i = 0; i < visitItems.length; i++) {
                        visits.push(visitItems[i]);
                    }
                    historiesProcessed++;
                    if (historiesProcessed === historyItems.length) {
                        console.log(visits.length + ' visits');
                    }
                });
            }
            console.log(histories.length + ' histories');
        });*/
    }
}
