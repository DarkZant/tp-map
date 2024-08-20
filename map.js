//Classes
//Leaflet Extended Classes
var Check = L.Marker.extend({
    initialize: function(latLng, icon, su, van, reqs, info) {
        this.latLng = L.latLng(latLng)
        this._latlng = this.latLng;
        L.setOptions(this, {icon: icon, riseOnHover: true, riseOffset: 2000, keyboard: false});
        this.su = su;
        this.index = su.assignIndex();
        this.van = van;
        this.reqs = reqs;
        this.info = info;
        this.on('contextmenu', this.setAsMarked);
        this.on('click', this.showDetails);
    },
    setFlag: function(value) {
        this.su.setFlag(this.index, value);
    },
    flagIsSet: function() {
        return this.su.getFlag(this.index);
    },
    resetFlag: function() {
        if (this.flagIsSet())
            this.setFlag('0');
    },
    setAsMarked: function() {
        this.setFlag('1');
        this.showAsMarked();
    },
    setAsUnmarked: function() {
        this.setFlag('0');
        this.showAsUnmarked();
    },
    showAsMarked: function() {
        this.setOpacity(0.7);
        this.setZIndexOffset(-1000);
        this._icon.style.filter = "brightness(60%)";
        this.off('contextmenu', this.setAsMarked);
        this.on('contextmenu', this.setAsUnmarked);
    },
    showAsUnmarked: function() {
        this.setOpacity(1);
        this.setZIndexOffset(0);
        this._icon.style.filter = "brightness(100%)";
        this.off('contextmenu', this.setAsUnmarked);
        this.on('contextmenu', this.setAsMarked);
    },
    loadAsSubmap: function(newLatLng) {
        this._latlng = newLatLng;
        this.loadIcon();
    },
    resetPosition: function() {
        this._latlng = this.latLng;
    },
    countsAsCheck: function() {
        return true;
    },
    categoryIsVisible: function() {
        return visibleCategories.includes(this.su.name);
    },
    isShown: function() {
        return this.categoryIsVisible() && (this.hasRequirements() || !settingIsChecked('hideTrackerS'));
    },
    isShownAndNotSet: function() {
        return this.isShown() && !this.flagIsSet();
    },  
    isCountable: function () {
        return this.isShownAndNotSet() && this.countsAsCheck();
    },
    hasRequirements: function() {
        if (!settingIsChecked('trackerS') || this.reqs == undefined)
            return true;
        for (let i = 0; i < this.reqs.length; ++i) {
            if (this.reqs[i].length == undefined) {
                if (!obtainedItems.includes(this.reqs[i])) 
                    return false
            }
            else {
                let alternativesNotMet = true;
                for (let j = 0; j < this.reqs[i].length; ++j) {
                    if(obtainedItems.includes(this.reqs[i][j])) {
                        alternativesNotMet = false;
                        break;
                    }
                }
                if (alternativesNotMet) 
                    return false;
            }
        }
        return true;
    },
    loadIcon: function() {
        if (!this.categoryIsVisible()) //If Check's Category isn't visible
            return;
        let noReqs = !this.hasRequirements();
        if (noReqs && settingIsChecked('hideTrackerS')) //Hide Checks Without Reqs
                return;
        if (settingIsChecked('chestS') && this.van != undefined) { //Show Chests as Base Content
            let temp = this.options.icon;
            L.setOptions(this, {icon: this.van});
            this.addTo(map);
            L.setOptions(this, {icon: temp});
        } 
        else
            this.addTo(map);
        if (noReqs) { // Show Check as Non-Obtainable
            this._icon.style.filter += 'grayscale(1) contrast(125%)';
            this.setZIndexOffset(-500);
        }
        if (this.flagIsSet())
            this.showAsMarked();
        else
            this.showAsUnmarked();       
    },
    showDetails: function() {
        var box = document.getElementById('check');
        box.style.visibility = "visible";
        box.style.width = "25%";
        box.style.height = "100%";
        setTimeout(function() {document.getElementById('checkX').style.visibility = "visible";}, 100);        
        if (this.van != undefined) {
            document.getElementById('van').style.display = "block";
            document.getElementById('vandiv').innerHTML = this.iconToImg(this.van, 
                this.van.options.className == undefined ? this.van.options.iconUrl.slice(6, -4) : this.van.options.className, "iti");
        }
        else 
            document.getElementById('van').style.display = "none";
        if (this.reqs != undefined) {
            document.getElementById('reqs').style.display = "block";
            let rdHtml = "";
            for (let i = 0; i < this.reqs.length; ++i) {
                if (this.reqs[i].length != undefined) {
                    rdHtml += '<div class="oritems"><div class="oritf"><p class="idot">•</p>' + this.iconToImg(this.reqs[i][0].mapIcon, this.reqs[i][0].name, "iti") + '</div>';
                    for(let j = 1; j < this.reqs[i].length; ++j) {
                        rdHtml += '<div class="orits"><p class="por">or</p>' + this.iconToImg(this.reqs[i][j].mapIcon, this.reqs[i][j].name, "itis") + '</div>';
                    }
                    rdHtml += '</div>';
                }
                else {
                    rdHtml += '<div class="item"><p class="idot">•</p>' + this.iconToImg(this.reqs[i].mapIcon, this.reqs[i].name, "iti") + '</div>';
                }
            }
            document.getElementById('reqsdiv').innerHTML = rdHtml;
        }
        else 
            document.getElementById('reqs').style.display = "none";
        document.getElementById('cinfo').style.visibility = "visible";
        document.getElementById('cinfodiv').innerHTML = this.info;
        map.on('click', hideDetails);
    },
    iconToImg: function(icon, name, imgClass) {
          return '<img class="ii ' + imgClass + '" src="' + icon.options.iconUrl + '">' +
                '<p class="itp">' + name + '</p>';
    }
});

var FakeCheck = Check.extend({
    initialize: function(latLng, icon, su, reqs, info) {
        this.latLng = L.latLng(latLng)
        this._latlng = this.latLng;
        L.setOptions(this, {icon: icon, riseOnHover: true, riseOffset: 2000, keyboard: false, zIndexOffset: -500});
        this.su = su;
        this.index = su.assignIndex();
        this.reqs = reqs;
        this.info = info;
        this.on('contextmenu', this.setAsMarked);
        this.on('click', this.showDetails);
    },
    countsAsCheck: function() {
        return settingIsChecked('flagscptS');
    }
});

var NonCheck = L.Marker.extend({
    initialize: function(latLng, icon, cat) {
        this.latLng = L.latLng(latLng);
        this._latlng = this.latLng;
        L.setOptions(this, {icon: icon, riseOnHover: true, riseOffset: 2000, keyboard: false, zIndexOffset: -1100});
        this.cat = cat;
    },
    loadIcon: function() {
        if (!this.isShown())
            return false;
        this.addTo(map);
    },
    setFlag: function() {
        return;
    },
    flagIsSet: function() {
        return true;
    },
    resetFlag: function() {
        return;
    },
    isShown: function() {
        return visibleCategories.includes(this.cat);
    },
    isShownAndNotSet: function() {
        return this.isShown();
    },
    setAsMarked: function() {
        return;
    },
    setAsUnmarked: function() {
        return;
    },
    countsAsCheck: function() {
        return settingIsChecked('nflagscptS');
    },
    isCountable: function() {
        return this.isShown() && this.countsAsCheck();
    },
    resetPosition: function() {
        return false;
    }
});

var Submap = L.Marker.extend({
    initialize: function(latLng, icon, imageLink, imageSize, checks) {
        this._latlng = L.latLng(latLng);
        L.setOptions(this, {icon: icon, riseOnHover: true, riseOffset: 2000});
        this.isSubmap = true;
        this.icon = icon;
        this.checks = checks; 
        this.zIndexOffset = 500; 
        if (imageSize[1] > 330) {
            imageSize[0] = 330 / imageSize[1] * imageSize[0];
            imageSize[1] = 330;
        }   
        this.image = L.imageOverlay('Submaps/' + imageLink, 
            [[latLng[0] + imageSize[1], latLng[1] - imageSize[0]], [latLng[0] - imageSize[1], latLng[1] + imageSize[0]]]);
        this.on('click', this.load);
        this.on('contextmenu', this.setAsMarked);
    }, 
    setAsMarked: function() {
        this.setAllShownFlags('1');
        this.showAsMarked();
    },
    setAsUnmarked: function() {
        this.setAllShownFlags('0');
        this.showAsUnmarked();
    },
    showAsMarked: function() {
        this.setOpacity(0.7);
        this.setZIndexOffset(this.zIndexOffset - 1000);
        if (settingIsChecked('subCounterS'))
            this.setIcon(this.icon);
        this._icon.style.filter = "brightness(60%)";
        this.off('contextmenu', this.setAsMarked);
        this.on('contextmenu', this.setAsUnmarked);
    },
    showAsUnmarked: function() {
        if (!this.hasShownChecks())
            return;
        this.setOpacity(1);
        this.setZIndexOffset(this.zIndexOffset);
        this._icon.style.filter = "brightness(100%)";
        if (settingIsChecked('subCounterS') && this.getCountableChecksAmount() > 0)
            this.loadCounterIcon();
        this.off('contextmenu', this.setAsUnmarked);
        this.on('contextmenu', this.setAsMarked);
    },
    resetAllFlags: function() {
        for (let i = 0; i < this.checks.length; ++i) 
                this.checks[i].resetFlag();
    },
    setAllShownFlags: function(val) {        
        for (let i = 0; i < this.checks.length; ++i) {
            if (this.checks[i].isShown())
                this.checks[i].setFlag(val);
        }
    },
    allShownChecksAreSet: function() {
        for (let i = 0; i < this.checks.length; ++i) {
            if (this.checks[i].isShownAndNotSet())
                return false;       
        }
        return true;
    },
    hasShownChecks: function() {
        let visible = false;
        for (let i = 0; i < this.checks.length; ++i) {
            if (this.checks[i].isShown()) {
                visible = true;
                break;
            }     
        }  
        return visible; 
    },
    checkCount: function() {
        let cpt = 0;
        for(let i = 0; i < this.checks.length; ++i) 
            cpt += this.checks[i].countsAsCheck() ? 1 : 0;
        return cpt;
    },
    loadIcon: function() {
        if (settingIsChecked('1checksubS') && this.checkCount() == 1) {
            this.checks[0].loadAsSubmap(this._latlng);
            return;
        }
        if (!settingIsChecked('emptysubS') && !this.hasShownChecks()) // Hide if empty
            return;           
        this.addIcon();
    },       
    addIcon: function() {
        this.addTo(map);
        if (this.allShownChecksAreSet())
            this.showAsMarked();        
        else 
            this.showAsUnmarked();
    },
    load: function() {
        mapState = 3;
        this.prepareMap();
        loadedDungeon = this;
        this.image.addTo(map);
        this.loadChecks();      
    },
    loadChecks: function() {
        for(let i = 0; i < this.checks.length; ++i) {
            this.checks[i].resetPosition();
            this.checks[i].loadIcon();
        }          
    },
    prepareMap: function() {
        map.setView(this._latlng, 0);     
        map.dragging.disable();
        TL.setOpacity(0.2);
        removeAllLayersExceptTL();
        map.on('zoomend', exitSubmap);
    },    
    loadCounterIcon: function() {
        this.remove();
        let temp = this.icon;
        L.setOptions(this, {icon: getCounterIcon(this.icon, this.getCountableChecksAmount())});
        this.addTo(map);
        L.setOptions(this, {icon: temp});
        return true;
    },
    getCountableChecksAmount: function() {
        let cpt = 0;
        for(let i = 0; i < this.checks.length; ++i) 
            cpt += this.checks[i].isCountable() ? 1 : 0;
        return cpt;
    }
}); 

var DungeonFloor = Submap.extend({
    initialize: function(img, bounds, checks) {
        this.imageOverlay = L.imageOverlay(img, bounds);
        this.checks = checks;
    },
    load: function() {
        this.imageOverlay.addTo(map);
        this.loadChecks();
        if (mapState == 4)
            return;
        let bounds = this.imageOverlay.getBounds();
        let nwp = bounds.getNorthWest();
        let sep = bounds.getSouthEast();
        setTimeout(function() {
            map.setMaxBounds(L.latLngBounds([[nwp.lat + 300, nwp.lng - 1500], [sep.lat - 300, sep.lng + 300]]));
        }, 200);        
    },
    setAsMarked: function() {
        this.setAllShownFlags('1');   
    },
    setAsUnmarked: function() {
        this.setAllShownFlags('0');
    },
    setAndShowAsMarked: function() {
        for (let i = 0; i < this.checks.length; ++i) {
            if (this.checks[i].isShown())
                this.checks[i].setAsMarked();
        } 
    },
    setAndShowAsUnmarked: function() {
        for (let i = 0; i < this.checks.length; ++i) {
            if (this.checks[i].isShown())
                this.checks[i].setAsUnmarked();
        } 
    },
});

var Dungeon = Submap.extend({
    initialize: function(latLngTile, latLngMain, icon, name, imgsSize, floorOffset, floors) {
        L.setOptions(this, {icon: icon, riseOnHover: true, riseOffset: 2000, zIndexOffset: 2000});
        this.latLngTile = L.latLng(latLngTile);
        this.latLngMain = L.latLng(latLngMain);
        this.icon = icon;
        this.floorOffset = floorOffset;
        if (imgsSize[1] > 1350) {
            imgsSize[0] = 1350 / imgsSize[1] * imgsSize[0];
            imgsSize[1] = 1350;
        }
        if (imgsSize[0] > 2300) {
            imgsSize[1] = 2300 / imgsSize[0] * imgsSize[1];
            imgsSize[0] = 2300;
        }
        for(let i = 0; i < floors.length; ++i) {
            floors[i] = new DungeonFloor('Dungeons/' + name + '/' + document.getElementById('F' + (i + floorOffset)).src.slice(-6), 
                [[-4913 + imgsSize[1], 4258 - imgsSize[0]], [-4913 - imgsSize[1], 4258 + imgsSize[0]]],
                floors[i]);
        }
        this.name = name;
        this.zIndexOffset = 2000;
        this.floors = floors;   
        this.on('click', this.load);
        this.on('contextmenu', this.setAsMarked);
    }, 
    resetAllFlags: function() {
        for (let i = 0; i < this.floors.length; ++i) 
                this.floors[i].resetAllFlags();
    },
    setAllShownFlags: function(value) {
        for(let i = 0; i < this.floors.length; ++i)
            this.floors[i].setAllShownFlags(value);
    },
    hasShownChecks: function() {
        for (let i = 0; i < this.floors.length; ++i) {
            if (this.floors[i].hasShownChecks())
                return true;                
        }    
        return false; 
    },
    allShownChecksAreSet: function() {
        for (let i = 0; i < this.floors.length; ++i) {
            if (!this.floors[i].allShownChecksAreSet()) 
                return false;                     
        }
        return true;
    },
    checkCount: function() {
        let cpt = 0;
        for(let i = 0; i < this.floors.length; ++i) 
            cpt += this.floors[i].checkCount();
        return cpt;
    },
    loadIcon: function() {
        if (!settingIsChecked('emptysubS') && !this.hasShownChecks()) // Hide if empty
            return;
        if (mapState == 0) 
            this._latlng = this.latLngMain;
        else 
            this._latlng = this.latLngTile;

        this.addIcon();
        this.setZIndexOffset(1000);
    },
    load: function() { 
        if (mapState == 0) {
            map.setMinZoom(-5);
            document.getElementById('made').style.display = 'none';
            map.off('zoomend');
            map.dragging.enable();         
            map.on('zoomend', loadImageMap);  
        }
        loadedDungeon = this.floors;
        document.getElementById('dun').style.display = 'inline'
        let dn = document.getElementById("dn");
        dn.src = "Dungeons/" + this.name + "/Name.png";
        dn.style.display = 'flex';
        mapState = 2;
        removeAllLayers();
        map.setView([-4913, 4258], -2);
        window.addEventListener('keydown', dungeonControls);
        map.on('zoomend', exitDungeon);
        for(let i = 0; i <= this.floors.length - 1; ++i)
            this.setupFloorButton(i);
        activeFloor = 3 - this.floorOffset;
        floorOffset = this.floorOffset;
        document.getElementById('F3').click();
    },
    getCountableChecksAmount: function() {
        let cpt = 0;
        for(let i = 0; i < this.floors.length; ++i)
            cpt += this.floors[i].getCountableChecksAmount();
        return cpt;
    },
    setupFloorButton: function(floorIndex) {
        let floor = document.getElementById('F' + (floorIndex + this.floorOffset));
        floor.style.display = 'flex';
        floor.addEventListener("click", function () {
            mapState == 2 ? removeAllLayers() : removeAllLayersExceptTL();
            resetActiveFloorButton();
            floor.style.filter = 'brightness(200%)';
            floor.style.width = "15.4vw";
            floor.style.marginLeft = "-0.4vw";
            activeFloor = floorIndex;
            loadedDungeon[floorIndex].load();             
        });
        floor.addEventListener('contextmenu', function() {
            if (loadedDungeon[floorIndex].allShownChecksAreSet())
                loadedDungeon[floorIndex].setAndShowAsUnmarked();
            else
                loadedDungeon[floorIndex].setAndShowAsMarked();
        });
        floor.addEventListener('mouseover', function() {
            if (activeFloor == floorIndex) 
                return;
            mapState == 2 ? removeAllLayers() : removeAllLayersExceptTL();
            loadedDungeon[floorIndex].load();  
        });
        floor.addEventListener('mouseout', function() {
            if (activeFloor == floorIndex || mapState == 1) 
                return;
            mapState == 2 ? removeAllLayers() : removeAllLayersExceptTL();
            loadedDungeon[activeFloor].load();
        });
    }
});

