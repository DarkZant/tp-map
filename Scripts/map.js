let seedIsLoaded = false;
let currentMapState;
let loadedSubmap;

const MapStates = Object.freeze({
    ImageMap: 0,
    TileMap: 1,
    Dungeon: 2,
    Submap: 3,
    FlooredSubmap: 4
});
const mapCenter = [-4913, 4257];
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
    if (maxSize > 50)
        maxSize = 50;
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

function showMarkerAsSet(marker) {
    marker.setOpacity(0.7);
    marker.setZIndexOffset(-1000);
    // marker.options.icon = getIconWithCheckmark(marker.options.icon);
    marker.getElement().classList.remove("unmarked");
    marker.getElement().classList.add("marked");
}

function showMarkerAsNotSet(marker, iconImage) {
    marker.setOpacity(1);
    marker.setZIndexOffset(0);
    marker.options.icon = getIcon(iconImage);
    marker.getElement().classList.remove("marked");
    marker.getElement().classList.add("unmarked");
}

function showMarkerAsUnobtainable(marker) {
    marker.getElement().classList.add("unobtainable");
    marker.setZIndexOffset(-500);
}  

function displayContainer(container) {
    return '<img class="ii iti" src="' + container.getContent().image.src + '">' +
    '<p class="itp">' + container.displayText + '</p>';
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

// TileLayer Map
function loadTileMap() {
    removeAllLayers();
    currentMapState = MapStates.TileMap;
    tileLayer.addTo(map);
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
    marker.addTo(map);
}

function addPolygonToMap(polygon) {
    polygon.addTo(map);
}

function addImageOverlayToMap(imageOverlay) {
    imageOverlay.addTo(map);
}

// General Map
function reloadMap() {
    switch (currentMapState) {
        case MapStates.ImageMap : {
            removeAllMarkers();
            loadImageMapMarkers();
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

document.addEventListener('trackerUpdated', function(event) {
    if (Settings.TrackerLogic.isEnabled())
        reloadMap();
});

document.addEventListener('settingsUpdated', function(event) {
    reloadMap();
});

function removeFloorLayer() {
    switch (currentMapState) {
        case MapStates.Dungeon : {
            removeAllLayers();
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

function removeAllLayers() {
    map.eachLayer(function(l) {
        map.removeLayer(l);
    });
}

function removeAllLayersExceptTL() {
    map.eachLayer(function(layer) {
        if (layer != tileLayer)
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

function unsetAllFlags() {
    for (let dungeon of Object.values(Dungeons))
        dungeon.unset();
    for (let province of Object.values(Provinces))
        province.unset();
}

function loadMap() {
    map.setView([0, 0], -4);
    map.setMinZoom(-4);
    if (window.innerWidth <= 1000 || window.innerHeight <= 700)
        map.dragging.enable();
    loadImageMap();
}

// Menus
function showRightMenu(menuID, width) {
    let menu = document.getElementById(menuID);
    if (menuID == "tracker" && !Settings.TrackerOverlay.isEnabled()) {
        updateMapSize((100 - width) + 'vw');
    }
    menu.style.visibility = "visible";
    menu.style.width = '' + width + 'vw';
    document.getElementById('menuicons').style.display = "none";
}

function hideRightMenu(menuID) {
    let menu = document.getElementById(menuID);
    document.getElementById('menuicons').style.display = "inline";
    if (menuID == "tracker") {
        if (!Settings.TrackerOverlay.isEnabled())
            updateMapSize('100vw');
        menu.style.visibility = "hidden";  
        return;
    }
    menu.style.width = "0%";
    setTimeout(function() {
        menu.style.visibility = "hidden";  
    }, 100);  
}

function hideDetails() {
    document.getElementById('flagDetailsX').style.visibility = "hidden";
    document.getElementById('flagDescription').style.visibility = "hidden";
    document.getElementById('containerContent').style.display = "none"; 
    document.getElementById('flagRequirements').style.display = "none";   
    let flagDetails = document.getElementById('flagDetails'); 
    flagDetails.style.width = "0%";
    setTimeout(function() {
        flagDetails.style.height = "0%";
        flagDetails.style.visibility = "hidden";
    }, 100);
    
    map.off('click', hideDetails);
}

function resetMap(button) {
    button.innerHTML = "Resetting...";
    unsetAllFlags();
    reloadMap();  
    resetButtonsFeedback(button, 'Map');
}
function trackerButton(button) {
    button.innerHTML = "Resetting...";
    resetTracker();
    if(Settings.TrackerLogic.isEnabled())
        reloadMap();  
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

