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
  
    const weekEntries = {};
  
    const addWeekHeader = (weekStartDateString) => {
      const weekHeader = document.createElement("div");
      weekHeader.classList.add("week-header");
      weekHeader.innerHTML = `
        <p id='week-date-range'>${weekStartDateString} - ...</p>
        <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
      `;
      timeInfoContainer.appendChild(weekHeader);
      weekEntries[weekStartDateString] = weekHeader;
    };
  
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
      weekTotalSpan.innerHTML = formatTime(weekTotalTime * 1000);
    }
  
    function formatTime(milliseconds) {
      const time = new Date(milliseconds);
      const hours = time.getUTCHours().toString().padStart(2, "0");
      const minutes = time.getUTCMinutes().toString().padStart(2, "0");
      const seconds = time.getUTCSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
  
    const removeWeekHeader = (weekStartDateString) => {
      const weekHeader = weekEntries[weekStartDateString];
      if (weekHeader) {
        weekHeader.remove();
        delete weekEntries[weekStartDateString];
      }
    };
  
      const addTimeEntry = (startDateString, trackedTime, projectDescription) => {
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
              <input type='date' id='manual-input'>
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
      const addEventListenersToEntry = (entry) => {
        const editOptions = entry.querySelector(".edit-options");
        const editDropdown = entry.querySelector(".edit-dropdown");
    
        const toggleDropdown = () => {
          editDropdown.classList.toggle("visible");
    
          const rect = editOptions.getBoundingClientRect();
          editDropdown.style.left = `${rect.right-100}px`;
          editDropdown.style.top = `${rect.top+50}px`;
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
            
            const weekStartDateString = getWeekStartDateString(entry)
            weekEntries[weekStartDateString].appendChild(duplicateEntry);
            updateWeekTotal(weekStartDateString);
          });
        };
      
        const deleteEntryHandler = (entry) => {
          const deleteButton = entry.querySelector(".delete-item");
          deleteButton.addEventListener("click", () => {
            const weekStartDateString = getWeekStartDateString(entry);
            removeTimeEntry(weekStartDateString, entry);
      
            if (weekEntries[weekStartDateString].querySelectorAll(".time-entry").length === 0) {
              removeWeekHeader(weekStartDateString);
            }
          });
        };
    
        duplicateEntryHandler(entry); 
        deleteEntryHandler(entry);
      };
    
      addEventListenersToEntry(newTimeEntry)
      weekEntries[startDateString].appendChild(newTimeEntry)
      updateWeekTotal(startDateString)
    }
  
    const initialStartDate = manualStartDateInput.value;
    const initialTrackedTime = timerDisplay.innerHTML;
    const initialProjectDescription = projectDescriptionInput.value;
    addTimeEntry(initialStartDate, initialTrackedTime, initialProjectDescription);
  
    const changeInput = document.querySelector('#manual-input')
    console.log(changeInput)
    changeInput.addEventListener("change", () => {
      const changeDate = changeInput.value;
      const changeDateObject = new Date(changeDate);
  
      const changedStartOfWeek = new Date(changeDateObject);
      const changedEndOfWeek = new Date(changeDateObject);
  
      changedStartOfWeek.setDate(changeDateObject.getDate() - changeDateObject.getDay());
      changedEndOfWeek.setDate(changeDateObject.getDate() + (6 - changeDateObject.getDay()));
  
      const changedWeekStartDateString = changedStartOfWeek.toUTCString().substring(0, 11);
      const changedWeekEndDateString = changedEndOfWeek.toUTCString().substring(0, 11);
  
      const changeDateString = changeDateObject.toUTCString().substring(0, 11);
  
      const startDateElements = document.querySelectorAll(".startDate");
      startDateElements.forEach((startDateElement) => {
        startDateElement.textContent = changeDateString;
      });
  
      const weekStartDateString = changedWeekStartDateString;
      const weekEntry = weekEntries[weekStartDateString];
      if (!weekEntry) {
        addWeekHeader(weekStartDateString);
      }
  
      updateEntriesAndTotal(weekStartDateString)
    })
  
    const updateEntriesAndTotal = (weekStartDateString) => {
      const weekEntry = weekEntries[weekStartDateString];
      const trackedTimeSpans = weekEntry.querySelectorAll(".calculated-time");
  
      let weekTotalTime = 0;
      trackedTimeSpans.forEach((trackedTimeSpan) => {
        const timeParts = trackedTimeSpan.textContent.split(":");
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);
        weekTotalTime += hours * 3600 + minutes * 60 + seconds;
      });
  
      weekEntry.querySelector(".calculated-week-time").textContent = formatTime(weekTotalTime * 1000);
    };
  
    const removeTimeEntry = (weekStartDateString, timeEntry) => {
      timeEntry.remove();
      updateEntriesAndTotal(weekStartDateString);
    };
  
    const deleteEntryHandler = (entry) => {
      const deleteButton = entry.querySelector(".delete-item");
      deleteButton.addEventListener("click", () => {
        const weekStartDateString = getWeekStartDateString(entry);
        const weekEntry = weekEntries[weekStartDateString];
        removeTimeEntry(weekStartDateString, entry);
  
        if (weekEntry && weekEntry.querySelectorAll(".time-entry").length === 0) {
          removeWeekHeader(weekStartDateString);
        }
      });
    };
  
    const getWeekStartDateString = (timeEntry) => {
      const startDateElement = timeEntry.querySelector(".startDate");
      return startDateElement.textContent.trim();
    };
  
    
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
    
      addTimeEntry(startDateString, trackedTime, projectDescription); // Call addTimeEntry
    
      const weekEntry = weekEntries[weekStartDateString];
      if (!weekEntry) {
        addWeekHeader(weekStartDateString);
      }
    
      updateEntriesAndTotal(weekStartDateString); // Call updateEntriesAndTotal
    
      // Rest of your code for updating the UI and other elements
    };
  
    const resetTimer = () => {
      timerDisplay.innerHTML = "00:00:00";
    };
  
    startButton.addEventListener("click", () => {
      if(validateInput){
  
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
      }
    });
  
    
  
    addWeekHeader("Initial Week Start Date");
    updateWeekTotal("Initial Week Start Date");
    addEventListenersToEntry(newTimeEntry); // Call this after newTimeEntry is created
    startingBox.classList.remove('hidden'); // Show the starting box
  
    // Call the initial time entry function
   
  })
  