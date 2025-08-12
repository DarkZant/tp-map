class ImageWrapper {
    constructor(src, [width, height]) {
        this.src = src;
        this.width = width
        this.height = height;
    }
    getRatio() {
        return this.width / this.height;
    }
}

const images = new Map();
for (let [src, size] of imageSizes) 
    images.set(src, new ImageWrapper(src, size));

function spaceToUnderscore(str) {
    return str.replaceAll(" ", "_");
}

function underscoreToSpace(str) {
    return str.replaceAll("_", " ");
}

function getIconImage(imageName) {
    if (imageName instanceof ImageWrapper)
        return imageName;
    return images.get('Icons/' + spaceToUnderscore(imageName) + '.png');
}

const Gamemodes = Object.freeze({
    Base: 0,
    Glitchless: 1,
    Glitched: 2
});

const GameVersions = Object.freeze({
    Gamecube: 0,
    Wii: 1,
    WiiU: 2
});

// Item & Obtainables Categories Enum
const Categories = Object.freeze({
    // Game Categories
    Main: "Main",
    PoeSouls: "Poe Souls",
    SkyCharacters: "Sky Characters",
    Bugs: "Golden Bugs",
    HiddenSkills: "Hidden Skills",
    Rupees: "Rupees",
    Hearts: "Heart Pieces & Containers",
    Ammo: "Ammunition",
    Locks: "Locked Doors",
    Ooccoo: "Ooccoo",
    Bosses: "Bosses",
    Bottle: "Bottled Items",
    Shops: "Shops",
    Grass: "Horse & Hawk Grass",
    Fishing: "Fishing Spots",
    Minigames: "Minigames",
    Postman: 'Postman',
    // Randomizer Categories
    Gifts: "Gifts from NPCs",
    ShopItems: "Shop Items",
    Hints: "Randomizer Hints",  
    NonChecks: "Non-Check Items"
});

const RandomizerCheckCategories = [
    Categories.Main,
    Categories.PoeSouls,
    Categories.SkyCharacters,
    Categories.Bugs,
    Categories.Gifts,
    Categories.ShopItems
];

class Obtainable {
    constructor(imageInfo, item, {name=imageInfo, category=item.getCategory()}={}) {
        this.image = getIconImage(imageInfo);
        this.item = item;
        this.name = name;
        this.category = category;
    }
    hasItem() {
        return this.item !== null;
    }
    getCategory() {
        return this.category;
    }
    getImage() {
        return this.image;
    }
}

class Container {
    constructor(imageInfo, content=null) {
        this.image = getIconImage(imageInfo);
        this.content = content;
    }
    with(content, amount=1) {
        let item = amount === 1 ? content : new MultiItem(content, amount);
        return new Container(this.image, item);
    }
    getCategory() {
        return this.content.getCategory();
    }
    getContent() {
        return this.content instanceof MultiItem ? this.content.item : this.content;
    }
    getContentName() {
        return this.content.name;
    }
    getContentImage() {
        return this.content.getImage();
    }
    getImage() {
        return this.image;
    }
}

class BoolItem {
    constructor(imageName, {name=imageName, category=Categories.Main}={}) {
        this.image = getIconImage(imageName);
        this.name = name;
        this.category = category;
        this.obtained = false;
        this.parentItem = null;
    }
    increase() {
        this.obtained = !this.obtained;
    }
    decrease() {
        this.increase();
    }
    reset() {
        this.obtained = false;
    }
    obtain() {
        this.obtained = true;
    }
    getState() {
        return this.obtained ? 1 : 0;
    }
    setState(state) {
        if (typeof state === "boolean")
            this.state = state;
        else
            this.state = state === 1 ? true : false;
    }
    isObtained() {
        return this.obtained;
    }
    getMaxState() {
        return 1;
    }
    getMinState() {
        return 0;
    }
    getBaseImageSrc() {
        return this.image.src;
    }
    getCategory() {
        return this.category;
    }
    hasParentItem() {
        return this.parentItem !== null;
    }
    getImage() {
        return this.image;
    }
 }

