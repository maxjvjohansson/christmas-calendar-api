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