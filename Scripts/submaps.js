class SubmapFloor {
    constructor(floorImage, label, contents) {
        if (floorImage instanceof ImageWrapper)
            this.image = this.image;
        else
            this.image = images.get(floorImage + '.png');
        this.label = label;
        let flagContents = [];
        for (let c of contents) {
            if(typeof c === 'string')
                flagContents.push(flags.get(c));
            else 
                flagContents.push(c);
        }
        this.contents = flagContents;
    }
    set() {
        for (let c of this.contents) {
            if (c instanceof Flag)
                c.set();
        }
    }
    setShown() {
        for (let c of this.contents) {
            if (c instanceof Flag && c.isShown())
                c.setMarker();
        }
    }
    unset() {
        for (let c of this.contents) {
            if (c instanceof Flag)
                c.unset();
        }
    }
    unsetShown() {
        for (let c of this.contents) {
            if (c instanceof Flag && c.isShown())
                c.unsetMarker();
        }
    }
    isSet() {
        for (let c of this.contents) {
            if (c instanceof Flag && !c.isSet())
                return false;
        }
        return true;
    }
    shownContentIsSet() {
        for (let c of this.contents) {
            if (c instanceof Flag && c.isShown() && !c.isSet())
                return false;
        }
        return true;
    }
    manageContent() {
        if (this.shownContentIsSet())
            this.unsetShown();
        else
            this.setShown();
        reloadIcons();
    }
    hasShownContent() {
        for (let c of this.contents) {
            if (c.isShown())
                return true;
        }
        return false;
    }
    count() {
        let count = 0;
        for (let c of this.contents) {
            if (c.isCountable())
                ++count;
        }
        return count;
    }
    getUniqueShownMarker() {
        let shownMarkerFound = null;
        for (let c of this.contents) {
            if (c.isShown()) {
                if (shownMarkerFound === null)
                    shownMarkerFound = c;
                else 
                    return null;
            }
        } 
        return shownMarkerFound;
    }
    load() {
        addImageOverlayToMap(this.imageOverlay);
        for (let c of this.contents)
            c.loadMarker();
    }
}

class Submap {
    constructor(position, iconImage, name, floors,
        {baseReqs=[], randoReqs=baseReqs, glitchedReqs=randoReqs}={}
    ) {
        this.position = position;
        this.iconImage = getIconImage(iconImage);
        this.name = name;
        this.floors = floors;
        this.baseReqs = baseReqs;
        this.randoReqs = randoReqs;
        this.glitchedReqs = glitchedReqs;

        this.initializeMarker();
        this.initializeImages();
    }
    initializeMarker() {
        this.marker = L.marker(this.position, {
            icon: getIcon(this.iconImage),
            riseOnHover: true, 
            riseOffset: 2000, 
            keyboard: false, 
        });
        this.marker.on('click', () => this.load());
        this.boundSetShown = this.setShown.bind(this);
        this.boundUnsetShown = this.unsetShown.bind(this);
    }
    initializeImages() {
        let width = this.floors[0].image.width;
        let height = this.floors[0].image.height;
         if (height > 330) {
            width = 330 / height * width;
            height = 330;
    }
        let topLeftCornerPosition = [
            this.position[0] + height, 
            this.position[1] - width
        ];
        let bottomRightCornerPosition = [
            this.position[0] - height, 
            this.position[1] + width
        ];
        for (let floor of this.floors) {
            floor.imageOverlay = L.imageOverlay(floor.image.src, [
                topLeftCornerPosition, bottomRightCornerPosition
            ]);
        }
    }
    set() {
        for (let floor of this.floors)
            floor.set();
    }
    unset() {
        for (let floor of this.floors)
            floor.unset();
    }
    setShown() {
        for (let floor of this.floors)
            floor.setShown();
        this.setVisually();
    }
    unsetShown() {
        for (let floor of this.floors)
            floor.unsetShown();
        this.unsetVisually();
    } 
    setVisually() {
        if (Settings.CountersVisibility.isEnabled())
            this.marker.setIcon(getIcon(this.iconImage));
        showMarkerAsSet(this.marker);
        this.marker.off('contextmenu', this.boundSetShown);
        this.marker.on('contextmenu', this.boundUnsetShown);
    }
    unsetVisually() {
        if (Settings.CountersVisibility.isEnabled())
            this.marker.setIcon(getCounterIcon(this.marker.options.icon, this.count()));
        else 
            this.marker.setIcon(getIcon(this.iconImage));
        showMarkerAsNotSet(this.marker, this.iconImage);
        this.marker.off('contextmenu', this.boundUnsetShown);
        this.marker.on('contextmenu', this.boundSetShown);
    }
    isSet() {
        for (let floor of this.floors) {
            if (!floor.isSet())
                return false;
        }
        return true;
    }
    shownContentIsSet() {
        for (let floor of this.floors) {
            if (!floor.shownContentIsSet())
                return false;
        }
        return true;
    }
    isShown() {
        for (let floor of this.floors) {
            if (floor.hasShownContent())
                return true;
        }
        return false;
    }
    count() {
        if (!verifySubmapRequirements(this))
            return 0;
        let count = 0;
        for (let floor of this.floors)
            count += floor.count();
        return count;
    }
    getUniqueShownMarker() {
        let shownMarkerFound = null;
        for (let floor of this.floors) {
            let floorMarker = floor.getUniqueShownMarker();
            if (floorMarker === null)
                continue;
            if (shownMarkerFound === null)
                shownMarkerFound = floorMarker;
            else 
                return null;
        } 
        return shownMarkerFound;
    }
    loadMarker() {
        if (!Settings.EmptySubmaps.isEnabled() && !this.isShown())
            return;
        if (Settings.SubmapAsMarker.isEnabled()) {
            let uniqueMarker = this.getUniqueShownMarker();
            if (uniqueMarker !== null) {
                addMarkerToMap(uniqueMarker.marker, this.position)
                return;
            }
        }
        addMarkerToMap(this.marker, this.position);
        if (!verifySubmapRequirements(this)) {
            showMarkerAsUnobtainable(this.marker);
            return;
        }

        if (this.shownContentIsSet())
            this.setVisually();
        else
            this.unsetVisually();
    }
    load() {
        currentMapState = MapStates.Submap;
        this.prepareMap();
        this.exitEvent = () => this.exit();
        map.on('zoomend', this.exitEvent);
        loadedSubmap = this;
        this.floors[0].load();  
    }
    reload() {
        this.floors[0].load();
    }
    exit() {
        if (map.getZoom() == 0)
            return;
        map.off('zoomend', this.exitEvent);  
        document.getElementById('submapName').style.display = "none";
        exitToTilemap();
    }
    prepareMap() {
        map.setView(this.position, 0);     
        if (window.innerWidth >= 1400 && window.innerHeight >= 600)
            map.dragging.disable();
        else {
            let bounds = this.floors[0].imageOverlay.getBounds();
            let nwp = bounds.getNorthWest();
            let sep = bounds.getSouthEast();
            let controlsOffset = this.getControlsOffset();
            setTimeout(function() {
                map.setMaxBounds(L.latLngBounds([[nwp.lat + 100, nwp.lng - controlsOffset], [sep.lat - 100, sep.lng + 100]]));
            }, 200);  
        }
        let subName = document.getElementById('submapName');
        subName.style.display = "inline";
        subName.children[1].innerHTML = this.name;
        subName.style.width = this.name.length * 2 + 'vw';
        tileLayer.setOpacity(0.2);
        removeAllLayersExceptTL();
    }
    getControlsOffset() {
        return 100;
    }
}

class SimpleSubmap extends Submap {
    constructor(position, iconImage, name, contents,
        {baseReqs=[], randoReqs=baseReqs, glitchedReqs=randoReqs}={}
    ) {
        let floor = new SubmapFloor('Submaps/' + spaceToUnderscore(name), "1F", contents);
        super(position, iconImage, name, [floor], {baseReqs: baseReqs, randoReqs: randoReqs, glitchedReqs: glitchedReqs});
    }
}

const FloorLabels = ["B3", "B2", "B1", "1F", "2F", "3F", "4F", "5F", "6F", "7F", "8F"];
const DefaultFloor = 3;

class FlooredSubmap extends Submap {
    constructor(position, iconImage, name, floors,
        {floorOffset=DefaultFloor, baseReqs=[], randoReqs=baseReqs, glitchedReqs=randoReqs}={}
    ) {
        super(position, iconImage, name, floors, {baseReqs: baseReqs, randoReqs: randoReqs, glitchedReqs: glitchedReqs});
        this.floorOffset = floorOffset;
    }
    load() {
        currentMapState = MapStates.FlooredSubmap;
        this.prepareMap();
        loadedSubmap = this;
        // document.getElementById('floors').style.display = 'inline'
        this.exitEvent = () => {
            this.exit();
            if (map.getZoom() == 0)
                return;
            this.hideFloorUI();
            window.removeEventListener('keydown', this.controlsEvent);
        } 
        map.on('zoomend', this.exitEvent);
        this.controlsEvent = (e) => this.controls(e);
        window.addEventListener('keydown', this.controlsEvent);
        this.setupFloors();
    }
    setupFloors() {
        for(let floor of this.floors)
            this.setupFloorButton(floor);
        this.activeFloor = this.floors[DefaultFloor - this.floorOffset];
        document.getElementById(this.activeFloor.label).click();
    }
    hideFloorUI() {
        this.resetActiveFloorButton();
        for (let floor of this.floors) {
            let floorButton = document.getElementById(floor.label);
            floorButton.style.display = 'none';
            floorButton.replaceWith(floorButton.cloneNode(true)); // Remove event listeners
        }
    }
    setupFloorButton(floor) {
        let floorButton = document.getElementById(floor.label);
        floorButton.style.display = 'flex';
        floorButton.addEventListener("click", () => {
            removeFloorLayer();
            this.resetActiveFloorButton();
            floorButton.style.filter = 'brightness(200%)';
            floorButton.style.transform = "scale(1.025)";
            this.activeFloor = floor;
            floor.load();             
        });
        floorButton.addEventListener('contextmenu', () => {
            floor.manageContent();
        });
        floorButton.addEventListener('mouseover', () => {
            if (this.activeFloor == floor) 
                return;
            removeFloorLayer();
            floor.load();  
        });
        floorButton.addEventListener('mouseout', () => {
            if (this.activeFloor == floor || currentMapState === MapStates.TileMap) 
                return;
            removeFloorLayer();
            this.activeFloor.load();
        });
    }
    resetActiveFloorButton() {
        let floorButton = document.getElementById(this.activeFloor.label);
        floorButton.style.filter = 'brightness(150%)';
        floorButton.style.transform = "none";
    }
    reload() {
        removeFloorLayer();
        this.activeFloor.load();
    }
    controls(event) {
        if (!(event instanceof KeyboardEvent))
            return;
        let key = event.key == undefined ? event.originalEvent.key : event.key;
        if (key == 'e' || key == "ArrowRight") {
            this.activeFloor.manageContent();
            return;
        }

        let newFloorIndex = this.activeFloor.index;
        if (key == "ArrowDown" || key == 's') 
            newFloorIndex = this.activeFloor.index == 0 ? this.floors.length - 1 : this.activeFloor.index - 1;
        else if (key == 'ArrowUp' || key == 'w')
            newFloorIndex = this.activeFloor.index == this.floors.length - 1 ? 0 : this.activeFloor.index + 1;

        if (newFloorIndex != this.activeFloor.index) 
            document.getElementById(this.floors[newFloorIndex].label).click();    
    }
    getControlsOffset() {
        return 200;
    }
}

