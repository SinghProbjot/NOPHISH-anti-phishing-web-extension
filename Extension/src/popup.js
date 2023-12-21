let currenturl, tab;
import {reputations} from './background.ts';
import {lastRequest} from './content.ts';
document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.getElementById('toggleBtn');
    var checkbox = document.getElementById('checkbox');
    // Check the initial state of the extension
    chrome.storage.sync.get({enabled: true}, function (data) {
        updateButton(data.enabled);
    });

    toggleBtn.addEventListener('click', function () {
        chrome.storage.sync.get({enabled: true}, function (data) {
            var newStatus = !data.enabled; // Reverse the status
            chrome.storage.sync.set({enabled: newStatus}, function () {
                updateButton(newStatus);
            });
        });
    });

    async function callback(tabs) {
        let currentTab = tabs[0]; // there will be only one in this array
        console.log(currentTab); // also has properties like currentTab.id
        if (!currentTab.url.startsWith('chrome-extension://')) {
            currenturl = currentTab.url;
            tab = currentTab.id;
            // TODO tutto ciò che dipende da questo link
            // ...
            let rep = await reputations.getReputationAsync(currenturl);
            if (rep.userSafeMarked) checkbox.checked = true;
        } else {
            currenturl = lastRequest;
            tab = currentTab.id;
        }
    }
    let query = {active: true, currentWindow: true};

    chrome.tabs.query(query, callback);
    checkbox.addEventListener('change', function () {
        const message = {
            type: 'safeMarked',
            payload: {
                url: currenturl,
                tabId: tab,
                primary: true, //uso primary per sapere se è stato checkato o no
            },
        };
        const message2 = {
            type: 'safeMarked',
            payload: {
                url: currenturl,
                tabId: tab,
                primary: false,
            },
        };
        if (checkbox.checked) chrome.runtime.sendMessage(message);
        else chrome.runtime.sendMessage(message2);
    });

    function updateButton(enabled) {
        toggleBtn.textContent = enabled ? 'Active' : 'Inactive'; // Update the text
        toggleBtn.className = enabled ? 'enabled' : 'disabled';
    }

    // Show the website counts
    chrome.storage.local.get({totalWebsiteCount: 0, dangerousWebsiteCount: 0}, function (data) {
        document.getElementById('totalWebsiteCount').textContent = `Total websites visited: ${data.totalWebsiteCount}`;
        document.getElementById(
            'dangerousWebsiteCount',
        ).textContent = `Dangerous requests blocked: ${data.dangerousWebsiteCount}`;
    });
});
