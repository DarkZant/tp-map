let stateDropZone = document.getElementById('mapStateFile');
let stateDropZoneText = document.getElementById("mapStateFileText");
let stateFileInput = document.getElementById('mapStateImport');

stateFileInput.addEventListener('change', (e) => {
    let files = e.target.files;
    manageStateFile(files[0]);
});

stateDropZone.addEventListener('click', () => {
    stateFileInput.click();
});

stateDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    stateDropZone.classList.add('dragover');
});

stateDropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    stateDropZone.classList.remove('dragover');
  });
stateDropZone.addEventListener('dragend', (e) => {
    stateDropZone.classList.remove('dragover');
});

stateDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    stateDropZone.classList.remove('dragover');

    let files = e.dataTransfer.files;
    manageStateFile(files[0]);
});

function displayStateInvalidFile() {
    let currentText = stateDropZoneText.innerHTML;
    stateDropZoneText.innerHTML = "Invalid file!";
    setTimeout(() => {
        stateDropZoneText.innerHTML = currentText;
    }, 2000);
}

function downloadMapState() {
    let saveObject = {};
    for (storageUnit of [settingsSU, flagsSU, trackerSU])
        saveObject[storageUnit.getName()] = storageUnit.getAllFlags();
    saveObject[notesStorageName] = localStorage.getItem(notesStorageName);

    let text = JSON.stringify(saveObject, undefined, 2);
    let a = document.createElement('a');
    let type = name.split(".").pop();
    a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
    a.download = "tp-map_state.json";
    a.click();
}

function manageStateFile(file) {
    if (!file.name.toLowerCase().endsWith('.json')) {
        displayStateInvalidFile();
        return;
    }

    let reader = new FileReader();

    reader.onload = (e) => {
        let textResult = e.target.result;
        let data = JSON.parse(textResult);
        try {
            for (storageUnit of [settingsSU, flagsSU, trackerSU])
                storageUnit.setAllFlags(data[storageUnit.getName()]);

            blockMapReloading();
            syncFlagsWithLocalStorage();
            syncTrackerWithLocalStorage();
            syncSettingsWithLocalStorage();
            if (!unblockMapReloading())
                reloadMap();

            setAndSaveNotes(data[notesStorageName]);

            let currentText = stateDropZoneText.innerHTML;
            stateDropZoneText.innerHTML = "Success!";
            setTimeout(() => {
                stateDropZoneText.innerHTML = currentText;
            }, 2000);
        } 
        catch (error) {
            displayStateInvalidFile()
            console.log(error);
        }
    }

    reader.readAsText(file);
}