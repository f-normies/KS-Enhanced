// Function to restore text selection
function enableTextSelection() {
    document.querySelectorAll('*').forEach(function(node) {
        const style = window.getComputedStyle(node);
        if (style.webkitUserSelect === 'none') {
            node.style.webkitUserSelect = 'auto';
        }
        if (style.userSelect === 'none') {
            node.style.userSelect = 'auto';
        }
    });
}

// Function to calculate the current week number from the semester start date
function calculateCurrentWeek(semesterStartDate) {
    const currentDate = new Date();
    const startDate = new Date(semesterStartDate);
    const timeDiff = currentDate - startDate;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.ceil(dayDiff / 7);
}

// Function to insert the current week info into the "Current Rating" page
function insertCurrentWeekInfo() {
    chrome.storage.sync.get(['semesterStartDate'], function(data) {
        if (data.semesterStartDate) {
            const weekNumber = calculateCurrentWeek(data.semesterStartDate);
            const weekInfo = document.createElement('div');
            weekInfo.textContent = `Текущая неделя: ${weekNumber}`;
            weekInfo.style.padding = '10px';
            weekInfo.style.marginTop = '10px';
            weekInfo.style.backgroundColor = '#f0f0f0';
            weekInfo.style.borderRadius = '5px';
            const container = document.querySelector('.container .title');
            if (container) {
                container.insertAdjacentElement('afterend', weekInfo);
            }
        }
    });
}

// Determine the appropriate actions based on the current URL
if (location.href.includes('https://ks2.rsmu.ru/tests2/questions')) {
    enableTextSelection();
} else if (location.href.includes('https://ks2.rsmu.ru/performance/rating/current_rating')) {
    insertCurrentWeekInfo();
}
