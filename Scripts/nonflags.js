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
    // Map
    isShown() {
        return verifyCategoryVisibility(this.category);
    }
    isCountable() {
        return this.isShown() && Settings.CountNonFlags.isEnabled();
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
        addTooltipToMarker(this.marker, this.name);
    }
    loadMarker(position=this.position) {
        if (this.isShown())
            addMarkerToMap(this.marker, position);
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