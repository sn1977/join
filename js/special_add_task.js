document.addEventListener('click', function (event) {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');

    // Überprüfen, ob das Klickereignis nicht im Dropdown-Menü oder im Eingabefeld stattfindet
    if (
        event.target !== assignedToContainer &&
        event.target !== assignedToInput &&
        !assignedToContainer.contains(event.target)
    ) {
        assignedToContainer.classList.add('d-none');
    }
});



// JavaScript, um die Platzhalteroption auszuwählen
document.getElementById("category").selectedIndex = 0;
//Mindestdatum bei Fällig bis = heute
document.getElementById("dueDate").min = new Date().toISOString().split("T")[0];
//Fokus für subtask Input field
const subtaskInput = document.getElementById("subtask");
const subtaskContainer = document.querySelector(".subtaskContainer");

subtaskInput.addEventListener("focus", () => {
    subtaskContainer.style.borderColor = "#29ABE2"; // Ändere die Border-Farbe auf Fokus
});

subtaskInput.addEventListener("blur", () => {
    subtaskContainer.style.borderColor = "#D1D1D1"; // Ändere die Border-Farbe zurück, wenn der Fokus verloren geht
});

$(document).ready(function () {
    $("#dueDate").datepicker();
});


const assignedToInput = document.getElementById('assignedTo');
assignedToInput.addEventListener('input', filterContacts);


document.addEventListener('click', function (event) {
    const assignedToInput = document.getElementById('assignedTo');
    const assignedToContainer = document.getElementById('assignedToContainer');

    // Prüfe, ob der Klick außerhalb des Eingabefelds und der Auswahlliste liegt
    if (event.target !== assignedToInput && event.target !== assignedToContainer) {
        // Schließe die Auswahlliste
        assignedToContainer.classList.add('d-none');
    }
});
