class Flag extends Storable {
    constructor(item, position, { 
            itemCategory=item.getCategory(), baseReqs=[], baseDesc="No description given", 
            randoCategory=itemCategory, randoReqs=baseReqs, randoDesc=baseDesc,
            glitchedReqs=randoReqs, glitchedDesc=randoDesc
        } = {}
    ) 
    {
        super();
        this.item = item;
        this.position = position;
        this.itemCategory = itemCategory;
        this.baseReqs = baseReqs;   
        this.baseDesc = baseDesc;
        // Default category if it's a chest for Rando
        if (this.isContainer() && this.item.image.src.includes('Chest') && randoCategory === itemCategory)
            randoCategory = Categories.Main;
        this.randoCategory = randoCategory;
        this.randoReqs = randoReqs;
        this.randoDesc = randoDesc;
        this.glitchedReqs = glitchedReqs;
        this.glitchedDesc = glitchedDesc;
        
        this._set = false;
        this._junk = false;
    }
    initialize() {
        let storedValue = this.storageUnit.getFlagAsNumber(this);
        if (storedValue === 2)
            this._junk = true;
        else 
            this._set = storedValue === 1;         
        this.initializeMarker();
    }
    getImage() {
        return this.item.getImage();
    }
    getCurrentItem() {
        if (this.hasRandoItem() && randoIsActive() && this.randoItemIsRevealed()) {
            return this.randoItem;
        }

        return this.item;
    }
    getMarkerImage() {
        let item = this.getCurrentItem();
        if (this.isContainer() && (Settings.ChestsContent.isEnabled() || this.randoItemIsRevealed()))
            item = item.getContent();
        if (item instanceof ProgressiveItem) 
            return this.isSet() ? item.getCurrentItemImage() : item.getNextItemImage();
        return item.getImage();
    }
    setName(name) {
        this.name = name;
    }
    setItem(item) {
        this.item = item;
        this.itemCategory = item.getCategory();
        let icon = getIcon(this.getImage());
        this.marker.setIcon(icon);
        if (this.isSet())
            this.setVisually();
        else if (this.isJunk())
            this.junkVisually();
    }
    setRandoItem(item) {
        if (this.isContainer())
            this.randoItem = this.item.with(item);
        else
            this.randoItem = item;
        this.randoItemCategory = item.getCategory();
    }
    resetRandoItem() {
        if (this.hasRandoItem())
            this.randoItem = undefined;
    }
    setRandoDescription(description) {
        this.randoDesc = description;
        this.glitchedDesc = description;
    }
    isContainer() {
        return this.item instanceof Container;
    }
    hasRandoItem() {
        return this.randoItem !== undefined;
    }
    randoItemIsRevealed() {
        return randoIsActive() && (Settings.RevealSpoilerLog.isEnabled() || Settings.RevealSetJunkFlags.isEnabled() && (this.isSet() || this.isJunk()))
    }
    set() {
        if (this.isSet())
            return;
        if (this.isJunk())
            this._junk = false;
        this._set = true;
        this.onSetChange();
        if (this.parentGroup) 
            this.parentGroup.increaseAmount();
    }
    unset() {
        if (this.isJunk()) {
            this._junk = false;
            this.onJunkChange();
            return;
        }
        if (!this.isSet())
            return;
        this._set = false;
        this.onSetChange();
        if (this.parentGroup) 
            this.parentGroup.decreaseAmount();
    }
    onSetChange() {
        this.storageUnit.setFlag(this);
        this.manageItemTracker();
        this.manageFlagRequirements();
        updateTotalCounter();
    }
    isSet() {
        return this._set;
    }
    setAsJunk() {
        if (this.isJunk() || !this.isJunkable())
            return;
        this._junk = true;
        this.onJunkChange();
    }
    unsetAsJunk() {
        if (!this.isJunk() || this.isSet())
            return;
        this._junk = false;
        this.onJunkChange();
    }
    onJunkChange() {
        this.storageUnit.setFlag(this);
        updateTotalCounter();
    }
    isJunk() {
        return this._junk;
    }
    isJunkable() {
        return !this.isSet() && randoIsActive() && this.isRandomizerCheck();
    }
    getCurrentStoreValue() {
        if (this.isSet())
            return 1;
        return this.isJunk() ? 2 : 0;
    }
    isRandomizerCheck() {
        if (this.item === howlingStone)
            return false;
        // else if (this.item instanceof BoolItem && this.item.getParentItem() === scents)
        //     return false;

        return RandomizerCheckCategories.includes(this.randoCategory);
    }
    addFlagRequirement(flag) {
        let req = Requirement.fromFlag(flag);
        this.baseReqs.push(req);
        if (this.randoReqs !== this.baseReqs)
            this.randoReqs.push(req);
        if (this.glitchedReqs !== this.randoReqs)
            this.glitchedReqs.push(req);
        if (Array.isArray(flag.requiringFlags))
            flag.requiringFlags.push(this);
        else 
            flag.requiringFlags = [this];
    }
    manageFlagRequirements() {
        if (!Settings.TrackerLogic.isEnabled() || !flagReqExists(this.name))
            return;
        reloadMap();
    }
    getItemTracker(item) {
        if (item instanceof NonFlag)
            return null;
        return item.getTracker();
    }
    manageItemTracker() {
        if (!Settings.AutocompleteTracker.isEnabled()) 
            return;

        let item = this.item;
        if (Settings.RandoTracker.isEnabled() && this.hasRandoItem() && randoIsActive())
            item = this.randoItem;
        if (item instanceof Container)
            item = item.getContent();


        let itemTracker = this.getItemTracker(item);
        if (itemTracker !== null) {
            if (item instanceof ConsumingObtainable) {
                if (Settings.LocksConsumeKeys.isEnabled())
                    item.manageItemFromFlag(this.isSet(), itemTracker, item);
                return;
            }
            this.isSet() ? itemTracker.obtainItem(item) : itemTracker.unobtainItem(item);
        }

    }
    // Map
    isShown() {
        if (setFlagsHidden && this.isSet() || !this.categoryIsVisible())
            return false;
        // Tracker Logic hiding, set flags are shown even if the requirements aren't met
        if (!Settings.TrackerLogic.isEnabled() || !Settings.HideNoReqs.isEnabled() || this.isSet())
            return true;


        if (selectedGamemode === Gamemodes.Base) {
            return verifyRequirements(this.baseReqs);
        }    
        else {
            return verifyRequirements(selectedGamemode === Gamemodes.Glitchless ? this.randoReqs : this.glitchedReqs);
        }
    }
    categoryIsVisible() {
        if (randoIsActive())
            return verifyCategoryVisibility(this.randoCategory)
        else 
            return verifyCategoryVisibility(this.itemCategory);
    }   
    countsAsJunk() {
        return randoIsActive() && this.isJunk();
    }
    isCounted() {
        if (this.isSet() || this.countsAsJunk() || !this.isShown())
            return false;
        return this.isCountable();
    }
    isCountable() {
        if (selectedGamemode === Gamemodes.Base)
            return Settings.CountFlags.isEnabled();
        else {
            if (this.isRandomizerCheck())
                return Settings.CountChecks.isEnabled();
            else 
                return Settings.CountNonChecks.isEnabled();
        }
    }  
    countedInTotal() {
        return (this.isSet() || this.countsAsJunk()) && this.countsForTotal();
    }
    countsForTotal() {
        return this.categoryIsVisible() && this.isCountable();
    }
    // Leaflet
    initializeMarker() {
        this.marker = L.marker(this.position, {
            icon: getIcon(this.getImage()),
            riseOnHover: true, 
            riseOffset: 2000, 
            keyboard: false, 
        });
        this.marker.on('click', () => this.showDetails());
        assignGAClickEventToMarker(this.marker);
        this.boundSetMarker = this.setMarker.bind(this);
        this.boundUnsetMarker = this.unsetMarker.bind(this);
        this.boundJunkMarker = this.junkMarker.bind(this);
        this.boundUnjunkMarker = this.unjunkMarker.bind(this);
    }
    addMarker() {
        if (layerIsLoaded(this.marker))
            this.marker.remove();
        this.loadMarker();
    }
    showTooltip() {
        let tooltipText = Settings.FlagTooltipItemName.isEnabled() ? this.getCurrentItemName() : this.getFlagName();
        addTooltipToMarker(this.marker, tooltipText);
    }
    setTooltipToFlagName() {
        this.marker.setTooltipContent(this.getFlagName());
    }
    setTooltipToItemName() {
        this.marker.setTooltipContent(this.getCurrentItemName());
    }
    updateTooltipContent() {
        if (!Settings.FlagTooltipItemName.isEnabled())
            return;
        this.setTooltipToItemName();
    }
    getFlagName() {
        return this.name;
    }
    getCurrentItemName() {
        if (this.isContainer())
            return this.getCurrentItem().getContentName();
        else 
            return this.getCurrentItem().getName();
    }
    loadMarker(position=this.position) {
        if (!this.isShown() || layerCannotReload(this.marker))
            return;
        addMarkerToMap(this.marker, position);
        if (this.isJunk() && randoIsActive()) {
            this.junkVisually();
            return;
        }
        if (this.isSet())
            this.setVisually();
        else
            this.unsetVisually();
    }
    loadMarkerAsUnobtainable(position=this.position) {
        this.loadMarker(position);
        if (!this.markerIsShownAsUnobtainable())
            showMarkerAsUnobtainable(this.marker);
    }
    reloadMarker() {
        if (!layerIsLoaded(this.marker)) 
            return;

       if (setFlagsHidden) {
           setTimeout(() => {
                this.marker.remove(); 
                this.loadMarker();
            }, 1500);             
        }
    }
    setMarker() {
        blockMarkerReload(this.marker);
        this.set();
        this.setVisually();    
        unblockMarkerReload(this.marker);
        if (setFlagsHidden) {
            setTimeout(() => this.marker.remove(), 1500);
            return;
        }

    }
    unsetMarker() {
        blockMarkerReload(this.marker);
        if (this.isJunk())
            return;
        this.unset();
        this.unsetVisually();
        unblockMarkerReload(this.marker);

    }
    setVisually() {
        showMarkerAsSet(this.marker, this.getMarkerImage());
        this.updateTooltipContent();
        this.marker.off('contextmenu', this.boundSetMarker);
        this.marker.on('contextmenu', this.boundUnsetMarker);
    }
    unsetVisually() {
        showMarkerAsNotSet(this.marker, this.getMarkerImage());
        this.updateTooltipContent();
        if (Settings.TrackerLogic.isEnabled()) {
            let currentReqs;
            if (selectedGamemode === Gamemodes.Base)
                currentReqs = this.baseReqs;
            else 
                currentReqs = selectedGamemode === Gamemodes.Glitchless ? this.randoReqs : this.glitchedReqs;
            if (!verifyRequirements(currentReqs))
                showMarkerAsUnobtainable(this.marker);    
        }
        this.marker.off('contextmenu', this.boundUnsetMarker);
        this.marker.on('contextmenu', this.boundSetMarker);
        this.marker.getElement().removeEventListener('auxclick', this.boundUnjunkMarker);
        this.marker.getElement().addEventListener('auxclick', this.boundJunkMarker);
    }
    markerIsShownAsUnobtainable() {
        let markerElement = this.marker.getElement();
        if (markerElement === undefined || markerElement === null)
            return true;
        return markerElement.classList.contains('unobtainable');
    }
    junkMarker(e) {
        if (e !== undefined) {
            e.preventDefault();
            if (e.button !== 1) 
                return;

        }
        if (!this.isJunkable())
            return;
        this.setAsJunk();
        this.junkVisually();
    }
    unjunkMarker(e) {
         if (e !== undefined) {
            e.preventDefault();
            if (e.button !== 1) 
                return;

        }
        if (this.isSet())
            return;
        this.unsetAsJunk();
        this.unsetVisually();
    }
    junkVisually() {
        showMarkerAsJunk(this.marker, this.getMarkerImage());
        this.updateTooltipContent();
        this.marker.on('contextmenu', this.boundSetMarker);
        this.marker.getElement().removeEventListener('auxclick', this.boundJunkMarker);
        this.marker.getElement().addEventListener('auxclick', this.boundUnjunkMarker);
    }
    getFlagNameType() {
        return "Flag";
    }
    showDetails() {
        let item = this.getCurrentItem();
        let requirements = this.baseReqs;
        let description = this.baseDesc;

        switch(selectedGamemode) {
            case Gamemodes.Glitchless : {
                requirements = this.randoReqs;
                description = this.randoDesc;
                break;
            }
            case Gamemodes.Glitched : {
                requirements = this.glitchedReqs;
                description = this.glitchedDesc;
                break;
            }
        }
        LeafletMap.on('click', hideDetails);
        let detailsMenu = document.getElementById('flagDetails');
        detailsMenu.style.visibility = "visible";
        detailsMenu.style.width = "24.4vw";
        setTimeout(function() {document.getElementById('flagDetailsX').style.visibility = "visible";}, 100);    
        document.getElementById("flagName").style.display = "inline";
        document.getElementById("flagNameTitle").innerHTML = this.getFlagNameType() + " Name";
        document.getElementById("flagNameDiv").innerHTML = this.name;   
        document.getElementById('flagItem').style.display = "inline"; 
        if (this.isContainer()) {
            document.getElementById('flagItemTitle').innerHTML = "Content";
            document.getElementById('flagItemDiv').innerHTML = displayContainer(item);
        }
        else {
            let title = "Item";
            switch (this.item.getCategory()) {
                case (Categories.Bosses) : {
                    title = "Boss";
                    break;
                }
                case (Categories.Locks) : {
                    title = "Lock";
                    break;
                }
            }
            document.getElementById('flagItemTitle').innerHTML = title;
            document.getElementById('flagItemDiv').innerHTML = displayItem(item);
        }
        if (requirements.length > 0) {
            document.getElementById('flagRequirements').style.display = "block";
            let rdHtml = "";
            for (let requirement of requirements) {
                if (Array.isArray(requirement)) { // Array => OrReqs
                    rdHtml += '<div class="oritems bordered">';
                    for (let orReq of requirement) {
                        if (orReq instanceof AndRequirements) {
                            rdHtml += '<div class="separationOr">or</div><div class="bordered insideBordered">'
                            for (let andReq of orReq.getRequirements()) {
                                if (Array.isArray(andReq)) { // Array => OrReqs
                                    rdHtml += '<div class="bordered insideBordered">';
                                    for (let andOrReq of andReq) 
                                        rdHtml += '<div class="item"><span class="itemOr">or</span>' + displayRequirement(andOrReq) + '</div>';
                                    rdHtml += '</div>'; 
                                }
                                else 
                                    rdHtml += '<div class="item"><span>•</span>' + displayRequirement(andReq) + '</div>';
                            }
                            rdHtml += '</div>'; 
                        }
                        else
                            rdHtml += '<div class="item"><span class="itemOr">or</span>' + displayRequirement(orReq) + '</div>';
                    }
                    rdHtml += '</div>';
                }
                else
                    rdHtml += '<div class="item bordered"><span>•</span>' + displayRequirement(requirement) + '</div>';
            }
            document.getElementById('flagRequirementsDiv').innerHTML = rdHtml;
        }
        else 
            document.getElementById('flagRequirements').style.display = "none";

        document.getElementById('flagDescription').style.visibility = "visible";
        let flagDescDiv = document.getElementById('flagDescriptionDiv');
        if (this.itemCategory === Categories.Hints) {
            if (!seedIsLoaded) {
                flagDescDiv.innerHTML = "No seed loaded, hint content unknown.";
                return;
            }
            if (Settings.RevealHints.isEnabled())
                flagDescDiv.innerHTML = description;
            else
                flagDescDiv.innerHTML = 'Hints are hidden.<br>Enable the "Reveal Hints" setting to see them.'
        }
        else
           flagDescDiv.innerHTML = description;
    }
}

