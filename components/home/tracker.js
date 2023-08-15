const calendarIcon = document.getElementById('calendar-icon');
const dateInput = document.getElementById('date-input');

calendarIcon.addEventListener('click', () => {
    dateInput.classList.toggle('calendar-hidden');
});

const getTimeInSeconds = (timeString) => {
    const HMS = timeString.split(':');
    if (HMS.length === 3) {
        return (+HMS[0]) * 60 * 60 + (+HMS[1]) * 60 + (+HMS[2]);
    }
    return NaN;
};

const formatSecondsToTime = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
};

const calculateTime = () => {
    const fromTime = document.getElementById('from-input');
    const toTime = document.getElementById('to-input');
    const totalTimeElement = document.getElementById('total-time');

    const fromSeconds = getTimeInSeconds(fromTime.value);
    const toSeconds = getTimeInSeconds(toTime.value);

    if (!isNaN(fromSeconds) && !isNaN(toSeconds)) {
        const totalSeconds = toSeconds - fromSeconds;
        const totalTime = formatSecondsToTime(totalSeconds);
        totalTimeElement.textContent = `Total Time: ${totalTime}`;
    } else {
        totalTimeElement.textContent = 'Invalid input';
    }
};

const fromTime = document.getElementById('from-input');
const toTime = document.getElementById('to-input');

fromTime.addEventListener('input', calculateTime);
toTime.addEventListener('input', calculateTime);