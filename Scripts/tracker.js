let trackedItems = [
    fishingRods, slingshot, lantern, boomerang, ironBoots, bow, hawkeye, 
    bombBag, giantBombBag,  clawshots, aurusMemo, spinner, asheisSketch, 
    ballAndChain, dominionRods, horseCall, iliasCharm, renadosLetter, invoice,
    woodenStatue, bottle, skybook, swords, woodenShields, hylianShield, zoraArmor, 
    magicArmor, heartPiece, heartContainer, wallets, scents, hiddenSkills, poeSoul,
    fusedShadow, mirrorShard, shadowCrystal, coroKey, bulblinKey, gateKey,
    antM, antF, dayflyM, dayflyF, beetleM, beetleF, mantisM, mantisF, 
    stagBeetleM, stagBeetleF, pillbugM, pillbugF, butterflyM, butterflyF,
    ladybugM, ladybugF, snailM, snailF, phasmidM, phasmidF, grasshopperM,
    grasshopperF, dragonflyM, dragonflyF, forestSK, forestBK, diababa, minesSK,
    minesBK, fyrus, lakebedSK, lakebedBK, morpheel, arbiterSK, arbiterBK, 
    stallord, snowpeakSK, snowpeakBK, pumpkin, cheese, blizzeta, templeSK, 
    templeBK, armogohma, citySK, cityBK, argorok, palaceSK, palaceBK, zant,
    castleSK, castleBK, faronKey,  ganondorf, forestMap, forestCompass, minesMap, 
    minesCompass, lakebedMap, lakebedCompass, arbiterMap, arbiterCompass, 
    snowpeakMap, snowpeakCompass, templeMap, templeCompass, cityMap, cityCompass,
    palaceMap, palaceCompass, castleMap, castleCompass
]; // Always add items at the end to preserve storage IDs


function dispatchTrackerUpdate() {
    document.dispatchEvent(new CustomEvent('trackerUpdated'));
}

class TrackerItem extends Storable {
    constructor(item) {
        super();
        this.item = item;
        this.item.tracker = this;
        this.initialized = false;
        this.showCounterState = 1;
        this.counterStateOffset = 0;
    }
    setElem(elem) {
        this.elem = elem;
        elem.addEventListener('click', () => {
            this.increase();
            pushGAEvent('tracker_click');
        });
        elem.addEventListener('contextmenu', () => {
            this.decrease();
            pushGAEvent('tracker_click');
        });
        if (elem.classList.contains('tboss')) {
            elem.addEventListener('auxclick', (e) => { 
                if (e.button == 1) {
                    pushGAEvent('tracker_click');
                    let requiredElem = elem.parentElement.getElementsByTagName('span')[0];
                    if (requiredElem.style.display === 'inline')
                        requiredElem.style.display = 'none';
                    else 
                        requiredElem.style.display = 'inline';
                }
            }); 
        }
        else {
            elem.addEventListener('auxclick', (e) => { 
                if (e.button == 1) {
                    pushGAEvent('tracker_click');
                    this.reset();
                }
            }); 
        }
    }
    increase() {
        this.item.increase(); 
        this.update();
    }
    decrease() {
        this.item.decrease(); 
        this.update();
    }
    initialize(storedValue=this.storageUnit.getFlagAsNumber(this)) {
        if (this.item.state === storedValue) {
            this.update();
            this.initialized = true;
            return;
        }
        
        let maxValue = this.item.getMaxState();
        if (storedValue < maxValue / 2) {
            for (let _ = 0; _ < storedValue; ++_)
                this.increase();
        }
        else {
            for (let _ = maxValue; _ >= storedValue; --_)
                this.decrease();
        }
        this.initialized = true;
    }
    update() {
        this.updateElementBrightness();
        if (this.item instanceof ProgressiveItem)
            this.updateElementImage();
        else if (this.item instanceof CountItem || this.item instanceof CountRequiredItem)
            this.updateElementCounter();
        if (this.initialized) {
            dispatchTrackerUpdate();
            this.save();
        }
    }
    save() {
        this.storageUnit.setFlag(this);
    }
    updateElementBrightness() {
        let currentItemState = this.item.getState();
        if (currentItemState == 0) {
            this.elem.style.filter = "brightness(50%)";
        }   
        else {
            this.elem.style.filter = "none";
        }
    }
    setShowCounterState(state) {
        this.showCounterState = state;
        this.counterStateOffset = state - 1;
    }
    updateElementCounter() {
        let counterElem = this.elem.children[2];
        let currentItemState = this.item.getState();
        let maxItemState = this.item.getMaxState();

        if (currentItemState < this.showCounterState) {
            counterElem.style.display = 'none'; // Hide counter
            return;
        }

        counterElem.innerHTML = currentItemState - this.counterStateOffset; // Update Counter
        if (currentItemState == maxItemState) {
            counterElem.style.display = 'inline'; // Show counter
            counterElem.style.color = "#50C878"; // Change color to green
        }
        else if (currentItemState == this.showCounterState) {
            counterElem.style.display = 'inline'; // Show counter
            this.elem.children[2].style.color = "#c0c0c0"; // Set color to white
        } 
        else if (currentItemState == maxItemState - 1) {
            this.elem.children[2].style.color = "#c0c0c0"; // Set color to white
        }
    }
    showHighestObtained() {
        this.item.updateStateToHighestObtainedItem();
        this.update();
    }
    resetItem() {
        this.item.reset();
    }
    reset() {
        this.resetItem();
        this.update();
    }
    updateElementImage() {
        let imgElem = this.elem.children[1];
        let imgSrc = imgElem.src;
        let itemState = this.item.getState();
        imgElem.src = imgSrc.slice(0, -5) + 
        (itemState == 0 ? 0 : itemState - 1) + imgSrc.slice(-4); 
    }
    isInSubmenu() {
        return this.elem.parentElement.id !== "mainTracker" || this.elem.parentElement.classList.contains('tdungeon');
    }
    getDefaultStoreValue() {
        return this.item.getMinState();
    }
    getCurrentStoreValue() {
        return this.item.getState();
    }
    getMaxStoreValue() {
        return this.item.getMaxState();
    }
    // Map Features
    displayParentSubmenu(func) {
        let parentElement = this.elem.parentElement;
        let mainTracker = document.getElementById('mainTracker');
        if (parentElement.style.visibility === "visible" || parentElement.classList.contains("tdungeon") || 
            window.getComputedStyle(document.getElementById('tracker')).visibility === "hidden") {
            func();
            return;
        }

        let openedSubmenuID = mainTracker.submenuID
        if (openedSubmenuID !== undefined) 
            mainTracker.click();
        
        showTrackerSubmenu(parentElement.id);
        setTimeout(func, 1000);
        setTimeout(() => hideTrackerSubmenu(parentElement), 2000);

        if (openedSubmenuID !== undefined)
            setTimeout(() => showTrackerSubmenu(openedSubmenuID), 2500);
    }
    displayMainTracker(func) {
        let mainTracker = document.getElementById('mainTracker');
        let submenuID = mainTracker.submenuID;
        if (submenuID === undefined) {
            func();
            return;
        }
        mainTracker.click();
        setTimeout(func, 1000);
        setTimeout(() => showTrackerSubmenu(submenuID), 2000);
    }
    manageParentSubmenu(func) {
        if (blockMapReset || Settings.DisableTrackerAnims.isEnabled()) {
            func();
            return;
        }

        if (this.isInSubmenu())
            this.displayParentSubmenu(func)
        else 
            this.displayMainTracker(func);
    }
    mapIncrease() {
        this.manageParentSubmenu(() => this.increase());  
    }
    mapDecrease() {
        this.manageParentSubmenu(() => this.decrease());
    }
    itemIsProgressiveInBaseGame() {
        return !randoIsActive() && this.item.constructor === ProgressiveItem; // False if Subclass of ProgressiveItem
    }
    obtainItem(obtainedItem) {
        if (this.item instanceof OrItem) {
            this.manageParentSubmenu(() => {
                this.item.obtainItem(obtainedItem); 
                this.update();
            });
        }
        else if (this.itemIsProgressiveInBaseGame()) {
            obtainedItem.obtain();
            this.manageParentSubmenu(() => this.showHighestObtained());
        }
        else 
            this.mapIncrease();
    }
    unobtainItem(unobtainedItem) {
        if (this.item instanceof OrItem) {
            this.manageParentSubmenu(() => {
                this.item.unobtainItem(unobtainedItem); 
                this.update();
            });
        }
        else if (this.itemIsProgressiveInBaseGame()) {
            unobtainedItem.reset();
            this.manageParentSubmenu(() => this.showHighestObtained());
        }
        else 
            this.mapDecrease();
    }
}

