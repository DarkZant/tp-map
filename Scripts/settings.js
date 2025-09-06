let selectedGamemode;
const Gamemodes = Object.freeze({
    Base: 0,
    Glitchless: 1,
    Glitched: 2
});

function randoIsActive() {
    return selectedGamemode !== Gamemodes.Base;
}

let selectedGameVersion;
const GameVersions = Object.freeze({
    Gamecube: 0,
    Wii: 1,
    WiiU: 2
});

function dispatchSettingsUpdate() {
    document.dispatchEvent(new CustomEvent('settingsUpdated'));
}

class SelectSetting extends Storable {
    constructor(name, func, startFunc=func, defaultValue=0) {
        super();
        this.name = name;
        this.element = document.getElementById(this.name);
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.func = func;
        this.startFunc = startFunc;
        this.element.addEventListener('change', () => this.handleChange());
    }
    updateValue() {
        this.value = this.element.value;
        this.storageUnit.setFlag(this);
    }
    setValue(value) {
        this.element.value = value;
        this.handleChange();
    }
    reset() {
        this.element.value = this.defaultValue;
        this.handleChange();
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
        this.startFunc();
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
    resetElement() {
        let defaultVal = this.defaultValue === 0 ? false : true;
        if (defaultVal === this.active)
            return false;
        this.element.checked = defaultVal;
        return true;
    }
    reset() {
        if (!this.resetElement())
            return;
        this.updateActive();
        if (this.parent)
            this.parent.update(this.active);
        dispatchSettingsUpdate();
    }
    activate() {
        this.active = true;
        this.storageUnit.setFlag(this);
    }
    deactivate() {
        this.active = false;
        this.storageUnit.setFlag(this);
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
    changeElementDisplay(display) {
        this.element.parentElement.style.display = display;
    }
}

class FunctionSetting extends Setting {
    constructor(name, defaultValue=0) {
        super(name, defaultValue);
    }
    reset() {
        if (this.resetElement())
            this.handleClick();
    }
    handleClick() {
        this.updateActive();
        this.func();
    }
    setFunction(func) {
        this.func = func;
        if (this.active)
            document.addEventListener('DOMContentLoaded', func);
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

function gamemodeFunction() { 
    selectedGamemode = parseInt(this.element.value);
    if (selectedGamemode === Gamemodes.Base) {
        document.getElementById('baseFlagsVisibility').style.display = "block";
        document.getElementById('baseFlagCounters').style.display = "block";
        document.getElementById('randoVisibility').style.display = "none";
        document.getElementById('randoFlagCounters').style.display = "none";
        document.getElementById('randoSeed').style.display = "none";
    }
    else {
        document.getElementById('baseFlagsVisibility').style.display = "none";
        document.getElementById('baseFlagCounters').style.display = "none";
        document.getElementById('randoVisibility').style.display = "block";
        document.getElementById('randoFlagCounters').style.display = "block";
        document.getElementById('randoSeed').style.display = "flex";
    }
} 

function gameVersionFunction() {
    let newGameVersion = parseInt(this.element.value);
    if (newGameVersion === GameVersions.Wii) {
        flipCurrentImage();
        dispatchSettingsUpdate();
    }
    else if (selectedGameVersion === GameVersions.Wii) {
        unflipCurrentImage();
        dispatchSettingsUpdate();
    }
    selectedGameVersion = newGameVersion;
}

function gameVersionStartFunction() {
    selectedGameVersion = parseInt(this.element.value);
}

const Settings = Object.freeze({
    Gamemode: new SelectSetting('Gamemodes',  gamemodeFunction), // Keep in 1st for rando link to work
    GameVersion: new SelectSetting('gameVersion', gameVersionFunction, gameVersionStartFunction),
    TrackerLogic: new FunctionSetting('Tracker_Logic', 1),
    HideNoReqs: new FunctionSetting('Hide_Flag_Without_Requirement'),
    AutocompleteTracker: new Setting('Tracker_Autocompletion', 1),
    DisableTrackerAnims: new Setting('Disable_Tracker_Animations'),
    EmptySubmaps: new Setting('Empty_Submaps_Visibility', 1),
    SubmapAsMarker: new Setting('Submap_As_One_Marker'),
    ChestsContent: new Setting('Show_Chests_As_Content'),
    TrackerOverlay: new FunctionSetting('Tracker_Position', 1),
    CountersVisibility: new Setting('Show_Counters', 1),
    ShowTotalCounter: new FunctionSetting('Show_Total_Counter', 1),
    CountFlags: new Setting('Count_Flags', 1),
    CountChecks: new Setting('Count_Checks', 1),
    CountNonChecks: new Setting('Count_Non_Checks'),
    CountNonFlags: new Setting('Count_Non_Flags'),
    ShowTooltips: new FunctionSetting('Show_Tooltips', 1),
    FlagTooltipItemName: new FunctionSetting('Flag_Tooltip_Item_Name'),
    RandoTracker: new Setting("Rando_Item_Tracker"),
    RevealHints: new Setting("Reveal_Hints"),
    RevealSetJunkFlags: new Setting('Reveal_Set_Junk_Flags'),
    RevealSpoilerLog: new Setting("Reveal_Spoiler_Log"),
    // Base Game Flags Visibility
    Base_Main_Visibility: new CategoryVisibilitySetting('Base_Main_Visibility', Categories.Main, 1),
    Base_Hearts_Visibility: new CategoryVisibilitySetting('Base_Hearts_Visibility', Categories.Hearts, 1),
    Base_Souls_Visibility: new CategoryVisibilitySetting('Base_Souls_Visibility', Categories.PoeSouls, 1),
    Base_Bugs_Visibility: new CategoryVisibilitySetting('Base_Bugs_Visibility', Categories.Bugs, 1),
    Base_Skills_Visibility: new CategoryVisibilitySetting('Base_Skills_Visibility', Categories.HiddenSkills, 1),
    Base_Characters_Visibility: new CategoryVisibilitySetting('Base_Characters_Visibility', Categories.SkyCharacters,1 ),
    Base_Rupees_Visibility: new CategoryVisibilitySetting('Base_Rupees_Visibility', Categories.Rupees),
    Base_Ammunition_Visibility: new CategoryVisibilitySetting('Base_Ammunition_Visibility', Categories.Ammo),
    Base_Bosses_Visibility: new CategoryVisibilitySetting('Base_Bosses_Visibility', Categories.Bosses, 1),
    Base_Ooccoo_Visibility: new CategoryVisibilitySetting('Base_Ooccoo_Visibility', Categories.Ooccoo),
    Base_Locks_Visibility: new CategoryVisibilitySetting('Base_Locks_Visibility', Categories.Locks),
    // Rando Checks Visibility
    Rando_Main_Visibility: new CategoryVisibilitySetting('Rando_Main_Visibility', Categories.Main, 1),
    Rando_Souls_Visibility: new CategoryVisibilitySetting('Rando_Souls_Visibility', Categories.PoeSouls),
    Rando_Characters_Visibility: new CategoryVisibilitySetting('Rando_Characters_Visibility', Categories.SkyCharacters),
    Rando_Bugs_Visibility: new CategoryVisibilitySetting('Rando_Bugs_Visibility', Categories.Bugs),
    Rando_Skills_Visibility: new CategoryVisibilitySetting('Rando_Skills_Visibility', Categories.HiddenSkills),
    Rando_Gifts_Visibility: new CategoryVisibilitySetting('Rando_Gifts_Visibility', Categories.Gifts),
    Rando_Shop_Visibility: new CategoryVisibilitySetting('Rando_Shop_Visibility', Categories.ShopItems),
    // Rando Non-Checks Visibility
    Rando_Hints_Visibility: new CategoryVisibilitySetting('Rando_Hints_Visibility', Categories.Hints, 1),
    Rando_Bosses_Visibility: new CategoryVisibilitySetting('Rando_Bosses_Visibility', Categories.Bosses, 1),
    Rando_Rupees_Visibility: new CategoryVisibilitySetting('Rando_Rupees_Visibility', Categories.Rupees),
    Rando_Locks_Visibility: new CategoryVisibilitySetting('Rando_Locks_Visibility', Categories.Locks),
    Rando_Ooccoo_Visibility: new CategoryVisibilitySetting('Rando_Ooccoo_Visibility', Categories.Ooccoo),
    Rando_Non_Check_Visibility: new CategoryVisibilitySetting('Rando_Non-Check_Visibility', Categories.NonChecks),
    // Non-Flags Visibility
    Shop_Visibility: new CategoryVisibilitySetting('Shop_Visibility', Categories.Shops),
    Bottle_Visibility: new CategoryVisibilitySetting('Bottle_Visibility', Categories.Bottle),
    Monster_Rupee: new CategoryVisibilitySetting('Monster_Rupee', Categories.MonsterRupee),
    Grass_Visibility: new CategoryVisibilitySetting('Grass_Visibility', Categories.Grass),
    Postman_Visibility: new CategoryVisibilitySetting('Postman_Visibility', Categories.Postman),
    Fishing_Visibility: new CategoryVisibilitySetting('Fishing_Visibility', Categories.Fishing),
    Minigames_Visibility: new CategoryVisibilitySetting('Minigames_Visibility', Categories.Minigames),
    // New Settings
    Base_Quest_Visibility: new CategoryVisibilitySetting('Base_Quest_Visibility', Categories.Quest, 1),
    Rando_Quest_Visibility: new CategoryVisibilitySetting('Rando_Quest_Visibility', Categories.Quest, 1)
}); // Always add settings at the end to preserve storage IDs

const settingsSU = new StorageUnit('settings', Object.values(Settings));

function resetSettings() {
    for (let setting of Object.values(Settings))
        setting.reset();
}


let baseVisibilityParent = new ParentSetting('Base_Visibility_Parent', [ 
    Settings.Base_Main_Visibility,
    Settings.Base_Hearts_Visibility,
    Settings.Base_Souls_Visibility,
    Settings.Base_Bugs_Visibility,
    Settings.Base_Skills_Visibility,
    Settings.Base_Characters_Visibility,
    Settings.Base_Rupees_Visibility,
    Settings.Base_Ammunition_Visibility,
    Settings.Base_Quest_Visibility,
    Settings.Base_Bosses_Visibility,
    Settings.Base_Ooccoo_Visibility,
    Settings.Base_Locks_Visibility,
]);

let randoCheckVisibilityParent = new ParentSetting('Rando_Check_Visibility_Parent', [ 
    Settings.Rando_Main_Visibility,
    Settings.Rando_Souls_Visibility,
    Settings.Rando_Characters_Visibility,
    Settings.Rando_Bugs_Visibility,
    Settings.Rando_Skills_Visibility,
    Settings.Rando_Gifts_Visibility,
    Settings.Rando_Shop_Visibility
]);

let randoNonCheckVisibilityParent = new ParentSetting('Rando_Non_Check_Visibility_Parent', [ 
    Settings.Rando_Hints_Visibility,
    Settings.Rando_Bosses_Visibility,
    Settings.Rando_Quest_Visibility,
    Settings.Rando_Rupees_Visibility,
    Settings.Rando_Locks_Visibility,
    Settings.Rando_Ooccoo_Visibility,
    // Settings.Rando_Non_Check_Visibility
]);

let nonFlagVisibilityParent = new ParentSetting('Non_Flag_Visibility_Parent', [ 
    // Settings.Shop_Visibility,
    Settings.Bottle_Visibility,
    // Settings.Monster_Rupee,
    Settings.Grass_Visibility,
    Settings.Postman_Visibility,
    // Settings.Fishing_Visibility,
    // Settings.Minigames_Visibility
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
    
    if (randoIsActive()) 
        setting = randoVisibilitySettings.get(category);
    else 
        setting = baseVisibilitySettings.get(category);

    return setting === undefined ? false : setting.isEnabled();  
}

for (let setting of Object.values(Settings))
    setting.initialize();

if (Settings.Rando_Non_Check_Visibility.isEnabled())
    Settings.Rando_Non_Check_Visibility.reset();
Settings.Rando_Non_Check_Visibility.changeElementDisplay("none");

Settings.Shop_Visibility.changeElementDisplay('none');
Settings.Monster_Rupee.changeElementDisplay('none');
Settings.Minigames_Visibility.changeElementDisplay('none');
Settings.Fishing_Visibility.changeElementDisplay('none');