class SimpleFlooredSubmap extends FlooredSubmap {
    constructor(position, iconImage, name, contents,
        {floorOffset=DefaultFloor, baseReqs=[], randoReqs=baseReqs, glitchedReqs=randoReqs}={}
    ) {
        let floors = [];
        for (let i = 0; i < contents.length; ++i) {
            floors.push(new SubmapFloor(
                'Submaps/' + spaceToUnderscore(name) + '/' + i, 
                FloorLabels[i + floorOffset], 
                contents[i]
            ));
            floors[i].index = i;
        }
        super(position, iconImage, name, floors, {floorOffset: floorOffset, baseReqs: baseReqs, randoReqs: randoReqs, glitchedReqs: glitchedReqs});
    }
}

class CaveOfOrdeals extends FlooredSubmap {
    constructor(position, iconImage, contents) {
        let name = "Cave of Ordeals";
        let path = 'Submaps/' + spaceToUnderscore(name) + '/';
        let floors = [];
        floors.push(new SubmapFloor(path + '0', "B1", contents[0]));
        for(let i = 1; i < contents.length - 1; ++i)
            floors.push(new SubmapFloor(path + (((i - 1)  % 4) + 1), "B" + (i + 1), contents[i]));
        floors.push(new SubmapFloor(path + '5', "B" + (contents.length), contents[contents.length - 1]));
        super(position, iconImage, name, floors);
        for (let i = 0; i < this.floors.length; ++i)
            this.floors[i].index = i;


        let gEL = (enemies) => { // Get Enemy List Formatting
            let text = "<b>Enemies</b><ul>";
            for(let i = 0; i < enemies.length; ++i)
                text += "<li>" + enemies[i].slice(0, -2) + '&nbsp× &nbsp' + enemies[i].slice(-2) + '</li>'
            return text + "</ul>"
        }
        let tip = (text) => "<u>Tip</u><br>" + text;
        let gf = (text) => "<b>Great Fairy</b><br>" + text;
        let floorsText = [
            gEL(['Blue / Red Bokoblin 1 ']),
            gEL(['Keese 3 ', 'Rats 3 ']),
            gEL(['Baba Serpents 4 ']) + tip('You can make the ceiling ones fall with either the ' +
            'Slingshot, Clawshot, Boomerang or Bow.<br>There is also a Heart buried under the grounded Baba Serpent.'),
            gEL(['Skulltulas 3 ']),
            gEL(['Bulblin Archers 3 ']) + tip('Collect the arrows they miss to fill up your quiver.'),
            gEL(['Torchs Slugs 9 ']) + tip('Defeating the ceiling ones with a long ranged weapon' +
            ' makes the room a lot easier.'),
            gEL(["Dodongos 2 ", 'Fire Keese 5 ']) + 'Three Hearts are buried next to the west wall.',
            gEL(['Blue Tektites 2 ', 'Red Tektikes 5 ']),
            gEL(['Bulblin Archers 2 ', 'Lizalfos 2 ']) + tip('The Bulblin Archers are hidden under ' +
            'the ledge, take them out first.'),
            gf('Releases fairies into the Ordon Spring.'),
            gEL(['Helmasaurs 3 ', 'Rats 13']) + tip('The Spinner is required to go further.<br>You can defeat the rats easily with a Jump Attack ' +
            'into Spin Attack from the ledge.'),
            gEL(['Large Purple Chu 1 ']) + tip('Use a Bomb to instantly separate the Large Chu into Small Chus.'),
            gEL(['Chu Worms 4 ']) + tip('Destroy their bubbles with Bombs or use the Clawshot to get them out of it.'),
            gEL(['Bubbles 15']) + tip('Quickspin works well against Bubbles.'),
            gEL(['Bulblins 10']),
            gEL(['Rats 6 ', 'Keese 6 ']),
            gEL(['Poe 1 ', 'Stalhounds 10']) + tip('Defeat the Stalhounds in human form and then defeat the Poe.'),
            gEL(['Leevers 8 ']) + tip('Wait for them to get close then use a Spin Attack.<br> There is a Heart buried under the ledge.'),
            gEL(['Purple Chus 36', 'Blue Chu 2 ', 'Red Chu 1 ', 'Rare / Yellow Chu 1 ']) + tip('The Purple Chus merge with Non-Purple ' +
                'Chus first, so you have to be quick is you wanna collect Chu Jelly.'),
            gf('Releases fairies into the Faron Spring.'),
            gEL(['Bokoblins 5 ', 'Ice Keese 5 ']) + tip("The Ball and Chain is required to go further."),
            gEL(['Ghoul Rats 10', 'Keese 5 ', 'Rats 5 ']) + tip('Use Wolf Link and his senses to defeat the Ghoul Rats.<br>Three Hearts' +
                ' are buried in the center of the room.'),
            gEL(['Stalchildren 25']),
            gEL(['Gibdos 5 ']) + tip('Throw the Ball and Chain from a safe distance to defeat the Gibdos easily.'),
            gEL(['Bulblin Archers 3 ', 'Bulblins 8 ']) + tip('Be careful of the Bulbin Archer on top of the tower' + 
                'as he can shoot you from the other floor.'),
            gEL(['Stalfos 3 ']) + tip('Use the Ball and Chain to easily defeat the Stalfos.'),
            gEL(['Skulltulas 3 ', 'Bubbles 6 ']) + tip('The hanging Skulltulas cannot harm Link.<br> There is a Heart' + 
                ' buried near the west wall.'),
            gEL(['Masked Lizalfos 2 ', 'Red Bokoblins 6 ']),
            gEL(['Stalfos 2 ', 'Fire Bubbles 3 ', 'Stalchildren 12']),
            gf('Releases fairies into the Eldin Spring.'),
            gEL(['Beamos 5 ', 'Keese 8 ']) + tip('The Dominion Rod and the Bow are required to go further.<br>Eliminate the ' + 
                'Beamos from the ledge to make the room easier.'),
            gEL(['Fire Bubbles 6 ', 'Fire Keese 6 ', 'Torch Slugs 6 ', 'Dodongos 2 ']) + tip('Eliminate the Torch Slugs on the ceiling before ' + 
                'going down to make the room easier.'),
            gEL(['Poe 1 ', 'Gibdos 4 ']) + tip('Defeat the closest Gibdo, then the Poe, then the other Gibdos.'),
            gEL(['Ghoul Rats 10', 'Purple Chus 7 ', 'Red Chu 1 ', 'Yellow Chu 1 ']) + tip('Defeat the Ghoul Rats as Wolf Link, then ' +
                'transform back into human to defeat the Chus.<br>There is a Heart buried next to the south-west wall.'),
            gEL(['Ice Keese 6 ', 'Freezard 1 ']),
            gEL(['Chilfos 4 ']),
            gEL(['Leevers 8 ', 'Bubbles 4 ', 'Ice Bubbles 4 ']),
            gEL(['Freezards 2 ', 'Chilfos 4 ', 'Ice Keese 3 ',  'Ice Bubbles 4 ']) + tip('Take out the Chilfos with Bomb Arrows and the ' + 
                'Ice Keese and Ice Bubbles with Arrows. Magic Armor is particulary good for this room.'),
            gEL(['Darknuts 2 ']) + tip('Try to fight them off one by one before they regroup. Hidden Skills like Helm Splitter and Back Slice ' +
                'are effective against Darknuts. You can also use the running slice and get behind them for easy attacks.'),
            gf('Releases fairies into the Lanayru Spring.'),    
            gEL(['Armos 9 ']) + tip('The Double Clawshots are required to go further.<br>Use Bomb Arrows to defeat the Armos from afar, ' +
                'or jump down and use Bomblings or Hidden Skills to defeat them easily.'),
            gEL(['Baba Serpents 6 ', 'Red Bokoblins 6 ']) + tip('Try to lure the Bokoblins away from the Babas to make the room easier.'),
            gEL(['Bulblin Archers 6 ', 'Masked Lizalfos 3 ']) + tip('Use the Bow from the ledge for the Bulblins that are further away. ' +
                'One Bulblin is exactly under the ledge and two others are not far, so be careful when dropping down.'),
            gEL(['Poe 1 ', 'Dynalfos 4 ']) + tip('Eliminate the Dynalfos with Bomb Arrows, then jump down to defeat the Poe.'),
            gEL(['Bulblin Archers 2 ', 'Gibdos 2 ', 'Purple Chus 8 ', 'Red Chus 2 ', 'Blue Chu 1 ']) + tip('Be careful of the Bulblin Archers as ' +
                'they are on towers and can shoot you from the other room.<br>Three Hearts are buried under the ledge.'),
            gEL(['Freezards 2 ', 'Chilfos 3 ', 'Ghoul Rats 10']) + tip('Defeat the Chilfos from the ledge with Bomb Arrows, then jump carefully to ' + 
                'avoid the Freezard under the ledge.'),
            gEL(['Rats 17', 'Stalchildren 9 ', 'Blue Bokoblin 1 ']) + tip('Be careful of the Rats that are under the ledge.'),
            gEL(['Darknut 1 ', 'Aeralfos 2 ']) + tip('Take out the Aeralfos first, using the Boomerang then Clawshot technique.'),
            gEL(['Darknut 3 ']) + tip('If you comeback to this floor after having cleared the Cave of Ordeals once, there will ' + 
                'be 4 Darknuts. Try to pick them off one by one and use attacks that stun them all at the same time.'),
            gf('Gives you Great Fairy Tears everytime you visit her. Also enables the ability to get Great Fairy Tears at ' +
                'Spirit Springs if you do not have any.')  
        ];
        for (let i= 0; i < this.floors.length; ++i)
            this.floors[i].text = floorsText[i];
    }
    load() {
        currentMapState = MapStates.FlooredSubmap;
        this.prepareMap();
        map.dragging.enable();
        loadedSubmap = this;
        let div = document.getElementById('caveofOrdeals');
        div.style.display = 'inline';
        this.exitEvent = () => { 
            this.exit(); 
            if (map.getZoom() == 0)
                return;
            window.removeEventListener('keydown', this.controlsEvent);
            div.style.display = "none";
        } 
        map.on('zoomend', this.exitEvent);
        this.controlsEvent = (e) => this.controls(e);
        window.addEventListener('keydown', this.controlsEvent);
        this.setupButtons();
        this.activeFloor = this.floors[0];
        this.loadActiveFloor();
    }
    loadActiveFloor() {
        removeAllLayersExceptTL();
        this.activeFloor.load();
        document.getElementById("caveofOrdealsButtonLabel").innerHTML = this.activeFloor.label;
        document.getElementById("caveofOrdealsFloorText").innerHTML = this.activeFloor.text;
    }
    ascend() {
        let newFloorIndex = this.activeFloor.index === 0 ? this.floors.length - 1 : this.activeFloor.index - 1;
        this.activeFloor = this.floors[newFloorIndex];
        this.loadActiveFloor();
    }
    descend() {
        let newFloorIndex = this.activeFloor.index === this.floors.length - 1 ? 0 : this.activeFloor.index + 1;
        this.activeFloor = this.floors[newFloorIndex];
        this.loadActiveFloor();
    }
    manageActiveFloor() {
        this.activeFloor.manageContent();
    }
    setupButtons() {
        let arrowUp = document.getElementById('caveofOrdealsUpArrow');
        let arrowDown = document.getElementById('caveofOrdealsDownArrow');
        arrowUp.addEventListener('click', () => this.ascend());
        arrowUp.addEventListener('contextmenu', () => this.ascend());
        arrowDown.addEventListener('click', () => this.descend());
        arrowDown.addEventListener('contextmenu', () => this.descend());

        let button = document.getElementById('caveofOrdealsButton');
        button.addEventListener('click', () => this.manageActiveFloor());
        button.addEventListener('contextmenu', () => this.manageActiveFloor());
    }
    controls(event) {
        if (!(event instanceof KeyboardEvent))
            return;
        let key = event.key == undefined ? event.originalEvent.key : event.key;

        if (key == 'e' || key == "ArrowRight") {
            this.manageActiveFloor();
            return;
        }

        let arrow;
        if (key == "ArrowUp" || key == 'w') {
            this.ascend();
            arrow = document.getElementById('caveofOrdealsUpArrow');
        }
        else if (key == 'ArrowDown' || key == 's') {
            this.descend();
            arrow = document.getElementById('caveofOrdealsDownArrow');
        }      
        arrow.style.filter = 'brightness(125%)';
        arrow.style.transform = 'scale(1.1)';
        setTimeout(function () {
            arrow.style.filter = 'none';
            arrow.style.transform = 'none';
        }, 100);
    }
    getControlsOffset() {
        return 400;
    }
}