let trackerItems = new Map();
let trackerSUName = "tracker";

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

let skybookTracker = skybook.getTracker().setShowCounterState(2);

function initializeMapTracker() {
    trackerSU = new StorageUnit(trackerSUName, trackerItems.values());
    // Create StorageUnit for TrackerItems
    // Initialize TrackerItems
    for (let trackerItem of trackerItems.values()) 
        trackerItem.initialize();
}


function showTrackerSubmenu(submenuID) {
    let menu = document.getElementById(submenuID);
    menu.style.display = "flex";
    menu.style.visibility = "visible";

    document.getElementById('tracker').style.backgroundColor = "rgba(14, 13, 12, 0.85)";

    let trackerX = document.getElementById('traX');
    trackerX.style.color = "#1D1D1D";
    trackerX.classList.add('disabled');

    let mainTracker = document.getElementById('mainTracker');
    mainTracker.style.filter = "brightness(25%)";
    mainTracker.submenuID = submenuID;
    for (let child of mainTracker.children) 
        child.classList.add('disabled');
 
    setTimeout(function () {
        mainTracker.addEventListener('click', hideTrackerSubmenuHandler); 
    }, 100);  
}   

function hideTrackerSubmenu(submenu) {
    submenu.style.display = "none";
    submenu.style.visibility = "hidden";

    document.getElementById('tracker').style.backgroundColor = "rgb(56, 53, 46, 0.85)";

    let trackerX = document.getElementById('traX');
    trackerX.style.color = "#757575";
    trackerX.classList.remove('disabled');

    let mainTracker = document.getElementById('mainTracker');
    mainTracker.style.filter = "none";
    mainTracker.submenuID = undefined;
    for (let child of mainTracker.children) 
        child.classList.remove('disabled');

    mainTracker.removeEventListener('click', hideTrackerSubmenuHandler);
}

function hideTrackerSubmenuHandler() {
    hideTrackerSubmenu(document.getElementById(this.submenuID));
}

function resetTracker() {
    for (let trackerItem of trackerItems.values()) 
        trackerItem.reset();
    for (let requiredElem of document.querySelectorAll('.tdungeon span')) {
        if (requiredElem.style.display === 'inline')
            requiredElem.style.display = 'none';
    }
}

function hideUnshowableTrackerItems() {
    // Hide titem divs for which there is no space in the tracker
    let mapAndCompassDivs = document.querySelectorAll('.titem:has(img[src*="Dungeon_Map"], img[src*="Compass"])');
    mapAndCompassDivs.forEach(div => {
        div.style.display = "none";
    });
    document.getElementById('gabon').style.display = "none";
}