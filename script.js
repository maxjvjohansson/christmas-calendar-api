document.getElementById('generate-calendar').addEventListener('click', () => {
    const contentType = document.getElementById('content-select').value;
    const calendarItems = document.querySelectorAll('.calendar-container .item');

    if (!contentType) {
        alert("Please select an option first!");
        return;
    }

    calendarItems.forEach(item => {
        const day = item.id.split('-')[1];
        item.innerHTML = `<p>${day}</p>`;

        if (contentType === 'facts') {
            fetch(`http://numbersapi.com/12/${day}/date`)
                .then(response => response.text())
                .then(data => {
                    item.innerHTML += `<p>${data}</p>`;
                })
                .catch(err => console.error("Error fetching fact:", err));
        } else if (contentType === 'photos') {
            fetch('https://picsum.photos/seed/' + day + '/200/300')
                .then(response => {
                    item.innerHTML += `<img src="${response.url}" alt="Random photo for day ${day}" />`;
                })
                .catch(err => console.error("Error fetching photo:", err));
        }
    });
});