class CountItem {
    constructor(imageName, maxCount, {category=Categories.Main, name=imageName, min=0}={}) {
        this.image = getIconImage(imageName);
        this.name = name;
        this.maxCount = maxCount;
        this.count = min;
        this.min = min;
        this.category = category;
    }
    increase() {
        if (this.count < this.maxCount)
            ++this.count;
        else 
            this.reset();
    }
    decrease() {
        if (this.count > this.min)
            --this.count;
        else 
            this.setCountToMax();
    }
    reset() {
        this.count = this.min;
    }
    setCountToMax() {
        this.count = this.maxCount;
    }
    amountIsObtained(amount) {
        return this.count >= amount;
    }
    oneIsObtained() {
        return this.count >= 1;
    }
    getState() {
        return this.count;
    }
    getMaxState() {
        return this.maxCount;
    }
    getMinState() {
        return this.min;
    }
    getBaseImageSrc() {
        return this.image.src;
    }
    getCategory() {
        return this.category;
    }
    getImage() {
        return this.image;
    }
}

class ProgressiveItem {
    constructor(baseImageName, names, {category=Categories.Main, min=0}={}) {
        this.items = [];
        this.maxProgress = names.length;
        for (let i = 0; i < this.maxProgress; ++i) {
            let boolItem = new BoolItem(baseImageName + i, {name: names[i], category: category});
            boolItem.parentItem = this;
            this.items[i] = boolItem;
        }
        this.progress = 0;
        this.min = min;
    }
    getItemByIndex(index) {
        return this.items[index];
    }
    getItemByName(name) {
        for (let item of this.items)
            if (item.name == name)
                return item;
        return null;
    }
    switchItem(index) {
        this.items[index].increase();
    }
    switchAllItems() {
        for(let item of this.items) 
            item.increase();
    }
    increase() {
        if (this.progress < this.maxProgress) {
            ++this.progress;
            this.items[this.progress - 1].obtain();
        }
        else 
            this.reset();
    }
    decrease() {
        if (this.progress > this.min) {
            this.items[this.progress - 1].reset();
            --this.progress;
        }       
        else 
            this.setProgressToMax();
    }
    reset() {
        for (let i = this.progress - 1; i > this.min - 1; --i)
            this.items[i].reset();
        this.progress = this.min;
    }
    setProgressToMax() {
        for (let i = this.progress; i < this.maxProgress; ++i)
            this.items[i].obtain();
        this.progress = this.maxProgress;
    }
    getState() {
        return this.progress;
    }
    getMaxState() {
        return this.maxProgress;
    }
    getMinState() {
        return this.min;
    }
    getBaseImageSrc() {
        return this.items[0].getBaseImageSrc();
    }
    getCategory() {
        return this.items[0].getCategory();
    }
    getImage() {
        return this.items[this.progress].getImage();
    }
}

