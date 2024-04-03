// Initialize or retrieve the extension's enabled state
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('isEnabled', function(data) {
        if (data.isEnabled === undefined) {
            chrome.storage.sync.set({'isEnabled': true}); // Default to enabled
        }
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.storage.sync.get('isEnabled', function(data) {
        if (data.isEnabled) {
            if ((tab.url.includes("https://ks2.rsmu.ru/tests2/questions") || tab.url.includes("https://ks2.rsmu.ru/performance/rating/current_rating")) && changeInfo.status === "complete") {
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ['content.js']
                });
            }
        }
    });
});

// Listen for messages from the popup to toggle the extension state
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "toggleExtension") {
        chrome.storage.sync.set({'isEnabled': request.state}, function() {
            sendResponse({result: "success", state: request.state});
        });
        return true; // Indicates response will be sent asynchronously
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "reloadPage") {
        chrome.tabs.reload(sender.tab.id);
    }
});