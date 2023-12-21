import Browser from 'webextension-polyfill';
import {logD, Message, Reputation} from './core';
import {api, getSecInfo} from './core/api';
import {ReputationDataSource, syncPhishTankDb} from './core/data';
import {LocalReputationDataSource, DbReputationDataSource} from './core/data/impl';
import {ValidatorManager} from './core/validator/ValidatorManager';
import {PhishTankValidator, SafeBrowsingValidator} from './core/validator/impl';
import {parse} from 'csv-parse/lib/sync';
import {Evaluator, EvaluatorCompound} from './core/evaluator';
import {
    IPQualityEvaluator,
    PhishTankEvaluator,
    SafeBrowsingEvaluator,
    syntacticCheckEvaluator,
} from './core/evaluator/impl';


export const reputations: ReputationDataSource = new DbReputationDataSource();
const validator = new ValidatorManager([
    new PhishTankValidator(),
    new SafeBrowsingValidator('AIzaSyCGFq-OQDTuTN__iaigu0b7R-HyoGTeIsE', api),
    //new IPQualityValidator('VWs8ZZcEReDT4BbDPMgw5xejsbfdlTk8', api),
]);
const evaluator: Evaluator = new EvaluatorCompound([
    //new PhishTankEvaluator(),
    new SafeBrowsingEvaluator('AIzaSyCGFq-OQDTuTN__iaigu0b7R-HyoGTeIsE', api),
    new IPQualityEvaluator('VWs8ZZcEReDT4BbDPMgw5xejsbfdlTk8', api),
    new syntacticCheckEvaluator(),
]);

/**
 * Se utente ha markato questo host come affidabile oppure score positivo (>80), torna true altrimenti false.
 * @param rep
 * @returns
 */
const isUrlSafe = (rep: Reputation) => rep.userSafeMarked || rep.score > 85;