class UnsettableFlag extends Flag {
    set() {

    }
    setMarker() {
        blockMarkerReload(this.marker);
        this.setVisually();    
        unblockMarkerReload(this.marker);
        setTimeout(() => this.unsetVisually(), 1500);
    }
    getFlagNameType() {
        return "Non Flag";
    }
    countedInTotal() {
        return false;
    }
    countsForTotal() {
        return false;
    }
}

class RandoFlag extends Flag {
    set() {
        if (this.isSet() || !randoIsActive())
            return;
        if (this.isJunk())
            this._junk = false;
        this._set = true;
        this.onSetChange();
        if (this.parentGroup) 
            this.parentGroup.increaseAmount();
    }
    setMarker() {
        blockMarkerReload(this.marker);
        this.set();
        this.setVisually();    
        unblockMarkerReload(this.marker);
        if (!randoIsActive()) {
            setTimeout(() => this.unsetVisually(), 1500);
            return;
        }
        if (setFlagsHidden) {
            setTimeout(() => this.marker.remove(), 1500);
        }
    }
    getFlagNameType() {
        return "Randomizer Flag";
    }
    countedInTotal() {
        if (!randoIsActive())
            return false;
        return (this.isSet() || this.countsAsJunk()) && this.countsForTotal();
    }
    countsForTotal() {
        if (!randoIsActive())
            return false;
        return this.categoryIsVisible() && this.isCountable();
    }
    
}

