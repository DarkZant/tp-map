trackedItems.push(...[
    ganondorf, forestMap, forestCompass, minesMap, minesCompass, lakebedMap,
    lakebedCompass, arbiterMap, arbiterCompass, snowpeakMap, snowpeakCompass,
    templeMap, templeCompass, cityMap, cityCompass, palaceMap, palaceCompass,
    castleMap, castleCompass
]); // Always add items at the end to preserve storage IDs

let trackerModified = true;
document.addEventListener('trackerUpdated', function () {
    if (!trackerModified)
        trackerModified = true;
})

// Assign Items to TrackerItems
for (let item of trackedItems) {
    let imageSrc = item.getBaseImageSrc();
    // Harcoded exceptions for items with duplicate images
    // Should use item names for all but too lazy to put data-item on all .titem Divs
    if (imageSrc.includes('Small_Key.png') || imageSrc.includes('Boss_Key.png') || 
        imageSrc.includes('Dungeon_Map') || imageSrc.includes('Compass'))
        trackerItems.set(item.name, new TrackerItem(item));   
    else
        trackerItems.set(imageSrc, new TrackerItem(item));       
}
// Assign .titem Divs to TrackerItems
for (let titemDiv of document.querySelectorAll('.titem')) {
    let baseIconPath = "Icons/";
    // Check if titemDiv has assigned item
    if ("item" in titemDiv.dataset) {
        let trackerItem = trackerItems.get(titemDiv.dataset.item);
        trackerItem.setElem(titemDiv);
    }
    else {
        let imgSrc = titemDiv.getElementsByClassName('timage')[0].src;
        let itemImgName = imgSrc.split(baseIconPath)[1];
        let trackerItem = trackerItems.get(baseIconPath + itemImgName);
        trackerItem.setElem(titemDiv);
    }
}
// Create StorageUnit for TrackerItems
let aloneTrackerSU = new StorageUnit("tracker/tracker", trackerItems.values());
// Initialize TrackerItems
for (let trackerItem of trackerItems.values()) 
    trackerItem.initialize();

function resetButton(button) {
    resetButtonText(button);
    resetTracker();
    resetButtonsFeedback(button); 
}

let syncButton = document.getElementById("syncButton");
syncButton.addEventListener('contextmenu', syncEveryInterval);
let oldSavedMapStates = localStorage.getItem(trackerSUName);

function syncWithMap() {
    let savedMapStates = localStorage.getItem(trackerSUName);
    if (oldSavedMapStates === savedMapStates && !trackerModified) {
        if (!syncIsActivated()) {
            resetButtonsFeedback(syncButton, 'Already Synced!');
            return false;
        }
        return true;
    }
    trackerModified = false;
    oldSavedMapStates = savedMapStates;

    if (savedMapStates === null) {
        resetButtonsFeedback(syncButton, 'Go To Map First!');
        return false;
    }

    let trackerItemsArray = Array.from(trackerItems.values());

    for (let i = 0; i < savedMapStates.length; ++i) {
        let trackerItem = trackerItemsArray[i];
        trackerItem.initialized = false;
        trackerItem.reset();
        let savedValue = aloneTrackerSU.convertStoredValueToNumber(savedMapStates[i], trackerItem.getMaxStoreValue());
        trackerItem.initialize(savedValue);
        trackerItem.save();
    }

    return true;
}

function syncWithMapButton() {
    if (syncIsActivated()) {
        stopSyncInterval();
        return;
    }
    resetButtonText(syncButton, 'Syncing...');
    let shouldShowFeedback = syncWithMap();
    if (shouldShowFeedback)
        resetButtonsFeedback(syncButton, 'Syncing done!')
}

let syncInterval;

function syncIsActivated() {
    return syncInterval !== undefined;
}

function syncEveryInterval() {
    syncInterval = setInterval(syncWithMap, 1000);
    resetButtonText(syncButton, "Syncing every second...");
    syncButton.style.backgroundColor = "#3a7d50";
    syncButton.removeEventListener('contextmenu', syncEveryInterval);
    syncButton.addEventListener('contextmenu', stopSyncInterval);
} 

function stopSyncInterval() {
    clearInterval(syncInterval);
    syncInterval = undefined;
    resetButtonsFeedback(syncButton, "Syncing stopped!");
    syncButton.style.backgroundColor = "#272521";
    syncButton.removeEventListener('contextmenu', stopSyncInterval);
    syncButton.addEventListener('contextmenu', syncEveryInterval);
}

function resetButtonText(button, text="Resetting...") {
    if (button.originalText === undefined)
        button.originalText = button.innerHTML;
    button.innerHTML = text;
}
function resetButtonsFeedback(button, text="Reset done!") {
    button.innerHTML = text;
    button.disabled = true;
    button.classList.remove('setbh');
    button.style.cursor = 'default';
    button.style.pointerEvents = "none";

    setTimeout(function() {
        button.innerHTML = button.originalText;
        button.disabled = false;
        button.classList.add('setbh');
        button.style.cursor = 'pointer';
        button.style.pointerEvents = "";
    }, 2000);
}

function toMap() {
    window.location.href = "../";
}

function showControls() {
    document.getElementById('controls').style.visibility = "visible";
    document.body.style.backgroundColor = "rgba(14, 13, 12)";
    let tracker = document.getElementById('tracker');
    tracker.style.pointerEvents = 'none';
    tracker.style.filter = "brightness(25%)";
}

function hideControls() {
    document.getElementById('controls').style.visibility = "hidden";
    document.body.style.backgroundColor = "#1d1a14";
    let tracker = document.getElementById('tracker');
    tracker.style.pointerEvents = 'all';
    tracker.style.filter = "";
}