class Dungeon extends FlooredSubmap {
    constructor(position, imagedPosition, iconImage, name, contents,
        {floorOffset=DefaultFloor, baseReqs=[], randoReqs=baseReqs, glitchedReqs=randoReqs}={}
    ) {
        let floors = [];
        for (let i = 0; i < contents.length; ++i) {
            let floorLabel = FloorLabels[i + floorOffset];
            floors.push(new SubmapFloor(
                'Dungeons/' + spaceToUnderscore(name) + '/' + floorLabel, 
                floorLabel, 
                contents[i]
            ));
            floors[i].index = i;
        }
        super(position, iconImage, name, floors, {floorOffset: floorOffset, baseReqs: baseReqs, randoReqs: randoReqs, glitchedReqs: glitchedReqs});
        this.floorOffset = floorOffset;
        this.imagedPosition = imagedPosition;
        this.marker.setZIndexOffset(1000);
    }
     initializeImages() {
        let width = this.floors[0].image.width;
        let height = this.floors[0].image.height;
        if (height > 1350) {
            width = 1350 / height * width;
            height = 1350;
        }
        if (width > 2300) {
            height = 2300 / width * height;
            width = 2300;
        }
        let topLeftCornerPosition = [
            mapCenter[0] + height, 
            mapCenter[1] - width
        ];
        let bottomRightCornerPosition = [
            mapCenter[0] - height, 
            mapCenter[1] + width
        ];
        for (let floor of this.floors) {
            floor.imageOverlay = L.imageOverlay(floor.image.src, [
                topLeftCornerPosition, bottomRightCornerPosition
            ]);
        }
    }
    loadImageMapMarker() {
        addMarkerToMap(this.marker, this.imagedPosition);
        if (this.shownContentIsSet())
            this.setVisually();
        else
            this.unsetVisually();
    }
    load() {
        removeAllLayers();
        map.setView(mapCenter, -2); // Center, min dungeon zoom
        if (currentMapState === MapStates.ImageMap) {
            map.setMinZoom(-5);
            document.getElementById('credit').style.display = 'none';
            map.off('zoomend');
            map.dragging.enable();         
            map.on('zoomend', loadTileMap);  
        }
        currentMapState = MapStates.Dungeon;
        loadedSubmap = this;
        let dungeonName = document.getElementById("dungeonName");
        dungeonName.style.display = "grid";
        dungeonName.children[1].innerHTML = this.name; 
        this.controlsEvent = (e) => this.controls(e);
        window.addEventListener('keydown', this.controlsEvent);
        this.exitEvent = () => this.exit();
        map.on('zoomend', this.exitEvent);
        this.setupFloors();
    }
    exit() {
        if (map.getZoom() >= -2)
            return;
        this.hideFloorUI();
        document.getElementById('dungeonName').style.display = 'none';
        removeAllLayers();
        window.removeEventListener('keydown', this.controlsEvent);
        map.off('zoomend', this.exitEvent);
        loadTileMap();
    }

}

class Province {
    constructor(name, counterPosition, 
        {baseReqs=[], randoReqs=baseReqs, glitchedReqs=randoReqs}={}, 
        polygonPoints, contents=[], 
    ) {
        this.name = name;
        this.polygonPoints = polygonPoints;
        this.counterPosition = counterPosition;
        this.baseReqs = baseReqs;
        this.randoReqs = randoReqs;
        this.glitchedReqs = glitchedReqs;
        let flagContents = [];
        for (let c of contents) {
            if(typeof c === 'string')
                flagContents.push(flags.get(c));
            else 
                flagContents.push(c);
        }
        this.contents = flagContents;
        this.initializePolygon(polygonPoints);
    }
    set() {
        for (let c of this.contents) {
            if (c instanceof Flag || c instanceof Submap)
                c.set();
        }
    }
    unset() {
        for (let c of this.contents) {
            if (c instanceof Flag || c instanceof Submap)
                c.unset();
        }
    }
    initializePolygon(polygonPoints) {
        this.polygon = L.polygon(polygonPoints, { fillColor: '#6e5b1e', fillOpacity: 0, opacity: 0});
        this.polygon.on('mouseover', function () { this.setStyle({ fillOpacity: 0.5 }) });
        this.polygon.on('mouseout', function () { this.setStyle({ fillOpacity: 0 }) });
        this.polygon.on('click', clickToZoom);
    }
    loadPolygon() {
        addPolygonToMap(this.polygon);
        this.polygon.setStyle({ fillOpacity: 0 });
        if (Settings.CountersVisibility.isEnabled()) {
            addMarkerToMap(L.marker(this.counterPosition, {
                icon: L.divIcon({ html: '<div class="cpt procpt">' + this.count() + '</div>'}),
                interactive: false
            }));
        }
    }
    loadMarkers() {
         if (!verifySubmapRequirements(this))
            return;
        for (let c of this.contents)
            c.loadMarker();
    }
    unset() {
        for (let c of this.contents) {
            if (c instanceof Flag || c instanceof Submap)
                c.unset();
        }
    }
    count() {
        if (!verifySubmapRequirements(this))
            return 0;
        let count = 0;
        for (let c of this.contents) {
            if (c instanceof Submap)
                count += c.count();
            else if (c.isCountable()) // Flags & NonFlags
                ++count;
        }
        return count;
    }


}

class DungeonProvince extends Province {
    constructor(dungeon, counterPosition, polygonPoints) {
        super(dungeon.name, counterPosition, {
            baseReqs: dungeon.baseReqs, randoReqs: dungeon.randoReqs, glitchedReqs: dungeon.glitchedReqs
        }, polygonPoints);
        this.dungeon = dungeon;
        this.polygon.on('click', this.dungeon.load);
    }
    count() {
        return this.dungeon.count();
    }
}


let dungeonIconImage = getIconImage('Dungeon Star');

