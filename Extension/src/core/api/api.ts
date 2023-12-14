import axios from 'axios';
import {PhishTank, SafeBrowsing} from './types';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import {logD} from '../misc';

export const api = axios.create({
    adapter: fetchAdapter,
});

export async function getSecInfo(url: string) {
    const options = {
        method: 'GET',
        url: 'https://check-ssl.p.rapidapi.com/sslcheck',
        params: {
            domain: 'amazon.com',
        },
        headers: {
            'X-RapidAPI-Key': 'd356331eb0msh27f859c40c09f54p12f92djsne66cd4ec6f89',
            'X-RapidAPI-Host': 'check-ssl.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (e) {
        if (e instanceof URIError) throw e;

        console.error(e);
        throw e;
    }
}

export async function getScore(url: string, apiKey: string) {
    try {
        const {data} = await api.get(`https://www.ipqualityscore.com/api/json/url/${apiKey}/${encodeURI(url)}`);
        logD(data);
        return data.risk_score;
    } catch (e) {
        if (e instanceof URIError) throw e;

        console.error(e);
        throw e;
    }
}

export async function checkUrls(urls: string[], apiKey: string): Promise<SafeBrowsing.ResponseBody[]> {
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
        const {data} = await api.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
            requestBody,
        );
        return (data?.matches as SafeBrowsing.ResponseBody[]) ?? [];
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const getPhishTankDb = async () => {
    try {
        const {data} = await api.get<PhishTank.DbResponseBody[]>('http://data.phishtank.com/data/online-valid.json');
        return data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
