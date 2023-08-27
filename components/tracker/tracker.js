document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startStopButton");
  const timerDisplay = document.getElementById("timer");
  const projectDescriptionInput = document.getElementById("project-description");
  const manualStartDateInput = document.getElementById("manual-start-date");
  const timeInfoContainer = document.getElementById("time-info");
  const startingBox = document.querySelector('.starting-box')

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

  let weekEntries = {};

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

  const createOrUpdateWeekHeader = (startDateObject) => {

    const weekStartDateString = calculateWeekStartDate(startDateObject);
    const weekEndDateString = calculateWeekEndDate(startDateObject);

      weekEntries[weekStartDateString] = document.createElement("div");
      weekEntries[weekStartDateString].classList.add("week-entry");
      weekEntries[weekStartDateString].innerHTML = `
        <div class='week-header'>
          <p id='week-date-range'>${weekStartDateString} - ${weekEndDateString}</p>
          <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
        </div>
      `;
      timeInfoContainer.appendChild(weekEntries[weekStartDateString]);
    
    updateWeekTotal(weekStartDateString);
  };
  
  const displayTimeInfo = () => {

    const trackedTime = timerDisplay.innerHTML;
    const projectDescription = projectDescriptionInput.value;
    const startDate = manualStartDateInput.value;

    const startDateObject = new Date(startDate);
    const startOfWeek = new Date(startDateObject);
    const endOfWeek = new Date(startDateObject);

    startOfWeek.setDate(startDateObject.getDate() - startDateObject.getDay());
    endOfWeek.setDate(startDateObject.getDate() + (6 - startDateObject.getDay()));

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
    
    createOrUpdateWeekHeader(startDateObject)
    weekEntries[weekStartDateString].appendChild(newTimeEntry);
    timeInfoContainer.appendChild(newTimeEntry);

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
  
      const duplicateEntryHandler = (entry) => {
        const duplicateButton = entry.querySelector(".duplicate-item");
        duplicateButton.addEventListener("click", () => {
          const duplicateEntry = entry.cloneNode(true);
          addEventListenersToEntry(duplicateEntry);

          const clonedDuplicateInput = duplicateEntry.querySelector("#duplicate-input");
          clonedDuplicateInput.addEventListener("change", () => {
            const changeDate = clonedDuplicateInput.value;
            const changeDateObject = new Date(changeDate);
            const changeDateString = changeDateObject.toUTCString().substring(0, 11);
    
            const weekStartDateString = calculateWeekStartDate(changeDateObject);
            const existingWeekStartString = calculateWeekStartDate(manualStartDateInput.value);
    
            // Check if the changed date is in a different week from the existing entries' week range
            if (weekStartDateString !== existingWeekStartString) {
              // Check if the new week header has already been created
              if (!weekEntries[weekStartDateString]) {
                const newWeekEntryHeader = document.createElement("div");
                newWeekEntryHeader.classList.add("week-entry");
                newWeekEntryHeader.innerHTML = `
                  <div class='week-header'>
                    <p id='week-date-range'>${weekStartDateString} - ${calculateWeekEndDate(changeDateObject)}</p>
                    <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
                  </div>
                `;
                timeInfoContainer.appendChild(newWeekEntryHeader);
                weekEntries[weekStartDateString] = newWeekEntryHeader;
    
                // Remove the old week header if no entries are associated with it
                if (weekEntries[existingWeekStartString]) {
                  const oldWeekEntry = weekEntries[existingWeekStartString];
                  if (oldWeekEntry.querySelectorAll(".time-entry").length === 0) {
                    oldWeekEntry.remove();
                    delete weekEntries[existingWeekStartString];
                  }
                }
              }
            }
    
            // Update the start date of the cloned entry
            const clonedStartDateElements = duplicateEntry.querySelectorAll(".startDate");
            clonedStartDateElements.forEach((clonedStartDateElement) => {
              clonedStartDateElement.innerHTML = changeDateString;
            });
    
            // Update the week entry of the cloned time entry
            const clonedTimeEntry = clonedDuplicateInput.closest(".time-entry");
            const clonedCurrentWeekStartString = clonedTimeEntry.getAttribute("data-week-start");
            if (clonedCurrentWeekStartString !== weekStartDateString) {
              const newWeekEntry = weekEntries[weekStartDateString];
              newWeekEntry.appendChild(clonedTimeEntry);
              clonedTimeEntry.setAttribute("data-week-start", weekStartDateString);
    
              updateWeekTotals();
    
              const clonedOldWeekEntry = weekEntries[clonedCurrentWeekStartString];
              if (clonedOldWeekEntry) {
                const timeEntriesInOldWeek = clonedOldWeekEntry.querySelectorAll(".time-entry");
                if (timeEntriesInOldWeek.length === 0) {
                  clonedOldWeekEntry.remove();
                  delete weekEntries[clonedCurrentWeekStartString];
                }
              }
            }
            // Recalculate the week total for both the old and new week ranges
            updateWeekTotal(existingWeekStartString);
            updateWeekTotal(weekStartDateString);
          });

          const calculateWeekStartDate = (date) => {

            const startDateObject = new Date(date);
            const startOfWeek = new Date(startDateObject);
            startOfWeek.setDate(startDateObject.getDate() - startDateObject.getDay());
            return startOfWeek.toUTCString().substring(0, 11);
          };

          const clonedStartDateString = clonedDuplicateInput.value;
          const clonedWeekStartString = calculateWeekStartDate(clonedStartDateString);
    
          weekEntries[clonedWeekStartString].appendChild(duplicateEntry);
          updateWeekTotal(clonedWeekStartString);
        });
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
    addEventListenersToEntry(newTimeEntry);
  
    startingBox.classList.add('hidden')

    const changeInput = document.getElementById("duplicate-input");
    changeInput.addEventListener("change", () => {
      const changeDate = changeInput.value;
      const changeDateObject = new Date(changeDate);
      const changeDateString = changeDateObject.toUTCString().substring(0, 11);

      const existingWeekStartString = calculateWeekStartDate(manualStartDateInput.value);
      const newWeekStartString = calculateWeekStartDate(changeDateObject);
    
      // Check if the changed date is in a different week from the existing entries' week range
      if (newWeekStartString !== existingWeekStartString) {
        
        // Check if the new week header has already been created
        if (!weekEntries[newWeekStartString]) {
          
          // Create a new week entry header
          const newWeekEntryHeader = document.createElement("div");
          newWeekEntryHeader.classList.add("week-entry");
          newWeekEntryHeader.innerHTML = `
            <div class='week-header'>
              <p id='week-date-range'>${newWeekStartString} - ${calculateWeekEndDate(changeDateObject)}</p>
              <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
            </div>
          `;
          
          timeInfoContainer.appendChild(newWeekEntryHeader);
          weekEntries[newWeekStartString] = newWeekEntryHeader;
    
          // Remove the old week header if no entries are associated with it
          if (weekEntries[existingWeekStartString]) {
            const oldWeekEntry = weekEntries[existingWeekStartString];
            if (oldWeekEntry.querySelectorAll(".time-entry").length === 0) {
              oldWeekEntry.remove();
              delete weekEntries[existingWeekStartString];
            }
          }
        }
      }
      // Update the start date of the existing entry
      const startDateElements = document.querySelectorAll(".startDate");
      startDateElements.forEach((startDateElement) => {
        startDateElement.innerHTML = changeDateString;
      });
    
      // Update the week entry of the existing time entry
      const timeEntry = changeInput.closest(".time-entry");
      const currentWeekStartString = timeEntry.getAttribute("data-week-start");
      if (currentWeekStartString !== newWeekStartString) {
        const newWeekEntry = weekEntries[newWeekStartString];
        newWeekEntry.appendChild(timeEntry);
        timeEntry.setAttribute("data-week-start", newWeekStartString);

        updateWeekTotals();
        
        const oldWeekEntry = weekEntries[currentWeekStartString];
        if (oldWeekEntry) {
          const timeEntriesInOldWeek = oldWeekEntry.querySelectorAll(".time-entry");
          if (timeEntriesInOldWeek.length === 0) {
            oldWeekEntry.remove();
            delete weekEntries[currentWeekStartString];
          }
        }
        //  if (weekEntries[currentWeekStartString]) {
        //   removeWeekHeader(currentWeekStartString);
        // }
      }

      // Recalculate the week total for both the old and new week ranges
      updateWeekTotal(existingWeekStartString);
      updateWeekTotal(newWeekStartString);
    });
  
    const removeWeekHeader = (weekStartDateString) => {
      const weekEntry = weekEntries[weekStartDateString];
      const timeEntriesInWeek = weekEntry.querySelectorAll(".time-entry");
      if (timeEntriesInWeek.length === 0) {
        weekEntry.remove();
        delete weekEntries[weekStartDateString]
      }
    };

    updateWeekTotal(weekStartDateString);
    removeWeekHeader(weekStartDateString);
    startingBox.classList.remove('hidden')
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
}
);

