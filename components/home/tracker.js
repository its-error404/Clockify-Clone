document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startStopButton");
  const timerDisplay = document.getElementById("timer");
  const projectDescriptionInput = document.getElementById("project-description");
  const manualStartDateInput = document.getElementById("manual-start-date");
  const manualStartDateInputInsider = document.getElementById('manual-start-date-insider')
  const timeInfoContainer = document.getElementById("time-info");

  let timerInterval;
  let startTime;
  let takenTime = 0;

  const startTimer = () => {
    takenTime = 0;
    startTime = Date.now() - takenTime;
    timerInterval = setInterval(updateTimer, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    takenTime = Date.now() - startTime;
    displayTimeInfo();
    resetTimer();
  };

  const updateTimer = () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - startTime;
    const formattedTime = formatTime(timeDifference);
    timerDisplay.innerHTML = formattedTime;
  };

  function formatTime(milliseconds) {
    const time = new Date(milliseconds);
    const hours = time.getUTCHours().toString().padStart(2, "0");
    const minutes = time.getUTCMinutes().toString().padStart(2, "0");
    const seconds = time.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const displayTimeInfo = () => {
    const trackedTime = timerDisplay.innerHTML;
    const projectDescription = projectDescriptionInput.value;
    const startDate = manualStartDateInput.value;

    const startDateObject = new Date(startDate)
    const startOfWeek = new Date(startDateObject)
    const endOfWeek = new Date(startDateObject)
    
    startOfWeek.setDate(startDateObject.getDate() - startDateObject.getDay()); 
    endOfWeek.setDate(startDateObject.getDate() + (6 - startDateObject.getDay()));
  
    const weekStartDateString = startOfWeek.toUTCString().substring(0,11);
    const weekEndDateString = endOfWeek.toUTCString().substring(0,11);

    const newTimeEntry = document.createElement("div");
    newTimeEntry.classList.add("time-entry");
    newTimeEntry.innerHTML = `

  
    <div class='week-header'>
      <p id='week-date-range'>${weekStartDateString} - ${weekEndDateString}</p>
      <p class='week-total'>Week total: <span class=calculated-week-time>${trackedTime}</span></p>
    </div>

      <div class="tracked-time">
          <div class="date-container">
              <p class='startDate'>${startDate}</p>
                   <div class='total-word'>
                      <p>Time: <span class=calculated-time>${trackedTime}</span></p>
                      <img src='/assets/Bulk edit items.svg' width='20px'>
                   </div>
          </div>
          <div class='project-details'>
              <div class='project-info'>
                  <p>.</p>
                  <p>${projectDescription}</p>
              </div>
              <div class='project-details__other-features'>
                <div class='tags'>
                  <img src='/assets/View tags.svg' width='20px'>
                </div>
                <div class='currency'>
                  <h3>$</h3>
                </div>
                  <input type="date" id="manual-start-date-insider">
                  <p><strong>Time:</strong> ${trackedTime}</p>
                  <img src='/assets/Start button.svg' width='20px' id='continue-button'>
                  <img src='/assets/Edit menu dark theme.svg' width='5px' class='edit-options'>
                  <div class='edit-dropdown'>
                      <div class='duplicate-item'>
                          <p>Duplicate</p>
                      </div>
                      <div class='delete-item'>
                          <p>Delete</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;

    timeInfoContainer.appendChild(newTimeEntry);
    const editOptions = newTimeEntry.querySelector(".edit-options");
    const editDropdown = newTimeEntry.querySelector(".edit-dropdown");

    editOptions.addEventListener("click", (e) => {
      editDropdown.classList.toggle("visible");
      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      if (!editDropdown.contains(e.target)) {
        editDropdown.classList.remove("visible");
      }
    });

    const duplicateButton = newTimeEntry.querySelector('.duplicate-item')
    // duplicateButton.addEventListener(('click'), DuplicateTimeInfo)
  };

  const resetTimer = () => {
    timerDisplay.innerHTML = "00:00:00";
  };

  startButton.addEventListener("click", () => {
    if (startButton.innerHTML === "START") {
      startButton.innerHTML = "STOP";
      startButton.style.backgroundColor = "red";
      startButton.style.color = "white";
      startTimer();
    } else {
      startButton.innerHTML = "START";
      startButton.style.backgroundColor = "";
      startButton.style.color = "";
      stopTimer();
    }
  });
});