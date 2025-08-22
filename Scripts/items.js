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

// Item & Obtainables Categories Enum
const Categories = Object.freeze({
    // Flags
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
    // Non Flags
    Bottle: "Bottled Items",
    Shops: "Shops",
    Grass: "Horse & Hawk Grass",
    Fishing: "Fishing Spots",
    Minigames: "Minigames",
    Postman: 'Postman',
    MonsterRupee: "Monster Group Rupees",
    // Randomizer Categories
    Gifts: "Gifts from NPCs",
    ShopItems: "Shop Items",
    Hints: "Randomizer Hints",  
    NonChecks: "Non-Check Items",
    Fool: "Foolish Items"
});

const RandomizerCheckCategories = [
    Categories.Main,
    Categories.PoeSouls,
    Categories.Bugs,
    Categories.HiddenSkills,
    Categories.SkyCharacters,
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
    getName() {
        return this.name;
    }
    getTracker() {
        if (this.hasItem())
            return this.item.getTracker();
        return null;
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
        return this.content.getName();
    }
    getContentImage() {
        return this.content.getImage();
    }
    getImage() {
        return this.image;
    }
    getTracker() {
        return this.getContent().getTracker();
    }
}

class Item {
    constructor(name, category=Categories.Main, defaultState, maxState) {
        this.name = name;
        this.category = category;
        this.defaultState = defaultState;
        this.maxState = maxState;
        this.state = 0;
    }
    getCategory() {
        return this.category;
    } 
    getName() {
        return this.name;
    }
    getState() {
        return this.state;
    }
    getMinState() {
        return this.defaultState;
    }
    getMaxState() {
        return this.maxState;
    }
    getImage() {
        return this.image;
    }
    getBaseImageSrc() {
        return this.getImage().src;
    }
    getTracker() {
        if (this.tracker !== undefined)
            return this.tracker;
        return null;
    }
}

class BoolItem extends Item {
    constructor(imageName, {name=imageName, category=Categories.Main, alwaysActive=false}={}) {
        super(name, category, alwaysActive ? 1 : 0, 1);
        this.image = getIconImage(imageName);
        this.state = false;
    }
    increase() {
        this.state = !this.state;
    }
    decrease() {
        this.increase();
    }
    reset() {
        this.state = false;
    }
    obtain() {
        this.state = true;
    }
    getState() {
        return this.state ? 1 : 0;
    }
    setState(state) {
        if (typeof state === "boolean")
            this.state = state;
        else
            this.state = state === 1 ? true : false;
    }
    isObtained() {
        return this.state;
    }
    hasParentItem() {
        return this.parentItem !== undefined;
    }
    getTracker() {
        if (this.hasParentItem())
            return this.parentItem.getTracker();

        if (this.tracker !== undefined)
            return this.tracker;
        return null;
    }
 }

class CountItem extends Item {
    constructor(imageName, maxCount, {category=Categories.Main, name=imageName, min=0}={}) {
        super(name, category, min, maxCount);
        this.image = getIconImage(imageName);
    }
    increase() {
        if (this.state < this.maxState)
            ++this.state;
        else 
            this.reset();
    }
    decrease() {
        if (this.state > this.defaultState)
            --this.state;
        else 
            this.setCountToMax();
    }
    reset() {
        this.state = this.defaultState;
    }
    setCountToMax() {
        this.state = this.maxState;
    }
    amountIsObtained(amount) {
        return this.state >= amount;
    }
    oneIsObtained() {
        return this.state >= 1;
    }
}

class ProgressiveItem extends Item {
    constructor(name, itemNames, {category=Categories.Main, min=0}={}) {
        let maxState = itemNames.length
        super(name, category, min, maxState)
        this.items = [];
        for (let i = 0; i < maxState; ++i) {
            let boolItem = new BoolItem(name + i, {name: itemNames[i], category: category});
            boolItem.parentItem = this;
            this.items[i] = boolItem;
        }
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
        if (this.state < this.maxState) {
            ++this.state;
            this.items[this.state - 1].obtain();
        }
        else 
            this.reset();
    }
    decrease() {
        if (this.state > this.defaultState) {
            this.items[this.state - 1].reset();
            --this.state;
        }       
        else 
            this.setProgressToMax();
    }
    reset() {
        for (let i = this.state - 1; i > this.defaultState - 1; --i)
            this.items[i].reset();
        this.state = this.defaultState;
    }
    setProgressToMax() {
        for (let i = this.state; i < this.maxState; ++i)
            this.items[i].obtain();
        this.state = this.maxState;
    }
    getBaseImageSrc() {
        return this.items[0].getBaseImageSrc();
    }
    getNextItemImage() {
        if (this.state === this.maxState)
            return this.items[this.state - 1].getImage();
        return this.items[this.state].getImage();
    }
    getCurrentItemImage() {
        if (this.state === 0)
            return this.items[this.state].getImage();
        return this.items[this.state - 1].getImage();
    }
    getImage() {
        return this.getNextItemImage();
    }
}

