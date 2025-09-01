// Event listener for content type selection
document.getElementById('content-select').addEventListener('change', handleContentTypeChange);

function handleContentTypeChange() {
    const contentType = getContentType();
    if (!contentType) {
        // Clear all content when no option is selected
        clearAllContent();
        return;
    }

    // Automatically generate calendar when content type is selected
    const calendarItems = document.querySelectorAll('.calendar-door');
    calendarItems.forEach(addCalendarItemListener);
}

function clearAllContent() {
    const calendarItems = document.querySelectorAll('.calendar-item');
    calendarItems.forEach(item => {
        const door = item.querySelector('.calendar-door');
        const contentBox = item.querySelector('.content-box');
        
        door.classList.remove('open');
        contentBox.style.display = 'none';
        contentBox.innerHTML = '';
    });
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
        // Show message asking user to select content type first
        alert("Please choose a content type first!");
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
        
        // Add modal functionality to the content box
        if (typeof addModalToContentBox === 'function') {
            addModalToContentBox(contentBox);
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
    const img = new Image();
    const photoUrl = `https://picsum.photos/seed/${day}/300`;
    
    img.onload = function() {
        contentBox.innerHTML = `<img src="${photoUrl}" alt="Random photo for day ${day}" />`;
    };
    
    img.onerror = function() {
        // Fallback to a placeholder or error message
        contentBox.innerHTML = `<p>Photo for day ${day}</p><p style="color: #666; font-style: italic;">Image could not be loaded</p>`;
    };
    
    // Set crossOrigin to anonymous to handle CORS
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
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
        } else {
            // Add click event listeners to doors that can be opened
            addCalendarItemListener(door);
        }
    });
});
