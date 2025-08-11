let selectedGamemode = Gamemodes.Base;

function dispatchSettingsUpdate() {
    document.dispatchEvent(new CustomEvent('settingsUpdated'));
}

class SelectSetting extends Storable {
    constructor(name, func, defaultValue=0) {
        super();
        this.name = name;
        this.element = document.getElementById(this.name);
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.func = func;
        this.element.addEventListener('change', () => this.handleChange());
    }
    updateValue() {
        this.value = this.element.value;
        this.storageUnit.setFlag(this);
    }
    handleChange() {
        this.updateValue();
        this.func();   
        dispatchSettingsUpdate();
    }
    getDefaultStoreValue() {
        return this.defaultValue;
    }
    getCurrentStoreValue() {
        return this.value;
    }
    initialize() {
        this.value = this.storageUnit.getFlagAsNumber(this);
        this.element.value = this.value;
    }
}


class Setting extends Storable {
    constructor(name, defaultValue=0) {
        super();
        this.name = name;
        this.element = document.getElementById(this.name);
        this.defaultValue = defaultValue;
        this.active = false;
        this.element.addEventListener('click', () => this.handleClick());
    }
    updateActive() {
        this.active = this.element.checked;
        this.storageUnit.setFlag(this);
    }
    handleClick(fromParent=false) {
        if (fromParent)
            this.element.checked = !this.element.checked;
        this.updateActive();
        if (!fromParent && this.parent)
            this.parent.update(this.active);
        if (!fromParent)
            dispatchSettingsUpdate();
    }
    isEnabled() {
        return this.active;
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

class FunctionSetting extends Setting {
    constructor(name, defaultValue=0) {
        super(name, defaultValue);
    }
    handleClick() {
        this.updateActive();
        this.func();
    }
    setFunction(func) {
        this.func = func;
        if (this.active)
            func();
    }
    initialize() {
        this.active = this.storageUnit.getFlagAsBool(this);
        this.element.checked = this.active;
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
        this.element = document.getElementById(spaceToUnderscore(this.name));
        this.children = children;
        for (let child of children)
            child.parent = this;
        this.element.addEventListener('click', () => {
            if (this.element.checked) {
                for (let child of children) 
                    child.handleClick(true);
            }
            else {
                for (let child of children) {
                    if (child.active)
                        child.handleClick(true);
                }
            }
            dispatchSettingsUpdate();
        });
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
    getChildByIndex(index) {
        return this.children[index];
    }
}

let gamemodeSetting = new SelectSetting('Gamemodes',  function() { 
    selectedGamemode = this.value;
    if (selectedGamemode === Gamemodes.Base) {
        document.getElementById('baseFlagsVisibility').style.display = "block";
        document.getElementById('baseFlagCounters').style.display = "block";
        document.getElementById('randoVisibility').style.display = "none";
        document.getElementById('randoFlagCounters').style.display = "none";
    }
    else {
        document.getElementById('baseFlagsVisibility').style.display = "none";
        document.getElementById('baseFlagCounters').style.display = "none";
        document.getElementById('randoVisibility').style.display = "block";
        document.getElementById('randoFlagCounters').style.display = "block";
    }
});

let gameVersionSetting = new SelectSetting('gameVersion', function() {

})

let baseVisibilityParent = new ParentSetting('Base_Visibility_Parent', [ // 11
    new CategoryVisibilitySetting('Base_Main_Visibility', Categories.Main, 1),
    new CategoryVisibilitySetting('Base_Souls_Visibility', Categories.PoeSouls, 1),
    new CategoryVisibilitySetting('Base_Characters_Visibility', Categories.SkyCharacters,1 ),
    new CategoryVisibilitySetting('Base_Bugs_Visibility', Categories.Bugs, 1),
    new CategoryVisibilitySetting('Base_Skills_Visibility', Categories.HiddenSkills, 1),
    new CategoryVisibilitySetting('Base_Rupees_Visibility', Categories.Rupees),
    new CategoryVisibilitySetting('Base_Hearts_Visibility', Categories.Hearts, 1),
    new CategoryVisibilitySetting('Base_Ammunition_Visibility', Categories.Ammo),
    new CategoryVisibilitySetting('Base_Locks_Visibility', Categories.Locks),
    new CategoryVisibilitySetting('Base_Ooccoo_Visibility', Categories.Ooccoo),
    new CategoryVisibilitySetting('Base_Bosses_Visibility', Categories.Bosses)
]);

let randoCheckVisibilityParent = new ParentSetting('Rando_Check_Visibility_Parent', [ // 7
    new CategoryVisibilitySetting('Rando_Main_Visibility', Categories.Main, 1),
    new CategoryVisibilitySetting('Rando_Souls_Visibility', Categories.PoeSouls),
    new CategoryVisibilitySetting('Rando_Characters_Visibility', Categories.SkyCharacters),
    new CategoryVisibilitySetting('Rando_Bugs_Visibility', Categories.Bugs),
    new CategoryVisibilitySetting('Rando_Skills_Visibility', Categories.HiddenSkills),
    new CategoryVisibilitySetting('Rando_Gifts_Visibility', Categories.Gifts),
    new CategoryVisibilitySetting('Rando_Shop_Visibility', Categories.ShopItems)
]);

let randoNonCheckVisibilityParent = new ParentSetting('Rando_Non_Check_Visibility_Parent', [ // 6
    new CategoryVisibilitySetting('Rando_Hints_Visibility', Categories.Hints, 1),
    new CategoryVisibilitySetting('Rando_Bosses_Visibility', Categories.Bosses),
    new CategoryVisibilitySetting('Rando_Rupees_Visibility', Categories.Rupees),
    new CategoryVisibilitySetting('Rando_Locks_Visibility', Categories.Locks),
    new CategoryVisibilitySetting('Rando_Ooccoo_Visibility', Categories.Ooccoo),
    new CategoryVisibilitySetting('Rando_Non-Check_Visibility', Categories.NonChecks)
]);

let nonFlagVisibilityParent = new ParentSetting('Non_Flag_Visibility_Parent', [ // 6
    new CategoryVisibilitySetting('Shop_Visibility', Categories.Shops),
    new CategoryVisibilitySetting('Bottle_Visibility', Categories.Bottle),
    new CategoryVisibilitySetting('Grass_Visibility', Categories.Grass),
    new CategoryVisibilitySetting('Postman_Visibility', Categories.Postman),
    new CategoryVisibilitySetting('Fishing_Visibility', Categories.Fishing),
    new CategoryVisibilitySetting('Minigames_Visibility', Categories.Minigames)
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
    let setting;
    
    if (selectedGamemode === Gamemodes.Base) 
        setting = baseVisibilitySettings.get(category);
    else 
        setting = randoVisibilitySettings.get(category);

    return setting === undefined ? false : setting.isEnabled();

    
}

const Settings = Object.freeze({ // 12
    TrackerLogic: new Setting('Tracker_Logic', 1),
    HideNoReqs: new Setting('Hide_Flag_Without_Requirement'),
    AutocompleteTracker: new Setting('Tracker_Autocompletion'),
    EmptySubmaps: new Setting('Empty_Submaps_Visibility', 1),
    SubmapAsMarker: new Setting('Submap_As_One_Marker'),
    ChestsContent: new Setting('Show_Chests_As_Content'),
    TrackerOverlay: new FunctionSetting('Tracker_Position'),
    CountersVisibility: new Setting('Show_Counters', 1),
    CountFlags: new Setting('Count_Flags', 1),
    CountChecks: new Setting('Count_Checks', 1),
    CountNonChecks: new Setting('Count_Non_Checks'),
    CountNonFlags: new Setting('Count_Non_Flags')
});

let settingsArray = Object.values(Settings);
let storableArray =  [
    gamemodeSetting,
    gameVersionSetting,
    baseVisibilityParent.getChildByIndex(0),
    baseVisibilityParent.getChildByIndex(1),
    baseVisibilityParent.getChildByIndex(2),
    baseVisibilityParent.getChildByIndex(3),
    baseVisibilityParent.getChildByIndex(4),
    baseVisibilityParent.getChildByIndex(5),
    baseVisibilityParent.getChildByIndex(6),
    baseVisibilityParent.getChildByIndex(7),
    baseVisibilityParent.getChildByIndex(8),
    baseVisibilityParent.getChildByIndex(9),
    baseVisibilityParent.getChildByIndex(10),
    randoCheckVisibilityParent.getChildByIndex(0),
    randoCheckVisibilityParent.getChildByIndex(1),
    randoCheckVisibilityParent.getChildByIndex(2),
    randoCheckVisibilityParent.getChildByIndex(3),
    randoCheckVisibilityParent.getChildByIndex(4),
    randoCheckVisibilityParent.getChildByIndex(5),
    randoCheckVisibilityParent.getChildByIndex(6),
    randoNonCheckVisibilityParent.getChildByIndex(0),
    randoNonCheckVisibilityParent.getChildByIndex(1),
    randoNonCheckVisibilityParent.getChildByIndex(2),
    randoNonCheckVisibilityParent.getChildByIndex(3),
    randoNonCheckVisibilityParent.getChildByIndex(4),
    randoNonCheckVisibilityParent.getChildByIndex(5),
    nonFlagVisibilityParent.getChildByIndex(0),
    nonFlagVisibilityParent.getChildByIndex(1),
    nonFlagVisibilityParent.getChildByIndex(2),
    nonFlagVisibilityParent.getChildByIndex(3),
    nonFlagVisibilityParent.getChildByIndex(4),
    nonFlagVisibilityParent.getChildByIndex(5),
    settingsArray[0],
    settingsArray[1],
    settingsArray[2],
    settingsArray[3],
    settingsArray[4],
    settingsArray[5],
    settingsArray[6],
    settingsArray[7],
    settingsArray[8],
    settingsArray[9],
    settingsArray[10],
    settingsArray[11],
]; // Always add settings at the end to preserve storage IDs

const settingsSU = new StorageUnit('settings', storableArray);

for (let setting of storableArray)
    setting.initialize();