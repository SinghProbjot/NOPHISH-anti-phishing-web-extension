import {api} from '../api';
import {Validator} from './Validator';
import {SafeBrowsingValidator, IPQualityValidator, PhishTankValidator} from './impl';

export class ValidatorManager {
    private static instance?: ValidatorManager;
    readonly validators: Validator[];

    constructor(validators: Validator[]) {
        this.validators = validators;
    }

    static async init() {
        this.instance = new ValidatorManager([
            new PhishTankValidator(),
            new SafeBrowsingValidator('AIzaSyCGFq-OQDTuTN__iaigu0b7R-HyoGTeIsE', api),
            //new IPQualityValidator('VWs8ZZcEReDT4BbDPMgw5xejsbfdlTk8', api),
        ]);
    }

    static async validate(url: URL): Promise<boolean> {
        if (!this.instance) {
            throw new Error('ValidatorManager is not initializated.');
        }

        return this.instance?.validate(url);
    }

    async validate(url: URL): Promise<boolean> {
        for (const validator of this.validators) {
            const validated = await validator.validate(url);
            if (!validated) {
                return false;
            }
        }

        return true;
    }
}
