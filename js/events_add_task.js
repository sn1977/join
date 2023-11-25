/**
 * Event listener for Add Task without a separate function call
 * Hides or shows the 'assignedToContainer' based on the click event's target
 * 
 * @param {Event} event - The click event.
 * 
 */
document.addEventListener('click', function (event) {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');

    if (assignedToContainer) {
        assignedToContainer.classList.remove('d-none');

        // Überprüfen, ob das Klickereignis nicht im Dropdown-Menü oder im Eingabefeld stattfindet
        if (
            event.target !== assignedToContainer &&
            event.target !== assignedToInput &&
            !assignedToContainer.contains(event.target)
        ) {
            assignedToContainer.classList.add('d-none');
        }
    }
});


/**
 * Initializes the datepicker for 'dueDate' and sets the minimum date to today
 * 
 */
$(document).ready(function () {
    var currentDate = new Date();
    $("#dueDate").datepicker({
        minDate: currentDate,  
        dateFormat: 'dd/mm/yy' 
    });
    $("#dueDate").on("input", function () {
        var selectedDate = $("#dueDate").datepicker("getDate");

        var warningDueDate = $("#warningDueDate");

        if (selectedDate < currentDate) {
            warningDueDate.text("Das Datum sollte mindestens heute sein");
            warningDueDate.removeClass("invisible");
        } else {
            warningDueDate.addClass("invisible");
        }
    });
});


/**
 * Changes the border color of the 'subtaskContainer' when the 'subtaskInput' is focused or blurred
 * 
 */
let subtaskInput = document.getElementById("subtask");
let subtaskContainer = document.querySelector(".subtaskContainer");


/**
 * Event handler for the focus event on the 'subtaskInput'
 * 
 */
subtaskInput.addEventListener("focus", () => {
    subtaskContainer.style.borderColor = "#29ABE2";
});


/**
 * Event handler for the blur event on the 'subtaskInput'
 * 
 */
subtaskInput.addEventListener("blur", () => {
    subtaskContainer.style.borderColor = "#D1D1D1";
});