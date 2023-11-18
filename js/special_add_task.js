
// Funktion zum Hinzufügen des Event-Listeners
function addClickEventListener() {
    clickEventListener = function (event) {
        const assignedToInput = document.getElementById('assignedTo');
        const assignedToContainer = document.getElementById('assignedToContainer');

        // Prüfe, ob der Klick außerhalb des Eingabefelds und der Auswahlliste liegt
        if (event.target !== assignedToInput && event.target !== assignedToContainer) {
            // Schließe die Auswahlliste
            assignedToContainer.classList.add('d-none');
        }
    };

    document.addEventListener('click', clickEventListener);
}


// Funktion zum Entfernen des Event-Listeners
function removeClickEventListener() {
    if (clickEventListener) {
        document.removeEventListener('click', clickEventListener);
    }
}