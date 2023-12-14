import {AxiosInstance} from 'axios';
import {IPQuality} from '../../api/types';
import {Evaluator, EvaluatorInput} from '../Evaluator';
import {logD} from '../../misc';

export class IPQualityEvaluator implements Evaluator {
    readonly BASE_URL = 'https://www.ipqualityscore.com/api';
    readonly API_KEY: string;
    readonly apiInstance: AxiosInstance;

    constructor(apiKey: string, apiInstance: AxiosInstance) {
        this.API_KEY = apiKey;
        this.apiInstance = apiInstance;
    }

    async evaluate({url, isPrimary}: EvaluatorInput): Promise<number> {
        if (!isPrimary) {
            return -1;
        }

        // TODO HANDLE ERRORS
        const riskScore = await this.checkUrl(url);

        logD(`IPQualityValidator: validate(): ${riskScore}`);

        return 100 - riskScore;
    }
    async getData({url}: EvaluatorInput) {
        try {
            const {data} = await this.apiInstance.get<IPQuality.ResponseBody>(
                `${this.BASE_URL}/json/url/${this.API_KEY}/${encodeURI(url.hostname)}`,
            );
            return data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    protected async checkUrl(url: URL) {
        try {
            const {data} = await this.apiInstance.get<IPQuality.ResponseBody>(
                `${this.BASE_URL}/json/url/${this.API_KEY}/${encodeURI(url.hostname)}`,
            );
            return data.risk_score;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
