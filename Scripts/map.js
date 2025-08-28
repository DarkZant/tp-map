let setFlagsHidden = false;
let blockMapReset = false;
let storedMapReload = false;
let loadedSubmap;

let originalWidth = 1600;
let multWidth = window.innerWidth / originalWidth;
let originalHeight = 739;
let multHeight = window.innerHeight / originalHeight;

window.addEventListener('resize', () => throttleFunc(() => {
    multWidth = window.innerWidth / originalWidth;
    multHeight = window.innerHeight / originalHeight;
    reloadAllMapLayers();
}));

function getBiggestMult() {
    return Math.max(multWidth, multHeight);
}

function scaleLat(lat) {
    let centerLat = getCenterLat();
    return centerLat + getBiggestMult() * (lat - centerLat);
}

function scaleLng(lng) {
    let centerLng = getCenterLng();
    if (selectedGameVersion === GameVersions.Wii)
        lng =  centerLng * 2 - lng;
    return centerLng + getBiggestMult() * (lng - centerLng);
}

function scaleLatLng(latLng) {
    return L.latLng(scaleLat(latLng.lat), scaleLng(latLng.lng));
}

function scaleLatLngBounds(latLngBounds) {
    return L.latLngBounds(
        scaleLatLng(latLngBounds.getNorthWest()),
        scaleLatLng(latLngBounds.getSouthEast())
    );
}

function getCenterLat() {
    return mapCenter.lat;
}

function getCenterLng() {
    return mapCenter.lng;
}


const MapStates = Object.freeze({
    ImageMap: 0,
    TileMap: 1,
    Dungeon: 2,
    Submap: 3,
    FlooredSubmap: 4
});
let currentMapState = MapStates.ImageMap;

const ImageOverlayBounds = L.latLngBounds([[0, 0], [-10336, 10176]]);
const ImageMapOverlay = L.imageOverlay('Submaps/GameMap.png', ImageOverlayBounds);
let mapCenter = ImageMapOverlay.getCenter();