class SharedFlag extends Flag {
     constructor(item, position, { 
            itemCategory=item.getCategory(), baseReqs=[], baseDesc="No description given", 
            randoCategory=itemCategory, randoReqs=baseReqs, randoDesc=baseDesc,
            glitchedReqs=randoReqs, glitchedDesc=randoDesc
        } = {}
    ) 
    {
        super(item, position, {
            itemCategory, baseReqs, baseDesc, randoCategory, randoReqs, randoDesc,
            glitchedReqs, glitchedDesc
        });
    }
    setSharedFlag(flag) {
        this.sharedFlag = flag;
    }
    onSetChange() {
        this.storageUnit.setFlag(this);
        if (!this.fromShared)
            this.manageItemTracker();
        this.manageFlagRequirements();
        updateTotalCounter();

        this.manageSharedFlag();
        this.fromShared = false;
    }
    manageSharedFlag() {
        if (this.isSet() && !this.sharedFlag.isSet() && !randoIsActive()) {
            this.sharedFlag.fromShared = true;
            this.sharedFlag.set();
        }
        else if (!this.isSet() && this.sharedFlag.isSet() && !randoIsActive()) {
            this.sharedFlag.fromShared = true;
            this.sharedFlag.unset();
        }
    }

}

class FlagGroup {
    constructor(flags, items) {
        this.flags = flags;
        for (let flag of flags)
            flag.parentGroup = this;
        this.items = items;
    }
    initialize() {
        for (let flag of this.flags) {
            if (flag instanceof FlagGroup)
                flag.initialize();
        }
        this.count = this.obtainedAmount();
        this.updateFlags();
    }
    getNumberOfFlags() {
        return this.flags.length;
    }
    obtainedAmount() {
        let count = 0;
        for (let flag of this.flags) {
            if (flag instanceof Flag && flag.isSet())
                count++;
            else if (flag instanceof FlagGroup)
                count += flag.obtainedAmount();           
        }
        return count;
    }
    amountIsObtained(amount) {
        return this.obtainedAmount >= amount;
    }
    updateFlags() {
        if (randoIsActive())
            return;

        for (let [req, item] of Object.entries(this.items)) {
            if (this.count === parseInt(req) - 1) {
                this.updateFlagItems(item, false);
                break;
            }
        }
        for (let [req, item] of Object.entries(this.items)) { 
            if (this.count === parseInt(req)) {
                this.updateFlagItems(item, true);
                break;
            }
        }
    }
    updateFlagItems(item, updateSetFlags) {
        for (let flag of this.flags) {
            if (flag instanceof FlagGroup)
                flag.updateFlagItems(item, updateSetFlags);
            else if (flag instanceof Flag) {
                if (!updateSetFlags && flag.isSet())
                    continue;
                else if (updateSetFlags && !flag.isSet())
                    continue;
                flag.setItem(item);
                flag.reloadMarker();
            }
        }
    }
    updateChildGroups() {
        for (let flag of this.flags) {
            if (flag instanceof FlagGroup)
                flag.updateFlags();
        }
    }
    increaseAmount() {
        ++this.count;
        this.updateChildGroups();
        this.updateFlags();
        if (this.parentGroup) 
            this.parentGroup.increaseAmount();   
    }
    decreaseAmount() {
        --this.count;
        this.updateChildGroups();
        this.updateFlags();
        if (this.parentGroup) 
            this.parentGroup.decreaseAmount();
    }
} 