class CountRequiredItem {
    constructor(imageName, maxCount, itemNames, {category=Categories.Main, min=0}={}) {
        this.image = getIconImage(imageName);
        this.maxCount = maxCount;
        this.items = new Map();
        for (let [req, def] of Object.entries(itemNames)) {
            let name, itemImageName;
            // For items with different images
            if (typeof def === 'string') {
                name = def;
                itemImageName = imageName;
            } 
            else {
                name = def.name;
                itemImageName = def.imageName;
            }
            let boolItem = new BoolItem(itemImageName, {name: name, category: category})
            boolItem.parentItem = this;
            this.items.set(req, boolItem);
        }
        this.counter = 0;
        this.itemCounter = 0;
        this.min = min;
    }
    getItemByReq(req) {
        return this.items.get(req.toString());
    }
    getItemByIndex(index) {
        return Array.from(this.items.values())[index];
    }
    getItemByName(name) {
        for (let item of this.items.values())
            if (item.name == name)
                return item;
        return null;
    }
    getNextItemRequirement() {
        return parseInt(Array.from(this.items.keys())[this.itemCounter]);
    }
    increase() {
        if (this.counter < this.maxCount) {
            ++this.counter;
            if (this.counter === this.getNextItemRequirement()) {
                this.items.get(this.counter.toString()).obtain();
                ++this.itemCounter;
            }
        }
        else
           this.reset();
    }
    decrease() {
        if (this.counter > 0) {
            --this.counter;
            if (this.counter === this.getNextItemRequirement()) {
                this.items.get(this.counter.toString()).reset();
                --this.itemCounter;
            }
        }
        else
            this.setCountToMax()
    }
    reset() {
        this.counter = 0;
        this.itemCounter = 0;
        for (let item in this.items.values())
            item.reset();
    }
    setCountToMax() {
        this.counter = this.maxCount;
        this.itemCounter = this.items.keys().length - 1;
        for (let item in this.items.values())
            item.obtain();
    }
    getState() {
        return this.counter;
    }
    getMaxState() {
        return this.maxCount;
    }
    getMinState() {
        return this.min;
    }
    getBaseImageSrc() {
        return this.image.src;
    }
    getCategory() {
        return this.getItemByIndex(0).getCategory();
    }
     getImage() {
        return this.items[this.itemCounter].getImage();
    }
}

class MultiItem {
    constructor(item, amount) {
        this.item = item;
        this.amount = amount;
        this.name = MultiItem.getNameFormat(item, amount);
    }
    getCategory() {
        return this.item.getCategory();
    }
    static getNameFormat(item, amount) {
        return item.name + "&nbsp&nbsp×&nbsp&nbsp" + amount;;
    }
    getImage() {
        return this.item.getImage();
    }
}


let bugIndex = 0;
function makeBugItem(species, gender) {
    return new BoolItem('Bug' + bugIndex++, {
        name: (gender === 'M' ? '♂' : '♀') + '&nbsp&nbsp' + species,
        category: Categories.Bugs,
    });
}

