class StorageUnit {
    constructor(name, storables) {
        this.name = name;
        let defaultConfig = '';
        let index = 0;
        for (let storable of storables) {
            let defaultValue = this.convertStoreValue(storable.getDefaultStoreValue(), storable.getMaxStoreValue());
            defaultConfig += defaultValue;
            storable.index = index++;
        }
        this.defaultConfig = defaultConfig;
        this.checkIfInitialized();
    }
    getLength() {
        return this.defaultConfig.length;
    }
    resetFlags() {
        localStorage.setItem(this.name, this.defaultConfig);
    }
    getAllFlags() {
        return localStorage.getItem(this.name);
    }
    getFlagAsBool(storable) {
        return this.getAllFlags()[storable.index] === '1';
    }
    getFlagAsNumber(storable) {
        let value = this.getAllFlags()[storable.index];
        if (storable.getMaxStoreValue() >= 10) 
            return value.charCodeAt(0);
        else 
            return parseInt(value);

    }
    convertStoreValue(value, maxValue) {
        if (maxValue >= 10) 
            return String.fromCharCode(value);
        else 
            return value.toString();
    }
    setFlag(storable) {
        let flags = this.getAllFlags();
        flags = flags.substring(0, storable.index) + 
            this.convertStoreValue(storable.getCurrentStoreValue(), storable.getMaxStoreValue()) +
            flags.substring(storable.index + 1);
        localStorage.setItem(this.name, flags);
    }
    checkIfInitialized() {
        let oldDefault = this.getAllFlags();
        let currentDefault = this.defaultConfig;
        if (oldDefault == null || oldDefault.length > currentDefault.length)
            this.resetFlags();
        else if (oldDefault.length < currentDefault.length) {
            for (let i = oldDefault.length; i < currentDefault.length; i++)
                oldDefault += currentDefault[i];
            localStorage.setItem(this.name, oldDefault);
        }
    }
}

class Storable {
    constructor() {}
    getDefaultStoreValue() { return 0; }
    getCurrentStoreValue() {}
    getMaxStoreValue() { return 1; }
}