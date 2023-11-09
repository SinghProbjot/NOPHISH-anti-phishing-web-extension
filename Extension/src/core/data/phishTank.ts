import {getPhishTankDb} from '../api';
import {logD} from '../misc';
import {PhishTank} from '../api/types';

let phishTankDb: PhishTank.DbResponseBody[] = [];

export const syncPhishTankDb = async () => {
    try {
        logD('syncPhishTankDb()');
        //phishTankDb = await getPhishTankDb();
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const searchInPhishTankDb = (url: string) => phishTankDb.find(item => item.url === url);