const checkUrl = async (url: URL, isPrimary: boolean) => {
    const origin = url.toString();

    let rep = await reputations.getReputationAsync(origin);
    if (!rep) {
        //se non esiste già una reputazione
        try {
            const score = await evaluator.evaluate({url, isPrimary});
            rep = {
                url: origin,
                score,
                userSafeMarked: false, //TODO finchè non viene aggiunta l'interfaccia grafica
            };
            reputations.addReputation(rep);
            console.log('New host', origin, `Score: ${rep.score}`);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    // certificate check test
    if (isPrimary) {
        // getSecInfo(rep.url);
        //confronto certificato con blacklist
        //    https://sslbl.abuse.ch/blacklist/sslblacklist.csv
        // se è pericoloso, metto rep.score = 0 cosicchè venga generato il warning
    }

    return isUrlSafe(rep);
    // Browser.tabs.sendMessage(request.tabId, message).catch(console.error);
};
/*
let adblockRuleID = 2; // give any id to identify the rule but must be greater than 1
const blockRequest = (url: string) => {
    //blocco la richiesta se non è safe
    chrome.declarativeNetRequest.updateDynamicRules(
        {
            addRules: [
                {
                    priority: 1,
                    action: {
                        type: chrome.declarativeNetRequest.RuleActionType.BLOCK,
                    },
                    condition: {
                        urlFilter: url, // block URLs that starts with this
                    },
                    id: adblockRuleID,
                },
            ],
            removeRuleIds: [adblockRuleID], // this removes old rule if any
        },
        () => {
            console.log('block rule added');
        },
    );
    adblockRuleID++;
};*/

const reduceHost = (host: string): string => {
    if (host.startsWith('www.')) {
        host = host.substring(4);
    }
    if (host.endsWith('.co.uk')) {
        const tmpHost = host.substring(0, host.length - 6);

        host = host.substring(tmpHost.lastIndexOf('.') + 1);
    } else if (host.endsWith('.com')) {
        const tmpHost = host.substring(0, host.length - 4);

        host = host.substring(tmpHost.lastIndexOf('.') + 1);
    } else if (host.endsWith('.it')) {
        const tmpHost = host.substring(0, host.length - 3);

        host = host.substring(tmpHost.lastIndexOf('.') + 1);
    }

    return host;
};

Browser.runtime.onInstalled.addListener(async ({reason}) => {
    logD(`SW: onInstalled() - reason: ${reason}`);
    // const manifest = Browser.runtime.getManifest();
    // const contentScripts = manifest.content_scripts;
    // if (!contentScripts) return;
    // for (const cs of contentScripts) {
    //     for (const tab of await Browser.tabs.query({url: cs.matches})) {
    //         if (!cs.js) continue;
    //         Browser.scripting.executeScript({
    //             target: {tabId: tab.id ?? Browser.tabs.TAB_ID_NONE},
    //             files: cs.js,
    //         });
    //     }
    // }

    const csvUrl = new URL('./assets/top500Domains.csv', import.meta.url).toString();

    const csvString = await (await fetch(csvUrl)).text();
    const records = parse(csvString, {columns: true});
    for (const {domain: url, score} of records) {
        reputations.addReputationAsync({
            url,
            score,
            userSafeMarked: false,
        });
    }
    chrome.storage.sync.set({enabled: true}, function () {
        console.log('The extension is enabled.');
    });
    const yesterday = new Date().getDate() - 1; //prima volta setto a ieri, cosi posso sincronizzare
    chrome.storage.sync.set({lastUpdate: yesterday}, function () {
        console.log('updating phishtank');
    });
    syncPhishTankDb();
});

Browser.webRequest.onBeforeSendHeaders.addListener(
    details => {
        logD('SW: onBeforeSendHeaders()');
        const requestHeaders = details.requestHeaders;
        // console.log('Request Headers: ', requestHeaders);
    },
    {urls: ['<all_urls>']},
    ['requestHeaders'],
);
let isEnabled = true;
let saf = true;
let notSafeTab = 0;
chrome.storage.sync.get({enabled: true}, function (data) {
    if (!data.enabled) {
        isEnabled = false;
    }
});



Browser.webRequest.onBeforeRequest.addListener(
    async request => {
        logD('SW: onBeforeRequest()');
        const url = new URL(request.url);
        const safe = await checkUrl(url, false);
        if (!safe) {
            //alert('This website is dangerous!');
            saf = false;
            notSafeTab = request.tabId;
            chrome.storage.local.get({dangerousWebsiteCount: 0}, function (data) {
                data.dangerousWebsiteCount++;
                chrome.storage.local.set({dangerousWebsiteCount: data.dangerousWebsiteCount});
            });
            chrome.tabs.update(request.tabId, {url: new URL('./warn.html', import.meta.url).toString()});
        }

        return {cancel: !safe};
        //return {redirectUrl: 'http://www.google.com/'};
    },
    {
        urls: ['<all_urls>'],
    },
    ['blocking'],
);
Browser.webRequest.onCompleted.addListener(
    request => {
        if (!saf) chrome.tabs.update(request.tabId, {url: new URL('./warn.html', import.meta.url).toString()});
        saf = true;
        return;
    },
    {
        urls: ['<all_urls>'],
    },
);
// Browser.webNavigation.onBeforeNavigate.addListener(details => {
//     const url = new URL(details.url);
//     const rep = reputations.getReputation(url.origin);
//     // Se l'url non è sicuro o sconosciuto.
//     if (!rep || !isUrlSafe(rep)) {
//         const safeNearReputations = reputations
//             .getReputationsByDistance(url.origin, 1, 2)
//             .filter(rep => isUrlSafe(rep))
//             .sort(rep => rep.score);

//         // TODO mostra all'utente una lista di url simili e sicuri
//     }
// });
function isIP(url: string): boolean {
    let reg =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (reg.exec(url) == null) {
        return false;
    } else {
        console.log('IP ADDRESS!');
        return true;
    }
}

Browser.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
    let isSafe;
    switch (message.type) {
        case 'check-url':
            logD(`SW: onMessage() - type: check-url - url: ${message.payload.url}.`);
            if (message.payload.primary || isIP(message.payload.url.substring(8))) {
                logD('SW: onMessage() ===> PRIMARY. CHECKING URL');
                isSafe = checkUrl(new URL(message.payload.url), true);
            } else {
                isSafe = checkUrl(new URL(message.payload.url), false); //controllo dell'url
            }
            if (!isSafe) {
                // notifica utente
                alert('This website is dangerous!');
                return {redirect: new URL('./warn.html', import.meta.url).toString()};
                // Browser.notifications.create(undefined, {
                //     type: 'basic',
                //     iconUrl: new URL('./assets/iconr.png', import.meta.url).toString(), //Browser.runtime.getURL('iconr.png'),
                //     title: 'Safety Notification',
                //     message: 'content',
                // });
            } else {
                console.log('safe url.');
            }

            break;
        case 'safeMarked':
            console.log('INTO THE SWITCH SAFEMARKED');

            // var currentUrl, tab;
            // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            //     // currentUrl = tabs.active.url;
            //     var current = tabs[0];
            //     currentUrl = current.url;
            //     tab = current.id;
            // });

            // message.payload.url != currentUrl;
            // message.payload.tabId != tab;

            console.log('CURRENT TAB URL:  ------------_-------------->>>' + message.payload.url);

            let toUpdate = await reputations.getReputationAsync(message.payload.url);
            if (toUpdate) {
                if (message.payload.primary) {
                    toUpdate.userSafeMarked = true;
                    console.log(
                        'ADDING MODIFIED REP: ' + toUpdate.url + '=> now safeMarked:  ' + toUpdate.userSafeMarked,
                    );
                    reputations.addReputation(toUpdate);
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        chrome.tabs.reload(message.payload.tabId);
                    });
                } else {
                    toUpdate.userSafeMarked = false;
                    console.log(
                        'ADDING MODIFIED REP: ' +
                            toUpdate +
                            toUpdate.url +
                            '=> now safeMarked:  ' +
                            toUpdate.userSafeMarked,
                    );
                    reputations.addReputation(toUpdate);
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        chrome.tabs.reload(message.payload.tabId);
                    });
                }
            } else logD('url not found in db.');

            break;
        default:
            logD(`SW: onMessage() - msg received: ${message}.`);
            break;
    }
});
