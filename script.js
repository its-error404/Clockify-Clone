   //TODO: checking duplicate entry date
   //line 249

   // const duplicateButton = newTimeEntry.querySelector(".duplicate-item");
    // duplicateButton.addEventListener("click", () => {
    //   const duplicateEntry = newTimeEntry.cloneNode(true);

    //   addEventListenersToEntry(duplicateEntry);
    //   updateWeekTotal(weekStartDateString);

    //   weekEntries[weekStartDateString].appendChild(duplicateEntry);
    //   updateWeekTotal(weekStartDateString);

    //   const cloneDuplicateButton = duplicateEntry.querySelector(".duplicate-item");
    //   cloneDuplicateButton.addEventListener("click", () => {
    //     const clonedDuplicateEntry = duplicateEntry.cloneNode(true);
    //     addEventListenersToEntry(clonedDuplicateEntry);

    //     weekEntries[weekStartDateString].appendChild(clonedDuplicateEntry);
    //     updateWeekTotal(weekStartDateString);
    //   });

    //   const deleteButton = newTimeEntry.querySelector(".delete-item");
    //   deleteButton.addEventListener("click", () => {
    //     newTimeEntry.remove();
    //     updateWeekTotal(weekStartDateString);
    //   });

    //   const duplicateDeleteButton = duplicateEntry.querySelector(".delete-item");
    //   duplicateDeleteButton.addEventListener("click", () => {
    //     duplicateEntry.remove();
    //     updateWeekTotal(weekStartDateString);
    //   });
    // });




  //     const changedStartOfWeek = new Date(changeDateObject);
  //     const changedEndOfWeek = new Date(changeDateObject);

  //     changedStartOfWeek.setDate(changeDateObject.getDate() - changeDateObject.getDay());
  //     changedEndOfWeek.setDate(changeDateObject.getDate() + (6 - changeDateObject.getDay()));

  //     const changedWeekStartDateString = changedStartOfWeek.toUTCString().substring(0, 11);
  //     const changedWeekEndDateString = changedEndOfWeek.toUTCString().substring(0, 11);

      
    // const entryRect = entry.getBoundingClientRect();
          // const dropdownRect = duplicateEntry.querySelector(".edit-dropdown").getBoundingClientRect();
          
          // const dropdownLeft = dropdownRect.left - entryRect.left;
          // const dropdownTop = dropdownRect.top - entryRect.top;
          // const dropdownWidth  = 110
          // // Apply the calculated position to the duplicated dropdown
          // const duplicateDropdown = duplicateEntry.querySelector(".edit-dropdown");
          // duplicateDropdown.style.left = `${dropdownLeft + dropdownWidth}px`;
          // duplicateDropdown.style.top = `${dropdownTop}px`;
          // duplicateDropdown.style.width = 110
 
// before reset timer


      // if (!weekEntries[changedWeekStartDateString]) {
      //   const manualWeekEntry = document.createElement("div");
      //   manualWeekEntry.classList.add("week-entry");
      //   manualWeekEntry.innerHTML = `
      //   <div class='week-header'>
      //       <p id='week-date-range'>${changedWeekStartDateString} - ${changedWeekEndDateString}</p>
      //       <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
      //   </div>
      //   `;

  //       timeInfoContainer.appendChild(manualWeekEntry);
  //       weekEntries[changedWeekStartDateString] = manualWeekEntry;
  //       updateWeekTotal(changedWeekStartDateString);
  //     } 
      
  //     // else {
  //     //   weekEntries[changedWeekStartDateString].appendChild(newTimeEntry);
  //     // }

  //     if (weekEntries[weekStartDateString]) {
  //       weekEntries[weekStartDateString].remove();
  //       delete weekEntries[weekStartDateString];
  //     }
  //     updateWeekTotal(changedWeekStartDateString);

  //   });
   
  //   if (!weekEntries[weekStartDateString]) {
  //     weekEntries[weekStartDateString] = document.createElement("div");
  //     weekEntries[weekStartDateString].classList.add("week-entry");
  //     weekEntries[weekStartDateString].innerHTML = `
  //     <div class='week-header'>
  //         <p id='week-date-range'>${weekStartDateString} - ${weekEndDateString}</p>
  //         <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
  //     </div>
  //     `;
  //     timeInfoContainer.appendChild(weekEntries[weekStartDateString]);
  //   }
  //   updateWeekTotal(weekStartDateString);
  //   addEventListenersToEntry(newTimeEntry);
  //   weekEntries[weekStartDateString].appendChild(newTimeEntry);

    
  //   const removeWeekHeader = (weekStartDateString) => {
  //     const weekEntry = weekEntries[weekStartDateString];
  //     const timeEntriesInWeek = weekEntry.querySelectorAll(".time-entry");
  //     if (timeEntriesInWeek.length === 0) {
  //       weekEntry.remove();
  //     }
  //   };

  //   updateWeekTotal(weekStartDateString);
  //   removeWeekHeader(weekStartDateString);
  //   startingBox.classList.remove('hidden')
  // };






    // const changedStartOfWeek = new Date(changeDateObject);
    // changedStartOfWeek.setDate(changeDateObject.getDate() - changeDateObject.getDay());
    // const changedWeekStartDateString = changedStartOfWeek.toUTCString().substring(0, 11);
    // const changedWeekEndDateString = changedEndOfWeek.toUTCString().substring(0, 11);

    // if (!weekEntries[changedWeekStartDateString]) {

    //   addEventListenersToEntry(newTimeEntry);
    //   weekEntries[changedWeekStartDateString] = document.createElement("div");
    //   weekEntries[changedWeekStartDateString].classList.add("week-entry");
    //   weekEntries[changedWeekStartDateString].innerHTML = `
    //   <div class='week-header'>
    //       <p id='week-date-range'>${changedWeekStartDateString} - ${changedWeekEndDateString}</p>
    //       <p class='week-total'>Week total: <span class='calculated-week-time'>00:00:00</span></p>
    //   </div>
    //   `;
    //   weekEntries[changedWeekStartDateString].appendChild(newTimeEntry);
    //   timeInfoContainer.appendChild(weekEntries[changedWeekStartDateString]);
    // }
    // else{
    //   weekEntries[changedWeekStartDateString].appendChild(newTimeEntry);
    //   addEventListenersToEntry(newTimeEntry);
    // }
 

    // updateWeekTotal(weekStartDateString);
    // removeWeekHeader(changedWeekStartDateString);