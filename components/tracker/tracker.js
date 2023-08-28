document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startStopButton");
  const timerDisplay = document.getElementById("timer");
  const projectDescriptionInput = document.getElementById("project-description");
  const manualStartDateInput = document.getElementById("manual-start-date");
  const timeInfoContainer = document.getElementById("time-info");
  const startingBox = document.querySelector(".starting-box");

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

  const calculateWeekStartDate = (date) => {
    const startDateObject = new Date(date);
    const startOfWeek = new Date(startDateObject);
    startOfWeek.setDate(startDateObject.getDate() - startDateObject.getDay());
    return startOfWeek.toUTCString().substring(0, 11);
  };

  const calculateWeekEndDate = (date) => {
    const endDateObject = new Date(date);
    const endOfWeek = new Date(endDateObject);
    endOfWeek.setDate(endDateObject.getDate() + (6 - endDateObject.getDay()));
    return endOfWeek.toUTCString().substring(0, 11);
  };

  timeInfoContainer.addEventListener("click", function (event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains("time-entry")) {
      const weekStartDateString =
        clickedElement.getAttribute("data-week-start");
      updateWeekTotal(weekStartDateString);
    }
  });

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

  const updateWeekTotals = () => {
    for (const weekStartDateString in weekEntries) {
      updateWeekTotal(weekStartDateString);
    }
  };

  const addEventListenersToEntry = (entry) => {
    const editOptions = entry.querySelector(".edit-options");
    const editDropdown = entry.querySelector(".edit-dropdown");

    const toggleDropdown = () => {
      editDropdown.classList.toggle("visible");
      const rect = editOptions.getBoundingClientRect();
      editDropdown.style.left = `${rect.right - 100}px`;
      editDropdown.style.top = `${rect.top + 50}px`;
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

    const duplicateEntryHandler = (entry) => {
      const duplicateButton = entry.querySelector(".duplicate-item");
      duplicateButton.addEventListener("click", () => {
        const duplicateEntry = createDuplicateEntry();

        weekEntries[newWeekStartString] = duplicateEntry;

        updateWeekTotal(New);
        removeWeekHeader();
      });

      const createDuplicateEntry = () => {
        const duplicateEntry = entry.cloneNode(true);
        addEventListenersToEntry(duplicateEntry);
        return duplicateEntry;
      };

      const duplicateInputChangeListener = (duplicateEntry) => {
        return (event) => {
          const changeInputDuplicate = event.target;
          const changeDate = changeInputDuplicate.value;
          const changeDateObject = new Date(changeDate);
          const changeDateString = changeDateObject
            .toUTCString()
            .substring(0, 11);

          const startDateElement = duplicateEntry.querySelector(".startDate");
          startDateElement.innerHTML = changeDateString;

          const currentWeekStartDateString =
            duplicateEntry.getAttribute("data-week-start");
          const newWeekStartDateString =
            calculateWeekStartDate(changeDateObject);

          if (newWeekStartDateString !== currentWeekStartDateString) {
            weekEntries[newWeekStartDateString] =
              weekEntries[currentWeekStartDateString];
            delete weekEntries[currentWeekStartDateString];
            duplicateEntry.setAttribute(
              "data-week-start",
              newWeekStartDateString
            );

            updateWeekTotal(newWeekStartDateString);
            removeWeekHeader(currentWeekStartDateString);
          }
        };
      };

      duplicateButton.addEventListener("click", () => {
        const duplicateEntry = createDuplicateEntry();
        updateWeekTotal(weekStartDateString);

        weekEntries[weekStartDateString].appendChild(duplicateEntry);
        updateWeekTotal(weekStartDateString);

        const changeInputDuplicate =
          duplicateEntry.querySelector("#duplicate-input");
        changeInputDuplicate.addEventListener(
          "change",
          duplicateInputChangeListener(duplicateEntry)
        );
      });

      const originalInputChangeListener = () => {
        const changeDate = changeInputOriginal.value;
        const changeDateObject = new Date(changeDate);
        const changeDateString = changeDateObject
          .toUTCString()
          .substring(0, 11);

        const startDateElement = entry.querySelector(".startDate");
        startDateElement.innerHTML = changeDateString;
      };

      const changeInputOriginal = entry.querySelector("#duplicate-input");
      changeInputOriginal.addEventListener(
        "change",
        originalInputChangeListener
      );
    };

    const deleteEntryHandler = (entry) => {
      const deleteButton = entry.querySelector(".delete-item");
      deleteButton.addEventListener("click", () => {
        entry.remove();
        updateWeekTotal(weekStartDateString);
        removeWeekHeader(weekStartDateString);
      });
    };

    duplicateEntryHandler(entry);
    deleteEntryHandler(entry);
  };

  const getWeekHeaderForDate = (startDateString) => {
    return weekEntries[startDateString];
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
            <p contenteditable='true'>${projectDescription}</p>
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
    //Getting week Header for the week Start Date
    const headerAlreadyPresent = getWeekHeaderForDate(weekStartDateString);

    //Checcking if the week header is already present in the container, if yes, then appending the time entry to that header.

    if (headerAlreadyPresent) {
      const eachWeekTimeEntriesContainer = headerAlreadyPresent.querySelector(
        ".time-entries-container"
      );
      eachWeekTimeEntriesContainer.appendChild(newTimeEntry);
      addEventListenersToEntry(newTimeEntry);
    }
    //if week header is not present, creating a new week header for the time entry
    else {
      const WeekHeader = document.createElement("div");
      WeekHeader.className = "week-entry";
      WeekHeader.setAttribute(
        "data-week-start",
        `${weekStartDateString} - ${weekEndDateString}`
      );

      const weekHeaderDiv = document.createElement("div");
      weekHeaderDiv.className = "week-header";

      const weekDateRange = document.createElement("p");
      weekDateRange.id = "week-date-range";
      weekDateRange.textContent =
        weekStartDateString + " - " + weekEndDateString;

      const weekTotal = document.createElement("p");
      weekTotal.className = "week-total";
      weekTotal.innerHTML =
        "Week total: <span class='calculated-week-time'>00:00:00</span>";

      //Appending the week information to the week header
      weekHeaderDiv.appendChild(weekDateRange);
      weekHeaderDiv.appendChild(weekTotal);
      WeekHeader.appendChild(weekHeaderDiv);

      // creating a time entry container

      const timeEntriesContainer = document.createElement("div");
      timeEntriesContainer.className = "time-entries-container";

      // adding the week start date to the week Entries object and appending the time entries container to the week header
      weekEntries[weekStartDateString] = WeekHeader;
      WeekHeader.appendChild(timeEntriesContainer);

      //appending the week header to the time info container
      timeInfoContainer.appendChild(WeekHeader);

      //appedning the time entry to the time entries container and calculating the week's time
      timeEntriesContainer.appendChild(newTimeEntry);
      updateWeekTotal(weekStartDateString);

      //adding listeners to the time entry
      addEventListenersToEntry(newTimeEntry);
    }

    //end of creating fresh entry

    startingBox.classList.add("hidden");

    //Changing the input in the new Time entry div

    const changeInput = newTimeEntry.querySelector("#duplicate-input");
    changeInput.addEventListener("change", () => {
      const changeDate = changeInput.value;
      const changeDateObject = new Date(changeDate);
      const changeDateString = changeDateObject.toUTCString().substring(0, 11);

      const existingWeekStartString = calculateWeekStartDate(
        manualStartDateInput.value
      );
      const newWeekStartString = calculateWeekStartDate(changeDateObject);
      const newWeekEndString = calculateWeekEndDate(changeDateObject);

      if (newWeekStartString === existingWeekStartString) {
        const weekEntry = weekEntries[existingWeekStartString];
        const timeEntriesContainer = weekEntry.querySelector(
          ".time-entries-container"
        );
        timeEntriesContainer.appendChild(newTimeEntry);
        addEventListenersToEntry(newTimeEntry);
        updateWeekTotal(existingWeekStartString);
      } else {
        if (!weekEntries[newWeekStartString]) {
          const newWeekEntryHeader = document.createElement("div");
          newWeekEntryHeader.className = "week-entry";
          newWeekEntryHeader.setAttribute(
            "data-week-start",
            `${newWeekStartString} - ${newWeekEndString}`
          );

          const newWeekHeaderDiv = document.createElement("div");
          newWeekHeaderDiv.className = "week-header";

          const newWeekDateRange = document.createElement("p");
          newWeekDateRange.id = "week-date-range";
          newWeekDateRange.textContent =
            newWeekStartString + " - " + newWeekEndString;

          const newWeekTotal = document.createElement("p");
          newWeekTotal.className = "week-total";
          newWeekTotal.innerHTML =
            "Week total: <span class='calculated-week-time'>00:00:00</span>";

          newWeekHeaderDiv.appendChild(newWeekDateRange);
          newWeekHeaderDiv.appendChild(newWeekTotal);
          newWeekEntryHeader.appendChild(newWeekHeaderDiv);

          const newTimeEntriesContainer = document.createElement("div");
          newTimeEntriesContainer.className = "time-entries-container";

          weekEntries[newWeekStartString] = newWeekEntryHeader;
          newWeekEntryHeader.appendChild(newTimeEntriesContainer);
          timeInfoContainer.appendChild(newWeekEntryHeader);

          const startDateElement = newTimeEntry.querySelector(".startDate");
          startDateElement.innerHTML = changeDateString;

          newWeekEntryHeader.appendChild(newTimeEntry);
          updateWeekTotal(newWeekStartString);

          timeInfoContainer.appendChild(newWeekEntryHeader);
        }
      }

      if (weekEntries[existingWeekStartString]) {
        const oldWeekEntry = weekEntries[existingWeekStartString];
        if (oldWeekEntry.querySelectorAll(".time-entry").length === 0) {
          oldWeekEntry.remove();
          delete weekEntries[existingWeekStartString];
        }
      }

      const removeWeekHeader = (weekStartDateString) => {
        const weekEntry = weekEntries[weekStartDateString];
        const timeEntriesInWeek = weekEntry.querySelectorAll(".time-entry");
        if (timeEntriesInWeek.length === 0) {
          weekEntry.remove();
          delete weekEntries[weekStartDateString];
        }
      };
    });

    //End of listener for changing input in new time entry div

    startingBox.classList.remove("hidden");
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
