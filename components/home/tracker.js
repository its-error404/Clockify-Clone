const calendarIcon = document.getElementById('calendar-icon');
const dateInput = document.getElementById('date-input');

calendarIcon.addEventListener('click', () => {
    dateInput.classList.toggle('calendar-hidden');
});