const Dungeons = Object.freeze({
    Forest: new Dungeon([-6915, 4098], [-6950, 4900], dungeonIconImage, 'Forest Temple', [
        [   // 1F
        "Forest Temple Entrance Vines Chest",
        "Forest Temple Central Chest Behind Stairs",
        "Forest Temple Central North Chest",
        "Forest Temple Windless Bridge Chest",
        "Forest Temple East Water Cave Chest",
        "Forest Temple Second Monkey Under Bridge Chest",
        "Forest Temple Big Baba Key",
        "Forest Temple West Deku Like Chest",
        "Forest Temple Totem Pole Chest",
        "Forest Temple West Tile Worm Room Vines Chest",
        "Forest Temple Gale Boomerang",
        "Forest Temple West Tile Worm Chest Behind Stairs",
        "Forest Temple Central Chest Hanging From Web",
        "Forest Temple Big Key Chest",
        "Forest Temple North Deku Like Chest",
        "Forest Temple East Tile Worm Chest",
        "Forest Temple Diababa Heart Container",
        "Forest Temple Dungeon Reward",
        "Forest Temple Diababa",
        "Forest Temple Ooccoo",
        "Forest Temple Tile Worm Monkey Lock",
        "Forest Temple Big Baba Monkey Lock",
        "Forest Temple Totem Pole Monkey Lock",
        "Forest Temple Windless Bridge Lock",
        "Forest Temple Boss Lock",
        "Forest_Temple_Sign",
        Bottle.Fairy.new([-3920, 4820]),
    ]], {baseReqs: [], randoReqs: []}),
    
    Mines: new Dungeon([-3660, 8193], [-3920, 8752], dungeonIconImage, 'Goron Mines', [
        [   // 1F
            "Goron Mines Entrance Chest",
            "Goron Mines Main Magnet Room Bottom Chest",
            "Goron Mines Gor Amato Key Shard",
            "Goron Mines Gor Amato Chest",
            "Goron Mines Gor Amato Small Chest",
            "Goron Mines Magnet Maze Chest",
            "Goron Mines Ooccoo",
            "Goron Mines First Floor Lock",
        ], [ // 2F
            "Goron Mines Crystal Switch Room Underwater Chest",
            "Goron Mines Crystal Switch Room Small Chest",
            "Goron Mines After Crystal Switch Room Magnet Wall Chest",
            "Goron Mines Double Beamos Lock",
            "Goron Mines Outside Beamos Chest",
            "Goron Mines Outside Underwater Chest",
            "Goron Mines Outside Clawshot Chest",
            "Goron Mines Outside Lock",
            "Goron Mines Gor Ebizo Key Shard",
            "Goron Mines Gor Ebizo Chest",
            "Goron Mines Chest Before Dangoro",
            "Goron Mines Dangoro Chest",
            "Goron Mines Beamos Room Chest",
            "Goron Mines Gor Liggs Key Shard",
            "Goron Mines Gor Liggs Chest",
            "Goron Mines Main Magnet Room Top Chest",
            "Goron Mines Boss Lock",    
            "Goron Mines Fyrus",
            "Goron Mines Fyrus Heart Container",
            "Goron Mines Dungeon Reward",
            "Goron_Mines_Sign",
            Bottle.Fairy.new([-3644, 4560])
        ]
    ], {}),

    Lakebed: new Dungeon([-4741, 3415], [-4960, 4208], dungeonIconImage, 'Lakebed Temple', [
        [   // B2
            "Lakebed Temple Morpheel",
            "Lakebed Temple Morpheel Heart Container",
            "Lakebed Temple Dungeon Reward"
        ], [ // B1
            "Lakebed Temple Central Room Spire Chest",
            "Lakebed Temple Before Deku Toad Underwater Right Chest",
            "Lakebed Temple Before Deku Toad Underwater Left Chest",
            "Lakebed Temple Big Key Chest",
            "Lakebed Temple Boss Lock",
            Bottle.Fairy.new([-4365, 4362])
        ], [ // 1F
            "Lakebed Temple Central Room Small Chest",
            "Lakebed Temple Central Room Chest",
            "Lakebed Temple East Lower Waterwheel Stalactite Chest",
            "Lakebed Temple Before Deku Toad Alcove Chest",
            "Lakebed Temple Deku Toad Chest",
            "Lakebed Temple West Lower Small Chest",
            "Lakebed Temple East Lower Waterwheel Bridge Chest",
            "Lakebed Temple Underwater Maze Small Chest",
            "Lakebed Temple Before Deku Toad Lock",
            "Lakebed_Temple_Sign",
        ], [ // 2F
            "Lakebed Temple Lobby Rear Chest",
            "Lakebed Temple Lobby Left Chest",
            "Lakebed Temple Stalactite Room Chest",
            "Lakebed Temple East Second Floor Southwest Chest",
            "Lakebed Temple East Second Floor Southeast Chest",
            "Lakebed Temple Chandelier Chest",
            "Lakebed Temple West Second Floor Central Small Chest",
            "Lakebed Temple West Second Floor Northeast Chest",
            "Lakebed Temple West Second Floor Southwest Underwater Chest",
            "Lakebed Temple West Second Floor Southeast Chest",
            "Lakebed Temple Ooccoo",
            "Lakebed Temple Main Room Lock",
            "Lakebed Temple East Water Supply Lock",
            Bottle.Fairy.new([-4533, 5253])
        ], [ // 3F

        ], [ // 4F
            "Lakebed Temple East Water Supply Small Chest",
            "Lakebed Temple East Water Supply Clawshot Chest",
            "Lakebed Temple West Water Supply Small Chest",
            "Lakebed Temple West Water Supply Chest",
        ]
    ], {floorOffset: 1, baseReqs: [zoraArmorReq, bombBagReq]}),

    Grounds: new Dungeon([-3865, 605], [-4500, 1488], dungeonIconImage, "Arbiter's Grounds", [
        [   // B2
            "Arbiters Grounds North Turning Room Lock",
            "Arbiters Grounds Ooccoo",
            "Arbiters Grounds Death Sword Chest",
            "Arbiters Grounds Spinner Room First Small Chest",
            "Arbiters Grounds Spinner Room Second Small Chest",
            "Arbiters Grounds Spinner Room Lower Central Small Chest",
            "Arbiters Grounds Spinner Room Stalfos Alcove Chest",

        ], [ // B1
            "Arbiters Grounds East Lower Turnable Redead Chest",
            "Arbiters Grounds North Turning Room Chest",
            "Arbiters Grounds Spinner Room Lower North Chest",

        ], [ // 1F
            "Arbiters Grounds Entrance Chest",
            "Arbiters Grounds Entrance Lock",
            "Arbiters Grounds Torch Room Poe",
            "Arbiters Grounds Torch Room East Chest",
            "Arbiters Grounds Torch Room West Chest",
            "Arbiters Grounds West Small Chest Behind Block",
            "Arbiters Grounds East Turning Room Poe",
            "Arbiters Grounds West Chandelier Chest",
            "Arbiters Grounds West Stalfos Northeast Chest",
            "Arbiters Grounds West Stalfos West Chest",
            "Arbiters Grounds Big Key Chest",
            "Arbiters Grounds East Turning Room Lock",
            "Arbiters_Grounds_Sign",
            Bottle.Oil.new([-5341, 4446])

        ], [ // 2F
            "Arbiters Grounds East Upper Turnable Chest",
            "Arbiters Grounds East Upper Turnable Redead Chest",
            "Arbiters Grounds East Upper Turnable Lock",
            "Arbiters Grounds Hidden Wall Poe",
            "Arbiters Grounds Ghoul Rat Room Chest",
            "Arbiters Grounds Ghoul Rat Room Lock",
            "Arbiters Grounds West Poe",
        ], [ // 3F

        ], [ // 4F
            "Arbiters Grounds Boss Lock",
            "Arbiters Grounds Stallord",
            "Arbiters Grounds Stallord Heart Container",
            "Arbiters Grounds Dungeon Reward",
            Bottle.Fairy.new([-3828, 4100])
        ]
    ], {floorOffset: 1, baseReqs: [aurusMemoReq, bulblinKeyReq]}),

    Snowpeak: new Dungeon([-2626, 1229], [-2960, 2112], dungeonIconImage, 'Snowpeak Ruins', [ 
        [    // 1F
            "Snowpeak Ruins Lobby West Armor Chest",
            "Snowpeak Ruins Lobby Armor Poe",
            "Snowpeak Ruins Lobby East Armor Chest",
            "Snowpeak Ruins Lobby Armor Bubble Rupee",
            "Snowpeak Ruins Lobby Poe",
            "Snowpeak Ruins Mansion Map",
            "Snowpeak Ruins Ooccoo",
            "Snowpeak Ruins East Courtyard Chest",
            "Snowpeak Ruins East Courtyard Buried Chest",
            "Snowpeak Ruins East Corrider Lock",
            "Snowpeak Ruins Ordon Pumpkin Chest",
            "Snowpeak Ruins West Courtyard Buried Chest",
            "Snowpeak Ruins Courtyard Central Chest",
            "Snowpeak Ruins Courtyard West Lock",
            "Snowpeak Ruins West Cannon Room Central Chest",
            "Snowpeak Ruins West Cannon Room Corner Chest",
            "Snowpeak Ruins Wooden Beam Central Chest",
            "Snowpeak Ruins Wooden Beam Northwest Chest",
            "Snowpeak Ruins Broken Floor Chest",
            "Snowpeak Ruins Ball and Chain",
            "Snowpeak Ruins Chest After Darkhammer",
            "Snowpeak Ruins Armor Bubble Rupee After Darkhammer",
            "Snowpeak_Ruins_Sign",
            Bottle.Soup.new([-5141, 4911])
        ], [ // 2F
            "Snowpeak Ruins Chapel Chest",
            "Snowpeak Ruins Ice Room Poe",
            "Snowpeak Ruins Lobby Chandelier Chest",
            "Snowpeak Ruins Northeast Chandelier Chest",
            "Snowpeak Ruins Wooden Beam Chandelier Chest",
            "Snowpeak Ruins Lobby Lock",
            "Snowpeak Ruins Ice Room Lock",
        ], [ // 3F
            "Snowpeak Ruins Boss Lock",
            "Snowpeak Ruins Blizzeta",
            "Snowpeak Ruins Blizzeta Heart Container",
            "Snowpeak Ruins Dungeon Reward",
        ]
    ], {baseReqs: [coralEarringReq, reekfishScentReq]}),

    Time: new Dungeon([-6618, 3681], [-6580, 4425], dungeonIconImage, 'Temple of Time', [
        [    // 1F
            "Temple of Time Lobby Lantern Chest",
            "Temple of Time Boss Lock",
            "Temple of Time Armogohma",
            "Temple of Time Armogohma Heart Container",
            "Temple of Time Dungeon Reward",
            Bottle.Fairy.new([-4274, 4301])
        ], [ // 2F
            "Temple of Time First Staircase Gohma Gate Chest",
            "Temple of Time Ooccoo",
            "Temple of Time Lobby Lock",
            "Temple_of_Time_Sign"
        ], [ // 3F
            "Temple of Time First Staircase Armos Chest",
            "Temple of Time First Staircase Window Chest",
            "Temple of Time Poe Behind Gate",
        ], [ // 4F

        ], [ // 5F
            "Temple of Time Armos Antechamber East Chest",
            "Temple of Time Armos Antechamber North Chest",
            "Temple of Time Armos Antechamber Statue Chest",
            "Temple of Time Second Staircase Lock",
            "Temple of Time Moving Wall Beamos Room Chest", 
            "Temple of Time Moving Wall Dinalfos Room Chest", 
            "Temple_of_Time_Beyond_Point_Sign",
        ], [ // 6F
            "Temple of Time Scales Gohma Chest",
        ], [ // 7F
            "Temple of Time Scales Upper Chest",
            "Temple of Time Poe Above Scales",
            "Temple of Time Big Key Chest",
            "Temple of Time Floor Switch Puzzle Room Upper Chest",
            "Temple of Time Gilloutine Chest",
        ], [ // 8F
            "Temple of Time Chest Before Darknut",
            "Temple of Time Darknut Lock",
            "Temple of Time Darknut Chest",
        ]
    ], {baseReqs: [blizzetaReq, masterSwordReq], randoReqs: [shadowCrystalReq, [masterSwordReq, randoSettingReq]]}),

    City: new Dungeon([-5306, 3144], [-5472, 3840], dungeonIconImage, 'City in the Sky', [
        [    // B3
            "City in The Sky Aeralfos Chest"
        ], [ // B2

        ], [ // B1
            "City in The Sky East Wing Lower Level Chest",
            "City in The Sky West Wing Baba Balcony Chest"
        ], [ // 1F
            "City in The Sky Underwater West Chest",
            "City in The Sky Underwater East Chest",
            "City in The Sky Ooccoo",
            "City in The Sky Lock",
            "City in The Sky East First Wing Chest After Fans",
            "City in The Sky East Tile Worm Small Chest",
            "City in The Sky West Wing First Chest",
            "City in The Sky West Wing Narrow Ledge Chest",
            "City in The Sky West Wing Tile Worm Chest",
            "City in The Sky Chest Behind North Fan",
            "City in The Sky North Aeralfos Rupee",
            "City_in_the_Sky_Sign",
            Bottle.Fairy.new([-4495, 3767])
        ], [ // 2F
            "City in The Sky East Wing After Dinalfos Alcove Chest",
            "City in The Sky East Wing After Dinalfos Ledge Chest",
            "City in The Sky West Garden Lone Island Chest",
            "City in The Sky Garden Island Poe",
            "City in The Sky West Garden Lower Chest",
            "City in The Sky Baba Tower Alcove Chest",
            "City in The Sky Baba Tower Narrow Ledge Chest"
        ], [ // 3F
            "City in The Sky Chest Below Big Key Chest",
            "City in The Sky West Garden Corner Chest",
            "City in The Sky West Garden Ledge Chest",
            "City in The Sky Baba Tower Top Small Chest",
        ], [ // 4F
            "City in The Sky Central Outside Ledge Chest",
            "City in The Sky Central Outside Poe Island Chest",
            "City in The Sky Big Key Chest",
            "City in The Sky Poe Above Central Fan",
            Bottle.BlueChu.new([-3776, 3738])
        ], [ // 5F
            "City in The Sky Boss Lock",
            "City in The Sky Argorok",
            "City in The Sky Argorok Heart Container",
            "City in The Sky Dungeon Reward",
            Bottle.Fairy.new([-3728, 4136]),
            Bottle.BlueChu.new([-3674, 4127])
        ]
    ], {floorOffset: 0, baseReqs: [clawshotReq, completedSkybookReq]}),

    Palace: new Dungeon([-3636, 602], [-3800, 1472], "Mirror", 'Palace of Twilight', [
        [    // 1F
            "Palace of Twilight Collect Both Sols",
            "Palace of Twilight West Wing Chest Behind Wall of Darkness",
            "Palace of Twilight West Wing First Room Central Chest",
            "Palace of Twilight West Wing First Lock",
            "Palace of Twilight West Wing Second Room Central Chest",
            "Palace of Twilight West Wing Second Room Lower South Chest",
            "Palace of Twilight West Wing Second Room Southeast Chest",
            "Palace of Twilight West Wing Second Lock",
            "Palace of Twilight East Wing First Room Zant Head Chest",
            "Palace of Twilight East Wing First Room North Small Chest",
            "Palace of Twilight East Wing First Room West Alcove",
            "Palace of Twilight East Wing First Room East Alcove",
            "Palace of Twilight East Wing First Lock",
            "Palace of Twilight East Wing Second Room Southwest Chest",
            "Palace of Twilight East Wing Second Room Northwest Chest",
            "Palace of Twilight East Wing Second Room Northeast Chest",
            "Palace of Twilight East Wing Second Room Southeast Chest",
            "Palace of Twilight East Wing Second Lock",
            "Palace_of_Twilight_Sign",
            Bottle.Fairy.new([-5106, 3727])
        ], [ // 2F
            "Palace of Twilight Central First Room Chest"
        ], [ // 3F
            "Palace of Twilight Big Key Chest",
            "Palace of Twilight Central Outdoor Chest",
            "Palace of Twilight Central Tower Chest",
            "Palace of Twilight Central First Room Lock",
            "Palace of Twilight Central Outdoor Lock",
            Bottle.Fairy.new([-4656, 4439])
        ], [ // 4F
            "Palace of Twilight Before Zant Lock",
            "Palace of Twilight Boss Lock",
            "Palace of Twilight Zant",
            "Palace of Twilight Zant Heart Container",
        ]
    ], {baseReqs: [stallordReq, completedMirrorReq], randoReqs: [stallordReq]}),

    Castle: new Dungeon([-3250, 4712], [], 'Castle', 'Hyrule Castle', [
        [    // 1F
            "Hyrule Castle Outside Lock",
            "Hyrule Castle West Courtyard Central Small Chest",
            "Hyrule Castle King Bulblin Key",
            "Hyrule Castle West Courtyard North Small Chest",
            "Hyrule Castle East Wing Balcony Chest",
            "Hyrule Castle East Wing Boomerang Puzzle Chest",
            "Hyrule Castle Graveyard Grave Switch Room Front Left Chest",
            "Hyrule Castle Graveyard Grave Switch Room Back Left Chest",
            "Hyrule Castle Graveyard Grave Switch Room Right Chest",
            "Hyrule Castle Graveyard Owl Statue Chest",
            "Hyrule_Castle_Sign",
            Bottle.Oil.new([-3890, 4791])
        ], [ // 2F
            "Hyrule Castle Main Hall Northeast Chest",
            "Hyrule Castle Main Hall Northwest Chest",
            "Hyrule Castle Main Hall Southwest Chest",
            "Hyrule Castle Lantern Staircase Chest",
            "Hyrule Castle Southeast Balcony Tower Chest",
            "Hyrule Castle Big Key Chest",
            Bottle.Oil.new([-4615, 4172]),
            Bottle.YellowChu.new([-4910, 3843]),
            Bottle.YellowChu.new([-4686, 3917]),
            Bottle.RedChu.new([-4759, 3845])
        ], [ // 3F
            'Hyrule Castle Balcony Lock'
        ], [ // 4F
            'Hyrule Castle Darknut Before Boss Rupee',
            "Hyrule Castle Boss Lock",
            "Hyrule Castle Treasure Room Lock",
            "Hyrule Castle Treasure Room First Chest",
            "Hyrule Castle Treasure Room Second Chest",
            "Hyrule Castle Treasure Room Third Chest",
            "Hyrule Castle Treasure Room Fourth Chest",
            "Hyrule Castle Treasure Room Fifth Chest",
            "Hyrule Castle Treasure Room First Small Chest",
            "Hyrule Castle Treasure Room Second Small Chest",
            "Hyrule Castle Treasure Room Third Small Chest",
            "Hyrule Castle Treasure Room Fourth Small Chest",
            "Hyrule Castle Treasure Room Fifth Small Chest",
            "Hyrule Castle Treasure Room Sixth Small Chest",
            "Hyrule Castle Treasure Room Seventh Small Chest",
            "Hyrule Castle Treasure Room Eighth Small Chest",
            Bottle.Fairy.new([-5030, 4760])
        ], [ // 5F
            "Hyrule Castle Ganondorf",
            Bottle.Fairy.new([-4957, 4179])
        ]   
    ])
});