// Item Wheel
var fishingRods = new ProgressiveItem('Fishing Rod', ['Fishing Rod', 'Fishing Rod & Coral Earring']);
var slingshot = new BoolItem('Slingshot');
var lantern = new BoolItem('Lantern');
var boomerang = new BoolItem('Gale Boomerang');
var ironBoots = new BoolItem('Iron Boots');
var bow = new ProgressiveItem("Bow", [
    "Hero's Bow", "Hero's Bow & Big Quiver", "Hero's Bow & Giant Quiver"
]);
var hawkeye = new BoolItem('Hawkeye');
var bombBag = new CountItem('Bomb Bag', 3);
var giantBombBag = new BoolItem("Giant Bomb Bag");
var clawshots = new ProgressiveItem("Clawshot", ["Clawshot", "Double Clawshot"]);
var aurusMemo = new BoolItem("Auru's Memo");
var spinner = new BoolItem("Spinner");
var asheisSketch = new BoolItem("Ashei's Sketch");
var ballAndChain = new BoolItem("Ball and Chain");
var dominionRods = new ProgressiveItem('Dominion Rod', ['Past Dominion Rod', 'Dominion Rod']);
var horseCall = new BoolItem('Horse Call');
var iliasCharm = new BoolItem("Ilia's Charm");
var renadosLetter = new BoolItem("Renado's Letter");
var invoice = new BoolItem('Invoice');
var woodenStatue = new BoolItem('Wooden Statue');
var bottle = new CountItem('Bottle', 4, {name: 'Empty Bottle'});
var skybook = new CountRequiredItem('Sky Book Character', 7, {
    1 : "Ancient Sky Book", 7 : "Filled Sky Book"
}, {category: Categories.SkyCharacters});
// Start Menu
var swords = new ProgressiveItem('Sword', [
    'Wooden Sword', 'Ordon Sword', 'Master Sword', 'Light Filled Master Sword'
]);
var woodenShields = new ProgressiveItem("Shield", [
    'Ordon Shield', 'Wooden Shield'
]);
var hylianShield = new BoolItem('Shield2', {name: "Hylian Shield"});
var zoraArmor = new BoolItem("Zora Armor");
var magicArmor = new BoolItem("Magic Armor");
var heartPiece = new CountItem('Heart Piece', 45, {category: Categories.Hearts});
var heartContainer = new CountItem('Heart Container', 8, {category: Categories.Hearts});
var wallets = new ProgressiveItem("Wallet", [
    "Wallet", "Big Wallet", "Giant Wallet"
], {min: 1}); // We start with the Wallet so min=1
var scents = new ProgressiveItem("Scent", [
    "Youths' Scent", "Scent of Ilia", "Poe Scent", "Reekfish Scent", "Medicine Scent"
]);
var hiddenSkills = new CountRequiredItem('Hidden Skill', 7, {
    1 : 'Ending Blow', 2 : 'Shield Attack', 3 : 'Back Slice', 4 : 'Helm Splitter',
    5 : 'Mortal Draw', 6 : 'Jump Strike', 7 : "Great Spin"
}, {category: Categories.HiddenSkills});
var poeSoul = new CountItem('Poe Soul', 60, {category: Categories.PoeSouls});
var fusedShadow = new CountItem('Fused Shadow', 3);
var mirrorShard = new CountItem('Mirror Shard', 4);
//Bugs
var antM = makeBugItem('Ant', 'M');
var antF = makeBugItem('Ant', 'F');
var dayflyM = makeBugItem('Dayfly', 'M');
var dayflyF = makeBugItem('Dayfly', 'F');
var beetleM = makeBugItem('Beetle', 'M');
var beetleF = makeBugItem('Beetle', 'F');
var mantisM = makeBugItem('Mantis', 'M');
var mantisF = makeBugItem('Mantis', 'F');
var stagBeetleM = makeBugItem('Stag Beetle', 'M');
var stagBeetleF = makeBugItem('Stag Beetle', 'F');
var pillbugM = makeBugItem('Pillbug', 'M');
var pillbugF = makeBugItem('Pillbug', 'F');
var butterflyM = makeBugItem('Butterfly', 'M');
var butterflyF = makeBugItem('Butterfly', 'F');
var ladybugM = makeBugItem('Ladybug', 'M');
var ladybugF = makeBugItem('Ladybug', 'F');
var snailM = makeBugItem('Snail', 'M');
var snailF = makeBugItem('Snail', 'F');
var phasmidM = makeBugItem('Phasmid', 'M');
var phasmidF = makeBugItem('Phasmid', 'F');
var grasshopperM = makeBugItem('Grasshopper', 'M');
var grasshopperF = makeBugItem('Grasshopper', 'F');
var dragonflyM = makeBugItem('Dragonfly', 'M');
var dragonflyF = makeBugItem('Dragonfly', 'F');
// Unseen Inventory
var shadowCrystal = new BoolItem("Shadow Crystal");
var coroKey = new BoolItem('Small KeyC', {name: 'Faron Coro Key'});
var faronKey = new BoolItem('Small KeyF', {name: 'Faron Woods Key'});
var bulblinKey = new BoolItem('Small KeyB', {name: 'Bulblin Camp Key'});
var gateKey = new BoolItem('Small KeyG', {name: 'Gate Keys'});
var rupees = new CountItem('Rupees', 9999, {category: Categories.Rupees, min: 9999});
// Dungeon Items
var forestSK = new CountItem('Small Key', 4, {name: 'Forest Temple Small Key'});
var forestMap = new BoolItem('Dungeon Map', {name: "Forest Temple Map"});
var forestCompass = new BoolItem("Compass", {name: "Forest Temple Compass"});
var forestBK = new BoolItem('Boss Key', {name: 'Forest Temple Boss Key'}); 
var diababa = new BoolItem('Diababa', {category: Categories.Bosses});

