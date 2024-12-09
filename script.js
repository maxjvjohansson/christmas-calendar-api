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

// Get correct day from calendar object's ID
function getDayFromItemId(id) {
    return id.split('-')[1];
}

// Modal elements
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-btn');

// Open modal and show content in lightbox
function openModal(content) {
    modalBody.innerHTML = content; 
    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    modal.style.display = 'none'; 
    modalBody.innerHTML = ''; 
}

closeModalBtn.addEventListener('click', closeModal);

// Close modal on click outside modalbox
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Update calendar item click handler to open modal
function handleCalendarItemClick(day, item) {
    const contentType = getContentType();
    const contentBox = item.closest('.calendar-item').querySelector('.content-box');

    if (!contentType) {
        contentBox.innerHTML = '';
        contentBox.style.display = 'none';
        return;
    }

    closeAllOtherDoors(item);

    if (!item.classList.contains('open')) {
        item.classList.add('open');
        contentBox.style.display = 'block';
        contentBox.innerHTML = '<p>Loading...</p>';

        if (contentType === 'facts') {
            fetchFactForDay(day, contentBox);
        } else if (contentType === 'photos') {
            fetchPhotoForDay(day, contentBox);
        }
    } else {
        item.classList.remove('open');
        contentBox.style.display = 'none';
    }

    // Open modal when content is clicked
    contentBox.addEventListener('click', () => {
        openModal(contentBox.innerHTML);
    });
}
