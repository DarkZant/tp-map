let settingsImage = getIconImage('Settings');

class RandoSetting {
    constructor(name, image=settingsImage) {
        this.image = getIconImage(image);
        this.name = name;
    }
    getImage() {
        return this.image;
    }
    getName() {
        return this.name;
    }
}

class CheckboxRandoSetting extends RandoSetting {
    constructor(name, image=settingsImage) {
        super(name, image);
        this.active = false;
    }
    isEnabled() {
        return this.active;
    }  
    set(value) {
        this.active = value;
    }
}

class SelectRandoSetting extends RandoSetting {
    constructor(name, values, image=settingsImage) {
        super(name, image);
        this.values = values;
    }
    valueIsEqualTo(otherValue) {
        return this.value === otherValue;
    }
    getValue() {
        return this.values;
    }  
    set(value) {
        this.value = value;
    }
}



const RandoSettings = Object.freeze({
    SkipPrologue: new CheckboxRandoSetting('Skip Prologue'),
    FaronWoodsLogic: new SelectRandoSetting('Faron Woods Logic'),
    UnlockMapRegions : new CheckboxRandoSetting('Unlock Map Regions'),
    OpenDoT : new CheckboxRandoSetting('Open Door of Time'),
    WalletCapacity : new CheckboxRandoSetting('Increase Wallet Capacity'),
    LakebedBombs : new CheckboxRandoSetting('Lakebed Does Not Require Water Bombs'),
    ArbitersCamp : new CheckboxRandoSetting('Arbiters Does Not Require Bulblin Camp'),
    SnowpeakReekfish : new CheckboxRandoSetting('Snowpeak Does Not Require Reekfish Scent'),
    TempleTime : new SelectRandoSetting('Temple of Time Entrance'),
    CitySkybook : new CheckboxRandoSetting('City Does Not Require Filled Skybook'),
    TransformAnywhere : new CheckboxRandoSetting('Transform Anywhere')
});