var minesSK = new CountItem('Small Key', 3, {name: 'Goron Mines Small Key'});
var minesMap = new BoolItem('Dungeon Map', {name: "Goron Mines Map"});
var minesCompass = new BoolItem("Compass", {name: "Goron Mines Compass"});
var minesBK = new CountRequiredItem('GBK2', 3, {
    3 : {name: "Goron Mines Boss Key", imageName: "GBK3"}
}); 
var fyrus = new BoolItem('Fyrus', {category: Categories.Bosses});

var lakebedSK = new CountItem('Small Key', 3, {name: 'Lakebed Temple Small Key'});
var lakebedMap = new BoolItem('Dungeon Map', {name: "Lakebed Temple Map"});
var lakebedCompass = new BoolItem("Compass", {name: "Lakebed Temple Compass"});
var lakebedBK = new BoolItem('Boss Key', {name: 'Lakebed Temple Boss Key'}); 
var morpheel = new BoolItem('Morpheel', {category: Categories.Bosses});

var arbiterSK = new CountItem('Small Key', 5, {name: "Arbiter's Ground Small Key"});
var arbiterMap = new BoolItem('Dungeon Map', {name: "Arbiter's Ground Map"});
var arbiterCompass = new BoolItem("Compass", {name: "Arbiter's Ground Compass"});
var arbiterBK = new BoolItem('Boss Key', {name: "Arbiter's Ground Boss Key"}); 
var stallord = new BoolItem('Stallord', {category: Categories.Bosses});

var snowpeakSK = new CountItem('Small Key', 4, {name: "Snowpeak Ruins Small Key"});
var snowpeakMap = new BoolItem('Dungeon Map', {name: "Snowpeak Ruins Map"});
var snowpeakCompass = new BoolItem("Compass", {name: "Snowpeak Ruins Compass"});
var snowpeakBK = new BoolItem('Bedroom Key'); 
var pumpkin = new BoolItem('Ordon Pumpkin');
var cheese = new BoolItem("Ordon Goat Cheese");
var blizzeta = new BoolItem("Blizzeta", {category: Categories.Bosses});

var templeSK = new CountItem('Small Key', 3, {name: "Temple of Time Small Key"});
var templeMap = new BoolItem('Dungeon Map', {name: "Temple of Time Map"});
var templeCompass = new BoolItem("Compass", {name: "Temple of Time Compass"});
var templeBK = new BoolItem('Boss Key', {name: "Temple of Time Boss Key"}); 
var armogohma = new BoolItem('Armogohma', {category: Categories.Bosses});

var citySK = new CountItem('Small Key', 1, {name: "City in the Sky Small Key"});
var cityMap = new BoolItem('Dungeon Map', {name: "City in the Sky Map"});
var cityCompass = new BoolItem("Compass", {name: "City in the Sky Compass"});
var cityBK = new BoolItem('Boss Key', {name: "City in the Sky Boss Key"}); 
var argorok = new BoolItem('Argorok', {category: Categories.Bosses});

var palaceSK = new CountItem('Small Key', 7, {name: "Palace of Twilight Small Key"});
var palaceMap = new BoolItem('Dungeon Map', {name: "Palace of Twilight Map"});
var palaceCompass = new BoolItem("Compass", {name: "Palace of Twilight Compass"});
var palaceBK = new BoolItem('Boss Key', {name: "Palace of Twilight Boss Key"}); 
var zant = new BoolItem('Zant', {category: Categories.Bosses});

var castleSK = new CountItem('Small KeyHC', 3, {name: 'Hyrule Castle Small Key'});
var castleMap = new BoolItem('Dungeon Map', {name: "Hyrule Castle Map"});
var castleCompass = new BoolItem("Compass", {name: "Hyrule Castle Compass"});
var castleBK = new BoolItem("Boss KeyHC", {name: "Hyrule Castle Boss Key"});
var ganondorf = new BoolItem('Ganondorf', {category: Categories.Bosses});

