let seedIsLoaded = false;
let setFlagsHidden = false;
let blockMapReset = false;
let storedMapReload = false;
let menuDisplacement = 0;
let currentMapState;
let loadedSubmap;
let loadedBackground;

const MapStates = Object.freeze({
    ImageMap: 0,
    TileMap: 1,
    Dungeon: 2,
    Submap: 3,
    FlooredSubmap: 4
});
const mapCenter = [-4913, 4257.5];
const map = L.map('map', {
        zoom: -5,
        minZoom: -5,
        maxZoom: 0,
        center: mapCenter,
        crs: L.CRS.Simple,
        maxBoundsViscosity: 1,
        zoomControl: false,
        keyboard: false,
        doubleClickZoom: false,
        bounds: [[500, -500], [-10836, 10676]],
        dragging: false
}); 
const tileLayer = L.tileLayer('Tiles/{z}/{x}/{y}.png', {
    maxZoom: 0,
    minZoom: -6,
    zoomOffset: 6,
    crs: L.CRS.Simple,
    bounds: [[0, 0], [-9826, 8515]] 
});

// Markers and Icons
const icons = new Map();
function getIcon(image) {
    if (image in icons.keys())
        return icons.get(image);

    let width = image.width;
    let height = image.height;
    let mult = window.innerWidth <= window.innerHeight ? window.innerWidth / 1600 : window.innerHeight / 739;
    let maxSize = 50 * mult;
    if (maxSize > 60)
        maxSize = 60;
    else if (maxSize < 30)
        maxSize = 30;
    if (width >= height) {
        height = height / width * maxSize;
        width = maxSize;
    }
    else {
        width = width / height * maxSize;
        height = maxSize;
    }
    let icon = L.icon({iconUrl: image.src, iconSize: [width, height]});
    icons.set(image, icon);
    return icon; 
}

function getIconWithCheckmark(icon) {
     return L.divIcon({ 
        iconUrl: icon.options.iconUrl,
        iconSize: icon.options.iconSize,
        html: '<img src="' + icon.options.iconUrl + '" width="' + icon.options.iconSize[0] + 'px"' +
              'height="' + icon.options.iconSize[1] + '"><img src="Icons/Checkmark.png" class="checkmark">'
    });
}

function getCounterIcon(icon, num) {
    return L.divIcon({ 
        iconUrl: icon.options.iconUrl,
        iconSize: icon.options.iconSize,
        html: '<img src="' + icon.options.iconUrl + '" width="' + icon.options.iconSize[0] + 'px"' +
              'height="' + icon.options.iconSize[1] + '"><div class="cpt subcpt">' + num + '</div>'
    });
}

function layerIsLoaded(marker) {
    return map.hasLayer(marker);
}

function showMarkerAsSet(marker, iconImage) {
    marker.setOpacity(0.7);
    marker.setZIndexOffset(marker._zIndex - 1000);
    marker.setIcon(getIconWithCheckmark(getIcon(iconImage)));
    if (!layerIsLoaded(marker))
        return;
    marker.getElement().classList.remove("unmarked");
    marker.getElement().classList.add("marked");
}

function showMarkerAsNotSet(marker, iconImage) {
    marker.setOpacity(1);
    marker.setZIndexOffset(marker._zIndex + 1000);
    marker.setIcon(getIcon(iconImage));
    if (!layerIsLoaded(marker))
        return;
    marker.getElement().classList.remove("marked");
    marker.getElement().classList.add("unmarked");
}

function showMarkerAsUnobtainable(marker) {
    marker.setZIndexOffset(-500);
    if (!layerIsLoaded(marker))
        return;
    marker.getElement().classList.add("unobtainable");
}  

function addTooltipToMarker(marker, tooltipText, sticky=false) {
    if (marker.getTooltip() !== null) 
        marker.unbindTooltip();

    marker.bindTooltip(tooltipText, {
        direction: 'top',
        offset: [0, -25],
        opacity: 0.95,
        sticky: sticky,
        permanent: false
    });
}

function displayContainer(container) {
    return '<img class="ii iti" src="' + container.getContent().image.src + '">' +
    '<p class="itp">' + container.getContentName() + '</p>';
}

function displayItem(item, cSSClass="iti") {
    return '<img class="ii ' + cSSClass + '" src="' + item.image.src + '">' +
    '<p class="itp">' + item.name + '</p>';
}

function displayRequirement(requirement, cSSClass="iti") {
    return '<img class="ii ' + cSSClass + '" src="' + requirement.image.src + '">' +
    '<p class="itp">' + requirement.text + '</p>';
}


