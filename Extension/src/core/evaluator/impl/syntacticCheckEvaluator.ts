import Browser from 'webextension-polyfill';
import {Evaluator, EvaluatorInput} from '../Evaluator';
//const punycode = require('punycode/');
import {encode, toUnicode} from 'punycode';
import {logD} from '../../misc';
export class syntacticCheckEvaluator implements Evaluator {
    async evaluate({url}: EvaluatorInput): Promise<number> {
        let score = 0;
        const encoded = toUnicode(url.toString());
        //se sono diversi non va bene
        //let visits = await this.getUrlVisitCount(url.toString());

        console.log('url restricted: ' + url.origin.toString().substring(8));
        //let response = await a.getData({url, isPrimary: true});

        if (encoded != url.toString()) {
            console.log('punycode!');
            score = 0;
        } else score = 100;

        //if (visits < 3) score = (score + 85) / 2;
        logD(`SyntaxValidator: evaluate(): score ==> ` + score);
        return score;
    }
    protected isIP(url: string): boolean {
        let reg =
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (reg.exec(url) == null) {
            return false;
        } else {
            console.log('IP ADDRESS!');
            return true;
        }
    }
    //quanto un url è visitato
    protected async getUrlVisitCount(Url: string) {
        let visitCount = 0;
        chrome.history.getVisits({url: Url}, function (visit) {
            visit.forEach(element => {
                if (element.transition !== 'reload') {
                    visitCount++;
                }
            });
        });
        console.log('TOTAL VISITS:     ' + visitCount);
        // const visits = await chrome.history.getVisits({url: Url}, function ());
        // let visitCount = 0;
        // for (const visit of visits) {
        //     if (visit.transition !== 'reload') {
        //         visitCount++;
        //     }
        // }

        return visitCount;

        // var histories = [];
        // var visitss = [];

        // chrome.history.search({text: '', maxResults: 0}, function (historyItems) {
        //     var historiesProcessed = 0;
        //     for (var i = 0; i < historyItems.length; i++) {
        //         histories.push(historyItems[i]);
        //         chrome.history.getVisits({url: historyItems[i].url}, function (visitItems) {
        //             for (var i = 0; i < visitItems.length; i++) {
        //                 visits.push(visitItems[i]);
        //             }
        //             historiesProcessed++;
        //             if (historiesProcessed === historyItems.length) {
        //                 console.log(visits.length + ' visits');
        //             }
        //         });
        //     }
        //     console.log(histories.length + ' histories');
        // });
    }
}
