/**
 * Eventlistener für Add Task ohne gesonderten Funtkionsaufruf
 * 
 * 
 * 
 * 
 */
document.addEventListener('click', function (event) {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');

    if (assignedToContainer) {
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


// filter assignedTo
const assignedToInput = document.getElementById('assignedTo');
assignedToInput.addEventListener('input', filterContacts);


// placeholder select category 
document.getElementById("category").selectedIndex = 0;


//datepicker and min date = today for dueDate
$(document).ready(function () {
    // Aktuelles Datum abrufen
    var currentDate = new Date();

    // Datepicker initialisieren
    $("#dueDate").datepicker({
        minDate: currentDate, // Das heutige Datum als Mindestdatum festlegen
        dateFormat: 'dd/mm/yy' // Datumsformat festlegen
    });

    // Event-Listener hinzufügen
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

//focus subtask Input field change border colour
let subtaskInputX = document.getElementById("subtask");
let subtaskContainer = document.querySelector(".subtaskContainer");

subtaskInputX.addEventListener("focus", () => {
    subtaskContainer.style.borderColor = "#29ABE2"; // Ändere die Border-Farbe auf Fokus
});

subtaskInputX.addEventListener("blur", () => {
    subtaskContainer.style.borderColor = "#D1D1D1"; // Ändere die Border-Farbe zurück, wenn der Fokus verloren geht
});