// Image Map
function loadImageMapFromTileMap() {
    if (map.getZoom() != -5)
        return;
    document.getElementById('credit').style.display = 'block';   
    map.setView([0, 0], -4);
    map.setMinZoom(-4);
    if (window.innerWidth >= 1000 && window.innerHeight >= 700)
        map.dragging.disable();
    map.setMaxBounds([[500, -500], [-10836, 10676]]); 
    map.off('zoomend', loadImageMapFromTileMap);    
    if (document.getElementById('flagDetails').style.visibility == 'visible')
        hideDetails(); 
    loadImageMap(); 
}

function loadImageMap() {
    removeAllLayers();
    currentMapState = MapStates.ImageMap;
    map.on("zoomend", loadTilemapFromImageMap);
    addImageOverlayToMap(L.imageOverlay('Submaps/GameMap.png', [[0, 0], [-10336, 10176]]));
    loadImageMapMarkers();
}
function loadImageMapMarkers() {
    for (let province of Object.values(Provinces))
        province.loadPolygon();
    for (let dungeon of Object.values(Dungeons)) {
        if (dungeon !== Dungeons.Castle)
            dungeon.loadImageMapMarker();
    }  
}
function reloadImageMapMarkers() {
    for (let province of Object.values(Provinces))
        province.reloadPolygon();
    for (let dungeon of Object.values(Dungeons)) {
        if (dungeon !== Dungeons.Castle)
            dungeon.loadImageMapMarker();
    }  
}

// TileLayer Map
function loadTileMap() {
    removeAllLayers();
    currentMapState = MapStates.TileMap;
    addTileLayerToMap(tileLayer);
    setBoundsToTL(); 
    loadTileMapMarkers();
}

function loadTilemapFromImageMap() {
    if (map.getZoom() <= -4)
        return;
    document.getElementById('credit').style.display = 'none'; 
    map.dragging.enable();             
    map.setMinZoom(-5);
    map.off('zoomend', loadTilemapFromImageMap);
    map.on('zoomend', loadImageMapFromTileMap); 
    loadTileMap();

    let cpt = 0;
    map.eachLayer(function(_){
        ++cpt; 
    });
    console.log('Number of Markers on Tilemap: ' + --cpt);
}

function loadTilemapFromDungeon() {
    if (map.getZoom() <= -4)
        return;
    loadTileMap();
}

function loadTileMapMarkers() {
    for (let province of Object.values(Provinces))
        province.loadMarkers();
    for (let dungeon of Object.values(Dungeons)) 
        dungeon.loadMarker();
}

function setBoundsToTL() {
    map.setMaxBounds([[500, -500], [-10000, 9000]]); 
}

function exitSubmap() {
    if (map.getZoom() == 0)
        return;
    map.off('zoomend', exitSubmap);  
    removeAllLayersExceptTL();
    map.setMinZoom(-5);
    setBoundsToTL();
    map.dragging.enable();
    currentMapState = MapStates.TileMap;
    tileLayer.setOpacity(1);
    loadTileMapMarkers();
}

function exitToTilemap() {
    removeAllLayersExceptTL();
    map.setMinZoom(-5);
    setBoundsToTL();
    map.dragging.enable();
    currentMapState = MapStates.TileMap;
    tileLayer.setOpacity(1);
    loadTileMapMarkers();
}

// Adding layers to the map
function addMarkerToMap(marker, position=null) {
    if (position !== null) 
        marker.setLatLng(position);
    // if (selectedGameVersion === GameVersions.Wii) {
    //     let latLng = marker.getLatLng();
    //     let center = currentMapState === MapStates.TileMap ? mapCenter[1] : loadedBackground.getCenter().lng;
    //     marker.setLatLng([latLng.lat, -latLng.lng + center * 2]);
    // }
    marker.addTo(map);
}

function addPolygonToMap(polygon) {
    polygon.addTo(map);
}

function addImageOverlayToMap(imageOverlay) {
    imageOverlay.addTo(map);
    // if (selectedGameVersion === GameVersions.Wii)
    //     flipImageContainer(imageOverlay.getElement());
    // loadedBackground = imageOverlay;
}

function addTileLayerToMap(tileLayer) {
    tileLayer.addTo(map);
    // if (selectedGameVersion === GameVersions.Wii)
    //     flipImageContainer(tileLayer.getContainer());
}
document.getElementById("gameVersionSelection").style.display = "none";
function flipImageContainer(imageContainer) {
    imageContainer.style.transform += 'rotateY(180deg)';
    imageContainer.style.transformOrigin = 'center';
}

function unflipImageContainer(imageContainer) {
    imageContainer.style.transform = imageContainer.style.transform.replace("rotateY(180deg)", '');
    imageContainer.style.transformOrigin = null;
}

