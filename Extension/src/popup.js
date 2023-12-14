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

    checkbox.addEventListener('change', function () {
        var currentUrl;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            currentUrl = tabs.active.url;
        });
        const message = {
            type: 'safeMarked',
            payload: {
                url: currentUrl,
                primary: true, //uso primary per sapere se è stato checkato o no
            },
        };
        const message2 = {
            type: 'safeMarked',
            payload: {
                url: currentUrl,
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