class CountRequiredItem extends Item {
    constructor(name, imageName, maxCount, itemNames, {category=Categories.Main, min=0}={}) {
        super(name, category, min, maxCount);
        this.image = getIconImage(imageName);
        this.itemCounter = 0;
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
    getNextItemCounter() {
        return this.itemCounter;
    }
    getPreviousItemCounter() {
        return this.itemCounter - 1;
    }
    getItemRequirement(itemCounter) {
        return parseInt(Array.from(this.items.keys())[itemCounter])
    } 
    getNextItemRequirement() {
        return this.getItemRequirement(this.getNextItemCounter());
    }
    getPreviousItemRequirement() {
        return this.getItemRequirement(this.getPreviousItemCounter());
    }
    increase() {
        if (this.state < this.maxState) {
            ++this.state;
            if (this.state === this.getNextItemRequirement()) {
                this.items.get(this.state.toString()).obtain();
                ++this.itemCounter;
            }
        }
        else
           this.reset();
    }
    decrease() {
        if (this.state > 0) {
            if (this.state === this.getPreviousItemRequirement()) {
                this.items.get(this.state.toString()).reset();
                --this.itemCounter;
            }
            --this.state;
        }
        else
            this.setCountToMax()
    }
    reset() {
        this.state = 0;
        this.itemCounter = 0;
        for (let item of this.items.values())
            item.reset();
    }
    setCountToMax() {
        this.state = this.maxState;
        this.itemCounter = this.items.size;
        for (let item of this.items.values())
            item.obtain();
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
        return item.name + "&nbsp&nbsp×&nbsp&nbsp" + amount;
    }
    getImage() {
        return this.item.getImage();
    }
    getName() {
        return this.name;
    }
    getTracker() {
        return this.item.getTracker();
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
var fishingRods = new ProgressiveItem('Progressive Fishing Rod', ['Fishing Rod', 'Fishing Rod & Coral Earring']);
var slingshot = new BoolItem('Slingshot');
var lantern = new BoolItem('Lantern');
var boomerang = new BoolItem('Gale Boomerang');
var ironBoots = new BoolItem('Iron Boots');
var bow = new ProgressiveItem("Progressive Bow", [
    "Hero's Bow", "Hero's Bow & Big Quiver", "Hero's Bow & Giant Quiver"
]);
var hawkeye = new BoolItem('Hawkeye');
var bombBag = new CountItem('Bomb Bag', 3);
var giantBombBag = new BoolItem("Giant Bomb Bag");
var clawshots = new ProgressiveItem("Progressive Clawshot", ["Clawshot", "Double Clawshot"]);
var aurusMemo = new BoolItem("Auru's Memo");
var spinner = new BoolItem("Spinner");
var asheisSketch = new BoolItem("Ashei's Sketch");
var ballAndChain = new BoolItem("Ball and Chain");
var dominionRods = new ProgressiveItem('Progressive Dominion Rod', ['Past Dominion Rod', 'Dominion Rod']);
var horseCall = new BoolItem('Horse Call');
var iliasCharm = new BoolItem("Ilia's Charm");
var renadosLetter = new BoolItem("Renado's Letter");
var invoice = new BoolItem('Invoice');
var woodenStatue = new BoolItem('Wooden Statue');
var bottle = new CountItem('Bottle', 4, {name: 'Empty Bottle'});
var skybook = new CountRequiredItem('Progressive Sky Book', 'Sky Book Character', 7, {
    1 : "Ancient Sky Book", 7 : "Filled Sky Book"
}, {category: Categories.SkyCharacters});
// Start Menu
var swords = new ProgressiveItem('Progressive Sword', [
    'Wooden Sword', 'Ordon Sword', 'Master Sword', 'Light Filled Master Sword'
]);
var woodenShields = new ProgressiveItem("Progressive Shield", [
    'Ordon Shield', 'Wooden Shield'
]);
var hylianShield = new BoolItem("Hylian Shield");
var zoraArmor = new BoolItem("Zora Armor");
var magicArmor = new BoolItem("Magic Armor");
var heartPiece = new CountItem('Heart Piece', 45, {category: Categories.Hearts});
var heartContainer = new CountItem('Heart Container', 8, {category: Categories.Hearts});
var wallets = new ProgressiveItem("Progressive Wallet", [
    "Wallet", "Big Wallet", "Giant Wallet"
], {min: 1}); // We start with the Wallet so min=1
var scents = new ProgressiveItem("Progressive Scent", [
    "Youths' Scent", "Scent of Ilia", "Poe Scent", "Reekfish Scent", "Medicine Scent"
]);
var hiddenSkills = new CountRequiredItem('Progressive Hidden Skill', 'Hidden Skill', 7, {
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
rupees.state = 9999;
// Dungeon Items
var forestSK = new CountItem('Small Key', 4, {name: 'Forest Temple Small Key'});
var forestMap = new BoolItem('Dungeon Map', {name: "Forest Temple Dungeon Map"});
var forestCompass = new BoolItem("Compass", {name: "Forest Temple Compass"});
var forestBK = new BoolItem('Boss Key', {name: 'Forest Temple Big Key'}); 
var diababa = new BoolItem('Diababa', {category: Categories.Bosses});

var minesSK = new CountItem('Small Key', 3, {name: 'Goron Mines Small Key'});
var minesMap = new BoolItem('Dungeon Map', {name: "Goron Mines Dungeon Map"});
var minesCompass = new BoolItem("Compass", {name: "Goron Mines Compass"});
var minesBK = new CountRequiredItem('Goron Mines Key Shard', 'GBK2', 3, {
    3 : {name: "Goron Mines Boss Key", imageName: "GBK3"}
}); 
var fyrus = new BoolItem('Fyrus', {category: Categories.Bosses});

var lakebedSK = new CountItem('Small Key', 3, {name: 'Lakebed Temple Small Key'});
var lakebedMap = new BoolItem('Dungeon Map', {name: "Lakebed Temple Dungeon Map"});
var lakebedCompass = new BoolItem("Compass", {name: "Lakebed Temple Compass"});
var lakebedBK = new BoolItem('Boss Key', {name: 'Lakebed Temple Big Key'}); 
var morpheel = new BoolItem('Morpheel', {category: Categories.Bosses});

var arbiterSK = new CountItem('Small Key', 5, {name: "Arbiter's Ground Small Key"});
var arbiterMap = new BoolItem('Dungeon Map', {name: "Arbiter's Ground Dungeon Map"});
var arbiterCompass = new BoolItem("Compass", {name: "Arbiter's Ground Compass"});
var arbiterBK = new BoolItem('Boss Key', {name: "Arbiter's Ground Big Key"}); 
var stallord = new BoolItem('Stallord', {category: Categories.Bosses});

var snowpeakSK = new CountItem('Small Key', 4, {name: "Snowpeak Ruins Small Key"});
var snowpeakMap = new BoolItem('Dungeon Map', {name: "Snowpeak Ruins Dungeon Map"});
var snowpeakCompass = new BoolItem("Compass", {name: "Snowpeak Ruins Compass"});
var snowpeakBK = new BoolItem('Bedroom Key'); 
var pumpkin = new BoolItem('Ordon Pumpkin');
var cheese = new BoolItem("Ordon Goat Cheese");
var blizzeta = new BoolItem("Blizzeta", {category: Categories.Bosses});

var templeSK = new CountItem('Small Key', 3, {name: "Temple of Time Small Key"});
var templeMap = new BoolItem('Dungeon Map', {name: "Temple of Time Dungeon Map"});
var templeCompass = new BoolItem("Compass", {name: "Temple of Time Compass"});
var templeBK = new BoolItem('Boss Key', {name: "Temple of Time Big Key"}); 
var armogohma = new BoolItem('Armogohma', {category: Categories.Bosses});

var citySK = new CountItem('Small Key', 1, {name: "City in the Sky Small Key"});
var cityMap = new BoolItem('Dungeon Map', {name: "City in the Sky Dungeon Map"});
var cityCompass = new BoolItem("Compass", {name: "City in the Sky Compass"});
var cityBK = new BoolItem('Boss Key', {name: "City in the Sky Big Key"}); 
var argorok = new BoolItem('Argorok', {category: Categories.Bosses});

var palaceSK = new CountItem('Small Key', 7, {name: "Palace of Twilight Small Key"});
var palaceMap = new BoolItem('Dungeon Map', {name: "Palace of Twilight Dungeon Map"});
var palaceCompass = new BoolItem("Compass", {name: "Palace of Twilight Compass"});
var palaceBK = new BoolItem('Boss Key', {name: "Palace of Twilight Big Key"}); 
var zant = new BoolItem('Zant', {category: Categories.Bosses});

var castleSK = new CountItem('Small KeyHC', 3, {name: 'Hyrule Castle Small Key'});
var castleMap = new BoolItem('Dungeon Map', {name: "Hyrule Castle Dungeon Map"});
var castleCompass = new BoolItem("Compass", {name: "Hyrule Castle Compass"});
var castleBK = new BoolItem("Boss KeyHC", {name: "Hyrule Castle Big Key"});
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
let randoFoolishItem = new Obtainable('FoolIce', null, {name: "Foolish Item", category: Categories.Fool});

let chest = new Container('Chest'); 
let smallChest = new Container('Small Chest');
let bossChest = new Container('Boss Chest');
let rupeeBoulder = new Container('Rupee Boulder');