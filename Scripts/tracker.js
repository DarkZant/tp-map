var trackedItems = [
    fishingRods, slingshot, lantern, boomerang, ironBoots, bow, hawkeye, 
    bombBag, giantBombBag,  clawshots, aurusMemo, spinner, asheisSketch, 
    ballAndChain, dominionRods, horseCall, iliasCharm, renadosLetter, invoice,
    woodenStatue, bottle, skybook, swords, shields, zoraArmor, magicArmor,
    heartPiece, heartContainer, wallets, scents, hiddenSkills, poeSoul,
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
        document.dispatchEvent(new CustomEvent('trackerUpdated'));
    }
    updateElementBrightness() {
        let currentItemState = this.item.getState();
        if (currentItemState == 0) {
            this.elem.style.filter = "brightness(50%)";
        }   
        else if (currentItemState == 1 || currentItemState == this.item.getMaxState()) {
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
    increase() {
        if (this.item instanceof BoolItem && this.item.hasParentItem())
            this.item.parentItem.tracker.increase();
        else
            this.elem.click();
    }
    decrease() {
        if (this.item instanceof BoolItem && this.item.hasParentItem())
            this.item.parentItem.tracker.decrease();
        else
            this.elem.dispatchEvent(new MouseEvent('contextmenu'));
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

function resetTracker() {
    for (let trackerItem of trackerItems.values()) 
        trackerItem.reset();
    for (let requiredElem of document.querySelectorAll('.tdungeon span')) {
        if (requiredElem.style.display === 'inline')
            requiredElem.style.display = 'none';
    }
}