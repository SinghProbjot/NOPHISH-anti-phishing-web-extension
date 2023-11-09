import {Validator} from '../Validator';
import {searchInPhishTankDb} from '../../data';
import {logD} from '../../misc';

export class PhishTankValidator implements Validator {
    async validate(url: URL): Promise<boolean> {
        const urlFound = this.getUrl(url);

        logD(`PhishTankValidator: validate(): ${urlFound}`);

        return !urlFound;
    }

    getUrl({origin}: URL) {
        return searchInPhishTankDb(origin);
    }
}
