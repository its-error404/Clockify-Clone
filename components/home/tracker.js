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

  //converts milliseconds time to hours:minutes:seconds
  function formatTime(milliseconds) {
    const time = new Date(milliseconds);
    const hours = time.getUTCHours().toString().padStart(2, "0");
    const minutes = time.getUTCMinutes().toString().padStart(2, "0");
    const seconds = time.getUTCSeconds().toString().padStart(2, "0");
    // console.log(time.getUTCSeconds().toString().padStart(2,'0'))
    return `${hours}:${minutes}:${seconds}`;
  }

  const weekEntries = {};

  const updateWeekTotal = (weekStartDateString) => {
    const weekEntry = weekEntries[weekStartDateString];
    const weekTotal = weekEntry.querySelector(".calculated-week-time");
    let weekTotalTime = 0;

    const trackedTimeSpans = weekEntry.querySelectorAll(".calculated-time");
    trackedTimeSpans.forEach((trackedTimeSpan) => {
      const timeParts = trackedTimeSpan.textContent.split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      const seconds = parseInt(timeParts[2]);
      // console.log(timeParts[2])
      // console.log(seconds)
      weekTotalTime = weekTotalTime + (hours * 3600) + (minutes * 60) + seconds;
    });                                  //convert from milliseconds to seconds
    weekTotal.textContent = formatTime(weekTotalTime * 1000);
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

    const duplicateButton = document.querySelectorAll(".duplicate-item");
    for (let i = 0; i < duplicateButton.length; i++) {
      duplicateButton[i].addEventListener("click", () => {
        const duplicateEntry = newTimeEntry.cloneNode(true);
   
  const newDateInput = document.createElement("input");
  newDateInput.type = "date";
  newDateInput.placeholder = "Enter new date";
  duplicateEntry.querySelector(".date-container").appendChild(newDateInput);

  var parentContainer = newTimeEntry.parentNode;
  parentContainer.appendChild(duplicateEntry);

  newDateInput.addEventListener("change", (e) => {
      const newDate = e.target.value;
      duplicateEntry.querySelector(".startDate").textContent = newDate;
  });

  const duplicateEditOptions = duplicateEntry.querySelector(".edit-options");
  console.log(duplicateEditOptions)
  const duplicatedEditDropdown = duplicateEntry.querySelector(".edit-dropdown");
  console.log(duplicatedEditDropdown)

  duplicateEditOptions.addEventListener("click", (e) => {
    duplicatedEditDropdown.classList.toggle("visible");
    e.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    if (!duplicatedEditDropdown.contains(e.target)) {
      duplicatedEditDropdown.classList.remove("visible");
    }
  });

  // Inside the 'duplicateButton' event listener
duplicateButton[i].addEventListener("click", () => {
  const duplicateEntry = newTimeEntry.cloneNode(true);

  // ... (input field and other code)

  // Now, select the duplicate button within the duplicated entry
  const duplicateButtonInsideEntry = duplicateEntry.querySelector(".duplicate-item");

  // Add an event listener to the duplicate button inside the duplicated entry
  duplicateButtonInsideEntry.addEventListener("click", () => {
      // Duplicating process similar to what you already have
      const newDuplicateEntry = duplicateEntry.cloneNode(true);

      // ... (updating date based on input)

      parentContainer.appendChild(newDuplicateEntry);

      // Add the class and event listener again for the newly duplicated entry
      const newDuplicateButton = newDuplicateEntry.querySelector(".duplicate-item");
      newDuplicateButton.addEventListener("click", () => {
          // Duplicating process for the newly duplicated entry
          // ...
      });

      // ...
  });

  // Rest of your code
  updateWeekTotal(weekStartDateString);
  // ...
});

  updateWeekTotal(weekStartDateString);
});

        
        // const duplicateEntryTime = duplicateEntry.querySelector(".calculated-time");
        // console.log(duplicateEntryTime)
        // const duplicateEntryTimeParts = duplicateEntryTime.textContent.split(":");
        // const duplicateEntryHours = parseInt(duplicateEntryTimeParts[0]);
        // const duplicateEntryMinutes = parseInt(duplicateEntryTimeParts[1]);
        // const duplicateEntrySeconds = parseInt(duplicateEntryTimeParts[2]);
        // const duplicateEntryMilliseconds = ((duplicateEntryHours * 3600) + (duplicateEntryMinutes * 60) + (duplicateEntrySeconds)) * 1000; 
        // takenTime += duplicateEntryMilliseconds;

        // duplicateEntryTime.textContent = formatTime(duplicateEntryMilliseconds);

        var parentContainer = newTimeEntry.parentNode
        parentContainer.appendChild(duplicateEntry)
        
        updateWeekTotal(weekStartDateString);

 
        updateWeekTotal(weekStartDateString);
      }
    
    

    const deleteButton = newTimeEntry.querySelector(".delete-item");
    deleteButton.addEventListener("click", () => {
      const trackedTimeSpan = newTimeEntry.querySelector(".calculated-time");
      const trackedTimeParts = trackedTimeSpan.textContent.split(":");
      const trackedHours = parseInt(trackedTimeParts[0]);
      const trackedMinutes = parseInt(trackedTimeParts[1]);
      const trackedSeconds = parseInt(trackedTimeParts[2]);
      const trackedMilliseconds =
        (trackedHours * 3600 + trackedMinutes * 60 + trackedSeconds) * 1000;

      takenTime -= trackedMilliseconds;

      const weekEntry = newTimeEntry.closest(".week-entry");
      weekEntry.removeChild(newTimeEntry);

      updateWeekTotal(weekStartDateString);
    });
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