const LeafletMap = L.map('map', {
        trackResize: true,
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

const TileLayerBounds = L.latLngBounds([0, 0], [-9826, 8515]);
const TileLayer = L.tileLayer('Tiles/{z}/{x}/{y}.png', {
    maxZoom: 0,
    minZoom: -6,
    zoomOffset: 6,
    crs: L.CRS.Simple,
    bounds: TileLayerBounds
});

// Markers and Icons
const Icons = new Map();
function getIcon(image) {
    if (Icons.has(image))
        return Icons.get(image);

    let icon = L.icon({iconUrl: image.src, iconSize: getIconDimensions(image)});
    Icons.set(image, icon);
    return icon; 
}
function getIconDimensions(image) {
    let width = image.width;
    let height = image.height;
    let mult = getBiggestMult();
    let maxSize = 50 * mult;
    if (maxSize > 65)
        maxSize = 65;
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
    return [width, height];
}

function scaleIconDimensions(icon) {
    return getIconDimensions({width: icon.options.iconSize[0], height: icon.options.iconSize[1]});
}

function getIconWithCheckmark(icon) {
    return L.divIcon({ 
        iconUrl: icon.options.iconUrl,
        iconSize: icon.options.iconSize,
        className: "checkmarkIcon",
        html: getIconImgElement(icon) + '<img src="Icons/Checkmark.png" class="checkmark">'
    });
}

function getIconWithJunk(icon) {
    return L.divIcon({ 
        iconUrl: icon.options.iconUrl,
        iconSize: icon.options.iconSize,
        className: "junkIcon",
        html: getIconImgElement(icon) + '<img src="Icons/Junk.png" class="junk">'
    });
}

function getCounterIcon(icon, num) {
    return L.divIcon({ 
        iconUrl: icon.options.iconUrl,
        iconSize: icon.options.iconSize,
        className: "submapDivIcon",
        html: getIconImgElement(icon) + '<div class="cpt subcpt">' + num + '</div>'
    });
}

function getIconImgElement(icon) {
    return '<img src="' + icon.options.iconUrl + '" style="' +
            'width: ' + icon.options.iconSize[0] + 'px; ' +
            'height: ' + icon.options.iconSize[1] + 'px">';
}

function updateDivIconSize(marker) {
    let markerElement = marker.getElement();
    let img = markerElement.querySelector("img");
    if (img === null)
        return;

    let icon = marker.getIcon();
    let newIconSize = scaleIconDimensions(icon);
    icon.options.iconSize = newIconSize;

    if (markerElement.classList.contains("submapDivIcon")) {
        let counterNumber = markerElement.querySelector('div').innerHTML;
        marker.setIcon(getCounterIcon(icon, counterNumber));
    }
    else if (markerElement.classList.contains("checkmarkIcon"))
        marker.setIcon(getIconWithCheckmark(icon));

    marker.remove();
    reAddMarkerToMap(marker);
}

function layerIsLoaded(marker) {
    return LeafletMap.hasLayer(marker);
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

function showMarkerAsJunk(marker, iconImage) {
    marker.setOpacity(0.9);
    marker.setZIndexOffset(marker._zIndex - 500);
    marker.setIcon(getIconWithJunk(getIcon(iconImage)));
    if (!layerIsLoaded(marker))
        return;
    marker.getElement().classList.remove("unmarked");
    marker.getElement().classList.add("junked");
}

function showMarkerAsNotSet(marker, iconImage) {
    marker.setOpacity(1);
    marker.setZIndexOffset(marker._zIndex + 1000);
    marker.setIcon(getIcon(iconImage));
    if (!layerIsLoaded(marker))
        return;
    marker.getElement().classList.remove("marked");
    marker.getElement().classList.remove("junked");
    marker.getElement().classList.add("unmarked");
}

function showMarkerAsUnobtainable(marker) {
    marker.setZIndexOffset(marker._zIndex - 500);
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
    return '<img class="ii iti" src="' + container.getContent().getImage().src + '">' +
    '<p class="itp">' + container.getContentName() + '</p>';
}

function displayItem(item, cSSClass="iti") {
    return '<img class="ii ' + cSSClass + '" src="' + item.getImage().src + '">' +
    '<p class="itp">' + item.getName() + '</p>';
}

function displayRequirement(requirement, cSSClass="iti") {
    return '<img class="ii ' + cSSClass + '" src="' + requirement.image.src + '">' +
    '<p class="itp">' + requirement.text + '</p>';
}


// Image Map
function loadImageMapFromTileMap() {
    if (LeafletMap.getZoom() != -5)
        return;
    document.getElementById('credit').style.display = 'block';   
    LeafletMap.setView([0, 0], -4);
    LeafletMap.setMinZoom(-4);
    if (window.innerWidth >= 1000 && window.innerHeight >= 700)
        LeafletMap.dragging.disable();
    LeafletMap.setMaxBounds([[500, -500], [-10836, 10676]]); 
    LeafletMap.off('zoomend', loadImageMapFromTileMap);    
    if (document.getElementById('flagDetails').style.visibility == 'visible')
        hideDetails(); 
    loadImageMap(); 
}

function loadImageMap() {
    removeAllLayers();
    currentMapState = MapStates.ImageMap;
    LeafletMap.on("zoomend", loadTilemapFromImageMap);
    addImageOverlayToMap(ImageMapOverlay);
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
    addTileLayerToMap(TileLayer);
    setBoundsToTL(); 
    loadTileMapMarkers();
}

function loadTilemapFromImageMap() {
    if (LeafletMap.getZoom() <= -4)
        return;
    document.getElementById('credit').style.display = 'none'; 
    LeafletMap.dragging.enable();             
    LeafletMap.setMinZoom(-5);
    LeafletMap.off('zoomend', loadTilemapFromImageMap);
    LeafletMap.on('zoomend', loadImageMapFromTileMap); 
    loadTileMap();

    let cpt = 0;
    LeafletMap.eachLayer(function(_){
        ++cpt; 
    });
}

function loadTilemapFromDungeon() {
    if (LeafletMap.getZoom() <= -4)
        return;
    loadTileMap();
}

function loadTileMapMarkers() {
    for (let dungeon of Object.values(Dungeons)) 
        dungeon.loadMarker();
    for (let province of Object.values(Provinces))
        province.loadMarkers();
}

function setBoundsToTL() {
    LeafletMap.setMaxBounds([[500, -500], [-10000, 9000]]); 
}

function exitToTilemap() {
    removeAllLayersExceptTL();
    LeafletMap.setMinZoom(-5);
    setBoundsToTL();
    LeafletMap.dragging.enable();
    currentMapState = MapStates.TileMap;
    TileLayer.setOpacity(1);
    setMapCenterToTileLayer();
    loadTileMapMarkers();
}

function getTileLayerCenter() {
    return TileLayerBounds.getCenter();
}

function setMapCenterToTileLayer() {
    mapCenter = getTileLayerCenter();
}

function updateMapBounds(bounds) {
    setTimeout(() => {
        LeafletMap.setMaxBounds(bounds);
    }, 200);
}

// Adding layers to the map
function addMarkerToMap(marker, position) {
    if (marker.currentPosition !== position || marker.currentPosition === undefined)
        marker.currentPosition = position;

    position = L.latLng(position);
    if (currentMapState !== MapStates.TileMap)
        marker.setLatLng(scaleLatLng(position));
    else 
        marker.setLatLng(position);
    marker.addTo(LeafletMap);
}

function reAddMarkerToMap(marker) {
    addMarkerToMap(marker, marker.currentPosition);
}

function addPolygonToMap(polygon) {
    if (polygon.originalPoints === undefined)
        polygon.originalPoints = polygon.getLatLngs();

    let scaledPolygonPoints = [];
    for (let pointArray of polygon.originalPoints) {
        let scaledArray = [];
        for (let point of pointArray)
            scaledArray.push(scaleLatLng(point));
        scaledPolygonPoints.push(scaledArray);
    }
    polygon.setLatLngs(scaledPolygonPoints);

    polygon.addTo(LeafletMap);
}

function addImageOverlayToMap(imageOverlay) {
    if (imageOverlay.originalBounds === undefined)
        imageOverlay.originalBounds = imageOverlay.getBounds();

    let imageBounds = imageOverlay.originalBounds;
    mapCenter = imageOverlay.getCenter();

    let scaledBounds = scaleLatLngBounds(imageBounds);
    imageOverlay.setBounds(scaledBounds);

    if (currentMapState !== MapStates.ImageMap) {
        let controlBoundsOffset = loadedSubmap.boundsOffset[0];
        let otherBoundsOffset = loadedSubmap.boundsOffset[1];
        let nwp = imageBounds.getNorthWest();
        let sep = imageBounds.getSouthEast();
        let mapBounds = L.latLngBounds([
            [nwp.lat + otherBoundsOffset, nwp.lng - controlBoundsOffset], 
            [sep.lat - otherBoundsOffset, sep.lng + otherBoundsOffset]
        ]);
        updateMapBounds(scaleLatLngBounds(mapBounds));
    }
    
    imageOverlay.addTo(LeafletMap);
}

function addTileLayerToMap(tileLayer) {
    setMapCenterToTileLayer();
    tileLayer.addTo(LeafletMap);
}

// TODO
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
    LeafletMap.eachLayer(function (layer) {
        if (layer instanceof L.ImageOverlay)
            flipImageContainer(layer.getElement());
        else if (layer instanceof L.TileLayer)
            flipImageContainer(layer.getContainer());
    });
}
function unflipCurrentImage() {
     LeafletMap.eachLayer(function (layer) {
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
    // console.log('Reloading Map');
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

function blockMarkerReload(marker) {
    marker.noReload = true;
}

function unblockMarkerReload(marker) {
    marker.noReload = undefined;
}

function layerCanReload(layer) {
    return layer.noReload === undefined;
}

function layerCannotReload(layer) {
    return layer.noReload === true;
}

function reloadAllMapLayers() {
    let loadedLayers = [];
    LeafletMap.eachLayer((layer) => {
        loadedLayers.push(layer);
        layer.remove();
    });
    for (let layer of loadedLayers) {
        if (layer instanceof L.ImageOverlay) addImageOverlayToMap(layer);
        else if (layer instanceof L.TileLayer) addTileLayerToMap(layer);
    }
    for (let [image, icon] of Icons.entries()) {
        icon.options.iconSize = getIconDimensions(image);
    }
    for (let layer of loadedLayers) {
        if (layer instanceof L.Marker) {
            reAddMarkerToMap(layer);
            if (layer.options.icon instanceof L.DivIcon)
                updateDivIconSize(layer);
        }
        else if (layer instanceof L.Polygon) addPolygonToMap(layer);
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

function removeFloorLayer() {
    removeAllMarkers();
    loadedSubmap.removeActiveFloorImageOverlay();
    // switch (currentMapState) {
    //     case MapStates.Dungeon : {
    //         removeAllMarkers();
    //         loadedSubmap.removeActiveFloorImageOverlay();
    //         break;
    //     }
    //     case MapStates.FlooredSubmap : {
    //         removeAllLayersExceptTL();
    //         break;
    //     }
    // }
}

function removeAllMarkers() {
    LeafletMap.eachLayer(function (layer) {
        if (layer instanceof L.Marker && layerCanReload(layer))
            layer.remove();
    })
}

function removeAllMarkersExceptPolygons() {
    LeafletMap.eachLayer(function (layer) {
        if (layer instanceof L.Marker && !(layer instanceof L.Polygon) && layerCanReload(layer))
            layer.remove();
    });
}

function removeAllLayers() {
    LeafletMap.eachLayer(function(layer) {
        layer.remove();
    });
}

function removeAllLayersExceptTL() {
    LeafletMap.eachLayer(function(layer) {
        if (layer !== TileLayer && layerCanReload(layer))
            layer.remove();
    });
}  

document.addEventListener('trackerUpdated', function(event) {
    if (Settings.TrackerLogic.isEnabled())
        reloadMap();
});

document.addEventListener('settingsUpdated', function(event) {
    reloadMap();
    if (Settings.ShowTotalCounter.isEnabled())
        updateTotalCounter();
});

function blockMenuIcon(menuIcon) {
    menuIcon.children[1].innerHTML = menuIcon.children[1].innerHTML.replace("Hide", "Show");
    let blockImage = document.createElement('img');
    blockImage.src = "Icons/Block.png";
    menuIcon.children[0].appendChild(blockImage);
}

function unblockMenuIcon(menuIcon) {
    menuIcon.children[1].innerHTML = menuIcon.children[1].innerHTML.replace("Show", "Hide");
    if (menuIcon.children[0].children[1] !== null)
        menuIcon.children[0].children[1].remove();
}

function showSetFlags() {
    setFlagsHidden = false;
    unblockMenuIcon(document.getElementById("setFlagsVisibilityButton"));
    reloadMap();
}
function hideSetFlags() {
    if (!setFlagsHidden)
        blockMenuIcon(document.getElementById("setFlagsVisibilityButton"));

    setFlagsHidden = true;
    reloadMap();
}
function toggleSetFlagsVisibility() {
    if (setFlagsHidden)
        showSetFlags();
    else
        hideSetFlags();
}


let noReqVisMenuIcon = document.getElementById("requirementVisibilityButton");
function showNoRequirements() {
    Settings.HideNoReqs.deactivate();
    unblockMenuIcon(noReqVisMenuIcon);
    reloadMap();
}
function hideNoRequirements() {
    if (!Settings.HideNoReqs.isEnabled()) 
        blockMenuIcon(noReqVisMenuIcon);

    Settings.HideNoReqs.activate();
    reloadMap();
}
function toggleNoRequirementsVisibility() {
    if (Settings.HideNoReqs.isEnabled())
        showNoRequirements();
    else
        hideNoRequirements();
}

function toggleNoRequirementsBlock() {
    if (Settings.HideNoReqs.isEnabled())
        blockMenuIcon(noReqVisMenuIcon);
    else 
        unblockMenuIcon(noReqVisMenuIcon);
}

Settings.HideNoReqs.setFunction(toggleNoRequirementsBlock);
Settings.TrackerLogic.setFunction(showRequirementVisibilityButton);

function showRequirementVisibilityButton() {
    if (Settings.TrackerLogic.isEnabled())
        noReqVisMenuIcon.style.visibility = "visible";
    else 
        noReqVisMenuIcon.style.visibility = "hidden";
    dispatchSettingsUpdate();
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

Settings.ShowTotalCounter.setFunction(toggleTotalCounterVisibility)
function toggleTotalCounterVisibility() {
    let totalCounter = document.getElementById('counter');
    if (window.getComputedStyle(totalCounter).visibility === "hidden") {
        totalCounter.style.visibility = "visible";
        updateTotalCounter();
    }
    else 
        totalCounter.style.visibility = "hidden";
}

function updateTotalCounter() {
    let counted = 0;
    let total = 0;
    for (let province of Object.values(Provinces)) {
        if (province instanceof DungeonProvince)
            continue;
        counted += province.countForTotal();
        total += province.totalCount();
    }
    for (let dungeon of Object.values(Dungeons)) {
        counted += dungeon.countForTotal();
        total += dungeon.totalCount();
    }
    let percent;
    if (total === 0)
        percent = 0;
    else 
        percent = Math.round(counted / total * 100);
    if (percent === 100 && counted !== total)
        percent = 99;
    
    let countText = counted + " / " + total;
    let percentText = "(" + percent + "%)"
    document.getElementById('counter').innerHTML = countText + " " + percentText;
}

function openPositionTooltip(lat, lng) {
    let text = "[" + Math.round(lat) + ", " + Math.round(lng) + "]";
    LeafletMap.openTooltip(text, [lat, lng], {direction: "top"});
    return text;
}

function getCoordsOnClick(e) {
    if (e.originalEvent.ctrlKey) {
        let text = openPositionTooltip(e.latlng.lat, e.latlng.lng);
        navigator.clipboard.writeText(text);
        
    }
}

function updateMapSize(width) {
    LeafletMap.getContainer().style.width = width;
    LeafletMap.invalidateSize();
}

function clickToZoom(event) {
    LeafletMap.setView(L.latLng(event.latlng.lat, event.latlng.lng), -2);  
}

function loadMap() {
    checkRandoSeed();
    LeafletMap.setView([0, 0], -4);
    LeafletMap.setMinZoom(-4);
    if (window.innerWidth <= 1000 || window.innerHeight <= 700)
        LeafletMap.dragging.enable();
    loadImageMap();
    LeafletMap.on('click', getCoordsOnClick);
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
function showTracker() {
    if (Settings.TrackerOverlay.isEnabled()) {
        separateTrackerFromMap();
    }
    else {
        showRightMenu('tracker', 29);
    }
}
function hideTracker() {
    if (Settings.TrackerOverlay.isEnabled()) {
        separateTrackerFromMap();
    }
    else {
        document.getElementById('menuicons').style.display = "flex";
        document.getElementById('tracker').style.visibility = "hidden";  
    }
}

initializeMapTracker();
Settings.TrackerOverlay.setFunction(trackerOverlaySetting);
function trackerOverlaySetting() {
    if (Settings.TrackerOverlay.isEnabled())
        separateTrackerFromMap();
    else if (window.getComputedStyle(tracker).visibility === 'visible')
        separateTrackerFromMap();

}
document.getElementById('traX').addEventListener('click', hideTracker);

function separateTrackerFromMap() {
    let tracker = document.getElementById('tracker');
    let trackerWidth = 29;
    if (window.getComputedStyle(tracker).visibility === "hidden") {
        tracker.style.visibility = 'visible';
        document.getElementById('menuicons').style.right = trackerWidth + 'vw';
        document.getElementById('trackerButton').style.visibility = 'hidden';
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
    
    LeafletMap.off('click', hideDetails);
}

function unsetAllFlags() {
    for (let dungeon of Object.values(Dungeons))
        dungeon.unset();
    for (let province of Object.values(Provinces))
        province.unset();
}

function resetMap(button) {
    resetButtonText(button);

    blockMapReloading();
    unsetAllFlags();
    if (!unblockMapReloading())
        reloadMap();

    resetButtonsFeedback(button);
}
function trackerButton(button) {
    resetButtonText(button);

    blockMapReloading();
    resetTracker();
    if (!unblockMapReloading())
        dispatchTrackerUpdate();

    resetButtonsFeedback(button); 
}
function settingsButton(button) {
    resetButtonText(button);

    blockMapReloading();
    resetSettings();
    if (!unblockMapReloading())
        dispatchSettingsUpdate();

    resetButtonsFeedback(button);
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