function flipCurrentImage() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.ImageOverlay)
            flipImageContainer(layer.getElement());
        else if (layer instanceof L.TileLayer)
            flipImageContainer(layer.getContainer());
    });
}
function unflipCurrentImage() {
     map.eachLayer(function (layer) {
        if (layer instanceof L.ImageOverlay)
            unflipImageContainer(layer.getElement());
        else if (layer instanceof L.TileLayer)
            unflipImageContainer(layer.getContainer());
    });
}

// General Map
function reloadMap() {
    if (blockMapReset) {
        if (!storedMapReload)
            storedMapReload = true;
        return;
    }
    console.log('Reloading Map');
    switch (currentMapState) {
        case MapStates.ImageMap : {
            removeAllMarkersExceptPolygons();
            reloadImageMapMarkers();
            break;
        }
        case MapStates.TileMap : {
            removeAllMarkers(); 
            loadTileMapMarkers(); 
            break;
        }   
        default : { // Submaps
            loadedSubmap.reload(); 
            break;
        }
    }
}

function blockMapReloading() {
    blockMapReset = true;
}
function unblockMapReloading() {
    blockMapReset = false;
    if (storedMapReload) {
        reloadMap();
        storedMapReload = false;
        return true;
    }
    return false;
}

document.addEventListener('trackerUpdated', function(event) {
    if (Settings.TrackerLogic.isEnabled())
        reloadMap();
});

document.addEventListener('settingsUpdated', function(event) {
    reloadMap();
});

function showSetFlags() {
    setFlagsHidden = false;
    let button = document.getElementById("setFlagsVisibilityButton");
    button.children[1].innerHTML = "Hide Set Flags";
    button.children[0].children[1].remove();
    reloadMap();
}
function hideSetFlags() {
    setFlagsHidden = true;
    let button = document.getElementById("setFlagsVisibilityButton");
    button.children[1].innerHTML = "Show Set Flags";
    let blockImage = document.createElement('img');
    blockImage.src = "Icons/Block1.png";
    button.children[0].appendChild(blockImage);
    reloadMap();
}
function toggleSetFlagsVisibility() {
    if (setFlagsHidden)
        showSetFlags();
    else
        hideSetFlags();
}

function getAllFlags() {
    let flags = [];
    for (let province of Object.values(Provinces))
        flags.push(...province.getFlags());
    for (let dungeon of Object.values(Dungeons))
        flags.push(...dungeon.getFlags());
    return flags;
}
function getAllTooltipMarkers() {
    let tooltipMarkers = [];
    for (let province of Object.values(Provinces))
        tooltipMarkers.push(...province.getAllTooltipMarkers());
    for (let dungeon of Object.values(Dungeons))
        tooltipMarkers.push(...dungeon.getAllTooltipMarkers());
    return tooltipMarkers;
}
Settings.ShowTooltips.setFunction(toggleTooltips);
function toggleTooltips() {
    if (Settings.ShowTooltips.isEnabled()) {
        for (let province of Object.values(Provinces))
            province.showTooltips();
        for (let dungeon of Object.values(Dungeons))
            dungeon.showTooltips();
    }
    else {
        for (let marker of getAllTooltipMarkers())
            marker.unbindTooltip();
    }
}
Settings.FlagTooltipItemName.setFunction(changeFlagTooltipContent);
function changeFlagTooltipContent() {
    if (Settings.FlagTooltipItemName.isEnabled()) {
        for (let flag of getAllFlags())
            flag.setTooltipToItemName();
    }
    else {
        for (let flag of getAllFlags())
            flag.setTooltipToFlagName();
    }
}


function removeFloorLayer() {
    switch (currentMapState) {
        case MapStates.Dungeon : {
            removeAllMarkers();
            loadedSubmap.removeActiveFloorImageOverlay();
            break;
        }
        case MapStates.FlooredSubmap : {
            removeAllLayersExceptTL();
            break;
        }
    }
}

function removeAllMarkers() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker)
            layer.remove();
    })
}

function removeAllMarkersExceptPolygons() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && !(layer instanceof L.Polygon))
            layer.remove();
    });
}

function removeAllLayers() {
    map.eachLayer(function(l) {
        map.removeLayer(l);
    });
}

function removeAllLayersExceptTL() {
    map.eachLayer(function(layer) {
        if (layer !== tileLayer)
            map.removeLayer(layer);
    });
}  

function getCoordsOnClick(e) {
    if (e.originalEvent.ctrlKey) {
        navigator.clipboard.writeText("[" + Math.round(e.latlng.lat) + ", " + Math.round(e.latlng.lng) + "]");
    }
}

