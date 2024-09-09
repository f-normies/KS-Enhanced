document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveSettings');
    const semesterStartInput = document.getElementById('semesterStart');

    chrome.storage.sync.get(['semesterStartDate'], function(data) {
        if (data.semesterStartDate) {
            semesterStartInput.value = data.semesterStartDate;
        }
    });

    saveButton.addEventListener('click', function() {
        const semesterStartDate = semesterStartInput.value;
        chrome.storage.sync.set({semesterStartDate}, function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    });
});