var FlooredSubmap = Dungeon.extend({
    initialize: function(latLng, icon, img, floors, floorOffset) {
        this._latlng = L.latLng(latLng);
        L.setOptions(this, {icon: icon, riseOnHover: true, riseOffset: 2000});
        this.isSubmap = true;
        this.icon = icon;
        this.zIndexOffset = 500;
        for (let i = 0; i < floors.length; ++i) {
            if (floors[i][0][1] > 330) {
                floors[i][0][0] = 330 / floors[i][0][1] * floors[i][0][0];
                floors[i][0][1] = 330;
            }
            floors[i] = new DungeonFloor('Submaps/' + img + i + '.png', 
            [[latLng[0] + floors[i][0][1], latLng[1] - floors[i][0][0]], [latLng[0] - floors[i][0][1], latLng[1] + floors[i][0][0]]],
            floors[i][1]);
        }
        this.floors = floors;
        this.floorOffset = floorOffset == undefined ? 3 : floorOffset;
        this.on('click', this.load);
        this.on('contextmenu', this.setAsMarked);
    }, 
    loadIcon: function() {
        if (settingIsChecked('1checksubS') && this.checkCount() == 1) { // Show as singular check
            for (let i = 0; i < this.floors.length; ++i) {
                if (this.floors[i].checkCount() == 1) {
                    this.floors[i].checks[0].loadAsSubmap(this._latlng);
                    return;
                }
            }
        }
        if (!settingIsChecked('emptysubS') && !this.hasShownChecks()) // Hide if empty
            return;  
        this.addIcon();
        this.setZIndexOffset(500);
    },
    load: function() {
        mapState = 4;
        this.prepareMap();
        loadedDungeon = this.floors;  
        document.getElementById('dun').style.display = 'inline'
        window.addEventListener('keydown', dungeonControls);
        floorOffset = this.floorOffset;
        for(let i = 0; i <= this.floors.length - 1; ++i)
            this.setupFloorButton(i, floorOffset);
        activeFloor = 3 - floorOffset;
        document.getElementById('F3').click();
    },
});


// Simple Classes
class StorageUnit {
    constructor(name, defaultConfig) {
        this.name = name;
        this.defaultConfig = defaultConfig;
        this.total = 0;
    }
    getLength() {
        return this.defaultConfig.length;
    }
    resetFlags() {
        localStorage.setItem(this.name, this.defaultConfig);
    }
    getAllFlags() {
        return localStorage.getItem(this.name);
    }
    getFlag(index) {
        return this.getAllFlags()[index] == '1';
    }
    getFlagAsNumber(index) {
        return parseInt(this.getAllFlags()[index]);
    }
    getFlagAsCharCode(index) {
        return this.getAllFlags()[index].charCodeAt(0);
    }
    setFlag(index, value) {
        var flags = this.getAllFlags();
        flags = flags.substring(0, index) + value + flags.substring(index + 1);
        localStorage.setItem(this.name, flags);
    }
    assignIndex() {
        return this.total++;
    }
    checkIfInitialized() {
        let flags = this.getAllFlags();
        if (flags == null || flags.length != this.getLength())
            this.resetFlags();
    }
}

class Province {
    constructor(polyPoints, isCastle, counterPos, markers) {
        this.poly = L.polygon(polyPoints, { fillColor: '#6e5b1e', fillOpacity: 0, opacity: 0});
        this.isCastle = isCastle;
        this.markers = markers;
        this.counterPos = counterPos;
        this.poly.on('mouseover', this.highlight);
        this.poly.on('mouseout', this.unhighlight);
        if (this.isCastle)
            this.poly.on('click', function() { 
                dungeons[dungeons.length - 1].load();
            });
        else
            this.poly.on('click', this.zoomToTilemap);
    }
    highlight() {
        this.setStyle({ fillOpacity: 0.5 });
    }
    unhighlight() {
        this.setStyle({ fillOpacity: 0 });
    }
    load() {
        this.poly.addTo(map);
        this.poly.setStyle({ fillOpacity: 0 });
        if (settingIsChecked('subCounterS')) {
            L.marker(this.counterPos, {
                icon: L.divIcon({ html: '<div class="cpt procpt">' + this.getCountableChecksAmount() + '</div>'}),
                interactive: false
            }).addTo(map);
        }
    }
    loadIcons() {
        for(let i = 0; i < this.markers.length; ++i)
            this.markers[i].loadIcon();
    }
    resetAllFlags() {
        for(let i = 0; i < this.markers.length; ++i) {
            if (this.markers[i].isSubmap) 
                this.markers[i].resetAllFlags();
            else 
                this.markers[i].resetFlag();
        }
    }
    zoomToTilemap(e) {
        map.setView(L.latLng(e.latlng.lat, e.latlng.lng), -2);  
    }
    getCountableChecksAmount() {
        if (this.isCastle) 
            return dungeons[dungeons.length - 1].getCountableChecksAmount();
        let cpt = 0;
        for(let i = 0; i < this.markers.length; ++i) {
            if (this.markers[i].isSubmap) 
                cpt += this.markers[i].getCountableChecksAmount();
            else 
                cpt += this.markers[i].isCountable() ? 1 : 0;
        }
        return cpt;
    }
}
class TrackerItem {
    constructor(elem, type, max, items) {
        this.elem = elem;
        this.type = type;
        this.max = max;
        this.items = items;
        this.state = 0;
    } 
}
class Item {
    constructor(name, mapIcon, trackerIcon) {
       this.name = name;
       this.mapIcon = mapIcon;
       this.trackerIcon = trackerIcon;
    } 
}
class Grotto {
    constructor(id, width, height) {
        this.img = 'Grotto' + id + '.png';
        this.imgSize = [width, height];
    }
}

//Grottos
var g1 = new Grotto(1, 628, 496); // 4 
var g2 = new Grotto(2, 394, 496); // 4
var g3 = new Grotto(3, 440, 372); // 4
var g4 = new Grotto(4, 459, 494); // 4
var g5 = new Grotto(5, 351, 495); // 5

//Icons
//Icon generators
function createIcon(img, width, height, name) {
    let maxSize = 55;
    if (width >= height) {
        height = height / width * maxSize;
        width = maxSize;
    }
    else {
        width = width / height * maxSize;
        height = maxSize;
    }
     return L.icon({iconUrl: 'Icons/' + img + '.png', iconSize: [width, height],
                   className: name}); 
}
function bI(img, isMale) { // Create bug icon
    if (isMale == undefined)
        return L.icon({iconUrl: 'Icons/' + img + '.png',iconSize: [55, 55]});
    return L.icon({iconUrl: 'Icons/' + img + (isMale ? 'M' : 'F') + '.png',
        iconSize: [55, 55], className: (isMale ? '♂' : '♀') + ' ' + img});
}
function qI(icon, quantity) { // Create item icon with quantity
    return L.icon({iconUrl: icon.options.iconUrl, iconSize: icon.options.iconSize, 
        className: icon.options.iconUrl.slice(6, -4) + '&nbsp × &nbsp' + quantity });
}

//General Map
var cI = L.icon({iconUrl: 'Icons/Chest.png', iconSize: [55, 47.7]}); 
var sCI = L.icon({iconUrl: 'Icons/ChestSmall.png', iconSize: [55, 47.7]});
var bCI = createIcon('ChestBoss', 55, 47.7);
var howlStoI = createIcon('HowlingStone', 36.2, 55);
var golWolfI = createIcon('Golden Wolf', 160, 176);
var rupRockI = createIcon('RupeeRock', 55, 42.4);
var grottoI = L.icon({iconUrl: 'Icons/Grotto.png', iconSize: [45, 45]});
var orDoorI = createIcon('Door', 982 , 1552);
var caveEI = createIcon('Entrance', 1708, 1370);
var starI = L.icon({iconUrl: 'Icons/Star.png', iconSize: [50, 50]});
var mirI = L.icon({iconUrl: 'Icons/Mirror.png', iconSize: [55, 55]});
var castleI = L.icon({iconUrl: 'Icons/Castle.png', iconSize: [49.3, 55]});
//Non Checks
var horseGI = L.icon({iconUrl: 'Icons/Horse Grass.png', iconSize: [45.7, 55]});
var hawkGI = L.icon({iconUrl: 'Icons/Hawk Grass.png', iconSize: [31.3, 55]});
var fairyI = createIcon('BottleFairy', 34.3, 55);
var beeI = createIcon('BottleBee', 34.3, 55);

//Obtainables
var hPI = L.icon({iconUrl:'Icons/Heart Piece.png', iconSize: [55, 43]});
var hCI = L.icon({iconUrl:'Icons/Heart Container.png', iconSize: [55, 43]});
var poeSoulI = createIcon('Soul0', 118, 119);
var smaKeyI = L.icon({iconUrl: 'Icons/Small Key.png', iconSize: [28.9, 55]});
var bossKeyI = createIcon('Boss Key', 32.5, 55);
var gBK0I = createIcon('GBK0', 125, 88);
var gBK1I = createIcon('GBK1', 100, 107);
var gBK2I = createIcon('GBK2', 118, 106);
var bedroomKeyI = createIcon("Bedroom Key", 83, 128);
var mapI = L.icon({iconUrl: 'Icons/Dungeon Map.png', iconSize: [50, 42]});
var compaI = createIcon('Compass', 55, 55);
var pumpkinI = createIcon('Ordon Pumpkin', 128, 128);
var cheeseI = createIcon('Ordon Goat Cheese', 128, 128);
var fusShaI = createIcon('Fused Shadow0', 51.9, 55);
var shardI = L.icon({iconUrl: 'Icons/Shard.png', iconSize: [50, 47.4]});
var gRI = L.icon({iconUrl: 'Icons/Green Rupee.png', iconSize: [35, 55]}); 
var bRI = L.icon({iconUrl: 'Icons/Blue Rupee.png', iconSize: [35, 55]});
var yRI = L.icon({iconUrl: 'Icons/Yellow Rupee.png', iconSize: [35, 55]});
var rRI = L.icon({iconUrl: 'Icons/Red Rupee.png', iconSize: [35, 55]}); 
var pRI = L.icon({iconUrl: 'Icons/Purple Rupee.png', iconSize: [35, 55]}); 
var oRI = L.icon({iconUrl: 'Icons/Orange Rupee.png', iconSize: [35, 55]}); 
var sRI = L.icon({iconUrl: 'Icons/Silver Rupee.png', iconSize: [35, 55]}); 
var seedsI = createIcon('Seeds', 124, 125);
var arrowsI = createIcon('Arrows', 91, 128);
var bombsI = createIcon('Bombs', 332, 382)
var watBomI = createIcon('Water Bombs', 1, 1);
//Item Icons
var wooSwoI = createIcon('Sword0', 35.7, 55, 'Wooden Sword');
var ordSwoI = createIcon('Sword1', 35.5, 55);
var masSwoI = createIcon('Sword2', 79, 127);
var ordShieI = createIcon('Shield0', 49.3, 55);
var woodShieI = createIcon('Shield1', 41.9, 55);
var hylShieI = createIcon('Shield2', 44.3, 55);
var hawkeyeI = createIcon('Hawkeye', 55, 49.4);
var redPotI = createIcon('PotionRed', 34.6, 55);
var zoraArmI = createIcon('Zora Armor', 128, 150);
var magArmI = createIcon('Magic Armor', 125, 149);
var bigQuivI = createIcon('Quiver1', 128, 128);
var giaQuivI = createIcon('Quiver2', 128, 128);
var auruI = createIcon('Auru', 462, 619);
var asheiI = createIcon('Ashei', 462, 619);
var coralI = createIcon('Coral Earring', 128, 210);
var bottleI = L.icon({iconUrl: 'Icons/Bottle0.png', iconSize: [33.9, 55]});
var gBI = L.icon({iconUrl: 'Icons/Gale Boomerang.png', iconSize: [36, 60]});
var bACI = L.icon({iconUrl: 'Icons/Ball And Chain.png', iconSize: [60, 56]});
var ooccooI = L.icon({iconUrl: 'Icons/Ooccoo.png', iconSize: [46.5, 50]});
var lockI = L.icon({iconUrl: 'Icons/Lock.png', iconSize: [40, 40]});
var clawI = L.icon({iconUrl: 'Icons/Clawshot.png', iconSize: [49, 50]});
var dclawI = L.icon({iconUrl: 'Icons/ClawshotD.png', iconSize: [55, 51.1]})
var shaCryI = L.icon({iconUrl: 'Icons/Shadow Crystal.png', iconSize: [29, 60]});
//Tracker Icons
var frI = L.icon({iconUrl: 'Icons/Fishing Rod0.png', iconSize: [24, 55]});
var freI = L.icon({iconUrl: 'Icons/Fishing Rod1.png', iconSize: [24, 55]});
var slI = L.icon({iconUrl: 'Icons/Slingshot.png', iconSize: [35.6, 55]});
var laI = L.icon({iconUrl: 'Icons/Lantern.png', iconSize: [28.3, 55]});
var gaboI = L.icon({iconUrl: 'Icons/Boomerang.png', iconSize: [27.5, 55]});
var iBI = L.icon({iconUrl: 'Icons/Iron Boots.png', iconSize: [55, 55]});
var bowI = createIcon('Bow', 138, 138, "Hero's Bow");
var bBI = L.icon({iconUrl: 'Icons/Bomb Bag.png', iconSize: [40.7, 55]});
var gBBI = createIcon('Giant Bomb Bag', 125, 164);
var claI = L.icon({iconUrl: 'Icons/Clawshot0.png', iconSize: [39.3, 55]});
var doclaI = L.icon({iconUrl: 'Icons/Clawshot1.png', iconSize: [55, 43.7]});
var spinI = L.icon({iconUrl: 'Icons/Spinner.png', iconSize: [39.3, 55]});
var balChaI = L.icon({iconUrl: 'Icons/Ball and Chain0.png', iconSize: [39.3, 55]});
var reddomI =  L.icon({iconUrl: 'Icons/Dominion Rod0.png', iconSize: [34.3, 55]});
var domI =  L.icon({iconUrl: 'Icons/Dominion Rod1.png', iconSize: [34.3, 55]});
var walI = L.icon({iconUrl: 'Icons/Wallet0.png', iconSize: [32.8, 55]});
var walbigI = L.icon({iconUrl: 'Icons/Wallet1.png', iconSize: [35.9, 55]});
var walgiI = L.icon({iconUrl: 'Icons/Wallet2.png', iconSize: [42.2, 55]});

// Items
var fishingRod = new Item('Fishing Rod', frI, frI);
var fishingRodCE = new Item('Fishing Rod + Earring', freI, freI);
var slingshot = new Item('Slingshot', slI, slI);
var lantern = new Item('Lantern', laI, laI);
var boomerang = new Item('Gale Boomerang', gBI, gaboI);
var ironBoots = new Item('Iron Boots', iBI, iBI);
var bow = new Item("Hero's Bow", bowI, bowI);
var bombBag = new Item('Bomb Bag', bBI, bBI);
var clawshot = new Item('Clawshot', clawI, claI);
var doubleClawshot = new Item('Double Clawshots', dclawI, doclaI);
var spinner = new Item('Spinner', spinI, spinI);
var ballAndChain = new Item('Ball and Chain', bACI, balChaI);
var redDominionRod = new Item('Powerless Dominion Rod', reddomI, reddomI);
var dominionRod = new Item('Dominion Rod', domI, domI);
var shadowCrystal = new Item('Shadow Crystal', shaCryI, shaCryI);
var woodenSword = new Item('Wooden Sword', wooSwoI, wooSwoI);
var masterSword = new Item('Master Sword', masSwoI, masSwoI);
var zoraArmor = new Item('Zora Armor', zoraArmI, zoraArmI);
var magicArmor = new Item('Magic Armor', magArmI, magArmI);
var wallet = new Item('Wallet', walI, walI);
var bigWallet = new Item('Big Wallet', walbigI, walbigI);
var giantWallet = new Item('Giant Wallet', walgiI, walgiI);
var gateKeys = new Item('Gate Keys', smaKeyI, smaKeyI);
var asheiSketch = new Item("Ashei's Sketch", asheiI, asheiI);

