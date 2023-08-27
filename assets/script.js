document.addEventListener('DOMContentLoaded', function() {
    const timerElement = document.getElementById('timer');
    const startStopButton = document.getElementById('startStopButton');
    const manualStartDateInput = document.getElementById('manual-start-date');
    const timeInfoElement = document.getElementById('time-info');
  
    let startTime;
    let timerInterval;
    let entries = [];
  
    function updateTimer() {
      const currentTime = new Date();
      const elapsedTime = currentTime - startTime;
      const hours = Math.floor(elapsedTime / 3600000);
      const minutes = Math.floor((elapsedTime % 3600000) / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
  
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      timerElement.textContent = formattedTime;
    }
  
    startStopButton.addEventListener('click', () => {
      if (!timerInterval) {
        const startDate = manualStartDateInput.value ? new Date(manualStartDateInput.value) : new Date();
        startTime = startDate.getTime();
        timerInterval = setInterval(updateTimer, 1000);
        startStopButton.textContent = 'STOP';
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        const endTime = new Date();
        const elapsedTime = endTime - startTime;
        entries.push({ start: startTime, end: endTime, duration: elapsedTime });
        updateEntriesDisplay();
        startStopButton.textContent = 'START';
      }
    });
  
    function updateEntriesDisplay() {
      timeInfoElement.innerHTML = '';
      entries.forEach(entry => {
        const startTime = new Date(entry.start).toLocaleTimeString();
        const endTime = new Date(entry.end).toLocaleTimeString();
        const duration = formatDuration(entry.duration);
  
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.innerHTML = `
          <p>Start: ${startTime}</p>
          <p>End: ${endTime}</p>
          <p>Duration: ${duration}</p>
        `;
        timeInfoElement.appendChild(entryDiv);
      });
    }
  
    function formatDuration(duration) {
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  });
  