var trackedItems = [
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
    castleSK, castleBK, faronKey
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
    }
    setElem(elem) {
        this.elem = elem;
        elem.addEventListener('click', () => { 
            this.item.increase(); 
            this.update();
        });
        elem.addEventListener('contextmenu', () => { 
            this.item.decrease(); 
            this.update();
        });
        if (elem.classList.contains('tboss')) {
            elem.addEventListener('auxclick', (e) => { 
                if (e.button == 1) {
                    e.preventDefault();
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
                    e.preventDefault();
                    this.reset();
                }
            }); 
        }
    }
    initialize() {
        let storedValue = this.storageUnit.getFlagAsNumber(this);
        let maxValue = this.item.getMaxState();
        if (storedValue < maxValue / 2) {
            for (let _ = 0; _ < storedValue; ++_)
                this.elem.dispatchEvent(new MouseEvent('click')); //Simulate click
        }
        else {
            for (let _ = maxValue; _ >= storedValue; --_)
                this.elem.dispatchEvent(new MouseEvent('contextmenu')); //Simulate right click
        }
        this.initialized = true;
    }
    update() {
        this.updateElementBrightness();
        if (this.item instanceof ProgressiveItem)
            this.updateElementImage();
        else if (this.item instanceof CountItem || this.item instanceof CountRequiredItem)
            this.updateElementCounter();
        if (this.initialized) 
            this.storageUnit.setFlag(this);
        dispatchTrackerUpdate();
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
    updateElementCounter() {
        let counterElem = this.elem.children[2];
        let currentItemState = this.item.getState();
        let maxItemState = this.item.getMaxState();

        if (currentItemState == 0) {
            counterElem.style.display = 'none'; //Hide counter
            return;
        }

        counterElem.innerHTML = currentItemState; // Update Counter
        if (currentItemState == maxItemState) {
            counterElem.style.display = 'inline'; //Show counter
            counterElem.style.color = "#50C878"; // Change color to green
        }
        else if (currentItemState == 1) {
            counterElem.style.display = 'inline'; //Show Counter
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
    reset() {
        this.item.reset();
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
        if (parentElement.style.visibility === "visible" || parentElement.classList.contains("tdungeon") || window.getComputedStyle(document.getElementById('tracker')).visibility === "hidden") {
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
    increase() {
        this.manageParentSubmenu(() => this.elem.click());  
    }
    decrease() {
        this.manageParentSubmenu(() => this.elem.dispatchEvent(new MouseEvent('contextmenu')));
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
            this.increase();
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
            this.decrease();
    }
}

// Assign Items to TrackerItems
var trackerItems = new Map();
for (let item of trackedItems) {
    let imageSrc = item.getBaseImageSrc();
    // Harcoded exceptions for items with duplicate images
    // Should use item names for all but too lazy to put data-item on all .titem Divs
    if (imageSrc.includes('Small_Key.png') || imageSrc.includes('Boss_Key.png'))
        trackerItems.set(item.name, new TrackerItem(item));   
    else
        trackerItems.set(imageSrc, new TrackerItem(item));       
}
// Assign .titem Divs to TrackerItems
for (let titemDiv of document.querySelectorAll('.titem')) {
    // Check if titemDiv has assigned item
    if ("item" in titemDiv.dataset) 
        trackerItems.get(titemDiv.dataset.item).setElem(titemDiv);
    else {
        trackerItems.get("Icons/" + titemDiv.getElementsByClassName('timage')[0].src.split("Icons/")[1]).setElem(titemDiv);
    }
}
// Create StorageUnit for TrackerItems
var trackerSU = new StorageUnit("tracker", trackerItems.values());
// Initialize TrackerItems
for (let trackerItem of trackerItems.values()) 
    trackerItem.initialize();


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