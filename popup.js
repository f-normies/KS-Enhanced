document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveSettings');
    const semesterStartInput = document.getElementById('semesterStart');
    const toggleExtensionCheckbox = document.getElementById('toggleExtension');

    // Load saved settings
    chrome.storage.sync.get(['semesterStartDate', 'isEnabled'], function(data) {
        if (data.semesterStartDate) {
            semesterStartInput.value = data.semesterStartDate;
        }
        toggleExtensionCheckbox.checked = data.isEnabled !== false; // Default to true
    });

    // Save settings
    saveButton.addEventListener('click', function() {
        const semesterStartDate = semesterStartInput.value;
        const isEnabled = toggleExtensionCheckbox.checked;
        chrome.storage.sync.set({semesterStartDate, isEnabled}, function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        });

        // Send a message to background.js to toggle the extension's state
        chrome.runtime.sendMessage({message: "toggleExtension", state: isEnabled}, function(response) {
            console.log(response.result); // Log success message
        });
    });
});
