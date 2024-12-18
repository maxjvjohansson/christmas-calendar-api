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
}

// Function to target selected content type
function getContentType() {
    return document.getElementById('content-select').value;
}

// Add click event for calendar items
function addCalendarItemListener(item) {
    if (item.dataset.listenerAdded) return;

    const day = getDayFromItemId(item.id);

    item.addEventListener('click', () => handleCalendarItemClick(day, item));
    item.dataset.listenerAdded = "true";
}

// Click handling for calendar objects
function handleCalendarItemClick(day, item) {
    const contentType = getContentType();
    const contentBox = item.closest('.calendar-item').querySelector('.content-box');

    if (!contentType) {
        // Clear content if no content type is selected
        contentBox.innerHTML = "";
        contentBox.style.display = "none"; // Hide content box
        return;
    }

    // Check if any other doors are open and close them
    closeAllOtherDoors(item);

    if (!item.classList.contains('open')) {
        // Open the current door and show content
        item.classList.add('open');
        contentBox.style.display = "block";
        contentBox.innerHTML = '<p>Loading...</p>';

        if (contentType === 'facts') {
            fetchFactForDay(day, contentBox);
        } else if (contentType === 'photos') {
            fetchPhotoForDay(day, contentBox);
        }
    } else {
        // If a door is already open, close it
        item.classList.remove('open');
        contentBox.style.display = "none";
    }
}

// Close all other doors and hide their content boxes
function closeAllOtherDoors(openedItem) {
    const allItems = document.querySelectorAll('.calendar-item');
    allItems.forEach(item => {
        const contentBox = item.querySelector('.content-box');
        const door = item.querySelector('.calendar-door');
        
        if (item !== openedItem.closest('.calendar-item') && door.classList.contains('open')) {
            door.classList.remove('open');
            contentBox.style.display = "none";
        }
    });
}

// Fetch facts for each day
function fetchFactForDay(day, contentBox) {
    fetch(`https://uselessfacts.jsph.pl/random.json?language=en`)
        .then(response => response.json())
        .then(data => {
            contentBox.innerHTML = `<p>${data.text}</p>`;
        })
        .catch(error => {
            contentBox.innerHTML = `<p>Error loading fact</p>`;
            console.error(error);
        });
}

// Fetch photo for each day
function fetchPhotoForDay(day, contentBox) {
    fetch(`https://picsum.photos/seed/${day}/300`)
        .then(response => {
            contentBox.innerHTML = `<img src="${response.url}" alt="Random photo for day ${day}" />`;
        })
        .catch(error => {
            contentBox.innerHTML = `<p>Error loading photo</p>`;
            console.error(error);
        });
}

// Get correct day from calendar object's ID
function getDayFromItemId(id) {
    return id.split('-')[1];
}

// Let users only open doors today and the doors before today
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const calendarItems = document.querySelectorAll('.calendar-item');

    calendarItems.forEach(item => {
        const itemDate = new Date(item.getAttribute('data-date'));
        const door = item.querySelector('.calendar-door');
        const contentBox = item.querySelector('.content-box');

        if (today < itemDate) {
            door.classList.add('disabled');
            door.style.pointerEvents = 'none';
            contentBox.style.display = 'none';

            // If condition is true, add a lock icon for the doors that can't yet be opened
            const lockIconContainer = document.createElement('div');
            lockIconContainer.classList.add('lock-icon-container');

            const lockIcon = document.createElement('img');
            lockIcon.src = 'assets/images/lock-icon.svg';  
            lockIcon.alt = 'Lock icon';

            lockIconContainer.appendChild(lockIcon);

            door.appendChild(lockIconContainer);
        }
    });
});
