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

function getIconImage(imageName) {
    return images.get('Icons/' + imageName + '.png');
}

class Item {
    increase() {}
    decrease() {}
    reset() {}
    getState() {}
    getMaxState() {}
    getMinState() {}
    getBaseImageSrc() {}
} 

class BoolItem {
    constructor(imageName, name=imageName) {
        this.image = getIconImage(imageName);
        this.name = name;
        this.obtained = false;
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
    getMaxState() {
        return 1;
    }
    getMinState() {
        return 0;
    }
    getBaseImageSrc() {
        return this.image.src;
    }
}

class CountItem {
    constructor(imageName, maxCount, name=imageName, min=0) {
        this.image = getIconImage(imageName);
        this.name = name;
        this.maxCount = maxCount;
        this.count = 0;
        this.min = min;
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
}

class ProgressiveItem {
    constructor(baseImageName, names, min=0) {
        this.items = [];
        this.maxProgress = names.length;
        for (let i = 0; i < this.maxProgress; ++i) 
            this.items[i] = new BoolItem(baseImageName + i, names[i]);
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
}

class CountRequiredItem {
    constructor(imageName, maxCount, itemNames,min=0) {
        this.image = getIconImage(imageName);
        this.maxCount = maxCount;
        this.items = new Map();
        for (let [req, def] of Object.entries(itemNames)) {
            let name, itemImageName;
            // For items with different images
            if (def instanceof String) {
                name = def;
                itemImageName = imageName;
            } else {
                name = def.name;
                itemImageName = def.imageName;
            }

            this.items.set(req, new BoolItem(itemImageName, name));
        }
        this.counter = 0;
        this.itemCounter = 0;
        this.min = min;
    }
    getItemByReq(req) {
        return this.items.get(req);
    }
    getItemByIndex(index) {
        return this.items.values[index];
    }
    getItemByName(name) {
        for (let item of this.items.values)
            if (item.name == name)
                return item;
        return null;
    }
    increase() {
        if (this.counter < this.maxCount) {
            ++this.counter;
            if (this.counter == this.items.keys[this.itemCounter]) {
                this.items.get(this.counter).obtain();
                ++this.itemCounter;
            }
        }
        else
           this.reset();
    }
    decrease() {
        if (this.counter > 0) {
            --this.counter;
            if (this.counter == this.items.keys[this.itemCounter]) {
                this.items.get(this.counter).reset();
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
}
let bugIndex = 0;
function makeBugItem(species, gender) {
    return new BoolItem('Bug' + bugIndex++, 
        gender === 'M' ? '♂' : '♀' + '&nbsp ' + species);
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
var bottle = new CountItem('Bottle', 4, 'Empty Bottle');
var skybook = new CountRequiredItem('Sky Book Character', 7, {
    1 : "Ancient Sky Book", 7 : "Filled Sky Book"
});
// Start Menu
var swords = new ProgressiveItem('Sword', [
    'Wooden Sword', 'Ordon Sword', 'Master Sword', 'Light Filled Master Sword'
]);
var shields = new ProgressiveItem("Shield", [
    'Ordon Shield', 'Wooden Shield', 'Hylian Shield'
]);
var zoraArmor = new BoolItem("Zora Armor");
var magicArmor = new BoolItem("Magic Armor");
var heartPiece = new CountItem('Heart Piece', 45);
var heartContainer = new CountItem('Heart Container', 8);
var wallets = new ProgressiveItem("Wallet", [
    "Wallet", "Big Wallet", "Giant Wallet"
], 1); // We start with the Wallet so min=1
var scents = new ProgressiveItem("Scent", [
    "Youths' Scent", "Scent of Ilia", "Poe Scent", "Reekfish Scent", "Medicine Scent"
]);
var hiddenSkills = new CountRequiredItem('Hidden Skill', 7, {
    1 : 'Ending Blow', 2 : 'Shield Attack', 3 : 'Back Slice', 4 : 'Helm Splitter',
    5 : 'Mortal Draw', 6 : 'Jump Strike', 7 : "Great Spin"
});
var poes = new CountItem('Poe Soul', 60);
var fusedShadows = new CountItem('Fused Shadow', 3);
var mirrorShards = new CountItem('Mirror Shard', 4);
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
var coroKey = new BoolItem('Small KeyC', 'Faron Key');
var bulblinKey = new BoolItem('Small KeyB', 'Bulblin Camp Key');
var gateKey = new BoolItem('Small KeyG', 'Gate Keys');
var rupees = new CountItem('Rupees', 9999);
rupees.setCountToMax(); // To check all rupee requirements

// Dungeon Items
var dungeonMap = new BoolItem('Dungeon Map');
var compass = new BoolItem('Compass')

var forestSK = new CountItem('Small Key', 4, 'Forest Temple Small Key');
var forestBK = new BoolItem('Boss Key', 'Forest Temple Boss Key'); 
var diababa = new BoolItem('Diababa', 'Diababa Defeated');

var minesSK = new CountItem('Small Key', 3, 'Goron Mines Small Key');
var minesBK = new CountRequiredItem('GBK2', 3, {
    3 : {name: "Goron Mines Boss Key", imageName: "GBK3"}
}); 
var fyrus = new BoolItem('Fyrus', 'Fyrus Defeated');

var lakebedSK = new CountItem('Small Key', 3, 'Lakebed Temple Small Key');
var lakebedBK = new BoolItem('Boss Key', 'Lakebed Temple Boss Key'); 
var morpheel = new BoolItem('Morpheel', 'Morpheel Defeated');

var arbiterSK = new CountItem('Small Key', 5, "Arbiter's Ground Small Key");
var arbiterBK = new BoolItem('Boss Key', "Arbiter's Ground Boss Key"); 
var stallord = new BoolItem('Stallord', 'Stallord Defeated');

var snowpeakSK = new CountItem('Small Key', 4, "Snowpeak Ruins Small Key");
var snowpeakBK = new BoolItem('Bedroom Key', "Bedroom Key"); 
var pumpkin = new BoolItem('Ordon Pumpkin');
var cheese = new BoolItem("Ordon Goat Cheese");
var blizzeta = new BoolItem("Blizzeta", 'Blizzeta Defeated');

var templeSK = new CountItem('Small Key', 3, "Temple of Time Small Key");
var templeBK = new BoolItem('Boss Key', "Temple of Time Boss Key"); 
var armogohma = new BoolItem('Armogohma', 'Armogohma Defeated');

var citySK = new CountItem('Small Key', 1, "City in the Sky Small Key");
var cityBK = new BoolItem('Boss Key', "City in the Sky Boss Key"); 
var argorok = new BoolItem('Argorok', 'Argorok Defeated');

var palaceSK = new CountItem('Small Key', 7, "Palace of Twilight Small Key");
var palaceBK = new BoolItem('Boss Key', "Palace of Twilight Boss Key"); 
var zant = new BoolItem('Zant', 'Zant Defeated');

var castleSK = new CountItem('Small KeyHC', 3, 'Hyrule Castle Small Key');
var castleBK = new BoolItem("Boss KeyHC", "Hyrule Castle Boss Key");



class Requirement {
    constructor(imageName, text, condition) {
        this.image = getIconImage(imageName);
        this.text = text;
        this.condition = condition;
    }
    static fromBoolItem(item) {
        return new Requirement(item.imageName, item.name, 
            () => item.isObtained());
    }
    static fromCountItem(item, amount=1) {
        return new Requirement(item.imageName, 
            amount > 1 ? item.name + "&nbsp × &nbsp" + amount : item.name, 
            () => item.getState() >= amount);
    }
    static fromObtainable(obtainable) {
        return new Requirement(obtainable.imageName, 
            obtainable.name, 
            () => obtainable.isObtained());
    }
    isMet() {
        return this.condition();
    }
}

class Container {
    constructor(imageName, contentName="Empty", contentImg=null) {
        this.image = getIconImage(imageName);
        this.contentName = contentName;
        this.contentImg = contentImg;
    }
    withItem(item) {
        return new Container(this.image, item.name, item.image);
    }
    withNewContent(imageName, amount=1) {
        return new Container(this.image, 
            amount > 1 ? imageName + "&nbsp × &nbsp" + amount : imageName, 
            getIconImage(imageName));
    }
}

var chest = new Container('Chest'); 
var smallChest = new Container('Small Chest');
var bossChest = new Container('Boss Chest');

class Obtainable {
    constructor(base, item, position,
        { baseCategory, baseReqs=[], baseDesc } = {}, 
        { randoCategory=baseCategory, randoReqs=baseReqs, randoDesc=baseDesc } = {},
        { glitchedReqs=randoReqs, glitchedDesc=randoDesc } = {}) 
    {
        if (typeof base === 'string') 
            base = getIconImage(base);
        this.base = base;
        this.item = item;
        this.position = position;
        this.baseCategory = baseCategory;
        this.baseReqs = baseReqs;   
        this.baseDesc = baseDesc;
        this.randoCategory = randoCategory;
        this.randoReqs = randoReqs;
        this.randoDesc = randoDesc;
        this.glitchedReqs = glitchedReqs;
        this.glitchedDesc = glitchedDesc;

        this.obtained = false;
    }
    setName(name) {
        this.name = name;
    }
    isContainer() {
        return this.base instanceof Container;
    }
    obtain() {
        this.obtained = true;
    }
    reset() {
        this.obtained = false;
    }
    isObtained() {
        return this.obtained;
    }
}

// Reccuring Requirements
let clawshotReq = Requirement.fromBoolItem(clawshots.getItemByIndex(0));
let doubleClawshotReq = Requirement.fromBoolItem(clawshots.getItemByIndex(1));
let bombBagReq = Requirement.fromCountItem(bombBag);
let ballAndChainReq = Requirement.fromBoolItem(ballAndChain);
let ironBootsReq = Requirement.fromBoolItem(ironBoots);
let shadowCrystalReq = Requirement.fromBoolItem(shadowCrystal);
let spinnerReq = Requirement.fromBoolItem(spinner);

// Reccuring Image Names
let orangeRupee = "Orange Rupee";
let redRupee = "Red Rupee";
let greenRupee = "Green Rupee";
let blueRupee = "Blue Rupee";
let purpleRupee = "Purple Rupee";
let silverRupee = "Silver Rupee";
let yellowRupee = "Yellow Rupee";
let goldenWolf = "Golden Wolf";
let howlingStone = "Howling Stone";
let rupeeBoulder = "Rupee Boulder";
let poe = "Poe Soul";
let nightPoe = "Night Poe";
let lock = "Lock";
let bossLock = "Boss Door";
let skybookChar = "Sky Book Character";

// Categories
var mainCategory = "Main";
var poeCategory = "Poe Souls";
var bugCategory = "Bugs";
var giftsCategory = "Gifts";
var skyCharCategory = "Sky Characters";
var skillsCategory = "Hidden Skills";
var shopCategory = "Shop Items";
var rupeeCategory = "Rupees";
var heartCategory = "Hearts";
var ammoCategory = "Ammo";

// Howling Stones obtainables for Golden Wolves
let mountainHS = new Obtainable(howlingStone, null, [-4063, 8232], {
    baseCategory: skillsCategory,
    baseReqs: [shadowCrystalReq],
    baseDesc: 'Summons the Ordon Spring Golden Wolf, accessible while clearing out the Eldin Twilight.'
});
let hiddenHS = new Obtainable(howlingStone, null, [-2065, 6665], {
    baseCategory: skillsCategory,
    baseReqs: [shadowCrystalReq],
    baseDesc: 'Summons the Hyrule Castle Golden Wolf, accessible when you first get into the Hidden Village.'
});
let faronHS = new Obtainable(howlingStone, null, [-7340, 4043], {
    baseCategory: skillsCategory,
    baseReqs: [shadowCrystalReq],
    baseDesc: 'Summons the South Castle Town Golden Wolf, accessible while on the way to the Master Sword.'
});
let snowpeakHS = new Obtainable(howlingStone, null, [-475, 3393], { 
    baseCategory: skillsCategory,
    baseReqs: [shadowCrystalReq],
    baseDesc: 'Summons the Kakariko Graveyard Golden Wolf, accessible on the way to the Snowpeak Ruins.'
});
let riverHS = new Obtainable(howlingStone, null, [-852, 5918], {
    baseCategory: skillsCategory,
    baseReqs: [shadowCrystalReq],
    baseDesc: 'Summons the West Castle Town Golden Wolf, accessible while clearing out the Lanayru Twilight.'
});
let lakeHS = new Obtainable(howlingStone, null, [-5405, 3014], {
    baseCategory: skillsCategory,
    baseReqs: [shadowCrystalReq],
    baseDesc: 'Summons the Gerudo Desert Golden Wolf, climb the ladder as human to reach it.'
});

var obtainables = new Map([
    ['Uli Cradle Delivery', new Obtainable('Fishing Rod0', fishingRods, [-9094, 4809], {
        baseCategory: mainCategory, 
        baseDesc: 'Retrieve the cradle from the monkey using the hawk and deliver it to Uli to receive the fishing rod.'
    })],
    ["Ordon Spring Golden Wolf", new Obtainable(goldenWolf, hiddenSkills, [-8542, 4795], {
        baseCategory: skillsCategory, 
        baseReqs: [Requirement.fromObtainable(mountainHS)],
        baseDesc: 'Summoned by the Death Mountain howling stone.'
    },
    {
        randoDesc: 'Summoned by the Death Mountain howling stone. The item is lying on the ground where the Golden Wolf usually is.'
    })],

]);
debugger;
