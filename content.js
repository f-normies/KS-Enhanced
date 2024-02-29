document.querySelectorAll('*').forEach(function(node) {
    document.querySelectorAll('*').forEach(function(node) {
        if (getComputedStyle(node).webkitTouchCallout === 'none') {
            node.style.webkitTouchCallout = 'auto';
        }
        if (getComputedStyle(node).webkitUserSelect === 'none') {
            node.style.webkitUserSelect = 'auto';
        }
        if (getComputedStyle(node).userSelect === 'none') {
            node.style.userSelect = 'auto';
        }
        });
});