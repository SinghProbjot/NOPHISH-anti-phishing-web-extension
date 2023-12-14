import {AxiosInstance} from 'axios';
import {SafeBrowsing} from '../../api/types';
import {Evaluator, EvaluatorInput} from '../Evaluator';
import {logD} from '../../misc';

export class SafeBrowsingEvaluator implements Evaluator {
    readonly BASE_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
    readonly API_KEY: string;
    readonly apiInstance: AxiosInstance;

    constructor(apiKey: string, apiInstance: AxiosInstance) {
        this.API_KEY = apiKey;
        this.apiInstance = apiInstance;
    }

    async evaluate({url, isPrimary}: EvaluatorInput): Promise<number> {
        // TODO HANDLE ERRORS
        if (isPrimary) return -1;
        try {
            const dangerousUrls = await this.checkUrls([url.toString()]);

            logD(`SafeBrowsingValidator: validate(): ${dangerousUrls.length > 0 ? 'Danger' : 'Safe'}`);

            return dangerousUrls.length === 0 ? 100 : 0;
        } catch (error) {
            return -1;
        }
    }

    protected async checkUrls(urls: string[]) {
        const requestBody: SafeBrowsing.RequestBody = {
            client: {
                clientId: 'test-prob-anti-pishing-client-1-0-0',
                clientVersion: '1.0.0',
            },
            threatInfo: {
                threatTypes: [
                    'THREAT_TYPE_UNSPECIFIED',
                    'MALWARE',
                    'SOCIAL_ENGINEERING',
                    'UNWANTED_SOFTWARE',
                    'POTENTIALLY_HARMFUL_APPLICATION',
                ],
                platformTypes: [
                    'PLATFORM_TYPE_UNSPECIFIED',
                    'LINUX',
                    'CHROME',
                    'WINDOWS',
                    'ANDROID',
                    'IOS',
                    'OSX',
                    'ANY_PLATFORM',
                ],
                threatEntryTypes: ['URL'],
                threatEntries: urls.map(url => ({
                    url,
                })),
            },
        };

        try {
            const {data} = await this.apiInstance.post(`${this.BASE_URL}?key=${this.API_KEY}`, requestBody);
            return (data?.matches as SafeBrowsing.ResponseBody[]) ?? [];
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