//Storage Units
var baseSU = new StorageUnit('base' , // 400 checks
    "00000000000000000000000000000000000000000000000000" + 
    "00000000000000000000000000000000000000000000000000" +
    "00000000000000000000000000000000000000000000000000" +
    "00000000000000000000000000000000000000000000000000" +
    "00000000000000000000000000000000000000000000000000" +
    "00000000000000000000000000000000000000000000000000" +
    "00000000000000000000000000000000000000000000000000" +
    "00000000000000000000000000000000000000000000000000");
var poesSU = new StorageUnit('poes', '000000000000000000000000000000000000000000000000000000000000'); // 60 checks
var giftsSU = new StorageUnit('gifts', '000000000000000000000000000000000000000000000000000000000'); // 57 checks
var bugsSU = new StorageUnit('bugs', '000000000000000000000000'); // 24 checks
var skillsSU = new StorageUnit('skills', '0000000000000'); // 7 + 6 = 13 checks (Skills + Stones)
var skycSU = new StorageUnit('skyc', '000000'); // 6 checks
var shopSU = new StorageUnit('shop', '0000000'); // 7 checks
var ooccooSU = new StorageUnit('ooccoo', '0000000'); // 7 flags
var lockedDoorSU = new StorageUnit('locked', '000000000000000000000000000000000000000000000000000000000000');  // 60 flags      
var notaRupeesSU = new StorageUnit('notaRupee', '0000000000000000000000000000000000000000'); // 40 flags

var trackerSU = new StorageUnit('tracker', '0000000000000000000000010\0\0' + '0\0' + '00000000000000000000000000000'); // 59 flags
var settingSU = new StorageUnit('settings', '111111111111011111111111111111111111111111111111111111111111'); // 60 flags

var storUnits = [baseSU, poesSU, giftsSU, bugsSU, skillsSU, skycSU, shopSU,
     ooccooSU, lockedDoorSU, notaRupeesSU, trackerSU, settingSU];


//Global variables
var visibleCategories = [];
var trackerItems = [];
var obtainedItems = [];

var provinces;
var dungeons;

var loadedDungeon;
var activeFloor;
var floorOffset;

var map;
var TL;
var mapState;