let agithaBugCoupleRewards = Object.freeze({
    1 : new Obtainable("Purple Rupee", rupees, {category: Categories.Main}),
    2 : new Obtainable("Orange Rupee", rupees, {category: Categories.Main})
});   

function makeBugPlaceholder(bugItem) {
    return new Obtainable(bugItem.image, null, {name: bugItem.name, category: Categories.Main});
}

function makeAgithaRewardFlag(bugItem, position) {
    return new Flag(makeBugPlaceholder(bugItem), position, {
        baseReqs: [Requirement.fromBoolItem(bugItem)],
        baseDesc: `Give Agitha the ${bugItem.name} to receive the reward.`,
        randoCategory: Categories.Gifts
    });
}

let agithaRewards = new FlagGroup([
    new FlagGroup([
        makeAgithaRewardFlag(antM, [-3900, 4370]),
        makeAgithaRewardFlag(antF, [-3900, 4430])
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(dayflyM, [-3900, 4550]),
        makeAgithaRewardFlag(dayflyF, [-3900, 4610]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(beetleM, [-3900, 4730]),
        makeAgithaRewardFlag(beetleF, [-3900, 4790]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(mantisM, [-4025, 4370]),
        makeAgithaRewardFlag(mantisF, [-4025, 4430]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(stagBeetleM, [-4025, 4550]),
        makeAgithaRewardFlag(stagBeetleF, [-4025, 4610]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(pillbugM, [-4025, 4730]),
        makeAgithaRewardFlag(pillbugF, [-4025, 4790]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(butterflyM, [-4150, 4370]),
        makeAgithaRewardFlag(butterflyF, [-4150, 4430]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(ladybugM, [-4150, 4550]),
        makeAgithaRewardFlag(ladybugF, [-4150, 4610]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(snailM, [-4150, 4730]),
        makeAgithaRewardFlag(snailF, [-4150, 4790]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(phasmidM, [-4275, 4370]),
        makeAgithaRewardFlag(phasmidF, [-4275, 4430]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(grasshopperM, [-4275, 4550]),
        makeAgithaRewardFlag(grasshopperF, [-4275, 4610]),
    ], agithaBugCoupleRewards),
    new FlagGroup([
        makeAgithaRewardFlag(dragonflyM, [-4275, 4730]),
        makeAgithaRewardFlag(dragonflyF, [-4275, 4790]),
    ], agithaBugCoupleRewards)
], {
    1 : wallets.getItemByIndex(1),
    24 : wallets.getItemByIndex(2)
});

function getAgithaRewardFlag(index) {
    pairIndex = Math.floor(index / 2);
    genderIndex = index % 2;
    return agithaRewards.flags[pairIndex].flags[genderIndex];
}

