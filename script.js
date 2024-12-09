// Event listener to generate calendar
document.getElementById('generate-calendar').addEventListener('click', generateCalendar);

function generateCalendar() {
    const contentType = getContentType();
    if (!contentType) {
        alert("Please choose a content type first!");
        return;
    }

    const calendarItems = document.querySelectorAll('.calendar-door');
    calendarItems.forEach(addCalendarItemListener);
    
    // Add overlay click event
    setupOverlayListener();
}

// Function to target selected content type
function getContentType() {
    return document.getElementById('content-select').value;
}

// Add click event for calendar items
function addCalendarItemListener(item) {
    if (item.dataset.listenerAdded) return;

    const day = getDayFromItemId(item.id);

    item.addEventListener('click', () => handleCalendarItemClick(day));
    item.dataset.listenerAdded = "true";
}

// Click handling for calendar objects
function handleCalendarItemClick(day) {
    const contentType = getContentType();
    const overlay = document.getElementById('content-overlay');
    const contentBox = document.getElementById('content-box');

    if (!contentType) {
        // Clear content and hide overlay if no content type is selected
        contentBox.innerHTML = "";
        overlay.classList.add('hidden');
        return;
    }

    if (!overlay.classList.contains('hidden')) {
        // If overlay is visible, hide it and clear content
        overlay.classList.add('hidden');
        contentBox.innerHTML = "";
    } else {
        // Show overlay with new content
        overlay.classList.remove('hidden');
        contentBox.innerHTML = '<p>Loading...</p>';

        if (contentType === 'facts') {
            fetchFactForDay(day, contentBox);
        } else if (contentType === 'photos') {
            fetchPhotoForDay(day, contentBox);
        }
    }
}

// Fetch facts for each day
function fetchFactForDay(day, contentBox) {
    fetch(`http://numbersapi.com/12/${day}/date`)
        .then(response => response.text())
        .then(data => {
            contentBox.innerHTML = `<p>${data}</p>`;
        })
        .catch(err => {
            contentBox.innerHTML = `<p>Error loading fact</p>`;
            console.error(err);
        });
}

// Fetch photo for each day
function fetchPhotoForDay(day, contentBox) {
    fetch(`https://picsum.photos/seed/${day}/300`)
        .then(response => {
            contentBox.innerHTML = `<img src="${response.url}" alt="Random photo for day ${day}" />`;
        })
        .catch(err => {
            contentBox.innerHTML = `<p>Error loading photo</p>`;
            console.error(err);
        });
}

// Add overlay click functionality
function setupOverlayListener() {
    const overlay = document.getElementById('content-overlay');
    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        document.getElementById('content-box').innerHTML = "";
    });
}

// Get correct day from calendar object's ID
function getDayFromItemId(id) {
    return id.split('-')[1];
}

// Open door animation
document.querySelectorAll('.calendar-door').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('open');

        const contentBox = this.nextElementSibling; 
        if (contentBox) {
            contentBox.classList.toggle('visible'); 
        }
    });
});