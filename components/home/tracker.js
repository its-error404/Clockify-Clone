document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startStopButton");
  const timerDisplay = document.getElementById("timer");
  const projectDescriptionInput = document.getElementById("project-description");
  const manualStartDateInput = document.getElementById("manual-start-date");
  const timeInfoContainer = document.getElementById("time-info");
  const weekHeader = document.getElementById("week-date-range");
  const calculateWeekTime = document.querySelector(".calculated-week-time");

  let timerInterval;
  let startTime;
  let takenTime = 0;

  startButton.addEventListener("click", () => {
    if (startButton.textContent === "START") {
      startButton.textContent = "STOP";
      startButton.style.backgroundColor = "red";
      startButton.style.color = "white";
      startTimer();
    } else {
      startButton.textContent = "START";
      startButton.style.backgroundColor = "";
      startButton.style.color = "";
      stopTimer();
      displayWeek();
    }
  });

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
    timerDisplay.textContent = formattedTime;
  };

  function formatTime(milliseconds) {
    const time = new Date(milliseconds);
    const hours = time.getUTCHours().toString().padStart(2, "0");
    const minutes = time.getUTCMinutes().toString().padStart(2, "0");
    const seconds = time.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const dateFormat = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const displayWeek = () => {
    const weekHeader = document.getElementById("week-date-range");
    const weekStartDate = new Date(manualStartDateInput.value);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    const formattedWeekStartDate = dateFormat(weekStartDate);
    const formattedWeekEndDate = dateFormat(weekEndDate);

    weekHeader.textContent = `${formattedWeekStartDate} - ${formattedWeekEndDate}`;
  };

  const displayTimeInfo = () => {
    const trackedTime = timerDisplay.textContent;
    const projectDescription = projectDescriptionInput.value;
    const startDate = manualStartDateInput.value;

    const newTimeEntry = document.createElement("div");
    newTimeEntry.classList.add("time-entry");
    newTimeEntry.innerHTML = `
      <div class='week-header'>
          <p id='week-date-range'></p>
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
                  <p>${projectDescription}</p>
              </div>
              <div class='project-details__other-features'>
                  <p><strong>Start Date:</strong>&nbsp;${startDate}</p>
                  <img src='/assets/View tags.svg' width='20px'>
                  <h3>$</h3>
                  <input type="date" id="manual-start-date">
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

    const projectEntries = document.querySelectorAll(`.project-${projectDescription}`);

    if (projectEntries.length > 1) {
      const projectInfo = newTimeEntry.querySelector(".project-info");
      const toggleButton = document.createElement("button");
      toggleButton.textContent = `Show all ${projectEntries.length} projects`;
      toggleButton.classList.add("toggle-button");
      projectInfo.appendChild(toggleButton);

      toggleButton.addEventListener("click", () => {
        projectEntries.forEach((entry) => {
          if (entry != newTimeEntry) {
            entry.classList.toggle("project-hidden");
          }
        });
      });
    }

    const totalTrackedTime = calculateTotalTime(projectDescription);
    projectEntries.forEach((entry) => {
      const totalTrackedTimeElement = entry.querySelector(".calculated-time");
      totalTrackedTimeElement.textContent = formatTime(totalTrackedTime);
    });


    const totalWeekTime = calculateTotalWeekTime();
    calculateWeekTime.textContent = formatTime(totalWeekTime);

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

    const dateElement = document.getElementById("date");
    const today = new Date();
    const formattedDate = dateFormat(today);
    const todayString = dateFormat(new Date());

    if (formattedDate === todayString) {
      dateElement.textContent = "Today";
    } else {
      dateElement.textContent = formattedDate;
    }
  };

  const findSameProjects = (projectDescription) => {
    const sameEntries = document.querySelectorAll(
      `.project-${sanitizeClassName(projectDescription)}`
    );
    if (sameEntries.length > 0) {
      return sameEntries[0];
    } else {
      return null;
    }
  };

  const calculateTotalTime = (projectDescription) => {
    const entriesWithSameProject = document.querySelectorAll(`.project-${projectDescription}`);
    let totalMilliseconds = 0;

    entriesWithSameProject.forEach((entry) => {
      const trackedTimeElement = entry.querySelector(".calculated-time");
      const trackedTimeParts = trackedTimeElement.textContent.split(":");
      const hours = parseInt(trackedTimeParts[0]);
      const minutes = parseInt(trackedTimeParts[1]);
      const seconds = parseInt(trackedTimeParts[2]);
      totalMilliseconds = totalMilliseconds + (hours * 3600 + minutes * 60 + seconds) * 1000;
    });
    return totalMilliseconds;
  };

  const calculateTotalWeekTime = () => {
    const allTrackedTimes = document.querySelectorAll(".time-entry");
    let totalMilliseconds = 0;

    allTrackedTimes.forEach((time) => {
      const trackedTimeElement = time.querySelector(".calculated-time");
      const trackedTimeParts = trackedTimeElement.textContent.split(":");
      const hours = parseInt(trackedTimeParts[0]);
      const minutes = parseInt(trackedTimeParts[1]);
      const seconds = parseInt(trackedTimeParts[2]);

      totalMilliseconds = totalMilliseconds + (hours * 3600 + minutes * 60 + seconds) * 1000;
    });

    return totalMilliseconds;
  };

  function resetTimer() {
    timerDisplay.textContent = "00:00:00";
  }
});

  