let grottoIconImage = getIconImage('Grotto');
let doorIconImage = getIconImage('Door');
let entranceIconImage = getIconImage('Entrance');

function newGrotto(id, position, name, contents) {
    let grotto = new SimpleSubmap(position, grottoIconImage, 'Grotto_' + id, contents);
    grotto.name = name;
    return grotto;
}

let hyruleCastlePolygonPoints = [
    [-2798, 5430], [-2863, 5622], [-2940, 5472], [-3184, 5586], [-3188, 5550], [-3362, 5552], [-3357, 5551], [-3357, 5588], 
    [-3225, 5632], [-3481, 5705], [-3556, 5756], [-3558, 5664], [-3653, 5729], [-3370, 5828], [-3702, 5958], [-3707, 5907], 
    [-3782, 5912], [-3938, 5914], [-3938, 4990], [-3788, 4994], [-3707, 4986], [-3706, 4940], [-3358, 5074], [-3649, 5173], 
    [-3558, 5242], [-3552, 5158], [-3218, 5266], [-3360, 5325], [-3359, 5348], [-3184, 5345], [-3180, 5304], [-2936, 5440]
];


const Provinces = Object.freeze({
    Ordona: new Province('Ordona', [-8816, 5664], {}, [
            [-8053, 5568], [-7628, 6232], [-8208, 6872], [-8776, 7160], [-9752, 6952], [-9876, 6564], [-9976, 5776], [-9924, 5088], 
            [-9750, 4672], [-8792, 4338], [-7853, 4693]
        ], [
            'Uli Cradle Delivery',
            "Ordon Spring Golden Wolf",
            "Herding Goats Reward",
            "Rusl's House Orange Rupee",
            "Jaggle House's Purple Rupee",
            "Ordon_Sign",
            new SimpleFlooredSubmap([-8791, 4941], doorIconImage, "Link's House", [
                ["Links Basement Chest"],
                ["Wooden Sword Chest"],
            ], {floorOffset: 2}),
            new SimpleSubmap([-8964, 4938], doorIconImage, "Sera's Shop", [
                "Sera Shop Slingshot",
                "Ordon Cat Rescue"
            ]),
            new SimpleSubmap([-9080, 4783], doorIconImage, "Rusl's House", [
                "Ordon Sword"
            ]),
            new SimpleSubmap([-9037, 5015], doorIconImage, "Jaggle's House", [
                "Ordon Shield"
            ]),
            new SimpleFlooredSubmap([-9171, 4953], doorIconImage, "Bo's House", [
                ["Wrestling With Bo"],
                []
            ]),
            newGrotto(1, [-9523, 4765], "Ordon Ranch Grotto", [
                "Ordon Ranch Grotto Lantern Chest"
            ]),
            horseGrass.new([-9517, 5015]),
            horseGrass.new([-8500, 4800]),
            hawkGrass.new([-8991, 4960]),
            hawkGrass.new([-8940, 5001]),
            hawkGrass.new([-9169, 4934]),
            Bottle.BeeLarva.new([-9035, 4848]),
    ]),

    Faron: new Province('Faron', [-6512, 5536], {}, [
            [-5412, 5564], [-5374, 5998], [-5954, 6282], [-5944, 7028], [-6700, 7216], [-7144, 6960], [-8048, 5568], [-7844, 4680],
            [-7360, 4200], [-6640, 3464], [-6360, 3744], [-5944, 3776], [-5834, 4743], [-5630, 4883]
        ], [
            "Coro Gate Key",
            "Coro Lantern",
            "Faron Mist Cave Open Chest",
            "Faron Mist Cave Lantern Chest",
            "North Faron Woods Deku Baba Chest",
            "Coro Bottle",
            "Faron Woods Golden Wolf",
            "Faron Mist Stump Chest",
            "Faron Mist North Chest",
            "Faron Mist South Chest",
            "Faron Field Tree Heart Piece",
            "Faron Field Male Beetle",
            "Faron Field Female Beetle",
            "Faron Mist Poe",
            "Sacred Grove Pedestal Master Sword",
            "Sacred Grove Pedestal Shadow Crystal",
            "Sacred Grove Male Snail",
            "Faron Field Bridge Chest",
            "Faron Field Poe",
            "Lost Woods Waterfall Poe",
            "Lost Woods Lantern Chest",
            "Lost Woods Boulder Poe",
            "Sacred Grove Spinner Chest",
            "Sacred Grove Master Sword Poe",
            "Faron Woods Owl Statue Sky Character",
            "Faron Woods Owl Statue Chest",
            "Faron Owl Statue Rupee Boulder",
            "North Faron Woods Howling Stone",
            "Faron_Field_Sign",
            "Faron_Woods_Sign",
            "Sacred_Grove_Sign",
            horseGrass.new([-7900, 4857]),
            horseGrass.new([-7701, 4803]),
            horseGrass.new([-6666, 4936]),
            hawkGrass.new([-7325, 3569]),
            Bottle.BeeLarva.new([-7318, 3518]),
            new SimpleSubmap([-7447, 4718], entranceIconImage, "South Faron Cave", [
                "South Faron Cave Chest"
            ]),
            new SimpleSubmap([-7410, 4936], doorIconImage, "Coro's House", [

            ]),
            newGrotto(2, [-6662, 5180], "Faron Field Corner Grotto", [
                "Faron Field Corner Grotto Left Chest",
                "Faron Field Corner Grotto Right Chest",
                "Faron Field Corner Grotto Rear Chest",
                Bottle.RareChu.new([-6571, 5153])
            ]),
            newGrotto(5, [-5652, 4644], "Faron Field Fishing Grotto", [
                Bottle.Worm.new([-5378, 4597])
            ]),
            newGrotto(2, [-7123, 3500], "Sacred Grove Baba Serpent Grotto", [
                "Sacred Grove Baba Serpent Grotto Chest"
            ]),
            new SimpleSubmap([-7204, 3678], doorIconImage, "Past Sacred Grove", [
                "Sacred Grove Female Snail",
                "Sacred Grove Temple of Time Owl Statue Poe",
                "Sacred Grove Past Owl Statue Chest",
            ])
    ]),

    Eldin: new Province("Eldin", [-4096, 7904], {baseReqs: [diababaReq], randoReqs: []}, [
            [-5952, 6280], [-5936, 7020], [-5904, 7676], [-6044, 8248], [-5952, 8836], [-5612, 9452], [-5212, 9544], [-4584, 9492], 
            [-3932, 9572], [-3340, 9472], [-2956, 9196], [-2460, 9040], [-1972, 8608], [-1404, 8006], [-1228, 7352], [-2164, 7080], 
            [-2772, 7060], [-2989, 7110], [-3281, 6985], [-3432, 6760], [-3580, 6472], [-3748, 6372], [-3932, 6324], [-4276, 6340], 
            [-4419, 6316], [-4680, 6260], [-5060, 5972], [-5332, 6004],
        ], [
            "Kakariko Graveyard Lantern Chest",
            "Kakariko Graveyard Male Ant",
            "Eldin Field Male Grasshopper",
            "Eldin Field Female Grasshopper",
            "Bridge of Eldin Male Phasmid",
            "Bridge of Eldin Female Phasmid",
            "Kakariko Gorge Female Pill Bug",
            "Kakariko Gorge Male Pill Bug",
            "Kakariko Gorge Spire Heart Piece",
            "Kakariko Gorge Double Clawshot Chest",
            "Talo Sharpshooting",
            "Kakariko Watchtower Alcove Chest",
            "Eldin Spring Underwater Chest",
            "Eldin Field Bomb Rock Chest",
            "Rutelas Blessing",
            "Kakariko Village Bomb Shop Poe",
            "Kakariko Village Watchtower Poe",
            "Kakariko Village Bomb Rock Spire Heart Piece",
            "Kakariko Graveyard Open Poe",
            "Death Mountain Trail Poe",
            "Death Mountain Alcove Chest",
            "Goron Springwater Rush",
            "Kakariko Gorge Poe",
            "Gift From Ralis",
            "Kakariko Graveyard Golden Wolf",
            "Kakariko Graveyard Grave Poe",
            "Ilia Charm",
            "Cats Hide and Seek Minigame",
            "Hidden Village Poe",
            "Bridge of Eldin Owl Statue Sky Character",
            "Bridge of Eldin Owl Statue Chest",
            "Kakariko Gorge Owl Statue Sky Character",
            "Kakariko Gorge Owl Statue Chest",
            "Kakariko Gorge Corner Rupee Boulder",
            "Kakariko Gorge Owl Statue Rupee Boulder",
            "Eldin Spring Underwater Rupee Boulder",
            "Death Mountain Trail Red Rupees",
            "Kakariko Village Bell Rupee",
            "Kakariko Graveyard Underwater Rupee Boulder",
            "Bridge of Eldin Rupee Boulder",
            "Death Mountain Howling Stone",
            "Hidden Village Howling Stone",
            "Death_Mountain_Sign",
            "Eldin_Field_Sign",
            "Hidden_Village_Sign",
            "Kakariko_Gorge_Sign",
            "Kakariko_Graveyard_Sign",
            "Kakariko_Village_Sign",
            "North_Eldin_Sign",
            horseGrass.new([-5564, 7612]),
            horseGrass.new([-4716, 6818]),
            horseGrass.new([-5342, 6186]),
            hawkGrass.new([-4108, 8225]),
            Bottle.BeeLarva.new([-5507, 8125]),
            Bottle.RareChu.new([-4102, 8260]),
            new SimpleSubmap([-5259, 7660], doorIconImage, 'Kakariko Empty House', [
                "Kakariko Village Female Ant"
            ]),
            new SimpleFlooredSubmap([-5283, 7580], doorIconImage, 'Kakariko Inn', [
                ["Kakariko Inn Chest"],
                []
            ]),
            new SimpleSubmap([-5162, 7670], doorIconImage, "Barnes' Shop", [
                "Barnes Bomb Bag"
            ]),
            new SimpleFlooredSubmap([-5097, 7593], doorIconImage, 'Kakariko Watchtower', [
                [],
                ["Kakariko Watchtower Chest"]
            ], {floorOffset: 2}),
            new SimpleSubmap([-5382, 7565], doorIconImage, 'Malo Mart Kakariko Branch', [
                "Kakariko Village Malo Mart Hylian Shield",
                "Kakariko Village Malo Mart Wooden Shield",
                "Kakariko Village Malo Mart Red Potion",
                "Kakariko Village Malo Mart Hawkeye"
            ]),
            new SimpleFlooredSubmap([-5491, 7699], doorIconImage, 'Kakariko Sanctuary', [
                ["Shad Dominion Rod"],
                [
                   "Renados Letter",
                   "Ilia Memory Reward"
                ]
            ], {floorOffset: 2}),
            new SimpleSubmap([-5711, 6043], entranceIconImage, 'Eldin Lantern Cave', [
                "Eldin Lantern Cave First Chest",
                "Eldin Lantern Cave Second Chest",
                "Eldin Lantern Cave Lantern Chest",
                "Eldin Lantern Cave Poe",
                Bottle.YellowChu.new([-5604, 5704])
            ]),
            newGrotto(2, [-5607, 6282], "Kakariko Gorge Keese Grotto", [

            ]),
            newGrotto(1, [-3772, 6334], "Eldin Field Bomskit Grotto", [
                "Eldin Field Bomskit Grotto Left Chest",
                "Eldin Field Bomskit Grotto Lantern Chest",
                Bottle.RareChu.new([-3676, 6313]),
                Bottle.Worm.new([-3796, 6315])
            ]),
            newGrotto(5, [-3249, 7223], "Eldin Field Fishing Grotto", [
                "Eldin Field Bomskit Grotto Lantern Chest",
                Bottle.BeeLarva.new([-2941, 7190])
            ]),
            new SimpleFlooredSubmap([-2400, 7597], entranceIconImage, "Eldin Stockcave", [
                [
                    "Eldin Stockcave Lantern Chest",
                    "Eldin Stockcave Lowest Chest"
                ],
                ["Eldin Stockcave Upper Chest"],
                [],
                []
            ]),
            newGrotto(2, [-1543, 7011], "Eldin Field Stalfos Grotto", [
                "Eldin Field Stalfos Grotto Left Small Chest",
                "Eldin Field Stalfos Grotto Right Small Chest",
                "Eldin Field Stalfos Grotto Stalfos Chest",
            ]),
            new SimpleSubmap([-2211, 6585], doorIconImage, "Impaz's House", [
                "Skybook From Impaz"
            ]),
    ]),
    Desert: new Province("Desert", [-5440, 2224], {baseReqs: [Requirement.fromBoolItem(aurusMemo)]}, [
            [-6646, 3472], [-6704, 2448], [-6584, 1152], [-6208, 880], [-5240, 1000], [-3668, 1256], [-3480, 1804], [-3646, 2242], 
            [-3804, 2924], [-3840, 3154], [-4984, 3264], [-5116, 3148], [-5280, 3184], [-5472, 3256], [-5640, 3424], [-5953, 3742],
            [-6336, 3736]
        ], [
            "Gerudo Desert Golden Wolf",
            "Gerudo Desert East Poe",
            "Gerudo Desert East Canyon Chest",
            "Gerudo Desert Peahat Ledge Chest",
            "Gerudo Desert Lone Small Chest",
            "Gerudo Desert Male Dayfly",
            "Gerudo Desert Female Dayfly",
            "Gerudo Desert West Canyon Chest",
            "Gerudo Desert Poe Above Cave of Ordeals",
            "Gerudo Desert North Peahat Poe",
            "Gerudo Desert Campfire North Chest",
            "Gerudo Desert Campfire West Chest",
            "Gerudo Desert Campfire East Chest",
            "Gerudo Desert Northwest Chest Behind Gates",
            "Gerudo Desert Northeast Chest Behind Gates",
            "Gerudo Desert South Chest Behind Wooden Gates",
            "Gerudo Desert North Small Chest Before Bulblin Camp",
            "Bulblin Camp First Chest Under Tower At Entrance",
            "Bulblin Camp Small Chest in Back of Camp",
            "Bulblin Camp Roasted Boar",
            "Bulblin Guard Key",
            "Outside Arbiters Grounds Poe",
            "Outside Arbiters Grounds Lantern Chest",
            "Bulblin Camp Poe",
            "Outside Bulblin Camp Poe",
            "Gerudo Desert Owl Statue Sky Character",
            "Gerudo Desert Owl Statue Chest",
            "Bulblin_Camp_Sign",
            "Gerudo_Desert_Sign",
            newGrotto(4, [-6060, 2588], "Gerudo Desert Skulltula Grotto", [
                "Gerudo Desert Skulltula Grotto Chest"
            ]),
            newGrotto(3, [-5689, 638], "Gerudo Desert Chu Grotto", [
                Bottle.RareChu.new([-5579, 809])
            ]),
            newGrotto(3, [-5075, 1380], "Gerudo Desert Rock Grotto", [
                "Gerudo Desert Rock Grotto First Poe",
                "Gerudo Desert Rock Grotto Second Poe",
                "Gerudo Desert Rock Grotto Lantern Chest"
            ]),
            new CaveOfOrdeals([-6116, 503], entranceIconImage, [
                ["Cave_of_Ordeals_Sign"], // B1
                [], // B2
                [], // B3
                [], // B4
                [], // B5
                [], // B6
                [], // B7
                [], // B8
                [], // B9
                [], // B10
                [], // B11
                [Bottle.PurpleChu.new([-6305, 273])], // B12
                [], // B13
                ["Cave of Ordeals Floor 14 Orange Rupee"], // B14
                [], // B15
                [], // B16
                ["Cave of Ordeals Floor 17 Poe"], // B17
                [], // B18
                [   // B19
                    Bottle.RareChu.new([-5920, 251]),
                    Bottle.BlueChu.new([-5980, 175]),
                    Bottle.RedChu.new([-5881, 175]),
                    Bottle.PurpleChu.new([-5920, 330]),
                ],
                [], // B20
                [], // B21
                [], // B22
                [], // B23
                [], // B24
                [], // B25
                [], // B26
                [], // B27
                [], // B28
                [], // B29
                [], // B30
                [], // B31
                [], // B32
                ["Cave of Ordeals Floor 33 Poe"], // B33                
                [ // B34
                    Bottle.YellowChu.new([-5988, 684]),
                    Bottle.PurpleChu.new([-5920, 732]),
                    Bottle.RedChu.new([-5988, 780]),
                ], 
                [], // B35
                [], // B36
                [], // B37
                [], // B38
                ["Cave of Ordeals Floor 39 Silver Rupee"], // B39
                [], // B40
                [], // B41
                [], // B42
                [], // B43
                ["Cave of Ordeals Floor 44 Poe"], // B44
                [   // B45
                    Bottle.BlueChu.new([-6265, 807]),
                    Bottle.RedChu.new([-6335, 807]),
                    Bottle.PurpleChu.new([-6300, 765]),
                ], 
                [], // B46
                [], // B47
                [], // B48
                [], // B49
                ["Cave of Ordeals Great Fairy Reward"], // B50  
            ])
    ]),

    Peak: new Province('Peak', [-1744, 3488], {baseReqs: [stallordReq], randoReqs:[]}, [
        [-712, 5344], [-1132, 5392], [-1296, 5360], [-1548, 5152], [-1690, 4891], [-1892, 4804], [-2076, 4624], [-2564, 4404], 
            [-2704, 4220], [-3036, 4080], [-3624, 3880], [-3812, 3184], [-3636, 2272], [-3436, 1720], [-2668, 1568], [-2092, 1804], 
            [-1696, 2288], [-852, 2616], [-620, 3676], [-584, 4612]
    ], [
        "Ashei Sketch",
        "Snowpeak Blizzard Poe",
        "Snowpeak Above Freezard Grotto Poe",
        "Snowpeak Poe Among Trees",
        "Snowpeak Icy Summit Poe",
        "Snowboard Racing Prize",
        "Snowpeak Cave Ice Poe",
        "Snowpeak Cave Ice Lantern Chest",
        "Snowpeak Howling Stone",
        "Snowpeak_Mountain_Sign",
        newGrotto(4, [-405, 3690], "Snowpeak Freezard Grotto", [
            "Snowpeak Freezard Grotto Chest"
        ]),
        newGrotto(3, [-390, 3350], "Snowpeak Chu Grotto", [
            Bottle.RareChu.new([-416, 3048])
        ]),
    ]),
    Lanayru: new Province('Lanayru', [-2192, 5984], {baseReqs: [fyrusReq, bombBagReq], randoReqs: []}, [[
        [-5400, 5584], [-5360, 6000], [-5056, 5968], [-4640, 6248], [-4312, 6336], [-3696, 6344], [-3528, 6472], [-3424, 6728], 
        [-3280, 6968], [-2992, 7104], [-2760, 7048], [-2096, 7072], [-1248, 7328], [-800, 7216], [-584, 6768], [-480, 6368], 
        [-504, 5832], [-606, 5444], [-722, 5358], [-1104, 5408], [-1288, 5376], [-1554, 5161], [-1704, 4896], [-1894, 4812], 
        [-2077, 4634], [-2539, 4431], [-2749, 4205], [-3632, 3892], [-3764, 3420], [-3820, 3180], [-4288, 3200], [-4974, 3290],
        [-5081, 3201], [-5319, 3218], [-5592, 3400], [-5936, 3768], [-5813, 4728], [-5776, 4750], [-5624, 4872], [-5552, 5096]
    ], hyruleCastlePolygonPoints], [
        "Zoras Domain Chest By Mother and Child Isles",
        "Zoras Domain Chest Behind Waterfall",
        "Lake Hylia Underwater Chest",
        "Lake Hylia Bridge Male Mantis",
        "Lake Hylia Bridge Female Mantis",
        "West Hyrule Field Female Butterfly",
        "West Hyrule Field Male Butterfly",
        "Lanayru Field Male Stag Beetle",
        "Lanayru Field Female Stag Beetle",
        "Lanayru Field Behind Gate Underwater Chest",
        "Zoras Domain Extinguish All Torches Chest",
        "Zoras Domain Light All Torches Chest",
        "Zoras Domain Male Dragonfly",
        "Upper Zoras River Female Dragonfly",
        "Fishing Hole Bottle",
        "Fishing Hole Heart Piece",
        "Iza Helping Hand",
        "Iza Raging Rapids Minigame",
        "Outside South Castle Town Female Ladybug",
        "Outside South Castle Town Male Ladybug",
        "West Hyrule Field Golden Wolf",
        "East Castle Town Bridge Poe",
        "Outside South Castle Town Tightrope Chest",
        "Outside South Castle Town Fountain Chest",
        "Outside South Castle Town Poe",
        "Lake Hylia Bridge Vines Chest",
        "Isle of Riches Poe",
        "Flight By Fowl Fifth Platform Chest",
        "Flight By Fowl Fourth Platform Chest",
        "Flight By Fowl Third Platform Chest",
        "Flight By Fowl Second Platform Chest",
        "Flight By Fowl Top Platform Reward",
        "Outside Lanayru Spring Left Statue Chest",
        "Outside Lanayru Spring Right Statue Chest",
        "Outside South Castle Town Golden Wolf",
        "Plumm Fruit Balloon Minigame",
        "Zoras Domain Underwater Goron",
        "Zoras Domain Waterfall Poe",
        "Zoras Domain Mother and Child Isle Poe",
        "Lanayru Field Bridge Poe",
        "Upper Zoras River Poe",
        "Lake Hylia Bridge Cliff Chest",
        "Lake Hylia Bridge Cliff Poe",
        "Lake Hylia Alcove Poe",
        "Lake Hylia Dock Poe",
        "Lake Hylia Tower Poe",
        "Flight By Fowl Ledge Poe",
        "Charlo Donation Blessing",
        "Auru Gift To Fyer",
        "Lanayru Field Spinner Track Chest",
        "Hyrule Field Amphitheater Poe",
        "Doctors Office Balcony Chest",
        "Wooden Statue",
        "North Castle Town Golden Wolf",
        "Lake Hylia Bridge Owl Statue Sky Character",
        "Lake Hylia Bridge Owl Statue Chest",
        "Hyrule Field Amphitheater Owl Statue Sky Character",
        "Hyrule Field Amphitheater Owl Statue Chest",
        "Outside South Castle Town Double Clawshot Chasm Chest",
        "Upper Zoras River Howling Stone",
        "Lake Hylia Howling Stone",
        "Lake Hylia Bridge South Rupee Boulder",
        "Lake Hylia Bridge North Rupee Boulder",
        "West Hyrule Field East Rupee Boulder",
        "West Hyrule Field North Rupee Boulder",
        "Lanayru Field West Corner Rupee Boulder",
        "Zoras Domain Tunnel East Rupee Boulder",
        "Zoras Domain Tunnel West Rupee Boulder", 
        "Zoras Domain Underwater North Rupee Boulder",
        "Zoras Domain Underwater South Rupee Boulder",
        "Zoras Domain Throne Room Rupee Boulder",
        "Upper Zoras River Trench Rupee Boulder",
        "Upper Zoras River Gate Rupee Boulder",
        "Upper Zoras River Tunnel Rupee Boulder",
        "Lanayru Field North Underwater Rupee Boulder",
        "Lanayru Field South Underwater Rupee Boulder",
        "Lanayru Field Spinner Track Rupee Boulder",
        "Lake Hylia Bridge Spinner Track Rupee Boulder",
        "Outside South Castle Town Rupee Boulder",
        "Upper Zoras River Above Water Rupee Boulder",
        "Lake Hylia West Underwater Rupee Boulder",
        "Lake Hylia East Underwater Rupee Boulder",
        "Agithas_Castle_Sign",
        "Beside_Castle_Town_Sign",
        "Castle_Town_Sign",
        "Great_Bridge_of_Hylia_Sign",
        "Jovani_House_Sign",
        "Lake_Hylia_Sign",
        "Lanayru_Field_Sign",
        "South_of_Castle_Town_Sign",
        "Upper_Zoras_River_Sign",
        "Zoras_Domain_Sign",
        horseGrass.new([-4268, 3152]),
        hawkGrass.new([-5218, 2926]),
        hawkGrass.new([-4901, 3895]),
        Bottle.BeeLarva.new([-614, 5775]),
        Bottle.Fairy.new([-5488, 3116]),
        Bottle.RareChu.new([-5353, 3456]),
        new SimpleFlooredSubmap([-4147, 4586], doorIconImage, "Agitha's Castle",[[
            "Agitha Male Ant Reward",
            "Agitha Female Ant Reward",
            "Agitha Male Dayfly Reward",
            "Agitha Female Dayfly Reward", 
            "Agitha Male Beetle Reward",
            "Agitha Female Beetle Reward", 
            "Agitha Male Mantis Reward",
            "Agitha Female Mantis Reward",
            "Agitha Male Stag Beetle Reward",
            "Agitha Female Stag Beetle Reward",
            "Agitha Male Pill Bug Reward",
            "Agitha Female Pill Bug Reward",
            "Agitha Male Butterfly Reward",
            "Agitha Female Butterfly Reward",
            "Agitha Male Ladybug Reward",
            "Agitha Female Ladybug Reward",
            "Agitha Male Snail Reward",
            "Agitha Female Snail Reward",
            "Agitha Male Phasmid Reward",
            "Agitha Female Phasmid Reward",
            "Agitha Male Grasshopper Reward",
            "Agitha Female Grasshopper Reward", 
            "Agitha Male Dragonfly Reward",
            "Agitha Female Dragonfly Reward",
        ], [

        ]]),
        new SimpleSubmap([-4057, 4837], doorIconImage, "Jovani's House", [
            "Jovani House Poe",
            "Jovani 20 Poe Soul Reward",
            "Jovani 60 Poe Soul Reward",
        ]),
        new SimpleSubmap([-4035, 4573], doorIconImage, 'STAR Tent', [
            "STAR Prize 1",
            "STAR Prize 2"
        ]),
        new SimpleSubmap([-4060, 4759], doorIconImage, 'Malo Mart Castle Branch', [
            "Castle Town Malo Mart Magic Armor",
        ]),
        new SimpleFlooredSubmap([-4141, 4795], doorIconImage, "Telma's Bar", [
            [
                "Telma Invoice",
                postman.new([-4282, 4523])
            ],
            []
        ]),
        new SimpleSubmap([-3940, 4930], doorIconImage, "Doctor's Office", [

        ]),
        new SimpleFlooredSubmap([-4090, 4656], doorIconImage, 'Castle Goron Merchants', [
            [],
            []
        ]),
        new SimpleSubmap([-4147, 4643], doorIconImage, "Fanadi's Palace", [

        ]),
        new SimpleSubmap([-612, 5828], doorIconImage, "Hena's Shop", [

        ]),
        newGrotto(1, [-3733, 3820], "West Hyrule Field Helmasaur Grotto", [
            "West Hyrule Field Helmasaur Grotto Chest"
        ]),
        newGrotto(4, [-2121, 4843], "Lanayru Field Skulltula Grotto", [
            "Lanayru Field Skulltula Grotto Chest"
        ]),
        newGrotto(1, [-2605, 4189], "Lanayru Field Poe Grotto", [
            "Lanayru Field Poe Grotto Left Poe",
            "Lanayru Field Poe Grotto Right Poe"
        ]),
        newGrotto(3, [-2812, 5187], "Lanayru Field Chu Grotto", [

        ]),
        newGrotto(4, [-5696, 3751], "Lake Hylia Bridge Bubble Grotto", [
            "Lake Hylia Bridge Bubble Grotto Chest"
        ]),
        newGrotto(5, [-5499, 3045], "Lake Hylia Water Toadpoli Grotto", [
            "Lake Hylia Water Toadpoli Grotto Chest",
            Bottle.BeeLarva.new([-5191, 2990])
        ]),
        newGrotto(5, [-4614, 2875], "Lake Hylia Shell Blade Grotto", [
            "Lake Hylia Shell Blade Grotto Chest"
        ]),
        newGrotto(5, [-4551, 4937], "Outside South Castle Town Tektite Grotto", [
            "Outside South Castle Town Tektite Grotto Chest",
            Bottle.BeeLarva.new([-4238, 4905])
        ]),
        new SimpleSubmap([-5259, 3502], entranceIconImage, 'Lanayru Spring', [
            "Lanayru Spring Underwater Left Chest",
            "Lanayru Spring Underwater Right Chest",
            "Lanayru Spring Back Room Left Chest",
            "Lanayru Spring Back Room Right Chest",
            "Lanayru Spring Back Room Lantern Chest",
            "Lanayru Spring West Double Clawshot Chest",
            "Lanayru Spring East Double Clawshot Chest",
            "Lanayru Spring Underwater North Rupee Boulder",
            "Lanayru Spring Underwater South Rupee Boulder",
            "Lanayru_Spring_Sign"
        ]),
        new SimpleSubmap([-5546, 3134], entranceIconImage, 'Lake Lantern Cave', [
            "Lake Lantern Cave First Chest",
            "Lake Lantern Cave Second Chest",
            "Lake Lantern Cave Third Chest",
            "Lake Lantern Cave First Poe",
            "Lake Lantern Cave Fourth Chest",
            "Lake Lantern Cave Fifth Chest",
            "Lake Lantern Cave Sixth Chest",
            "Lake Lantern Cave Seventh Chest",
            "Lake Lantern Cave Eighth Chest",
            "Lake Lantern Cave Ninth Chest",
            "Lake Lantern Cave Tenth Chest",
            "Lake Lantern Cave Second Poe",
            "Lake Lantern Cave Eleventh Chest",
            "Lake Lantern Cave Twelfth Chest",
            "Lake Lantern Cave Thirteenth Chest",
            "Lake Lantern Cave Fourteenth Chest",
            "Lake Lantern Cave Final Poe",
            "Lake Lantern Cave End Lantern Chest",
            "Lake_Lantern_Cave_Sign"
        ]),
        new SimpleSubmap([-2025, 4818], entranceIconImage, 'Lanayru Ice Cave', [
            "Lanayru Ice Block Puzzle Cave Chest"
        ]),
    ]),
    Castle: new DungeonProvince(Dungeons.Castle, [-3584, 5440], hyruleCastlePolygonPoints)
});


