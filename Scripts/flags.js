class Flag extends Storable{
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
        return this.item.image;
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
        this.marker.setIcon(getIcon(this.getImage()));
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
        return randoIsActive() && Settings.RevealSpoilerLog.isEnabled() || Settings.RevealSetJunkFlags.isEnabled() && (this.isSet() || this.isJunk())
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
        else if (this.item instanceof BoolItem && this.item.getParentItem() === scents)
            return false;

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
        if (itemTracker !== null)
            this.isSet() ? itemTracker.obtainItem(item) : itemTracker.unobtainItem(item);
    }
    // Map
    isShown() {
        if (setFlagsHidden && this.isSet() || !this.categoryIsVisible())
            return false;

        if (!Settings.TrackerLogic.isEnabled() || !Settings.HideNoReqs.isEnabled())
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
            if (this.count === req - 1) {
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

const flags = new Map([
    // Ordon
    ['Uli Cradle Delivery', new Flag(fishingRods.getItemByIndex(0), [-9094, 4809], {
        baseDesc: 'Retrieve the cradle from the monkey using the hawk and deliver it to Uli to receive the fishing rod.',
        randoCategory: Categories.Gifts
    })],
    ["Ordon Spring Golden Wolf", new Flag(goldenWolf, [-8542, 4795], {
        baseReqs: [getFlagReq("Death Mountain Howling Stone")],
        baseDesc: 'Summoned by the Death Mountain howling stone.',
        randoDesc: 'Summoned by the Death Mountain howling stone. The item is lying on the ground where the Golden Wolf usually is.'
    })],
    ["Herding Goats Reward", new Flag(heartPiece, [-9514, 4964], {
        baseReqs: [diababaReq],
        baseDesc: 'After getting Epona back from the monsters, talk to Fado and complete the Goat Hoarding minigame in under 2 minutes to receive the heart piece.',
        randoCategory: Categories.Gifts,
        randoReqs: [],
        randoDesc: 'On Epona, talk to Fado and complete the Goat Hoarding minigame in under 2 minutes to receive the reward.'
    })],
    ["Rusl's House Orange Rupee", new Flag(Rupees.Orange, [-9058, 4788], {
        baseReqs: [[clawshotReq, boomerangReq]],
        baseDesc: "This orange rupee is hiding behind Rusl's house, use the boomerang or clawshot through the vines to obtain it."
    })],  
    ["Jaggle House's Purple Rupee", new Flag(Rupees.Purple, [-9006, 4999], { 
        baseReqs: [[clawshotReq, boomerangReq]],
        baseDesc: 'This purple rupee is hidden in the tall grass on the little platform to the left of the windmill.'
    })],
    ["Links Basement Chest", new Flag(chest.with(Rupees.Purple), [-8615, 5082], {
        baseReqs: [lanternReq],
        baseDesc: 'Use the lantern to locate the chest and be able to open it.'
    })],
    ["Wooden Sword Chest", new Flag(chest.with(swords.getItemByIndex(0)), [-8759, 5031], {
        baseReqs: [slingshotReq],
        baseDesc: 'The chest is available after buying the slingshot.',
        randoReqs: [],
        randoDesc: 'The chest is already present if the prologue is skipped'
    })],
    ["Sera Shop Slingshot", new Flag(slingshot, [-8790, 5034], {
        baseReqs: [fishingRodReq, Requirement.fromCountItem(rupees, 30)],
        baseDesc: "After saving Sera's Cat, you can buy the slingshot.",
        randoCategory: Categories.ShopItems,
        randoReqs: [Requirement.fromCountItem(rupees, 30)],
        randoDesc: "You can buy the item for 30 rupees."
    })],
    ["Ordon Cat Rescue", new Flag(seraBottle, [-8837, 4880], {
        baseReqs: [fishingRodReq],
        baseDesc: 'Obtain the bottle by talking to Sera after her cat has returned with a fish you gave him with the fishing rod.',
        randoCategory: Categories.Gifts
    })],
    ["Ordon Sword", new Flag(swords.getItemByIndex(1), [-9004, 4850], {
        baseReqs: [woodenSwordReq],
        baseDesc: 'Pick up the sword on the couch after entering by the side of the house by digging as Wolf Link.',
        randoReqs: [],
        randoDesc: 'Pick up the sword on the couch after entering the house.'
    })],
    ["Ordon Shield", new Flag(woodenShields.getItemByIndex(0), [-9044, 4410], {
        baseReqs: [woodenSwordReq],
        baseDesc: 'Use Midna to jump to the ledge where the shield is, then bonk on the wall twice to make it fall and obtain it.',
        randoReqs: [shadowCrystalReq]
    })],
    ["Wrestling With Bo", new Flag(chest.with(ironBoots), [-9339, 5044], {
        baseDesc: 'After clearing the Eldin Twilight, wrestle against Bo to obtain the Iron Boots.',
        baseReqs: [diababaReq],
        randoCategory: Categories.Gifts,
        randoReqs: [],
        randoDesc: "The chest is available when entering Bo's House."
    })],
    ["Ordon Ranch Grotto Lantern Chest", new Flag(chest.with(Rupees.Purple), [-9267, 4700], {
        baseReqs: [shadowCrystalReq, lanternReq],
        baseDesc: 'Light the 3 torches in front of the elevated platform to make the chest appear.',
    })],
    // Faron
    ["Coro Gate Key", new Flag(coroKey, [-7385, 4898], {
        baseDesc: "Talk to Coro to obtain the key that opens the gate to the South Faron Cave.",
        randoCategory: Categories.NonChecks,
    })],
    ["Coro Lock", new Flag(faronBulblinLock, [-7496, 4787], {
        baseReqs: [coroKeyReq],
        baseDesc: "Unlock this gate with the key obtained from Coro to reach the mist area of the forest."
    })],
    ["Faron Mist Lock", new Flag(faronBulblinLock, [-7343, 4351], {
        baseReqs: [faronKeyReq],
        baseDesc: "Unlock this gate to reach the north part of the Faron Woods.",
    })],
    ["Coro Lantern", new Flag(lantern, [-7405, 4910], {
        baseDesc: 'While chasing Talo and the monkey, talk to Coro to obtain the lantern.',
        randoCategory: Categories.NonChecks,
        randoDesc: 'Talk to Coro to obtain the lantern. Currently not a Randomizer check.'
    })],
    ["Faron Mist Cave Open Chest", new Flag(smallChest.with(faronKey), [-7023, 4805], {
        baseDesc: 'Walk into the cave and open the small chest to obtain the key to the Faron Woods gate.',
        randoDesc: 'Walk into the cave and open the small chest to obtain the item.',
        randoReqs: [[lanternReq, prologueNotSkippedReq]]
    })],
    ["Faron Mist Cave Lantern Chest", new Flag(chest.with(heartPiece), [-7023, 4834], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches besides the small chest and climb the ledge to open the chest.'
    })],
    ["North Faron Woods Deku Baba Chest", new Flag(smallChest.with(Rupees.Yellow), [-7121, 4136], {
        baseDesc: 'Defeat the Deku Baba and open the chest behind it.',
        randoReqs: [[lanternReq, shadowCrystalReq, prologueNotSkippedReq]],
    })],
    ["Coro Bottle", new Flag(coroBottle, [-7405, 4885], {
        baseReqs: [Requirement.fromCountItem(rupees, 100)],
        baseDesc: 'After clearing the Faron twilight, talk to Coro and he will offer you the oil bottle for 100 rupees.',
        randoCategory: Categories.Gifts,
    })],
    ["Faron Woods Golden Wolf", new Flag(goldenWolf, [-7104, 4184], {
        baseDesc: 'Meet the Golden Wolf after clearing the Faron Twilight to learn the Ending Blow.',
        randoDesc: "The item is lying on the ground where the Golden Wolf usually is.",
        randoReqs: [[lanternReq, shadowCrystalReq]],
    })],    
    ["Faron Mist Stump Chest", new Flag(smallChest.with(Rupees.Red), [-7235, 4518], {
        baseReqs: [lanternReq],
        baseDesc: 'Clear out the purple fog with the lantern and climb the tree stump to reach the chest.',
        randoCategory: Categories.Main
    })],
    ["Faron Mist North Chest", new Flag(smallChest.with(Rupees.Yellow), [-7010, 4567], {
        baseReqs: [lanternReq],
        baseDesc: 'Clear out the purple fog with the lantern and go to the left of the cave entrance to find the chest.',
        randoCategory: Categories.Main
    })],
    ["Faron Mist South Chest", new Flag(chest.with(Rupees.Purple), [-7351, 4513], {
        baseReqs: [lanternReq],
        baseDesc: 'Clear out the purple fog with the lantern and from the exit of the mist, go right to find the chest.',
        randoCategory: Categories.Main
    })],
    ["Faron Field Tree Heart Piece", new Flag(heartPiece, [-6278, 4930], {
        baseReqs: [diababaReq, [boomerangReq, clawshotReq]],
        baseDesc: 'The heart piece is on the leaves of a tree and can be grabbed with a long ranged item.',
        randoCategory: Categories.Main,
        randoReqs: [leaveFaronWoodsReq, [boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is on the leaves of a tree and can be grabbed with a long ranged item.'
    })],
    ["Faron Field Male Beetle", new Flag(beetleM, [-6344, 4764], {
        baseReqs: [diababaReq],
        baseDesc: 'This ♂ Beetle is on a tree trunk, simply pick it up.',
        randoReqs: [leaveFaronWoodsReq],
        randoDesc: "The item is on the ground near the tree where the beetle usually is.",
    })],
    ["Faron Field Female Beetle", new Flag(beetleF, [-5985, 5151], {
        baseReqs: [diababaReq, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Beetle is on an elevated tree trunk, use the boomerang or the clawshot to bring it closer.',
        randoReqs: [leaveFaronWoodsReq, [boomerangReq, clawshotReq]],
        randoDesc: 'The item is on an elevated tree trunk, use the boomerang or the clawshot to grab it.'
    })],
    ["Faron Mist Poe", new Flag(poeSoul, [-7184, 4515], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Use Midna jumps to reach the tree base where the poe is.'
    })], 
    ["Sacred Grove Pedestal Master Sword", new Flag(swords.getItemByIndex(2), [-6801, 3677], {
        baseReqs: [morpheelReq],
        baseDesc: 'After clearing the Lakebed Temple, go to the Sacred Grove and pull the Master Sword from its pedestal.',
        randoReqs: [shadowCrystalReq, skullKidReq],
        randoDesc: 'Press A on the Master Sword to obtain the item.'
    })],
    ["Sacred Grove Pedestal Shadow Crystal", new Flag(shadowCrystal, [-6850, 3677], {
        baseReqs: [morpheelReq],
        baseDesc: 'After clearing the Lakebed Temple, go to the Sacred Grove and pull the Master Sword from its pedestal to obtain the Shadow Crystal.',
        randoReqs: [shadowCrystalReq, skullKidReq],
        randoDesc: 'Press A on the Master Sword to obtain the item.'
    })],
    ["Sacred Grove Male Snail", new Flag(snailM, [-7184, 3722], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'This ♂ Snail is on the ceiling of the alcove with the broken chest.',
        randoReqs: [shadowCrystalReq, [boomerangReq, clawshotReq, ballAndChainReq], skullKidReq],
        randoDesc: 'The item is on the ceiling of the alcove with the broken chest.' 
    })],
    ["Faron Field Bridge Chest", new Flag(chest.with(Rupees.Orange), [-6135, 4891], {
        baseReqs: [diababaReq, clawshotReq],
        baseDesc: 'The chest is under the bridge. Clawshot the target above the chest to reach it.',
        randoReqs: [leaveFaronWoodsReq, clawshotReq]
    })],
    ["Faron Field Poe", new Flag(nightPoe, [-5953, 4955], {
        baseReqs: [diababaReq, nightReq, shadowCrystalReq],
        baseDesc: 'Above the flower patch on the elevated ledge.',
        randoReqs: [leaveFaronWoodsReq, nightReq, shadowCrystalReq]
    })],
    ["Lost Woods Waterfall Poe", new Flag(nightPoe, [-7172, 3043], {
        baseReqs: [nightReq, shadowCrystalReq],
        baseDesc: 'Behind the waterfall, accessible while fighting Skull Kid for the second time.',
        randoDesc: 'Go behind the waterfall to access the poe'
    })],
    ["Lost Woods Lantern Chest", new Flag(chest.with(bombs, 30), [-6975, 3273], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches in the back of the area to make the chest appear.',
        randoReqs: [shadowCrystalReq, lanternReq]
    })],
    ["Lost Woods Boulder Poe", new Flag(poeSoul, [-7137, 3529], {
        baseReqs: [shadowCrystalReq, [ballAndChainReq, bombBagReq], skullKidReq],
        baseDesc: 'Destroy the rock above the grotto to make the poe appear.'
    })],
    ["Sacred Grove Spinner Chest", new Flag(chest.with(Rupees.Orange), [-7151, 3457], {
        baseReqs: [spinnerReq],
        baseDesc: 'From the top of the vines, ride the spinner tracks until you reach the chest.',
        randoReqs: [shadowCrystalReq, spinnerReq, skullKidReq]
    })],
    ["Sacred Grove Master Sword Poe", new Flag(nightPoe, [-6877, 3703], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'After defeating Skull Kid for the 2nd time, you can find this poe in the bottom right of the Master Sword area.',
        randoDesc: 'You can find this poe in the bottom right of the Master Sword area.',
        randoReqs: [shadowCrystalReq, nightReq, skullKidReq],
    })],
    ["Faron Woods Owl Statue Sky Character", new Flag(skybookChar, [-7222, 4800], {
        baseReqs: [domRodReq, boulderReq],
        baseDesc: 'Destroy the boulder, then move the Owl Statue in the back to obtain the sky character.',
    })],
    ["Faron Woods Owl Statue Chest", new Flag(chest.with(heartPiece), [-7199, 4672], {
        baseReqs: [domRodReq, boulderReq, shadowCrystalReq],
        baseDesc: 'Put the Owl Statue in the hole next to the rock, then use Midna Jumps to reach the chest on the other side of the loading zone.'
    })],
    ["Faron Owl Statue Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 17), [-7307, 4866], {
        baseReqs: [boulderReq],
        baseDesc: 'Blocking the way to the Owl Statue. Gives 17 rupees.'
    })],
    ["South Faron Cave Chest", new Flag(smallChest.with(Rupees.Yellow), [-7340, 4450], {
        baseDesc: 'Use the lantern to be able to locate the chest more easily.',
        randoDesc: 'The chest is located at the end of the tunnel'
    })],
    ["Faron Field Corner Grotto Rear Chest", new Flag(smallChest.with(Rupees.Yellow), [-6928, 5138], {
        baseReqs: [diababaReq, shadowCrystalReq],
        baseDesc: 'Defeat all the enemies and cut the grass to make it easier to reach the chest.',
        randoReqs: [leaveFaronWoodsReq, shadowCrystalReq],
    })],
    ["Faron Field Corner Grotto Right Chest", new Flag(smallChest.with(Rupees.Red), [-6533, 5308], {
        baseReqs: [diababaReq, shadowCrystalReq],
        baseDesc: 'Defeat all the enemies and cut the grass to make it easier to reach the chest.',
        randoReqs: [leaveFaronWoodsReq, shadowCrystalReq],
    })],
    ["Faron Field Corner Grotto Left Chest", new Flag(smallChest.with(Rupees.Red), [-6370, 5050], {
        baseReqs: [diababaReq, shadowCrystalReq],
        baseDesc: 'Defeat all the enemies and cut the grass to make it easier to reach the chest.',
        randoReqs: [leaveFaronWoodsReq, shadowCrystalReq],
    })],
    ["Sacred Grove Baba Serpent Grotto Chest", new Flag(chest.with(heartPiece), [-6868, 3472], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'Defeat all the 8 Deku Serpents to make the chest appear.',
        randoReqs: [shadowCrystalReq, boulderReq, skullKidReq]
    })],
    ["Sacred Grove Female Snail", new Flag(snailF, [-7458, 3700], {
        baseReqs: [masterSwordReq, blizzetaReq, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Snail is too high to reach on the wall, use a long ranged item to make it come down.',
        randoReqs: [[masterSwordReq, openSacredGroveReq], [boomerangReq, clawshotReq], skullKidReq],
        randoDesc: 'The item is high up where the snail usually is, use a long ranged item to get it.'
    })],
    ["Sacred Grove Temple of Time Owl Statue Poe", new Flag(poeSoul, [-7470, 3618], {
        baseReqs: [masterSwordReq, blizzetaReq, pastDomRodReq, shadowCrystalReq],
        baseDesc: 'Move the Owl Statue to reveal the poe.',
        randoReqs: [[masterSwordReq, openSacredGroveReq], pastDomRodReq, shadowCrystalReq, skullKidReq]
    })],
    ["Sacred Grove Past Owl Statue Chest", new Flag(chest.with(heartPiece), [-7504, 3704], {
        baseReqs: [masterSwordReq, blizzetaReq, pastDomRodReq],
        baseDesc: 'Move the Owl Statue and go to the end of the tunnel behind it to reach the chest.',
        randoReqs: [[masterSwordReq, openSacredGroveReq], pastDomRodReq, skullKidReq]
    })],
    ["North Faron Woods Howling Stone", new Flag(howlingStone, [-7340, 4043], {
        baseReqs: [morpheelReq],
        baseDesc: 'Summons the South Castle Town Golden Wolf, accessible while on the way to the Master Sword.',
        randoReqs: [shadowCrystalReq]
    })],
    ["Faron Field Gate Lock", new Flag(gateLock, [-5825, 4324], {
        baseReqs: [gateKeyReq],
        baseDesc: "Unlock this gate during the escort quest to reach Faron Field.",
        randoDesc: "This gate unlocks automatically upon obtaining the gate keys, giving access to the Lanayru Province."
    })],
    // Eldin
    ["Kakariko Graveyard Lantern Chest", new Flag(chest.with(Rupees.Purple), [-5504, 8095], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches to make it appear the chest appear.'
    })],
    ["Kakariko Graveyard Male Ant", new Flag(antM, [-5448, 8123], {
        baseDesc: 'This ♂ Ant is at the base of the tree.',
        randoDesc: 'The item is on the ground where the bug usually is.'
    })],
    ["Eldin Field Male Grasshopper", new Flag(grasshopperM, [-4064, 6973], {
        baseDesc: 'This ♂ Grasshopper is particulary hard to get. Use the boomerang or clawshot if necessary.',
        randoDesc: 'The item is on the ground where the bug usually is.'
    })],
    ["Eldin Field Female Grasshopper", new Flag(grasshopperF, [-3372, 5952], {
        baseDesc: 'This ♀ Grasshopper is just lying on the ground.',
        randoDesc: 'The item is on the ground where the bug usually is.'
    })],
    ["Bridge of Eldin Male Phasmid", new Flag(phasmidM, [-3158, 7408], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: "This ♂ Phasmid is too high to reach, so you'll need to use the clawshot or the boomerang to make it come down.",
        randoDesc: "The item is where the bug usually is and is too high to reach.",
        randoReqs: [[boomerangReq, clawshotReq, ballAndChainReq]]
    })],
    ["Bridge of Eldin Female Phasmid", new Flag(phasmidF, [-2390, 7561], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: "This ♀ Phasmid is too high to reach, you can use the boomerang from down below to reach her, or climb the ledge using the clawshot target.",
        randoDesc: "The item is where the bug usually is and is too high to reach."
    })],
    ["Kakariko Gorge Female Pill Bug", new Flag(pillbugF, [-5584, 6316], {
        baseDesc: 'This ♀ Pill Bug is hidden in the tall grass.',
        randoDesc: "The item is hidden in the tall grass"
    })],
    ["Kakariko Gorge Male Pill Bug", new Flag(pillbugM, [-5431, 6004], {
        baseDesc: 'This ♂ Pill Bug is just lying on the ground.',
        randoDesc: 'The item is hidden on the ground where the bug usually is.'
    })],
    ["Kakariko Gorge Spire Heart Piece", new Flag(heartPiece, [-5299, 5673], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'The heart piece is sitting on top of the stone spire.',
        randoDesc: 'The item is sitting on top of the stone spire.',
        randoCategory: Categories.Main
    })],
    ["Kakariko Gorge Double Clawshot Chest", new Flag(chest.with(heartPiece), [-5263, 5626], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Use the target path and the vines to reach the chest.',
        glitchedReqs: [[doubleClawshotReq, boomerangReq]],
        glitchedDesc: 'Use the target path and the vines or use a LJA to reach the chest.'
    })],
    ["Talo Sharpshooting", new Flag(heartPiece, [-5130, 7593], {
        baseReqs: [bowReq, fyrusReq],
        baseDesc: 'After completing the Goron Mines, talk to Talo on top of the watchtower to play his minigame, then succeed to obtain the heart piece.',
        randoCategory: Categories.Gifts
    })],
    ["Kakariko Watchtower Alcove Chest", new Flag(chest.with(Rupees.Orange), [-5053, 7538], {
        baseReqs: [boulderReq],
        baseDesc: "Blow up the rock south of the village near the spring, and use the chickens inside the cave (they are near the center of the village if "+
                "you reload the area) to:<br>1. Climb behind Malo Mart and make the jump to the inn<br>2. Climb on top of the inn and jump towards the top of Barnes' shop<br>" +
                "3. Climb to the base of the watchtower near the goron<br>" + 
                "4. Go to the left side of the watchtower, and jump towards the chest with the chicken.<br>The chest is above the path to Death Mountain."
    })],
    ["Eldin Spring Underwater Chest", new Flag(chest.with(heartPiece), [-5847, 7696], {
        baseReqs: [boulderReq, [ironBootsReq, magicArmorReq]],
        baseDesc: 'Break the rock to enter the cave, then let yourself sink in the water at the end of the cave.'
    })],
    ["Eldin Field Bomb Rock Chest", new Flag(chest.with(heartPiece), [-4399, 6674], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rocks at the bottom of the trail, then start climbing. Once you reach the vines with a rock on top, use a well timed bomb throw or ' +
                'the ball and chain to destroy the rock and jump to climb the vines. Finally, jump down a few times to reach the chest.'
    })],
    ["Rutelas Blessing", new Flag(zoraArmor, [-5474, 8273], {
        baseReqs: [gateKeyReq],
        baseDesc: 'Save Ralis and follow Rutella through the graveyard to obtain the Zora Armor.',
        randoCategory: Categories.Gifts
    })],
    ["Kakariko Village Bomb Shop Poe", new Flag(nightPoe, [-5228, 7767], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: "In the ruins of Barnes' old warehouse."
    })],
    ["Kakariko Village Watchtower Poe", new Flag(nightPoe, [-5107, 7621], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: "At the base of the watchtower."
    })],
    ["Kakariko Village Bomb Rock Spire Heart Piece", new Flag(heartPiece, [-5610, 7578], {
        baseReqs: [bombBagReq, [boomerangReq, new AndRequirements([bowReq, clawshotReq])]],
        baseDesc: "Use the bomb arrows to blow up the rocks up on the ledge, then use the boomerang or the clawshot to obtain the heart piece.",
        randoCategory: Categories.Main
    })],
    ["Kakariko Graveyard Open Poe", new Flag(nightPoe, [-5455, 8048], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: "Near the graves."
    })],
    ["Death Mountain Trail Poe", new Flag(nightPoe, [-4331, 8118], {
        baseReqs: [fyrusReq, shadowCrystalReq, nightReq],
        baseDesc: "Up on the ledge, use a goron or the clawshot to get up."
    })],
    ["Death Mountain Alcove Chest", new Flag(chest.with(heartPiece), [-4049, 8169], {
        baseReqs: [[clawshotReq, fyrusReq]],
        baseDesc: 'Clawshot the vines hanging from the stone bridge and jump down the alcove to the chest.'
    })],
    ["Goron Springwater Rush", new Flag(heartPiece, [-3944, 5550], {
        baseReqs: [Requirement.fromCountItem(rupees, 1000), fyrusReq],
        baseDesc: 'After repairing the bridge for 1000 rupees, talk to the Goron Elder in front of the Malo Mart in Kakariko and bring the springwater to the goron.',
        randoCategory: Categories.Gifts,
        randoReqs: [Requirement.fromCountItem(rupees, 1000)]
    })],
    ["Kakariko Gorge Poe", new Flag(nightPoe, [-5347, 5978], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: "Behind the tree with the crows."
    })],
    ["Gift From Ralis", new Flag(coralEarring, [-5473, 8235], {
        baseReqs: [gateKeyReq, asheisSketchReq],
        baseDesc: 'Show the sketch to Ralis to obtain the coral earring.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Show the sketch to Ralis to obtain theitem.'
    })],
    ["Kakariko Graveyard Golden Wolf", new Flag(goldenWolf, [-5479, 8140], {
        baseReqs: [getFlagReq("Snowpeak Howling Stone")],
        baseDesc: 'Summoned by the Snowpeak Howling Stone.'
    })],
    ["Kakariko Graveyard Grave Poe", new Flag(nightPoe, [-5493, 7987], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Push the south-west grave to reveal the poe.'
    })],
    ["Ilia Charm", new Flag(iliasCharm, [-2155, 6620], {
        baseReqs: [woodenStatueReq, [bowReq, slingshotReq]],
        baseDesc: 'Defeat all the Bulblins, then talk to Impaz in front of her house to receive the charm.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Defeat all the Bulblins, then talk to Impaz in front of her house to receive the charm. This check is never randomized.'
    })],
    ["Cats Hide and Seek Minigame", new Flag(heartPiece, [-2165, 6565], {
        baseReqs: [horseCallReq, shadowCrystalReq, clawshotReq],
        baseDesc: 'Start the Cat Seeking Minigame by talking to the Cucco Leader near the howling stone. ' +
                "Once you have spoken to all 20 cats, report back to the Cucco Leader to receive the heart piece in front of Impaz' House",
        randoCategory: Categories.Main
    })],
    ["Hidden Village Poe", new Flag(nightPoe, [-2018, 6535], {
        baseReqs: [horseCallReq, shadowCrystalReq, nightReq],
        baseDesc: 'On the balcony above the white piece of cloth.'
    })],
    ["Bridge of Eldin Owl Statue Sky Character", new Flag(skybookChar, [-2509, 7359], {
        baseReqs: [domRodReq],
        baseDesc: 'Climb up the ledge and move the Owl Statue to obtain the sky character.'
    })],
    ["Bridge of Eldin Owl Statue Chest", new Flag(chest.with(heartPiece), [-3133, 7298], {
        baseReqs: [domRodReq],
        baseDesc: 'Bring the Owl Statue from the other side of the bridge, then put it in the hole and use it as a platform to reach the ladder. Climb it and open the chest.'
    })],
    ["Kakariko Gorge Owl Statue Sky Character", new Flag(skybookChar, [-4850, 5983], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue to obtain the sky character.'
    })],
    ["Kakariko Gorge Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-4951, 5966], {
        baseReqs: [domRodReq],
        baseDesc: 'Use the Owl Statue as a platform for the first jump, then take control of it right after to set it up for the second jump. Once done, the chest is around the corner.'
    })],
    ["Kakariko Gorge Corner Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 21), [-5380, 5510], {
        baseReqs: [boulderReq],
        baseDesc: 'Blow up the rock with a bomb or hit it with the ball and chain to reveal 21 rupees.'
    })],
    ["Kakariko Gorge Owl Statue Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 30), [-5074, 5909], {
        baseReqs: [boulderReq],
        baseDesc: 'The rock is in the middle of the field.'
    })],
    ["Eldin Spring Underwater Rupee Boulder", new Flag(rupeeBoulder.with(Rupees.Purple), [-5840, 7667], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: 'The rock is underwater in front of the chest.'
    })],
    ["Death Mountain Trail Red Rupees", new Flag(Rupees.Red, [-4269, 8150], {
        baseReqs: [[clawshotReq, fyrusReq]],
        baseDesc: 'There are 4 red rupees hidden under rocks near the Poe, for a total of 80 rupees.'
    })],
    ["Kakariko Village Bell Rupee", new Flag(Rupees.Silver, [-5513, 7720], {
        baseReqs: [bombBagReq, bowReq],
        baseDesc: 'Climb up the sanctuary with Midna jumps or a Cucco, then shoot a bomb arrow at the bell to make the silver rupee drop.'
    })],
    ["Kakariko Graveyard Underwater Rupee Boulder", new Flag(rupeeBoulder.with(Rupees.Red), [-5518, 8237], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: 'Underwater, right of the Zora shrine.'
    })],
    ["Bridge of Eldin Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 40), [-2391, 7503], {
        baseReqs: [boulderReq],
        baseDesc: 'In the open, below the Eldin Lava Cave entrance.'
    })],
    ["Kakariko Village Female Ant", new Flag(antF, [-5239, 7705], {
        baseDesc: 'This ♀ Ant is walking around the floor of the house.',
        randoDesc: 'The item is on the floor.'
    })],
    ["Kakariko Inn Chest", new Flag(smallChest.with(Rupees.Red), [-5452, 8068], {
        baseDesc: 'The chest is hidden under the staircase.'
    })],
    ["Barnes Bomb Bag", new Flag(bombBag, [-5300, 7755], {
        baseReqs: [fyrusReq, Requirement.fromCountItem(rupees, 120)],
        baseDesc: 'After clearing the Goron Mines, you can buy this Bomb Bag from Barnes for 120 rupees.',
        randoCategory: Categories.ShopItems,
        randoReqs: [Requirement.fromCountItem(rupees, 120)],
        randoDesc: "Select a type of bomb to buy the item from Barnes for 120 rupees"
    })],
    ["Kakariko Watchtower Chest", new Flag(chest.with(Rupees.Purple), [-5181, 7310], {
        baseDesc: 'Climb the ladder to reach the chest.'
    })],
    ["Kakariko Village Malo Mart Hylian Shield", new Flag(hylianShield, [-5445, 7325], {
        baseReqs: [Requirement.fromCountItem(rupees, 200)],
        baseDesc: 'You can buy it after saving Collin for 200 rupees.',
        randoCategory: Categories.ShopItems,
        randoDesc: "You can buy the item for 200 rupees."
    })],
    ["Kakariko Village Malo Mart Wooden Shield", new Flag(woodenShields.getItemByIndex(1), [-5445, 7400], {
        baseReqs: [Requirement.fromCountItem(rupees, 50)],
        baseDesc: 'You can buy it after saving Collin for 50 rupees.',
        randoCategory: Categories.ShopItems,
        randoDesc: "You can buy the item for 50 rupees."
    })],
    ["Kakariko Village Malo Mart Red Potion", new Flag(Bottle.RedPotion, [-5445, 7250], { 
        itemCategory: Categories.ShopItems,
        baseReqs: [getFlagReq("Kakariko Village Malo Mart Hylian Shield"), Requirement.fromCountItem(rupees, 30)],
        baseDesc: 'You can buy it after saving Collin for 30 rupees.',
        randoDesc: "After buying the Hylian Shield for 200 rupees, you can buy the item for 30 rupees."
    })],
    ["Kakariko Village Malo Mart Hawkeye", new Flag(hawkeye, [-5445, 7475], {
        baseReqs: [bowReq, fyrusReq, Requirement.fromCountItem(rupees, 100)],
        baseDesc: "You can buy it for 100 rupees after attempting the Talo's Sharpshooting minigame, available only after completing the Goron Mines.",
        randoCategory: Categories.ShopItems
    })],
    ["Shad Dominion Rod", new Flag(dominionRods.getItemByIndex(1), [-5390, 7453], {
        baseReqs: [skybookReq],
        baseDesc: 'Show the Ancient Sky Book to Shad for him to do an encantation which gives power back to the Dominion Rod.',
        randoCategory: Categories.NonChecks,
        randoDesc: 'Show the Ancient Sky Book to Shad for him to do an encantation which gives power back to the Dominion Rod. This is not a Randomizer Check.',
    })],
    ["Renados Letter", new Flag(renadosLetter, [-5640, 7377], {
        baseReqs: [armogohmaReq],
        baseDesc: 'After clearing the Temple of Time, talk to Renado to obtain his letter to Telma. ',
        randoCategory: Categories.Gifts,
        randoDesc: "After clearing the Temple of Time, talk to Renado to obtain his letter to Telma. This item is never Randomized."
    })],
    ["Ilia Memory Reward", new Flag(horseCall, [-5669, 7336], {
        baseReqs: [Requirement.fromBoolItem(iliasCharm)],
        baseDesc: 'Show the charm to Ilia for it to be revealed as the horse call and receive it back.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Show the charm to Ilia for it to be revealed as the horse call and receive it back. This item is never Randomized.'
    })],
    ["Eldin Lantern Cave First Chest", new Flag(smallChest.with(Rupees.Red), [-5530, 5822], {
        baseReqs: [[lanternReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Use the lantern, bombs or the ball and chain to destroy the cobwebs and reach the chest.'
    })],
    ["Eldin Lantern Cave Second Chest", new Flag(chest.with(Rupees.Purple), [-5810, 6372], {
        baseReqs: [[lanternReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Defeat the skulltula and open the chest.'
    })],
    ["Eldin Lantern Cave Lantern Chest", new Flag(chest.with(heartPiece), [-5399, 6319], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Eldin Lantern Cave Poe", new Flag(poeSoul, [-5469, 6199], {
        baseReqs: [shadowCrystalReq, [lanternReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Use your senses to see the poe at the end of this branch of the cave.'
    })],
    ["Eldin Field Bomskit Grotto Left Chest", new Flag(smallChest.with(Rupees.Purple), [-3678, 6013], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Hidden in the tall grass.'
    })],
    ["Eldin Field Bomskit Grotto Lantern Chest", new Flag(chest.with(Rupees.Purple), [-3527, 6279], {
        baseReqs: [shadowCrystalReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Eldin Field Water Bomb Fish Grotto Chest", new Flag(smallChest.with(Rupees.Purple), [-3003, 7176], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Cross the water to reach the chest. Be careful of the Skullfish and Bombfish.'
    })],
    ["Eldin Stockcave Upper Chest", new Flag(smallChest.with(Rupees.Red), [-2253, 7920], {
        baseReqs: [clawshotReq, ironBootsReq],
        baseDesc: 'From the entrance at the top, jump down in the magnetic field with the Iron Boots to reach the chest.'
    })],
    ["Eldin Stockcave Lantern Chest", new Flag(chest.with(Rupees.Orange), [-2310, 7530], {
        baseReqs: [clawshotReq, ironBootsReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Eldin Stockcave Lowest Chest", new Flag(chest.with(heartPiece), [-2419, 7522], {
        baseReqs: [clawshotReq, ironBootsReq],
        baseDesc: 'Defeat the Dodongo to make opening the chest easier.'
    })],
    ["Eldin Field Stalfos Grotto Left Small Chest", new Flag(smallChest.with(bombs, 5), [-1529, 6815], {
        baseReqs: [spinnerReq, shadowCrystalReq],
        baseDesc: 'Hidden in the west tall grass, cut it to make the chest easier to see.'
    })],
    ["Eldin Field Stalfos Grotto Right Small Chest", new Flag(smallChest.with(bombs, 5), [-1566, 7150], {
        baseReqs: [spinnerReq, shadowCrystalReq],
        baseDesc: 'Hidden in the east tall grass, cut it to make the chest easier to see.'
    })],
    ["Eldin Field Stalfos Grotto Stalfos Chest", new Flag(chest.with(heartPiece), [-1282, 6999], {
        baseReqs: [spinnerReq, shadowCrystalReq, boulderReq],
        baseDesc: 'Defeat the 3 Stalfos to make the chest appear.'
    })],
    ["Skybook From Impaz", new Flag(skybook.getItemByReq(1), [-2180, 6604], {
        baseReqs: [woodenStatueReq, [slingshotReq, bowReq], pastDomRodReq],
        baseDesc: 'Defeat all the Bulblins, then show Impaz the Powerless Dominion Rod to receive the Ancient Sky Book.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Defeat all the Bulblins, then show Impaz the Powerless Dominion Rod to receive the item.'
    })],
    ["Death Mountain Howling Stone", new Flag(howlingStone, [-4063, 8232], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Summons the Ordon Spring Golden Wolf, accessible while clearing out the Eldin Twilight.'
    })],
    ["Hidden Village Howling Stone", new Flag(howlingStone, [-2065, 6665], {
        baseReqs: [horseCallReq, shadowCrystalReq],
        baseDesc: 'Summons the Hyrule Castle Golden Wolf, accessible when you first get into the Hidden Village.',
        randoReqs: [woodenStatueReq, [horseCallReq, transformAnywhereReq], shadowCrystalReq]
    })],
    ["Kakariko Gorge Gate Lock", new Flag(gateLock, [-5253, 6506], {
        baseReqs: [gateKeyReq],
         baseDesc: "Unlock this gate during the escort quest to reach Kakariko Village.",
        randoDesc: "This gate unlocks automatically upon obtaining the gate keys, giving access to Kakariko Village."
    })],
    // Gerudo 
    ["Gerudo Desert Golden Wolf", new Flag(goldenWolf, [-4664, 582], {
        baseReqs: [getFlagReq("Lake Hylia Howling Stone")],
        baseDesc: 'Summoned by the Lake Hylia Howling Stone.'
    })],
    ["Gerudo Desert East Poe", new Flag(nightPoe, [-6110, 2588], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Above the grotto entrance, near the skulls.'
    })],
    ["Gerudo Desert East Canyon Chest", new Flag(smallChest.with(Rupees.Red), [-5736, 2179], {
        baseDesc: 'Clawshot the peahat over the chasm or walk all the way around it to reach the chest.'
    })],
    ["Gerudo Desert Peahat Ledge Chest", new Flag(smallChest.with(Rupees.Red), [-6108, 2148], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the tree peahat to reach the higher platform where the chest is.'
    })],
    ["Gerudo Desert Lone Small Chest", new Flag(smallChest.with(arrows, 10), [-5825, 1480], {
        baseDesc: 'The chest is on the darker rock platform.'
    })],
    ["Gerudo Desert Male Dayfly", new Flag(dayflyM, [-6101, 1450], {
        baseDesc: 'This ♂ Dayfly is flying around above the sand.'
    })],
    ["Gerudo Desert Female Dayfly", new Flag(dayflyF, [-5964, 934], {
        baseDesc: 'This ♀ Dayfly is flying around in the north gap with rocky walls.'
    })],
    ["Gerudo Desert West Canyon Chest", new Flag(smallChest.with(Rupees.Purple), [-5792, 322], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the peahat to cross the chasm and get to the chest.'
    })],
    ["Gerudo Desert Poe Above Cave of Ordeals", new Flag(nightPoe, [-6077, 560], {
        baseReqs: [clawshotReq, shadowCrystalReq, nightReq],
        baseDesc: 'Above the Cave of Ordeals entrance.'
    })],
    ["Gerudo Desert North Peahat Poe", new Flag(nightPoe, [-5125, 1380], {
        baseReqs: [clawshotReq, shadowCrystalReq, nightReq],
        baseDesc: 'Clawshot the tree peahat to reach the higher platform. The Poe is above the grotto entrance.'
    })],
    ["Gerudo Desert Campfire North Chest", new Flag(smallChest.with(Rupees.Red), [-5048, 655], {
        baseDesc: 'The chest is near the campfire.'
    })],
    ["Gerudo Desert Campfire West Chest", new Flag(smallChest.with(arrows, 10), [-5090, 605], {
        baseDesc: 'Destroy the western wooden tower with a boar or the ball and chain to gain access to the chest.'
    })],
    ["Gerudo Desert Campfire East Chest", new Flag(smallChest.with(Rupees.Purple), [-5090, 705], {
        baseDesc: 'Destroy the eastern wooden tower with a boar or the ball and chain to gain access to the chest.'
    })],
    ["Gerudo Desert Northwest Chest Behind Gates", new Flag(smallChest.with(Rupees.Red), [-4936, 356], {
        baseDesc: 'Destroy the western wooden gate with a boar to gain access to the chest.'
    })],
    ["Gerudo Desert Northeast Chest Behind Gates", new Flag(smallChest.with(Rupees.Red), [-4831, 856], {
        baseDesc: 'Destroy the eastern wooden gate with a boar to gain access to the chest.'
    })],
    ["Gerudo Desert South Chest Behind Wooden Gates", new Flag(chest.with(Rupees.Orange), [-6405, 1573], {
        baseDesc: 'Bring a boar from the entrance of the desert or the campfire to destroy the 2 gates blocking access to the chest.'
    })],
    ["Gerudo Desert North Small Chest Before Bulblin Camp", new Flag(smallChest.with(arrows, 10), [-4663, 704], {
        baseDesc: 'Follow the right path after the campfire to reach the chest.'
    })],
    ["Bulblin Camp First Chest Under Tower At Entrance", new Flag(smallChest.with(arrows, 20), [-4320, 692], {
        baseDesc: 'Behind the wooden tower.'
    })],
    ["Bulblin Camp Small Chest in Back of Camp", new Flag(smallChest.with(Rupees.Purple), [-4219, 628], {
        baseDesc: 'In the corner, defeat the Bulblins for easier access to the chest.'
    })], 
    ["Bulblin Camp Roasted Boar", new Flag(heartPiece, [-4171, 711], {
        baseReqs: [[woodenSwordReq, bowReq, ballAndChainReq, bombBagReq]],
        baseDesc: 'Destroy the roasting boar to reveal the heart piece.',
        randoCategory: Categories.Main,
        randoDesc: 'Destroy the roasting boar to reveal the item.'
    })],
    ["Bulblin Guard Key", new Flag(bulblinKey, [-4151, 668], {
        baseReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Defeat the Bulblin that has the key to collect it.',
        randoReqs: [],
        randoDesc: 'The item is on the ground behind the roasting boar.'
    })],
    ["Bulblin Camp Lock", new Flag(faronBulblinLock, [-4255, 601], {
        baseReqs: [bulblinKeyReq],
        baseDesc: 'Unlock this door to reach the boar at the center of the camp.'
    })],
    ["Outside Arbiters Grounds Poe", new Flag(nightPoe, [-3892, 557], {
        baseReqs: [bulblinKeyReq, shadowCrystalReq, nightReq],
        baseDesc: "On the left of the entrance to Arbiter's Grounds."
    })],
    ["Outside Arbiters Grounds Lantern Chest", new Flag(chest.with(Rupees.Purple), [-3889, 654], {
        baseReqs: [bulblinKeyReq, lanternReq],
        baseDesc: "Light the 2 torches on the right of the entrance to Arbiter's Grounds to make the chest appear."
    })],
    ["Bulblin Camp Poe", new Flag(nightPoe, [-4292, 604], {
        baseReqs: [bulblinKeyReq, shadowCrystalReq, nightReq],
        baseDesc: 'After defeating King Bulblin, return to the area of the fight to find the poe.'
    })],
    ["Outside Bulblin Camp Poe", new Flag(nightPoe, [-4623, 470], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Take the left path twice from the campfire to reach this poe.'
    })],
    ["Gerudo Desert Owl Statue Sky Character", new Flag(skybookChar, [-6140, 1027], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue between the climbable platform and the one with the sky character to obtain it.'
    })],
    ["Gerudo Desert Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-6193, 1074], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue in the intended places while staying on the platforms and make a few jumps to reach the chest.'
    })],
    ["Gerudo Desert Skulltula Grotto Chest", new Flag(chest.with(Rupees.Orange), [-5762, 2464], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Defeat all the skulltulas to make the chest appear.'
    })],
    ["Gerudo Desert Rock Grotto First Poe", new Flag(poeSoul, [-5038, 1167], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'
    })],
    ["Gerudo Desert Rock Grotto Second Poe", new Flag(poeSoul, [-4941, 1335], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'
    })],
    ["Gerudo Desert Rock Grotto Lantern Chest", new Flag(chest.with(Rupees.Orange), [-4812, 1381], {
        baseReqs: [clawshotReq, shadowCrystalReq, boulderReq, lanternReq],
        baseDesc: 'Destroy the rocks blocking the way, then light 3 torches to make the chest appear.'
    })],
    ["Cave of Ordeals Floor 14 Orange Rupee", new Flag(Rupees.Orange, [-5934, 564], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq],
        baseDesc: 'Buried in the ground, use sense to dig it up.'
    })],
    ["Cave of Ordeals Floor 17 Poe", new Flag(poeSoul, [-6294, 735], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq],
        baseDesc: 'In the middle of the room.'
    })],
    ["Cave of Ordeals Floor 33 Poe", new Flag(poeSoul, [-6294, 735], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq, ballAndChainReq, bowReq, domRodReq],
        baseDesc: 'In the middle of the room.'
    })],
    ["Cave of Ordeals Floor 39 Silver Rupee", new Flag(Rupees.Silver, [-5933, 274], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq, ballAndChainReq, bowReq, domRodReq],
        baseDesc:  "Buried in the middle of the room, use Wolf Link's senses to dig it up."
    })],
    ["Cave of Ordeals Floor 44 Poe", new Flag(poeSoul, [-6305, 272], {
        baseReqs: [spinnerReq, shadowCrystalReq, ballAndChainReq, bowReq, domRodReq, doubleClawshotReq],
        baseDesc: 'In the middle of the room'
    })],
    ["Cave of Ordeals Great Fairy Reward", new Flag(Bottle.Tears, [-5928, 737], {
        baseReqs: [spinnerReq, shadowCrystalReq, ballAndChainReq, bowReq, domRodReq, doubleClawshotReq],
        baseDesc: "Talk to the Great Fairy to obtain Great Fairy's Tears.",
        randoCategory: Categories.Gifts
    })],
    // Peak
    ["Ashei Sketch", new Flag(asheisSketch, [-606, 4446], {
        baseReqs: [stallordReq],
        baseDesc: 'Speak to Ashei to obtain her sketch.',
        randoReqs: [],
        randoCategory: Categories.Gifts
    })],
    ["Snowpeak Blizzard Poe", new Flag(poeSoul, [-307, 3521], {
        baseReqs: [coralEarringReq, shadowCrystalReq],
        baseDesc: 'Left of the rock the Reekfish Scent makes you go right of.',
        randoReqs: [[snowpeakScentReq, coralEarringReq], shadowCrystalReq]
    })],
    ["Snowpeak Above Freezard Grotto Poe", new Flag(poeSoul, [-432, 3728], {
        baseReqs: [coralEarringReq, shadowCrystalReq],
        baseDesc: 'Above the grotto.',
        randoReqs: [[snowpeakScentReq, coralEarringReq], shadowCrystalReq]
    })],
    ["Snowpeak Poe Among Trees", new Flag(nightPoe, [-344, 3334], {
        baseReqs: [coralEarringReq, shadowCrystalReq, nightReq],
        baseDesc: 'Above the grotto, behind the tree.',
        randoReqs: [[snowpeakScentReq, coralEarringReq], shadowCrystalReq, nightReq]
    })],
    ["Snowpeak Icy Summit Poe", new Flag(poeSoul, [-2985, 1299], {
        baseReqs: [coralEarringReq, shadowCrystalReq],
        baseDesc: 'When in front of the mansion, go back to the snow trail as Wolf Link and climb the spiral structure. The poe is at the top.',
        randoReqs: [[snowpeakScentReq, coralEarringReq], shadowCrystalReq]
    })],
    ["Snowboard Racing Prize", new Flag(heartPiece, [-691, 3013], {
        baseReqs: [blizzetaReq],
        baseDesc: 'After clearing Snowpeak Ruins, warp to the mountain top. Race Yeto and win, then go back to the mountain top and win against Yeta.',
        randoCategory: Categories.Gifts
    })],
    ["Snowpeak Cave Ice Poe", new Flag(poeSoul, [-655, 3300], {
        baseReqs: [coralEarringReq, ballAndChainReq, shadowCrystalReq],
        baseDesc: 'In the cave, break the north ice block with the ball and chain to reveal the poe.',
        randoReqs: [[coralEarringReq, snowpeakScentReq], ballAndChainReq, shadowCrystalReq],
    })],
    ["Snowpeak Cave Ice Lantern Chest", new Flag(chest.with(Rupees.Orange), [-675, 3275], {
        baseReqs: [coralEarringReq, ballAndChainReq, shadowCrystalReq, lanternReq],
        baseDesc: 'In the cave, break the 2 ice blocks to reveal torches. Light them up to make the chest appear.',
        randoReqs: [[coralEarringReq, snowpeakScentReq], ballAndChainReq, shadowCrystalReq, lanternReq],
    })],
    ["Snowpeak Howling Stone", new Flag(howlingStone, [-475, 3393], { 
        baseReqs: [coralEarringReq, shadowCrystalReq],
        baseDesc: 'Summons the Kakariko Graveyard Golden Wolf, accessible on the way to the Snowpeak Ruins.'
    })],
    ["Snowpeak Freezard Grotto Chest", new Flag(chest.with(Rupees.Orange), [-265, 3631], {
        baseReqs: [coralEarringReq, ballAndChainReq, shadowCrystalReq],
        baseDesc: 'Defeat the furthest Freezard to reveal the chest.',
        randoReqs: [[coralEarringReq, snowpeakScentReq], ballAndChainReq, shadowCrystalReq],
    })],
    // Lanayru
    ["Zoras Domain Chest By Mother and Child Isles", new Flag(smallChest.with(Rupees.Yellow), [-610, 4930], {
        baseDesc: 'From the water, climb the path to reach the chest.'
    })],
    ["Zoras Domain Chest Behind Waterfall", new Flag(smallChest.with(Rupees.Red), [-601, 4967], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Use Midna jumps to follow the path from the west shore of the domain to reach the chest.'
    })],
    ["Lake Hylia Underwater Chest", new Flag(chest.with(Rupees.Orange), [-5461, 3284], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
        baseDesc: 'The chest is underwater, hidden by some tall seaweed.'
    })],
    ["Lake Hylia Bridge Male Mantis", new Flag(mantisM, [-4604, 3418], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'This ♂ Mantis is on the side of the bridge above the void. If you do not have a long ranged item, wait for it to fly near you.',
        randoReqs: [[boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is above the void, use a long ranged item to get it.'
    })],
    ["Lake Hylia Bridge Female Mantis", new Flag(mantisF, [-5459, 3559], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Mantis is too high to reach, use a long ranged item.',
        randoReqs: [[boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is high above the ground, use a long ranged item to get it.'
    })],
    ["West Hyrule Field Female Butterfly", new Flag(butterflyF, [-3658, 3845], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Butterfly is on a higher ledge hiding in the purples flowers. Clawshot the vines to climb the ledge or grab it from below.',
        randoReqs: [[boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is on a higher ledge hiding in the purples flowers. Clawshot the vines to climb the ledge or grab it from below.'
    })],
    ["West Hyrule Field Male Butterfly", new Flag(butterflyM, [-4158, 3966], {
        baseDesc: 'This ♂ Butterfly is hiding in some purple flowers.',
        randoDesc: 'The item is hiding in some purple flowers.'
    })],
    ["Lanayru Field Male Stag Beetle", new Flag(stagBeetleM, [-2589, 4365], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'This ♂ Stag Beetle is on the trunk of a tree, a bit too high to reach.',
        randoReqs: [[boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: "The item is on the trunk of a tree, a bit too high to reach."
    })],
    ["Lanayru Field Female Stag Beetle", new Flag(stagBeetleF, [-2005, 4790], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Stag Beetle is above the entrance of the ice block cave, and is too high too reach.',
        randoDesc: 'The item is above the entrance of the ice block cave, and is too high too reach.'
    })],
    ["Lanayru Field Behind Gate Underwater Chest", new Flag(chest.with(Rupees.Orange), [-2910, 4880], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
        baseDesc: 'The chest is in the cage underwater.'
    })],
    ["Zoras Domain Extinguish All Torches Chest", new Flag(chest.with(Rupees.Purple), [-206, 4830], {
        baseReqs: [boomerangReq, [ironBootsReq, magicArmorReq]],
        baseDesc: 'Extinguish all of the 3 torches with the boomerang to make the chest appear.'
    })],
    ["Zoras Domain Light All Torches Chest", new Flag(chest.with(Rupees.Purple), [-206, 4870], {
        baseReqs: [lanternReq, [ironBootsReq, magicArmorReq]],
        baseDesc: 'Light up all the 3 torches with the lantern to make the chest appear.'
    })],
    ["Zoras Domain Male Dragonfly", new Flag(dragonflyM, [-741, 4977], {
        baseDesc: 'This ♂ Dragonfly is hiding in the tall grass.',
        randoDesc: 'The item is hiding in the tall grass.'
    })],
    ["Upper Zoras River Female Dragonfly", new Flag(dragonflyF, [-879, 6022], {
        baseDesc: 'This ♀ Dragonfly is on the side of the floating bridge. Drop down from the bridge to get it.',
        randoDesc: 'The item is on the side of the floating bridge. Drop down from the bridge to get it.'
    })],
    ["Fishing Hole Bottle", new Flag(bottle, [-370, 6066], {
        baseReqs: [fishingRodReq],
        baseDesc: 'Cast the fishing in the small pond isolated by the bridge to catch the bottle.'
    })],
    ["Fishing Hole Heart Piece", new Flag(heartPiece, [-372, 5801], {
        baseReqs: [[Requirement.fromCountItem(rupees, 20), clawshotReq]],
        baseDesc: 'Go fishing with the canoe (20 rupees) and use the provided fishing rod to reel in the heart piece or use the clawshot.',
        randoCategory: Categories.Main,
        randoDesc: "'Go fishing with the canoe (20 rupees) and use the provided fishing rod to reel in the item or use the clawshot.'"
    })],
    ["Iza Helping Hand", new Flag(bombBag, [-853, 6061], {
        baseReqs: [bowReq],
        baseDesc: 'Help Iza by blowing up all of the rocks blocking the river to receive the bomb bag.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Help Iza by blowing up all of the rocks blocking the river to receive the item.'
    })],
    ["Iza Raging Rapids Minigame", new Flag(giantBombBag, [-904, 6064], {
        baseReqs: [getFlagReq("Iza Helping Hand"), bowReq],
        baseDesc: "Play Iza's Raging Rapids minigame and get atleast 25 points to obtain the giant bomb bag.",
        randoCategory: Categories.Gifts,
        randoDesc: "Play Iza's Raging Rapids minigame and get atleast 25 points to obtain the item."
    })],
    ["Outside South Castle Town Female Ladybug", new Flag(ladybugF, [-4491, 4622], {
        baseDesc: 'This ♀ Ladybug is in the grassy area next to the middle tree.',
        randoDesc: 'The item is in the grassy area next to the middle tree.'
    })],
    ["Outside South Castle Town Male Ladybug", new Flag(ladybugM, [-4572, 4909], {
        baseDesc: 'This ♂ Ladybug is hiding in the flowers on the ground.',
        randoDesc: 'The item is in the flowers on the ground.'
    })],
    ["West Hyrule Field Golden Wolf", new Flag(goldenWolf, [-3917, 4177], {
        baseReqs: [getFlagReq("Upper Zoras River Howling Stone")],
        baseDesc: "Summoned by the Upper Zora's River Howling Stone."
    })],
    ["East Castle Town Bridge Poe", new Flag(nightPoe, [-3967, 5062], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'This poe is located at the center of the bridge.'
    })],
    ["Outside South Castle Town Tightrope Chest", new Flag(chest.with(Rupees.Orange), [-4364, 4644], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: '1. Clawshot the top of the target at the top of the right tower and climb up.<br>2. Transform into Wolf Link and cross the rope, then transform ' + 
                'back.<br>3. Slowly walk towards the ledge to hang from it, then hold left to crawl to the left platform.<br>4. Transform back into Wolf and cross the last rope to reach the chest.'
    })],
    ["Outside South Castle Town Fountain Chest", new Flag(chest.with(Rupees.Orange), [-4428, 4710], {
        baseReqs: [clawshotReq, spinnerReq],
        baseDesc: '1. Clawshot the top of the target at the top of the right tower and drop down.<br>2. Use the spinner on the railing, then jump below to the chest.'
    })],
    ["Outside South Castle Town Poe", new Flag(nightPoe, [-4446, 4641], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Near the middle of the stairs.'
    })],
    ["Lake Hylia Bridge Vines Chest", new Flag(chest.with(Rupees.Orange), [-4574, 3388], {
        baseReqs: [clawshotReq],
        baseDesc: "Use the clawshot on the vines and climb up completely on the platform. Then, grab the ledge to the right of the vines " +
                "and slide right until you reach the platform with the chest."
    })],
    ["Isle of Riches Poe", new Flag(nightPoe, [-4920, 3065], {
        baseReqs: [Requirement.fromCountItem(rupees, 20), shadowCrystalReq, nightReq],
        baseDesc: "Can be obtained from the lowest platform with the small chest."
    })],
    ["Flight By Fowl Fifth Platform Chest", new Flag(smallChest.with(Rupees.Yellow), [-4900, 3050], {
        baseReqs: [Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the lowest platform."
    })],
    ["Flight By Fowl Fourth Platform Chest", new Flag(smallChest.with(Rupees.Red), [-4930, 3075], {
        baseReqs: [Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the second lowest platform."
    })],
    ["Flight By Fowl Third Platform Chest", new Flag(chest.with(Rupees.Purple), [-4963, 3099], {
        baseReqs: [Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the second highest platform."
    })],
    ["Flight By Fowl Second Platform Chest", new Flag(chest.with(heartPiece), [-4978, 3120], {
        baseReqs: [Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the highest platform."
    })],
    ["Flight By Fowl Top Platform Reward", new Flag(chest.with(Rupees.Orange), [-4998, 3137], {
        baseReqs: [Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the spinning platform. This chest refills everytime you reload Lake Hylia.",
        randoDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the spinning platform."
    })],
    ["Outside Lanayru Spring Left Statue Chest", new Flag(smallChest.with(Rupees.Purple), [-5184, 3469], {
        baseReqs: [Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the west statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"
    })],
    ["Outside Lanayru Spring Right Statue Chest", new Flag(chest.with(Rupees.Orange), [-5184, 3536], {
        baseReqs: [Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the east statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"
    })],
    ["Outside South Castle Town Golden Wolf", new Flag(goldenWolf, [-4430, 4591], {
        baseReqs: [getFlagReq("North Faron Woods Howling Stone")],
        baseDesc: 'Summoned by the Faron Woods Howling Stone.'
    })],
    ["Plumm Fruit Balloon Minigame", new Flag(heartPiece, [-4905, 3923], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Play the Plumm Fruit Balloon Minigame by howling with hawk grass and get 10000 points or more to obtain the heart piece.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Play the Plumm Fruit Balloon Minigame by howling with hawk grass and get 10000 points or more to obtain the item.'
    })],
    ["Zoras Domain Underwater Goron", new Flag(bombBag, [-163, 4849], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: 'Blow up the rock in the middle of the room with water bombs and talk to the Goron that comes out of it.',
        randoCategory: Categories.Gifts
    })],
    ["Zoras Domain Waterfall Poe", new Flag(nightPoe, [-475, 4844], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Behind the waterfall, use Midna jumps to get there.'
    })],
    ["Zoras Domain Mother and Child Isle Poe", new Flag(nightPoe, [-650, 4949], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'In front of the small chest.'
    })],
    ["Lanayru Field Bridge Poe", new Flag(nightPoe, [-2598, 4901], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'On the bridge.'
    })],
    ["Upper Zoras River Poe", new Flag(nightPoe, [-1024, 5870], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Near the tall grass.'
    })],
    ["Lake Hylia Bridge Cliff Chest", new Flag(chest.with(Rupees.Purple), [-5656, 3789], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq],
        baseDesc: 'Blow up the rocks that are elevated to reveal clawshot targets. Follow the target path until you reach the chest.'
    })],
    ["Lake Hylia Bridge Cliff Poe", new Flag(nightPoe, [-5691, 3795], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, shadowCrystalReq],
        baseDesc: 'On the left of the chest.'
    })],
    ["Lake Hylia Bridge King Bulblin Gate Keys", new Flag(gateKey, [-5048, 3400], {
        baseDesc: 'Defeat King Bulblin for the second time during the escort to obtain the gate keys.',
        randoCategory: Categories.NonChecks,
        randoDesc: 'Defeat King Bulblin for the second time during the escort to obtain the item.'
    })],
    ["Lake Hylia Alcove Poe", new Flag(nightPoe, [-5539, 3312], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'In the middle of the tall grass.'
    })],
    ["Lake Hylia Dock Poe", new Flag(nightPoe, [-5100, 3989], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Out in the open.'
    })],
    ["Lake Hylia Tower Poe", new Flag(nightPoe, [-5509, 2724], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'On the left of the watchtower.'
    })],
    ["Flight By Fowl Ledge Poe", new Flag(nightPoe, [-4656, 2886], {
        baseReqs: [Requirement.fromCountItem(rupees, 20), shadowCrystalReq, nightReq],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the platform under Fowl's house."
    })],
    ["Charlo Donation Blessing", new Flag(heartPiece, [-3952, 4594], {
        baseReqs: [Requirement.fromCountItem(rupees, 1000)],
        baseDesc: "Donate 1000 total rupees to Charlo to receive the heart piece.",
        randoCategory: Categories.Gifts,
        randoReqs: [Requirement.fromCountItem(rupees, 500)],
        randoDesc:  "Donate 500 total rupees to Charlo to receive the item."
    })],
    ["Auru Gift To Fyer", new Flag(aurusMemo, [-5460, 2690], {
        baseDesc: "Climb the tower with the ladder and talk to Auru to obtain the memo.",
        baseReqs: [masterSwordReq],
        randoCategory: Categories.Gifts,
        randoReqs: [],
        randoDesc: "Climb the tower with the ladder and talk to Auru to obtain the item."
    })],
    ["Lanayru Field Spinner Track Chest", new Flag(chest.with(heartPiece), [-3349, 3595], {
        baseReqs: [boulderReq, spinnerReq],
        baseDesc: 'Destroy the boulders blocking the way, then use the spinner tracks to reach the chest.'
    })],
    ["Hyrule Field Amphitheater Poe", new Flag(nightPoe, [-4314, 3790], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'At the center of the ruins.'
    })],
    ["Doctors Office Balcony Chest", new Flag(smallChest.with(Rupees.Red), [-3940, 4890], {
        baseReqs: [invoiceReq, shadowCrystalReq],
        baseDesc: 'After giving the doctor the Invoice, push the box hiding the medecine scent, and climb up until you are outside. Once there, the chest is on the balcony.'
    })],
    ["Wooden Statue", new Flag(woodenStatue, [-4676, 4714], {
        baseReqs: [invoiceReq, medicineScentReq, shadowCrystalReq, nightReq],
        baseDesc: 'After collecting the Medicine Scent and talking to Louise, defeat all of the Stallhounds at Night to receive the wooden statue.',
    })],
    ["North Castle Town Golden Wolf", new Flag(goldenWolf, [-3701, 4709], {
        baseReqs: [getFlagReq("Hidden Village Howling Stone")],
        baseDesc: 'Summoned by the Hidden Village Howling Stone.'
    })],
    ["Lake Hylia Bridge Owl Statue Sky Character", new Flag(skybookChar, [-4220, 3378], {
        baseReqs: [clawshotReq, domRodReq],
        baseDesc: 'Move the Owl Statue under the vines, then clawshot them and drop onto the statue. Finally, jump to the sky character to obtain it.'
    })],
    ["Lake Hylia Bridge Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-4216, 3433], {
        baseReqs: [clawshotReq, domRodReq],
        baseDesc: 'Once on the sky character platform, move the Owl Statue next to the east wall. Then, jump on it and onto the plaftorm on your left to reach the chest.'
    })],
    ["Hyrule Field Amphitheater Owl Statue Sky Character", new Flag(skybookChar, [-4281, 3766], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue between the broken part of the stairs and the pillar with the sky character to obtain it.'
    })],
    ["Hyrule Field Amphitheater Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-4334, 3835], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue between the broken part of the stairs and the pillar with the chest to reach it.'
    })],
    ["Outside South Castle Town Double Clawshot Chasm Chest", new Flag(chest.with(Rupees.Orange), [-4550, 4505], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path down the chasm to reach the chest.'
    })],
    ["Upper Zoras River Howling Stone", new Flag(howlingStone, [-852, 5918], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Summons the West Castle Town Golden Wolf, accessible while clearing out the Lanayru Twilight.'
    })],
    ["Lake Hylia Howling Stone", new Flag(howlingStone, [-5405, 3014], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Summons the Gerudo Desert Golden Wolf, climb the ladder as human to reach it.'
    })],
    ["Lake Hylia Bridge South Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 20), [-5458, 3876], {
        baseReqs: [boulderReq],
        baseDesc: 'Hidden between two larger stone structures.'
    })],
    ["Lake Hylia Bridge North Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 20), [-4333, 3548], {
        baseReqs: [boulderReq],
        baseDesc: 'Out in the open, east of the Owl Statue.'
    })],
    ["West Hyrule Field East Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 35), [-3637, 4089], {
        baseReqs: [boulderReq],
        baseDesc: 'Out in the open, defeat the Bulblins to make it easier to destroy.'
    })],
    ["West Hyrule Field North Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 38), [-3412, 4111], {
        baseReqs: [boulderReq],
        baseDesc: 'Hidden in the corner.'
    })],
    ["Lanayru Field West Corner Rupee Boulder", new Flag(rupeeBoulder.with(Rupees.Purple), [-2564, 4084], {
        baseReqs: [boulderReq],
        baseDesc: 'Out in the open in the corner.'
    })],
    ["Zoras Domain Tunnel East Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 21), [-477, 4725], {
        baseReqs: [boulderReq],
        baseDesc: 'This boulder is in the tunnel from the top of the domain to the balcony.'
    })],
    ["Zoras Domain Tunnel West Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 17), [-475, 4702], {
        baseReqs: [boulderReq],
        baseDesc: 'This boulder is in the tunnel from the top of the domain to the balcony.'
    })],
    ["Zoras Domain Underwater North Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 60), [-515, 4850], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, under the waterfall."
    })],
    ["Zoras Domain Underwater South Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 37), [-680, 4850], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
         baseDesc: "Underwater, at the center of the domain."
    })],
    ["Zoras Domain Throne Room Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 10), [-123, 4793], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, east of the throne. The rocks under the boulder are worth lifting as there is a total of 40 rupees under them."
    })],
    ["Upper Zoras River Trench Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 31), [-876, 5882], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, in the trench."
    })],
    ["Upper Zoras River Gate Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 32), [-1037, 5965], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, before the wooden gate."
    })],
    ["Upper Zoras River Tunnel Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 43), [-963, 5806], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, under the tunnel that leads to Lanayru Field."
    })],
    ["Lanayru Field North Underwater Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 50), [-2355, 4889], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, north of the bridge."
    })],
    ["Lanayru Field South Underwater Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 31), [-2698, 4923], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, south of the bridge."
    })],
    ["Lanayru Field Spinner Track Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 30), [-2601, 3974], {
        baseReqs: [boulderReq],
        baseDesc: 'These boulders are blocking the north entrance to the spinner area.'
    })],
    ["Lake Hylia Bridge Spinner Track Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 20), [-3816, 3385], {
        baseReqs: [boulderReq],
        baseDesc: 'These boulders are blocking the south entrance to the spinner area.'
    })],
    ["Outside South Castle Town Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 38), [-4422, 4873], {
        baseReqs: [boulderReq],
        baseDesc: 'Out in the open.'
    })],
    ["Upper Zoras River Above Water Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 31), [-808, 5851], {
        baseReqs: [boulderReq],
        baseDesc: 'In the open near the howling stone.'
    })],
    ["Lake Hylia West Underwater Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 36), [-4847, 3363], {
        baseReqs: [bombBagReq, zoraArmorReq, ironBootsReq],
        baseDesc: "Deep underwater, west of the entrance to Lakebed Temple."
    })],
    ["Lake Hylia East Underwater Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 40), [-4950, 3446], {
        baseReqs: [bombBagReq, zoraArmorReq, ironBootsReq],
        baseDesc: "Deep underwater, east of the entrance to Lakebed Temple."
    })],
    ["Agitha Male Ant Reward",           getAgithaRewardFlag(0)],
    ["Agitha Female Ant Reward",         getAgithaRewardFlag(1)],
    ["Agitha Male Dayfly Reward",        getAgithaRewardFlag(2)],
    ["Agitha Female Dayfly Reward",      getAgithaRewardFlag(3)],
    ["Agitha Male Beetle Reward",        getAgithaRewardFlag(4)],
    ["Agitha Female Beetle Reward",      getAgithaRewardFlag(5)],
    ["Agitha Male Mantis Reward",        getAgithaRewardFlag(6)],
    ["Agitha Female Mantis Reward",      getAgithaRewardFlag(7)],
    ["Agitha Male Stag Beetle Reward",   getAgithaRewardFlag(8)],
    ["Agitha Female Stag Beetle Reward", getAgithaRewardFlag(9)],
    ["Agitha Male Pill Bug Reward",      getAgithaRewardFlag(10)],
    ["Agitha Female Pill Bug Reward",    getAgithaRewardFlag(11)],
    ["Agitha Male Butterfly Reward",     getAgithaRewardFlag(12)],
    ["Agitha Female Butterfly Reward",   getAgithaRewardFlag(13)],
    ["Agitha Male Ladybug Reward",       getAgithaRewardFlag(14)],
    ["Agitha Female Ladybug Reward",     getAgithaRewardFlag(15)],
    ["Agitha Male Snail Reward",         getAgithaRewardFlag(16)],
    ["Agitha Female Snail Reward",       getAgithaRewardFlag(17)],
    ["Agitha Male Phasmid Reward",       getAgithaRewardFlag(18)],
    ["Agitha Female Phasmid Reward",     getAgithaRewardFlag(19)],
    ["Agitha Male Grasshopper Reward",   getAgithaRewardFlag(20)],
    ["Agitha Female Grasshopper Reward", getAgithaRewardFlag(21)],
    ["Agitha Male Dragonfly Reward",     getAgithaRewardFlag(22)],
    ["Agitha Female Dragonfly Reward",   getAgithaRewardFlag(23)],
    ["Jovani House Poe", new Flag(poeSoul, [-4193, 5102], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Enter the house using the dig spot to obtain this poe soul.'
    })],
    ["Jovani 20 Poe Soul Reward", new Flag(jovaniBottle, [-3915, 4994], {
        baseReqs: [shadowCrystalReq, Requirement.fromCountItem(poeSoul, 20)],
        baseDesc: "Talk to Jovani after collecting 20 poe souls to receive this reward.",
        randoCategory: Categories.Gifts
    })],
    ["Jovani 60 Poe Soul Reward", new Flag(Rupees.Silver, [-3840, 4994], {
        baseReqs: [shadowCrystalReq, Requirement.fromCountItem(poeSoul, 60)],
        baseDesc: 'Talk to Jovani after collecting 60 poe souls to receive a Silver Rupee. You can also go see him at the' +
                    'bar, then everytime you come back in his house, talk to his cat Gengle to receive a Silver Rupee (You must leave Castle Town to get another one).',
        randoCategory: Categories.Gifts,
        randoDesc: 'Talk to Jovani after collecting 60 poe souls to receive the reward.'
    })],
    ["STAR Prize 1", new Flag(bigQuiver, [-4113, 4433], {
        baseReqs: [clawshotReq, Requirement.fromCountItem(rupees, 10)],
        baseDesc: 'Pay 10 rupees to play the first STAR minigame and win it to receive the big quiver.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Pay 10 rupees to play the first STAR minigame and win it to receive the reward.'
    })],
    ["STAR Prize 2", new Flag(giantQuiver, [-4128, 4479], {
        baseReqs: [getFlagReq("STAR Prize 1"), doubleClawshotReq, Requirement.fromCountItem(rupees, 15)],
        baseDesc: 'Pay 15 rupees to play the second STAR minigame and win it to receive the giant quiver.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Pay 15 rupees to play the second STAR minigame and win it to receive the reward.'
    })],
    ["Castle Town Malo Mart Magic Armor", new Flag(magicArmor, [-4231, 4706], {
        baseReqs: [getFlagReq("Kakariko Village Malo Mart Castle Town Shop"), Requirement.fromBoolItem(wallets.getItemByIndex(1)), Requirement.fromCountItem(rupees, 598)],
        baseDesc: 'After repairing the Castle Town bridge for 1000 rupees, pay 200 rupees (2000 rupees if you did not do the Goron Springwater ' +
                  'Rush quest) to open the Castle Town Branch of Malo Mart. You can then buy the Magic Armor for 598 rupees. This item costs 1798 rupees total (or 3598 rupees without GSR).',
        randoCategory: Categories.ShopItems,
        randoReqs: [getFlagReq("Kakariko Village Malo Mart Castle Town Shop"), [Requirement.fromBoolItem(wallets.getItemByIndex(1)), walletCapacityReq], Requirement.fromCountItem(rupees, 598)],
        randoDesc: 'After repairing the Castle Town bridge for 500 rupees, pay 200 rupees (2000 rupees if you did not do the Goron Springwater ' +
                  'Rush quest) to open the Castle Town Branch of Malo Mart. You can then buy the Magic Armor for 598 rupees. This item costs 1298 rupees total (or 3098 rupees without GSR).'
    })],
    ["Telma Invoice", new Flag(invoice, [-4108, 5062], {
        baseReqs: [Requirement.fromBoolItem(renadosLetter)],
        baseDesc: "Give Renado's Letter to Telma to receive the Invoice.",
        randoCategory: Categories.Gifts,
        randoDesc: "Give Renado's Letter to Telma to receive the item. This check is never randomized."
    })],
    ["West Hyrule Field Helmasaur Grotto Chest", new Flag(chest.with(Rupees.Orange), [-3718, 3801], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: "Use the clawshot on the vines to reach the grotto entrance. Once inside, defeat all the Helmasaurs to make the chest appear."
    })],
    ["Lanayru Field Skulltula Grotto Chest", new Flag(chest.with(Rupees.Purple), [-1830, 4720], {
        baseReqs: [shadowCrystalReq, lanternReq],
        baseDesc:  'Light the 3 torches separated by the wooden barriers to make the chest appear.'
    })],
    ["Lanayru Field Poe Grotto Right Poe", new Flag(poeSoul, [-2351, 4111], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'On the elevated platform.'
    })],
    ["Lanayru Field Poe Grotto Left Poe", new Flag(poeSoul, [-2378, 4211], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Right of the elevated platform.'
    })],
    ["Lake Hylia Bridge Bubble Grotto Chest", new Flag(chest.with(Rupees.Orange), [-5400, 3629], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, shadowCrystalReq],
        baseDesc: 'Defeat all the Bubbles to make the chest appear.'
    })],
    ["Lake Hylia Water Toadpoli Grotto Chest", new Flag(chest.with(Rupees.Orange), [-5237, 3005], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Defeat all the Toadpolis to make the chest appear. Tip: You can reflect their projectiles with Wolf Link attacks.'
    })],
    ["Lake Hylia Shell Blade Grotto Chest", new Flag(chest.with(Rupees.Orange), [-4354, 2828], {
        baseReqs: [Requirement.fromCountItem(rupees, 20), shadowCrystalReq, [bombBagReq, new AndRequirements([woodenSwordReq, ironBootsReq])]],
        baseDesc: "The grotto is on the platform under Fowl's house. Play the Flight By Fowl minigame (20 rupees) and use " + 
                  "the Cucco to reach the platform. Once inside, defeat all 4 Shellblades with a sword or water bombs to make the chest appear."
    })],
    ["Outside South Castle Town Tektite Grotto Chest", new Flag(chest.with(Rupees.Orange), [-4292, 4907], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Defeat all the Tektites to make the chest appear.',
    })],
    ["Lanayru Spring Underwater Left Chest", new Flag(smallChest.with(Rupees.Blue), [-5210, 3566], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
        baseDesc: "Sink down to get this underwater chest on the left side."
    })],
    ["Lanayru Spring Underwater Right Chest", new Flag(smallChest.with(Rupees.Yellow), [-5197, 3360], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
        baseDesc: "Sink down to get this underwater chest on the right side."
    })],
    ["Lanayru Spring Back Room Left Chest", new Flag(smallChest.with(waterBombs, 5), [-5538, 3542], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the vines on either side, open the door and walk to the chest on the left.'
    })],
    ["Lanayru Spring Back Room Right Chest", new Flag(smallChest.with(Rupees.Blue), [-5558, 3491], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the vines on either side, open the door and walk to the chest on the right.'
    })],
    ["Lanayru Spring Back Room Lantern Chest", new Flag(chest.with(heartPiece), [-5559, 3526], {
        baseReqs: [clawshotReq, lanternReq],
        baseDesc: 'Light the 2 torches in the room to make the chest appear.'
    })],
    ["Lanayru Spring West Double Clawshot Chest", new Flag(chest.with(Rupees.Orange), [-5128, 3232], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path, then take a left to reach the chest.'
    })],
    ["Lanayru Spring East Double Clawshot Chest", new Flag(chest.with(Rupees.Orange), [-5145, 3773], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path, then take a right to reach the chest.'
    })],
    ["Lanayru Spring Underwater North Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 37), [-5171, 3447], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, near the entrance."
    })],
    ["Lanayru Spring Underwater South Rupee Boulder", new Flag(rupeeBoulder.with(rupees, 41), [-5322, 3394], {
        baseReqs: [bombBagReq, [ironBootsReq, magicArmorReq]],
        baseDesc: "Underwater, in the back."
    })],
    ["Lake Lantern Cave First Chest", new Flag(smallChest.with(bombs, 5), [-5696, 3100], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave Second Chest", new Flag(smallChest.with(Rupees.Yellow), [-5665, 3145], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back and defeat the Keese.'
    })],
    ["Lake Lantern Cave Third Chest", new Flag(smallChest.with(Rupees.Red), [-5631, 3200], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave First Poe", new Flag(poeSoul, [-5632, 3440], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'Near the torch in the middle of the room.'
    })],
    ["Lake Lantern Cave Fourth Chest", new Flag(smallChest.with(arrows, 10), [-5631, 3487], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Fifth Chest", new Flag(smallChest.with(Rupees.Red), [-5381, 3422], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Sixth Chest", new Flag(chest.with(Rupees.Orange), [-5418, 3185], {
        baseReqs: [boulderReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Lake Lantern Cave Seventh Chest", new Flag(smallChest.with(Rupees.Red), [-5386, 3183], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the right to reveal the chest.'
    })],
    ["Lake Lantern Cave Eighth Chest", new Flag(smallChest.with(bombs, 5), [-5308, 3098], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back and defeat the Tektites.'
    })],
    ["Lake Lantern Cave Ninth Chest", new Flag(smallChest.with(arrows, 10), [-5375, 2828], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left and defeat the Keese.'
    })], 
    ["Lake Lantern Cave Tenth Chest", new Flag(chest.with(Rupees.Purple), [-5341, 2779], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Second Poe", new Flag(poeSoul, [-5260, 3181], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'Near the torch in the middle of the room.'
    })],
    ["Lake Lantern Cave Eleventh Chest", new Flag(smallChest.with(bombs, 10), [-5262, 3231], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Twelfth Chest", new Flag(chest.with(Rupees.Purple), [-5229, 3182], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave Thirteenth Chest", new Flag(smallChest.with(seeds, 50), [-5303, 3268], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave Fourteenth Chest", new Flag(chest.with(Rupees.Orange), [-5333, 3426], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Final Poe", new Flag(poeSoul, [-5523, 3363], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'At the entrance of the room.'
    })],
    ["Lake Lantern Cave End Lantern Chest", new Flag(chest.with(heartPiece), [-5555, 3364], {
        baseReqs: [boulderReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Lanayru Ice Block Puzzle Cave Chest", new Flag(chest.with(heartPiece), [-1725, 4818], {
        baseReqs: [ballAndChainReq],
        baseDesc: 'Complete the 3 block puzzles to open all the gates to access the chest.'
    })],
    // Forest Temple
    ["Forest Temple Entrance Vines Chest", new Flag(smallChest.with(Rupees.Yellow), [-5935, 4317], {
        baseReqs: [[slingshotReq, boomerangReq, bowReq, clawshotReq]],
        baseDesc: 'Use a long ranged item to defeat the spiders and climb to the chest.'
    })],
    ["Forest Temple Central Chest Behind Stairs", new Flag(smallChest.with(Rupees.Red), [-5281, 4240], {
        baseDesc: 'Use the Bombling on the right to blow up the rock blocking the chest.'
    })],
    ["Forest Temple Central North Chest", new Flag(chest.with(forestMap), [-5260, 4294], {
        baseReqs: [lanternReq],
        baseDesc: 'Use the lantern to light the 4 torches that make the stairs leading to the chest rise.'
    })],
    ["Forest Temple Windless Bridge Chest", new Flag(chest.with(forestSK), [-4710, 4812], {
        baseDesc: 'Left of the entrance of the room.'
    })],
    ["Forest Temple East Water Cave Chest", new Flag(chest.with(Rupees.Yellow), [-5445, 5129], {
        baseDesc: 'Swim to the opening and walk to the end to reach the chest.'
    })],
    ["Forest Temple Second Monkey Under Bridge Chest", new Flag(smallChest.with(Rupees.Yellow), [-5155, 5218], {
        baseReqs: [forest1SKReq],
        baseDesc: 'The chest is under the wooden structure.'
    })],
    ["Forest Temple Big Baba Key", new Flag(forestSK, [-5624, 3749], {
        baseReqs: [forest1SKReq],
        baseDesc: 'Defeat the Big Baba to obtain the key. Use the Bomblings if you do not have any weapons.',
        randoReqs: [...forestTempleLeftSideReq],
        randoDesc: 'Defeat the Big Baba to obtain the item. Use the Bomblings if you do not have any weapons.'
    })],
    ["Forest Temple West Deku Like Chest", new Flag(chest.with(heartPiece), [-5467, 3901], {
        baseReqs: [forest1SKReq],
        baseDesc: 'Defeat the Deku Like that blocks the way to access the chest.',
        randoReqs: [...forestTempleLeftSideReq],
    })],
    ["Forest Temple Totem Pole Chest", new Flag(chest.with(forestSK), [-5277, 3498], {
        baseReqs: [forest1SKReq],
        baseDesc: 'Roll into the pillar to make the chest fall.',
        randoReqs: [...forestTempleLeftSideReq],
    })],
    ["Forest Temple West Tile Worm Room Vines Chest", new Flag(smallChest.with(Rupees.Red), [-5224, 3241], {
        baseReqs: [forest1SKReq],
        baseDesc: 'Climb the vines to reach the chest.',
        randoReqs: [...forestTempleLeftSideReq]
    })],
    ["Forest Temple Gale Boomerang", new Flag(boomerang, [-4508, 4262], {
        baseReqs: [forest3SKReq, [woodenSwordReq, ballAndChainReq, bombBagReq, bowReq]],
        baseDesc: 'Defeat Ook to obtain the Gale Boomerang.',
        randoReqs: [[forest3SKReq, new AndRequirements([boomerangReq, ...forestTempleLeftSideReq])], [woodenSwordReq, shadowCrystalReq, ballAndChainReq, bombBagReq, bowReq]]
    })],
    ["Forest Temple West Tile Worm Chest Behind Stairs", new Flag(chest.with(heartPiece), [-5304, 3050], {
        baseReqs: [forest1SKReq, boomerangReq],
        baseDesc: 'Extinguish all the torches to retract the stairs blocking the chest.',
        randoReqs: [...forestTempleLeftSideReq, boomerangReq]
    })],
    ["Forest Temple Central Chest Hanging From Web", new Flag(chest.with(forestCompass), [-5386, 4242], {
        baseReqs: [[boomerangReq, bowReq, clawshotReq, ballAndChainReq]],
        baseDesc: 'Use a long ranged item to break the web holding the chest.'
    })],
    ["Forest Temple Big Key Chest", new Flag(bossChest.with(forestBK), [-5439, 5042], {
        baseReqs: [boomerangReq],
        baseDesc: 'Use the boomerang on the windmill pillars in this pattern: Bottom Right, Bottom Left, Top Right and Top Left.' + 
                    'This opens the gate to the boss key chest.'
    })],
    ["Forest Temple North Deku Like Chest", new Flag(chest.with(forestSK), [-4322, 4342], {
        baseReqs: [boomerangReq],
        baseDesc: 'Grab a bombling or use one of your own bombs to defeat the Deku Like and jump across the platforms.'
    })],
    ["Forest Temple East Tile Worm Chest", new Flag(chest.with(Rupees.Red), [-4510, 5206], {
        baseReqs: [boomerangReq, forest1SKReq],
        baseDesc: 'Climb up the room by going in the back or simply get launched by the Tile Worm closest to the chest.'
    })],
    ["Forest Temple Diababa Heart Container", new Flag(heartContainer, [-3773, 4842], {
        baseReqs: [diababaReq],
        baseDesc: 'Defeat Diababa to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [forestBKReq, boomerangReq, [forest4SKReq, clawshotReq], [woodenSwordReq, ballAndChainReq, bombBagReq, bowReq, shadowCrystalReq]],
        randoDesc: 'Defeat Diababa to obtain the item.'
    })],
    ["Forest Temple Dungeon Reward", new Flag(fusedShadow, [-3796, 4777], {
        baseReqs: [diababaReq],
        baseDesc: 'Defeat Diababa to obtain the Fused Shadow.',
        randoReqs: [forestBKReq, boomerangReq, [forest4SKReq, clawshotReq], [woodenSwordReq, ballAndChainReq, bombBagReq, bowReq, shadowCrystalReq]],
        randoDesc: 'Defeat Diababa to obtain the dungeon reward.'
    })],
    ["Forest Temple Diababa", new Flag(diababa, [-3651, 4870], {
        baseReqs: [forest4SKReq, boomerangReq, forestBKReq, ordonSwordReq],
        baseDesc: 'Defeat Diababa to clear out the Forest Temple.',
        randoReqs: [forestBKReq, boomerangReq, [forest4SKReq, clawshotReq], [woodenSwordReq, ballAndChainReq, bombBagReq, bowReq, shadowCrystalReq]]
    })],
    ["Forest Temple Ooccoo", new Flag(ooccooPot, [-5250, 4565], {
        baseDesc: 'Use the Bombling to blow up the rocks, then pick up or break the pot containing Ooccoo.'
    })],
    ["Forest Temple Tile Worm Monkey Lock", new Flag(lock, [-5309, 2943], {
        baseReqs: [forest2SKReq, lanternReq],
        baseDesc: 'Unlock this door to free the west wing monkey.',
        randoReqs: [webReq, [forest2SKReq, new AndRequirements([clawshotReq, forest1SKReq])]]
    })],
    ["Forest Temple Big Baba Monkey Lock", new Flag(lock, [-5869, 3747], {
        baseReqs: [forest2SKReq, lanternReq],
        baseDesc: 'Unlock this door to free the Big Baba Monkey',
        randoReqs: [webReq, [forest2SKReq, new AndRequirements([clawshotReq, forest1SKReq])]]
    })],
    ["Forest Temple Totem Pole Monkey Lock", new Flag(lock, [-5224, 5140], {
        baseReqs: [forest1SKReq],
        baseDesc: "Unlock this door to reach the room with the totem pole Monkey."
    })],
    ["Forest Temple Windless Bridge Lock", new Flag(lock, [-4570, 5087], {
        baseReqs: [forest1SKReq, boomerangReq],
        baseDesc: "Unlock this door to reach the Northeastern Tile Worm Room."
    })],
    ["Forest Temple Boss Lock", new Flag(bossLock, [-3858, 4868], {
        baseReqs: [forestBKReq, boomerangReq, [forest4SKReq, clawshotReq]],
        baseDesc: "Unlock this door to reach Diababa.",
    })],
    // Goron Mines
    ["Goron Mines Entrance Chest", new Flag(smallChest.with(Rupees.Red), [-5791, 4465], {
        baseReqs: [ironBootsReq],
        baseDesc: 'Defeat the Torch Slug to access to the chest.'
    })],
    ["Goron Mines Main Magnet Room Bottom Chest", new Flag(chest.with(minesSK), [-5232, 4603], {
        baseReqs: [ironBootsReq],
        baseDesc:  'Defeat the Bulblins to easily reach the chest.'
    })],
    ["Goron Mines Gor Amato Key Shard", new Flag(minesBKAmoto, [-5004, 3025], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'Talk to goron elder Gor Amoto to obtain this part of the boss key.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Talk to Gor Amoto to obtain the item.'
    })],
    ["Goron Mines Gor Amato Chest", new Flag(chest.with(minesMap), [-4999, 2966], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'The chest is behind the goron elder.'
    })],
    ["Goron Mines Gor Amato Small Chest", new Flag(smallChest.with(Rupees.Red), [-4971, 2941], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'The small chest is behind the goron elder, on the platform.'
    })],
    ["Goron Mines Magnet Maze Chest", new Flag(chest.with(heartPiece), [-4913, 3891], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'Follow the left path when you get on the ceiling to reach the chest.'
    })],
    ["Goron Mines Ooccoo", new Flag(ooccooPot, [-5027, 3150], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'Pick up the pot where Ooccoo is hiding for her to join you.'
    })],
    ["Goron Mines First Floor Lock", new Flag(lock, [-5052, 3966], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: "Unlock this door to reach Gor Amoto."
    })],
    ["Goron Mines Crystal Switch Room Underwater Chest", new Flag(chest.with(minesSK), [-4591, 4459], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'Use the Iron Boots to sink down to the underwater chest.'
    })],
    ["Goron Mines Crystal Switch Room Small Chest", new Flag(smallChest.with(Rupees.Red), [-4526, 4441], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'Use the Iron Boots to follow the magnet path onto the platform where the chest is.'
    })],
    ["Goron Mines After Crystal Switch Room Magnet Wall Chest", new Flag(chest.with(heartPiece), [-4471, 4242], {
        baseReqs: [ironBootsReq, mines1SKReq],
        baseDesc: 'Follow the magnet path on the wall and take a left to reach the upper platform.'
    })],
    ["Goron Mines Double Beamos Lock", new Flag(lock, [-4200, 4363], {
        baseReqs: [ironBootsReq, mines2SKReq],
        baseDesc: "Unlock this door to reach the huge outdoor area."
    })],
    ["Goron Mines Outside Beamos Chest", new Flag(smallChest.with(minesSK), [-3898, 4270], {
        baseReqs: [ironBootsReq, mines2SKReq],
        baseDesc: 'Follow the left barrier to not get noticed by the Beamos and reach the chest.'
    })],
    ["Goron Mines Outside Underwater Chest", new Flag(chest.with(Rupees.Purple), [-3747, 4568], {
        baseReqs: [ironBootsReq, mines2SKReq],
        baseDesc: 'The chest is behind a breakable wooden barrier underwater. However, you can simply go above the barrier by swimming.'
    })],
    ["Goron Mines Outside Clawshot Chest", new Flag(chest.with(Rupees.Purple), [-3629, 4596], {
        baseReqs: [ironBootsReq, clawshotReq, mines2SKReq],
        baseDesc: 'Clawshot the vines from the door to the right of the room to reach the platform with the chest.'
    })],
    ["Goron Mines Outside Lock", new Flag(lock, [-3833, 4669], {
        baseReqs: [ironBootsReq, mines3SKReq],
    })],
    ["Goron Mines Gor Ebizo Key Shard", new Flag(minesBKEbizo, [-3736, 5491], {
        baseReqs: [ironBootsReq, mines3SKReq],
        baseDesc: 'Talk to goron elder Gor Ebizo to obtain this part of the boss key.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Talk to Gor Ebizo to obtain the item.'
    })],
    ["Goron Mines Gor Ebizo Chest", new Flag(smallChest.with(Rupees.Yellow), [-3764, 5566], {
        baseReqs: [ironBootsReq, mines3SKReq],
        baseDesc: 'Use the stairs to the right of Gor Ebizo to reach the chest.'
    })],
    ["Goron Mines Chest Before Dangoro", new Flag(smallChest.with(Rupees.Yellow), [-3896, 5243], {
        baseReqs: [ironBootsReq, mines3SKReq],
        baseDesc: 'Use the magnet path to reach the chest.'
    })],
    ["Goron Mines Dangoro Chest", new Flag(chest.with(bow.getItemByIndex(0)), [-4550, 5060], {
        baseReqs: [ironBootsReq, mines3SKReq, dangoroReq],
        baseDesc: 'Defeat Dangoro to gain access to the chest.'
    })],
    ["Goron Mines Beamos Room Chest", new Flag(chest.with(minesCompass), [-4786, 4930], {
        baseReqs: [ironBootsReq, mines3SKReq, dangoroReq, bowReq],
        baseDesc: 'Defeat the Beamos and pull it to access the chest.'
    })],
    ["Goron Mines Gor Liggs Key Shard", new Flag(minesBKLiggs, [-4787, 5495], {
        baseReqs: [ironBootsReq, mines3SKReq, dangoroReq, bowReq],
        baseDesc: 'Defeat the Beamos and pull it to have access to the room where Gor Liggs gives you a part of the boss key.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Defeat the Beamos and pull it to have access to the room where Gor Liggs gives you the item.'
    })],
    ["Goron Mines Gor Liggs Chest", new Flag(chest.with(Rupees.Purple), [-4783, 5585], {
        baseReqs: [ironBootsReq, mines3SKReq, dangoroReq, bowReq],
        baseDesc: 'Defeat the beamos and pull it to have access to the room where the chest is, behind the goron elder.'
    })],
    ["Goron Mines Main Magnet Room Top Chest", new Flag(chest.with(Rupees.Purple), [-5155, 4682], {
        baseReqs: [ironBootsReq, mines3SKReq, dangoroReq, bowReq],
        baseDesc: 'Jump across to the platform with the chest to reach it.'
    })],
    ["Goron Mines Boss Lock", new Flag(minesBossLock, [-4170, 3847], {
        baseReqs: [ironBootsReq, mines2SKReq, minesBKReq],
        baseDesc: "Unlock this door to reach Fyrus.",
    })],
    ["Goron Mines Fyrus", new Flag(fyrus, [-4332, 3840], {
        baseReqs: [ironBootsReq, mines2SKReq, minesBKReq, bowReq],
        baseDesc: 'Defeat Fyrus to clear out the Goron Mines.'
    })],
    ["Goron Mines Fyrus Heart Container", new Flag(heartContainer, [-4252, 3815], {
        baseReqs: [ironBootsReq, mines2SKReq, minesBKReq, bowReq],
        baseDesc: 'Defeat Fyrus to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoDesc: 'Defeat Fyrus to obtain the item.'
    })],
    ["Goron Mines Dungeon Reward", new Flag(fusedShadow, [-4276, 3884], {
        baseReqs: [ironBootsReq, mines2SKReq, minesBKReq, bowReq],
        baseDesc: 'Defeat Fyrus to obtain the Fused Shadow.',
        randoDesc: 'Defeat Fyrus to obtain the dungeon reward.'
    })],
    // Lakebed Temple
    ["Lakebed Temple Lobby Rear Chest", new Flag(smallChest.with(waterBombs, 10), [-5601, 4339], {
        baseDesc: 'The chest is on the right of the nearby rock pillar.'
    })],
    ["Lakebed Temple Lobby Left Chest", new Flag(smallChest.with(arrows, 20), [-5509, 4199], {
        baseDesc: 'The chest is between the two rock pillars.'
    })],
    ["Lakebed Temple Stalactite Room Chest", new Flag(smallChest.with(waterBombs, 10), [-4950, 4501], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'Knock down the stalactites with bombs and climb to the chest.'
    })],
    ["Lakebed Temple East Second Floor Southwest Chest", new Flag(smallChest.with(bombs, 5), [-4487, 5223], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed1SKReq],
        baseDesc: 'On the left when you enter the room from the lobby.'
    })],
    ["Lakebed Temple East Second Floor Southeast Chest", new Flag(chest.with(lakebedSK), [-4585, 5497], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed1SKReq],
        baseDesc: 'Go around the room and cross by the middle section to reach the chest.'
    })],
    ["Lakebed Temple Chandelier Chest", new Flag(chest.with(heartPiece), [-4373, 4363], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq],
        baseDesc: 'The chest is on the chandelier hanging from the ceiling, use the clawshot to get there.'
    })],
    ["Lakebed Temple West Second Floor Central Small Chest", new Flag(smallChest.with(Rupees.Red), [-4223, 3363], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, lakebed2SKReq],
        baseDesc: 'Once on the highest vine platform, clawshot the target above the platform where the chest is.'
    })],
    ["Lakebed Temple West Second Floor Northeast Chest", new Flag(chest.with(bombs, 20), [-4212, 3451], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, lakebed2SKReq],
        baseDesc: 'After activating the water, go back the way you came from through the waterwheel to find the chest.' 
    })], 
    ["Lakebed Temple West Second Floor Southwest Underwater Chest", new Flag(chest.with(Rupees.Red), [-4583, 2965], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, lakebed2SKReq, ironBootsReq],
        baseDesc: 'Defeat the enemies underwater to have easier access to the chest.'
    })],
    ["Lakebed Temple West Second Floor Southeast Chest", new Flag(smallChest.with(Rupees.Red), [-4561, 3301], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, lakebed2SKReq],
        baseDesc: 'Go through the middle room accross the spinning gears to get the chest.'
    })],
    ["Lakebed Temple Ooccoo", new Flag(ooccooPot, [-4490, 4552], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseReqs: 'Pick up or break the pot where Ooccoo is hiding.'
    })],
    ["Lakebed Temple Main Room Lock", new Flag(lock, [-4372, 4666], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed1SKReq],
        baseDesc: "Unlock this door to reach the second floor of the east wing."
    })],
    ["Lakebed Temple East Water Supply Lock", new Flag(lock, [-4425, 6048], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq],
        baseDesc: "Unlock this door to reach the east water supply."
    })],
    ["Lakebed Temple Central Room Small Chest", new Flag(smallChest.with(arrows, 20), [-4518, 4517], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'The chest is accessible when you first get into the room, go down the stairs and take a left.'
    })],
    ["Lakebed Temple Central Room Chest", new Flag(chest.with(lakebedMap), [-4256, 4558], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'The chest is accessible when you first get into the room, manipulate the stairs to reach it.'
    })],
    ["Lakebed Temple East Lower Waterwheel Stalactite Chest", new Flag(chest.with(lakebedSK), [-4506, 5613], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'Knock down the stalactite with bombs to make a platform to jump to the chest.'
    })],
    ["Lakebed Temple Before Deku Toad Alcove Chest", new Flag(chest.with(lakebedSK), [-4181, 5694], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq],
        baseDesc: 'Defeat the Chus to have an easier time accessing the chest.'
    })],
    ["Lakebed Temple Deku Toad Chest", new Flag(chest.with(clawshots.getItemByIndex(0)), [-3736, 5469], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed3SKReq, ironBootsReq],
        baseDesc: 'Defeat Deku Toad to make it spit out the chest.'
    })],
    ["Lakebed Temple West Lower Small Chest", new Flag(smallChest.with(waterBombs, 10), [-4299, 3311], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, lakebed2SKReq],
        baseDesc: 'Jump on the hanging platform then shoot the clawshot at the target above the platform with the chest to reach it.'
    })],
    ["Lakebed Temple East Lower Waterwheel Bridge Chest", new Flag(chest.with(heartPiece), [-4718, 5483], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, lakebed2SKReq],
        baseDesc: 'Once the water level is elevated in the room, press on the switch to open the gate and clawshot the target on the ' + 
                  'back wall to reach the chest. Clawshot the target on the ceiling to get back out.'
    })],
    ["Lakebed Temple Underwater Maze Small Chest", new Flag(smallChest.with(bombs, 5), [-4420, 2539], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, lakebed2SKReq],
        baseDesc: 'In the section with the entrance to the long tunnel, swim up to find to chest.'
    })],
    ["Lakebed Temple Before Deku Toad Lock", new Flag(lock, [-4331, 5867], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed3SKReq],
        baseDesc: "Unlock this door to reach the tunnel to Deku Toad."
    })],
    ["Lakebed Temple East Water Supply Small Chest", new Flag(smallChest.with(bombs, 10), [-4330, 6166], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq],
        baseDesc: 'Go to the top of the room to reach the chest.'
    })],
    ["Lakebed Temple East Water Supply Clawshot Chest", new Flag(chest.with(Rupees.Purple), [-4378, 6427], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq],
        baseDesc: 'Clawshot the target on the wall behind the chest to reach it.'
    })],
    ["Lakebed Temple West Water Supply Small Chest", new Flag(smallChest.with(bombs, 10), [-4410, 2359], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq],
        baseDesc: 'Go to the top of the room using the clawshot targets to reach the chest.'
    })],
    ["Lakebed Temple West Water Supply Chest", new Flag(chest.with(lakebedCompass), [-4362, 2108], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq],
        baseDesc: 'Clawshot the target on the wall behind the chest to reach it.'
    })],
    ["Lakebed Temple Central Room Spire Chest", new Flag(chest.with(Rupees.Red), [-4327, 4363], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq],
        baseDesc: 'Make the water level rise once by activated the east water supply to access the chest.'
    })],
    ["Lakebed Temple Before Deku Toad Underwater Right Chest", new Flag(chest.with(bombs, 5), [-4021, 5724], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed3SKReq, ironBootsReq],
        baseDesc: 'Walk through the jet stream with the iron boots and take a left to the chest.'
    })],
    ["Lakebed Temple Before Deku Toad Underwater Left Chest", new Flag(chest.with(Rupees.Red), [-4186, 5665], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed3SKReq, ironBootsReq],
        baseDesc: 'Walk away from the jet stream into the tunnel to reach the chest.'
    })],
    ["Lakebed Temple Big Key Chest", new Flag(bossChest.with(lakebedBK), [-4592, 2725], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq],
        baseDesc: 'In the room above, hang from the clawshot target and descend towards the chest.'
    })],
    ["Lakebed Temple Boss Lock", new Flag(lakebedBossLock, [-4414, 4362], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq, lakebedBKReq],
        baseDesc: "Unlock this door to reach Morpheel."
    })],
    ["Lakebed Temple Morpheel", new Flag(morpheel, [-4416, 4364], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq, zoraArmorReq, ironBootsReq, woodenSwordReq, lakebedBKReq],
        baseDesc: 'Defeat Morpheel to clear out the Lakebed Temple.'
    })],
    ["Lakebed Temple Morpheel Heart Container", new Flag(heartContainer, [-4402, 5200], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq, zoraArmorReq, ironBootsReq, woodenSwordReq, lakebedBKReq],
        baseDesc: 'Defeat Morpheel to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoDesc: 'Defeat Morpheel to obtain the item.'
    })],
    ["Lakebed Temple Dungeon Reward", new Flag(fusedShadow, [-4520, 5050], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], lakebed2SKReq, clawshotReq, zoraArmorReq, ironBootsReq, woodenSwordReq, lakebedBKReq],
        baseDesc: 'Defeat Morpheel to obtain the third and last Fused Shadow.',
        randoDesc: 'Defeat Morpheel to obtain the dungeon reward.'
    })],
    // Arbiter's Grounds
    ["Arbiters Grounds Entrance Chest", new Flag(chest.with(arbiterSK), [-5336, 3974], {
        baseReqs: [groundsFirstRoomReq],
        baseDesc: 'Break the wooden barrier and jump across to the chest.'
    })],
    ["Arbiters Grounds Entrance Lock", new Flag(lock, [-5277, 4323], {
        baseReqs: [groundsFirstRoomReq, arbiter1SKReq],
        baseDesc: "Unlock this door to reach the main room of the dungeon."
    })],
    ["Arbiters Grounds Torch Room Poe", new Flag(poeSoul, [-4763, 4329], {
        baseReqs: [shadowCrystalReq, arbiter1SKReq, lanternReq],
        baseDesc: 'The first of the 4 poes, waits in the middle of the room after the cutscene.'
    })],
    ["Arbiters Grounds Torch Room East Chest", new Flag(chest.with(heartPiece), [-4562, 4481], {
        baseReqs: [groundsFirstRoomReq, arbiter1SKReq, lanternReq],
        baseDesc: 'Walk across the platforms or use the clawshot to have a way back.'
    })],
    ["Arbiters Grounds Torch Room West Chest", new Flag(chest.with(arbiterMap), [-4561, 4171], {
        baseReqs: [groundsFirstRoomReq, arbiter1SKReq, lanternReq],
        baseDesc: 'Walk across the quicksand using the sinking platform to reach the chest.'
    })],
    ["Arbiters Grounds West Small Chest Behind Block", new Flag(smallChest.with(Rupees.Red), [-4576, 3840], {
        baseReqs: [groundsFirstRoomReq, arbiter1SKReq, lanternReq],
        baseDesc: 'Upon entering the room, follow the path to the right to reach the chest.'
    })],
    ["Arbiters Grounds East Turning Room Poe", new Flag(poeSoul, [-4337, 4831], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter1SKReq, lanternReq],
        baseDesc: 'When the room below is spun, clawshot up through the opening, then go in the poe room to defeat it.'
    })],
    ["Arbiters Grounds West Chandelier Chest", new Flag(chest.with(Rupees.Red), [-4920, 3766], {
        baseReqs: [shadowCrystalReq, arbiter4SKReq, lanternReq],
        baseDesc: 'Pull the chain to raise the chandelier, then cross under it to reach the chest.'
    })],
    ["Arbiters Grounds West Stalfos Northeast Chest", new Flag(smallChest.with(bombs, 5), [-4707, 3322], {
        baseReqs: [shadowCrystalReq, arbiter4SKReq, lanternReq],
        baseDesc: 'Break the wooden barrier and go to the north-east area to reach the chest.'
    })],
    ["Arbiters Grounds West Stalfos West Chest", new Flag(smallChest.with(bombs, 5), [-4767, 3108], {
        baseReqs: [shadowCrystalReq, arbiter4SKReq, lanternReq],
        baseDesc: 'Break the wooden barrier and go to the west area to reach the chest.'
    })],
    ["Arbiters Grounds Big Key Chest", new Flag(bossChest.with(arbiterBK), [-4156, 3911], {
        baseReqs: [clawshotReq, shadowCrystalReq, spinnerReq, arbiter5SKReq, lanternReq],
        baseDesc: 'After clearing the room with the spinner ramps, access to the chest is granted upon entering the next room.'
    })],
    ["Arbiters Grounds East Turning Room Lock", new Flag(lock, [-4766, 5081], {
        baseReqs: [groundsFirstRoomReq, arbiter2SKReq, lanternReq],
        baseDesc: "Unlock this door to reach the eastern wing."
    })],
    ["Arbiters Grounds East Lower Turnable Redead Chest", new Flag(smallChest.with(arbiterSK), [-4626, 4836], {
        baseReqs: [shadowCrystalReq, arbiter1SKReq, lanternReq],
        baseDesc: 'Dig the sand spot to reveal the lever, then pull it to access the stairs. then, spin the room to gain access to the chest.'
    })],
    ["Arbiters Grounds East Upper Turnable Chest", new Flag(chest.with(arbiterCompass), [-5358, 5475], {
        baseReqs: [groundsFirstRoomReq, arbiter2SKReq, lanternReq],
        baseDesc: 'Walk up the stairs to find the chest in the area behind the statue.'
    })],
    ["Arbiters Grounds East Upper Turnable Redead Chest", new Flag(chest.with(arbiterSK), [-5241, 5831], {
        baseReqs: [groundsFirstRoomReq, arbiter2SKReq, lanternReq],
        baseDesc: 'Break the wooden barrier then defeat the Redead to easily open the chest.'
    })],
    ["Arbiters Grounds East Upper Turnable Lock", new Flag(lock, [-5240, 5251], {
        baseReqs: [groundsFirstRoomReq, arbiter3SKReq, lanternReq],
        baseDesc: "Unlock this door to reach the 3rd poe."
    })],
    ["Arbiters Grounds Hidden Wall Poe", new Flag(poeSoul, [-5240, 5021], {
        baseReqs: [shadowCrystalReq, arbiter3SKReq, lanternReq],
        baseDesc: 'Dig to reveal a lever, then pull it to gain access to the room where the poe awaits.'
    })],
    ["Arbiters Grounds Ghoul Rat Room Chest", new Flag(smallChest.with(arbiterSK), [-4883, 4834], {
        baseReqs: [groundsFirstRoomReq, arbiter3SKReq, lanternReq],
        baseDesc: 'The chest is below the ring platform.'
    })],
    ["Arbiters Grounds Ghoul Rat Room Lock", new Flag(lock, [-4767, 4551], {
        baseReqs: [shadowCrystalReq, arbiter4SKReq, lanternReq],
        baseDesc: "Unlock this door to reach the chandelier in the torch room."
    })],
    ["Arbiters Grounds West Poe", new Flag(poeSoul, [-5186, 3780], {
        baseReqs: [shadowCrystalReq, arbiter4SKReq, stalfosReq, lanternReq],
        baseDesc: "Defeat the poe easily by using Midna's charge attack."
    })],
    ["Arbiters Grounds North Turning Room Chest", new Flag(chest.with(arbiterSK), [-4257, 4786], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter4SKReq, stalfosReq, lanternReq],
        baseDesc: 'Enter the tunnel from the entrance with no spikes, then go to the end of it to find the chest.'
    })],
    ["Arbiters Grounds North Turning Room Lock", new Flag(lock, [-4325, 4791], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, lanternReq],
        baseDesc: "Unlock this door to reach the spikes room."
    })],
    ["Arbiters Grounds Ooccoo", new Flag(ooccooPot, [-5201, 4240], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, lanternReq],
        baseDesc: 'Pick up or break the pot where Ooccoo is hiding for her to join you.'
    })],
    ["Arbiters Grounds Death Sword Chest", new Flag(chest.with(spinner), [-3598, 4239], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, lanternReq],
        baseDesc: 'Defeat Death Sword to obtain the Spinner.'
    })],
    ["Arbiters Grounds Spinner Room First Small Chest", new Flag(smallChest.with(bombs, 10), [-4490, 3311], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, spinnerReq, lanternReq],
        baseDesc: 'Use the spinner to float above the quicksand and reach the chest.'
    })],
    ["Arbiters Grounds Spinner Room Second Small Chest", new Flag(smallChest.with(Rupees.Red), [-4486, 3078], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, spinnerReq, lanternReq],
        baseDesc: 'From the previous chest, use the spinner to float above the quicksand and reach the chest.'
    })],
    ["Arbiters Grounds Spinner Room Lower Central Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-4307, 2997], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, spinnerReq, lanternReq],
        baseDesc: 'Hidden under the spinner ramp, use the spinner to float above the quicksand and reach the chest.'
    })],
    ["Arbiters Grounds Spinner Room Stalfos Alcove Chest", new Flag(chest.with(heartPiece), [-4369, 3666], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, spinnerReq, lanternReq],
        baseDesc: 'Use the spinner ramp and defeat the Stalfos to reach this chest.'
    })],
    ["Arbiters Grounds Spinner Room Lower North Chest", new Flag(smallChest.with(Rupees.Yellow), [-4156, 3605], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter5SKReq, stalfosReq, spinnerReq, lanternReq],
        baseDesc: 'Use the spinner ramp and defeat the 2 stalfos that are guarding the chest to open it.'
    })],
    ["Arbiters Grounds Boss Lock", new Flag(bossLock, [-4276, 4326], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter4SKReq, stalfosReq, spinnerReq, arbiterBKReq, lanternReq],
        baseDesc: "Unlock this door to reach Stallord."
    })],
    ["Arbiters Grounds Stallord", new Flag(stallord, [-4530, 4332], {
        baseReqs: [clawshotReq, shadowCrystalReq, arbiter4SKReq, stalfosReq, spinnerReq, arbiterBKReq, lanternReq],
        baseDesc: "Defeat Stallord to clear out the Arbiter's Grounds."
    })],
    ["Arbiters Grounds Stallord Heart Container", new Flag(heartContainer, [-4928, 4384], {
        baseReqs: [clawshotReq, lanternReq, shadowCrystalReq, arbiter4SKReq, stalfosReq, spinnerReq, arbiterBKReq],
        baseDesc: 'Defeat Stallord to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoDesc: 'Defeat Stallord to obtain the item.'
    })],
    ["Arbiters Grounds Dungeon Reward", new Flag(mirrorShard, [-4726, 4334], {
        baseReqs: [clawshotReq, lanternReq, shadowCrystalReq, arbiter4SKReq, stalfosReq, spinnerReq, arbiterBKReq],
        baseDesc: 'Defeat Stallord to obtain the dungeon reward.'
    })],
    // Snowpeak Ruins
    ["Snowpeak Ruins Lobby West Armor Chest", new Flag(smallChest.with(Rupees.Red), [-6017, 4105], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the armor with the Ball and Chain to reveal the chest."
    })],
    ["Snowpeak Ruins Lobby Armor Poe", new Flag(poeSoul, [-6017, 4420], {
        baseReqs: [ballAndChainReq, shadowCrystalReq],
        baseDesc: "Break the armor with the Ball and Chain to reveal the poe."
    })],
    ["Snowpeak Ruins Lobby East Armor Chest", new Flag(smallChest.with(Rupees.Yellow), [-5883, 4428], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the armor with the Ball and Chain to reveal the chest."
    })],
    ["Snowpeak Ruins Lobby Armor Bubble Rupee", new Flag(Rupees.Orange, [-5883, 4119], {
        baseReqs: [ballAndChainReq],
        baseDesc: 'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'
    })],
    ["Snowpeak Ruins Lobby Poe", new Flag(poeSoul, [-5576, 4264], {
        baseReqs: [shadowCrystalReq],
        baseDesc: "The poe is above the ice in the open."
    })],
    ["Snowpeak Ruins Mansion Map", new Flag(snowpeakMap, [-5072, 4316], {
        baseDesc: "Talk to Yeta to obtain the dungeon map.",
        randoCategory: Categories.Gifts,
        randoDes: "Talk to Yeta to obtain the item.",
    })],
    ["Snowpeak Ruins Ooccoo", new Flag(ooccooPot, [-5381, 5064], {
        baseDesc: "Pick up the pot where Ooccoo is hiding."
    })],
    ["Snowpeak Ruins East Courtyard Chest", new Flag(smallChest.with(Rupees.Red), [-4942, 4533], {
        baseDesc: "Near the wall, defeat the Wolfos for easier access."
    })],
    ["Snowpeak Ruins East Courtyard Buried Chest", new Flag(smallChest.with(snowpeakSK), [-4495, 4530], {
        baseReqs: [shadowCrystalReq],
        baseDesc: "Dig the spot where the chest is poking out of."
    })],
    ["Snowpeak Ruins East Corrider Lock", new Flag(snowpeakLock, [-4239, 4797], {
        baseReqs: [snowpeak1SKReq],
        baseDesc: "Unlock this door to reach the north-eastern section of the first floor."
    })],
    ["Snowpeak Ruins Ordon Pumpkin Chest", new Flag(chest.with(pumpkin), [-4369, 5305], {
        baseReqs: [snowpeak1SKReq],
        baseDesc: "Defeat the 2 Chilfos to unlock the door and gain access to the chest."
    })],
    ["Snowpeak Ruins West Courtyard Buried Chest", new Flag(smallChest.with(snowpeakSK), [-4462, 3961], {
        baseReqs: [shadowCrystalReq, [ballAndChainReq, pumpkinReq]],
        baseDesc: "Dig twice on the elevated snow to reveal the chest."
    })],
    ["Snowpeak Ruins Courtyard Central Chest", new Flag(smallChest.with(bombs, 5), [-4943, 4269], {
        baseReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, snowpeak1SKReq, bombBagReq])]],
        baseDesc: "Use the cannon or the ball and chain to break the ice that is blocking the chest."
    })],
    ["Snowpeak Ruins Courtyard West Lock", new Flag(snowpeakLock, [-4611, 3842], {
        baseReqs: [snowpeak1SKReq, [ballAndChainReq, pumpkinReq]],
        baseDesc: "Unlock this door to reach the cannonballs of the western corridor."
    })],
    ["Snowpeak Ruins West Cannon Room Central Chest", new Flag(smallChest.with(Rupees.Red), [-4157, 3214], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the ice in front of the chest to reveal it."
    })],
    ["Snowpeak Ruins West Cannon Room Corner Chest", new Flag(smallChest.with(bombs, 5), [-4015, 3896], {
        baseReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, bombBagReq])]],
        baseDesc: "Use the cannon or the ball and chain to break the ice that is blocking the chest."
    })],
    ["Snowpeak Ruins Wooden Beam Central Chest", new Flag(smallChest.with(Rupees.Red), [-4814, 3397], {
        baseReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, bombBagReq])]],
        baseDesc: "Jump across the wooden planks to reach the chest."
    })],
    ["Snowpeak Ruins Wooden Beam Northwest Chest", new Flag(chest.with(snowpeakCompass), [-4926, 3578], {
        baseReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, bombBagReq])]],
        baseDesc: "Jump across the wooden planks to reach the chest."
    })],
    ["Snowpeak Ruins Broken Floor Chest", new Flag(chest.with(heartPiece), [-5373, 3541], {
        baseReqs: [cheeseReq, ballAndChainReq],
        baseDesc: "Break the damaged floor and jump down to chest.",
        glitchedReqs: [[boomerangReq, new AndRequirements([cheeseReq, ballAndChainReq])]],
        glitchedDesc: "Break the damaged floor and jump down to chest or LJA from the other entrance of the room to the chest.",
    })],
    ["Snowpeak Ruins Ball and Chain", new Flag(ballAndChain, [-4072, 4270], {
        baseReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, snowpeak1SKReq, bombBagReq])]],
        baseDesc: "Defeat Darkhammer to obtain the Ball and Chain.",
        randoDesc: "Pick up the Ball and Chain to receive the item."
    })],
    ["Snowpeak Ruins Chest After Darkhammer", new Flag(chest.with(cheese), [-3611, 4265], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the ice blocks to gain access to the chest."
    })],
    ["Snowpeak Ruins Armor Bubble Rupee After Darkhammer", new Flag(Rupees.Orange, [-3767, 4348], {
        baseReqs: [ballAndChainReq],
        baseDesc: 'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'
    })],
    ["Snowpeak Ruins Chapel Chest", new Flag(chest.with(snowpeakBK), [-3854, 3400], {
        baseReqs: [ballAndChainReq, bombBagReq, snowpeak2SKReq, cheeseReq],
        baseDesc: "Defeat all the Chilfos to unlock the door and access the chest."
    })],
    ["Snowpeak Ruins Ice Room Poe", new Flag(poeSoul, [-5198, 5214], {
        baseReqs: [cheeseReq, ballAndChainReq, snowpeak1SKReq, shadowCrystalReq],
        baseDesc: "Break the ice blocks with the Ball and Chain to reveal the poe."
    })],
    ["Snowpeak Ruins Lobby Chandelier Chest", new Flag(chest.with(heartPiece), [-5833, 4268], {
        baseReqs: [cheeseReq, ballAndChainReq, snowpeak1SKReq],
        baseDesc: "Swing from chandelier to chandelier to reach the chest.<br>Tip: Hit the last chandelier when yours is almost at the furthest from the chest."
    })],
    ["Snowpeak Ruins Northeast Chandelier Chest", new Flag(smallChest.with(snowpeakSK), [-4392, 5147], {
        baseReqs: [cheeseReq, ballAndChainReq, snowpeak1SKReq, clawshotReq],
        baseDesc:  "Swing from the chandeliers to reach the chest."
    })],
    ["Snowpeak Ruins Wooden Beam Chandelier Chest", new Flag(chest.with(snowpeakSK), [-4563, 3408], {
        baseReqs: [cheeseReq, ballAndChainReq],
        baseDesc: "Swing the chandelier with the Ball and Chain to reach the chest."
    })],
    ["Snowpeak Ruins Lobby Lock", new Flag(snowpeakLock, [-5366, 3839], {
        baseReqs: [cheeseReq, ballAndChainReq, snowpeak1SKReq],
        baseDesc: "Unlock this door to reach the second floor of the lobby."
    })],
    ["Snowpeak Ruins Ice Room Lock", new Flag(snowpeakLock, [-5148, 4597], {
        baseReqs: [cheeseReq, ballAndChainReq, snowpeak2SKReq],
        baseDesc: "Unlock this door to reach the central courtyard cannon."
    })],
    ["Snowpeak Ruins Boss Lock", new Flag(snowpeakBossLock, [-4350, 4268], {
        baseReqs: [ballAndChainReq, bombBagReq, snowpeak2SKReq, cheeseReq, bedroomKeyReq],
        baseDesc: "Unlock this door to reach Blizzeta."
    })],
    ["Snowpeak Ruins Blizzeta", new Flag(blizzeta, [-4174, 4268], {
        baseReqs: [ballAndChainReq, bombBagReq, snowpeak2SKReq, cheeseReq, bedroomKeyReq],
        baseDesc: 'Defeat Blizzeta to clear out the Snowpeak Ruins.'
    })],
    ["Snowpeak Ruins Blizzeta Heart Container", new Flag(heartContainer, [-3963, 4358], {
        baseReqs: [ballAndChainReq, bombBagReq, snowpeak2SKReq, cheeseReq, bedroomKeyReq],
        baseDesc: "Defeat Blizzeta to obtain the Heart Container.",
        randoCategory: Categories.Main,
        randoDesc: "Defeat Blizzeta to obtain the item."
    })],
    ["Snowpeak Ruins Dungeon Reward", new Flag(mirrorShard, [-4066, 4170], {
        baseReqs: [ballAndChainReq, bombBagReq, snowpeak2SKReq, cheeseReq, bedroomKeyReq],
        baseDesc: "Defeat Blizzeta to obtain the Mirror Shard.",
        randoDesc: "Defeat Blizzeta and leave the dungeon via the Midna warp to obtain the item."
    })],
    // Temple of Time
    ["Temple of Time Lobby Lantern Chest", new Flag(chest.with(templeSK), [-5497, 4635], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Temple of Time Boss Lock", new Flag(bossLock, [-4197, 4350], {
        baseReqs: [pastDomRodReq, templeBKReq, temple3SKReq, spinnerReq, bowReq, masterSwordReq],
        baseDesc: "Unlock this door to reach Armogohma.",
        randoReqs: [pastDomRodReq, bowReq, templeBKReq, [doorOfTimeReq, new AndRequirements([temple3SKReq, spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]]
    })],
    ["Temple of Time Armogohma", new Flag(armogohma, [-3724, 4352], {
        baseReqs: [pastDomRodReq, templeBKReq, temple3SKReq, spinnerReq, bowReq, masterSwordReq],
        baseDesc: 'Defeat Armogohma to clear out the Temple of Time.',
        randoReqs: [pastDomRodReq, bowReq, templeBKReq, [doorOfTimeReq, new AndRequirements([temple3SKReq, spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]],
    })],
    ["Temple of Time Armogohma Heart Container", new Flag(heartContainer, [-3880, 4480], {
        baseReqs: [armogohmaReq],
        baseDesc: 'Defeat Armogohma to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [pastDomRodReq, bowReq, templeBKReq, [doorOfTimeReq, new AndRequirements([temple3SKReq, spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]],
        randoDesc: 'Defeat Armogohma to obtain the item.'
    })],
    ["Temple of Time Dungeon Reward", new Flag(mirrorShard, [-3880, 4350], {
        baseReqs: [armogohmaReq],
        baseDesc: 'Defeat Armogohma to obtain the Mirror Shard.',
        randoReqs: [pastDomRodReq, bowReq, templeBKReq, [doorOfTimeReq, new AndRequirements([temple3SKReq, spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]],
        randoDesc: "Defeat Armogohma to obtain the dungeon reward."
    })],
    ["Temple of Time First Staircase Gohma Gate Chest", new Flag(smallChest.with(arrows, 30), [-6173, 4351], {
        baseReqs: [temple1SKReq],
        baseDesc: 'Put a pot on the pressure plate in the middle of the room to open the gate and gain access to the chest.'
    })],
    ["Temple of Time Ooccoo", new Flag(ooccoo, [-5725, 4352], {
        baseDesc: 'After opening the chest, Ooccoo will wait for you to join her at the top of the stairs.'
    })],
    ["Temple of Time Lobby Lock", new Flag(lock, [-5842, 4352], {
        baseReqs: [temple1SKReq],
        baseDesc: "Unlock this door to reach the first staircase."
    })],
    ["Temple of Time First Staircase Armos Chest", new Flag(chest.with(templeMap), [-5750, 5148], {
        baseReqs: [temple1SKReq, [woodenSwordReq, bowReq, bombBagReq, spinnerReq, clawshotReq, ballAndChainReq]],
        baseDesc: 'Defeat the Armos to make the chest appear.'
    })],
    ["Temple of Time First Staircase Window Chest", new Flag(smallChest.with(Rupees.Red), [-5818, 5015], {
        baseReqs: [temple1SKReq],
        baseDesc: 'Climb up to reach the ledge where the chest is to reach it.'
    })],
    ["Temple of Time Poe Behind Gate", new Flag(poeSoul, [-5453, 3966], {
        baseReqs: [pastDomRodReq, shadowCrystalReq],
        baseDesc: 'Break the barrier with the Hammer Statue or put an Iron Pot on the pressure plate behind the gate to get the poe.'
    })],
    ["Temple of Time Armos Antechamber East Chest", new Flag(chest.with(templeSK), [-5956, 4149], {
        baseReqs: [temple1SKReq, spinnerReq],
        baseDesc: 'Defeat the 2 Armos to make the chest appear.',
    })],
    ["Temple of Time Armos Antechamber North Chest", new Flag(smallChest.with(Rupees.Red), [-6244, 4351], {
        baseReqs: [temple1SKReq, spinnerReq],
        baseDesc: 'You will find this chest in the back of the room, on the elevated ledge.'
    })],
    ["Temple of Time Armos Antechamber Statue Chest", new Flag(chest.with(heartPiece), [-5956, 4566], {
        baseReqs: [temple1SKReq, spinnerReq, pastDomRodReq],
        baseDesc: 'Throw two Iron Pots into the railings in the back of the room, and make them fall onto the two pressure plates to make the chest appear.'
    })],
    ["Temple of Time Second Staircase Lock", new Flag(lock, [-5147, 4350], {
        baseReqs: [temple2SKReq, spinnerReq],
        baseDesc: "Unlock this door to reach the second staircase."
    })],
    ["Temple of Time Moving Wall Beamos Room Chest", new Flag(chest.with(templeCompass), [-4977, 3945], {
        baseReqs: [temple2SKReq, spinnerReq, [bowReq, clawshotReq, ballAndChainReq]],
        baseDesc: 'Hit the crystal twice to reach the chest: Once when you are at sword range, the other when you are halfway across the room.'
    })],
    ["Temple of Time Moving Wall Dinalfos Room Chest", new Flag(chest.with(heartPiece), [-5054, 3343], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq, pastDomRodReq],
        baseDesc: 'Use the Dominion Rod on the Iron Pot to make it step on the pressure plate, disabling the electricity and granting access to the chest.'
    })],
    ["Temple of Time Scales Gohma Chest", new Flag(chest.with(Rupees.Purple), [-5319, 4374], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq],
        baseDesc: 'Defeat all the Gohmas in the room (Baby Gohmas and Young Gohmas) to make the chest appear.'
    })],
    ["Temple of Time Scales Upper Chest", new Flag(smallChest.with(Rupees.Red), [-5654, 4496], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq, clawshotReq],
        baseDesc: 'Follow the right edge until you reach the chest.'
    })],
    ["Temple of Time Poe Above Scales", new Flag(poeSoul, [-5386, 4591], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq, clawshotReq, shadowCrystalReq],
    })],
    ["Temple of Time Big Key Chest", new Flag(bossChest.with(templeBK), [-5451, 4960], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq, clawshotReq],
        baseDesc: 'Use the two Iron Pots and the two Helmasaur Shells on the four elevated pressure plates to open the gate that is blocking the chest.'
    })],
    ["Temple of Time Floor Switch Puzzle Room Upper Chest", new Flag(smallChest.with(Rupees.Red), [-5452, 5081], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq, clawshotReq],
        baseDesc: 'Clawshot the target on the ceiling to reach the chest.'
    })],
    ["Temple of Time Gilloutine Chest", new Flag(chest.with(templeSK), [-6178, 4981], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq],
        baseDesc: 'Avoid the traps and go behind the sharp pendulum to reach the chest.'
    })],
    ["Temple of Time Chest Before Darknut", new Flag(chest.with(Rupees.Purple), [-5383, 4976], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq],
        baseDesc: 'Defeat all the Baby Gohmas to make the chest appear.'
    })],
    ["Temple of Time Darknut Lock", new Flag(lock, [-5511, 4545], {
        baseReqs: [temple3SKReq, spinnerReq, bowReq],
        baseDesc: 'Unlock this door to reach the Darknut miniboss.'
    })],
    ["Temple of Time Darknut Chest", new Flag(chest.with(dominionRods.getItemByIndex(0)), [-5511, 3804], {
        baseReqs: [temple3SKReq, spinnerReq, bowReq, [bombBagReq, woodenSwordReq, ballAndChainReq]],
        baseDesc: 'Defeat the Darknut to open the gate that is blocking access to the chest.'
    })],
    // City in the Sky
    ["City in The Sky Aeralfos Chest", new Flag(chest.with(clawshots.getItemByIndex(1)), [-4586, 5765], {
        baseReqs: [clawshotReq, spinnerReq, ironBootsReq, city1SKReq],
        baseDesc: 'After defeating the Aeralfos, clawshot the target above the chest to reach it.'
    })],
    ["City in The Sky East Wing Lower Level Chest", new Flag(chest.with(cityCompass), [-4641, 4857], {
        baseReqs: [doubleClawshotReq, spinnerReq, city1SKReq],
        baseDesc: 'From the east entrance, follow the falling clawshot target path to reach the chest.'
    })],
    ["City in The Sky West Wing Baba Balcony Chest", new Flag(smallChest.with(arrows, 20), [-4404, 2998], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path, and clawshot the metal mesh above the platform with the chest to reach it.'
    })],
    ["City in The Sky Underwater West Chest", new Flag(chest.with(waterBombs, 15), [-5819, 3835], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
        baseDesc: 'Sink to the chest to open it.'
    })],
    ["City in The Sky Underwater East Chest", new Flag(chest.with(Rupees.Red), [-5819, 4039], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
        baseDesc: 'Sink to the chest to open it.'
    })],
    ["City in The Sky Ooccoo", new Flag(ooccoo, [-5780, 4471], {
        baseDesc: 'Speak to Ooccoo in the shop for her to join you one last time.'
    })],
    ["City in The Sky Lock", new Flag(lock, [-4608, 4822], {
        baseReqs: [city1SKReq],
        baseDesc: "Unlock this door to reach the east wing."
    })],
    ["City in The Sky East First Wing Chest After Fans", new Flag(chest.with(cityMap), [-4638, 5442], {
        baseReqs: [city1SKReq, clawshotReq, spinnerReq],
        baseDesc: 'When you enter the room, the chest is on the right.'
    })],
    ["City in The Sky East Tile Worm Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-4773, 5276], {
        baseReqs: [city1SKReq, clawshotReq, spinnerReq],
        baseDesc: 'Follow the platforms than take a left, avoiding the Tile Worms on the way to reach the chest.'
    })],
    ["City in The Sky West Wing First Chest", new Flag(chest.with(citySK), [-4638, 2693], {
        baseReqs: [clawshotReq, spinnerReq],
        baseDesc: 'Clawshot the target on the ceiling above the chest and drop down to it.'
    })],
    ["City in The Sky West Wing Narrow Ledge Chest", new Flag(smallChest.with(Rupees.Red), [-4542, 2796], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'At the end of clawshot path, jump on the narrow platform with the chest to reach it.'
    })],
    ["City in The Sky West Wing Tile Worm Chest", new Flag(smallChest.with(bombs, 10), [-4432, 3028], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Jump across the plateforms while avoiding the Tile Worm to reach the chest.'
    })],
    ["City in The Sky Chest Behind North Fan", new Flag(chest.with(Rupees.Purple), [-3902, 3938], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq],
        baseDesc: 'Clawshot the mesh in front of the fan, then enter the hole in the mesh to find the chest.'
    })],
    ["City in The Sky North Aeralfos Rupee", new Flag(Rupees.Orange, [-3741, 4041], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq],
        baseDesc: 'Defeat the Aeralfos to obtain an Orange Rupee.'
    })],
    ["City in The Sky East Wing After Dinalfos Alcove Chest", new Flag(smallChest.with(Rupees.Red), [-4916, 5456], {
        baseReqs: [city1SKReq, clawshotReq, spinnerReq, boomerangReq],
        baseDesc: 'Open the gate by clawshotting the switch near the entrance of the room, then use an Oocca and a draft to reach the chest.'
    })],
    ["City in The Sky East Wing After Dinalfos Ledge Chest", new Flag(chest.with(Rupees.Purple), [-4902, 5081], {
        baseReqs: [city1SKReq, clawshotReq, spinnerReq, boomerangReq],
        baseDesc: 'From the entrance of the room, fly through drafts with an Oocca to reach the chest.'
    })],
    ["City in The Sky West Garden Lone Island Chest", new Flag(chest.with(Rupees.Purple), [-4916, 2736], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Clawshot the flying Peahats until you reach the platform with the big tree where the chest lies.'
    })],
    ["City in The Sky Garden Island Poe", new Flag(poeSoul, [-4920, 2875], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Clawshot the flying Peahats until you reach the platform with the big tree where the poe awaits.'
    })],
    ["City in The Sky West Garden Lower Chest", new Flag(smallChest.with(bombs, 5), [-4523, 2864], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Upon traversing the small oval opening while hanging from the flying Peahat, drop down and head west to the chest.'
    })],
    ["City in The Sky Baba Tower Alcove Chest", new Flag(chest.with(heartPiece), [-4318, 2710], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'At the end of the narrow path, hang on the ledge and move right until you reach the chest.'
    })],
    ["City in The Sky Baba Tower Narrow Ledge Chest", new Flag(smallChest.with(arrows, 20), [-4151, 2867], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the narrow path, the chest is on the left.'
    })],
    ["City in The Sky Chest Below Big Key Chest", new Flag(smallChest.with(Rupees.Red), [-4536, 3936], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Enter the room from outside, then go around the blowing fan to reach the chest.'
    })],
    ["City in The Sky West Garden Corner Chest", new Flag(smallChest.with(Rupees.Red), [-4676, 2604], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Clawshot the flying Peahats until you reach the chest.'
    })],
    ["City in The Sky West Garden Ledge Chest", new Flag(chest.with(heartPiece), [-4772, 2952], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'From the eastmost flying Peahat, clawshot your way to the room entrance with the chest.'
    })],
    ["City in The Sky Baba Tower Top Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-4198, 2611], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'After climbing the vines from the first falling clawshot target, turn around and jump on the platform with the chest.'
    })],
    ["City in The Sky Central Outside Ledge Chest", new Flag(smallChest.with(Rupees.Red), [-4703, 3949], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Follow the clawshot and rope path, then climb the vines to reach the chest.'
    })],
    ["City in The Sky Central Outside Poe Island Chest", new Flag(chest.with(Rupees.Purple), [-4601, 4286], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Follow the clawshot and rope path until you reach the platform with the poe, where the chest is also located.'
    })],
    ["City in The Sky Big Key Chest", new Flag(bossChest.with(cityBK), [-4609, 3835], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Go around the blowing fan to reach the chest.'
    })],
    ["City in The Sky Poe Above Central Fan", new Flag(poeSoul, [-4647, 4230], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Follow the clawshot and rope path until you reach the platform with the poe.'
    })],
    ["City in The Sky Boss Lock", new Flag(bossLock, [-3902, 3938], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, cityBKReq],
        baseDesc: "Unlock this door to reach Argorok."
    })],
    ["City in The Sky Argorok", new Flag(argorok, [-3923, 3841], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, cityBKReq, woodenSwordReq],
        baseDesc: 'Defeat Argorok to clear out the City in the Sky.'
    })],
    ["City in The Sky Argorok Heart Container", new Flag(heartContainer, [-3877, 3766], {
        baseReqs: [argorokReq],
        baseDesc: 'Defeat Argorok to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, cityBKReq, woodenSwordReq],
        randoDesc: 'Defeat Argorok to obtain the item.',
    })],
    ["City in The Sky Dungeon Reward", new Flag(mirrorShard, [-3789, 3712], {
        baseReqs: [argorokReq],
        baseDesc: "Defeat Argorok to obtain the Mirror Shard.",
        randoReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, cityBKReq, woodenSwordReq],
        randoDesc: "Defeat Argorok to obtain the dungeon reward."
    })],
    // Palace of Twilight
    ["Palace of Twilight Collect Both Sols", new Flag(swords.getItemByIndex(3), [-5877, 4329], {
        baseReqs: [clawshotReq, palace4SKReq, [shadowCrystalReq, woodenSwordReq]],
        baseDesc: 'Bring both Sols to their pedestal to obtain the Light Filled Master Sword.'
    })],
    ["Palace of Twilight West Wing Chest Behind Wall of Darkness", new Flag(chest.with(heartPiece), [-5400, 3585], {
        baseReqs: [clawshotReq, [lightMasterSwordReq, new AndRequirements([palace2SKReq, [shadowCrystalReq, woodenSwordReq]])]],
        baseDesc: 'Disperse the fog with a Sol or the Light Filled Master Sword, then clawshot the target behind the chest to reach it.'
    })],
    ["Palace of Twilight West Wing First Room Central Chest", new Flag(chest.with(palaceSK), [-5285, 3867], {
        baseReqs: [[woodenSwordReq, shadowCrystalReq]],
        baseDesc: 'Defeat the Zant Mask to make the chest appear.'
    })],
    ["Palace of Twilight West Wing First Lock", new Flag(lock, [-5209, 3867], {
        baseReqs: [clawshotReq, palace1SKReq],
        baseDesc: "Unlock this door to reach the second room of the west wing."
    })],
    ["Palace of Twilight West Wing Second Room Central Chest", new Flag(chest.with(palaceSK), [-4837, 3868], {
        baseReqs: [clawshotReq, palace1SKReq],
        baseDesc: 'Defeat the Zant Mask in the fog to make the chest appear.'
    })],
    ["Palace of Twilight West Wing Second Room Lower South Chest", new Flag(chest.with(palaceCompass), [-5060, 3956], {
        baseReqs: [clawshotReq, palace1SKReq],
        baseDesc: 'Defeat the Zant Mask in the fog to make the chest appear.'
    })],
    ["Palace of Twilight West Wing Second Room Southeast Chest", new Flag(chest.with(Rupees.Orange), [-5072, 4018], {
        baseReqs: [doubleClawshotReq, palace1SKReq],
        baseDesc: 'Use a Sol or the double clawshot to reach the chest.'
    })],
    ["Palace of Twilight West Wing Second Lock", new Flag(lock, [-4676, 3867], {
        baseReqs: [clawshotReq, palace2SKReq],
        baseDesc: "Unlock this door to reach the west Sol."
    })],
    ["Palace of Twilight East Wing First Room Zant Head Chest", new Flag(chest.with(palaceSK), [-5268, 4846], {
        baseReqs: [clawshotReq, [woodenSwordReq, shadowCrystalReq]],
        baseDesc: 'Defeat the Zant Mask to make the chest appear.'
    })],
    ["Palace of Twilight East Wing First Room North Small Chest", new Flag(smallChest.with(Rupees.Purple), [-5266, 4704], {
        baseReqs: [clawshotReq],
        baseDesc: 'Make your way across the moving platforms to reach the chest.'
    })],
    ["Palace of Twilight East Wing First Room West Alcove", new Flag(smallChest.with(Rupees.Purple), [-5420, 4644], {
        baseReqs: [getFlagReq("Palace of Twilight Collect Both Sols")],
        baseDesc: 'After obtaining the reward for collecting both sols, return to this room and simply ride the plaftorm below the west alcove until it brings you to the chest.'
    })],
    ["Palace of Twilight East Wing First Room East Alcove", new Flag(chest.with(heartPiece), [-5420, 4902], {
        baseReqs: [getFlagReq("Palace of Twilight Collect Both Sols")],
        baseDesc: 'After obtaining the reward for collecting both sols, return to this room and simply ride the plaftorm below the east alcove until it brings you to the chest.'
    })],
    ["Palace of Twilight East Wing First Lock", new Flag(lock, [-5209, 4773], {
        baseReqs: [clawshotReq, palace1SKReq],
        baseDesc: "Unlock this door to reach the second room of the east wing."
    })],
    ["Palace of Twilight East Wing Second Room Southwest Chest", new Flag(chest.with(palaceMap), [-4944, 4606], {
        baseReqs: [[new AndRequirements([palace1SKReq, doubleClawshotReq]), new AndRequirements([palace2SKReq, clawshotReq, [woodenSwordReq, shadowCrystalReq]])]],
        baseDesc: 'Use the Double Clawshot or the Sol to reach the chest.'
    })],
    ["Palace of Twilight East Wing Second Room Northwest Chest", new Flag(smallChest.with(Rupees.Purple), [-4822, 4606], {
        baseReqs: [clawshotReq, palace1SKReq],
        baseDesc: 'Clawshot the wall target from the platform with the northern door to reach the chest.'
    })],
    ["Palace of Twilight East Wing Second Room Northeast Chest", new Flag(smallChest.with(Rupees.Purple), [-4873, 4940], {
        baseReqs: [[new AndRequirements([palace1SKReq, doubleClawshotReq]), new AndRequirements([palace2SKReq, clawshotReq, [woodenSwordReq, shadowCrystalReq]])]],
        baseDesc: 'Use the Double Clawshot or the Sol to reach the chest.'
    })],
    ["Palace of Twilight East Wing Second Room Southeast Chest", new Flag(chest.with(palaceSK), [-4944, 4940], {
        baseReqs: [[new AndRequirements([palace1SKReq, doubleClawshotReq]), new AndRequirements([palace2SKReq, clawshotReq, [woodenSwordReq, shadowCrystalReq]])]],
        baseDesc: 'Use the Double Clawshot or the Sol to reach the chest.'
    })],
    ["Palace of Twilight East Wing Second Lock", new Flag(lock, [-4676, 4773], {
        baseReqs: [clawshotReq, palace2SKReq],
        baseDesc: "Unlock this door to reach the east Sol."
    })],
    ["Palace of Twilight Central First Room Chest", new Flag(chest.with(palaceSK), [-4994, 4469], {
        baseReqs: [lightMasterSwordReq],
        baseDesc: 'Defeat all the Zant Masks to make the chest appear.'
    })],
    ["Palace of Twilight Big Key Chest", new Flag(bossChest.with(palaceBK), [-4762, 4101], {
        baseReqs: [lightMasterSwordReq, palace1SKReq, doubleClawshotReq],
        baseDesc: 'Clear out the fog cascade, then clawshot your way up to the chest.'
    })],
    ["Palace of Twilight Central Outdoor Chest", new Flag(chest.with(palaceSK), [-4562, 4007], {
        baseReqs: [lightMasterSwordReq, palace1SKReq],
        baseDesc: 'Defeat all the Zant Masks (the first one is on the isolated south platform) to make the chest appear.'
    })],
    ["Palace of Twilight Central Tower Chest", new Flag(chest.with(palaceSK), [-4640, 4251], {
        baseReqs: [clawshotReq, lightMasterSwordReq, palace2SKReq],
        baseDesc: 'Defeat the two Zant Masks on both sides of the room to make the chest appear.'
    })],
    ["Palace of Twilight Central First Room Lock", new Flag(lock, [-4886, 4108], {
        baseReqs: [lightMasterSwordReq, palace1SKReq],
        baseDesc: "Unlock this door to reach the central outdoor area."
    })],
    ["Palace of Twilight Central Outdoor Lock", new Flag(lock, [-4627, 4116], {
        baseReqs: [lightMasterSwordReq, palace2SKReq],
        baseDesc: "Unlock this door to reach the tower climbing room."
    })],
    ["Palace of Twilight Before Zant Lock", new Flag(lock, [-4334, 4326], {
        baseReqs: [clawshotReq, lightMasterSwordReq, palace3SKReq],
        baseDesc: "Unlock this door to reach the Twilit Messenger fight before Zant."
    })],
    ["Palace of Twilight Boss Lock", new Flag(bossLock, [-3907, 4326], {
        baseReqs: [clawshotReq, lightMasterSwordReq, palace3SKReq, palaceBKReq],
        baseDesc: "Unlock this door to reach Zant."
    })],
    ["Palace of Twilight Zant", new Flag(zant, [-3721, 4325], {
        baseReqs: [clawshotReq, lightMasterSwordReq, palace3SKReq, palaceBKReq, boomerangReq, zoraArmorReq, ironBootsReq, ballAndChainReq],
        baseDesc: 'Defeat Zant to clear out the Palace of Twilight.'
    })],
    ["Palace of Twilight Zant Heart Container", new Flag(heartContainer, [-3620, 4324], {
        baseReqs: [zantReq],
        baseDesc: 'Defeat Zant to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [clawshotReq, lightMasterSwordReq, palace3SKReq, palaceBKReq, boomerangReq, zoraArmorReq, ironBootsReq, ballAndChainReq],
        randoDesc: 'Defeat Zant to obtain the item.'
    })],
    // Hyrule Castle
    ["Hyrule Castle Outside Lock", new Flag(lock, [-5304, 4320], {
        baseReqs: [castle1SKReq],
        baseDesc: "Unlock this door to reach the main hall of the castle."
    })],
    ["Hyrule Castle West Courtyard Central Small Chest", new Flag(smallChest.with(Rupees.Red), [-4887, 3598], {
        baseReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
        baseDesc: 'From the north area, climb up the balcony and drop down to the platform with the chest.'
    })],
    ["Hyrule Castle King Bulblin Key", new Flag(castleSK, [-4419, 3471], {
        baseReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
        baseDesc: 'Defeat King Bulblin for him to give you the small key.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Defeat King Bulblin for him to give you the item.'
    })],
    ["Hyrule Castle West Courtyard North Small Chest", new Flag(smallChest.with(Rupees.Red), [-4229, 3620], {
        baseReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
        baseDesc: 'Under the wooden roof, you can go around the platform if you do not wish to fight King Bulblin.'
    })],
    ["Hyrule Castle East Wing Balcony Chest", new Flag(smallChest.with(Rupees.Yellow), [-5205, 4834], {
        baseReqs: [boomerangReq, [woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
        baseDesc: 'In the room with the chest, climb the ladder to reach the balcony. Then, go to the end of the balcony to reach the chest.'
    })],
    ["Hyrule Castle East Wing Boomerang Puzzle Chest", new Flag(chest.with(castleMap), [-4283, 4456], {
        baseReqs: [boomerangReq, [woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
        baseDesc: "Boomerang the windmills in this order or it's inverse: Bottom Center, Middle Left, Middle Right, Top to open the gate and reach the chest."
    })],
    ["Hyrule Castle Graveyard Grave Switch Room Front Left Chest", new Flag(smallChest.with(Rupees.Green), [-3832, 4708], {
        baseReqs: [shadowCrystalReq, boulderReq],
        baseDesc: 'Destroy the rock on the ground before a tree and step on the pressure plate to open the gate blocking the chest.'
    })],
    ["Hyrule Castle Graveyard Grave Switch Room Back Left Chest", new Flag(smallChest.with(Rupees.Red), [-3832, 4761], {
        baseReqs: [shadowCrystalReq, boulderReq],
        baseDesc: 'Destroy the rock on the ground before a tree and step on the pressure plate to open the gate blocking the chest.'
    })],
    ["Hyrule Castle Graveyard Grave Switch Room Right Chest", new Flag(chest.with(Rupees.Orange), [-3923, 4748], {
        baseReqs: [shadowCrystalReq, boulderReq],
        baseDesc: 'Destroy the rock on the ground before a tree and step on the pressure plate to open the gate blocking the chest.'
    })],
    ["Hyrule Castle Graveyard Owl Statue Chest", new Flag(chest.with(castleSK), [-4297, 4310], {
        baseReqs: [shadowCrystalReq, boulderReq, lanternReq, domRodReq],
        baseDesc: 'In the room with the 3 chests, light the torch to stop the rain. Then, quickly make your way to the gate ' + 
                  'blocking the Howl Statues, and light the 2 torches on both sides of the gate. Bring the 2 Howl Statues to ' +
                  'their pedestal south of the area, then jump across them. Finally, pull the chain to open the gate and acces the chest.'
    })],
    ["Hyrule Castle Main Hall Northeast Chest", new Flag(chest.with(castleCompass), [-4809, 4576], {
        baseReqs: [castle1SKReq, doubleClawshotReq, [woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
        baseDesc: 'Defeat all the enemies in the room to make the chest appear, then clawshot the chandelier to reach the chest.'
    })],
    ["Hyrule Castle Main Hall Northwest Chest", new Flag(chest.with(Rupees.Silver), [-4805, 4060], {
        baseReqs: [castle1SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, bowReq],
        baseDesc: 'Activate the pressure plate on the south-west platform to make the chest appear. Then, clawshot the lowest chandelier and, from there, ' +
                  'the one above the chest to reach it.'
    })],
    ["Hyrule Castle Main Hall Southwest Chest", new Flag(chest.with(Rupees.Purple), [-5054, 4180], {
        baseReqs: [castle1SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, bowReq],
        baseDesc: 'Defeat the 2 Darknuts to unlock the door and gain access to the chest.'
    })],
    ["Hyrule Castle Lantern Staircase Chest", new Flag(chest.with(Rupees.Purple), [-4463, 4319], {
        baseReqs: [castle1SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq],
        baseDesc: 'Defeat the Darknut to make the chest appear. Then, put out the west torch with the boomerang while standing on the north-most platform to ' + 
                    'make it rise and reach the chest.'
    })],
    ["Hyrule Castle Southeast Balcony Tower Chest", new Flag(chest.with(castleSK), [-5628, 5316], {
        baseReqs: [castle1SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq]],
        baseDesc: 'Defeat the Aeralfos to gain access to the chest.'
    })],
    ["Hyrule Castle Big Key Chest", new Flag(bossChest.with(castleBK), [-5634, 3319], {
        baseReqs: [castle1SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq]],
        baseDesc: "Approach the chest to be saved and gain access to the chest."
    })],
    ['Hyrule Castle Balcony Lock', new Flag(lock, [-5296, 4322], {
        baseReqs: [castle2SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq]],
        baseDesc: 'Unlock this door to reach the main tower of the castle.'
    })],
    ['Hyrule Castle Darknut Before Boss Rupee', new Flag(Rupees.Orange, [-5169, 4319], {
        baseReqs: [castle2SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Defeat the Darknut and it will drop an Orange Rupee.'
    })],
    ["Hyrule Castle Boss Lock", new Flag(bossLock, [-5237, 4323], {
        baseReqs: [castleBKReq, castle2SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: "Unlock this door to reach Ganondorf."
    })],
    ["Hyrule Castle Treasure Room Lock", new Flag(lock, [-5153, 4525], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: "Unlock this door to reach the treasure chest room."
    })],
    ["Hyrule Castle Treasure Room First Chest", new Flag(chest.with(Rupees.Orange), [-5100, 4545], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc:'First from the left of the north row.'
    })],
    ["Hyrule Castle Treasure Room Second Chest", new Flag(chest.with(seeds, 50), [-5085, 4565], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Second from the left of the north row.'
    })],
    ["Hyrule Castle Treasure Room Third Chest", new Flag(chest.with(Rupees.Silver), [-5070, 4585], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Third from the left of the north row.'
    })],
    ["Hyrule Castle Treasure Room Fourth Chest", new Flag(chest.with(bomblings, 10), [-5055, 4605], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Fourth from the left of the north row.'
    })],
    ["Hyrule Castle Treasure Room Fifth Chest", new Flag(chest.with(Rupees.Purple), [-5040, 4625], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Fifth from the left of the north row.'
    })],
    ["Hyrule Castle Treasure Room Eighth Small Chest", new Flag(smallChest.with(Rupees.Blue), [-5190, 4674], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'First from the left of the south row.'
    })],
    ["Hyrule Castle Treasure Room Seventh Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-5173, 4695], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Second from the left of the south row.'
    })],
    ["Hyrule Castle Treasure Room Sixth Small Chest", new Flag(smallChest.with(Rupees.Red), [-5156, 4716], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Third from the left of the south row.'
    })],
    ["Hyrule Castle Treasure Room Fifth Small Chest", new Flag(smallChest.with(bombs, 20), [-5139, 4737], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'First from the bottom of the east column.'
    })],
    ["Hyrule Castle Treasure Room Fourth Small Chest", new Flag(smallChest.with(arrows, 20), [-5120, 4737], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Second from the bottom of the east column.'
    })],
    ["Hyrule Castle Treasure Room Third Small Chest", new Flag(smallChest.with(bombs, 20), [-5090, 4737], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Third from the bottom of the east column.'
    })],
    ["Hyrule Castle Treasure Room Second Small Chest", new Flag(smallChest.with(Rupees.Green), [-5065, 4737], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Fourth from the bottom of the east column.'
    })],
    ["Hyrule Castle Treasure Room First Small Chest", new Flag(smallChest.with(arrows, 30), [-5040, 4737], {
        baseReqs: [castle3SKReq, doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
        baseDesc: 'Fifth from the bottom of the east column.'
    })],
    ["Hyrule Castle Ganondorf", new Flag(ganondorf, [-4838, 4328], {
        baseReqs: [castle2SKReq, doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, castleBKReq, shadowCrystalReq, masterSwordReq, endingBlowReq],
        baseDesc: 'Defeat Ganondorf to save Hyrule!'
    })],
    // Rando Hints
    ["Agithas Castle Sign", new Flag(randoHint, [-4155, 4551])],
    ["Arbiters Grounds Sign", new Flag(randoHint, [-4491, 4314], {
        baseReqs: [groundsFirstRoomReq, arbiter1SKReq, lanternReq],
    })],
    ["Beside Castle Town Sign", new Flag(randoHint, [-3883, 4188])],
    ["Bulblin Camp Sign", new Flag(randoHint, [-4151, 531])],
    ["Castle Town Sign", new Flag(randoHint, [-3994, 4707])],
    ["Cave of Ordeals Sign", new Flag(randoHint, [-6268, 581])],
    ["City in the Sky Sign", new Flag(randoHint, [-4589, 4220], {
        baseReqs: [clawshotReq]
    })],
    ["Death Mountain Sign", new Flag(randoHint, [-3828, 8247])],
    ["Eldin Field Sign", new Flag(randoHint, [-4282, 5928])],
    ["Faron Field Sign", new Flag(randoHint, [-6202, 4889], {
        randoReqs: [leaveFaronWoodsReq]
    })],
    ["Faron Woods Sign", new Flag(randoHint, [-7478, 4945])],
    ["Forest Temple Sign", new Flag(randoHint, [-5405, 4055], {
        randoReqs: [[forest1SKReq, clawshotReq]]
    })],
    ["Gerudo Desert Sign", new Flag(randoHint, [-5481, 1185])],
    ["Goron Mines Sign", new Flag(randoHint, [-3723, 5334], {
        baseReqs: [ironBootsReq, mines3SKReq]
    })],
    ["Great Bridge of Hylia Sign", new Flag(randoHint, [-4250, 3381], {
        randoReqs: [clawshotReq]
    })],
    ["Hidden Village Sign", new Flag(randoHint, [-2052, 6668], {
        baseReqs: [woodenStatueReq]
    })],
    ["Hyrule Castle Sign", new Flag(randoHint, [-5856, 4318])],
    ["Jovani House Sign", new Flag(randoHint, [-4110, 4837])],
    ["Kakariko Gorge Sign", new Flag(randoHint, [-4979, 5876])],
    ["Kakariko Graveyard Sign", new Flag(randoHint, [-5475, 8300], {
        randoReqs: [gateKeyReq]
    })],
    ["Kakariko Village Sign", new Flag(randoHint, [-5253, 7455], {
        randoReqs: [[...boulderReq, fyrusReq]]
    })],
    ["Lake Hylia Sign", new Flag(randoHint, [-4659, 2920])],
    ["Lake Lantern Cave Sign", new Flag(randoHint, [-5335, 3018], {
        baseReqs: [boulderReq]
    })],
    ["Lakebed Temple Sign", new Flag(randoHint, [-4392, 3903], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]]
    })],
    ["Lanayru Field Sign", new Flag(randoHint, [-1891, 4860])],
    ["Lanayru Spring Sign", new Flag(randoHint, [-5238, 3468], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
    })],
    ["North Eldin Sign", new Flag(randoHint, [-1911, 7257], {
        randoReqs: [lanayruRandoReq]
    })],
    ["Ordon Sign", new Flag(randoHint, [-8842, 4938])],
    ["Palace of Twilight Sign", new Flag(randoHint, [-5914, 4479])],
    ["Sacred Grove Sign", new Flag(randoHint, [-7214, 3630], {
        randoReqs: [shadowCrystalReq, skullKidReq]
    })],
    ["Snowpeak Mountain Sign", new Flag(randoHint, [-483, 3939])],
    ["Snowpeak Ruins Sign", new Flag(randoHint, [-5035, 4186])],
    ["South of Castle Town Sign", new Flag(randoHint, [-4475, 4710])],
    ["Temple of Time Beyond Point Sign", new Flag(randoHint, [-4928, 3970], {
        baseReqs: [temple2SKReq, spinnerReq, bowReq]
    })],
    ["Temple of Time Sign", new Flag(randoHint, [-5721, 4278])],
    ["Upper Zoras River Sign", new Flag(randoHint, [-590, 5780])],
    ["Zoras Domain Sign", new Flag(randoHint, [-748, 4751], {
        randoReqs: [[shadowCrystalReq, ...boulderReq]]
    })],
    ["Arbiters Grounds Poe Scent", new Flag(scents.getItemByIndex(2), [-4656, 4329], {
        baseReqs: [shadowCrystalReq, arbiter1SKReq, lanternReq],
        baseDesc: "After defeating the poe, activate your senses to learn the Poe Scent.",
    })],
    ["Zoras Domain Reekfish Scent", new Flag(scents.getItemByIndex(3), [-705, 4947], {
        baseReqs: [coralEarringReq, shadowCrystalReq],
        baseDesc: "After catching a Reekfish, transform into Wolf and use your senses to learn the Reekfish Scent.",
    })],
    ["Doctors Office Medicine Scent", new Flag(scents.getItemByIndex(4), [-3750, 4917], {
        baseReqs: [invoiceReq, shadowCrystalReq],
        baseDesc: "After giving the invoice to the doctor, transform into Wolf and push the box to reveal the Medicine Scent.",
    })],
    ["Kakariko Gorge Youths Scent", new Flag(scents.getItemByIndex(0), [-5772, 5762], {
        baseDesc: "After entering the Eldin Twilight, use your senses near the wooden sword on the ground to learn the Youths' Scent. The wooden sword disappears after clearing the Twilight."
    })],
    ["Lanayru Field Scent of Ilia", new Flag(scents.getItemByIndex(1), [-2093, 6116], {
        baseDesc: "After entering the Lanayru Twilight, use your senses near the purse on the ground to learn the Scent of Ilia. The purse disappears after clearing the Twilight."
    })],
    ["Kakariko Village Malo Mart Bridge Repaired", new Flag(gorEbizoDonation, [-5187, 7340], {
        baseReqs: [Requirement.fromCountItem(rupees, 1000)],
        baseDesc: "Donate 1000 Rupees to Gor Ebizo to have the bridge repaired.",
        randoReqs: [Requirement.fromCountItem(rupees, 500)],
        randoDesc: "Donate 500 Rupees to Gor Ebizo to have the bridge repaired.",
    })],
    ["Kakariko Village Malo Mart Castle Town Shop", new Flag(gorEbizoDonation, [-5248, 7221], {
        baseReqs: [getFlagReq("Kakariko Village Malo Mart Bridge Repaired"), 
                    [Requirement.fromCountItem(rupees, 2000), 
                    new AndRequirements([getFlagReq("Goron Springwater Rush"), Requirement.fromCountItem(rupees, 200)])]],
        baseDesc: "Donate 2000 Rupees (or 200 rupees if the Goron Springwater Rush quest is completed) to Gor Ebizo to unlock the Castle Town shop."
    })],


]); // Always add flags at the end to preserve storage IDs

// Flag initiliazation
const flagsSU = new StorageUnit('flags', flags.values());
for (let [name, flag] of flags.entries()) {
    flag.setName(name);
    flag.initialize();
}

// Flag groups initialization
agithaRewards.initialize();

// Flag Requirements initialization
initializeFlagRequirements();
