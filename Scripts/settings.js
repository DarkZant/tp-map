// const visibleCategories = [];
let selectedGamemode = Gamemodes.Base;


class Setting extends Storable {
    constructor(name, defaultValue=0) {
        this.name = name;
        this.element = document.getElementById(this.name);
        this.defaultValue = defaultValue;
        this.activationFunction = activationFunction;
        this.active = false;
        this.element.onclick(() => {
            this.active = this.element.checked;
        })
    }
    getDefaultStoreValue() {
        return this.defaultValue;
    }
    getCurrentStoreValue() {
        return this.active ? 1 : 0;
    }
    initialize() {
        this.active = this.storageUnit.getFlagAsBool(this);
        if (this.active)
            this.element.click();
    }
}

class CategoryVisibilitySetting extends Setting {
    constructor(name, category, defaultValue=0) {
        super(name, defaultValue);
        this.category = category;
    }
}

class ParentSetting {
    constructor(name, children) {
        this.name = name;
        this.element = document.getElementById(this.name);
        this.children = children;
        for (let child of children)
            child.parent = this;
        this.element.onclick(() => {
            if (this.element.checked) {
                for (let child of children) 
                    child.element.click();
            }
            else {
                for (let child of children) {
                    if (child.active)
                        child.element.click();
                }
            }
        })
    }
    update(childIsChecked) {
        if (childIsChecked) {
            if (!this.element.checked)
                this.element.checked = true;
        }
        else {
            for (let child of this.children) {
                if (child.active)
                    return;
            }
            this.element.checked = false;
        }   
    }
    getChildByName(name) {
        for (let child of children) {
            if (child.name === name)
                return child;
        }
        return null;
    }
}

let baseVisibilityParent = new ParentSetting('Base Visibility Parent', [
    new CategoryVisibilitySetting('Base Main Visibility', Categories.Main),
    new CategoryVisibilitySetting('Base Souls Visibility', Categories.Souls),
    new CategoryVisibilitySetting('Base Characters Visibility', Categories.SkyCharacters),
    new CategoryVisibilitySetting('Base Bugs Visibility', Categories.Bugs),
    new CategoryVisibilitySetting('Base Skills Visibility', Categories.HiddenSkills),
    new CategoryVisibilitySetting('Base Rupees Visibility', Categories.Rupees),
    new CategoryVisibilitySetting('Base Hearts Visibility', Categories.Hearts),
    new CategoryVisibilitySetting('Base Ammunition Visibility', Categories.Ammo),
    new CategoryVisibilitySetting('Base Locks Visibility', Categories.Locks),
    new CategoryVisibilitySetting('Base Ooccoo Visibility', Categories.Ooccoo),
    new CategoryVisibilitySetting('Base Bosses Visibility', Categories.Ooccoo)
]);

let randoCheckVisibilityParent = new ParentSetting('Rando Check Visibility Parent', [
    new CategoryVisibilitySetting('Rando Main Visibility', Categories.Main),
    new CategoryVisibilitySetting('Rando Souls Visibility', Categories.Souls),
    new CategoryVisibilitySetting('Rando Characters Visibility', Categories.SkyCharacters),
    new CategoryVisibilitySetting('Rando Bugs Visibility', Categories.Bugs),
    new CategoryVisibilitySetting('Rando Skills Visibility', Categories.HiddenSkills),
    new CategoryVisibilitySetting('Rando Gifts Visibility', Categories.Gifts),
    new CategoryVisibilitySetting('Rando Shop Visibility', Categories.ShopItems)
]);

let randoNonCheckVisibilityParent = new ParentSetting('Rando Non Check Visibility Parent', [
    new CategoryVisibilitySetting('Rando Hint Visibility', Categories.Hints),
    new CategoryVisibilitySetting('Rando Bosses Visibility', Categories.Bosses),
    new CategoryVisibilitySetting('Rando Rupees Category', Categories.Rupees),
    new CategoryVisibilitySetting('Rando Locks Visibility', Categories.Locks),
    new CategoryVisibilitySetting('Rando Ooccoo Visibility', Categories.Ooccoo),
    new CategoryVisibilitySetting('Rando Non-Check Visibility', Categories.NonChecks)
]);

let nonFlagVisibilityParent = new ParentSetting('Non Flag Visibility Parent', [
    new CategoryVisibilitySetting('Shop Visibility', Categories.Shops),
    new CategoryVisibilitySetting('Bottle Visibility', Categories.Bottle),
    new CategoryVisibilitySetting('Grass Visibility', Categories.Grass),
    new CategoryVisibilitySetting('Postman Visibility', Categories.Postman),
    new CategoryVisibilitySetting('Fishing Visibility', Categories.Fishing),
    new CategoryVisibilitySetting('Minigames Visibility', Categories.Minigames)
]); 

function addChildrenToMap(parent, map) {
    for (let categoryChild of parent.children)
        map.set(categoryChild.category, categoryChild);
}

const baseVisibilitySettings = new Map();
addChildrenToMap(baseVisibilityParent, baseVisibilitySettings);
addChildrenToMap(nonFlagVisibilityParent, baseVisibilitySettings);
const randoVisibilitySettings = new Map();
addChildrenToMap(randoCheckVisibilityParent, randoVisibilitySettings);
addChildrenToMap(randoNonCheckVisibilityParent, randoVisibilitySettings);
addChildrenToMap(nonFlagVisibilityParent, randoVisibilitySettings);


function verifyCategoryVisibility(category) {
    if (selectedGamemode === Gamemodes.Base)
        return baseVisibilitySettings.get(category).active;
    else 
        return randoVisibilitySettings.get(category).active;
}

const Settings = Object.freeze({
    TrackerLogic: new Setting('Tracker Logic'),
    HideNoReqs: new Setting('Hide Flag Without Requirement'),
    AutocompleteTracker: new Setting('Tracker Autocompletion'),
    EmptySubmaps: new Setting('Empty Submaps Visibility'),
    SubmapAsMarker: new Setting('Submap As One Marker'),
    ChestsContent: new Setting('Show Chests As Content'),
    TrackerOverlay: new Setting('Tracker Position'),
    CountFlags: new Setting('Count Flags'),
    CountChecks: new Setting('Count Checks'),
    CountNonChecks: new Setting('Count Non Checks'),
    CountNonFlags: new Setting('Count Non Flags')
});