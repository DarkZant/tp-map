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
        LeafletMap.on('click', hideDetails);
        let detailsMenu = document.getElementById('flagDetails');
        if (detailsMenu.style.visibility === "visible")
            detailsMenu.targetedFlag.resetMarkerEvents();            
        else 
            detailsMenu.style.visibility = "visible";
        detailsMenu.targetedFlag = this;
        this.detailsOpened = true;
        detailsMenu.style.width = "24.4vw";
        setTimeout(function() {document.getElementById('flagDetailsX').style.visibility = "visible";}, 100);

        
    }
    resetMarkerEvents() {

    }
}

class Shop extends NonFlag {
    constructor(image, category, name=image, position=[]) {
        super(image, category, name, position);
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
        super.showDetails();
        
        document.getElementById("fishes").style.display = "inline";
        document.getElementById('fishesList').style.display = "block";
        let rdHtml = "";
        for (let fish of this.fishes) {
            let fishType = fish[0];
            let amount = fish[1];
            let fakeReq = {image: fishType.image, text: MultiItem.getNameFormat(fishType, amount)};
            rdHtml += '<div class="item bordered"><span>•</span>' + displayRequirement(fakeReq) + '</div>';
        }
        document.getElementById('fishesList').innerHTML = rdHtml;
    }
}

class MonsterRupees extends NonFlag {
    constructor(image, category, name=image, position=[]) {
        super(image, category, name, position);
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

function getFishObject(name) {
    return {name: name, image: getIconImage(name)}
}

const Fishes = Object.freeze({
    Greengill : getFishObject("Greengill"),
    Catfish: getFishObject("Ordon Catfish"),
    Reekfish: getFishObject("Reekfish"),
    Bass: getFishObject("Hyrule Bass"),
    Pike: getFishObject("Hylian Pike"),
    Loach: getFishObject("Hylian Loach"),
    Skullfish: getFishObject("Skullfish"),
    Bombfish: getFishObject("Bomb Fish")
});