function updateMapSize(width) {
    map.getContainer().style.width = width;
    map.invalidateSize();
}

function clickToZoom(event) {
    map.setView(L.latLng(event.latlng.lat, event.latlng.lng), -2);  
}

function loadMap() {
    map.setView([0, 0], -4);
    map.setMinZoom(-4);
    if (window.innerWidth <= 1000 || window.innerHeight <= 700)
        map.dragging.enable();
    loadImageMap();
    map.on('click', getCoordsOnClick);
}

// Menus
function showRightMenu(menuID, width=25) {
    let menu = document.getElementById(menuID);   
    menu.style.visibility = "visible";
    menu.style.width = width + 'vw';
    document.getElementById('menuicons').style.display = "none";
}

function hideRightMenu(menu) {
    document.getElementById('menuicons').style.display = "flex";
    menu.style.width = "0vw";
    setTimeout(function() {
        menu.style.visibility = "hidden";  
    }, 100);  
}
function updateMenuXPosition(menuX) {
    let menuXRight = window.getComputedStyle(menuX).right;
    menuX.oldPosition = menuXRight;
    menuX.style.right = "calc(" + menuXRight + " + 29vw)";
}
function resetMenuXPosition(menuX) {
    menuX.style.right = menuX.oldPosition;
}
function hideTracker() {
    document.getElementById('menuicons').style.display = "flex";
    document.getElementById('tracker').style.visibility = "hidden";  
}
function clickSeparateTrackerSetting() {
    document.getElementById('Tracker_Position').click();
}

Settings.TrackerOverlay.setFunction(separateTrackerFromMap);
document.getElementById('traX').addEventListener('click', hideTracker);

function separateTrackerFromMap() {
    let tracker = document.getElementById('tracker');
    let trackerWidth = 29;
    if (window.getComputedStyle(tracker).visibility === "hidden") {
        tracker.style.visibility = 'visible';
        document.getElementById('menuicons').style.right = trackerWidth + 'vw';
        document.getElementById('trackerButton').style.visibility = 'hidden';
        let traX = document.getElementById('traX');
        traX.removeEventListener('click', hideTracker);
        traX.addEventListener('click', clickSeparateTrackerSetting);
        for (let menu of document.querySelectorAll(".rightMenu:not(#tracker)"))
            menu.style.right = trackerWidth + 'vw';
        for (let menuX of document.querySelectorAll(".menuX:not(#flagDetailsX):not(#traX)"))
            updateMenuXPosition(menuX);
        updateMapSize((100 - trackerWidth) + 'vw');
    }
    else {
        tracker.style.visibility = 'hidden';
        document.getElementById('menuicons').style.right = '0vw';
        document.getElementById('trackerButton').style.visibility = 'visible';
        let traX = document.getElementById('traX');
        traX.removeEventListener('click', clickSeparateTrackerSetting);
        traX.addEventListener('click', hideTracker);
        for (let menu of document.querySelectorAll(".rightMenu:not(#tracker)"))
            menu.style.right = '0vw';
        for (let menuX of document.querySelectorAll(".menuX:not(#flagDetailsX):not(#traX)"))
            resetMenuXPosition(menuX);
        updateMapSize('100vw');
    }
}

function hideDetails() {
    document.getElementById('flagDetailsX').style.visibility = "hidden"; 
    let flagDetails = document.getElementById('flagDetails'); 
    flagDetails.style.width = "0vw";
    setTimeout(function() {
        flagDetails.style.visibility = "hidden";
    }, 100);
    
    map.off('click', hideDetails);
}

function unsetAllFlags() {
    for (let dungeon of Object.values(Dungeons))
        dungeon.unset();
    for (let province of Object.values(Provinces))
        province.unset();
}

function resetMap(button) {
    button.innerHTML = "Resetting...";
    blockMapReloading();
    unsetAllFlags();
    if (!unblockMapReloading())
        reloadMap();
    resetButtonsFeedback(button, 'Map');
}
function trackerButton(button) {
    button.innerHTML = "Resetting...";
    blockMapReloading();
    resetTracker();
    if (!unblockMapReloading())
        dispatchTrackerUpdate();
    resetButtonsFeedback(button, 'Tracker'); 
}
function resetButtonsFeedback(button, text) {
    button.innerHTML = "Reset done!";
    button.disabled = true;
    button.classList.remove('setbh');
    button.style.cursor = 'default';
    setTimeout(function() {
        button.innerHTML = "Reset " + text;
        button.disabled = false;
        button.classList.add('setbh');
        button.style.cursor = 'pointer';
    }, 1500);
}