// Rupees Enum
const Rupees = Object.freeze({
    Green  : new Obtainable("Green Rupee", rupees),
    Blue   : new Obtainable("Blue Rupee", rupees),
    Yellow : new Obtainable("Yellow Rupee", rupees),
    Red    : new Obtainable("Red Rupee", rupees),
    Purple : new Obtainable("Purple Rupee", rupees),
    Orange : new Obtainable("Orange Rupee", rupees),
    Silver : new Obtainable("Silver Rupee", rupees)
});

let goldenWolf = new Obtainable("Golden Wolf", hiddenSkills);
let howlingStone = new Obtainable("Howling Stone", null, {category: Categories.HiddenSkills});
let skybookChar = new Obtainable("Sky Book Character", skybook);
let coralEarring = new Obtainable("Coral Earring", fishingRods);
let coroBottle = new Obtainable('BottleYellow', bottle, {name: "Coro's Oil Bottle"});
let seraBottle = new Obtainable("BottleMilkH", bottle, {name: "Sera's 1/2 Milk Bottle"});
let jovaniBottle = new Obtainable("BottleTears", bottle, {name: "Jovani's Great Fairy's Tears Bottle"});
let bigQuiver = new Obtainable("Quiver1", bow, {name: "Big Quiver"});
let giantQuiver = new Obtainable("Quiver2", bow, {name: "Giant Quiver"});
let minesBKAmoto = new Obtainable("GBK0", minesBK, {name: "Gor Amato Key Shard"});
let minesBKEbizo = new Obtainable("GBK1", minesBK, {name: "Gor Ebizo Key Shard"});
let minesBKLiggs = new Obtainable("GBK2", minesBK, {name: "Gor Liggs Key Shard"});
let nightPoe = new Obtainable("NightPoe", poeSoul, {name: "Night Poe Soul"});

let ooccoo = new Obtainable("Ooccoo", null, {category: Categories.Ooccoo});
let ooccooPot = new Obtainable('OoccooPot', null, {category: Categories.Ooccoo, name: "Ooccoo"});

let faronBulblinLock = new Obtainable("LockFaronBulblin", null, {category: Categories.Locks, name: "Overworld Lock"});
let gateLock = new Obtainable("LockGates", null, {category: Categories.Locks, name: "Gate Lock"});
let lock = new Obtainable("Lock", null, {category: Categories.Locks, name: "Dungeon Lock"});
let snowpeakLock = new Obtainable("LockS", null, {category: Categories.Locks, name: "Snowpeak Ruins Lock"});
let bossLock = new Obtainable("Boss Lock", null, {category: Categories.Locks, name: "Dungeon Boss Lock"});
let minesBossLock = new Obtainable("Boss LockG", null, {category: Categories.Locks, name: "Goron Mines Boss Lock"});
let lakebedBossLock = new Obtainable("Boss LockL", null, {category: Categories.Locks, name: "Lakebed Temple Boss Lock"});
let snowpeakBossLock = new Obtainable("Boss LockS", null, {category: Categories.Locks, name: "Snowpeak Ruins Boss Lock"});

let bombs = new Obtainable("Bombs", null, {category: Categories.Ammo});
let waterBombs = new Obtainable("Water Bombs", null, {category: Categories.Ammo});
let bomblings = new Obtainable("Bomblings", null, {category: Categories.Ammo});
let arrows = new Obtainable("Arrows", null, {category: Categories.Ammo});
let seeds = new Obtainable("Seeds", null, {category: Categories.Ammo});

let randoHint = new Obtainable('Sign', null, {name: "Randomizer Hint", category: Categories.Hints});

let chest = new Container('Chest'); 
let smallChest = new Container('Small Chest');
let bossChest = new Container('Boss Chest');
let rupeeBoulder = new Container('Rupee Boulder');