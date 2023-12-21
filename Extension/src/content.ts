import {logD, logE, Message} from './core';
import Browser from 'webextension-polyfill';

export var lastRequest: URL;

logD('Extension content script loaded.');
chrome.storage.sync.get({enabled: true}, function (data) {
    if (data.enabled) {
        run();
    }
});

function run() {
    window.addEventListener('beforeunload', () => {
        lastRequest = new URL(window.location.href);
        logD('window: beforeunload() -> url: ' + lastRequest.href);
    });

    window.addEventListener('load', () => {
        logD('Window loaded: ' + window.location.hostname);
        if (
            window.location.hostname.startsWith('localhost') ||
            window.location.hostname.startsWith('chrome://') ||
            window.location.hostname.startsWith('https://chrome://') ||
            window.location.hostname.startsWith('chrome-extension://')
        )
            return;
        const message: Message = {
            type: 'check-url',
            payload: {
                url: window.location.origin,
                primary: true,
            },
        };

        logD('Window loaded: Sending main site name ==>' + window.location.origin);
        Browser.runtime.sendMessage(message);

        const received: string[] = checkPage(); //check all hrefs
        received.forEach(element => {
            const message: Message = {
                type: 'check-url',
                payload: {
                    url: element,
                    primary: false,
                },
            };
            Browser.runtime.sendMessage(message);
        });
        // Increase the total website count
        chrome.storage.local.get({totalWebsiteCount: 0}, function (data) {
            data.totalWebsiteCount++;
            chrome.storage.local.set({totalWebsiteCount: data.totalWebsiteCount});
        });
    });
}
/*
Browser.runtime.onMessage.addListener((message: Boolean, sender, sendResponse) => {
    let content = ' ';
    Logi(message);
    console.log('message received....');
    if (message) content = 'website is safe.';
    else content = 'WEBSITE IS NOT SAFE.';

    let CAKE_INTERVAL = 0.1;

    browser.alarms.create('', {periodInMinutes: CAKE_INTERVAL});

    browser.alarms.onAlarm.addListener(alarm => {
        browser.notifications.create('id', {
            type: 'basic',
            iconUrl: browser.runtime.getURL('iconr.png'),
            title: 'Safety Notification',
            message: 'content',
        });
    });
});
*/

/**
 * Controllo di tutti gli url presenti nella pagina, ogni link trovato viene inviato come
 * messaggio al service worker, che ne valuta la sicurezza.
 */
function checkPage(): string[] {
    const links: string[] = [];
    const anchors = document.querySelectorAll('a');
    for (const anchor of anchors) {
        const href = anchor.getAttribute('href') ?? '';
        try {
            new URL(href);
            links.push(href);
        } catch (error) {
            logE(error);
        }
    }
    //links.splice(0, 1);
    console.log('lINK TROVATI: ', links);
    return links;
    //Browser.runtime.sendMessage( {links})
}

//document.getElementsByTagName('body')[0].innerHTML = ' IT WORKS!';

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            // TODO
            if (mutation.addedNodes.length < 1) {
                return;
            }
            logD('A child node has been added.');
            mutation.addedNodes.forEach(node => {
                // TODO
                logD(node.nodeType);
            });
        } else if (mutation.type === 'attributes') {
            console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
    }
});

// Start observing the target node for configured mutations
/*observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
});*/
