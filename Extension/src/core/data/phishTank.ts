import {getPhishTankDb} from '../api';
import {logD} from '../misc';
import {PhishTank} from '../api/types';
import {reputations} from '../../background';
let phishTankDb: PhishTank.DbResponseBody[] = [];

export const syncPhishTankDb = async () => {
    try {
        const today = new Date();
        chrome.storage.sync.get({lastUpdate: Date}, function (date) {
            if (date.lastUpdate == today) return;
            date.lastUpdate = today;
            chrome.storage.sync.set({lastUpdate: date.lastUpdate});
            logD('syncPhishTankDb() : updating date to today' + date.lastUpdate);
        });

        phishTankDb = await getPhishTankDb();
        for (let index = 0; index < phishTankDb.length; index++) {
            let rep = {
                url: phishTankDb.at(index)!.url.toString(),
                score: 0,
                userSafeMarked: false, //TODO finchè non viene aggiunta l'interfaccia grafica
            };
            reputations.addReputationAsync(rep);
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const searchInPhishTankDb = (url: string) => phishTankDb.find(item => item.url === url);
