let notes = document.getElementById('notesInput');
const notesStorageName = 'notes';
window.addEventListener('DOMContentLoaded', () => {
    let savedNotes = localStorage.getItem(notesStorageName);
    if (savedNotes !== null) {
        notes.value = savedNotes;
}
});

let lastCall = 0;
let msDelay = 1000;
function saveWithDelay() {
    let now = Date.now();
    if (now - lastCall >= msDelay) {
        lastCall = now;
        setTimeout(() => {
            localStorage.setItem(notesStorageName, this.value);
        }, msDelay);
    }
}

notes.addEventListener('input', saveWithDelay);