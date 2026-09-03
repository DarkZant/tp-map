class NonFlag {
    constructor(image, category, name=image, position=[]) {
        this.image = getIconImage(image);
        this.name = name;
        this.category = category;
        this.position = position;
        this.initializeMarker();
    }
    new(position) {
        return new NonFlag(this.image, this.category, this.name, position);
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
    // Map
    isShown() {
        return verifyCategoryVisibility(this.category);
    }
    isCounted() {
        return this.isShown() && Settings.CountNonFlags.isEnabled();
    }
    isCountable() {
        return this.isCounted();
    }
    countedInTotal() {
        return this.countsForTotal();
    }
    countsForTotal() {
        return false;
    }
    // Leaflet
    initializeMarker() {
        this.marker = L.marker(this.position, {
            icon: getIcon(this.image),
            riseOnHover: true, 
            riseOffset: 2000, 
            keyboard: false, 
            zIndexOffset: -1100
        });
        this.marker.on('click', () => this.showDetails());
        assignGAClickEventToMarker(this.marker);
    }
    loadMarker(position=this.position) {
        if (this.isShown())
            addMarkerToMap(this.marker, position);
    }
    showTooltip() {
        addTooltipToMarker(this.marker, this.name);
    }
    showDetails() {
        

        
    }
    resetMarkerEvents() {

    }
    hideDetails() {

    }
}

let soldOutImage = getIconImage("Sold Out");

class Buyable {
    constructor(item, price, oneTimeBuy, replacement=null) {
        this.item = item;
        this.price = price;
        this.oneTimeBuy = oneTimeBuy;
        this.replacement = replacement;
    }
    getHTML() {
        let html = "";
        html += '<div class="item bordered">';
        html += '<div class="shopDetailsItem">' + displayItem(this.item) + '</div>'
        html += '<div class="shopDetailsLower">';
        html += '<div class="shopDetailsType">' + (this.oneTimeBuy ? '<img src="Icons/One_Time.png">One Time Buy' : '<img src="Icons/Recurring.png">Recurring Buy') + '</div>'
        html += '<div class="shopDetailsPrice"><img src="Icons/Green_Rupee.png">&nbsp&nbsp×&nbsp&nbsp' + this.price + '</div>'
        html += '</div>';
        html += '</div>';
        return html;
    }
}

class Shop extends NonFlag {
    constructor(name, position, buyables, description) {
        super(soldOutImage, Categories.Shops, name, position);
        this.buyables = buyables;
        this.description = description;
    }
    static new(position, name, buyables, description) {
        return new Shop(name, position, buyables, description);
    }
    showDetails() {
        prepareDetails(this);
        
        document.getElementById("shopDetails").style.display = "inline";
        document.getElementById("shopName").innerHTML = this.name;
        document.getElementById("shopDescription").innerHTML = this.description;
        let rdHtml = '<span></span>';
        for (let buyable of this.buyables) {
            rdHtml += buyable.getHTML();
            let replacement = buyable.replacement;
            while (replacement !== null) {
                rdHtml += '<div class="shopDetailsReplace">Replaced By &darr;</div>'
                rdHtml += replacement.getHTML();
                replacement = replacement.replacement;
            }
            if (buyable !== this.buyables.at(-1))
                rdHtml += '<span></span>'
        }
        document.getElementById('shopDetailsList').innerHTML = rdHtml;
    }
    getByt
    hideDetails() {
        document.getElementById("shopDetails").style.display = "none";
    }

}

class FishingSpot extends NonFlag {
    constructor(image, position=[], fishes=[]) {
        super(image, Categories.Fishing, "Fishing Spot", position);
        this.fishes = fishes;
    }
    static new(position, fishes) {
        let image = fishes[0][0].image;
        return new FishingSpot(image, position, fishes);
    } 
    showDetails() {
        prepareDetails(this);
        
        document.getElementById("fishes").style.display = "inline";
        let rdHtml = "";
        for (let fish of this.fishes) {
            let fishType = fish[0];
            let amount = fish[1];
            let fakeReq = {image: fishType.image, text: MultiItem.getNameFormat(fishType, amount)};
            rdHtml += '<div class="item bordered"><span>•</span>' + displayRequirement(fakeReq) + '</div>';
        }
        document.getElementById('fishesList').innerHTML = rdHtml;
    }
    hideDetails() {
        document.getElementById("fishes").style.display = "none";
    }
}

class MonsterRupees extends NonFlag {
    constructor(image, position, rupee_amount, monsters) {
        super(image, Categories.MonsterRupee, "Enemy Group Rupees", position);
        this.rupees_item = new MultiItem(rupees, rupee_amount);
        this.monsters = monsters;
    }
    static new(position, rupee_amount, monsters) {
        let image = monsters[0][0].image;
        return new MonsterRupees(image, position, rupee_amount, monsters);
    }
    showDetails() {
        prepareDetails(this);
        
        document.getElementById("monsterGroup").style.display = "inline";
        document.getElementById("monsterGroupReward").innerHTML = displayItem(this.rupees_item);
        let rdHtml = "";
        for (let monster of this.monsters) {
            let monsterType = monster[0];
            let amount = monster[1];
            let fakeReq = {image: monsterType.image, text: MultiItem.getNameFormat(monsterType, amount)};
            rdHtml += '<div class="item bordered"><span>•</span>' + displayRequirement(fakeReq) + '</div>';
        }
        document.getElementById('monsters').innerHTML = rdHtml;
    }
    hideDetails() {
        document.getElementById("monsterGroup").style.display = "none";
    }
}

class Minigame extends NonFlag {
    constructor(image, category, name=image, position=[]) {
        super(image, category, name, position);
    }
}



let horseGrass = new NonFlag('Horse Grass', Categories.Grass);
let hawkGrass = new NonFlag('Hawk Grass', Categories.Grass);
let postman = new NonFlag('Postman', Categories.Postman);

// Bottled Items Enum
const Bottle = Object.freeze({
    BeeLarva : new NonFlag("BottleBee", Categories.Bottle, "Bee Larva"),
    Worm : new NonFlag("BottleWorm", Categories.Bottle, "Worm"),
    Oil : new NonFlag("BottleYellow", Categories.Bottle, "Lantern Oil"),
    HotSpringWater : new NonFlag("BottleWater", Categories.Bottle, "Hot Spring Water"),
    RedPotion : new NonFlag("BottleRed", Categories.Bottle, "Red Potion"),
    BluePotion : new NonFlag("BottleBlue", Categories.Bottle, "Blue Potion"),
    Fairy : new NonFlag('BottleFairy', Categories.Bottle, "Fairy"),
    Tears : new NonFlag('BottleTears', Categories.Bottle, "Great Fairy's Tears"),
    Milk : new NonFlag('BottleMilk', Categories.Bottle, 'Milk'),
    HalfMilk : new NonFlag('BottleMilkH', Categories.Bottle, "1/2 Milk"),
    Nasty : new NonFlag('BottleNasty', Categories.Bottle, 'Nasty Soup'),
    Soup : new NonFlag('BottleSoup', Categories.Bottle, "Superb Soup"),
    PurpleChu: new NonFlag('BottlePurple', Categories.Bottle,"Purple Chu Jelly"),
    RedChu : new NonFlag('BottleRed', Categories.Bottle, "Red Chu Jelly"),
    BlueChu : new NonFlag("BottleBlue", Categories.Bottle, "Blue Chu Jelly"),
    YellowChu : new NonFlag("BottleYellow", Categories.Bottle, "Yellow Chu Jelly"),
    RareChu : new NonFlag("BottleRare", Categories.Bottle, "Rare Chu Jelly"),
});

function getNameImageObject(name) {
    return {name: name, image: getIconImage(name)}
}

const Fishes = Object.freeze({
    Greengill : getNameImageObject("Greengill"),
    Catfish: getNameImageObject("Ordon Catfish"),
    Reekfish: getNameImageObject("Reekfish"),
    Bass: getNameImageObject("Hyrule Bass"),
    Pike: getNameImageObject("Hylian Pike"),
    Loach: getNameImageObject("Hylian Loach"),
    Skullfish: getNameImageObject("Skullfish"),
    Bombfish: getNameImageObject("Bomb Fish")
});

const Monsters = Object.freeze({
    Guay: getNameImageObject("Guay"),
    Keese: getNameImageObject("Keese"),
    DekuBaba: getNameImageObject("Deku Baba"),
    Skulltula: getNameImageObject("Skulltula"),
    Rat: getNameImageObject("Rat"),
});

let redPotion30 = new Buyable(Bottle.RedPotion, 30, false);
let woodenShield50 = new Buyable(woodenShields.getItemByIndex(1), 50, false);
let arrows10Rupees10 = new Buyable(new MultiItem(arrows, 10), 10, false);
let oil20 = new Buyable(Bottle.Oil, 20, false);

const Buyables = Object.freeze({
    RedPotionRupees30: redPotion30,
    RedPotionRupees40: new Buyable(Bottle.RedPotion, 40, false),
    RedPotionRupees3k: new Buyable(Bottle.RedPotion, 3_000, false),
    RedPotionRupees15: new Buyable(Bottle.RedPotion, 15, false),
    BluePotionRupees100: new Buyable(Bottle.BluePotion, 100, false),
    BluePotionRupees10k: new Buyable(Bottle.BluePotion, 10_000, false),
    BluePotionRupees50: new Buyable(Bottle.BluePotion, 50, false),
    LanternOilRupees20: oil20,
    LanternOilRupees30: new Buyable(Bottle.Oil, 30, false),
    CoroBottleRupees100: new Buyable(coroBottle, 100, true),
    MilkRupees10: new Buyable(Bottle.Milk, 10, false),
    MilkRupees20: new Buyable(Bottle.Milk, 20, false),
    BeeLarvaRupees10: new Buyable(Bottle.BeeLarva, 10, false),
    HotSpringWaterRupees20: new Buyable(Bottle.HotSpringWater, 20, false),
    Arrows10Rupees10: arrows10Rupees10,
    Arrows10Rupees2k: new Buyable(new MultiItem(arrows, 10), 2_000, false),
    Arrows10Rupees5: new Buyable(new MultiItem(arrows, 10), 5, false),
    Arrows30Rupees30: new Buyable(new MultiItem(arrows, 30), 30, false),
    Arrows30Rupees40: new Buyable(new MultiItem(arrows, 30), 40, false),
    Bombs10Rupees30: new Buyable(new MultiItem(bombs, 10), 30, false),
    Bombs20Rupees60: new Buyable(new MultiItem(bombs, 20), 60, false),
    Bombs30Rupees90: new Buyable(new MultiItem(bombs, 30), 90, false),
    Bombs30Rupees3k: new Buyable(new MultiItem(bombs, 30), 3_000, false),
    Bombs30Rupees45: new Buyable(new MultiItem(bombs, 30), 45, false),
    WaterBombs5Rupees30: new Buyable(new MultiItem(waterBombs, 5), 30, false),
    WaterBombs10Rupees60: new Buyable(new MultiItem(waterBombs, 10), 60, false),
    WaterBombs15Rupees90: new Buyable(new MultiItem(waterBombs, 15), 90, false),
    WaterBombs15Rupees6k: new Buyable(new MultiItem(waterBombs, 15), 6_000, false),
    WaterBombs15Rupees45: new Buyable(new MultiItem(waterBombs, 15), 45, false),
    Bomblings1Rupees6: new Buyable(new MultiItem(bomblings, 1), 6, false),
    Bomblings5Rupees30: new Buyable(new MultiItem(bomblings, 5), 30, false),
    Bomblings10Rupees60: new Buyable(new MultiItem(bomblings, 10), 60, false),
    Bomblings10Rupees9k: new Buyable(new MultiItem(bomblings, 10), 9_000, false),
    Bomblings10Rupees30: new Buyable(new MultiItem(bomblings, 10), 30, false),
    Slingshot: new Buyable(slingshot, 50, true, oil20),
    Hawkeye: new Buyable(hawkeye, 100, true, arrows10Rupees10),
    BombBag: new Buyable(bombBag, 120, true),
    HylianShield200: new Buyable(hylianShield, 200, true, redPotion30),
    HylianShield210: new Buyable(hylianShield, 210, true),
    WoodenShield: woodenShield50,
    MagicArmorRupees100k: new Buyable(magicArmor, 100_000, true),
    MagicArmorRupees598: new Buyable(magicArmor, 598, true),

});