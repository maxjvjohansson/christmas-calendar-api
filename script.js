document.getElementById('generate-calendar').addEventListener('click', () => {
    const contentType = document.getElementById('content-select').value;

    if (!contentType) {
        alert("Please choose a content type first!");
        return;
    }

    const calendarItems = document.querySelectorAll('.calendar-item');
    const overlay = document.getElementById('content-overlay');
    const contentBox = document.getElementById('content-box');

    calendarItems.forEach(item => {
        const day = item.id.split('-')[1];

        item.addEventListener('click', () => {
            overlay.classList.remove('hidden');

            if (contentType === 'facts') {
                fetch(`http://numbersapi.com/12/${day}/date`)
                    .then(response => response.text())
                    .then(data => {
                        contentBox.innerHTML = `<p>${data}</p>`;
                    })
                    .catch(err => {
                        contentBox.innerHTML = `<p>Error loading fact</p>`;
                        console.error(err);
                    });
            } if (contentType === 'photos') {
                fetch(`https://picsum.photos/seed/${day}/300`)
                    .then(response => {
                        contentBox.innerHTML = `<img src="${response.url}" alt="Random photo for day ${day}" />`;
                    })
                    .catch(err => {
                        contentBox.innerHTML = `<p>Error loading photo</p>`;
                        console.error(err);
                    });
            }
        });
    });

    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
    });
});
