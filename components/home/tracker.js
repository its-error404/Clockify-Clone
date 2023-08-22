document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startStopButton");
  const timerDisplay = document.getElementById("timer");
  const projectDescriptionInput = document.getElementById(
    "project-description"
  );
  const manualStartDateInput = document.getElementById("manual-start-date");
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

  const weekEntries = {};

  const updateWeekTotal = (weekStartDateString) => {
    const weekEntry = weekEntries[weekStartDateString];
    const weekTotalSpan = weekEntry.querySelector(".calculated-week-time");
    let weekTotalTime = 0;

    const trackedTimeSpans = weekEntry.querySelectorAll(".calculated-time");
    trackedTimeSpans.forEach((trackedTimeSpan) => {
      const timeParts = trackedTimeSpan.textContent.split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      const seconds = parseInt(timeParts[2]);
      weekTotalTime += hours * 3600 + minutes * 60 + seconds;
    });

    weekTotalSpan.textContent = formatTime(weekTotalTime * 1000);
  };

  const addEventListenersToEntry = (entry) => {
    const editOptions = entry.querySelector(".edit-options");
    const editDropdown = entry.querySelector(".edit-dropdown");

    const toggleDropdown = () => {
      editDropdown.classList.toggle("visible");
    };

    editOptions.addEventListener("click", (e) => {
      toggleDropdown();
      e.stopPropagation();
    });

    const closeDropdown = () => {
      editDropdown.classList.remove("visible");
    };

    document.addEventListener("click", (e) => {
      if (!editOptions.contains(e.target) && !editDropdown.contains(e.target)) {
        closeDropdown();
      }
    });
  };

  const displayTimeInfo = () => {
    const trackedTime = timerDisplay.innerHTML;
    const projectDescription = projectDescriptionInput.value;
    const startDate = manualStartDateInput.value;

    const startDateObject = new Date(startDate);
    const startOfWeek = new Date(startDateObject);
    const endOfWeek = new Date(startDateObject);

    startOfWeek.setDate(startDateObject.getDate() - startDateObject.getDay());
    endOfWeek.setDate(
      startDateObject.getDate() + (6 - startDateObject.getDay())
    );

    const weekStartDateString = startOfWeek.toUTCString().substring(0, 11);
    const weekEndDateString = endOfWeek.toUTCString().substring(0, 11);
    const startDateString = startDateObject.toUTCString().substring(0, 11);

    const newTimeEntry = document.createElement("div");
    newTimeEntry.classList.add("time-entry");
    newTimeEntry.innerHTML = `
    <div class="tracked-time">
    <div class="date-container">
        <p class='startDate'>${startDateString}</p>
             <div class='total-word'>
                <p>Time: &ensp; <span class=calculated-time>${trackedTime}</span></p>
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
            <input type='date' id='duplicate-input'>
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

    if (!weekEntries[weekStartDateString]) {
      weekEntries[weekStartDateString] = document.createElement("div");
      weekEntries[weekStartDateString].classList.add("week-entry");
      weekEntries[weekStartDateString].innerHTML = `
      <div class='week-header'>
          <p id='week-date-range'>${weekStartDateString} - ${weekEndDateString}</p>
          <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
      </div>
      `;
      timeInfoContainer.appendChild(weekEntries[weekStartDateString]);
    }

    weekEntries[weekStartDateString].appendChild(newTimeEntry);

    addEventListenersToEntry(newTimeEntry);

    const duplicateButton = newTimeEntry.querySelectorAll(".duplicate-item");
    for (let i = 0; i < duplicateButton.length; i++) {
      duplicateButton[i].addEventListener("click", () => {
        const duplicateEntry = newTimeEntry.cloneNode(true);

        const duplicateDeleteButton =
          duplicateEntry.querySelector(".delete-item");
        duplicateDeleteButton.addEventListener("click", () => {
          duplicateEntry.remove();
        });

        timeInfoContainer.appendChild(duplicateEntry);
        updateWeekTotal(weekStartDateString);

        const duplicateEditOptions =
          duplicateEntry.querySelector(".edit-options");
        const duplicateEditDropdown =
          duplicateEntry.querySelector(".edit-dropdown");

        duplicateEditOptions.addEventListener("click", (e) => {
          duplicateEditDropdown.classList.toggle("visible");
          e.stopPropagation();
        });

        document.addEventListener("click", (e) => {
          if (
            !duplicateEditOptions.contains(e.target) &&
            !duplicateEditDropdown.contains(e.target)
          ) {
            duplicateEditDropdown.classList.remove("visible");
          }
        });
      });
    }

    updateWeekTotal(weekStartDateString);

    const deleteButton = newTimeEntry.querySelector(".delete-item");
    deleteButton.addEventListener("click", () => {
      newTimeEntry.remove();
      updateWeekTotal(weekStartDateString);

      const weekEntry = weekEntries[weekStartDateString];
      const timeEntriesInWeek = weekEntry.querySelectorAll(".time-entry");
      if (timeEntriesInWeek.length === 0) {
        weekEntry.remove();
      }
    });

    updateWeekTotal(weekStartDateString);
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
