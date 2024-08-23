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
        this._icon.classList.remove("unmarked");
        this._icon.classList.add("marked");
        this.off('contextmenu', this.setAsMarked);
        this.on('contextmenu', this.setAsUnmarked);
    },
    showAsUnmarked: function() {
        this.setOpacity(1);
        this.setZIndexOffset(0);
        this._icon.classList.remove("marked");
        this._icon.classList.add("unmarked");
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
            this._icon.classList.add("unobtainable");
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
            document.getElementById('vandiv').innerHTML = this.iconToImg(this.van, "iti");
        }
        else 
            document.getElementById('van').style.display = "none";
        if (this.reqs != undefined) {
            document.getElementById('reqs').style.display = "block";
            let rdHtml = "";
            for (let i = 0; i < this.reqs.length; ++i) {
                if (this.reqs[i].length != undefined) {
                    rdHtml += '<div class="oritems"><div class="oritf"><p class="idot">•</p>' + this.iconToImg(this.reqs[i][0], "iti") + '</div>';
                    for(let j = 1; j < this.reqs[i].length; ++j) {
                        rdHtml += '<div class="orits"><p class="por">or</p>' + this.iconToImg(this.reqs[i][j], "itis") + '</div>';
                    }
                    rdHtml += '</div>';
                }
                else {
                    rdHtml += '<div class="item"><p class="idot">•</p>' + this.iconToImg(this.reqs[i], "iti") + '</div>';
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
    iconToImg: function(icon, imgClass) {
        return '<img class="ii ' + imgClass + '" src="' + icon.options.iconUrl + '"><p class="itp">' + 
               (icon.options.className == undefined ? icon.options.iconUrl.slice(6, -4) : icon.options.className) + '</p>';
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

var NonCheck = Check.extend({
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
        return this.isCountable();
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
        this._icon.classList.remove("unmarked");
        this._icon.classList.add("marked");
        this.off('contextmenu', this.setAsMarked);
        this.on('contextmenu', this.setAsUnmarked);
    },
    showAsUnmarked: function() {
        if (!this.hasShownChecks())
            return;
        this.setOpacity(1);
        this.setZIndexOffset(this.zIndexOffset);
        this._icon.classList.remove("marked");
        this._icon.classList.add("unmarked");
        let amount = this.getCountableChecksAmount();
        if (settingIsChecked('subCounterS') && amount > 0)
            this.loadCounterIcon(amount);
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
        for (let i = 0; i < this.checks.length; ++i) {
            if (this.checks[i].isShown()) 
                return true;  
        }  
        return false; 
    },
    countVisibleChecks: function() {
        let cpt = 0;
        for(let i = 0; i < this.checks.length; ++i) 
            cpt += this.checks[i].isShown() ? 1 : 0;
        return cpt;
    },
    loadIcon: function() {
        if (!settingIsChecked('emptysubS') && !this.hasShownChecks()) // Hide if empty
            return;    
        if (settingIsChecked('1checksubS') && this.countVisibleChecks() == 1) { // Show as only visible check
            for (let i = 0; i < this.checks.length; ++i)
                if (this.checks[i].isShown()) {
                    this.checks[i].loadAsSubmap(this._latlng);
                    return;
                }          
        }        
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
    loadCounterIcon: function(amount) {
        this.remove();
        let temp = this.icon;
        L.setOptions(this, {icon: getCounterIcon(this.icon, amount)});
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
    initialize: function(latLngTile, latLngImage, icon, name, imgsSize, floorOffset, floors) {
        L.setOptions(this, {icon: icon, riseOnHover: true, riseOffset: 2000, zIndexOffset: 2000});
        this.latLngTile = L.latLng(latLngTile);
        this.latLngImage = L.latLng(latLngImage);
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
    countVisibleChecks: function() {
        let cpt = 0;
        for(let i = 0; i < this.floors.length; ++i) 
            cpt += this.floors[i].countVisibleChecks();
        return cpt;
    },
    loadAsCheck: function() {
        for (let i = 0; i < this.floors.length; ++i) {
            if (this.floors[i].hasShownChecks()) {
                for (let j = 0; j < this.floors[i].checks.length; ++j)
                    if (this.floors[i].checks[j].isShown()) {
                        this.floors[i].checks[j].loadAsSubmap(this._latlng);
                        return;
                    }    
            }
        }
    },
    loadIcon: function() {
        if (mapState == 0) 
            this._latlng = this.latLngImage;
        else 
            this._latlng = this.latLngTile;
        if (!settingIsChecked('emptysubS') && !this.hasShownChecks()) // Hide if empty
            return;
        if (settingIsChecked('1checksubS') && this.countVisibleChecks() == 1) { // Show as singular check
            this.loadAsCheck();
            return;
        }       
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
    setupFloorButton: function(floorindex) {
        let floor = document.getElementById('F' + (floorindex + this.floorOffset));
        floor.style.display = 'flex';
        floor.addEventListener("click", function () {
            mapState == 2 ? removeAllLayers() : removeAllLayersExceptTL();
            resetActiveFloorButton();
            floor.style.filter = 'brightness(200%)';
            floor.style.width = "15.4vw";
            floor.style.marginLeft = "-0.4vw";
            activeFloor = floorindex;
            loadedDungeon[floorindex].load();             
        });
        floor.addEventListener('contextmenu', function() {
            if (loadedDungeon[floorindex].allShownChecksAreSet())
                loadedDungeon[floorindex].setAndShowAsUnmarked();
            else
                loadedDungeon[floorindex].setAndShowAsMarked();
        });
        floor.addEventListener('mouseover', function() {
            if (activeFloor == floorindex) 
                return;
            mapState == 2 ? removeAllLayers() : removeAllLayersExceptTL();
            loadedDungeon[floorindex].load();  
        });
        floor.addEventListener('mouseout', function() {
            if (activeFloor == floorindex || mapState == 1) 
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
        if (!settingIsChecked('emptysubS') && !this.hasShownChecks()) // Hide if empty
            return;  
        if (settingIsChecked('1checksubS') && this.countVisibleChecks() == 1) { // Show as singular check
            this.loadAsCheck();
            return;
        }   
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
    constructor(elem, id, type, maxState, items, minState) {
        this.elem = elem;
        this.id = id;
        //Type Legend:
        // 0 : One of a kind item (On/off)
        // 1 : Non Progressive Items (Ex. Bow)
        // 2 : Progressive Items (Ex. Clawshot, Dominion Rod)
        // 3 : Items with counters (Ex. Bottles, Poes, Keys)
        this.type = type;
        this.maxState = maxState;
        this.items = items;
        this.prevState = 0;
        this.state = 0;
        this.shouldReloadIcons = false;
        this.minState = minState == undefined ? 0 : minState;
        elem.addEventListener('click', () => { this.increaseState() });
        elem.addEventListener('contextmenu', () => { this.decreaseState() });
        elem.addEventListener('auxclick', (e) => { 
            if (e.button == 1) {
                e.preventDefault();
                this.resetState() ;
            }
        });
        this.initialize();
    } 
    resetState() {
        this.shouldReloadIcons = false;
        let state = this.state;
        if (state > this.minState) {
            if (state < this.maxState / 2) {
                for (let _ = state; _ > this.minState; --_)
                    this.decreaseState();
            }
            else {
                for (let _ = state; _ < this.maxState + 1; ++_)
                    this.increaseState();
            }
        }
        this.shouldReloadIcons = true;
    }
    setFlag() {
        trackerSU.setFlag(this.id, this.maxState >= 10 ? String.fromCharCode(this.state) : this.state.toString());
    }
    getFlag() {
        return this.maxState >= 10 ? trackerSU.getFlagAsCharCode(this.id) : trackerSU.getFlagAsNumber(this.id);     
    }
    initialize() {
        if (this.minState > 0) {
            for (let i = 0; i < this.minState; ++i)
                obtainedItems.push(this.items[i]);
        }
        let state = this.getFlag();
        if (state < this.maxState / 2) {
            for (let _ = 0; _ < state; ++_)
                this.increaseState();
        }
        else {
            for (let _ = this.maxState; _ >= state; --_)
                this.decreaseState();
        }
        this.shouldReloadIcons = true;
    }
    increaseState() {
        this.prevState = this.state;
        ++this.state;
        if (this.state > this.maxState)
            this.state = this.minState;
        this.update();
    }
    decreaseState() {
        this.prevState = this.state;
        --this.state;
        if (this.state < this.minState)
            this.state = this.maxState;
        this.update();
    }
    update() {
        this.setFlag();
        this.updateObtainedItems();
        this.updateHTMLElement();
    }
    updateObtainedItems() {
        if (this.items == undefined)
            return;
        if (this.type == 0 || this.items.length == undefined) {
            if (this.state == 0) // Remove on unmark
                removeFromArray(obtainedItems, this.items);
            else if (this.prevState == 0) // Put on mark from start
                obtainedItems.push(this.items)
        }
        else {
            if (this.state == this.minState) {
                if (this.type == 1) //Remove last added item if not progressive
                    removeFromArray(obtainedItems, this.items[this.prevState - 1]);
                else {
                    for(let i = this.minState; i < this.items.length; ++i) // Reset from max to min if progressive
                        removeFromArray(obtainedItems, this.items[i]);  
                }
            }
            else {
                if (this.type == 1 || this.prevState > this.state) //Remove previous item if we decreased and not progressive
                    removeFromArray(obtainedItems, this.items[this.prevState - 1]);
                if (this.prevState < this.state)
                    obtainedItems.push(this.items[this.state - 1]);
                if (this.type == 2 && this.state == this.maxState && this.prevState == this.minState) { // Add all from min to max
                    for(let i = this.minState; i < this.items.length - 1; ++i)
                       obtainedItems.push(this.items[i]);  
                }
            }
        }
        if(settingIsChecked('trackerS') && this.shouldReloadIcons)
            reloadIcons();
    }
    updateHTMLElement() {
        if (this.state == 0) {
            this.elem.style.filter = "brightness(50%)"; // Unmark item     
            if (this.type == 1 || this.type == 2) //Change item to base
                this.updateImage();
            else if (this.type == 3) {
                this.elem.childNodes[5].style.display = 'none'; //Hide counter
                if (this.maxState > 1) // Don't change color if item max is 1
                    this.elem.childNodes[5].style.color = "#c0c0c0";
            }
        }
        else {
            if (this.state == 1 || this.state == this.maxState) //Mark item
                this.elem.style.filter = "none"; 
            if (this.type == 1 || this.type == 2)  //Change item
                this.updateImage();           
            else if (this.type == 3) {
                this.elem.childNodes[5].innerHTML = this.state; // Update Counter
                switch (this.state) {
                    case 1: this.elem.childNodes[5].style.display = 'inline'; break; //Show Counter
                    case this.maxState - 1: this.elem.childNodes[5].style.color = "#c0c0c0"; break; // Change color off green
                    case this.maxState:
                        this.elem.childNodes[5].style.display = 'inline'; //Show counter
                        this.elem.childNodes[5].style.color = "#50C878"; // Change color to green
                        break;
                }  
            }
        }   
    }
    updateImage() {
        let imgSrc = this.elem.childNodes[3].src;
        this.elem.childNodes[3].src = imgSrc.slice(0, -5) + 
        (this.state == 0 ? 0 : this.state - 1) + imgSrc.slice(-4); 
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
    let maxSize = 50;
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
function qI(icon, quantity) { // Create item icon with quantity
    return renameIcon(icon, icon.options.iconUrl.slice(6, -4) + '&nbsp × &nbsp' + quantity);
}
function renameIcon(icon, name) { //Rename existing icon
    return L.icon({iconUrl: icon.options.iconUrl, iconSize: icon.options.iconSize, 
        className: name});
}

//General Map
var chest = createIcon('Chest', 505, 462);
var smallChest = createIcon('Small Chest', 508, 463);
var bossChest = createIcon('Boss Chest', 649, 541);
var howlingStone = createIcon('Howling Stone', 528, 802);
var goldenWolf = createIcon('Golden Wolf', 137, 161);
var rupeeBoulder = createIcon('Rupee Boulder', 2209, 1702);
var grotto = createIcon('Grotto', 573, 572);
var door = createIcon('Door', 982 , 1552);
var cave = createIcon('Entrance', 1708, 1370);
var lockedDoor = createIcon('Locked Door', 1053, 1045);
var dungeonStar = createIcon('Dungeon Star', 165, 167);
var mirror = createIcon('Mirror', 128, 128);
var castle = createIcon('Castle', 511, 570);
//Non Checks
var horseGrass = createIcon('Horse Grass', 100, 159);
var hawkGrass = createIcon('Hawk Grass', 346, 248);
var postman = createIcon('Postman', 493, 676);
var nastySoup = createIcon('BottleNasty', 128, 205, 'Nasty Soup');
var superbSoup = createIcon('BottleSoup', 128, 205, 'Superb Soup');
var purplePotion = createIcon('BottlePurple', 128, 205, 'Purple Chu Jelly');
var redPotion = createIcon('BottleRed', 128, 205, 'Red Potion');
var redChuJelly = renameIcon(redPotion, 'Red Chu Jelly');
var bluePotion = createIcon('BottleBlue', 128, 205, 'Blue Potion');
var blueChuJelly = renameIcon(bluePotion, 'Blue Chu Jelly')
var rarePotion = createIcon('BottleRare', 128, 205, 'Rare Chu Jelly');
var tearsPotion = createIcon('BottleTears', 128, 205, "Great Fairy's Tears");
var water = createIcon('BottleWater', 128, 205, 'Hot Spring Water');
var milk = createIcon('BottleMilk', 128, 205, 'Milk');
var milkHalf = createIcon('BottleMilkH', 94, 152, 'Milk 1/2');
var fairy = createIcon('BottleFairy', 128, 205, 'Fairy');
var lanternOil = createIcon('BottleYellow', 128, 205, 'Lantern Oil');
var yellowChuJelly = renameIcon(lanternOil, 'Yellow Chu Jelly');
var beeLarva = createIcon('BottleBee', 128, 205, 'Bee Larva');
var worms = createIcon('BottleWorm', 128, 205, 'Worm');


//Obtainables
var heartPiece = createIcon('Heart Piece', 380, 292);
var heartContainer = createIcon('Heart Container', 1000, 779);
var coralEarring = createIcon('Coral Earring', 128, 210);
var quiver = createIcon('Quiver0', 97, 128, 'Quiver'); //Placeholder
var bigQuiver = createIcon('Quiver1', 103, 128, 'Big Quiver');
var giantQuiver = createIcon('Quiver2', 114, 128, 'Giant Quiver');
var poeSoul = createIcon('Poe Soul', 118, 119);
var ooccoo = createIcon('OoccooPot', 32, 32, 'Ooccoo');
var smallKey = createIcon('Small Key', 128, 128);
var bossKey = createIcon('Boss Key', 32.5, 55);
var bossKeyGM0 = createIcon('GBK0', 125, 88);
var bossKeyGM1 = createIcon('GBK1', 100, 107);
var bossKeyGM2 = createIcon('GBK2', 118, 106);
var dungeonMap = createIcon('Dungeon Map', 152, 128);
var compass = createIcon('Compass', 128, 128);
var pumpkin = createIcon('Ordon Pumpkin', 128, 128);
var cheese = createIcon('Ordon Goat Cheese', 128, 128);
var fusedShadow = createIcon('Fused Shadow', 1000, 1059);
var mirrorShard = createIcon('Mirror Shard', 116, 115);
var greenRupee = createIcon('Green Rupee', 212, 331);
var blueRupee = createIcon('Blue Rupee', 226, 344);
var yellowRupee = createIcon('Yellow Rupee', 216, 343);
var redRupee = createIcon('Red Rupee', 222, 341);
var purpleRupee = createIcon('Purple Rupee', 227, 342);
var orangeRupee = createIcon('Orange Rupee', 222, 339);
var silverRupee = createIcon('Silver Rupee', 251, 381);
var seeds = createIcon('Seeds', 124, 125);
var arrows = createIcon('Arrows', 91, 128);
var bombs = createIcon('Bombs', 128, 140);
var waterBombs = createIcon('Water Bombs', 128, 120);
var bomblings = createIcon('Bomblings', 128, 103);

var antM = createIcon('Bug0', 125, 108, '♂&nbsp Ant');
var antF = createIcon('Bug1', 123, 119, '♀&nbsp Ant');
var dayflyM = createIcon('Bug2', 122, 124, '♂&nbsp Dayfly');
var dayflyF = createIcon('Bug3', 122, 124, '♀&nbsp Dayfly');
var beetleM = createIcon('Bug4', 147, 120, '♂&nbsp Beetle');
var beetleF = createIcon('Bug5', 147, 120, '♀&nbsp Beetle');
var mantisM = createIcon('Bug6', 156, 88, '♂&nbsp Mantis');
var mantisF = createIcon('Bug7', 156, 88, '♀&nbsp Mantis');
var stagBeetleM = createIcon('Bug8', 125, 116, '♂&nbsp Stag Beetle');
var stagBeetleF = createIcon('Bug9', 123, 112, '♀&nbsp Stag Beetle');
var pillbugM = createIcon('Bug10', 109, 118, '♂&nbsp Pillbug');
var pillbugF = createIcon('Bug11', 109, 118, '♀&nbsp Pillbug');
var butterflyM = createIcon('Bug12', 128, 114, '♂&nbsp Butterfly');
var butterflyF = createIcon('Bug13', 128, 115, '♀&nbsp Butterfly');
var ladybugM = createIcon('Bug14', 127, 118, '♂&nbsp Ladybug');
var ladybugF = createIcon('Bug15', 127, 118, '♀&nbsp Ladybug');
var snailM = createIcon('Bug16', 113, 93, '♂&nbsp Snail');
var snailF = createIcon('Bug17', 113, 92, '♀&nbsp Snail');
var phasmidM = createIcon('Bug18', 98, 146, '♂&nbsp Phasmid');
var phasmidF = createIcon('Bug19', 98, 146, '♀&nbsp Phasmid');
var grasshopperM = createIcon('Bug20', 146, 75, '♂&nbsp Grasshopper');
var grasshopperF = createIcon('Bug21', 146, 73, '♀&nbsp Grasshopper');
var dragonflyM = createIcon('Bug22', 140, 119, '♂&nbsp Dragonfly');
var dragonflyF = createIcon('Bug23', 140, 119, '♀&nbsp Dragonfly');

//Item Icons
var fishingRod = createIcon('Fishing Rod0', 79, 181, 'Fishing Rod');
var fishingRodCE = createIcon('Fishing Rod1', 80, 181, 'Fishing Rod & Coral Earring');
var slingshot = createIcon('Slingshot', 97, 150); 
var lantern = createIcon('Lantern', 85, 165);
var boomerang = createIcon('Gale Boomerang', 85, 170);
var ironBoots = createIcon('Iron Boots', 128, 128);
var bow = createIcon("Hero's Bow", 138, 138);
var hawkeye = createIcon('Hawkeye', 55, 49.4);
var bombBag = createIcon('Bomb Bag', 128, 173);
var giantBombBag = createIcon('Giant Bomb Bag', 125, 164);
var clawshot = createIcon('Clawshot0', 128, 179, 'Clawshot');
var doubleClawshot = createIcon('Clawshot1', 161, 128, 'Double Clawshot');
var aurusMemo = createIcon("Auru's Memo", 462, 619);
var spinner = createIcon('Spinner', 179, 128);
var asheisSketch = createIcon("Ashei's Sketch", 462, 619);
var ballAndChain = createIcon('Ball and Chain', 128, 107);
var redDominionRod = createIcon('Dominion Rod0', 128, 205, 'Past Dominion Rod');
var dominionRod = createIcon('Dominion Rod1', 128, 205, 'Dominion Rod');
var horseCall = createIcon('Horse Call', 64, 128);
var iliasCharm = createIcon("Ilia's Charm", 1000, 1227);
var renadosLetter = createIcon("Renado's Letter", 128, 107);
var invoice = createIcon('Invoice', 101, 118);
var woodenStatue = createIcon('Wooden Statue', 59, 128);
var skyBookChar = createIcon('Sky Book Character', 117, 102);
var ancientSkyBook = renameIcon(skyBookChar, 'Ancient Sky Book');
var bottle = createIcon('Bottle', 116, 188);
var shadowCrystal = createIcon('Shadow Crystal', 975, 1990);
var woodenSword = createIcon('Sword0', 35.7, 55, 'Wooden Sword');
var ordonSword = createIcon('Sword1', 35.5, 55, 'Ordon Sword');
var masterSword = createIcon('Sword2', 79, 127, 'Master Sword');
var lightMasterSword = createIcon('Sword3', 79, 127, 'Light Filled Master Sword');
var ordonShield = createIcon('Shield0', 49.3, 55, 'Ordon Shield');
var woodenShield = createIcon('Shield1', 41.9, 55, 'Wooden Shield');
var hylianShield = createIcon('Shield2', 44.3, 55, 'Hylian Shield');
var zoraArmor = createIcon('Zora Armor', 125, 148);
var magicArmor = createIcon('Magic Armor', 125, 149);
var wallet = createIcon('Wallet0', 68, 114, 'Wallet');
var bigWallet = createIcon('Wallet1', 81, 124, 'Big Wallet');
var giantWallet = createIcon('Wallet2', 96, 125, 'Giant Wallet');
var gateKeys = createIcon('Small KeyG', 128, 128, 'Gate Keys');
var smallKeyFT = renameIcon(smallKey, 'Forest Temple Small Key');
var bossKeyFT = renameIcon(bossKey, 'Forest Temple Boss Key');
var smallKeyGM = renameIcon(smallKey, 'Goron Mines Small Key');
var bossKeyGM = createIcon('GBK3', 117, 105, 'Goron Mines Boss Key');
var smallKeyLT = renameIcon(smallKey, 'Lakebed Temple Small Key');
var bossKeyLT = renameIcon(bossKey, 'Lakebed Temple Boss Key');
var smallKeyAG = renameIcon(smallKey, "Arbiter's Grounds Small Key");
var bossKeyAG = renameIcon(bossKey, "Arbiter's Grounds Boss Key");
var smallKeySR = renameIcon(smallKey, 'Snowpeak Ruins Small Key');
var bedroomKey = createIcon("Bedroom Key", 83, 128);
var smallkeyTT = renameIcon(smallKey, 'Temple of Time Small Key');
var bossKeyTT = renameIcon(bossKey, "Temple of Time Boss Key");
var smallKeyCS = renameIcon(smallKey, 'chestty in the Sky Small Key');
var bossKeyCS = renameIcon(bossKey, 'chestty in the Sky Boss Key');
var smallKeyPT = renameIcon(smallKey, "Palace of Twilight Small Key");
var bossKeyPT = renameIcon(bossKey, "Palace of Twilight Boss Key");
var smallKeyHC = renameIcon(smallKey, "Hyrule Castle Small Key");
var bossKeyHC = renameIcon(bossKey, "Hyrule Castle Boss Key");



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
var notaRupeesSU = new StorageUnit('notaRupee', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'); // 80 flags

var trackerSU = new StorageUnit('tracker', '00000000000000000000000100\0\0' + '000000000000000000000000000000000000000000000000000000000000000000000000'); // 100 flags
var settingSU = new StorageUnit('settings', '111111111111011111111111111111111111111111111111111111111111'); // 60 flags

var storUnits = [baseSU, poesSU, giftsSU, bugsSU, skillsSU, skycSU, shopSU,
     ooccooSU, lockedDoorSU, notaRupeesSU, trackerSU, settingSU];


//Reusable Check Description   
const agithaText = "Give this bug to Agitha to receive: Big Wallet (First Bug), Purple Rupee (Any Bug), Orange Rupee (Pair Completing Bug), Giant Wallet (Last Bug)."
const poeNightText = "Only appears at Night. ";
const neverRandomized = '<br>This item is NEVER randomized in Rando.';

//Global variables
var visibleCategories = [];
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
    let trackerItems = document.getElementsByClassName('titem');
    for (let i = 0; i < trackerItems.length; ++i)
        trackerItems[i].onload.call(trackerItems[i]);

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
            new Check([-9094, 4809], fishingRod, giftsSU, undefined, undefined, 'Retrieve the cradle from the monkey using the hawk and deliver it to Uli to receive the fishing rod.'),
            new Check([-8542, 4795], goldenWolf, skillsSU, undefined, [shadowCrystal], 'Summoned by the Death Mountain howling stone.'),
            new Check([-9514, 4964], heartPiece, giftsSU, undefined, undefined, 'After getting Epona back from the monsters, talk to Fado and complete the Goat Hoarding minigame in under 2 minutes to receive the heart piece.'),

            new FakeCheck([-9058, 4788], orangeRupee, notaRupeesSU, [[boomerang, clawshot]], "This orange rupee is hiding behind Rusl's house, use the boomerang or clawshot through the vines to obtain it."),
            new FakeCheck([-9006, 4999], purpleRupee, notaRupeesSU, [[boomerang, clawshot]], 'This purple rupee is hidden in the tall grass on the little platform to the left of the windmill.'),

            new NonCheck([-9517, 5015], horseGrass, 'grass'),
            new NonCheck([-8500, 4800], horseGrass, 'grass'),
            new NonCheck([-8991, 4960], hawkGrass, 'grass'),
            new NonCheck([-8940, 5001], hawkGrass, 'grass'),
            new NonCheck([-9169, 4934], hawkGrass, 'grass'),
            new NonCheck([-9035, 4848], beeLarva, 'bottle'),
            //Monkey fishing spot
            //Cat fishing spot 
            //Uli House fishing spot


            new FlooredSubmap([-8791, 4941], door, 'LinkHouse', [
                [[660, 485], [new Check([-8790, 5289], chest, baseSU, purpleRupee, [lantern], 'Use the lantern to locate the chest and be able to open it.')]],
                [[659, 478], [new Check([-8661, 5068], chest, baseSU, woodenSword, undefined, 'The chest is available after buying the slingshot.')]]
            ], 2),
            new Submap([-8964, 4938], door, 'SeraShop.png', [464, 491], [
                new Check([-8790, 5034], slingshot, shopSU, undefined, undefined, "After saving Sera's Cat, you can buy the slingshot for 30 rupees."),
                new Check([-8837, 4880], milkHalf, giftsSU, undefined, [fishingRod], 'Obtain the bottle by talking to Sera her cat has returned with a fish you gave him with the fishing rod.')
                //Add Entire Shop
            ]),
            new Submap([-9080, 4783], door, 'RuslHouse.png', [656, 449], [
                new Check([-9004, 4850], ordonSword, baseSU, undefined, undefined, 'Pick up the sword on the couch after entering by the front door or by the side of the house by digging as Wolf Link.'),
            ]),
            new Submap([-9037, 5015], door, 'JaggleHouse.png', [661, 290], [
                new Check([-9044, 4410], ordonShield, baseSU, undefined, [shadowCrystal], 'Use Midna to jump to the ledge where the shield is, than bonk on the wall twice to make it fall and obtain it.')
            ]),
            new FlooredSubmap([-9171, 4953], door, 'Bo', [
                [[469, 780], [new Check([-9339, 5044], chest, giftsSU, ironBoots, undefined, 'After clearing the Eldin Twilight, wrestle against Bo to optain the iron boots.')]],
                [[333, 247], []]
            ]),
            new Submap([-9523, 4765], grotto, g1.img, g1.imgSize, [
                new Check([-9267, 4700], chest, baseSU, purpleRupee, [shadowCrystal, lantern], 'Light the 3 torches in front of the elevated platform to make the chest appear.'),
                new NonCheck([-9435, 4759], rarePotion, 'bottle') 
            ])
        ]),
        new Province([ // Faron
            [-5412, 5564], [-5374, 5998], [-5954, 6282], [-5944, 7028], [-6700, 7216], [-7144, 6960], [-8048, 5568], [-7844, 4680],
            [-7360, 4200], [-6640, 3464], [-6360, 3744], [-5944, 3776], [-5834, 4743], [-5630, 4883]
        ], false, [-6512, 5536], [
            new Check([-7405, 4910], lantern, notaRupeesSU, undefined, undefined, 'Talk to Coro to obtain the lantern. This is not a Randomizer Check.'),
            new Check([-7023, 4805], smallChest, baseSU, smallKey, undefined, 'Walk into the cave and open the chest to obtain the key to the Faron Woods gate.'),
            new Check([-7023, 4834], chest, baseSU, heartPiece, [lantern], 'Light the 2 torches besides the small chest and climb the ledge to open the chest.'),
            new Check([-7121, 4136], smallChest, baseSU, yellowRupee, undefined, 'Defeat the Deku Baba and open the chest behind it.'),
            new Check([-7405, 4885], lanternOil, giftsSU, undefined, undefined, 'After clearing the Faron twilight, talk to Coro and he will offer you the oil bottle for 100 rupees.'),
            new Check([-7104, 4184], goldenWolf, skillsSU, undefined, undefined, 'Meet the golden wolf after clearing the Faron Twilight to learn the Ending Blow.'),
            new Check([-7235, 4518], smallChest, baseSU, redRupee, [lantern], 'Clear out the purple fog with the lantern and climb the ledge to reach the chest.'),
            new Check([-7010, 4567], smallChest, baseSU, yellowRupee, [lantern], 'Clear out the purple fog with the lantern and go to the left of the cave entrance to find the chest.'),
            new Check([-7351, 4513], chest, baseSU, purpleRupee, [lantern], 'Clearn out the purple fog with the lantern and from the exit of the mist, go right to find the chest.'),
            new Check([-6278, 4930], heartPiece, baseSU, undefined, [[boomerang, clawshot]], 'The heart piece is on the leaves of a tree and can be grabbed with a long ranged item.'),
            new Check([-6344, 4764], beetleM, bugsSU, undefined, undefined, 'This ♂ Beetle is on a tree trunk, simply pick it up.'),
            new Check([-5985, 5151], beetleF, bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Beetle is on an elevated tree trunk, use the boomerang or the clawshot to bring it closer.'),
            new Check([-7184, 4515], poeSoul, poesSU, undefined, [shadowCrystal], 'Use Midna jump to reach the platform where the poe is.'),
            new Check([-6801, 3677], masterSword, baseSU, undefined, [shadowCrystal], 'Press A on the Master Sword to obtain it.'),
            new Check([-6850, 3677], shadowCrystal, baseSU, undefined, [shadowCrystal], 'Press A on the Master Sword to obtain the shadow crystal.'),
            new Check([-7184, 3722], snailM, bugsSU, undefined, [[boomerang, clawshot]], 'This ♂ Snail is on the ceiling of the alcove with the broken chest.'),
            new Check([-6135, 4891], chest, baseSU, orangeRupee, [clawshot], 'The chest is under the bridge. Clawshot the target above the chest to reach it.'),
            new Check([-5953, 4955], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Above the flower patch.'),
            new Check([-7172, 3043], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Behind the waterfall, accessible while fighting Skull Kid for the second time.'),
            new Check([-6975, 3273], chest, baseSU, qI(bombs, 30), [lantern], 'Light the 2 torches in the back of the area to make the chest appear.'),
            new Check([-7137, 3529], poeSoul, poesSU, undefined, [shadowCrystal, [bombBag, ballAndChain]], 'Destroy the rock above the grotto to make the poe appear.'),
            new Check([-7151, 3457], chest, baseSU, orangeRupee, [spinner], 'From the top of the vines, ride the spinner tracks until you reach the chest.'),
            new Check([-6877, 3703], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'After defeating Skull Kid for the 2nd time, you can find this poe in the bottom right of the Master Sword area.'),

            new FakeCheck([-7340, 4043], howlingStone, skillsSU, [shadowCrystal], 'Summons the South Castle Town Golden Wolf, accessible while on the way to the Master Sword.'),

            new NonCheck([-7900, 4857], horseGrass, 'grass'),
            new NonCheck([-7701, 4803], horseGrass, 'grass'),
            new NonCheck([-6666, 4936], horseGrass, 'grass'),
            new NonCheck([-7325, 3569], hawkGrass, 'grass'),
            new NonCheck([-7318, 3518], beeLarva, 'bottle'),
            // Faron spring fishing spot


            new Submap([-7447, 4718], cave, 'FaronEntryCave.png', [455, 495], [
                new Check([-7340, 4450], smallChest, baseSU, yellowRupee, undefined, 'Use the lantern to be able to locate the chest more easily.')
            ]),
            new Submap([-6662, 5180], grotto, g2.img, g2.imgSize, [
                new Check([-6928, 5138], smallChest, baseSU, yellowRupee, [shadowCrystal], 'Defeat all the enemies and cut the grass to make it easier to reach the chest.'),
                new Check([-6533, 5308], smallChest, baseSU, redRupee, [shadowCrystal], 'Defeat all the enemies and cut the grass to make it easier to reach the chest.'),
                new Check([-6370, 5050], smallChest, baseSU, redRupee, [shadowCrystal], 'Defeat all the enemies and cut the grass to make it easier to reach the chest.'),
                new NonCheck([-6571, 5153], rarePotion, 'bottle') // Blue / Red
                //Rupees By Defeating enemies (25 rupees)
            ]),
            new Submap([-5652, 4644], grotto, g5.img, g5.imgSize, [
                new NonCheck([-5378, 4597], worms, 'bottle')
                //Fishing spot
            ]),
            new Submap([-7123, 3500], grotto, g2.img, g2.imgSize, [
                new Check([-6868, 3472], chest, baseSU, heartPiece, [shadowCrystal, [bombBag, ballAndChain]], 'Defeat all the 8 Deku Serpents to make the chest appear.')
            ]),
            new Submap([-7204, 3678], door, 'TimeDoor.png', [293, 575], [
                new Check([-7458, 3700], snailF, bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Snail is too high to reach on the wall, use a long ranged item to make it come down.'),
                new Check([-7470, 3618], poeSoul, poesSU, undefined, [redDominionRod, shadowCrystal], 'Move the Howl Statue to reveal the poe.'),
                new Check([-7504, 3704], chest, baseSU, heartPiece, [redDominionRod], 'Move the Howl Statue and go to the end of the tunnel behind it to reach the chest.')
            ])
        ]),
        new Province([ // Eldin
            [-5952, 6280], [-5936, 7020], [-5904, 7676], [-6044, 8248], [-5952, 8836], [-5612, 9452], [-5212, 9544], [-4584, 9492], 
            [-3932, 9572], [-3340, 9472], [-2956, 9196], [-2460, 9040], [-1972, 8608], [-1404, 8006], [-1228, 7352], [-2164, 7080], 
            [-2772, 7060], [-2989, 7110], [-3281, 6985], [-3432, 6760], [-3580, 6472], [-3748, 6372], [-3932, 6324], [-4276, 6340], 
            [-4419, 6316], [-4680, 6260], [-5060, 5972], [-5332, 6004],
        ], false, [-4096, 7904], [
            new Check([-5504, 8095], chest, baseSU, purpleRupee, [lantern], 'Light the 2 torches to make it appear the chest appear.'),
            new Check([-5448, 8123], antM, bugsSU, undefined, undefined, 'This ♂ Ant is a the base of the tree.'),
            new Check([-4064, 6973], grasshopperM, bugsSU, undefined, undefined, 'This ♂ Grasshopper is particulary hard to get. Use the boomerang or clawshot if necessary.'),
            new Check([-3372, 5952], grasshopperF, bugsSU, undefined, undefined, 'This ♀ Grasshopper is just lying on the ground.'),
            new Check([-3158, 7408], phasmidM, bugsSU, undefined, [[boomerang, clawshot]], "This ♂ Phasmid is too high to reach, so you'll need to use the clawshot or the boomerang to make it come down."),
            new Check([-2390, 7561], phasmidF, bugsSU, undefined, [[boomerang, clawshot]], "This ♀ Phasmid is too high to reach, you can use the boomerang from down below to reach her, or " + 
                "climb the ledge using the clawshot target."),
            new Check([-5584, 6316], pillbugF, bugsSU, undefined, undefined, 'This ♀ Pill Bug is hidden in the tall grass.'),
            new Check([-5431, 6004], pillbugM, bugsSU, undefined, undefined, 'This ♂ Pill Bug is just lying on the ground.'),
            new Check([-5299, 5673], heartPiece, baseSU, undefined, [[boomerang, clawshot]], 'The heart piece is sitting on top of the stone pillar.'),
            new Check([-5263, 5626], chest, baseSU, heartPiece, [doubleClawshot], 'Use the target path and the vines to reach the chest.<br>Glitch: Use the boomerang to LJA to the chest.'),
            new Check([-5130, 7593], heartPiece, giftsSU, undefined, [bow], 'After completing the Goron Mines, talk to Talo on top of the watchtower to play his minigame, than succeed to obtain the heart piece.'),
            new Check([-5053, 7538], chest, baseSU, orangeRupee, [[bombBag, ballAndChain]], "Blow up the rock south of the village near the spring, and use the chickens inside the cave (they are near the center of the village if "+
                "you reload the area) to:<br>1. Climb behind Malo Mart and make the jump to the Inn<br>2. Climb on top of the inn and jump towards the top of Barnes' shop<br>3. Climb to the base of the watchtower near the goron" + 
                "<br>4. Go to the left side of the watchtower, and jump towards the chest with the chicken.<br>The chest is above the path to Death Mountain."),
            new Check([-5847, 7696], chest, baseSU, heartPiece, [[bombBag, ballAndChain], [ironBoots, magicArmor]], 'Break the rock to enter the cave, then let yourself sink in the water at the end of the cave.'),
            new Check([-4399, 6674], chest, baseSU, heartPiece, [[bombBag, ballAndChain]], 'Destroy the rocks at the bottom of the trail, than start climbing. Once you reach the vines with a rock on top, use a well timed bomb throw or ' +
                'the ball and chain to destroy the rock. Then, make the jump and climb the vines, than jump down a few times to reach the chest.'),
            new Check([-5474, 8273], zoraArmor, giftsSU, undefined, [gateKeys], 'Save Ralis and follow Rutella through the graveyard to obtain the Zora Armor.'),
            new Check([-5228, 7767], poeSoul, poesSU, undefined, [shadowCrystal], "Appears only at Night.In the ruins of Barnes' old warehouse."),
            new Check([-5107, 7621], poeSoul, poesSU, undefined, [shadowCrystal], "Appears only at Night. At the base of the watchtower."),
            new Check([-5610, 7578], heartPiece, baseSU, undefined, [[boomerang, bow], bombBag], "Use the bomb arrows to blow up the rocks up on the ledge, than use the boomerang or the clawshot to obtain the heart piece"),
            new Check([-5455, 8048], poeSoul, poesSU, undefined, [shadowCrystal], "Appears only at Night. Near the graves."),
            new Check([-4331, 8118], poeSoul, poesSU, undefined, [shadowCrystal], "Appears only at Night. Up on the ledge, use a goron or the clawshot to get up."),
            new Check([-4049, 8169], chest, baseSU, heartPiece, [clawshot], 'Clawshot the vines hanging from the stone bridge and jump down the alcove to the chest.'),
            new Check([-3944, 5550], heartPiece, giftsSU, undefined, undefined, 'After repairing the bridge for 1000 rupees, talk to the Goron Elder in front of the Malo Mart in Kakariko and bring the springwater to the goron.'),
            new Check([-5347, 5978], poeSoul, poesSU, undefined, [shadowCrystal], 'Only appears at night. Behind the tree with the crows.'),
            new Check([-5473, 8235], coralEarring, giftsSU, undefined, [asheisSketch], 'Show the sketch to Ralis to obtain the coral earring.'),
            new Check([-5479, 8140], goldenWolf, skillsSU, undefined, [shadowCrystal], 'Summoned by the Snowpeak Howling Stone.'),
            new Check([-5493, 7987], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Push the south-west grave to reveal the poe.'),
            new Check([-2155, 6620], iliasCharm, giftsSU, undefined, [woodenStatue, [bow, slingshot]], 'Defeat all the Bulblins, than talk to Impaz in front of her house to receive the charm. ' + neverRandomized),
            new Check([-2165, 6565], heartPiece, baseSU, undefined, [horseCall, shadowCrystal, clawshot], 'Start the Cat Seeking Minigame by talking to the Cucco Leader near the howling stone. ' +
                "Once you have spoken to all 20 cats, report back to the Cucco Leader to receive the heart piece in front of Impaz' House"),
            new Check([-2018, 6535], poeSoul, poesSU, undefined, [shadowCrystal, horseCall], poeNightText + 'On the balcony above the white piece of cloth.'),

            new FakeCheck([-4063, 8232], howlingStone, skillsSU, [shadowCrystal], 'Summons the Ordon Spring Golden Wolf. Is accessible while clearing out the Eldin Twilight.'),
            new FakeCheck([-2065, 6665], howlingStone, skillsSU, [shadowCrystal], 'Summons the Hyrule Castle Golden Wolf. Is accessible when you first get into the Hidden Village'),
            new FakeCheck([-5380, 5510], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'Blow up the rock with a bomb or hit it with the ball and chain to reveal rupees.'),       
            new FakeCheck([-5840, 7667], rupeeBoulder, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'The rock is underwater in front of the chest.'),
            new FakeCheck([-5074, 5909], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'The rock is in the middle of the field.'),
            new FakeCheck([-4269, 8150], redRupee, notaRupeesSU, undefined, 'There are 4 red rupees hidden under rocks near the poes, for a total of 80 rupees.'),
            new FakeCheck([-5513, 7720], silverRupee, notaRupeesSU, [bombBag, bow], 'Climb up the sanctuary with Midna jumps or a Cucco, than shoot a bomb arrow at the bell to make the rupee drop.'),
            new FakeCheck([-5518, 8237], rupeeBoulder, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'Underwater, right of the Zora shrine.'),
            new FakeCheck([-2391, 7503], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain], 'In the open, near the cave entrance.']),

            new NonCheck([-5564, 7612], horseGrass, 'grass'),
            new NonCheck([-4716, 6818], horseGrass, 'grass'),
            new NonCheck([-5342, 6186], horseGrass, 'grass'),
            new NonCheck([-4108, 8225], hawkGrass, 'grass'),
            new NonCheck([-5507, 8125], beeLarva, 'bottle'),
            new NonCheck([-4102, 8260], rarePotion, 'bottle'),
            // Kak Goron Night Shop
            // Death Mountain Shop
            // Graveyard Crows (22 rupees)
            // Gorge Tree Crows (30 rupees)
            //Eldin spring fishing spot
            //Graveyard fishing spot


            new Submap([-5259, 7660], door, 'KakEmptyHouse.png', [399, 230], [
                new Check([-5239, 7705], antF, bugsSU, undefined, undefined, 'This ♀ Ant is walking around the floor of the house.')
            ]),
            new FlooredSubmap([-5283, 7580], door, 'Inn', [
                [[600, 241], [new Check([-5330, 8105], smallChest, baseSU, redRupee, undefined, 'The chest is hidden under the staircase.')]],
                [[655, 343], []]
            ]),
            new Submap([-5162, 7670], door, 'Barnes.png', [399, 249], [
                new Check([-5300, 7755], bombBag, shopSU, undefined, undefined, 'After clearing the Goron Mines, you buy this Bomb Bag from Barnes for 120 rupees.')
            ]),
            new FlooredSubmap([-5097, 7593], door, 'Watchtower', [
                [[379, 300], []],
                [[379, 274], [new Check([-5255, 7317], chest, baseSU, purpleRupee, undefined, 'Climb the ladder to reach the chest.')]]
            ], 2),
            new Submap([-5382, 7565], door, 'KakMaloMart.png', [399, 286], [
                new Check([-5445, 7250], hylianShield, shopSU, undefined, undefined, 'You can buy it after saving Collin for 200 rupees.'),
                new Check([-5445, 7325], woodenShield, shopSU, undefined, undefined, 'You can buy it after saving Collin for 50 rupees.'),
                new Check([-5445, 7400], redPotion, shopSU, undefined, undefined, 'You can buy it after saving Collin for 30 rupees.'),
                new Check([-5445, 7475], hawkeye, shopSU, undefined, [bow], "You can buy it for 100 rupees after attempting the Talo's Sharpshooting minigame.")
                //Add Entire Shop
            ]),
            new FlooredSubmap([-5491, 7699], door, 'Sanctuary', [
                [[495, 273], [
                    new FakeCheck([-5481, 7322], dominionRod, notaRupeesSU, [ancientSkyBook], 'Show the Ancient Sky Book to Shad for him to do an encantation which gives power back to the Dominion Rod. This is not a Randomizer Check.'),
                ]],
                [[260, 225], [
                    new Check([-5510, 7661], renadosLetter, giftsSU, undefined, undefined, 'After clearing the Temple of Time, talk to Renado to obtain his letter. ' + neverRandomized),
                    new Check([-5540, 7590], horseCall, giftsSU, undefined, [iliasCharm], 'Show the charm to Ilia for it to be revealed as the horse call and receive it back.'),
                ]]
            ], 2),
            new Submap([-5711, 6043], cave, 'EldinCave.png', [862, 780], [
                new Check([-5810, 6372], chest, baseSU, purpleRupee, [[bombBag, ballAndChain]], 'Defeat the skulltula and open the chest.'),
                new Check([-5469, 6199], poeSoul, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'Use your senses to see the poe at the end of this branch.'),
                new Check([-5399, 6319], chest, baseSU, heartPiece, [[bombBag, ballAndChain], lantern], 'Light the 2 torches to make the chest appear.'),
                new Check([-5530, 5822], smallChest, baseSU, redRupee, [[bombBag, ballAndChain]], 'Use bombs or the ball and chain to destroy the cobwebs and reach the chest.'),
                new NonCheck([-5604, 5704], lanternOil, 'bottle')
            ]),
            new Submap([-5607, 6282], grotto, g2.img, g2.imgSize, [
                //Keese that drop rupees (25 rupees)
            ]),
            new Submap([-3772, 6334], grotto, g1.img, g1.imgSize, [
                new Check([-3527, 6279], chest, baseSU, purpleRupee, [shadowCrystal, lantern], 'Light the 2 torches to make the chest appear.'),
                new Check([-3678, 6013], smallChest, baseSU, purpleRupee, [shadowCrystal], 'Hidden in the tall grass.'),
                new NonCheck([-3676, 6313], rarePotion, 'bottle')
                //8 Bombskits Worms.
                
            ]),
            new Submap([-3249, 7223], grotto, g5.img, g5.imgSize, [
                new Check([-2987, 7192], smallChest, baseSU, purpleRupee, [shadowCrystal], 'Cross the water to reach the chest. Be careful of the Skullfish and Bombfish.'),
                new NonCheck([-2941, 7190], beeLarva, 'bottle'),
                //Skullfish and Bombfish Fishing spot
            ]),
            new FlooredSubmap([-2400, 7597], cave, 'LavaCave', [
                [[494, 275], [
                    new Check([-2310, 7530], chest, baseSU, orangeRupee, [clawshot, ironBoots, lantern], 'Light the 2 torches to make the chest appear.'),
                    new Check([-2419, 7522], chest, baseSU, heartPiece, [clawshot, ironBoots], 'Defeat the Dodongo to make opening the chest easier.')
                ]],
                [[495, 275], [new Check([-2253, 7920], smallChest, baseSU, redRupee, [clawshot, ironBoots], 'From the entrance at the top, jump down in the magnetic field with the Iron Boots to reach the chest.')]],
                [[318, 275], []],
                [[319, 275], []]
            ]),
            new Submap([-1543, 7011], grotto, g2.img, g2.imgSize, [
                new Check([-1282, 6999], chest, baseSU, heartPiece, [spinner, shadowCrystal, [bombBag, ballAndChain]], 'Defeat the 3 Stalfos to make the chest appear.'),
                new Check([-1529, 6815], smallChest, baseSU, qI(bombs, 5), [spinner, shadowCrystal], 'Hidden in the west tall grass, cut it to make the chest easier to see.'),
                new Check([-1566, 7150], smallChest, baseSU, qI(bombs, 5), [spinner, shadowCrystal], 'Hidden in the east tall grass, cut it to make the chest easier to see.')
            ]),
            new Submap([-2211, 6585], door, 'Impaz.png', [276, 255], [
                new Check([-2180, 6604], ancientSkyBook, giftsSU, undefined, [woodenStatue, redDominionRod, [slingshot, bow]], 'Defeat all the Bulblins, than show Impaz the Powerless Dominion Rod to receive the Ancient Sky Book.')
            ])

        ]),
        new Province([ // Desert
            [-6646, 3472], [-6704, 2448], [-6584, 1152], [-6208, 880], [-5240, 1000], [-3668, 1256], [-3480, 1804], [-3646, 2242], 
            [-3804, 2924], [-3840, 3154], [-4984, 3264], [-5116, 3148], [-5280, 3184], [-5472, 3256], [-5640, 3424], [-5953, 3742],
            [-6336, 3736]
        ], false, [-5440, 2224], [
            new Check([-4664, 582], goldenWolf, skillsSU, undefined, [shadowCrystal], 'Summoned by the Lake Hylia Howling Stone.'),
            new Check([-6110, 2588], poeSoul, poesSU, undefined, [shadowCrystal], 'Appears only at Night. Above the grotto entrance, near the skulls.'),
            new Check([-5736, 2179], smallChest, baseSU, redRupee, undefined, 'Clawshot the peahat over the chasm or walk all the way around it to reach the chest.'),
            new Check([-6108, 2148], smallChest, baseSU, redRupee, [clawshot], 'Clawshot the tree peahat to reach the higher platform where the chest is.'),
            new Check([-5825, 1480], smallChest, baseSU, qI(arrows, 10), undefined, 'The chest is on the dark rock platform.'),
            new Check([-6101, 1450], dayflyM, bugsSU, undefined, undefined, 'This ♂ Dayfly is flying around above the sand.'),
            new Check([-5964, 934], dayflyF, bugsSU, undefined, undefined, 'This ♀ Dayfly is flying around in the north gap with rocky walls.'),
            new Check([-5792, 322], smallChest, baseSU, purpleRupee, [clawshot], 'Clawshot the peahat to cross the chasm and get to the chest.'),
            new Check([-6077, 560], poeSoul, poesSU, undefined, [clawshot, shadowCrystal], poeNightText + 'Next to the Cave of Ordeals entrance.'),
            new Check([-5125, 1380], poeSoul, poesSU, undefined, [clawshot, shadowCrystal], 'Clawshot the tree peahat to reach the higher platform. The Poe is above the grotto entrance.'),
            new Check([-5048, 655], smallChest, baseSU, redRupee, undefined, 'The chest is near the campfire.'),
            new Check([-5090, 705], smallChest, baseSU, purpleRupee, undefined, 'Destroy the wooden tower with a boar or the ball and chain to gain access to the chest.'),
            new Check([-5090, 605], smallChest, baseSU, qI(arrows, 10), undefined, 'Destroy the wooden tower with a boar or the ball and chain to gain access to the chest.'),
            new Check([-4831, 856], smallChest, baseSU, redRupee, undefined, 'Destroy the wooden gate with a boar to gain access to the chest.'),
            new Check([-4936, 356], smallChest, baseSU, redRupee, undefined, 'Destroy the wooden gate with a boar to gain access to the chest.'),
            new Check([-6405, 1573], chest, baseSU, orangeRupee, undefined, 'bring a boar from the entrance of the desert or the campfire to destroy the 2 gates blocking access to the chest.'),
            new Check([-4663, 704], smallChest, baseSU, qI(arrows, 10), undefined, 'Follow the right path after the campfire to reach the chest.'),
            new Check([-4320, 692], smallChest, baseSU, qI(arrows, 20), undefined, 'Behind the wooden tower.'),
            new Check([-4219, 628], smallChest, baseSU, purpleRupee, undefined, 'In the corner, defeat the Bulblins for easier access to the chest.'),
            new Check([-4171, 711], heartPiece, baseSU, undefined, [[woodenSword, bow, ballAndChain, bombBag]], 'Destroy the roasting boar to reveal the heart piece.'),
            new Check([-4151, 668], smallKey, baseSU, undefined, undefined, 'Defeat the Bulblin that has the key to collect it. In Rando, the item is simply on the ground.'),
            new Check([-3892, 557], poeSoul, poesSU, undefined, [shadowCrystal], "On the left of the entrance of Arbiter's Grounds."),
            new Check([-3889, 654], chest, baseSU, purpleRupee, [lantern], "Light the 2 torches on the right of the entrance of Arbiter's Grounds to make the chest appear."),
            new Check([-4292, 604], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'After defeating King Bulblin, return to where the find happened to find the poe.'),
            new Check([-4623, 470], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Take the left path twice from the campfire to reach this poe.'),

            new Submap([-6060, 2588], grotto, g4.img, g4.imgSize, [
                new Check([-5762, 2464], chest, baseSU, orangeRupee, [shadowCrystal], 'Defeat all the skulltulas to make the chest appear.')
            ]),
            new Submap([-5689, 638], grotto, g3.img, g3.imgSize, [
                new NonCheck([-5579, 809], rarePotion, 'bottle'), // Rare / Blue / Red Chu (Really good odds)
                //Red and Purple Chus
            ]),
            new Submap([-5075, 1380], grotto, g3.img, g3.imgSize, [
                new Check([-4986, 1168], poeSoul, poesSU, undefined, [clawshot, shadowCrystal], 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'),
                new Check([-5034, 1627], poeSoul, poesSU, undefined, [clawshot, shadowCrystal], 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'),
                new Check([-4812, 1381], chest, baseSU, orangeRupee, [clawshot, shadowCrystal, [bombBag, ballAndChain], lantern], 'Destroy the rocks blocking the way, then light 3 torches to make the chest appear.')
            ])
            //Cave of Ordeals
        ]),
        new Province([ // Peak
            [-712, 5344], [-1132, 5392], [-1296, 5360], [-1548, 5152], [-1690, 4891], [-1892, 4804], [-2076, 4624], [-2564, 4404], 
            [-2704, 4220], [-3036, 4080], [-3624, 3880], [-3812, 3184], [-3636, 2272], [-3436, 1720], [-2668, 1568], [-2092, 1804], 
            [-1696, 2288], [-852, 2616], [-620, 3676], [-584, 4612]
        ], false, [-1744, 3488], [
            new Check([-606, 4446], asheisSketch, giftsSU, undefined, undefined, 'Speak to Ashei to obtain her sketch.'),
            new Check([-307, 3521], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Left of the rock the Reekfish Scent makes you go right of.'),
            new Check([-432, 3728], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Above the grotto.'),
            new Check([-344, 3334], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Above the grotto, behind the tree.'),
            new Check([-2985, 1299], poeSoul, poesSU, undefined, [shadowCrystal], 'When in front of the mansion, go back to the snow trail as Wolf Link and climb the spiral structure. The poe is at the top.'),
            new Check([-691, 3013], heartPiece, giftsSU, undefined, [bombBag, ballAndChain], 'Requires having cleared Snowpeak Ruins. Race Yeto and win, than go back to the mountaintop and win against Yeta.'),
            new Check([-655, 3300], poeSoul, poesSU, undefined, [ballAndChain, shadowCrystal], 'In the cave, break the north ice block with the ball and chain to reveal the poe.'),
            new Check([-675, 3275], chest, baseSU, orangeRupee, [ballAndChain, shadowCrystal, lantern], 'In the cave, break the 2 ice blocks to reveal torches. Light them up to make the chest appear.'),

            new FakeCheck([-475, 3393], howlingStone, skillsSU, [shadowCrystal], 'Summons the Kakariko Graveyard Golden Wolf.'),


            new Submap([-405, 3690], grotto, g4.img, g4.imgSize, [
                new Check([-265, 3631], chest, baseSU, orangeRupee, [shadowCrystal, ballAndChain], 'Defeat the furthest Freezard to reveal the chest.')
            ]),
            new Submap([-390, 3350], grotto, g3.img, g3.imgSize, [
                new NonCheck([-416, 3048], rarePotion, 'bottle'), 
            ])
        ]),   
        new Province([[ // Lanayru
            [-5400, 5584], [-5360, 6000], [-5056, 5968], [-4640, 6248], [-4312, 6336], [-3696, 6344], [-3528, 6472], [-3424, 6728], 
            [-3280, 6968], [-2992, 7104], [-2760, 7048], [-2096, 7072], [-1248, 7328], [-800, 7216], [-584, 6768], [-480, 6368], 
            [-504, 5832], [-606, 5444], [-722, 5358], [-1104, 5408], [-1288, 5376], [-1554, 5161], [-1704, 4896], [-1894, 4812], 
            [-2077, 4634], [-2539, 4431], [-2749, 4205], [-3632, 3892], [-3764, 3420], [-3820, 3180], [-4288, 3200], [-4974, 3290],
            [-5081, 3201], [-5319, 3218], [-5592, 3400], [-5936, 3768], [-5813, 4728], [-5776, 4750], [-5624, 4872], [-5552, 5096]
        ], castlePoints], false, [-2192, 5984], [
            new Check([-610, 4930], smallChest, baseSU, yellowRupee, undefined, 'From the water, climb the path to reach the chest.'),
            new Check([-601, 4967], smallChest, baseSU, redRupee, [shadowCrystal], 'Use Midna jumps to follow the path from the west shore of the domain to reach the chest.'),
            new Check([-5461, 3284], chest, baseSU, orangeRupee, [[ironBoots, magicArmor]], 'The chest is underwater, hidden by some tall seaweed.'),
            new Check([-4604, 3418], mantisM, bugsSU, undefined, [[boomerang, clawshot]], 'This ♂ Mantis is on the side of the bridge above the void. If you do not have a long ranged item, wait for it to fly near you.'),
            new Check([-5459, 3559], mantisF, bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Mantis is too high to reach, use a long ranged item.'),
            new Check([-3658, 3845], butterflyF, bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Butterfly is on a higher ledge hiding in the purples flowers. Clawshot the vines to climb the ledge ' +
                'or grab it from below.'),
            new Check([-4158, 3966], butterflyM, bugsSU, undefined, undefined, 'This ♂ Butterfly is hiding in some purple flowers.'),       
            new Check([-2589, 4365], stagBeetleM, bugsSU, undefined, [[boomerang, clawshot]], 'This ♂ Stag Beetle is on the trunk of a tree, a bit too high to reach.'),
            new Check([-2005, 4790], stagBeetleF, bugsSU, undefined, [[boomerang, clawshot]], 'This ♀ Stag Beetle is above the entrance of the ice block cave, and is too high too reach.'),
            new Check([-2910, 4880], chest, baseSU, orangeRupee, [[ironBoots, magicArmor]], 'The chest is in the cage underwater.'),
            new Check([-206, 4830], chest, baseSU, purpleRupee, [boomerang, [ironBoots, magicArmor]], 'Blow out all of the 3 torches with the boomerang to make the chest appear.'),
            new Check([-206, 4870], chest, baseSU, purpleRupee, [lantern, [ironBoots, magicArmor]], 'Light up all the 3 torches with the lantern to make the chest appear.'),
            new Check([-741, 4977], dragonflyM, bugsSU, undefined, undefined, 'This ♂ Dragonfly is hiding in the tall grass.'),
            new Check([-879, 6022], dragonflyF, bugsSU, undefined, undefined, 'This ♀ Dragonfly is on the side of the floating bridge. Drop down from the bridge to get it.'),
            new Check([-370, 6066], bottle, baseSU, undefined, [fishingRod], 'Cast the fishing in the small pond isolated by the bridge to catch the bottle.'),
            new Check([-372, 5801], heartPiece, baseSU, undefined, undefined, 'Go fishing with the canoe (20 rupees) and use the provided fishing rod to reel in the heart piece. You can also use the clawshot.'),
            new Check([-853, 6061], bombBag, giftsSU, undefined, [bow], 'Help Iza by blowing up all of the rocks blocking the river to receive the bomb bag.'),
            new Check([-904, 6064], giantBombBag, giftsSU, undefined, [bow], "Play Iza's Raging Rapids minigame and get atleast 25 points to obtain the giant bomb bag."),
            new Check([-4491, 4622], ladybugF, bugsSU, undefined, undefined, 'This ♀ Ladybug is in the grassy area next to the middle tree.'),
            new Check([-4572, 4909], ladybugM, bugsSU, undefined, undefined, 'This ♂ Ladybug is hiding in the flowers on the ground.'),
            new Check([-3917, 4177], goldenWolf, skillsSU, undefined, [shadowCrystal], "Summoned by the Upper Zora's River Howling Stone."),
            new Check([-3967, 5062], poeSoul, poesSU, undefined, [shadowCrystal], 'On the bridge at night.'),
            new Check([-4364, 4644], chest, baseSU, orangeRupee, [clawshot, shadowCrystal], '1. Clawshot the top of the target at the top of the right tower and climb up.<br>2. Transform into Wolf Link and cross the rope, then transform ' + 
                'back.<br>3. Slowly walk towards the ledge to hang from it, than hold left to crawl to the left platform.<br>4. Transform back into Wolf and cross the last rope to reach the chest.'),
            new Check([-4428, 4710], chest, baseSU, orangeRupee, [clawshot, spinner], '1. Clawshot the top of the target at the top of the right tower and drop down.<br>2. Use the spinner on the railing, than jump below to the chest.'),
            new Check([-4446, 4641], poeSoul, poesSU, undefined, [shadowCrystal], 'Near the middle of the stairs and appears at night.'),
            new Check([-4574, 3388], chest, baseSU, orangeRupee, [clawshot], "Use the clawshot on the vines and climb up completely on the platform. Then, grab the ledge to the left of the vines " +
                "and slide right until you reach the platform with the chest."),
            new Check([-4900, 3050], smallChest, baseSU, yellowRupee, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the lowest platform."),
            new Check([-4930, 3075], smallChest, baseSU, redRupee, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the 2nd lowest platform."),
            new Check([-4920, 3065], poeSoul, poesSU, undefined, [shadowCrystal], "Only appears at Night. Can be killed from the lowest platform with the small chest."),
            new Check([-4963, 3099], chest, baseSU, purpleRupee, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the 2nd highest platform."),
            new Check([-4978, 3120], chest, baseSU, heartPiece, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the highest platform."),
            new Check([-4998, 3137], chest, baseSU, orangeRupee, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the spinning platform. This chest refills everytime you reload Lake Hylia (Not in Rando)."),
            new Check([-5184, 3469], smallChest, baseSU, purpleRupee, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the right statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"),
            new Check([-5184, 3536], chest, baseSU, orangeRupee, undefined, "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the left statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"),
            new Check([-4430, 4591], goldenWolf, skillsSU, undefined, [shadowCrystal], 'Summoned by the Faron Woods Howling Stone.'),
            new Check([-4905, 3923], heartPiece, giftsSU, undefined, [shadowCrystal], 'Play the Plumm Fruit Balloon Minigame by howling with hawk grass and get 10000 or more to obtain the heart piece.'),
            new Check([-163, 4849], bombBag, giftsSU, undefined, [bombBag, [ironBoots, magicArmor]], 'Blow up the rock in the middle of the room with water bombs and talk to the Goron that comes out of it.'),
            new Check([-475, 4844], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'Behind the waterfall, use Midna jumps to get there.'),
            new Check([-650, 4949], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'In front of the small chest.'),
            new Check([-2598, 4901], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'On the bridge.'),
            new Check([-1024, 5870], poeSoul, poesSU, undefined, [shadowCrystal], poeNightText + 'In between the tall grass.'),
            new Check([-5656, 3789], chest, baseSU, purpleRupee, [bombBag, [bow, boomerang], clawshot], 'Blow up the rocks that are elevated to reveal clawshot targets. Clawshot all the targets until you reach the chest.'),
            new Check([-5691, 3795], poeSoul, poesSU, undefined, [bombBag, [bow, boomerang], clawshot, shadowCrystal], 'Appears only at Night. On the left of the chest.'),
            new Check([-5539, 3312], poeSoul, poesSU, undefined, [shadowCrystal], 'Appears only at Night. In the middle of the tall grass.'),
            new Check([-5100, 3989], poeSoul, poesSU, undefined, [shadowCrystal], 'Appears only at Night. Out in the open.'),
            new Check([-5509, 2724], poeSoul, poesSU, undefined, [shadowCrystal], 'Appears only at Night. On the left of the watchtower.'),
            new Check([-4656, 2886], poeSoul, poesSU, undefined, [shadowCrystal], "Appears only at Night. Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the platform under Fowl's house."),
            new Check([-3952, 4594], heartPiece, giftsSU, undefined, undefined, "Donate 1000 total rupees (500 total rupees in Rando) to Charlo to receive the heart piece."),
            new Check([-5460, 2690], aurusMemo, giftsSU, undefined, undefined, "Climb the tower with the ladder and talk to Auru to obtain the memo."),
            new Check([-3349, 3595], chest, baseSU, heartPiece, [[bombBag, ballAndChain], spinner], 'Destroy the boulders blocking the way, than use the spinner ramps to reach the chest.'),
            new Check([-4314, 3790], poeSoul, poesSU, undefined, [shadowCrystal], 'Appears only at Night. In the middle of the ruins.'),
            new Check([-3946, 4924], smallChest, baseSU, redRupee, [renadosLetter, invoice, shadowCrystal], 'After giving the doctor the Invoice, push the box hiding the medecine scent, and climb up until you are outside. Once there, the chest is on the balcony.'),
            new Check([-4676, 4714], woodenStatue, baseSU, undefined, [renadosLetter, invoice, shadowCrystal], 'After collecting the Medicine Scent and talking to Louise, defeat all of the Stallhounds at Night to receive the wooden statue.' + neverRandomized),
            new Check([-3701, 4709], goldenWolf, skillsSU, undefined, [shadowCrystal], 'Summoned by the Hidden Village Howling Stone.'),

            new FakeCheck([-852, 5918], howlingStone, skillsSU, [shadowCrystal], 'Summons the West Castle Town Golden Wolf. Is accessible while clearing the Lanayru Twilight.'),
            new FakeCheck([-5405, 3014], howlingStone, skillsSU, [shadowCrystal], 'Summons the Gerudo Desert Golden Wolf. Climb the ladder to reach it.'),
            new FakeCheck([-5458, 3876], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'Hidden between two larger stone structures.'),
            new FakeCheck([-4333, 3548], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open, right of the Howl Statue.'),
            new FakeCheck([-3637, 4089], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open, defeat the Bulblins to make it easier to destroy.'),
            new FakeCheck([-3412, 4111], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'Hidden in the corner.'),
            new FakeCheck([-2564, 4084], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open in the corner.'),
            new FakeCheck([-475, 4702], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'This boulder is in the tunnel from the top of the domain to the balcony.'),
            new FakeCheck([-477, 4725], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'This boulder is in the tunnel from the top of the domain to the balcony.'),
            new FakeCheck([-808, 5851], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'In the open near the howling stone.'),
            new FakeCheck([-4422, 4873], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], 'Out in the open.'),
            new FakeCheck([-123, 4793], rupeeBoulder, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'Underwater left of the throne. The rocks under it are worth lifting.'),
            new FakeCheck([-3816, 3385], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], '4 Blue Rupees = 20 Total Rupees. This is blocking the way to the spinner area.'),
            new FakeCheck([-2601, 3974], rupeeBoulder, notaRupeesSU, [[bombBag, ballAndChain]], '3 Yellow Rupees = 30 Total Rupees. This is blocking the way to the spinner area.'), 
            //All Underwater Rupee Rocks

            new NonCheck([-4268, 3152], horseGrass, 'grass'),
            new NonCheck([-5218, 2926], hawkGrass, 'grass'),
            new NonCheck([-4901, 3895], hawkGrass, 'grass'),
            new NonCheck([-614, 5775], beeLarva, 'bottle'),
            new NonCheck([-5488, 3116], fairy, 'bottle'),
            new NonCheck([-5353, 3456], rarePotion, 'bottle'),
            //Zora's Domain Fishing
            //Lake Hylia Fishing
            //Howl Statue Lookout Crows (71 rupees)
            //Hyrule Field Tree East of bridge (28 rupees)
            //Hyrule Field Bug Tree Crows (32 rupees)
            //Lake Hylia bridge Crows (31 rupees)
            //Lake Hylia Fowl Tower Crows (73 rupees)
            //East Castle Town bridge Crows (33 rupees)
            //South Castle Town Crows (33 rupees)
            
            
            new Submap([-5259, 3502], cave, 'LanSpring.png', [485, 491], [
                new Check([-5210, 3566], smallChest, baseSU, blueRupee, [[ironBoots, magicArmor]], 'Sink down to get this underwater chest.'),
                new Check([-5197, 3360], smallChest, baseSU, yellowRupee, [[ironBoots, magicArmor]], 'Sink down to get this underwater chest.'),
                new Check([-5558, 3491], smallChest, baseSU, blueRupee, [clawshot], 'Clawshot the vines on either side, open the door and walk to the chest on the right.'),
                new Check([-5538, 3542], smallChest, baseSU, qI(bombs, 5), [clawshot], 'Clawshot the vines on either side, open the door and walk to the chest on the left.'),
                new Check([-5559, 3526], chest, baseSU, heartPiece, [clawshot, lantern], 'Light the 2 torches in the room to make the chest appear.'),

                new FakeCheck([-5322, 3394], rupeeBoulder, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'This rupee boulder is underwater.'),
                new FakeCheck([-5171, 3447], rupeeBoulder, notaRupeesSU, [bombBag, [ironBoots, magicArmor]], 'This rupee boulder is underwater.'),
                //Fishing
            ]),
            new FlooredSubmap([-4147, 4586], door, 'Agitha', [
                [[255, 300], [
                    new Check([-3900, 4370], antM, giftsSU, undefined, [antM], ''),
                    new Check([-3900, 4430], antF, giftsSU, undefined, [antF], agithaText),
                    new Check([-3900, 4550], dayflyM, giftsSU, undefined, [dayflyM], agithaText),
                    new Check([-3900, 4610], dayflyF, giftsSU, undefined, [dayflyF], agithaText),
                    new Check([-3900, 4730], beetleM, giftsSU, undefined, [beetleM], agithaText),
                    new Check([-3900, 4790], beetleF, giftsSU, undefined, [beetleF], agithaText),
    
                    new Check([-4025, 4370], mantisM, giftsSU, undefined, [mantisM], agithaText),
                    new Check([-4025, 4430], mantisF, giftsSU, undefined, [mantisF], agithaText),
                    new Check([-4025, 4550], stagBeetleM, giftsSU, undefined, [stagBeetleM], agithaText),
                    new Check([-4025, 4610], stagBeetleF, giftsSU, undefined, [stagBeetleF], agithaText),
                    new Check([-4025, 4730], pillbugM, giftsSU, undefined, [pillbugM], agithaText),
                    new Check([-4025, 4790], pillbugF, giftsSU, undefined, [pillbugF], agithaText),
    
                    new Check([-4150, 4370], butterflyM, giftsSU, undefined, [butterflyM], agithaText),
                    new Check([-4150, 4430], butterflyF, giftsSU, undefined, [butterflyF], agithaText),
                    new Check([-4150, 4550], ladybugM, giftsSU, undefined, [ladybugM], agithaText),
                    new Check([-4150, 4610], ladybugF, giftsSU, undefined, [ladybugF], agithaText),
                    new Check([-4150, 4730], snailM, giftsSU, undefined, [snailM], agithaText),
                    new Check([-4150, 4790], snailF, giftsSU, undefined, [snailF], agithaText),
    
                    new Check([-4275, 4370], phasmidM, giftsSU, undefined, [phasmidM], agithaText),
                    new Check([-4275, 4430], phasmidF, giftsSU, undefined, [phasmidF], agithaText),
                    new Check([-4275, 4550], grasshopperM, giftsSU, undefined, [grasshopperM], agithaText),
                    new Check([-4275, 4610], grasshopperF, giftsSU, undefined, [grasshopperF], agithaText),
                    new Check([-4275, 4730], dragonflyM, giftsSU, undefined, [dragonflyM], agithaText),
                    new Check([-4275, 4790], dragonflyF, giftsSU, undefined, [dragonflyF], agithaText),
                ]],
                [[255, 244], []]
            ]),
            new Submap([-4057, 4837], door, 'Jovani.png', [403, 259], [
                new Check([-4193, 5102], poeSoul, poesSU, undefined, [shadowCrystal], 'Enter the house using the dig spot to get this poe'),
                new Check([-3905, 4994], tearsPotion, giftsSU, undefined, [shadowCrystal], 'Talk to Jovani after collecting 20 poe souls to receive this bottle with Great Fairy Tears'),
            ]),
            new Submap([-4035, 4573], door, 'STAR.png', [404, 304], [
                new Check([-4113, 4433], bigQuiver, giftsSU, undefined, [clawshot], 'Pay 10 rupees to play the first STAR minigame and win it to receive the big quiver.'),
                new Check([-4128, 4479], giantQuiver, giftsSU, undefined, [doubleClawshot], 'Pay 15 rupees to play the second STAR minigame and win it to receive the giant quiver.')
            ]), 
            new Submap([-4060, 4759], door, 'CastleTownMaloMart.png', [266, 228], [
                new Check([-4231, 4706], magicArmor, shopSU, undefined, undefined, 'After repairing the Castle Town bridge for 1000 rupees, pay 200 rupees (2000 rupees if you did not do the Goron Springwater ' +
                    'Rush quest) to open the Castle Town Branch of Malo Mart. You can then buy the Magic Armor for 598 rupees. This item costs 1798 rupees total (or 3598 rupees without GSR).'),
                // Add Entire Shop
            ]),
            new FlooredSubmap([-4141, 4795], door, 'Telma', [
                [[440, 371], [
                    new Check([-4100, 5140], invoice, giftsSU, undefined, [renadosLetter], "Give Renado's Letter to Telma to receive the Invoice. " + neverRandomized),
                    new NonCheck([-4331, 4440], postman, 'bottle') //Postman
                ]],
                [[358, 488], []]
            ]),
            new Submap([-3733, 3820], grotto, g1.img, g1.imgSize, [
                new Check([-3718, 3801], chest, baseSU, orangeRupee, [clawshot, shadowCrystal], "Use the clawshot on the vines to reach the grotto entrance. Once inside, " + 
                    "defeat all the helmasaurs to make the chest appear.")
            ]),
            new Submap([-2121, 4843], grotto, g4.img, g4.imgSize, [
                new Check([-1830, 4720], chest, baseSU, purpleRupee, [shadowCrystal, lantern], 'Light the 3 torches separated by the wooden barriers to make the chest appear.'),
                //Defeat skulltulas for rupees (35 rupees)
            ]),
            new Submap([-2605, 4189], grotto, g1.img, g1.imgSize, [
                new Check([-2378, 4211], poeSoul, poesSU, undefined, [shadowCrystal], 'Right of the elevated platform.'),
                new Check([-2351, 4111], poeSoul, poesSU, undefined, [shadowCrystal], 'On the elevated platform.'),
            ]),
            new Submap([-2812, 5187], grotto, g3.img, g3.imgSize, [
                //Red and blue chus
            ]),
            new Submap([-5696, 3751], grotto, g4.img, g4.imgSize, [
                new Check([-5400, 3629], chest, baseSU, orangeRupee, [bombBag, [bow, boomerang], clawshot, shadowCrystal], 'Defeat all the Bubbles to make the chest appear.')
            ]),
            new Submap([-5499, 3045], grotto, g5.img, g5.imgSize, [
                new Check([-5237, 3005], chest, baseSU, orangeRupee, [shadowCrystal], 'Defeat all the Toadpolis to make the chest appear. Tip: You can reflect their projectiles with Wolf Link.'),
                new NonCheck([-5191, 2990], beeLarva, 'bottle'),
                //Fishing spot
            ]),
            new Submap([-4614, 2875], grotto, g5.img, g5.imgSize, [ //No fish in this grotto
                new Check([-4354, 2828], chest, baseSU, orangeRupee, [shadowCrystal, [woodenSword, bombBag]], "The grotto is on the platform under Fowl's house. Play the Flight By Fowl minigame (20 rupees) and use " + 
                    "the Cucco to reach the platform. Once inside, defeat all 4 Shellblades with a sword or water bombs to make the chest appear.")
            ]),
            new Submap([-4551, 4937], grotto, g5.img, g5.imgSize, [
                new Check([-4292, 4907], chest, baseSU, orangeRupee, [shadowCrystal], 'Defeat all the Tektites to make the chest appear.'),
                new NonCheck([-4238, 4905], beeLarva, 'bottle'),
                //Fishing spot
            ]),
            new Submap([-5546, 3134], cave, 'LakeLanternCave.png', [658, 585], [
                new Check([-5696, 3100], smallChest, baseSU, qI(bombs, 5), [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5665, 3145], smallChest, baseSU, yellowRupee, [[bombBag, ballAndChain]], 'Destroy the rock in the back and defeat the Keese.'),
                new Check([-5631, 3200], smallChest, baseSU, redRupee, [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5632, 3440], poeSoul, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'Near the torch in the middle of the room.'),
                new Check([-5631, 3487], smallChest, baseSU, qI(arrows, 10), [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5381, 3422], smallChest, baseSU, redRupee, [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5418, 3185], chest, baseSU, orangeRupee, [[bombBag, ballAndChain], lantern], 'Light the 2 torches to make the chest appear.'),
                new Check([-5386, 3183], smallChest, baseSU, redRupee, [[bombBag, ballAndChain]], 'Destroy the rock on the right to reveal the chest.'),
                new Check([-5308, 3098], smallChest, baseSU, qI(bombs, 5), [[bombBag, ballAndChain]], 'Destroy the rock in the back and defeat the Tektites.'),
                new Check([-5375, 2828], smallChest, baseSU, qI(arrows, 10), [[bombBag, ballAndChain]], 'Destroy the rock on the left and defeat the Keese.'),
                new Check([-5341, 2779], chest, baseSU, purpleRupee, [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5260, 3181], poeSoul, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'Near the torch in the middle of the room.'),
                new Check([-5229, 3182], chest, baseSU, purpleRupee, [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5262, 3231], smallChest, baseSU, qI(bombs, 10), [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5303, 3268], smallChest, baseSU, qI(seeds, 50), [[bombBag, ballAndChain]], 'Destroy the rock on the left to reveal the chest.'),
                new Check([-5333, 3426], chest, baseSU, orangeRupee, [[bombBag, ballAndChain]], 'Destroy the rock in the back to reveal the chest.'),
                new Check([-5523, 3363], poeSoul, poesSU, undefined, [[bombBag, ballAndChain], shadowCrystal], 'At the entrance of the room.'),
                new Check([-5555, 3364], chest, baseSU, heartPiece, [[bombBag, ballAndChain], lantern], 'Light the 2 torches to make the chest appear.')
            ]),
            new Submap([-2025, 4818], cave, 'Ice Cave.png', [105, 369], [
                new Check([-1725, 4818], chest, baseSU, heartPiece, [ballAndChain], 'Complete the 3 block puzzles to open all the gates and access the chest.')
            ])
        ]),    
        new Province(castlePoints, true, [-3584, 5440], []) // Castle
    ];
   
    dungeons = [
        new Dungeon([-6915, 4098], [-6950, 4900], dungeonStar, 'Forest Temple', [2810, 2704], 3, [
            [ // 1F
                new Check([-5935, 4317], smallChest, baseSU, yellowRupee, [[slingshot, bow, clawshot, boomerang]], 'Use a long ranged item to defeat the spiders and climb to the chest.'),
                new Check([-5281, 4240], smallChest, baseSU, redRupee, undefined, 'Use the Bombling on the right to blow up the rock blocking the chest.'),
                new Check([-5260, 4294], chest, baseSU, dungeonMap, [[lantern, boomerang]], 'Use the lantern to light the 4 torches that make the platforms to the chest rise or take a long detour' +
                    'by the boomerang bridges to reach the chest.'),
                new FakeCheck([-5250, 4565], ooccoo, ooccooSU, undefined, 'Use the Bombling to blow up the rocks, than pick up or break the pot containing Ooccoo.'),
                new Check([-4710, 4812], chest, baseSU, smallKeyFT, undefined, 'Make your way across the windy bridge and open the chest on the left of the entrance.'),
                new FakeCheck([-5224, 5140], lockedDoor, lockedDoorSU, [smallKeyFT], 'Locked door'),
                new Check([-5445, 5129], chest, baseSU, yellowRupee, undefined, 'Swim to the opening and walk to the end to reach the chest.'),
                new Check([-5155, 5218], smallChest, baseSU, yellowRupee, undefined, 'The chest is under the wooden structure.'),
                new Check([-5624, 3749], smallKeyFT, baseSU, undefined, undefined, 'Defeat the Big Baba to obtain the key.'),
                new FakeCheck([-5869, 3747], lockedDoor, lockedDoorSU, [smallKeyFT], 'Locked door'),
                new Check([-5467, 3901], chest, baseSU, heartPiece, undefined, 'Defeat the Deku Like that blocks the way to access the chest.'),
                new Check([-5277, 3498], chest, baseSU, smallKeyFT, undefined, 'Bonk on the pillar to make the chest fall.'),
                new Check([-5224, 3241], smallChest, baseSU, redRupee, undefined, 'Climb the vines to reach the chest.'),
                new FakeCheck([-5309, 2943], lockedDoor, lockedDoorSU, [lantern, smallKeyFT], 'Locked door'),
                new Check([-4508, 4262], boomerang, baseSU, undefined, undefined, 'Defeat Ook to obtain the Gale Boomerang.'),
                new Check([-5304, 3050], chest, baseSU, heartPiece, [boomerang], 'Blow out all the torches to retract the platform blocking the chest.'),
                new Check([-5386, 4242], chest, baseSU, compass, [[boomerang, bow, clawshot]], 'Use a long ranged item to break the web holding the chest.'),
                new Check([-5439, 5042], bossChest, baseSU, bossKeyFT, [boomerang], 'Use the boomerang on the windmill pillars in this pattern: Bottom Right, Bottom Left, Top Right and Top Left.' + 
                    'This opens the gate to the boss key chest.'),
                new Check([-4322, 4342], chest, baseSU, smallKeyFT, [[boomerang, bombBag, clawshot]], 'Grab a bombling or use one of your own bombs to defeat the Deku Like and jump across the platforms.'),
                new FakeCheck([-4570, 5087], lockedDoor, lockedDoorSU, [boomerang, smallKeyFT], 'Locked door'),
                new Check([-4510, 5206], chest, baseSU, redRupee, undefined, 'Climb up the room by going in the back or simply get launched by the Tile Worm closest to the chest.'),
                new NonCheck([-3920, 4820], fairy, 'bottle'),
                new FakeCheck([-3858, 4868], lockedDoor, lockedDoorSU, [bossKeyFT], 'Locked door.'),
                new Check([-3773, 4842], heartContainer, baseSU, undefined, [bossKeyFT, [woodenSword, bombBag, ballAndChain, bow], [boomerang, clawshot]], 'Defeat Diababa to obtain the heart container.'),
                new Check([-3796, 4777], fusedShadow, baseSU, undefined, [bossKeyFT, [woodenSword, bombBag, ballAndChain, bow], [boomerang, clawshot]], 'Defeat Diababa to obtain the fused shadow.')

            ]
        ]),
        new Dungeon([-3660, 8193], [-3920, 8752], dungeonStar, 'Goron Mines', [2787, 2791], 3, [
            [ // 1F
                new Check([-5791, 4465], smallChest, baseSU, redRupee, undefined, 'Defeat the Torch Slug to have access to the chest.'),
                new Check([-5232, 4603], chest, baseSU, smallKeyGM, undefined, 'Defeat the Bulblins to easily reach the chest.'),
                new FakeCheck([-5052, 3966], lockedDoor, lockedDoorSU, [smallKeyGM], 'Locked door'),
                new Check([-5004, 3025], bossKeyGM0, giftsSU, undefined, undefined, 'Talk to goron elder Gor Amoto to obtain this part of the boss key.'),
                new Check([-4971, 2973], chest, baseSU, dungeonMap, undefined, 'The chest is behind the goron elder.'),
                new Check([-4971, 2941], smallChest, baseSU, redRupee, undefined, 'The small chest is behind the goron elder, on the platform.'),
                new FakeCheck([-5027, 3150], ooccoo, ooccooSU, undefined, 'Pick up the pot where Ooccoo is hiding for her to join you.'),
                new Check([-4913, 3891], chest, baseSU, heartPiece, [ironBoots], 'Follow the left path when you get on the ceiling to reach the chest.'),
            ],
            [ // 2F
                new Check([-4591, 4459], chest, baseSU, smallKeyGM, [[ironBoots, magicArmor]], 'Use the iron boots or the depleted magic armor to sink down to the underwater chest.'),
                new Check([-4526, 4441], smallChest, baseSU, redRupee, [ironBoots], 'Use the iron boots to follow the crystal path onto the platform where the chest lies.'),
                new Check([-4471, 4242], chest, baseSU, heartPiece, [ironBoots], 'Follow the crystal path and take a left to reach the upper platform.'),
                new FakeCheck([-4200, 4363], lockedDoor, lockedDoorSU, [smallKeyGM], 'Locked door'),
                new Check([-3898, 4270], smallChest, baseSU, smallKeyGM, undefined, 'Follow the left barrier to not get noticed by the Beamos and reach the chest.'),
                new Check([-3747, 4568], chest, baseSU, purpleRupee, [[ironBoots, magicArmor]], 'The chest is behind a breakable wooden barrier underwater. However, you can simply go above the barrier by swimming.'),
                new FakeCheck([-3833, 4669], lockedDoor, lockedDoorSU, [smallKeyGM], 'Locked door.'),
                new Check([-3736, 5491], bossKeyGM1, giftsSU, undefined, undefined, 'Talk to goron elder Gor Ebizo to obtain this part of the boss key.'),
                new Check([-3764, 5566], smallChest, baseSU, yellowRupee, undefined, 'Go behind Gor Ebizo, to the right and use the stairs to climb the small platform.'),
                new Check([-3896, 5243], smallChest, baseSU, yellowRupee, [ironBoots], 'Use the crystal path to reach the chest.'),
                new Check([-4550, 5060], chest, baseSU, bow, [ironBoots], 'Defeat Dangoro to gain access to the chest.'),
                new Check([-4786, 4930], chest, baseSU, compass, [bow], 'Defeat the Beamos and pull it to access the chest.'),
                new Check([-4787, 5495], bossKeyGM2, giftsSU, undefined, [bow], 'Defeat the beamos and pull it to have access to the room where Gor Liggs gives you a part of the boss key.'),
                new Check([-4783, 5585], chest, baseSU, purpleRupee, [bow], 'Defeat the beamos and pull it to have access to the room where the chest is, behind the goron elder.'),
                new Check([-5155, 4682], chest, baseSU, purpleRupee, [bow], 'Jump across to the platform to reach the chest.'),
                new Check([-3629, 4596], chest, baseSU, purpleRupee, [clawshot], 'Clawshot the vines from the door to the right of the room to reach the platform with the chest.'),
                new NonCheck([-3644, 4560], fairy, 'bottle'),
                new FakeCheck([-4170, 3847], lockedDoor, lockedDoorSU, [bossKeyGM], 'Locked door.'),
                new Check([-4252, 3815], heartContainer, baseSU, undefined, [bossKeyGM, bow], 'Defeat Fyrus to obtain the Heart Container.'),
                new Check([-4276, 3884], fusedShadow, baseSU, undefined, [bossKeyGM, bow], 'Defeat Fyrus to obtain the second Fused Shadow.')
            ]
        ]),
        new Dungeon([-4741, 3415], [-4960, 4208], dungeonStar, 'Lakebed Temple', [2905, 1750], 1, [
            [ // B2
                new Check([-4402, 5200], heartContainer, baseSU, undefined, [bossKeyLT, zoraArmor, bombBag, bow, clawshot, ironBoots, woodenSword], 'Defeat Morpheel to obtain the heart piece.'),
                new Check([-4520, 5050], fusedShadow, baseSU, undefined, [bossKeyLT, zoraArmor, bombBag, bow, clawshot, ironBoots, woodenSword], 'Defeat Morpheel to obtain the third and last Fused Shadow.')
            ],
            [ // B1
                new Check([-4327, 4363], chest, baseSU, redRupee, [zoraArmor, bombBag, bow], 'Make the water level rise once by clearing the top of the east portion of the temple to access the chest.'),
                new Check([-4021, 5724], chest, baseSU, qI(bombs, 5), [zoraArmor, bombBag, bow, ironBoots], 'Walk through the jet stream with the iron boots and take a left to the chest.'),
                new Check([-4186, 5665], chest, baseSU, redRupee, [zoraArmor, bombBag, bow, ironBoots], 'Walk away from the jet stream into the tunnel to reach the chest.'),
                new Check([-4592, 2725], bossChest, baseSU, bossKeyLT, [zoraArmor, bombBag, bow, clawshot, ironBoots], 'In the room above, hang from the clawshot target and descend towards the chest.'),
                //Fishing spot!
                new FakeCheck([-4414, 4362], lockedDoor, lockedDoorSU, [bossKeyLT], 'Boss Door.'),
                new NonCheck([-4365, 4362], fairy, 'bottle')
            ],
            [ // 1F
                new Check([-4518, 4517], smallChest, baseSU, qI(arrows, 20), [zoraArmor, bombBag, bow], 'The chest is accessible when you first get into the room, go down the stairs and take a left.'),
                new Check([-4224, 4513], chest, baseSU, dungeonMap, [zoraArmor, bombBag, bow], 'The chest is accessible when you first get into the room, manipulate the stairs to reach it.'),
                new Check([-4506, 5613], chest, baseSU, smallKeyLT, [zoraArmor, bombBag, bow], 'Knock down the stalactite with bomb arrows to make a platform to jump to the chest.'),
                new Check([-4181, 5694], chest, baseSU, smallKeyLT, [zoraArmor, bombBag, bow], 'Defeat the Chus to have an easier time accessing the chest.'),
                new FakeCheck([-4331, 5867], lockedDoor, lockedDoorSU, [smallKeyLT], 'Locked door'),
                new Check([-3736, 5469], chest, baseSU, clawshot, [zoraArmor, bombBag, bow, [ironBoots, clawshot]], 'Defeat Deku Toad to make it spit out the chest.'),
                new Check([-4299, 3311], smallChest, baseSU, qI(waterBombs, 10), [zoraArmor, bombBag, bow, clawshot], 'Jump on the hanging platform than shoot the clawshot at the target above the platform with the chest.'),
                new Check([-4718, 5483], chest, baseSU, heartPiece, [zoraArmor, bombBag, bow, clawshot], 'Once the water level is elevated in the room, press on the switch to open the gate and clawshot the target on the ' + 
                    'back wall to reach the chest. Clawshot the target on the ceiling to get back out.'),
                new Check([-4420, 2539], smallChest, baseSU, qI(bombs, 5), [zoraArmor, bombBag, bow, clawshot], 'In the section with the entrance to the long tunnel, swim up to find to chest.')
            ],
            [ // 2F
                new Check([-5509, 4199], smallChest, baseSU, qI(arrows, 20), [zoraArmor], 'The chest is between the 2 rock pillars'),
                new Check([-5601, 4339], smallChest, baseSU, qI(waterBombs, 10), [zoraArmor], 'The chest is on the right of the nearby rock pillar.'),
                new Check([-4950, 4501], smallChest, baseSU, qI(waterBombs, 10), [zoraArmor, bombBag, bow], 'Knock down the stalactites with bomb arrows and climb to the chest.'),
                new FakeCheck([-4490, 4552], ooccoo, ooccooSU, [zoraArmor, bombBag, bow], 'Pick up or break the pot where Ooccoo is hiding.'),
                new FakeCheck([-4372, 4666], lockedDoor, lockedDoorSU, [smallKeyLT], 'Locked door.'),
                new Check([-4487, 5223], smallChest, baseSU, qI(bombs, 5), [zoraArmor, bombBag, bow], 'On the left when you enter the room from the lobby.'),
                new Check([-4585, 5497], chest, baseSU, smallKeyLT, [zoraArmor, bombBag, bow], 'Go around the room and cross by the middle section to reach the chest.'),
                new FakeCheck([-4425, 6048], lockedDoor, lockedDoorSU, [smallKeyLT], 'Locked door.'),
                new NonCheck([-4533, 5253], fairy, 'bottle'),
                new Check([-4373, 4363], chest, baseSU, heartPiece, [zoraArmor, bombBag, bow, clawshot], 'The chest is on the chandelier hanging from the ceiling, use the clawshot to get there.'),
                new Check([-4223, 3363], smallChest, baseSU, redRupee, [zoraArmor, bombBag, bow, clawshot], 'Once on the highest vine platform, clawshot the target above the platform where the chest is.'),
                new Check([-4212, 3451], chest, baseSU, qI(bombs, 20), [zoraArmor, bombBag, bow, clawshot], 'After activating the water, go back the way you came from through the waterwheel to find the chest.'),
                new Check([-4583, 2965], chest, baseSU, redRupee, [zoraArmor, bombBag, bow, clawshot, ironBoots], 'Defeat the enemies underwater to have easier access to the chest.'),
                new Check([-4561, 3301], smallChest, baseSU, redRupee, [zoraArmor, bombBag, bow, clawshot], 'Go through the middle room accross the spinning gears to get the chest.'),

            ],
            [], // 3F
            [ // 4F
                new Check([-4330, 6166], smallChest, baseSU, qI(bombs, 10), [zoraArmor, bombBag, bow], 'Go to the top of the room to reach the chest.'),
                new Check([-4410, 2359], smallChest, baseSU, qI(bombs, 10), [zoraArmor, bombBag, bow, clawshot], 'Go to the top of the room using the clawshot targets to reach the chest.'),
                new Check([-4362, 2108], chest, baseSU, compass, [zoraArmor, bombBag, bow, clawshot], 'Clawshot the target on the wall behind the chest to reach it.'),
                new Check([-4378, 6427], chest, baseSU, purpleRupee, [zoraArmor, bombBag, bow, clawshot], 'Clawshot the target on the wall behind the chest to reach it.')

            ],
        ]),
        new Dungeon([-3865, 605], [-4500, 1488], dungeonStar, "Arbiter's Grounds", [2009, 1691], 1, [
            [ // B2
                new FakeCheck([-4325, 4791], lockedDoor, lockedDoorSU, [smallKeyAG], 'Locked door'),
                new FakeCheck([-5201, 4240], ooccoo, ooccooSU, undefined, 'Pick up or break the pot where Ooccoo is hiding for her to join you.'),
                new Check([-3598, 4239], chest, baseSU, spinner, [shadowCrystal, [clawshot, bow, boomerang]], 'Defeat Death Sword to obtain the Spinner.'),
                new Check([-4490, 3311], smallChest, baseSU, qI(bombs, 10), [spinner], 'Use the spinner to float above the quicksand and reach the chest.'),
                new Check([-4486, 3078], smallChest, baseSU, redRupee, [spinner], 'From the previous chest, use the spinner to float above the quicksand and reach the chest.'),
                new Check([-4307, 2997], smallChest, baseSU, yellowRupee, [spinner], 'Hidden under the spinner ramp, use the spinner to float above the quicksand and reach the chest.'),
                new Check([-4369, 3666], chest, baseSU, heartPiece, [spinner], 'Use the spinner ramp and defeat the Stalfos to reach this chest.'),
            ],
            [ // B1
                new Check([-4626, 4836], smallChest, baseSU, smallKeyAG, [shadowCrystal], 'Dig the sand spot to reveal the lever, than pull it to access the stairs. Than, spin the room to gain access to the chest.'),
                new Check([-4257, 4786], chest, baseSU, smallKeyAG, undefined, 'Enter the tunnel from the entrance with no spikes, than go to the end of it to find the chest.'),
                new Check([-4156, 3605], smallChest, baseSU, yellowRupee, [spinner], 'Use the spinner ramp and defeat the 2 stalfos that are guarding the chest to open it.'),
            ],
            [ // 1F
                new Check([-5336, 3974], chest, baseSU, smallKeyAG, [clawshot], 'Break the wooden barrier and jump across to the chest.'),
                new NonCheck([-5341, 4446], lanternOil, 'bottle'),
                new FakeCheck([-5277, 4323], lockedDoor, lockedDoorSU, [smallKeyAG], 'Locked door'),
                new Check([-4763, 4329], poeSoul, poesSU, undefined, [shadowCrystal], 'The first of the 4 poes, waits in the middle of the room after the cutscene.'),
                new Check([-4562, 4481], chest, baseSU, heartPiece, undefined, 'Walk across the platforms or use the clawshot to have a way back.'),
                new Check([-4561, 4171], chest, baseSU, dungeonMap, undefined, 'Walk across the quicksand using the sinking platform to reach the chest.'),
                new Check([-4576, 3840], smallChest, baseSU, redRupee, undefined, 'Upon entering the room, follow the path to the right to reach the chest.'),
                new Check([-4337, 4831], poeSoul, poesSU, undefined, [shadowCrystal, clawshot], 'When the room below is spun, clawshot up through the opening, than go in the poe room to defeat it.'),
                new FakeCheck([-4766, 5081], lockedDoor, lockedDoorSU, [smallKeyAG], 'Locked door'),
                new Check([-4920, 3766], chest, baseSU, redRupee, undefined, 'Pull the chain to raise the chandelier, then cross under it to reach the chest.'),
                new Check([-4707, 3322], smallChest, baseSU, qI(bombs, 5), undefined, 'Break the wooden barrier and go to the north-east to reach the chest.'),
                new Check([-4767, 3108], smallChest, baseSU, qI(bombs, 5), undefined, 'Break the wooden barrier and go to the west area to reach the chest.'),
                new Check([-4156, 3911], bossChest, baseSU, bossKeyAG, [spinner], 'After clearing the room with the spinner ramps, access to the chest is granted upon entering the next room.'),
            ],
            [ // 2F
                new Check([-5358, 5475], chest, baseSU, compass, undefined, 'Walk up the stairs to find the chest in the area behind the statue.'),
                new Check([-5241, 5831], chest, baseSU, smallKeyAG, undefined, 'Break the wooden barrier than defeat the Gibdo to easily open the chest.'),
                new FakeCheck([-5240, 5251], lockedDoor, lockedDoorSU, [smallKeyAG], 'Locked door'),
                new Check([-5240, 5021], poeSoul, poesSU, undefined, [shadowCrystal], 'Dig to reveal a lever, than pull it to gain access to the room where the poe awaits.'),
                new Check([-4883, 4834], smallChest, baseSU, smallKeyAG, [smallKeyAG], 'The chest is below the ring platform.'),
                new FakeCheck([-4767, 4551], lockedDoor, lockedDoorSU, undefined, 'Locked door'),
                new Check([-5186, 3780], poeSoul, poesSU, undefined, [shadowCrystal], 'Defeat the poe easily by using the Midna attack.'),
            ],
            [], // 3F 
            [ // 4F
                new NonCheck([-3828, 4100], fairy, 'bottle'),
                new FakeCheck([-4276, 4326], lockedDoor, lockedDoorSU, [bossKeyAG], 'Locked door'),
                new Check([-4928, 4384], heartContainer, baseSU, undefined, [bossKeyAG, spinner, [woodenSword, bow, bombBag, ballAndChain, shadowCrystal]], 'Defeat Stallord to obtain the Heart Container.'),
                new Check([-4726, 4334], mirrorShard, baseSU, undefined, [bossKeyAG, spinner, [woodenSword, bow, bombBag, ballAndChain, shadowCrystal]], 'Defeat Stallord to obtain the Dungeon Reward.'),

            ],
        ]),
        new Dungeon([-2626, 1229], [-2960, 2112], dungeonStar, 'Snowpeak Ruins', [1431, 1733], 3, [
            [ // 1F                  
                new Check([-6017, 4105], smallChest, baseSU, redRupee, [ballAndChain], "Break the armor with the Ball and Chain to reveal the chest."),
                new Check([-5883, 4428], smallChest, baseSU, yellowRupee, [ballAndChain], "Break the armor with the Ball and Chain to reveal the chest."),
                new Check([-4369, 5305], chest, baseSU, pumpkin, undefined, "Defeat the 2 Chilfos to unlock the door and gain access to the chest."),
                new Check([-4942, 4533], smallChest, baseSU, redRupee, undefined, "Near the wall, defeat the Wolfos for easier access."),
                new Check([-3611, 4265], chest, baseSU, cheese, [ballAndChain], "Break the ice blocks to gain access to the chest."),
                new Check([-4072, 4270], ballAndChain, baseSU, undefined, [[bombBag, ballAndChain]], "Defeat Darkhammer to obtain the Ball and Chain."),
                new Check([-4495, 4530], smallChest, baseSU, smallKeySR, [shadowCrystal], "Dig the spot where the chest is poking out of."),
                new FakeCheck([-4239, 4797], lockedDoor, lockedDoorSU, [smallKeySR], 'Locked door.'),
                new Check([-4015, 3896], smallChest, baseSU, qI(bombs, 5), [[bombBag, ballAndChain]], "Use the cannon or the ball and chain to break the ice that is blocking the chest."),
                new Check([-4814, 3397], smallChest, baseSU, redRupee, undefined, "Jump across the wooden planks to reach the chest."),
                new Check([-4926, 3578], chest, baseSU, compass, undefined, "Jump across the wooden planks to reach the chest."),
                new Check([-4462, 3961], smallChest, baseSU, smallKeySR, [shadowCrystal], "Dig twice on the shiny spot to reveal the chest. The shiny spot is not visible without the compass."),
                new Check([-4943, 4269], smallChest, baseSU, qI(bombs, 5), [[bombBag, ballAndChain]], "Use the cannon or the ball and chain to break the ice that is blocking the chest."),
                new FakeCheck([-5381, 5064], ooccoo, ooccooSU, undefined, "Pick up the pot where Ooccoo is hiding."),
                new Check([-5373, 3541], chest, baseSU, heartPiece, [ballAndChain], "Break the damaged floor and jump down to chest.<br>Glitch: LJA from the other entrance of the room to the chest."),
                new Check([-5576, 4264], poeSoul, poesSU, undefined, [shadowCrystal], "The poe is above the ice in the open."),
                new Check([-4157, 3214], smallChest, baseSU, redRupee, [ballAndChain], "Break the ice in front of the chest to reveal it."),
                new Check([-6017, 4420], poeSoul, poesSU, undefined, [ballAndChain, shadowCrystal], "Break the armor with the Ball and Chain to reveal the poe."),
                new Check([-5072, 4316], dungeonMap, giftsSU, undefined, undefined, "Talk to Yeta to obtain the dungeon map."),
                new FakeCheck([-4611, 3842], lockedDoor, lockedDoorSU, [smallKeySR], "Locked door"),
                new FakeCheck([-5883, 4119], orangeRupee, notaRupeesSU, [ballAndChain], 'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'),
                new FakeCheck([-3767, 4348], orangeRupee, notaRupeesSU, [ballAndChain],  'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'),
                new NonCheck([-5141, 4911], superbSoup, 'bottle')
            ],
            [ // 2F
                new Check([-4563, 3408], chest, baseSU, smallKeySR, [ballAndChain], "Swing the chandelier with the Ball and Chain to reach the chest."),
                new FakeCheck([-5366, 3839], lockedDoor, lockedDoorSU, [smallKeySR], 'Locked door'),
                new Check([-5833, 4268], chest, baseSU, heartPiece, [ballAndChain], "Swing from chandelier to chandelier to reach the chest.<br>Tip: Hit the last chandelier when yours is almost at the furthest from the chest."),
                new Check([-3854, 3400], chest, baseSU, bedroomKey, [ballAndChain, bombBag], "Defeat all the Chilfos to unlock the door and access the chest."),
                new Check([-5198, 5214], poeSoul, poesSU, undefined, [ballAndChain, shadowCrystal], "Break the ice blocks with the Ball and Chain to reveal the poe."),
                new Check([-4392, 5147], smallChest, baseSU, smallKeySR, [clawshot, ballAndChain], "Swing from the chandeliers to reach the chest."),
                new FakeCheck([-5148, 4597], lockedDoor, lockedDoorSU, [smallKeySR], 'Locked door.')
            ],
            [ // 3F
                new FakeCheck([-4350, 4268], lockedDoor, lockedDoorSU, [bedroomKey], 'Boss key door'),
                new Check([-3963, 4358], heartContainer, baseSU, undefined, [bedroomKey, bombBag, ballAndChain], "Defeat Blizzeta to obtain the Heart Container."),
                new Check([-4066, 4170], mirrorShard, baseSU, undefined, [bedroomKey, bombBag, ballAndChain], "Defeat Blizzeta and leave the dungeon via the Midna warp to obtain the Mirror Shard.")
            ]
        ]), 
        new Dungeon([-6618, 3681], [-6580, 4425], dungeonStar, 'Temple of Time', [1169, 1587], 3, [
            [ // 1F
                new Check([-5497, 4635], chest, baseSU, smallkeyTT, [lantern], 'Light the 2 torches to make the chest appear.'),
                new NonCheck([-4274, 4301], fairy, 'bottle'),
                new FakeCheck([-4197, 4350], lockedDoor, lockedDoorSU, [bossKeyTT], 'Boss Door.'),
                new Check([-3880, 4480], heartContainer, baseSU, undefined, [bossKeyTT, redDominionRod, bow], 'Defeat Armogohma to obtain the Heart Container.'),
                new Check([-3880, 4350], mirrorShard, baseSU, undefined, [bossKeyTT, redDominionRod, bow], 'Defeat Armogohma to obtain the Mirror Shard.'),
            ],
            [ // 2F
                new FakeCheck([-5725, 4352], ooccoo, ooccooSU, undefined, 'After opening the chest, Ooccoo will wait for you to join her at the top of the stairs.'),
                new FakeCheck([-5842, 4352], lockedDoor, lockedDoorSU, [smallkeyTT], 'Locked door.'),
                new Check([-6173, 4351], smallChest, baseSU, qI(arrows, 30), undefined, 'Put a pot on the pressure plate in the middle of the room to open the gate and gain access to the chest.'),

            ],
            [ // 3F
                new Check([-5750, 5148], chest, baseSU, dungeonMap, undefined, 'Defeat the Armos to make the chest appear.'),
                new Check([-5818, 5015], smallChest, baseSU, redRupee, undefined, 'Climb up to reach the ledge where the chest is to reach it.'),
                new Check([-5453, 3966], poeSoul, poesSU, undefined, [redDominionRod, shadowCrystal], 'Break the barrier with the Hammer Statue or put an Iron Pot on the pressure plate behind the gate to get the poe.'),
            ],
            [], // 4F            
            [ // 5F
                new Check([-5956, 4149], chest, baseSU, smallkeyTT, [spinner], 'Defeat the 2 Armos to make the chest appear.'),
                new Check([-6244, 4351], smallChest, baseSU, redRupee, [spinner], 'You will find this chest in the back of the room, on the elevated ledge.'),
                new FakeCheck([-5147, 4350], lockedDoor, lockedDoorSU, [smallkeyTT], 'Locked door.'),
                new Check([-4977, 3945], chest, baseSU, compass, [spinner, [bow, clawshot, ballAndChain]], 'Hit the crystal twice to reach the chest: Once when you are at sword range, the other when you are halfway across the room.'),
                new Check([-5054, 3343], chest, baseSU, heartPiece, [spinner, bow, redDominionRod], 'Use the Dominion Rod on the Iron Pot to make it step on the pressure plate, disabling the electricity and granting access to the chest.'),
                new Check([-5956, 4566], chest, baseSU, heartPiece, [spinner, redDominionRod], 'Throw 2 Iron Pots into the railings in the back of the room, and make them fall onto the 2 pressure plates to make the chest appear.')
            ],
            [ // 6F
                new Check([-5319, 4374], chest, baseSU, purpleRupee, [spinner, bow], 'Defeat All the spiders in the room (Baby Gohmas and Young Gohmas) to make the chest appear.'),
            ], 
            [ // 7F
                new Check([-5386, 4591], poeSoul, poesSU, undefined, [spinner, bow, clawshot, shadowCrystal], 'After reaching the end of the spinner track, the poe is on the left.'),
                new Check([-5654, 4496], smallChest, baseSU, redRupee, [spinner, bow, clawshot], 'Follow the right edge until you reach the chest'),
                new Check([-5452, 5081], smallChest, baseSU, redRupee, [spinner, bow, clawshot], 'Clawshot the target on the ceiling to reach the chest.'),
                new Check([-5451, 4960], bossChest, baseSU, bossKeyTT, [spinner, bow, clawshot], 'Use the 2 Iron Pots and the 2 Helmasaur Shells on the 4 elevated pressure plates to open the gate that is blocking the chest.'),
                new Check([-6178, 4981], chest, baseSU, smallkeyTT, [spinner, bow], 'Avoid the traps and go behind the sharp pendulum to reach the chest.'),

            ],
            [ // 8F
                new Check([-5383, 4976], chest, baseSU, purpleRupee, [spinner, bow], 'Defeat all the Baby Gohmas to make the chest appear.'),
                new FakeCheck([-5511, 4545], lockedDoor, lockedDoorSU, [smallkeyTT], 'Locked door.'),
                new Check([-5511, 3804], chest, baseSU, redDominionRod, [spinner, bow, woodenSword],'Defeat the Darknut to open the gate that is blocking access to the chest.' )
            ]
        ]),
        new Dungeon([-5306, 3144], [-5472, 3840], dungeonStar, 'City in the Sky', [0, 0], 0, [
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
        new Dungeon([-3636, 602], [-3800, 1472], mirror, 'Palace of Twilight', [0, 0], 3, [ 
            [ // 1F

            ],
            [ // 2F

            ],
            [ // 3F

            ],
            [ // 4F

            ]
        ]),
        new Dungeon([-3250, 4712], [0,0], castle, 'Hyrule Castle', [0, 0], 3, [
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
    map.eachLayer(function(_){
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
        menu.style.display = "flex";
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
        menu.style.display = "none";
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
function showTrackerSubmenu(submenuID) {
    let menu = document.getElementById(submenuID);
    menu.style.display = "flex";
    menu.style.visibility = "visible";
    let tracker = document.getElementById('tracker');
    tracker.style.filter = "brightness(25%)";
    tracker.submenuID = submenuID;
    document.getElementById('traX').style.right = "0";
    let children = tracker.children;
    for (let i = 0; i < children.length; ++i) 
        children[i].classList.add('disabled');
    setTimeout(function () {
        tracker.addEventListener('click', hideTrackerSubmenuHandler); 
    }, 100);  
}   
function hideTrackerSubmenu(submenuID) {
    let menu = document.getElementById(submenuID);
    menu.style.display = "none";
    menu.style.visibility = "hidden";
    let tracker = document.getElementById('tracker');
    tracker.style.filter = "none";
    document.getElementById('traX').style.right = null;
    let children = tracker.children;
    for (let i = 0; i < children.length; ++i) 
        children[i].classList.remove('disabled');
    tracker.removeEventListener('click', hideTrackerSubmenuHandler);
}
function hideTrackerSubmenuHandler() {
    hideTrackerSubmenu(this.submenuID)
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
    let trackerItems = document.getElementsByClassName('titem');
    for (let i = 0; i < trackerItems.length; ++i)
        trackerItems[i].dispatchEvent(new MouseEvent('auxclick', { button: 1 }));
    if(settingIsChecked('trackerS'))
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