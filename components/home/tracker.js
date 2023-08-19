document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startStopButton");
  const timerDisplay = document.getElementById("timer");
  const projectDescriptionInput = document.getElementById("project-description");
  const manualStartDateInput = document.getElementById("manual-start-date");
  const timeInfoContainer = document.getElementById("time-info");

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
    }
  });

  const startTimer = () => {
    takenTime = 0;
    startTime = Date.now() - takenTime;
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    takenTime = Date.now() - startTime;
    displayTimeInfo();
    resetTimer();
  }

  function updateTimer() {
    const currentTime = Date.now();
    const timeDifference = currentTime - startTime;
    const formattedTime = formatTime(timeDifference);
    timerDisplay.textContent = formattedTime;
  }

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  const dateFormat = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const today = new Date();

  const formattedDate = dateFormat(today);
  const todayString = dateFormat(new Date());

  function displayTimeInfo() {
    const trackedTime = timerDisplay.textContent;
    const projectDescription = projectDescriptionInput.value;
    const startDate = manualStartDateInput.value;
    const currentDate = new Date().toLocaleDateString();

    const timeInfoContent = `
            <div class="time-entry">

                <div class='week-header'>
                    <p>This Week</p>
                    <p class='week-total'>Week total: <span class=calculated-time>${trackedTime}</span> </p>
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
                            <p><strong>Project:</strong> ${projectDescription}</p>
                        </div>
                        <div class='project-details__other-features'>
                            <p><strong>Start Date:</strong>&nbsp;${startDate}</p>
                            <p id='date'><strong>Current Date:</strong> ${currentDate}</p>
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
                    <div>
                </div>
            </div>
        `;

    const newTimeEntry = document.createElement("div");
    newTimeEntry.classList.add("time-entry");
    newTimeEntry.innerHTML = timeInfoContent;
    timeInfoContainer.appendChild(newTimeEntry);

    const editOptions = document.querySelector(".edit-options");
    const editDropdown = document.querySelector(".edit-dropdown");

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

    if (formattedDate === todayString) {
      dateElement.textContent = "Today";
    } else {
      dateElement.textContent = formattedDate;
    }
  }

  function resetTimer() {
    timerDisplay.textContent = "00:00:00";
  }
});
