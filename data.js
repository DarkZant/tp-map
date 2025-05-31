var iconImages = new Map();
fetch('icons/images.json')
  .then(res => res.json())
  .then(imageNames => {
    imageNames.forEach(name => {
      const img = new Image();
      img.src = `icons/${name}`;
      iconImages.set(name, img);
    });
});

function getImage(imageName) {
    return iconImages.get(imageName + '.png');
}

class Item {
    increase() {

    }
    decrease() {

    }
    reset() {

    }
} 

class BoolItem extends Item {
    constructor(imageName, name=imageName) {
        this.image = getImage(imageName);
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
}

class CountItem extends Item {
    constructor(imageName, maxCount, name=imageName) {
        this.image = getImage(imageName);
        this.name = name;
        this.maxCount = maxCount;
        this.count = 0;
    }
    increase() {
        if (this.count < this.maxCount)
            ++this.count;
        else 
            this.reset();
    }
    decrease() {
        if (this.count > 0)
            --this.count;
        else 
            this.setCountToMax();
    }
    reset() {
        this.count = 0;
    }
    setCountToMax() {
        this.count = this.maxCount;
    }
    amountIsObtained(amount) {
        return this.count >= amount;
    }
}

class ProgressiveItem extends Item {
    constructor(baseImageName, names) {
        this.items = [];
        this.maxProgress = names.length;
        for (let i = 0; i < this.maxProgress; ++i) {}
            this.items[i] = new BoolItem(baseImageName + i, names[i]);
        this.progress = 0;
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
            this.switchItem(this.progress);
        }
        else 
            this.reset();
    }
    decrease() {
        if (this.progress > 0) {
            this.switchItem(this.progress);
            --this.progress;
        }       
        else 
            this.setProgressToMax();
    }
    reset() {
        this.progress = 0;
        for(let item of this.items)
            item.reset()
    }
    setProgressToMax() {
        this.progress = this.maxProgress;
        for(let item of this.items)
            item.obtain;
    }
}

class CountRequiredItem extends Item {
    constructor(imageName, maxCount, itemNames) {
        this.image = getImage(imageName);
        this.maxCount = maxCount;
        this.items = new Map();
        for (let [req, def] in Object.entries(itemNames)) {
            let name, itemImageName;
            // For items with different images
            if (typeof def === "string") {
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
    }
    getItemByReq(req) {
        return this.items.get(req);
    }
    getItemByItemIndex(index) {
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
var bombBag = new CountItem('Bomb Bag', 3)
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
]);
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
// Unseen Inventory
var shadowCrystal = new BoolItem("Shadow Crystal");
var coroKey = new BoolItem('Small KeyC', 'Faron Key');
var bulblinKey = new BoolItem('Small KeyB', 'Bulblin Camp Key');
var gateKey = new BoolItem('Small KeyG', 'Gate Keys');
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

var castleSK = new CountItem('Small Key', 3, 'Hyrule Castle Small Key');
var castleBK = new BoolItem("Boss Key", "Hyrule Castle Boss Key");