document.addEventListener("DOMContentLoaded", function() {
    console.time('Start');

    //Checking Local Storage
    for (let i = 0; i < storUnits.length; ++i) 
        storUnits[i].checkIfInitialized();

    //Loading Settings
    let settingsFlags = settingSU.getAllFlags();
    let settings = document.querySelectorAll("input[type='checkbox']");
    for(var i = 0; i < settings.length; i++) {
        if (settingsFlags[i] == '1') {
            settings[i].checked = true;
            switch(i) {
                case 1: visibleCategories.push('base'); break;
                case 2: visibleCategories.push('poes'); break;
                case 3: visibleCategories.push('bugs'); break;
                case 4: visibleCategories.push('gifts'); break;
                case 5: visibleCategories.push('skyc'); break;
                case 6: visibleCategories.push('skills'); break;
                case 7: visibleCategories.push('shop'); break;
                case 9: visibleCategories.push('ooccoo'); break;
                case 10: visibleCategories.push('locked'); break;
                case 11: visibleCategories.push('notaRupee'); break;
                case 13: visibleCategories.push('bottle'); break;
                case 14: visibleCategories.push('rshop'); break;
                case 15: visibleCategories.push('grass'); break;
                case 16: visibleCategories.push('monrup'); break;
                case 17: visibleCategories.push('fish'); break;
            }
        }   
    }


    //Loading Tracker
    var t = document.getElementsByClassName('titem');
    for (let i = 0; i < t.length; ++i) {
        t[i].addEventListener('click', function() {increaseState(i)});
        t[i].addEventListener('contextmenu', function() {decreaseState(i)});
    }
    trackerItems[0] = new TrackerItem(t[0], 2, 2, [fishingRod, fishingRodCE]); // Fishing Rods
    trackerItems[1] = new TrackerItem(t[1], 0, 1, slingshot); // Slingshot
    trackerItems[2] = new TrackerItem(t[2], 0, 1, lantern); // Lantern
    trackerItems[3] = new TrackerItem(t[3], 0, 1, boomerang); // Boomerang
    trackerItems[4] = new TrackerItem(t[4], 0, 1, ironBoots);  // Iron Boots
    trackerItems[5] = new TrackerItem(t[5], 1, 3, bow); // Bow
    trackerItems[6] = new TrackerItem(t[6], 0, 1) // Hawkeye
    trackerItems[7] = new TrackerItem(t[7], 3, 3, bombBag); // Bomb Bags
    trackerItems[8] = new TrackerItem(t[8], 0, 1); // Big Bomb Bag
    trackerItems[9] = new TrackerItem(t[9], 2, 2, [clawshot, doubleClawshot]); // Clawshots
    trackerItems[10] = new TrackerItem(t[10], 0, 1, spinner); // Spinner
    trackerItems[11] = new TrackerItem(t[11], 0, 1, ballAndChain); // Ball and Chain
    trackerItems[12] = new TrackerItem(t[12], 2, 2, [redDominionRod, dominionRod]); // Dominion Rod
    trackerItems[13] = new TrackerItem(t[13], 0, 1); // Horse Call
    trackerItems[14] = new TrackerItem(t[14], 3, 7); // Sky Characters
    trackerItems[15] = new TrackerItem(t[15], 0, 1, asheiSketch); // Ashei's Sketch
    trackerItems[16] = new TrackerItem(t[16], 0, 1); // Auru's Memo
    trackerItems[17] = new TrackerItem(t[17], 3, 4); // Bottles
    trackerItems[18] = new TrackerItem(t[18], 0, 1, shadowCrystal); // Shadow Crystal
    trackerItems[19] = new TrackerItem(t[19], 1, 4); // Swords
    trackerItems[20] = new TrackerItem(t[20], 1, 3); // Shields
    trackerItems[21] = new TrackerItem(t[21], 0, 1, zoraArmor); // Zora Armor
    trackerItems[22] = new TrackerItem(t[22], 0, 1, magicArmor); // Magic Armor
    trackerItems[23] = new TrackerItem(t[23], 2, 3, [wallet, bigWallet, giantWallet]); // Wallets
    trackerItems[24] = new TrackerItem(t[24], 3, 7); // Hidden Skills
    trackerItems[25] = new TrackerItem(t[25], 3, 24); // Golden Bugs
    trackerItems[26] = new TrackerItem(t[26], 3, 60); // Poes
    trackerItems[27] = new TrackerItem(t[27], 1, 5); // Scents
    trackerItems[28] = new TrackerItem(t[28], 3, 45); // Heart Pieces
    trackerItems[29] = new TrackerItem(t[29], 3, 8); // Heart Containers
    trackerItems[30] = new TrackerItem(t[30], 3, 3); // Fused Shadows
    trackerItems[31] = new TrackerItem(t[31], 3, 4); // Mirror Shards
    trackerItems[32] = new TrackerItem(t[32], 0, 1, gateKeys); // Gate Keys
    trackerItems[33] = new TrackerItem(t[33], 3, 3); // Hyrule Castle Keys
    trackerItems[34] = new TrackerItem(t[34], 0, 1); // Hyrule Castle Boss Key
    trackerItems[35] = new TrackerItem(t[35], 0, 1); // Diababa
    trackerItems[36] = new TrackerItem(t[36], 3, 4); // Forest Temple Keys
    trackerItems[37] = new TrackerItem(t[37], 0, 1); // Forest Temple Boss Key
    trackerItems[38] = new TrackerItem(t[38], 0, 1); // Fyrus
    trackerItems[39] = new TrackerItem(t[39], 3, 3); // Goron Mines Keys
    trackerItems[40] = new TrackerItem(t[40], 3, 3); // Goron Mines Boss Keys
    trackerItems[41] = new TrackerItem(t[41], 0, 1); // Morpheel
    trackerItems[42] = new TrackerItem(t[42], 3, 3); // Lakebed Temple Keys
    trackerItems[43] = new TrackerItem(t[43], 0, 1); // Lakebed Temple Boss Key
    trackerItems[44] = new TrackerItem(t[44], 0, 1); // Stallord
    trackerItems[45] = new TrackerItem(t[45], 3, 5); // Arbiter's Grounds Keys
    trackerItems[46] = new TrackerItem(t[46], 0, 1); // Arbiter's Grounds Boss Key
    trackerItems[47] = new TrackerItem(t[47], 0, 1); // Blizzeta
    trackerItems[48] = new TrackerItem(t[48], 3, 4); // Snowpeak Ruins Keys
    trackerItems[49] = new TrackerItem(t[49], 0, 1); // Snowpeak Ruins Boss Key
    trackerItems[50] = new TrackerItem(t[50], 0, 1); // Armogohma
    trackerItems[51] = new TrackerItem(t[51], 3, 3); // Temple of Time Keys
    trackerItems[52] = new TrackerItem(t[52], 0, 1); // Temple of Time Boss Key
    trackerItems[53] = new TrackerItem(t[53], 0, 1); // Argorok
    trackerItems[54] = new TrackerItem(t[54], 3, 1); // City in the Sky Keys
    trackerItems[55] = new TrackerItem(t[55], 0, 1); // City in the Sky Boss Key
    trackerItems[56] = new TrackerItem(t[56], 0, 1); // Zant
    trackerItems[57] = new TrackerItem(t[57], 3, 7); // Palace of Twilight Keys
    trackerItems[58] = new TrackerItem(t[58], 0, 1); // Palace of Twilight Boss Key
    for (let i = 0; i < trackerItems.length; ++i) {
        let state = i == 25 || i == 26 || i == 28 ? trackerSU.getFlagAsCharCode(i) : trackerSU.getFlagAsNumber(i);
        if (state < trackerItems[i].max / 2) {
            for (let _ = 0; _ < state; ++_)
                increaseState(i);
        }
        else {
            for (let _ = trackerItems[i].max; _ >= state; --_)
                decreaseState(i);
        }
    }

    map = L.map('map', {
        zoom: -5,
        minZoom: -5,
        maxZoom: 0,
        center: [-4913, 4257],
        crs: L.CRS.Simple,
        maxBoundsViscosity: 1,
        zoomControl: false,
        keyboard: false,
        doubleClickZoom: false
    }); 
    TL = L.tileLayer('Tiles/{z}/{x}/{y}.png', {
        maxZoom: 0,
        minZoom: -6,
        zoomOffset: 6,
        crs: L.CRS.Simple,
        bounds: [[0, 0], [-9826, 8515]] 
    })

    console.time('Checks Creation');
    //Used more than once so can't be declared in the array
    let castlePoints = [
        [-2798, 5430], [-2863, 5622], [-2940, 5472], [-3184, 5586], [-3188, 5550], [-3362, 5552], [-3357, 5551], [-3357, 5588], 
        [-3225, 5632], [-3481, 5705], [-3556, 5756], [-3558, 5664], [-3653, 5729], [-3370, 5828], [-3702, 5958], [-3707, 5907], 
        [-3782, 5912], [-3938, 5914], [-3938, 4990], [-3788, 4994], [-3707, 4986], [-3706, 4940], [-3358, 5074], [-3649, 5173], 
        [-3558, 5242], [-3552, 5158], [-3218, 5266], [-3360, 5325], [-3359, 5348], [-3184, 5345], [-3180, 5304], [-2936, 5440]];
    provinces = [
        new Province([ // Ordona
            [-8053, 5568], [-7628, 6232], [-8208, 6872], [-8776, 7160], [-9752, 6952], [-9876, 6564], [-9976, 5776], [-9924, 5088], 
            [-9750, 4672], [-8792, 4338], [-7853, 4693]
        ], false, [-8816, 5664], [
            new Check([-9094, 4809], frI, giftsSU, undefined, undefined, 'Retrieve the cradle from the monkey using the hawk and deliver it to Uli to receive the fishing rod.'),
            new Check([-8542, 4795], golWolfI, skillsSU, undefined, [shadowCrystal], 'Summoned by the Death Mountain howling stone.'),
            new Check([-9514, 4964], hPI, giftsSU, undefined, undefined, 'After getting Epona back from the monsters, talk to Fado and complete the Goat Hoarding minigame in under 2 minutes to receive the heart piece.'),

            new FakeCheck([-9058, 4788], oRI, notaRupeesSU, [[boomerang, clawshot]], "This orange rupee is hiding behind Rusl's house, use the boomerang or clawshot through the vines to obtain it."),
            new FakeCheck([-9006, 4999], pRI, notaRupeesSU, [[boomerang, clawshot]], 'This purple rupee is hidden in the tall grass on the little platform to the left of the windmill.'),

            new NonCheck([-9517, 5015], horseGI, 'grass'),
            new NonCheck([-8500, 4800], horseGI, 'grass'),
            new NonCheck([-8991, 4960], hawkGI, 'grass'),
            new NonCheck([-8940, 5001], hawkGI, 'grass'),
            new NonCheck([-9169, 4934], hawkGI, 'grass'),
            new NonCheck([-9035, 4848], beeI, 'bottle'),
            //Monkey fishing spot
            //Cat fishing spot 
            //Uli House fishing spot


            new FlooredSubmap([-8791, 4941], orDoorI, 'LinkHouse', [
                [[660, 485], [new Check([-8790, 5289], cI, baseSU, pRI, [lantern], 'Use the lantern to locate the chest and be able to open it.')]],
                [[659, 478], [new Check([-8661, 5068], cI, baseSU, wooSwoI, undefined, 'The chest is available after buying the slingshot.')]]
            ], 2),
            new Submap([-8964, 4938], orDoorI, 'SeraShop.png', [464, 491], [
                new Check([-8790, 5034], slI, shopSU, undefined, undefined, "After saving Sera's Cat, you can buy the slingshot for 30 rupees."),
                new Check([-8837, 4880], bottleI, giftsSU, undefined, [fishingRod], 'Obtain the bottle by talking to Sera her cat has returned with a fish you gave him with the fishing rod.')
                //Add Entire Shop
            ]),
            new Submap([-9080, 4783], orDoorI, 'RuslHouse.png', [656, 449], [
                new Check([-9004, 4850], ordSwoI, baseSU, undefined, undefined, 'Pick up the sword on the couch after entering by the front door or by the side of the house by digging as Wolf Link.'),
            ]),
            new Submap([-9037, 5015], orDoorI, 'JaggleHouse.png', [661, 290], [
                new Check([-9044, 4410], ordShieI, baseSU, undefined, [shadowCrystal], 'Use Midna to jump to the ledge where the shield is, than bonk on the wall twice to make it fall and obtain it.')
            ]),
            new FlooredSubmap([-9171, 4953], orDoorI, 'Bo', [
                [[469, 780], [new Check([-9339, 5044], cI, giftsSU, iBI, undefined, 'After clearing the Eldin Twilight, wrestle against Bo to optain the iron boots.')]],
                [[333, 247], []]
            ]),
            new Submap([-9523, 4765], grottoI, g1.img, g1.imgSize, [
                new Check([-9267, 4700], cI, baseSU, pRI, [shadowCrystal, lantern], 'Light the 3 torches in front of the elevated platform to make the chest appear.'),
                //Blue / Rare Chu
            ])
        ]),
        new Province([ // Faron
            [-5412, 5564], [-5374, 5998], [-5954, 6282], [-5944, 7028], [-6700, 7216], [-7144, 6960], [-8048, 5568], [-7844, 4680],
            [-7360, 4200], [-6640, 3464], [-6360, 3744], [-5944, 3776], [-5834, 4743], [-5630, 4883]
        ], false, [-6512, 5536], [
            new Check([-7405, 4910], laI, baseSU, undefined, undefined, 'Talk to Coro to obtain the lantern.'), //TO VERIFY
            new Check([-7023, 4805], sCI, baseSU, smaKeyI, undefined, 'Walk into the cave and open the chest to obtain the key to the Faron Woods gate.'),
            new Check([-7023, 4834], cI, baseSU, hPI, [lantern], 'Light the 2 torches besides the small chest and climb the ledge to open the chest.'),
            new Check([-7121, 4136], sCI, baseSU, yRI, undefined, 'Defeat the Deku Baba and open the chest behind it.'),
            new Check([-7405, 4885], bottleI, giftsSU, undefined, undefined, 'After clearing the Faron twilight, talk to Coro and he will offer you the oil bottle for 100 rupees.'),
            new Check([-7104, 4184], golWolfI, skillsSU, undefined, undefined, 'Meet the golden wolf after clearing the Faron Twilight to learn the Ending Blow.'),
            new Check([-7235, 4518], sCI, baseSU, rRI, [lantern], 'Clear out the purple fog with the lantern and climb the ledge to reach the chest.'),
            new Check([-7010, 4567], sCI, baseSU, yRI, [lantern], 'Clear out the purple fog with the lantern and go to the left of the cave entrance to find the chest.'),
            new Check([-7351, 4513], cI, baseSU, pRI, [lantern], 'Clearn out the purple fog with the lantern and from the exit of the mist, go right to find the chest.'),
            new Check([-6278, 4930], hPI, baseSU, undefined, [[boomerang, clawshot]], 'The heart piece is on the leaves of a tree and can be grabbed with a long ranged item.'),
            new Check([-6344, 4764], bI('Beetle', true), bugsSU, undefined, undefined, 'This ♂ Beetle is on a tree trunk, simply pick it up.'),
            new Check([-5985, 5151], bI('Beetle', false), bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Beetle is on an elevated tree trunk, use the boomerang or the clawshot to bring it closer.'),
            new Check([-7184, 4515], poeSoulI, poesSU, undefined, [shadowCrystal], 'Use Midna jump to reach the platform where the poe is.'),
            new Check([-6801, 3677], masSwoI, baseSU, undefined, [shadowCrystal], 'Press A on the Master Sword to obtain it.'),
            new Check([-6850, 3677], shaCryI, baseSU, undefined, [shadowCrystal], 'Press A on the Master Sword to obtain the shadow crystal.'),
            new Check([-7184, 3722], bI('Snail', true), bugsSU, undefined, [[boomerang, clawshot]], 'This ♂ Snail is on the ceiling of the alcove with the broken chest.'),
            new Check([-6135, 4891], cI, baseSU, oRI, [clawshot], 'The chest is under the bridge. Clawshot the target above the chest to reach it.'),
            new Check([-5953, 4955], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. Above the flower patch.'),

            new FakeCheck([-7340, 4043], howlStoI, skillsSU, [shadowCrystal], 'Spawns the South Castle Town Golden Wolf, accessible while on the way to the Master Sword.'),

            new NonCheck([-7900, 4857], horseGI, 'grass'),
            new NonCheck([-7701, 4803], horseGI, 'grass'),
            new NonCheck([-6666, 4936], horseGI, 'grass'),
            // Faron spring fishing spot


            new Submap([-7447, 4718], caveEI, 'FaronEntryCave.png', [455, 495], [
                new Check([-7340, 4450], sCI, baseSU, yRI, undefined, 'Use the lantern to be able to locate the chest more easily.')
            ]),
            new Submap([-6662, 5180], grottoI, g2.img, g2.imgSize, [
                new Check([-6928, 5138], sCI, baseSU, yRI, [shadowCrystal], 'Defeat all the enemies and cut the grass to make it easier to reach the chest.'),
                new Check([-6533, 5308], sCI, baseSU, rRI, [shadowCrystal], 'Defeat all the enemies and cut the grass to make it easier to reach the chest.'),
                new Check([-6370, 5050], sCI, baseSU, rRI, [shadowCrystal], 'Defeat all the enemies and cut the grass to make it easier to reach the chest.'),
                //Blue/Rare Chu Jelly 
                //Rupees By Defeating enemies (25 rupees)
            ]),
            new Submap([-5652, 4644], grottoI, g5.img, g5.imgSize, [
                //Fishies + Worms
            ]),
        ]),
        new Province([ // Eldin
            [-5952, 6280], [-5936, 7020], [-5904, 7676], [-6044, 8248], [-5952, 8836], [-5612, 9452], [-5212, 9544], [-4584, 9492], 
            [-3932, 9572], [-3340, 9472], [-2956, 9196], [-2460, 9040], [-1972, 8608], [-1404, 8006], [-1228, 7352], [-2164, 7080], 
            [-2772, 7060], [-2989, 7110], [-3281, 6985], [-3432, 6760], [-3580, 6472], [-3748, 6372], [-3932, 6324], [-4276, 6340], 
            [-4419, 6316], [-4680, 6260], [-5060, 5972], [-5332, 6004],
        ], false, [-4096, 7904], [
            new Check([-5504, 8095], cI, baseSU, pRI, [lantern], 'Light the 2 torches to make it appear the chest appear.'),
            new Check([-5448, 8123], bI('Ant', true), bugsSU, undefined, undefined, 'This ♂ Ant is a the base of the tree.'),
            new Check([-4064, 6973], bI('Grasshopper', true), bugsSU, undefined, undefined, 'This ♂ Grasshopper is particulary hard to get. Use the boomerang or clawshot if necessary.'),
            new Check([-3372, 5952], bI('Grasshopper', false), bugsSU, undefined, undefined, 'This ♀ Grasshopper is just lying on the ground.'),
            new Check([-3158, 7408], bI('Phasmid', true), bugsSU, undefined, [[boomerang, clawshot]], "This ♂ Phasmid is too high to reach, so you'll need to use the clawshot or the boomerang to make it come down."),
            new Check([-2390, 7561], bI('Phasmid', false), bugsSU, undefined, [[boomerang, clawshot]], "This ♀ Phasmid is too high to reach, you can use the boomerang from down below to reach her, or " + 
                "climb the ledge using the clawshot target."),
            new Check([-5584, 6316], bI('Pillbug', false), bugsSU, undefined, undefined, 'This ♀ Pill Bug is hidden in the tall grass.'),
            new Check([-5431, 6004], bI('Pillbug', true), bugsSU, undefined, undefined, 'This ♂ Pill Bug is just lying on the ground.'),
            new Check([-5299, 5673], hPI, baseSU, undefined, [[boomerang, clawshot]], 'The heart piece is sitting on top of the stone pillar.'),
            new Check([-5263, 5626], cI, baseSU, hPI, [doubleClawshot], 'Use the target path and the vines to reach the chest.<br>Glitch: Use the boomerang to LJA to the chest.'),
            new Check([-5130, 7593], hPI, giftsSU, undefined, [bow], 'After completing the Goron Mines, talk to Talo on top of the watchtower to play his minigame, than succeed to obtain the heart piece.'),
            new Check([-5053, 7538], cI, baseSU, oRI, [[bombBag, ballAndChain]], "Blow up the rock south of the village near the spring, and use the chickens inside the cave (they are near the center of the village if "+
                "you reload the area) to:<br>1. Climb behind Malo Mart and make the jump to the Inn<br>2. Climb on top of the inn and jump towards the top of Barnes' shop<br>3. Climb to the base of the watchtower near the goron" + 
                "<br>4. Go to the left side of the watchtower, and jump towards the chest with the chicken.<br>The chest is above the path to Death Mountain."),
            new Check([-5847, 7696], cI, baseSU, hPI, [[bombBag, ballAndChain], [ironBoots, magicArmor]], 'Break the rock to enter the cave, then let yourself sink in the water at the end of the cave.'),
            new Check([-4399, 6674], cI, baseSU, hPI, [[bombBag, ballAndChain]], 'Destroy the rocks at the bottom of the trail, than start climbing. Once you reach the vines with a rock on top, use a well timed bomb throw or ' +
                'the ball and chain to destroy the rock. Then, make the jump and climb the vines, than jump down a few times to reach the chest.'),
            new Check([-5474, 8273], zoraArmI, giftsSU, undefined, [gateKeys], 'Save Ralis and follow Rutella through the graveyard to obtain the Zora Armor.'),
            new Check([-5228, 7767], poeSoulI, poesSU, undefined, [shadowCrystal], "Appears only at Night.In the ruins of Barnes' old warehouse."),
            new Check([-5107, 7621], poeSoulI, poesSU, undefined, [shadowCrystal], "Appears only at Night. At the base of the watchtower."),
            new Check([-5610, 7578], hPI, baseSU, undefined, [[boomerang, bow], bombBag], "Use the bomb arrows to blow up the rocks up on the ledge, than use the boomerang or the clawshot to obtain the heart piece"),
            new Check([-5455, 8048], poeSoulI, poesSU, undefined, [shadowCrystal], "Appears only at Night. Near the graves."),
            new Check([-4331, 8118], poeSoulI, poesSU, undefined, [shadowCrystal], "Appears only at Night. Up on the ledge, use a goron or the clawshot to get up."),
            new Check([-4049, 8169], cI, baseSU, hPI, [clawshot], 'Clawshot the vines hanging from the stone bridge and jump down the alcove to the chest.'),
            new Check([-3944, 5550], hPI, giftsSU, undefined, undefined, 'After repairing the bridge for 1000 rupees, talk to the Goron Elder in front of the Malo Mart in Kakariko and bring the springwater to the goron.'),
            new Check([-5347, 5978], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at night. Behind the tree with the crows.'),
            new Check([-5473, 8235], coralI, giftsSU, undefined, [asheiSketch], 'Show the sketch to Ralis to obtain the coral earring.'),
            new Check([-5479, 8140], golWolfI, skillsSU, undefined, [shadowCrystal], 'Summoned by the Snowpeak Howling Stone.'),
            new Check([-5493, 7987], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. Push the south-west grave to reveal the poe.'),

            new FakeCheck([-4063, 8232], howlStoI, skillsSU, [shadowCrystal], 'This Howling Stone is accessible while clearing out the Eldin Twilight. It spawns the Ordon Spring golden wolf.'),
            new FakeCheck([-5380, 5510], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'Blow up the rock with a bomb or hit it with the ball and chain to reveal rupees.'),       
            new FakeCheck([-5840, 7667], rupRockI, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'The rock is underwater in front of the chest.'),
            new FakeCheck([-5074, 5909], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'The rock is in the middle of the field.'),
            new FakeCheck([-4269, 8150], rRI, notaRupeesSU, undefined, 'There are 4 red rupees hidden under rocks near the poes, for a total of 80 rupees.'),
            new FakeCheck([-5513, 7720], sRI, notaRupeesSU, [bombBag, bow], 'Climb up the sanctuary with Midna jumps or a Cucco, than shoot a bomb arrow at the bell to make the rupee drop.'),
            new FakeCheck([-5518, 8237], rupRockI, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'Underwater, right of the Zora shrine.'),
            new FakeCheck([-2391, 7503], rupRockI, notaRupeesSU, [[bombBag, ballAndChain], 'In the open, near the cave entrance.']),

            new NonCheck([-5564, 7612], horseGI, 'grass'),
            new NonCheck([-4716, 6818], horseGI, 'grass'),
            new NonCheck([-5342, 6186], horseGI, 'grass'),
            new NonCheck([-4108, 8225], hawkGI, 'grass'),
            new NonCheck([-5507, 8125], beeI, 'bottle'),
            new NonCheck([-4102, 8260], beeI, 'bottle'), //Guaranteed Rare Chu Jelly
            // Kak Goron Night Shop
            // Death Mountain Shop
            // Graveyard Crows (22 rupees)
            // Gorge Tree Crows (30 rupees)
            //Eldin spring fishing spot
            //Graveyard fishing spot


            new Submap([-5259, 7660], orDoorI, 'KakEmptyHouse.png', [399, 230], [
                new Check([-5239, 7705], bI('Ant', false), bugsSU, undefined, undefined, 'This ♀ Ant is walking around the floor of the house.')
            ]),
            new FlooredSubmap([-5283, 7580], orDoorI, 'Inn', [
                [[600, 241], [new Check([-5330, 8105], sCI, baseSU, rRI, undefined, 'The chest is hidden under the staircase.')]],
                [[655, 343], []]
            ]),
            new Submap([-5162, 7670], orDoorI, 'Barnes.png', [399, 249], [
                new Check([-5300, 7755], bBI, shopSU, undefined, undefined, 'After clearing the Goron Mines, you buy this Bomb Bag from Barnes for 120 rupees.')
            ]),
            new FlooredSubmap([-5097, 7593], orDoorI, 'Watchtower', [
                [[379, 300], []],
                [[379, 274], [new Check([-5255, 7317], cI, baseSU, pRI, undefined, 'Climb the ladder to reach the chest.')]]
            ], 2),
            new Submap([-5382, 7565], orDoorI, 'KakMaloMart.png', [399, 286], [
                new Check([-5445, 7250], hylShieI, shopSU, undefined, undefined, 'You can buy it after saving Collin for 200 rupees.'),
                new Check([-5445, 7325], woodShieI, shopSU, undefined, undefined, 'You can buy it after saving Collin for 50 rupees.'),
                new Check([-5445, 7400], redPotI, shopSU, undefined, undefined, 'You can buy it after saving Collin for 30 rupees.'),
                new Check([-5445, 7475], hawkeyeI, shopSU, undefined, [bow], "You can buy it for 100 rupees after attempting the Talo's Sharpshooting minigame.")
                //Add Entire Shop
            ]),
            new Submap([-5711, 6043], caveEI, 'EldinCave.png', [862, 780], [
                new Check([-5810, 6372], cI, baseSU, pRI, [[bombBag, ballAndChain]], 'Kill the skulltula and open the chest.'),
                new Check([-5469, 6199], poeSoulI, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'Use your senses to see the poe at the end of this branch.'),
                new Check([-5399, 6319], cI, baseSU, hPI, [[bombBag, ballAndChain], lantern], 'Light the 2 torches to make the chest appear.'),
                new Check([-5530, 5822], sCI, baseSU, rRI, [[bombBag, ballAndChain]], 'Use bombs or the ball and chain to destroy the cobwebs and reach the chest.'),
                new NonCheck([-5604, 5704], beeI, 'bottle') //Yellow Chu
            ]),
            new Submap([-5607, 6282], grottoI, g2.img, g2.imgSize, [
                //Keese that drop rupees (25 rupees)
            ]),
            new Submap([-3772, 6334], grottoI, g1.img, g1.imgSize, [
                new Check([-3527, 6279], cI, baseSU, pRI, [shadowCrystal, lantern], 'Light the 2 torches to make the chest appear.'),
                new Check([-3678, 6013], sCI, baseSU, pRI, [shadowCrystal], 'Hidden in the tall grass.'),
                //8 Bombskits Worms.
                //Rare/Blu Chu
            ]),
            new Submap([-3249, 7223], grottoI, g5.img, g5.imgSize, [
                new Check([-2987, 7192], sCI, baseSU, pRI, [shadowCrystal], 'Cross the water to reach the chest. Be careful of the Skullfish and Bombfish.'),
                new NonCheck([-2941, 7190], beeI, 'bottle'),
                //Skullfish and Bombfish Fishing spot
            ]),
            new FlooredSubmap([-2400, 7597], caveEI, 'LavaCave', [
                [[494, 275], [
                    new Check([-2310, 7530], cI, baseSU, oRI, [clawshot, ironBoots, lantern], 'Light the 2 torches to make the chest appear.'),
                    new Check([-2419, 7522], cI, baseSU, hPI, [clawshot, ironBoots], 'Defeat the Dodongo to make opening the chest easier.')
                ]],
                [[495, 275], [new Check([-2253, 7920], sCI, baseSU, rRI, [clawshot, ironBoots], 'From the entrance at the top, jump down in the magnetic field with the Iron Boots to reach the chest.')]],
                [[318, 275], []],
                [[319, 275], []]
            ]),
            new Submap([-1543, 7011], grottoI, g2.img, g2.imgSize, [
                new Check([-1282, 6999], cI, baseSU, hPI, [spinner, shadowCrystal, [bombBag, ballAndChain]], 'Defeat the 3 Stalfos to make the chest appear.'),
                new Check([-1529, 6815], sCI, baseSU, qI(bombsI, 5), [spinner, shadowCrystal], 'Hidden in the west tall grass, cut it to make the chest easier to see.'),
                new Check([-1566, 7150], sCI, baseSU, qI(bombsI, 5), [spinner, shadowCrystal], 'Hidden in the east tall grass, cut it to make the chest easier to see.')
            ])

        ]),
        new Province([ // Desert
            [-6646, 3472], [-6704, 2448], [-6584, 1152], [-6208, 880], [-5240, 1000], [-3668, 1256], [-3480, 1804], [-3646, 2242], 
            [-3804, 2924], [-3840, 3154], [-4984, 3264], [-5116, 3148], [-5280, 3184], [-5472, 3256], [-5640, 3424], [-5953, 3742],
            [-6336, 3736]
        ], false, [-5440, 2224], [
            new Check([-4664, 582], golWolfI, skillsSU, undefined, [shadowCrystal], 'Summoned by the Lake Hylia howling stone.'),
            new Check([-6110, 2588], poeSoulI, poesSU, undefined, [shadowCrystal], 'Appears only at Night. Above the grotto entrance, near the skulls.'),
            new Check([-5736, 2179], sCI, baseSU, rRI, undefined, 'Clawshot the peahat over the chasm or walk all the way around it to reach the chest.'),
            new Check([-6108, 2148], sCI, baseSU, rRI, [clawshot], 'Clawshot the tree peahat to reach the higher platform where the chest is.'),
            new Check([-5825, 1480], sCI, baseSU, qI(arrowsI, 10), undefined, 'The chest is on the dark rock platform.'),
            new Check([-6101, 1450], bI('Dayfly', true), bugsSU, undefined, undefined, 'This ♂ Dayfly is flying around above the sand.'),
            new Check([-5964, 934], bI('Dayfly', false), bugsSU, undefined, undefined, 'This ♀ Dayfly is flying around in the north gap with rocky walls.'),
            new Check([-5792, 322], sCI, baseSU, pRI, [clawshot], 'Clawshot the peahat to cross the chasm and get to the chest.'),
            new Check([-6077, 560], poeSoulI, poesSU, undefined, [clawshot, shadowCrystal], 'Only appears at Night. Next to the Cave of Ordeals entrance.'),
            new Check([-5125, 1380], poeSoulI, poesSU, undefined, [clawshot, shadowCrystal], 'Clawshot the tree peahat to reach the higher platform. The Poe is above the grotto entrance.'),
            new Check([-5048, 655], sCI, baseSU, rRI, undefined, 'The chest is near the campfire.'),
            new Check([-5090, 705], sCI, baseSU, pRI, undefined, 'Destroy the wooden tower with a boar or the ball and chain to gain access to the chest.'),
            new Check([-5090, 605], sCI, baseSU, qI(arrowsI, 10), undefined, 'Destroy the wooden tower with a boar or the ball and chain to gain access to the chest.'),
            new Check([-4831, 856], sCI, baseSU, rRI, undefined, 'Destroy the wooden gate with a boar to gain access to the chest.'),
            new Check([-4936, 356], sCI, baseSU, rRI, undefined, 'Destroy the wooden gate with a boar to gain access to the chest.'),
            new Check([-6405, 1573], cI, baseSU, oRI, undefined, 'Bring a boar from the entrance of the desert or the campfire to destroy the 2 gates blocking access to the chest.'),
            new Check([-4663, 704], sCI, baseSU, qI(arrowsI, 10), undefined, 'Follow the right path after the campfire to reach the chest.'),
            new Check([-4320, 692], sCI, baseSU, qI(arrowsI, 20), undefined, 'Behind the wooden tower.'),
            new Check([-4219, 628], sCI, baseSU, pRI, undefined, 'In the corner, defeat the Bulblins for easier access to the chest.'),
            new Check([-4171, 711], hPI, baseSU, undefined, [[woodenSword, bow, ballAndChain, bombBag]], 'Destroy the roasting boar to reveal the heart piece.'),
            new Check([-4151, 668], smaKeyI, baseSU, undefined, undefined, 'Kill the Bulblin that has the key to collect it. In Rando, the item is simply on the ground.'),
            new Check([-3892, 557], poeSoulI, poesSU, undefined, [shadowCrystal], "On the left of the entrance of Arbiter's Grounds."),
            new Check([-3889, 654], cI, baseSU, pRI, [lantern], "Light the 2 torches on the right of the entrance of Arbiter's Grounds to make the chest appear."),
            new Check([-4292, 604], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. After defeating King Bulblin, return to where the find happened to find the poe.'),
            new Check([-4623, 470], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. Take the left path twice from the campfire to reach this poe.'),

            new Submap([-6060, 2588], grottoI, g4.img, g4.imgSize, [
                new Check([-5762, 2464], cI, baseSU, oRI, [shadowCrystal], 'Kill all the skulltulas to make the chest appear.')
            ]),
            new Submap([-5689, 638], grottoI, g3.img, g3.imgSize, [
                //Rare Chu ?
                //Red and Purple Chus
            ]),
            new Submap([-5075, 1380], grottoI, g3.img, g3.imgSize, [
                new Check([-4986, 1168], poeSoulI, poesSU, undefined, [clawshot, shadowCrystal], 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'),
                new Check([-5034, 1627], poeSoulI, poesSU, undefined, [clawshot, shadowCrystal], 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'),
                new Check([-4812, 1381], cI, baseSU, oRI, [clawshot, shadowCrystal, [bombBag, ballAndChain], lantern], 'Destroy the rocks blocking the way, then light 3 torches to make the chest appear.')
            ])
            //Cave of Ordeals
        ]),
        new Province([ // Peak
            [-712, 5344], [-1132, 5392], [-1296, 5360], [-1548, 5152], [-1690, 4891], [-1892, 4804], [-2076, 4624], [-2564, 4404], 
            [-2704, 4220], [-3036, 4080], [-3624, 3880], [-3812, 3184], [-3636, 2272], [-3436, 1720], [-2668, 1568], [-2092, 1804], 
            [-1696, 2288], [-852, 2616], [-620, 3676], [-584, 4612]
        ], false, [-1744, 3488], [
            new Check([-606, 4446], asheiI, giftsSU, undefined, undefined, 'Speak to Ashei to obtain her sketch.'),
            new Check([-307, 3521], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. Left of the rock the Reekfish Scent makes you go right of.'),
            new Check([-432, 3728], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. Above the grotto.'),
            new Check([-344, 3334], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. Above the grotto, behind the tree.'),
            new Check([-2985, 1299], poeSoulI, poesSU, undefined, [shadowCrystal], 'When in front of the mansion, go back to the snow trail as Wolf Link and climb the spiral structure. The poe is at the top.'),
            new Check([-691, 3013], hPI, giftsSU, undefined, [bombBag, ballAndChain], 'Requires having cleared Snowpeak Ruins. Race Yeto and win, than go back to the mountaintop and win against Yeta.'),
            new Check([-655, 3300], poeSoulI, poesSU, undefined, [ballAndChain, shadowCrystal], 'In the cave, break the north ice block with the ball and chain to reveal the poe.'),
            new Check([-675, 3275], cI, baseSU, oRI, [ballAndChain, shadowCrystal, lantern], 'In the cave, break the 2 ice blocks to reveal torches. Light them up to make the chest appear.'),

            new FakeCheck([-475, 3393], howlStoI, skillsSU, [shadowCrystal], 'Spawns the Kakariko Graveyard golden wolf.'),


            new Submap([-405, 3690], grottoI, g4.img, g4.imgSize, [
                new Check([-265, 3631], cI, baseSU, oRI, [shadowCrystal, ballAndChain], 'Kill the furthest Freezard to reveal the chest.')
            ]),
            new Submap([-390, 3350], grottoI, g3.img, g3.imgSize, [
                new NonCheck([-416, 3048], beeI, 'bottle'), // Rare/Blue Chu
            ])
        ]),   
        new Province([[ // Lanayru
            [-5400, 5584], [-5360, 6000], [-5056, 5968], [-4640, 6248], [-4312, 6336], [-3696, 6344], [-3528, 6472], [-3424, 6728], 
            [-3280, 6968], [-2992, 7104], [-2760, 7048], [-2096, 7072], [-1248, 7328], [-800, 7216], [-584, 6768], [-480, 6368], 
            [-504, 5832], [-606, 5444], [-722, 5358], [-1104, 5408], [-1288, 5376], [-1554, 5161], [-1704, 4896], [-1894, 4812], 
            [-2077, 4634], [-2539, 4431], [-2749, 4205], [-3632, 3892], [-3764, 3420], [-3820, 3180], [-4288, 3200], [-4974, 3290],
            [-5081, 3201], [-5319, 3218], [-5592, 3400], [-5936, 3768], [-5813, 4728], [-5776, 4750], [-5624, 4872], [-5552, 5096]
        ], castlePoints], false, [-2192, 5984], [
            new Check([-610, 4930], sCI, baseSU, yRI, undefined, 'From the water, climb the path to reach the chest.'),
            new Check([-601, 4967], sCI, baseSU, rRI, [shadowCrystal], 'Use Midna jumps to follow the path from the west shore of the domain to reach the chest.'),
            new Check([-5461, 3284], cI, baseSU, oRI, [[ironBoots, magicArmor]], 'The chest is underwater, hidden by some tall seaweed.'),
            new Check([-4604, 3418], bI('Mantis', true), bugsSU, undefined, [[boomerang, clawshot]], 'This ♂ Mantis is on the side of the bridge above the void. If you do not have a long ranged item, wait for it to fly near you.'),
            new Check([-5459, 3559], bI('Mantis', false), bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Mantis is too high to reach, use a long ranged item.'),
            new Check([-3658, 3845], bI('Butterfly', false), bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Butterfly is on a higher ledge hiding in the purples flowers. Clawshot the vines to climb the ledge ' +
                'or grab it from below.'),
            new Check([-4158, 3966], bI('Butterfly', true), bugsSU, undefined, undefined, 'This ♂ Butterfly is hiding in some purple flowers.'),       
            new Check([-2589, 4365], bI('Stag Beetle', true), bugsSU, undefined, [[boomerang, clawshot]], 'This ♂ Stag Beetle is on the trunk of a tree, a bit too high to reach.'),
            new Check([-2005, 4790], bI('Stag Beetle', false), bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Stag Beetle is above the entrance of the ice block cave, and is too high too reach.'),
            new Check([-2910, 4855], cI, baseSU, oRI, [[ironBoots, magicArmor]], 'The chest is in the cage underwater.'),
            new Check([-206, 4830], cI, baseSU, pRI, [boomerang, [ironBoots, magicArmor]], 'Blow out all of the 3 torches with the boomerang to make the chest appear.'),
            new Check([-206, 4870], cI, baseSU, pRI, [lantern, [ironBoots, magicArmor]], 'Light up all the 3 torches with the lantern to make the chest appear.'),
            new Check([-741, 4977], bI('Dragonfly', true), bugsSU, undefined, undefined, 'This ♂ Dragonfly is hiding in the tall grass.'),
            new Check([-879, 6022], bI('Dragonfly', false), bugsSU, undefined, undefined, 'This ♀ Dragonfly is on the side of the floating bridge. Drop down from the bridge to get it.'),
            new Check([-370, 6066], bottleI, baseSU, undefined, [fishingRod], 'Cast the fishing in the small pond isolated by the bridge to catch the bottle.'),
            new Check([-372, 5801], hPI, baseSU, undefined, undefined, 'Go fishing with the canoe (20 rupees) and use the provided fishing rod to reel in the heart piece. You can also use the clawshot.'),
            new Check([-853, 6061], bBI, giftsSU, undefined, [bow], 'Help Iza by blowing up all of the rocks blocking the river to receive the bomb bag.'),
            new Check([-904, 6064], gBBI, giftsSU, undefined, [bow], "Play Iza's Raging Rapids minigame and get atleast 25 points to obtain the giant bomb bag."),
            new Check([-4491, 4622], bI('LadybugF'), bugsSU, undefined, undefined, 'This ♀ Ladybug is in the grassy area next to the middle tree.'),
            new Check([-4572, 4909], bI('LadybugM'), bugsSU, undefined, undefined, 'This ♂ Ladybug is hiding in the flowers on the ground.'),
            new Check([-3917, 4177], golWolfI, skillsSU, undefined, [shadowCrystal], 'Summoned by the Upper Zora River howling stone.'),
            new Check([-3967, 5062], poeSoulI, poesSU, undefined, [shadowCrystal], 'On the bridge at night.'),
            new Check([-4364, 4644], cI, baseSU, oRI, [clawshot, shadowCrystal], '1. Clawshot the top of the target at the top of the right tower and climb up.<br>2. Transform into Wolf Link and cross the rope, then transform ' + 
                'back.<br>3. Slowly walk towards the ledge to hang from it, than hold left to crawl to the left platform.<br>4. Transform back into Wolf and cross the last rope to reach the chest.'),
            new Check([-4428, 4710], cI, baseSU, oRI, [clawshot, spinner], '1. Clawshot the top of the target at the top of the right tower and drop down.<br>2. Use the spinner on the railing, than jump below to the chest.'),
            new Check([-4446, 4641], poeSoulI, poesSU, undefined, [shadowCrystal], 'Near the middle of the stairs and appears at night.'),
            new Check([-4574, 3388], cI, baseSU, oRI, [clawshot], "Use the clawshot on the vines and climb up completely on the platform. Then, grab the ledge to the left of the vines " +
                "and slide right until you reach the platform with the chest."),
            new Check([-4900, 3050], sCI, baseSU, yRI, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the lowest platform."),
            new Check([-4930, 3075], sCI, baseSU, rRI, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the 2nd lowest platform."),
            new Check([-4920, 3065], poeSoulI, poesSU, undefined, [shadowCrystal], "Only appears at Night. Can be killed from the lowest platform with the small chest."),
            new Check([-4963, 3099], cI, baseSU, pRI, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the 2nd highest platform."),
            new Check([-4978, 3120], cI, baseSU, hPI, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the highest platform."),
            new Check([-4998, 3137], cI, baseSU, oRI, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the spinning platform. This chest refills everytime you reload Lake Hylia (Not in Rando)."),
            new Check([-5184, 3469], sCI, baseSU, pRI, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the right statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"),
            new Check([-5184, 3536], cI, baseSU, oRI, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the left statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"),
            new Check([-4430, 4591], golWolfI, skillsSU, undefined, [shadowCrystal], 'Summoned by the Faron Woods howling stone.'),
            new Check([-4905, 3923], hPI, giftsSU, undefined, [shadowCrystal], 'Play the Plumm Fruit Balloon Minigame by howling with hawk grass and get 10000 or more to obtain the heart piece.'),
            new Check([-163, 4849], bBI, giftsSU, undefined, [bombBag, [ironBoots, magicArmor]], 'Blow up the rock in the middle of the room with water bombs and talk to the Goron that comes out of it.'),
            new Check([-475, 4844], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. Behind the waterfall, use Midna jumps to get there.'),
            new Check([-650, 4949], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. In front of the small chest.'),
            new Check([-2598, 4901], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. On the bridge.'),
            new Check([-1024, 5870], poeSoulI, poesSU, undefined, [shadowCrystal], 'Only appears at Night. In between the tall grass.'),
            new Check([-5656, 3789], cI, baseSU, pRI, [bombBag, [bow, boomerang], clawshot], 'Blow up the rocks that are elevated to reveal clawshot targets. Clawshot all the targets until you reach the chest.'),
            new Check([-5691, 3795], poeSoulI, poesSU, undefined, [bombBag, [bow, boomerang], clawshot, shadowCrystal], 'Appears only at Night. On the left of the chest.'),
            new Check([-5539, 3312], poeSoulI, poesSU, undefined, [shadowCrystal], 'Appears only at Night. In the middle of the tall grass.'),
            new Check([-5100, 3989], poeSoulI, poesSU, undefined, [shadowCrystal], 'Appears only at Night. Out in the open.'),
            new Check([-5509, 2724], poeSoulI, poesSU, undefined, [shadowCrystal], 'Appears only at Night. On the left of the watchtower.'),
            new Check([-4656, 2886], poeSoulI, poesSU, undefined, [shadowCrystal], "Appears only at Night. Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the platform under Fowl's house."),
            new Check([-3952, 4594], hPI, giftsSU, undefined, undefined, "Donate 1000 total rupees (500 total rupees in Rando) to Charlo to receive the heart piece."),
            new Check([-5460, 2690], auruI, giftsSU, undefined, undefined, "Climb the tower with the ladder and talk to Auru to obtain the memo."),
            new Check([-3349, 3595], cI, baseSU, hPI, [[bombBag, ballAndChain], spinner], 'Destroy the boulders blocking the way, than use the spinner ramps to reach the chest.'),
            new Check([-4314, 3790], poeSoulI, poesSU, undefined, [shadowCrystal], 'Appears only at Night. In the middle of the ruins.'),

            new FakeCheck([-852, 5918], howlStoI, skillsSU, [shadowCrystal], 'This Howling Stone spawns the West Castle Town Golden Wolf and is accessible while clearing the Lanayru Twilight.'),
            new FakeCheck([-5405, 3014], howlStoI, skillsSU, [shadowCrystal], 'This Howling Stone spawns the Gerudo Desert Golden Wolf. Climb the ladder to reach it.'),
            new FakeCheck([-5458, 3876], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'Hidden between two larger stone structures.'),
            new FakeCheck([-4333, 3548], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open, right of the Howl Statue.'),
            new FakeCheck([-3637, 4089], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open, kill the Bulblins to make it easier to destroy.'),
            new FakeCheck([-3412, 4111], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'Hidden in the corner.'),
            new FakeCheck([-2564, 4084], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open in the corner.'),
            new FakeCheck([-475, 4702], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'This boulder is in the tunnel from the top of the domain to the balcony.'),
            new FakeCheck([-477, 4725], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'This boulder is in the tunnel from the top of the domain to the balcony.'),
            new FakeCheck([-808, 5851], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'In the open near the howling stone.'),
            new FakeCheck([-4422, 4873], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open.'),
            new FakeCheck([-123, 4793], rupRockI, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'Underwater left of the throne. The rocks under it are worth lifting.'),
            new FakeCheck([-3816, 3385], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], '4 Blue Rupees = 20 Total Rupees. This is blocking the way to the spinner area.'),
            new FakeCheck([-2601, 3974], rupRockI, notaRupeesSU, [[bombBag, ballAndChain]], '3 Yellow Rupees = 30 Total Rupees. This is blocking the way to the spinner area.'), 
            //All Underwater Rupee Rocks

            new NonCheck([-4268, 3152], horseGI, 'grass'),
            new NonCheck([-5218, 2926], hawkGI, 'grass'),
            new NonCheck([-4901, 3895], hawkGI, 'grass'),
            new NonCheck([-614, 5775], beeI, 'bottle'),
            new NonCheck([-5488, 3116], fairyI, 'bottle'),
            //Zora's Domain Fishing
            //Lake Hylia Fishing
            //Howl Statue Lookout Crows (71 rupees)
            //Hyrule Field Tree East of Bridge (28 rupees)
            //Hyrule Field Bug Tree Crows (32 rupees)
            //Lake Hylia Bridge Crows (31 rupees)
            //Lake Hylia Fowl Tower Crows (73 rupees)
            //East Castle Town Bridge Crows (33 rupees)
            //South Castle Town Crows (33 rupees)
            
            
            new Submap([-5259, 3502], caveEI, 'LanSpring.png', [485, 491], [
                new Check([-5210, 3566], sCI, baseSU, bRI, [[ironBoots, magicArmor]], 'Sink down to get this underwater chest.'),
                new Check([-5197, 3360], sCI, baseSU, yRI, [[ironBoots, magicArmor]], 'Sink down to get this underwater chest.'),
                new Check([-5558, 3491], sCI, baseSU, bRI, [clawshot], 'Clawshot the vines on either side, open the door and walk to the chest on the right.'),
                new Check([-5538, 3542], sCI, baseSU, qI(bombsI, 5), [clawshot], 'Clawshot the vines on either side, open the door and walk to the chest on the left.'),
                new Check([-5559, 3526], cI, baseSU, hPI, [clawshot, lantern], 'Light the 2 torches in the room to make the chest appear.'),

                new FakeCheck([-5322, 3394], rupRockI, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'This rupee boulder is underwater.'),
                new FakeCheck([-5171, 3447], rupRockI, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'This rupee boulder is underwater.'),
                //Fishing
            ]),
            new FlooredSubmap([-4147, 4586], orDoorI, 'Agitha', [
                [[255, 300], [
                    new Check([-3900, 4370], bI('AntM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-3900, 4430], bI('AntF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-3900, 4550], bI('DayflyM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-3900, 4610], bI('DayflyF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-3900, 4730], bI('BeetleM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-3900, 4790], bI('BeetleF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
    
                    new Check([-4025, 4370], bI('MantisM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4025, 4430], bI('MantisF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4025, 4550], bI('Stag BeetleM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4025, 4610], bI('Stag BeetleF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4025, 4730], bI('PillbugM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4025, 4790], bI('PillbugF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
    
                    new Check([-4150, 4370], bI('ButterflyM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4150, 4430], bI('ButterflyF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4150, 4550], bI('LadybugM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4150, 4610], bI('LadybugF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4150, 4730], bI('SnailM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4150, 4790], bI('SnailF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
    
                    new Check([-4275, 4370], bI('PhasmidM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4275, 4430], bI('PhasmidF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4275, 4550], bI('GrasshopperM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4275, 4610], bI('GrasshopperF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4275, 4730], bI('DragonflyM'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                    new Check([-4275, 4790], bI('DragonflyF'), giftsSU, undefined, undefined, 'Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug)'),
                ]],
                [[255, 244], []]
            ]),
            new Submap([-4057, 4837], orDoorI, 'Jovani.png', [403, 259], [
                new Check([-4193, 5102], poeSoulI, poesSU, undefined, [shadowCrystal], 'Enter the house using the dig spot to get this poe'),
                new Check([-3905, 4994], bottleI, giftsSU, undefined, [shadowCrystal], 'Talk to Jovani after collecting 20 poe souls to receive this bottle with Great Fairy Tears'),
            ]),
            new Submap([-3987, 4577], orDoorI, 'STAR.png', [404, 304], [
                new Check([-4113, 4433], bigQuivI, giftsSU, undefined, [clawshot], 'Pay 10 rupees to play the first STAR minigame and win it to receive the big quiver.'),
                new Check([-4128, 4479], giaQuivI, giftsSU, undefined, [doubleClawshot], 'Pay 15 rupees to play the second STAR minigame and win it to receive the giant quiver.')
            ]), 
            new Submap([-3733, 3820], grottoI, g1.img, g1.imgSize, [
                new Check([-3718, 3801], cI, baseSU, oRI, [clawshot, shadowCrystal], "Use the clawshot on the vines to reach the grotto entrance. Once inside, " + 
                    "defeat all the helmasaurs to make the chest appear.")
            ]),
            new Submap([-2121, 4843], grottoI, g4.img, g4.imgSize, [
                new Check([-1830, 4720], cI, baseSU, pRI, [shadowCrystal, lantern], 'Light the 3 torches separated by the wooden barriers to make the chest appear.'),
                //Kill skulltulas for rupees (35 rupees)
            ]),
            new Submap([-2605, 4189], grottoI, g1.img, g1.imgSize, [
                new Check([-2378, 4211], poeSoulI, poesSU, undefined, [shadowCrystal], 'Right of the elevated platform.'),
                new Check([-2351, 4111], poeSoulI, poesSU, undefined, [shadowCrystal], 'On the elevated platform.'),
            ]),
            new Submap([-2812, 5187], grottoI, g3.img, g3.imgSize, [
                //Red and blue chus
            ]),
            new Submap([-4060, 4759], orDoorI, 'CastleTownMaloMart.png', [266, 228], [
                new Check([-4231, 4706], magArmI, shopSU, undefined, undefined, 'After repairing the Castle Town bridge for 1000 rupees, pay 200 rupees (2000 rupees if you did not do the Goron Springwater ' +
                    'Rush quest) to open the Castle Town Branch of Malo Mart. You can then buy the Magic Armor for 598 rupees. This item costs 1798 rupees total (or 3598 rupees without GSR).'),
                // Add Entire Shop
            ]),
            new Submap([-5696, 3751], grottoI, g4.img, g4.imgSize, [
                new Check([-5400, 3629], cI, baseSU, oRI, [bombBag, [bow, boomerang], clawshot, shadowCrystal], 'Kill all the Bubbles to make the chest appear.')
            ]),
            new Submap([-5499, 3045], grottoI, g5.img, g5.imgSize, [
                new Check([-5237, 3005], cI, baseSU, oRI, [shadowCrystal], 'Defeat all the Toadpolis to make the chest appear. Tip: You can reflect their projectiles with Wolf Link.'),
                new NonCheck([-5191, 2990], beeI, 'bottle'),
                //Fishing spot
            ]),
            new Submap([-4614, 2875], grottoI, g5.img, g5.imgSize, [ //No fish in this grotto
                new Check([-4354, 2828], cI, baseSU, oRI, [shadowCrystal, [woodenSword, bombBag]], "The grotto is on the platform under Fowl's house. Play the Flight By Fowl minigame (20 rupees) and use " + 
                    "the Cucco to reach the platform. Once inside, kill all 4 Shellblades with a sword or water bombs to make the chest appear.")
            ]),
            new Submap([-4551, 4937], grottoI, g5.img, g5.imgSize, [
                new Check([-4292, 4907], cI, baseSU, oRI, [shadowCrystal], 'Kill all the Tektites to make the chest appear.'),
                new NonCheck([-4238, 4905], beeI, 'bottle'),
                //Fishing spot
            ]),
            new Submap([-5546, 3134], caveEI, 'LakeLanternCave.png', [658, 585], [
                new Check([-5696, 3100], sCI, baseSU, qI(bombsI, 5), [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5665, 3145], sCI, baseSU, yRI, [[bombBag, ballAndChain]], 'Destroy the rock in the back and kill the Keese.'),
                new Check([-5631, 3200], sCI, baseSU, rRI, [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5632, 3440], poeSoulI, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'Near the torch in the middle of the room.'),
                new Check([-5631, 3487], sCI, baseSU, qI(arrowsI, 10), [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5381, 3422], sCI, baseSU, rRI, [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5418, 3185], cI, baseSU, oRI, [[bombBag, ballAndChain], lantern], 'Light the 2 torches to make the chest appear.'),
                new Check([-5386, 3183], sCI, baseSU, rRI, [[bombBag, ballAndChain]], 'Destroy the rock on the right to reveal the chest.'),
                new Check([-5308, 3098], sCI, baseSU, qI(bombsI, 5), [[bombBag, ballAndChain]], 'Destroy the rock in the back and kill the Tektites.'),
                new Check([-5375, 2828], sCI, baseSU, qI(arrowsI, 10), [[bombBag, ballAndChain]], 'Destroy the rock on the left and kill the Keese.'),
                new Check([-5341, 2779], cI, baseSU, pRI, [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5260, 3181], poeSoulI, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'Near the torch in the middle of the room.'),
                new Check([-5229, 3182], cI, baseSU, pRI, [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5262, 3231], sCI, baseSU, qI(bombsI, 10), [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5303, 3268], sCI, baseSU, qI(seedsI, 50), [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5333, 3426], cI, baseSU, oRI, [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5523, 3363], poeSoulI, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'At the entrance of the room.'),
                new Check([-5555, 3364], cI, baseSU, hPI, [[bombBag, ballAndChain], lantern], 'Light the 2 torches to make the chest appear.')
            ]),
            new Submap([-2025, 4818], caveEI, 'Ice Cave.png', [79, 369], [
                new Check([-1725, 4818], cI, baseSU, hPI, [ballAndChain], 'Complete the 3 block puzzles to open all the gates and access the chest.')
            ])
        ]),    
        new Province(castlePoints, true, [-3584, 5440], []) // Castle
    ];
   
    dungeons = [
        new Dungeon([-6915, 4098], [-6950, 4900], starI, 'Forest Temple', [2810, 2704], 3, [
            [ // 1F
                new Check([-5935, 4317], sCI, baseSU, yRI, [[slingshot, bow, clawshot, boomerang]], 'Use a long ranged item to kill the spiders and climb to the chest.'),
                new Check([-5281, 4240], sCI, baseSU, rRI, undefined, 'Use the Bombling on the right to blow up the rock blocking the chest.'),
                new Check([-5260, 4294], cI, baseSU, mapI, [[lantern, boomerang]], 'Use the lantern to light the 4 torches that make the platforms to the chest rise or take a long detour' +
                    'by the boomerang bridges to reach the chest.'),
                new FakeCheck([-5250, 4565], ooccooI, ooccooSU, undefined, 'Use the Bombling to blow up the rocks, than pick up or break the pot containing Ooccoo.'),
                new Check([-4710, 4812], cI, baseSU, smaKeyI, undefined, 'Make your way across the windy bridge and open the chest on the left of the entrance.'),
                new FakeCheck([-5224, 5140], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-5445, 5129], cI, baseSU, yRI, undefined, 'Swim to the opening and walk to the end to reach the chest.'),
                new Check([-5155, 5218], sCI, baseSU, yRI, undefined, 'The chest is under the wooden structure.'),
                new Check([-5624, 3749], smaKeyI, baseSU, undefined, undefined, 'Defeat the Big Baba to obtain the key.'),
                new FakeCheck([-5869, 3747], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-5467, 3901], cI, baseSU, hPI, undefined, 'Defeat the Deku Like that blocks the way to access the chest.'),
                new Check([-5277, 3498], cI, baseSU, smaKeyI, undefined, 'Bonk on the pillar to make the chest fall.'),
                new Check([-5224, 3241], sCI, baseSU, rRI, undefined, 'Climb the vines to reach the chest.'),
                new FakeCheck([-5309, 2943], lockI, lockedDoorSU, [lantern], 'Locked door'),
                new Check([-4508, 4262], gBI, baseSU, undefined, undefined, 'Defeat Ook to obtain the Gale Boomerang.'),
                new Check([-5304, 3050], cI, baseSU, hPI, [boomerang], 'Blow out all the torches to retract the platform blocking the chest.'),
                new Check([-5386, 4242], cI, baseSU, compaI, [[boomerang, bow, clawshot]], 'Use a long ranged item to break the web holding the chest.'),
                new Check([-5439, 5042], bCI, baseSU, bossKeyI, [boomerang], 'Use the boomerang on the windmill pillars in this pattern: Bottom Right, Bottom Left, Top Right and Top Left.' + 
                    'This opens the gate to the boss key chest.'),
                new Check([-4322, 4342], cI, baseSU, smaKeyI, [[boomerang, bombBag, clawshot]], 'Grab a bombling or use one of your own bombs to defeat the Deku Like and jump across the platforms.'),
                new FakeCheck([-4570, 5087], lockI, lockedDoorSU, [boomerang], 'Locked door'),
                new Check([-4510, 5206], cI, baseSU, rRI, undefined, 'Climb up the room by going in the back or simply get launched by the Tile Worm closest to the chest.'),
                new NonCheck([-3920, 4820], fairyI, 'bottle'),
                new FakeCheck([-3858, 4868], lockI, lockedDoorSU, undefined, 'Locked door.'),
                new Check([-3773, 4842], hCI, baseSU, undefined, [[woodenSword, bombBag, ballAndChain, bow], [boomerang, clawshot]], 'Defeat Diababa to obtain the heart container.'),
                new Check([-3796, 4777], fusShaI, baseSU, undefined, [[woodenSword, bombBag, ballAndChain, bow], [boomerang, clawshot]], 'Defeat Diababa to obtain the fused shadow.')

            ]
        ]),
        new Dungeon([-3660, 8193], [-3920, 8752], starI, 'Goron Mines', [2787, 2791], 3, [
            [ // 1F
                new Check([-5791, 4465], sCI, baseSU, rRI, undefined, 'Kill the Torch Slug to have access to the chest.'),
                new Check([-5232, 4603], cI, baseSU, smaKeyI, undefined, 'Defeat the Bulblins to easily reach the chest.'),
                new FakeCheck([-5052, 3966], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-5004, 3025], gBK0I, giftsSU, undefined, undefined, 'Talk to goron elder Gor Amoto to obtain this part of the boss key.'),
                new Check([-4971, 2973], cI, baseSU, mapI, undefined, 'The chest is behind the goron elder.'),
                new Check([-4971, 2941], sCI, baseSU, rRI, undefined, 'The small chest is behind the goron elder, on the platform.'),
                new FakeCheck([-5027, 3150], ooccooI, ooccooSU, undefined, 'Pick up the pot where Ooccoo is hiding for her to join you.'),
                new Check([-4913, 3891], cI, baseSU, hPI, [ironBoots], 'Follow the left path when you get on the ceiling to reach the chest.'),
            ],
            [ // 2F
                new Check([-4591, 4459], cI, baseSU, smaKeyI, [[ironBoots, magicArmor]], 'Use the iron boots or the depleted magic armor to sink down to the underwater chest.'),
                new Check([-4526, 4441], sCI, baseSU, rRI, [ironBoots], 'Use the iron boots to follow the crystal path onto the platform where the chest lies.'),
                new Check([-4471, 4242], cI, baseSU, hPI, [ironBoots], 'Follow the crystal path and take a left to reach the upper platform.'),
                new FakeCheck([-4200, 4363], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-3898, 4270], sCI, baseSU, smaKeyI, undefined, 'Follow the left barrier to not get noticed by the Beamos and reach the chest.'),
                new Check([-3747, 4568], cI, baseSU, pRI, [[ironBoots, magicArmor]], 'The chest is behind a breakable wooden barrier underwater. However, you can simply go above the barrier by swimming.'),
                new FakeCheck([-3833, 4669], lockI, lockedDoorSU, undefined, 'Locked door.'),
                new Check([-3736, 5491], gBK1I, giftsSU, undefined, undefined, 'Talk to goron elder Gor Ebizo to obtain this part of the boss key.'),
                new Check([-3764, 5566], sCI, baseSU, yRI, undefined, 'Go behind Gor Ebizo, to the right and use the stairs to climb the small platform.'),
                new Check([-3896, 5243], sCI, baseSU, yRI, [ironBoots], 'Use the crystal path to reach the chest.'),
                new Check([-4550, 5060], cI, baseSU, bowI, [ironBoots], 'Defeat Dangoro to gain access to the chest.'),
                new Check([-4786, 4930], cI, baseSU, compaI, [bow], 'Defeat the Beamos and pull it to access the chest.'),
                new Check([-4787, 5495], gBK2I, giftsSU, undefined, [bow], 'Defeat the beamos and pull it to have access to the room where Gor Liggs gives you a part of the boos key.'),
                new Check([-4783, 5585], cI, baseSU, pRI, [bow], 'Defeat the beamos and pull it to have access to the room where the chest is, behind the goron elder.'),
                new Check([-5155, 4682], cI, baseSU, pRI, [bow], 'Jump across to the platform to reach the chest.'),
                new Check([-3629, 4596], cI, baseSU, pRI, [clawshot], 'Clawshot the vines from the door to the right of the room to reach the platform with the chest.'),
                new NonCheck([-3644, 4560], fairyI, 'bottle'),
                new FakeCheck([-4170, 3847], lockI, lockedDoorSU, undefined, 'Locked door.'),
                new Check([-4252, 3815], hCI, baseSU, undefined, [bow], 'Defeat Fyrus to obtain the Heart Container.'),
                new Check([-4276, 3884], fusShaI, baseSU, undefined, [bow], 'Defeat Fyrus to obtain the second Fused Shadow.')
            ]
        ]),
        new Dungeon([-4741, 3415], [-4960, 4208], starI, 'Lakebed Temple', [2905, 1750], 1, [
            [ // B2
                new Check([-4402, 5200], hCI, baseSU, undefined, [zoraArmor, bombBag, bow, clawshot, ironBoots, woodenSword], 'Defeat Morpheel to obtain the heart piece.'),
                new Check([-4520, 5050], fusShaI, baseSU, undefined, [zoraArmor, bombBag, bow, clawshot, ironBoots, woodenSword], 'Defeat Morpheel to obtain the third and last Fused Shadow.')
            ],
            [ // B1
                new Check([-4327, 4363], cI, baseSU, rRI, [zoraArmor, bombBag, bow], 'Make the water level rise once by clearing the top of the east portion of the temple to access the chest.'),
                new Check([-4021, 5724], cI, baseSU, qI(bombsI, 5), [zoraArmor, bombBag, bow, ironBoots], 'Walk through the jet stream with the iron boots and take a left to the chest.'),
                new Check([-4186, 5665], cI, baseSU, rRI, [zoraArmor, bombBag, bow, ironBoots], 'Walk away from the jet stream into the tunnel to reach the chest.'),
                new Check([-4592, 2725], bCI, baseSU, bossKeyI, [zoraArmor, bombBag, bow, clawshot, ironBoots], 'In the room above, hang from the clawshot target and descend towards the chest.'),
                //Fishing spot!
                new FakeCheck([-4414, 4362], lockI, lockedDoorSU, undefined, 'Boss Door.'),
                new NonCheck([-4365, 4362], fairyI, 'bottle')
            ],
            [ // 1F
                new Check([-4518, 4517], sCI, baseSU, qI(arrowsI, 20), [zoraArmor, bombBag, bow], 'The chest is accessible when you first get into the room, go down the stairs and take a left.'),
                new Check([-4224, 4513], cI, baseSU, mapI, [zoraArmor, bombBag, bow], 'The chest is accessible when you first get into the room, manipulate the stairs to reach it.'),
                new Check([-4506, 5613], cI, baseSU, smaKeyI, [zoraArmor, bombBag, bow], 'Knock down the stalactite with bomb arrows to make a platform to jump to the chest.'),
                new Check([-4181, 5694], cI, baseSU, smaKeyI, [zoraArmor, bombBag, bow], 'Kill the Chus to have an easier time accessing the chest.'),
                new FakeCheck([-4331, 5867], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-3736, 5469], cI, baseSU, clawI, [zoraArmor, bombBag, bow, [ironBoots, clawshot]], 'Defeat Deku Toad to make it spit out the chest.'),
                new Check([-4299, 3311], sCI, baseSU, qI(watBomI, 10), [zoraArmor, bombBag, bow, clawshot], 'Jump on the hanging platform than shoot the clawshot at the target above the platform with the chest.'),
                new Check([-4718, 5483], cI, baseSU, hPI, [zoraArmor, bombBag, bow, clawshot], 'Once the water level is elevated in the room, press on the switch to open the gate and clawshot the target on the ' + 
                    'back wall to reach the chest. Clawshot the target on the ceiling to get back out.'),
                new Check([-4420, 2539], sCI, baseSU, qI(bombsI, 5), [zoraArmor, bombBag, bow, clawshot], 'In the section with the entrance to the long tunnel, swim up to find to chest.')
            ],
            [ // 2F
                new Check([-5509, 4199], sCI, baseSU, qI(arrowsI, 20), [zoraArmor], 'The chest is between the 2 rock pillars'),
                new Check([-5601, 4339], sCI, baseSU, qI(watBomI, 10), [zoraArmor], 'The chest is on the right of the nearby rock pillar.'),
                new Check([-4950, 4501], sCI, baseSU, qI(watBomI, 10), [zoraArmor, bombBag, bow], 'Knock down the stalactites with bomb arrows and climb to the chest.'),
                new FakeCheck([-4490, 4552], ooccooI, ooccooSU, [zoraArmor, bombBag, bow], 'Pick up or break the pot where Ooccoo is hiding.'),
                new FakeCheck([-4372, 4666], lockI, lockedDoorSU, undefined, 'Locked door.'),
                new Check([-4487, 5223], sCI, baseSU, qI(bombsI, 5), [zoraArmor, bombBag, bow], 'On the left when you enter the room from the lobby.'),
                new Check([-4585, 5497], cI, baseSU, smaKeyI, [zoraArmor, bombBag, bow], 'Go around the room and cross by the middle section to reach the chest.'),
                new FakeCheck([-4425, 6048], lockI, lockedDoorSU, undefined, 'Locked door.'),
                new NonCheck([-4533, 5253], fairyI, 'bottle'),
                new Check([-4373, 4363], cI, baseSU, hPI, [zoraArmor, bombBag, bow, clawshot], 'The chest is on the chandelier hanging from the ceiling, use the clawshot to get there.'),
                new Check([-4223, 3363], sCI, baseSU, rRI, [zoraArmor, bombBag, bow, clawshot], 'Once on the highest vine platform, clawshot the target above the platform where the chest is.'),
                new Check([-4212, 3451], cI, baseSU, qI(bombsI, 20), [zoraArmor, bombBag, bow, clawshot], 'After activating the water, go back the way you came from through the waterwheel to find the chest.'),
                new Check([-4583, 2965], cI, baseSU, rRI, [zoraArmor, bombBag, bow, clawshot, ironBoots], 'Defeat the enemies underwater to have easier access to the chest.'),
                new Check([-4561, 3301], sCI, baseSU, rRI, [zoraArmor, bombBag, bow, clawshot], 'Go through the middle room accross the spinning gears to get the chest.'),

            ],
            [], // 3F
            [ // 4F
                new Check([-4330, 6166], sCI, baseSU, qI(bombsI, 10), [zoraArmor, bombBag, bow], 'Go to the top of the room to reach the chest.'),
                new Check([-4410, 2359], sCI, baseSU, qI(bombsI, 10), [zoraArmor, bombBag, bow, clawshot], 'Go to the top of the room using the clawshot targets to reach the chest.'),
                new Check([-4362, 2108], cI, baseSU, compaI, [zoraArmor, bombBag, bow, clawshot], 'Clawshot the target on the wall behind the chest to reach it.'),
                new Check([-4378, 6427], cI, baseSU, pRI, [zoraArmor, bombBag, bow, clawshot], 'Clawshot the target on the wall behind the chest to reach it.')

            ],
        ]),
        new Dungeon([-3865, 605], [-4500, 1488], starI, "Arbiter's Grounds", [2009, 1691], 1, [
            [ // B2
                new FakeCheck([-4325, 4791], lockI, lockedDoorSU, undefined, 'Locked door'),
                new FakeCheck([-5201, 4240], ooccooI, ooccooSU, undefined, 'Pick up or break the pot where Ooccoo is hiding for her to join you.'),
                new Check([-3598, 4239], cI, baseSU, spinI, [shadowCrystal, [clawshot, bow, boomerang]], 'Defeat Death Sword to obtain the Spinner.'),
                new Check([-4490, 3311], sCI, baseSU, qI(bombsI, 10), [spinner], 'Use the spinner to float above the quicksand and reach the chest.'),
                new Check([-4486, 3078], sCI, baseSU, rRI, [spinner], 'From the previous chest, use the spinner to float above the quicksand and reach the chest.'),
                new Check([-4307, 2997], sCI, baseSU, yRI, [spinner], 'Hidden under the spinner ramp, use the spinner to float above the quicksand and reach the chest.'),
                new Check([-4369, 3666], cI, baseSU, hPI, [spinner], 'Use the spinner ramp and defeat the Stalfos to reach this chest.'),
            ],
            [ // B1
                new Check([-4626, 4836], sCI, baseSU, smaKeyI, [shadowCrystal], 'Dig the sand spot to reveal the lever, than pull it to access the stairs. Than, spin the room to gain access to the chest.'),
                new Check([-4257, 4786], cI, baseSU, smaKeyI, undefined, 'Enter the tunnel from the entrance with no spikes, than go to the end of it to find the chest.'),
                new Check([-4156, 3605], sCI, baseSU, yRI, [spinner], 'Use the spinner ramp and defeat the 2 stalfos that are guarding the chest to open it.'),
            ],
            [ // 1F
                new Check([-5336, 3974], cI, baseSU, smaKeyI, [clawshot], 'Break the wooden barrier and jump across to the chest.'),
                new NonCheck([-5341, 4446], beeI, 'bottle'), // Lantern oil jar
                new FakeCheck([-5277, 4323], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-4763, 4329], poeSoulI, poesSU, undefined, [shadowCrystal], 'The first of the 4 poes, waits in the middle of the room after the cutscene.'),
                new Check([-4562, 4481], cI, baseSU, hPI, undefined, 'Walk across the platforms or use the clawshot to have a way back.'),
                new Check([-4561, 4171], cI, baseSU, mapI, undefined, 'Walk across the quicksand using the sinking platform to reach the chest.'),
                new Check([-4576, 3840], sCI, baseSU, rRI, undefined, 'Upon entering the room, follow the path to the right to reach the chest.'),
                new Check([-4337, 4831], poeSoulI, poesSU, undefined, [shadowCrystal, clawshot], 'When the room below is spun, clawshot up through the opening, than go in the poe room to defeat it.'),
                new FakeCheck([-4766, 5081], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-4920, 3766], cI, baseSU, rRI, undefined, 'Pull the chain to raise the chandelier, then cross under it to reach the chest.'),
                new Check([-4707, 3322], sCI, baseSU, qI(bombsI, 5), undefined, 'Break the wooden barrier and go to the north-east to reach the chest.'),
                new Check([-4767, 3108], sCI, baseSU, qI(bombsI, 5), undefined, 'Break the wooden barrier and go to the west area to reach the chest.'),
                new Check([-4156, 3911], bCI, baseSU, bossKeyI, [spinner], 'After clearing the room with the spinner ramps, access to the chest is granted upon entering the next room.'),
            ],
            [ // 2F
                new Check([-5358, 5475], cI, baseSU, compaI, undefined, 'Walk up the stairs to find the chest in the area behind the statue.'),
                new Check([-5241, 5831], cI, baseSU, smaKeyI, undefined, 'Break the wooden barrier than defeat the Gibdo to easily open the chest.'),
                new FakeCheck([-5240, 5251], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-5240, 5021], poeSoulI, poesSU, undefined, [shadowCrystal], 'Dig to reveal a lever, than pull it to gain access to the room where the poe awaits.'),
                new Check([-4883, 4834], sCI, baseSU, smaKeyI, undefined, 'The chest is below the ring platform.'),
                new FakeCheck([-4767, 4551], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-5186, 3780], poeSoulI, poesSU, undefined, [shadowCrystal], 'Defeat the poe easily by using the Midna attack.'),
            ],
            [], // 3F 
            [ // 4F
                new NonCheck([-3828, 4100], fairyI, 'bottle'),
                new FakeCheck([-4276, 4326], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-4928, 4384], hCI, baseSU, undefined, [spinner, [woodenSword, bow, bombBag, ballAndChain, shadowCrystal]], 'Defeat Stallord to obtain the Heart Container.'),
                new Check([-4726, 4334], shardI, baseSU, undefined, [spinner, [woodenSword, bow, bombBag, ballAndChain, shadowCrystal]], 'Defeat Stallord to obtain the Dungeon Reward.'),

            ],
        ]),
        new Dungeon([-2626, 1229], [-2960, 2112], starI, 'Snowpeak Ruins', [1431, 1733], 3, [
            [ // 1F                  
                new Check([-6017, 4105], sCI, baseSU, rRI, [ballAndChain], "Break the armor with the Ball and Chain to reveal the chest."),
                new Check([-5883, 4428], sCI, baseSU, yRI, [ballAndChain], "Break the armor with the Ball and Chain to reveal the chest."),
                new Check([-4369, 5305], cI, baseSU, pumpkinI, undefined, "Defeat the 2 Chilfos to unlock the door and gain access to the chest."),
                new Check([-4942, 4533], sCI, baseSU, rRI, undefined, "Near the wall, defeat the Wolfos for easier access."),
                new Check([-3611, 4265], cI, baseSU, cheeseI, [ballAndChain], "Break the ice blocks to gain access to the chest."),
                new Check([-4072, 4270], bACI, baseSU, undefined, [[bombBag, ballAndChain]], "Defeat Darkhammer to obtain the Ball and Chain."),
                new Check([-4495, 4530], sCI, baseSU, smaKeyI, [shadowCrystal], "Dig the spot where the chest is poking out of."),
                new FakeCheck([-4239, 4797], lockI, lockedDoorSU, undefined, 'Locked door.'),
                new Check([-4015, 3896], sCI, baseSU, qI(bombsI, 5), [[bombBag, ballAndChain]], "Use the cannon or the ball and chain to break the ice that is blocking the chest."),
                new Check([-4814, 3397], sCI, baseSU, rRI, undefined, "Jump across the wooden planks to reach the chest."),
                new Check([-4926, 3578], cI, baseSU, compaI, undefined, "Jump across the wooden planks to reach the chest."),
                new Check([-4462, 3961], sCI, baseSU, smaKeyI, [shadowCrystal], "Dig twice on the shiny spot to reveal the chest. The shiny spot is not visible without the compass."),
                new Check([-4943, 4269], sCI, baseSU, qI(bombsI, 5), [[bombBag, ballAndChain]], "Use the cannon or the ball and chain to break the ice that is blocking the chest."),
                new FakeCheck([-5381, 5064], ooccooI, ooccooSU, undefined, "Pick up the pot where Ooccoo is hiding."),
                new Check([-5373, 3541], cI, baseSU, hPI, [ballAndChain], "Break the damaged floor and jump down to chest.<br>Glitch: LJA from the other entrance of the room to the chest."),
                new Check([-5576, 4264], poeSoulI, poesSU, undefined, [shadowCrystal], "The poe is above the ice in the open."),
                new Check([-4157, 3214], sCI, baseSU, rRI, [ballAndChain], "Break the ice in front of the chest to reveal it."),
                new Check([-6017, 4420], poeSoulI, poesSU, undefined, [ballAndChain, shadowCrystal], "Break the armor with the Ball and Chain to reveal the poe."),
                new Check([-5072, 4316], mapI, giftsSU, undefined, undefined, "Talk to Yeta to obtain the dungeon map."),
                new FakeCheck([-4611, 3842], lockI, lockedDoorSU, undefined, "Locked door"),
                new FakeCheck([-5883, 4119], oRI, notaRupeesSU, [ballAndChain], 'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'),
                new FakeCheck([-3767, 4348], oRI, notaRupeesSU, [ballAndChain],  'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'),
                new NonCheck([-5141, 4911], beeI, 'bottle') // SOUP!
            ],
            [ // 2F
                new Check([-4563, 3408], cI, baseSU, smaKeyI, [ballAndChain], "Swing the chandelier with the Ball and Chain to reach the chest."),
                new FakeCheck([-5366, 3839], lockI, lockedDoorSU, undefined, 'Locked door'),
                new Check([-5833, 4268], cI, baseSU, hPI, [ballAndChain], "Swing from chandelier to chandelier to reach the chest.<br>Tip: Hit the last chandelier when yours is almost at the furthest from the chest."),
                new Check([-3854, 3400], cI, baseSU, bedroomKeyI, [ballAndChain, bombBag], "Defeat all the Chilfos to unlock the door and access the chest."),
                new Check([-5198, 5214], poeSoulI, poesSU, undefined, [ballAndChain, shadowCrystal], "Break the ice blocks with the Ball and Chain to reveal the poe."),
                new Check([-4392, 5147], sCI, baseSU, smaKeyI, [clawshot, ballAndChain], "Swing from the chandeliers to reach the chest."),
                new FakeCheck([-5148, 4597], lockI, lockedDoorSU, 'Locked door.')
            ],
            [ // 3F
                new FakeCheck([-4350, 4268], lockI, lockedDoorSU, undefined, 'Boss key door'),
                new Check([-3963, 4358], hCI, baseSU, undefined, [bombBag, ballAndChain], "Defeat Blizzeta to obtain the Heart Container."),
                new Check([-4066, 4170], shardI, baseSU, undefined, [bombBag, ballAndChain], "Defeat Blizzeta and leave the dungeon via the Midna warp to obtain the Mirror Shard.")
            ]
        ]), 
        new Dungeon([-6618, 3681], [-6580, 4425], starI, 'Temple of Time', [0, 0], 3, [
            [ // 1F

            ],
            [ // 2F

            ],
            [ // 3F

            ],
            [ // 4F

            ],
            [ // 5F

            ],
            [ // 6F

            ], 
            [ // 7F

            ],
            [ // 8F

            ]
        ]),
        new Dungeon([-5306, 3144], [-5472, 3840], starI, 'City in the Sky', [0, 0], 0, [
            [ // B3

            ],
            [ // B2

            ],
            [ // B1

            ],
            [ // 1F

            ],
            [ // 2F

            ],
            [ // 3F

            ],
            [ // 4F

            ],
            [ // 5F

            ]
        ]),
        new Dungeon([-3636, 602], [-3800, 1472], mirI, 'Palace of Twilight', [0, 0], 3, [ 
            [ // 1F

            ],
            [ // 2F

            ],
            [ // 3F

            ],
            [ // 4F

            ]
        ]),
        new Dungeon([-3250, 4712], [0,0], castleI, 'Hyrule Castle', [0, 0], 3, [
            [ // 1F

            ],
            [ // 2F

            ],
            [ // 3F

            ],
            [ // 4F

            ],
            [ // 5F

            ]
        ])        
    ];
    console.timeEnd('Checks Creation');
    console.timeEnd('Start');

    loadImageMap(); 


    function onMapClick(e) {
        navigator.clipboard.writeText("[" + Math.round(e.latlng.lat) + ", " + Math.round(e.latlng.lng) + "]")
    }
    map.on('click', onMapClick);
    
});

    
//Map Functions 
function loadImageMap() {
    if (map.getZoom() != -5)
        return;
    mapState = 0;
    document.getElementById('made').style.display = 'block';   
    map.setView([0, 0], -4);
    map.setMinZoom(-4);
    map.dragging.disable();
    map.setMaxBounds([[0, 0], [-10336, 10176]]); 
    map.off('zoomend', loadImageMap);    
    map.on("zoomend", loadTilemapFromImageMap);
    loadImageIcons(); 
    if (document.getElementById('check').style.visibility == 'visible')
        hideDetails();
    if (!settingIsChecked('trackerOverlapS') && document.getElementById('tracker').style.visibility == 'visible')
        updateMapSize('100vw');  
}
function loadTilemapFromImageMap() {
    if (map.getZoom() <= -4)
        return;
    mapState = 1;
    document.getElementById('made').style.display = 'none'; 
    map.dragging.enable();             
    map.setMinZoom(-5);
    map.setMaxBounds([[500, -500], [-10000, 9000]]); 
    map.off('zoomend', loadTilemapFromImageMap);
    map.on('zoomend', loadImageMap); 
    removeAllLayers();  
    TL.addTo(map); 
    loadTLIcons(); 

    let cpt = 0;
    map.eachLayer(function(layer){
        ++cpt; 
    });
    console.log('Number of Markers on Tilemap: ' + --cpt);

    if (!settingIsChecked('trackerOverlapS') && document.getElementById('tracker').style.visibility == 'visible') 
        updateMapSize('71vw');  
}
function loadImageIcons() {
    removeAllLayers();
    L.imageOverlay('MainMap/omx4.png', [[0, 0], [-10336, 10176]]).addTo(map);
    for (let i = 0; i < provinces.length; ++i)
        provinces[i].load();
    for (let i = 0; i < dungeons.length - 1; ++i)
        dungeons[i].loadIcon();
}
function loadTLIcons() {
    for (let i = 0; i < provinces.length; ++i)
        provinces[i].loadIcons();
    for (let i = 0; i < dungeons.length; ++i) 
        dungeons[i].loadIcon();
}
function exitSubmap() {
    if (map.getZoom() == 0)
        return;
    map.off('zoomend', exitSubmap);  
    if (mapState == 4)
        hideDungeonUI();
    removeAllLayersExceptTL();
    map.setMinZoom(-5);
    map.dragging.enable();
    mapState = 1;
    TL.setOpacity(1);
    loadTLIcons();
}
function exitDungeon() {
    if (map.getZoom() >= -2)
        return;
    hideDungeonUI();
    removeAllLayers();
    window.removeEventListener('keydown', dungeonControls);
    map.off('zoomend', exitDungeon);
    mapState = 1;
    TL.addTo(map);
    map.setMaxBounds([[500, -500], [-10768, 9304]]);
    loadTLIcons();
}
function hideDungeonUI() {
    for (let i = floorOffset; i < this.loadedDungeon.length + floorOffset; ++i) {
        floor = document.getElementById("F" + i);
        floor.style.display = 'none';
        floor.replaceWith(floor.cloneNode(true));
    }
    resetActiveFloorButton();
    document.getElementById('dun').style.display = 'none'
    document.getElementById("dn").style.display = "none";
}
function resetActiveFloorButton() {
    let floor = document.getElementById('F' + (activeFloor + floorOffset));
    floor.style.filter = 'brightness(100%)';
    floor.style.width = "14.6vw";
    floor.style.marginLeft = "0";
}
function dungeonControls(e) {
    if (!(e instanceof KeyboardEvent))
        return;
    var key = e.key;
    let prevFloor = activeFloor;
    let newFloor = activeFloor;
    if (key == undefined)
        key = e.originalEvent.key;
    if (key == "ArrowDown" || key == 's') {
        if (newFloor == 0) 
            newFloor = loadedDungeon.length - 1;         
        else
            newFloor = newFloor - 1; 
    }
    else if (key == 'ArrowUp' || key == 'w') {
        if (newFloor == loadedDungeon.length - 1) 
            newFloor = 0;
        else
            newFloor = newFloor + 1;
    }
    else if (key == 'e' || key == "ArrowRight") {
        if (loadedDungeon[newFloor].allShownChecksAreSet())
            loadedDungeon[newFloor].setAsUnmarked();
        else
            loadedDungeon[newFloor].setAsMarked();
        reloadIcons();
    }
    if (newFloor != prevFloor) 
        document.getElementById('F' + (newFloor + floorOffset)).click();
}
function reloadIcons() {
    switch (mapState) {
        case 0 : loadImageIcons(); break;
        case 1 : removeAllLayersExceptTL(); loadTLIcons(); break;
        case 2 : removeAllLayers(); loadedDungeon[activeFloor].load(); break;
        case 3 : removeAllLayersExceptTL(); loadedDungeon.load(); break;
        case 4 : removeAllLayersExceptTL(); loadedDungeon[activeFloor].load(); break;
    }
}
function removeAllLayers() {
    map.eachLayer(function(l) {
        map.removeLayer(l);
    });
}
function removeAllLayersExceptTL() {
    map.eachLayer(function(l) {
        if (l != TL)
            map.removeLayer(l);
    });
}  

// Menu Functions
function hideDetails() {
    document.getElementById('checkX').style.visibility = "hidden";
    document.getElementById('cinfo').style.visibility = "hidden";
    document.getElementById('van').style.display = "none"; 
    document.getElementById('reqs').style.display = "none";   
    var checkdiv = document.getElementById('check'); 
    checkdiv.style.width = "0%";
    setTimeout(function() {
        checkdiv.style.height = "0%";
        checkdiv.style.visibility = "hidden";
    }, 100);
    
    map.off('click', hideDetails);
}
function showRightMenu(menuID, width) {
    let menu = document.getElementById(menuID);
    if (menuID == "tracker") {
        let cpts = document.getElementsByClassName('tcpt');
        for (let i = 0; i < cpts.length; ++i)
            cpts[i].style.display = 'inline';
        if (!settingIsChecked('trackerOverlapS') && mapState > 0)
            updateMapSize('71vw');
    }
    menu.style.visibility = "visible";
    menu.style.width = width;
    menu.style.height = "100%";
    document.getElementById('menuicons').style.display = "none";
}
function hideRightMenu(menuID) {
    let menu = document.getElementById(menuID);
    if (menuID == "tracker") {
        let cpts = document.getElementsByClassName('tcpt');
        for (let i = 0; i < cpts.length; ++i)
            cpts[i].style.display = 'none';
        if (!settingIsChecked('trackerOverlapS'))
            updateMapSize('100vw');
    }
    menu.style.width = "0%";
    document.getElementById('menuicons').style.display = "inline";
    setTimeout(function() {
        menu.style.height = "0%";
        menu.style.visibility = "hidden";  
    }, 100);  
}

// Settings Functions
function settingIsChecked(name) {
    return document.getElementById(name).checked;
}
function verifyParentCheck(isChecked, name, parentIndex) {
    let parent = document.getElementById(name);
    if (isChecked && !parent.checked) {
        parent.checked = true;
        settingSU.setFlag(parentIndex, '1');
    }      
    else if (!isChecked && parent.checked) {
        let children;
        if (name == 'checkS')
            children = ['baseS', 'poesS', 'giftsS', 'bugsS', 'skyS', 'skillS', 'shopS'];
        else if (name == 'ncheckS')
            children = ['ooccooS', 'locdoorS', 'notRupeeS'];
        else if (name == 'nflagS')
            children = ['bottleS', 'rshopS', 'grassS', 'monrupeeS', 'fishS']
        for (let i = 0; i < children.length; ++i) {
            if (document.getElementById(children[i]).checked)
                return;
        }
        parent.checked = false;
        settingSU.setFlag(parentIndex, '0');
    }
}
function iconSet(isChecked, cat, index) {
    settingSU.setFlag(index, isChecked ? '1': '0'); 
    if (isChecked) 
        visibleCategories.push(cat);
    else 
        removeFromArray(visibleCategories, cat);
    reloadIcons();
}
function setChildren(isChecked, start, end) {
    let settings = document.querySelectorAll("input[type='checkbox']");
    settingSU.setFlag(start - 1, isChecked ? '1' : '0');
    for (let i = start; i <= end; ++i) {
        if (settings[i].checked != isChecked)
            settings[i].click();
    }
}
function setSettingsFlag(isChecked, index, reload) {
    settingSU.setFlag(index, isChecked ? '1': '0'); 
    if (reload)
        reloadIcons();
}
function resetMap(button) {
    for(let i = 0; i < provinces.length; ++i) 
        provinces[i].resetAllFlags();
    for(let i = 0; i < dungeons.length; ++i)
        dungeons[i].resetAllFlags();
    reloadIcons();  
    resetButtonsFeedback(button, 'Map');
}
function resetTracker(button) {
    for(let i = 0; i < trackerItems.length; ++i) {
        let state = trackerItems[i].state;
        if (i == 23) { // Wallet Special Case
            if (state == 1)
                continue;
            state == 2 ? decreaseState(23) : increaseState(23);
            continue;
        }
        if (state > 0) {
            if (state < trackerItems[i].max / 2) {
                for (let _ = state; _ > 0; --_)
                    decreaseState(i);
            }
            else {
                for (let _ = state; _ < trackerItems[i].max + 1; ++_)
                    increaseState(i);
            }
        }
    }
    reloadIcons();  
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

// Tracker Functions
function increaseState(traElemIndex) {
    let item = trackerItems[traElemIndex];
    let prevState = item.state;
    ++item.state;
    if (item.state > item.max)
        item.state = 0;
    if (traElemIndex == 23 && item.state == 0)
        ++item.state;
    setTrackerFlag(traElemIndex, item.state);
    updateObtainedItems(item, prevState);
    updateTracker(item);
}
function decreaseState(traElemIndex) {
    let item = trackerItems[traElemIndex];
    let prevState = item.state;
    --item.state;
    if (item.state < 0)
        item.state = item.max;
    if (traElemIndex == 23 && item.state == 0)
        item.state = item.max;
    setTrackerFlag(traElemIndex, item.state);
    updateObtainedItems(item, prevState);
    updateTracker(item);
}
function setTrackerFlag(index, state) {
    if (index == 25 || index == 26 || index == 28)
        state = String.fromCharCode(state);
    else 
        state = state.toString();
    trackerSU.setFlag(index, state);
}
function updateObtainedItems(item, prevState) {
    if (item.items == undefined)
        return;
    if (item.type == 0 || item.items.length == undefined) {
        if (item.state == 0) // Remove on unmark
            removeFromArray(obtainedItems, item.items);
        else if (prevState == 0) // Put on mark from start
            obtainedItems.push(item.items)
    }
    else {
        if (item.state == 0) {
            if (item.type == 1) //
                removeFromArray(obtainedItems, item.items[prevState - 1]);
            else {
                for(let i = 0; i < item.items.length; ++i) // Reset from max to 0
                    removeFromArray(obtainedItems, item.items[i]);  
            }
        }
        else {
            if (item.type == 1 || prevState > item.state) {
                removeFromArray(obtainedItems, item.items[prevState - 1]);
            }
            if (prevState < item.state)
                obtainedItems.push(item.items[item.state - 1]);
            if (item.type == 2 && item.state == item.max && prevState == 0) { // Add all from 0 to max
                for(let i = 0; i < item.items.length - 1; ++i)
                   obtainedItems.push(item.items[i]);  
            }
            if (item.items[0].name == 'Wallet') { // Handle Wallets since you start with 1
                if (prevState == 1 && item.state == 3) // From 1 to 3
                    obtainedItems.push(bigWallet);
                else if (prevState == 3 && item.state == 1) { //Reset from 3 to 1
                    removeFromArray(obtainedItems, bigWallet);
                    removeFromArray(obtainedItems, giantWallet);
                }
            }
        }
    }
    if(settingIsChecked('trackerS'))
        reloadIcons();
}
function updateTracker(item) {        
    if (item.state == 0) {
        item.elem.style.filter = "brightness(50%)"; // Unmark item     
        if (item.type == 1 || item.type == 2) { //Change item to base
            updateTrackerImg(item);
        }
        else if (item.type == 3) {
            item.elem.childNodes[5].style.visibility = 'hidden'; //Hide counter
            if (item.max > 1) // Don't change color if item max is 1
                item.elem.childNodes[5].style.color = "#c0c0c0";
            if (item.max > 9) // Change width to 1 digit if max is 2 digits
                item.elem.childNodes[5].style.width = "1.25vw";
        }
    }
    else {
        if (item.state == 1 || item.state == item.max) //Mark item
            item.elem.style.filter = "none"; 
        if (item.type == 1 || item.type == 2) {  //Change item
            updateTrackerImg(item);
        }              
        else if (item.type == 3) {
            item.elem.childNodes[5].innerHTML = item.state; // Update Counter
            switch (item.state) {
                case 1: item.elem.childNodes[5].style.visibility = 'visible'; break; //Show Counter
                case 9:  item.elem.childNodes[5].style.width = "1.25vw"; break; // Change width for 1 digit
                case 10: item.elem.childNodes[5].style.width = "1.75vw"; break; // Change width for 2 digits
                case item.max - 1: item.elem.childNodes[5].style.color = "#c0c0c0"; break; // Change color off green
                case item.max:
                    item.elem.childNodes[5].style.visibility = 'visible'; //Show counter
                    item.elem.childNodes[5].style.color = "#50C878"; // Change color to green
                    if (item.max > 9) // Change width to 2 digits if max is 2 digits
                        item.elem.childNodes[5].style.width = "1.75vw";
                    break;
            }  
        }
    }   
}
function updateTrackerImg(item) {
    let imgSrc = item.elem.childNodes[3].src;
    item.elem.childNodes[3].src = imgSrc.slice(0, -5) + 
        (item.state == 0 ? 0 : item.state - 1) + imgSrc.slice(-4); 
}


// Util Functions
function removeFromArray(array, item) {
    let i = array.indexOf(item);
        if (i > -1)
            array.splice(i, 1);   
}
function getCounterIcon(icon, num) {
    return L.divIcon({ 
        iconUrl: icon.options.iconUrl,
        iconSize: icon.options.iconSize,
        html: '<img src="' + icon.options.iconUrl + '" width="' + icon.options.iconSize[0] + 'px"' +
              'height="' + icon.options.iconSize[1] + '"><div class="cpt subcpt">' + num + '</div>'
    });
}
function updateMapSize(width) {
    map.getContainer().style.width = width;
    map.invalidateSize();
}