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

// Add modal functionality to calendar items
function addModalToContentBox(contentBox) {
    // Remove existing click listeners to avoid duplicates
    contentBox.removeEventListener('click', contentBox.modalClickHandler);
    
    // Create new click handler for modal
    contentBox.modalClickHandler = () => {
        openModal(contentBox.innerHTML);
    };
    
    contentBox.addEventListener('click', contentBox.modalClickHandler);
}