const RandoItemMap = new Map([
    ["Progressive_Fishing_Rod", fishingRods],
    ["Slingshot", slingshot],
    ["Lantern", lantern],
    ["Boomerang", boomerang],
    ["Iron_Boots", ironBoots],
    ["Progressive_Bow", bow],
    ["Hawkeye", hawkeye],
    ["Filled_Bomb_Bag", bombBag],
    ["Giant_Bomb_Bag", giantBombBag],
    ["Progressive_Clawshot", clawshots],
    ["Aurus_Memo", aurusMemo],
    ["Spinner", spinner],
    ["Asheis_Sketch", asheisSketch],
    ["Ball_and_Chain", ballAndChain],
    ["Progressive_Dominion_Rod", dominionRods],
    ["Renados_Letter", renadosLetter],
    ["Invoice", invoice],
    ["Wooden_Statue", woodenStatue],
    ["Ilias_Charm", iliasCharm],
    ["Horse_Call", horseCall],
    ["Progressive_Sky_Book", skybook],
    ["Empty_Bottle", bottle],
    ["Sera_Bottle", seraBottle],
    ["Coro_Bottle", coroBottle],
    ["Jovani_Bottle", jovaniBottle],

    ["Shadow_Crystal", shadowCrystal],
    ['Progressive_Sword', swords],
    ["Ordon_Shield", woodenShields.getItemByIndex(0)],
    ["Wooden_Shield", woodenShields.getItemByIndex(1)],
    ["Hylian_Shield", hylianShield],
    ["Zora_Armor", zoraArmor],
    ["Magic_Armor", magicArmor],
    ["Progressive_Wallet", wallets],
    ["Progressive_Hidden_Skill", hiddenSkills],
    ["Poe_Soul", poeSoul],
    ["Piece_of_Heart", heartPiece],
    ["Heart_Container", heartContainer],
    ["Progressive_Fused_Shadow", fusedShadow],
    ["Progressive_Mirror_Shard", mirrorShard],

    ["Male_Ant", antM],
    ["Female_Ant", antF],
    ["Male_Dayfly", dayflyM],
    ["Female_Dayfly", dayflyF],
    ["Male_Beetle", beetleM],
    ["Female_Beetle", beetleF],
    ["Male_Mantis", mantisM],
    ["Female_Mantis", mantisF],
    ["Male_Stag_Beetle", stagBeetleM],
    ["Female_Stag_Beetle", stagBeetleF],
    ["Male_Pill_Bug", pillbugM],
    ["Female_Pill_Bug", pillbugF],
    ["Male_Butterfly", butterflyM],
    ["Female_Butterfly", butterflyF],
    ["Male_Ladybug", ladybugM],
    ["Female_Ladybug", ladybugF],
    ["Male_Snail", snailM],
    ["Female_Snail", snailF],
    ["Male_Phasmid", phasmidM],
    ["Female_Phasmid", phasmidF],
    ["Male_Grasshopper", grasshopperM],
    ["Female_Grasshopper", grasshopperF],
    ["Male_Dragonfly", dragonflyM],
    ["Female_Dragonfly", dragonflyF],

    ["Seeds", seeds],
    ["Arrows", arrows],
    ["Bombs", bombs],
    ['Water_Bombs', waterBombs],
    ['Bomblings', bomblings],
    ["Green_Rupee", Rupees.Green],
    ["Blue_Rupee", Rupees.Blue],
    ["Yellow_Rupee", Rupees.Yellow],
    ["Red_Rupee", Rupees.Red],
    ["Purple_Rupee", Rupees.Purple],
    ["Purple_Rupee_Links_House", Rupees.Purple],
    ["Orange_Rupee", Rupees.Orange],
    ["Silver_Rupee", Rupees.Silver],

    ["Forest_Temple_Small_Key", forestSK],
    ["Forest_Temple_Dungeon_Map", forestMap],
    ["Forest_Temple_Compass", forestCompass],
    ["Forest_Temple_Big_Key", forestBK],
    ["Diababa_Defeated", diababa],

    ["Goron_Mines_Small_Key", minesSK],
    ["Goron_Mines_Dungeon_Map", minesMap],
    ["Goron_Mines_Compass", minesCompass],
    ["Goron_Mines_Key_Shard", minesBK],
    ["Fyrus_Defeated", fyrus],

    ["Lakebed_Temple_Small_Key", lakebedSK],
    ["Lakebed_Temple_Dungeon_Map", lakebedMap],
    ["Lakebed_Temple_Compass", lakebedCompass],
    ["Lakebed_Temple_Big_Key", lakebedBK],
    ["Morpheel_Defeated", morpheel],

    ["Arbiters_Grounds_Small_Key", arbiterSK],
    ["Arbiters_Grounds_Dungeon_Map", arbiterMap],
    ["Arbiters_Grounds_Compass", arbiterCompass],
    ["Arbiters_Grounds_Big_Key", arbiterBK],
    ["Stallord_Defeated", stallord],

    ["Snowpeak_Ruins_Small_Key", snowpeakSK],
    ["Snowpeak_Ruins_Dungeon_Map", snowpeakMap],
    ["Snowpeak_Ruins_Ordon_Pumpkin", pumpkin],
    ["Snowpeak_Ruins_Ordon_Goat_Cheese", cheese],
    ["Snowpeak_Ruins_Compass", snowpeakCompass],
    ["Snowpeak_Ruins_Bedroom_Key", snowpeakBK],
    ["Blizzeta_Defeated", blizzeta],

    ["Temple_of_Time_Small_Key", templeSK],
    ["Temple_of_Time_Dungeon_Map", templeMap],
    ["Temple_of_Time_Compass", templeCompass],
    ["Temple_of_Time_Big_Key", templeBK],
    ["Armogohma_Defeated", armogohma],

    ["City_in_The_Sky_Small_Key", citySK],
    ["City_in_The_Sky_Dungeon_Map", cityMap],
    ["City_in_The_Sky_Compass", cityCompass],
    ["City_in_The_Sky_Big_Key", cityBK],
    ["Argorok_Defeated", argorok],

    ["Palace_of_Twilight_Small_Key", palaceSK],
    ["Palace_of_Twilight_Dungeon_Map", palaceMap],
    ["Palace_of_Twilight_Compass", palaceCompass],
    ["Palace_of_Twilight_Big_Key", palaceBK],
    ["Zant_Defeated", zant],

    ["Hyrule_Castle_Small_Key", castleSK],
    ["Hyrule_Castle_Dungeon_Map", castleMap],
    ["Hyrule_Castle_Compass", castleCompass],
    ["Hyrule_Castle_Big_Key", castleBK],
    ["Ganondorf_Defeated", ganondorf],

    ["North_Faron_Woods_Gate_Key", faronKey],
    ["Faron_Woods_Coro_Key", coroKey],
    ["Gerudo_Desert_Bulblin_Camp_Key", bulblinKey],
    ["Gate_Keys", gateKey],

    ["Bridge_of_Eldin_Portal", Portals.BridgeOfEldin],
    ["Castle_Town_Portal", Portals.CastleTown],
    ["Death_Mountain_Portal", Portals.DeathMountain],
    ["Gerudo_Desert_Portal", Portals.GerudoDesert],
    ["Kakariko_Gorge_Portal", Portals.KakarikoGorge],
    ["Kakariko_Village_Portal", Portals.KakarikoVillage],
    ["Lake_Hylia_Portal", Portals.LakeHylia],
    ["Mirror_Chamber_Portal", Portals.MirrorChamber],
    ["North_Faron_Portal", Portals.NorthFaron],
    ["Ordon_Spring_Portal", Portals.OrdonSpring],
    ["Sacred_Grove_Portal", Portals.SacredGrove],
    ["Snowpeak_Portal", Portals.Snowpeak],
    ["South_Faron_Portal", Portals.SouthFaron],
    ["Upper_Zoras_River_Portal", Portals.UpperZorasRiver],
    ["Zoras_Domain_Portal", Portals.ZorasDomain],

    ["Foolish_Item", randoFoolishItem],

    ["Red_Potion_Shop", Bottle.RedPotion],
    ["Lantern_Oil_Shop", Bottle.Oil],
    ["Fairy_Tears", Bottle.Tears],
    ["Vanilla", "Vanilla"],

    // Dusklight Rando Only for now
    ["Faron_Twilight_Tear", tearOfLight],
    ["Eldin_Twilight_Tear", tearOfLight],
    ["Lanayru_Twilight_Tear", tearOfLight],

    // Different spelling in Dusklight Rando
    ["City_in_the_Sky_Small_Key", citySK],
    ["City_in_the_Sky_Dungeon_Map", cityMap],
    ["City_in_the_Sky_Compass", cityCompass],
    ["City_in_the_Sky_Big_Key", cityBK],
    ["Game_Beatable", ganondorf],
    ["Ordon_Pumpkin", pumpkin],
    ["Ordon_Cheese", cheese],
    ["Gale_Boomerang", boomerang],
    ["Bomb_Bag", bombBag],
    ["Bottle_with_Half_Milk", seraBottle],
    ["Bottle_with_Lantern_Oil", coroBottle],
    ["Bottle_with_Great_Fairies_Tears", jovaniBottle],
]);

const AlternateDusklightFlagNames = new Map([
    // Warp Portals
    ["Bridge of Eldin Warp Portal", flags.get("Bridge of Eldin Portal")],
    ["Castle Town Warp Portal", flags.get("Castle Town Portal")],
    ["Death Mountain Warp Portal", flags.get("Death Mountain Portal")],
    ["Gerudo Desert Warp Portal", flags.get("Gerudo Desert Portal")],
    ["Kakariko Gorge Warp Portal", flags.get("Kakariko Gorge Portal")],
    ["Kakariko Village Warp Portal", flags.get("Kakariko Village Portal")],
    ["Lake Hylia Warp Portal", flags.get("Lake Hylia Portal")],
    ["Mirror Chamber Warp Portal", flags.get("Mirror Chamber Portal")],
    ["North Faron Warp Portal", flags.get("North Faron Portal")],
    ["Ordon Spring Warp Portal", flags.get("Ordon Spring Portal")],
    ["Sacred Grove Warp Portal", flags.get("Sacred Grove Portal")],
    ["Snowpeak Warp Portal", flags.get("Snowpeak Portal")],
    ["South Faron Warp Portal", flags.get("South Faron Portal")],
    ["Upper Zoras River Warp Portal", flags.get("Upper Zoras River Portal")],
    ["Zoras Domain Warp Portal", flags.get("Zoras Domain Portal")],
    // "City in (t)he Sky" (because it's "City in (T)he Sky" in the other rando)
    ["City in the Sky Aeralfos Chest", flags.get("City in The Sky Aeralfos Chest")],
    ["City in the Sky East Wing Lower Level Chest", flags.get("City in The Sky East Wing Lower Level Chest")],
    ["City in the Sky West Wing Baba Balcony Chest", flags.get("City in The Sky West Wing Baba Balcony Chest")],
    ["City in the Sky Underwater West Chest", flags.get("City in The Sky Underwater West Chest")],
    ["City in the Sky Underwater East Chest", flags.get("City in The Sky Underwater East Chest")],
    ["City in the Sky Ooccoo", flags.get("City in The Sky Ooccoo")],
    ["City in the Sky Lock", flags.get("City in The Sky Lock")],
    ["City in the Sky East First Wing Chest After Fans", flags.get("City in The Sky East First Wing Chest After Fans")],
    ["City in the Sky East Tile Worm Small Chest", flags.get("City in The Sky East Tile Worm Small Chest")],
    ["City in the Sky West Wing First Chest", flags.get("City in The Sky West Wing First Chest")],
    ["City in the Sky West Wing Narrow Ledge Chest", flags.get("City in The Sky West Wing Narrow Ledge Chest")],
    ["City in the Sky West Wing Tile Worm Chest", flags.get("City in The Sky West Wing Tile Worm Chest")],
    ["City in the Sky Chest Behind North Fan", flags.get("City in The Sky Chest Behind North Fan")],
    ["City in the Sky North Aeralfos Rupee", flags.get("City in The Sky North Aeralfos Rupee")],
    ["City in the Sky East Wing After Dinalfos Alcove Chest", flags.get("City in The Sky East Wing After Dinalfos Alcove Chest")],
    ["City in the Sky East Wing After Dinalfos Ledge Chest", flags.get("City in The Sky East Wing After Dinalfos Ledge Chest")],
    ["City in the Sky West Garden Lone Island Chest", flags.get("City in The Sky West Garden Lone Island Chest")],
    ["City in the Sky Garden Island Poe", flags.get("City in The Sky Garden Island Poe")],
    ["City in the Sky West Garden Lower Chest", flags.get("City in The Sky West Garden Lower Chest")],
    ["City in the Sky Baba Tower Alcove Chest", flags.get("City in The Sky Baba Tower Alcove Chest")],
    ["City in the Sky Baba Tower Narrow Ledge Chest", flags.get("City in The Sky Baba Tower Narrow Ledge Chest")],
    ["City in the Sky Chest Below Big Key Chest", flags.get("City in The Sky Chest Below Big Key Chest")],
    ["City in the Sky West Garden Corner Chest", flags.get("City in The Sky West Garden Corner Chest")],
    ["City in the Sky West Garden Ledge Chest", flags.get("City in The Sky West Garden Ledge Chest")],
    ["City in the Sky Baba Tower Top Small Chest", flags.get("City in The Sky Baba Tower Top Small Chest")],
    ["City in the Sky Central Outside Ledge Chest", flags.get("City in The Sky Central Outside Ledge Chest")],
    ["City in the Sky Central Outside Poe Island Chest", flags.get("City in The Sky Central Outside Poe Island Chest")],
    ["City in the Sky Big Key Chest", flags.get("City in The Sky Big Key Chest")],
    ["City in the Sky Poe Above Central Fan", flags.get("City in The Sky Poe Above Central Fan")],
    ["City in the Sky Boss Lock", flags.get("City in The Sky Boss Lock")],
    ["City in the Sky Argorok", flags.get("City in The Sky Argorok")],
    ["City in the Sky Argorok Heart Container", flags.get("City in The Sky Argorok Heart Container")],
    ["City in the Sky Dungeon Reward", flags.get("City in The Sky Dungeon Reward")],
    // Others
    ["Defeat Ganondorf", flags.get("Hyrule Castle Ganondorf")],
    ["Temple of Time Gilloutine Chest", flags.get("Temple of Time Guillotine Chest")],
    // Hints
    ["Castle Town Center Sign", flags.get("Castle Town Sign")],
    ["Fishing Hole Sign", flags.get("Upper Zoras River Sign")],
    ["Lake Hylia Bridge Sign", flags.get("Great Bridge of Hylia Sign")],
    ["North Eldin Field Sign", flags.get("North Eldin Sign")],
    ["Outside South Castle Town Sign", flags.get("South of Castle Town Sign")],
    ["Snowpeak Sign", flags.get("Snowpeak Mountain Sign")],
    ["South Faron Woods Sign", flags.get("Faron Woods Sign")],
    ["Temple of Time First Sign", flags.get("Temple of Time Sign")],
    ["Temple of Time Second Sign", flags.get("Temple of Time Beyond Point Sign")],
]);

const RandoOutsideDungeonString = Object.freeze({
    Forest: "North Faron Woods",
    Mines: "Death Mountain Sumo Hall Goron Mines Tunnel",
    Lakebed: "Lake Hylia Lakebed Temple Entrance",
    Grounds: "Outside Arbiters Grounds",
    SnowpeakLeft: "Snowpeak Summit Lower Left Door",
    SnowpeakRight: "Snowpeak Summit Lower Right Door",
    Time: "Sacred Grove Past Behind Window",
    City: "Lake Hylia",
    Palace: "Mirror Chamber Portal",
    Castle: "Castle Town North Inside Barrier",
});

const RandoDungeonEntrancesMap = new Map([
    // Forest Temple
    [Dungeons.Forest.name, Dungeons.Forest],
    [RandoOutsideDungeonString.Forest, Dungeons.Forest],
    ["Forest Temple Entrance", Dungeons.Forest],
    ["Forest Temple from Faron Woods", Dungeons.Forest],
    // Goron Mines
    [Dungeons.Mines.name, Dungeons.Mines],
    [RandoOutsideDungeonString.Mines, Dungeons.Mines],
    ["Goron Mines Entrance", Dungeons.Mines],
    ["Goron Mines from Death Mountain Sumo Hall", Dungeons.Mines],
    // Lakebed Temple
    [Dungeons.Lakebed.name, Dungeons.Lakebed],
    [RandoOutsideDungeonString.Lakebed, Dungeons.Lakebed],
    ["Lakebed Temple Entrance", Dungeons.Lakebed],
    ["Lakebed Temple from Lake Hylia", Dungeons.Lakebed],
    // Arbiter's Grounds
    ["Arbiters Grounds", Dungeons.Grounds],
    [RandoOutsideDungeonString.Grounds, Dungeons.Grounds],
    ["Arbiters Grounds Entrance", Dungeons.Grounds],
    ["Arbiters Grounds from Outside Arbiters Grounds", Dungeons.Grounds],
    // Snowpeak Ruins
    ["Snowpeak Ruins Door", Dungeons.Snowpeak],
    [RandoOutsideDungeonString.SnowpeakLeft, Dungeons.Snowpeak],
    [RandoOutsideDungeonString.SnowpeakRight, Dungeons.Snowpeak],
    ["Snowpeak Ruins Left Door", Dungeons.Snowpeak],
    ["Snowpeak Ruins Right Door", Dungeons.Snowpeak],
    ["Snowpeak Ruins Door from Outside Snowpeak Ruins", Dungeons.Snowpeak],
    // Temple of Time
    [Dungeons.Time.name, Dungeons.Time],
    [RandoOutsideDungeonString.Time, Dungeons.Time],
    ["Temple of Time Entrance", Dungeons.Time],
    ["Temple of Time from Sacred Grove Past", Dungeons.Time],
    // City in the Sky
    [Dungeons.City.name, Dungeons.City],
    [RandoOutsideDungeonString.City, Dungeons.City],
    ["City in The Sky Entrance", Dungeons.City],
    ["City in the Sky from Lake Hylia", Dungeons.City],
    // Palace of Twilight
    [Dungeons.Palace.name, Dungeons.Palace],
    [RandoOutsideDungeonString.Palace, Dungeons.Palace],
    ["Palace of Twilight Entrance", Dungeons.Palace],
    ["Palace of Twilight from Mirror Chamber", Dungeons.Palace],
    // Hyrule Castle
    [Dungeons.Castle.name, Dungeons.Castle],
    [RandoOutsideDungeonString.Castle, Dungeons.Castle],
    ["Hyrule Castle Entrance", Dungeons.Castle],
    ["Hyrule Castle from Castle Town", Dungeons.Castle],
]);

const RandoSettingsMap = new Map([
    ["skipPrologue", RandoSettings.SkipPrologue],
    ["skipMdh", RandoSettings.SkipMDH],
    ["faronTwilightCleared", RandoSettings.FaronTwilightCleared],
    ["eldinTwilightCleared", RandoSettings.EldinTwilightCleared],
    ["lanayruTwilightCleared", RandoSettings.LanayruTwilightCleared],
    ["faronWoodsLogic", RandoSettings.FaronWoodsLogic],
    ["openMap", RandoSettings.UnlockMapRegions],
    ["openDot", RandoSettings.OpenDoT],
    ["increaseWallet", RandoSettings.WalletCapacity],
    ["goronMinesEntrance", RandoSettings.MinesEntrance],
    ["skipLakebedEntrance", RandoSettings.LakebedBombs],
    ["skipArbitersEntrance", RandoSettings.ArbitersCamp],
    ["skipSnowpeakEntrance", RandoSettings.SnowpeakReekfish],
    ["totEntrance", RandoSettings.TempleTime],
    ["skipCityEntrance", RandoSettings.CitySkybook],
    ["transformAnywhere", RandoSettings.TransformAnywhere],
    ["shuffleShopItems", RandoSettings.ShuffleShopItems],
]);

const DusklightRandoSettingsMap = new Map([
    ["Skip Prologue", RandoSettings.SkipPrologue],
    ["Skip Midna's Desperate Hour", RandoSettings.SkipMDH],
    ["Faron Twilight Cleared", RandoSettings.FaronTwilightCleared],
    ["Eldin Twilight Cleared", RandoSettings.EldinTwilightCleared],
    ["Lanayru Twilight Cleared", RandoSettings.LanayruTwilightCleared],
    ["Faron Woods Logic", RandoSettings.FaronWoodsLogic],
    ["Unlock Map Regions", RandoSettings.UnlockMapRegions],
    ["Open Door of Time", RandoSettings.OpenDoT],
    ["Logic Increase Wallet Capacity", RandoSettings.WalletCapacity],
    ["Goron Mines Entrance", RandoSettings.MinesEntrance],
    ["Lakebed Does Not Require Water Bombs", RandoSettings.LakebedBombs],
    ["Arbiters Does Not Require Bulblin Camp", RandoSettings.ArbitersCamp],
    ["Snowpeak Does Not Require Reekfish Scent", RandoSettings.SnowpeakReekfish],
    ["Temple of Time Sword Requirement", RandoSettings.TempleTime],
    ["City Does Not Require Filled Skybook", RandoSettings.CitySkybook],
    ["Logic Transform Anywhere", RandoSettings.TransformAnywhere],
    ["Shop Items", RandoSettings.ShuffleShopItems],
]);

const RandoRequirementsMap = new Map([
    ["Open", []],
    ["Closed", [diababaReq]],
    ["Fused_Shadows", [allFusedShadowsReq]],
    ["Mirror_Shards", [completedMirrorReq]],
    ["All_Dungeons", allDungeonsReq],
]);

const HyruleCastleRandoReqs = new Map(RandoRequirementsMap);
HyruleCastleRandoReqs.set('Vanilla', [zantReq]);

const PalaceOfTwilightRandoReqs = new Map(RandoRequirementsMap);
PalaceOfTwilightRandoReqs.set('Vanilla', [argorokReq]);

function stringHasNumber(string) {
    return /\d/.test(string);
}

function getRandoItem(itemName) {
    if (stringHasNumber(itemName)) {
        let splitName = itemName.split("_");
        let amount = splitName[splitName.length - 1];
        itemName = splitName.slice(0, -1).join('_');
        return new MultiItem(RandoItemMap.get(itemName), amount);
    }   
    else 
        return RandoItemMap.get(itemName);
}

let dropZone = document.getElementById('randoSeedFile');
let dropZoneText = document.getElementById("randoSeedFileText");
let fileInput = document.getElementById('spoilerLog');
let spheresDetail = document.getElementById('spheresDetails');
let spheresList = document.getElementById("spheresList");
let seedLink = document.getElementById("seedLink");


dropZone.addEventListener('click', () => {
    fileInput.click();
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
  });
dropZone.addEventListener('dragend', (e) => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');

    let files = e.dataTransfer.files;
    manageFile(files[0]);
});

function displayInvalidFile(filename, additionalInfo="") {
    let currentText = dropZoneText.innerHTML;
    dropZoneText.innerHTML = filename + "<br>is not a valid spoiler log file!";
    let timeoutTime; 
    if (additionalInfo === "") {
        timeoutTime = 2000;
    } 
    else {
        dropZoneText.innerHTML += "<br><br><b>" + additionalInfo + "<b>";
        timeoutTime = 8000;
    }
    setTimeout(() => {
        dropZoneText.innerHTML = currentText;
    }, timeoutTime);
}

fileInput.addEventListener('change', (e) => {
    let files = e.target.files;
    manageFile(files[0]);
});

const spoilerLogStorageName = "spoilerLog";
const valid_file_extensions = [".json", ".txt"];

function manageFile(file) {
    let valid_file = false;
    let file_extension = file.name.toLowerCase();
    for (let ext of valid_file_extensions) {
        if (file_extension.endsWith(ext)) {
            valid_file = true;
            break;
        }
    }
    if (!valid_file) {
        displayInvalidFile(file.name);
        return;
    }

    let reader = new FileReader();

    reader.onload = (e) => {
        try {
            let textResult = e.target.result;
            let data;
            let isDusklightLog = file_extension.endsWith(".txt");
            if (file_extension.endsWith(".json"))
                data = JSON.parse(textResult);
            else if (isDusklightLog) {
                let seedVersion = textResult.split("\n")[0].split(": ")[1].split("-")[0];
                if (seedVersion < "v1.0.5") {
                    displayInvalidFile(file.name, "Dusklight Randomizer spoiler logs under v1.0.5 are not supported.");
                    return;
                }
                data = jsyaml.load(textResult);
            }
            if (textResult === localStorage.getItem(spoilerLogStorageName)) { // TODO: Compare seed IDs instead
                dropZoneText.innerHTML = "<b>This seed is already loaded!</b>";
                setTimeout(() => {
                    let dusklightText = isDusklightLog ? "Dusklight" : "";
                    let seedName = isDusklightLog ? data["Hash"] : data["playthroughName"];
                    dropZoneText.innerHTML = `Loaded ${dusklightText} Seed:<br><b>${seedName}</b><br>Click or Drag to load another seed.`;
                }, 2500)
                return;
            }
            resetRandoItems();
            resetRandoEntrances();
            if (isDusklightLog) {
                loadDusklightSpoilerLog(data);
                let seedId = "Seed" in data ? data["Seed"] : "Dusklight Seed";
                pushGAEvent("seed_import", {seed_id: seedId});
            }
            else {
                loadSpoilerLog(data);
                pushGAEvent('seed_import', {seed_id: data['meta']['seedId']});
            }
            localStorage.setItem(spoilerLogStorageName, textResult);
            resetSpoilingSettings();
        } 
        catch (error) {
            displayInvalidFile(file.name)
            console.log(error);
        }
    }

    reader.readAsText(file);
}

function resetSpoilingSettings() {
    Settings.RandoTracker.reset();
    Settings.RevealSetJunkFlags.reset();
    Settings.Entrances_Randomized.reset();
    Settings.RevealSpoilerLog.reset();
    spheresDetail.open = false; 
}
/**
 * Checks the seed on initial load
*/
function checkRandoSeed() {
    let savedLog = localStorage.getItem(spoilerLogStorageName);
    if (!savedLog)
        return;
    try {
        loadSpoilerLog(JSON.parse(savedLog), true);
    }
    catch (error) {  // Dusklight spoiler log
        loadDusklightSpoilerLog(jsyaml.load(savedLog), true);
    }
}

function resetRandoItems() {
    if (!seedIsLoaded)
        return;

    for (let flag of flags.values())
        flag.resetRandoItem();
}

function resetRandoEntrances() {
    for (let dungeon of Object.values(Dungeons)) {
        dungeon.resetRandoEntrance();
    }
    resetRandomEntrances();
}

function unloadSeed() {
    resetRandoItems();
    resetRandoEntrances();
    localStorage.removeItem(spoilerLogStorageName);
    seedIsLoaded = false;
    fileInput.value = '';
    resetSpoilingSettings();
    reloadMap();
    
    dropZoneText.innerHTML = "Seed Unloaded!";
    document.getElementById("loadedSeed").style.display = "none";
    let unloadButton = document.getElementById("Unload_Seed");
    resetButtonText(unloadButton, "Unloading...");
    resetButtonsFeedback(unloadButton, "Seed Unloaded!");

    setTimeout(() => {
        unloadButton.style.display = "none";
        dropZoneText.innerHTML = "Import Seed Spoiler Log<br>Drag and drop a file<br><i>or</i><br>Click to select a file";
    }, 2000);
}

let seedIsLoaded = false;

function populateSpheres(spheresData) {
    // Made by Copilot
    spheresList.innerHTML = "";

    for (let [sphereIndex, sphere] of Object.entries(spheresData)) {
        let sphereDetails = document.createElement("details");
        sphereDetails.className = "sphereDetails";
        let sphereSummary = document.createElement("summary");
        sphereSummary.textContent = sphereIndex;
        sphereDetails.appendChild(sphereSummary);

        let sphereContent = document.createElement("div");
        sphereContent.className = "sphereContent";

        for (let [flagName, itemName] of Object.entries(sphere)) {
            let sphereItem = document.createElement("div");
            sphereItem.className = "sphereItem";
            
            let item = getRandoItem(spaceToUnderscore(itemName));
            let iconPath = "Icons/ItemBox.png";
            let displayName = underscoreToSpace(itemName);
            if (item) {
                iconPath = item.getImage().src;
                displayName = item.getName();
            }

            sphereItem.innerHTML = `<img src="${iconPath}"><span>${flagName}: ${displayName}</span>`;
            sphereContent.appendChild(sphereItem);
        }
        sphereDetails.appendChild(sphereContent);
        spheresList.appendChild(sphereDetails);
    }
}


function setSettingsDependentFlags() {
    flags.get("Ordon Spring Portal").set();
    flags.get("Retamed Epona").set();
    if (RandoSettings.SkipPrologue.isEnabled()) {
        flags.get("Ordon First Goats Herding").set();
        flags.get("Faron Woods Talo Saved").set();
        flags.get("Met Zelda").set();
    }
    if (RandoSettings.SkipMDH.isEnabled()) {
        flags.get("Midna's Desperate Hour Completed").set();
    }
    if (RandoSettings.FaronTwilightCleared.isEnabled()) {
        flags.get("Faron Twilight Cleared").set();
        flags.get("South Faron Portal").set();
        flags.get("North Faron Portal").set();
    }
    if (RandoSettings.EldinTwilightCleared.isEnabled()) {
        flags.get("Eldin Twilight Cleared").set();
        flags.get("Kakariko Gorge Portal").set();
        flags.get("Kakariko Village Portal").set();
        flags.get("Death Mountain Portal").set();
        flags.get("Kakariko Gorge Youths Scent").set();
    }
    if (RandoSettings.LanayruTwilightCleared.isEnabled()) {
        flags.get("Lanayru Twilight Cleared").set();
        flags.get("Lake Hylia Portal").set();
        flags.get("Castle Town Portal").set();
        flags.get("Zoras Domain Portal").set();
        flags.get("Lanayru Field Scent of Ilia").set();
    }
    if (RandoSettings.ShuffleShopItems.isDisabled()) {
        flags.get("Castle Town Goron Shop Red Potion").set();
        // flags.get('Castle Town Goron Shop Hylian Shield').set();
        flags.get('Castle Town Goron Shop Lantern Oil').set();
        flags.get('Castle Town Goron Shop Arrow Refill').set();
        // Maybe Red Potion in Kakariko Malo Mart too?
    }
    agithaRewards.updateAllFlags();
}

function loadStartingItems(startingItems) {
    found_progressive_items = new Map();
    for (let itemName of startingItems) {
        let item = getRandoItem(spaceToUnderscore(itemName));
        if (!item) {
            console.log("Unknown item in startingItems:", itemName);
            continue;
        }
        if (item instanceof BoolItem && !item.isObtained()) {
            if (item.getName().includes("Portal")) { // Special case for portals since they're not tracked
                let flag = flags.get(Portals.getPortalFlagName(item));
                if (flag)
                    flag.set();
                continue;
            }
            let itemTracker = item.getTracker();
            if (itemTracker)
                itemTracker.increase();
            else
                item.obtain();
        }
        else if (item instanceof ProgressiveItem || item instanceof CountRequiredItem || item instanceof CountItem) {
            let currentCount = found_progressive_items.get(item) || 0;
            found_progressive_items.set(item, currentCount + 1);
        }
    }
    for (let [item, amount] of found_progressive_items) {
        if (item.getState() >= amount)
            continue;
        let itemTracker = item.getTracker();
        if (itemTracker) {
            while (item.getState() < amount)
                itemTracker.increase();
        }
        else 
            item.setState(amount);
    }
}

function loadSpoilerLog(data, start=false) {
    document.getElementById("loadedSeed").style.display = "flex";
    document.getElementById("Unload_Seed").style.display = "inline";

    seedLink.style.display = "flex";
    seedLink.href = "https://generator.tprandomizer.com/s/" + data['meta']['seedId'];

    let settings = data["settings"];

    // Set Rando Settings
    for (let [settingName, setting] of RandoSettingsMap.entries()) {
        setting.set(settings[settingName]);
    }
    let castleReqs = HyruleCastleRandoReqs.get(settings["castleRequirements"]);
    if (castleReqs !== undefined)
        addRandoRequirements(Dungeons.Castle, castleReqs);
    let palaceReqs = PalaceOfTwilightRandoReqs.get(settings["palaceRequirements"]);
    if (palaceReqs !== undefined)
        addRandoRequirements(Dungeons.Palace, palaceReqs);

    // Display Required Dungeons
    for (let requiredElem of document.querySelectorAll(".tdungeon > span"))
        requiredElem.style.display = "none";

    for (let dungeonName of data["requiredDungeons"]) {
        let requiredElem = document.getElementById(dungeonName);
        if (window.getComputedStyle(requiredElem).display === 'none')
            requiredElem.style.display = 'inline';
    }

    // Set Flags' Rando Items
    for (let [flagName, itemName] of Object.entries(data["itemPlacements"])) {
        let item = getRandoItem(itemName);
        let skipEntry = false;
        if (item === undefined) {
            console.log(flagName + ": " + itemName + " is not in RandoItemMap");
            skipEntry = true;
        }
        if (!flags.has(flagName)) {
            console.log(flagName + " is not in Flags");
            skipEntry = true;
        }
        if (skipEntry)
            continue;

        flags.get(flagName).setRandoItem(item);
    }

    // Set Hints' descriptions
    for (let [hintName, hintDescriptions] of Object.entries(data["hints"])) {
        if (hintName === "Midna")
            continue; 
        if (!flags.has(underscoreToSpace(hintName))) {
            console.log(hintName + " (hint) is not in Flags");
            continue;
        }
        let randoText = "";
        for (let description of hintDescriptions)
            randoText += description["text"].replace(/[{}]/g, '') + "<br><br>";
        let hintFlag = flags.get(underscoreToSpace(hintName));
        hintFlag.setRandoDescription(randoText);
    }


    // Increase Starting Items
    loadStartingItems(settings["startingItems"]);

    // Setting Flags 
    setSettingsDependentFlags();

    // Setting randomized dungeon entrances
    let shuffledEntrancesMap = new Map();
    for (let shuffledEntrance of data["shuffledEntrances"]) {
        let split = shuffledEntrance.split(' -> ');
        shuffledEntrancesMap.set(split[0], split[1]);
    }
    for (let outsideEntrance of Object.values(RandoOutsideDungeonString)) {
        let dungeonEntrance = RandoDungeonEntrancesMap.get(outsideEntrance);
        let enteredDungeon = RandoDungeonEntrancesMap.get(shuffledEntrancesMap.get(outsideEntrance));
        if (dungeonEntrance && enteredDungeon)
            dungeonEntrance.setRandoEntrance(enteredDungeon);
    }
    if (settings['unpairEntrances'] && shuffledEntrancesMap.get(RandoOutsideDungeonString.SnowpeakLeft) !== shuffledEntrancesMap.get(RandoOutsideDungeonString.Right)) {
        //TODO Unpaired entrances
    }

    dropZoneText.innerHTML = "Loaded Seed:<br><b>" + data["playthroughName"] +"</b><br>Click or Drag to load another seed.";
    let seedVersion = parseFloat(data["meta"]["imageVersion"]);
    let currentRandoVersion = 1.3;
    let mapIsOutdated = false;
    if (seedVersion > currentRandoVersion) 
        dropZoneText.innerHTML += "<br><br><b>Warning: The Development Version of the Randomizer is not fully supported and some things may not work as intended.</b>";
    else if (seedVersion == currentRandoVersion && mapIsOutdated)
        dropZoneText.innerHTML += `<br><br><b>Warning: The tracker is currently being updated to support the new features added in version ${currentRandoVersion} of the Randomizer, so some things may not work as intended.</b>`;

    populateSpheres(data["spheres"]);
    seedIsLoaded = true;
    
    // Update Gamemode
    if (selectedGamemode === Gamemodes.Base)
        return;
    blockMapReloading();
    if (selectedGamemode !== Gamemodes.Glitchless && settings["logicRules"] === "Glitchless")
        Settings.Gamemode.setValue(Gamemodes.Glitchless);
    else if (selectedGamemode === Gamemodes.Glitchless && settings["logicRules"] !== "Glitchless")
        Settings.Gamemode.setValue(Gamemodes.Glitched);
    if (!unblockMapReloading() && !start)
        reloadMap();
}

/** 
 * Doesn't add spaces at the start
*/
function addSpacesBeforeCapitalLetters(s) {
    return s.replace(/([A-Z])/g, ' $1').trim()
}
function removeWhitespaces(s) {
    return s.replace(/\s/g,'');
}
/**
 * Converts strings with spaces to PascalCase
 * @param {string} s 
 * @returns 
 */
function toPascalCase(s) {
  return s
    .replace(/\s/g, '_')
    .split('_')
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('');
}


function loadDusklightSpoilerLog(data, start=false) {
    console.log(data);
    document.getElementById("loadedSeed").style.display = "flex";
    document.getElementById("Unload_Seed").style.display = "inline";
    seedLink.style.display = "none";

    // Set Rando Settings
    for (let [settingName, setting] of DusklightRandoSettingsMap.entries()) {
        if (!(settingName in data))
            continue;
        let settingStrValue = data[settingName];
        let settingValue;
        if (setting instanceof CheckboxRandoSetting)
            settingValue = settingStrValue === "On";
        else 
            settingValue = settingStrValue;
        setting.set(settingValue);
    }
    // --- Really complicated because many options ---
    // let castleReqs = HyruleCastleRandoReqs.get(settings["castleRequirements"]);
    // if (castleReqs !== undefined)
    //     addRandoRequirements(Dungeons.Castle, castleReqs);
    // --- Gotta remap the options in PalaceOfTwilightRandoReqs ---
    // let palaceReqs = PalaceOfTwilightRandoReqs.get(settings["palaceRequirements"]);
    // if (palaceReqs !== undefined)
    //     addRandoRequirements(Dungeons.Palace, palaceReqs);

    // Display Required Dungeons
    for (let requiredElem of document.querySelectorAll(".tdungeon > span"))
        requiredElem.style.display = "none";

    if ("Required Dungeons" in data) {
        for (let dungeonName of data["Required Dungeons"]["World 1"]) {
            let formattedId = removeWhitespaces(toPascalCase(dungeonName));
            let requiredElem = document.getElementById(formattedId);
            if (window.getComputedStyle(requiredElem).display === 'none')
                requiredElem.style.display = 'inline';
        }
    }

    // Set Flags' Rando Items
    if ("All Locations" in data) {
        let randoItems = data["All Locations"]["World 1"]
        for (let [flagName, itemName] of Object.entries(randoItems)) {
            let underscoreName = spaceToUnderscore(itemName)
            let item = getRandoItem(underscoreName);
            let skipEntry = false;
            if (item === undefined) {
                console.log(flagName + ": " + underscoreName + " is not in RandoItemMap");
                skipEntry = true;
            }
            if (!flags.has(flagName)) {
                if (AlternateDusklightFlagNames.has(flagName)) {
                    AlternateDusklightFlagNames.get(flagName).setRandoItem(item);
                    continue;
                }
                console.log(flagName + " is not in Flags");
                skipEntry = true;
            }
            if (skipEntry)
                continue;
    
            flags.get(flagName).setRandoItem(item);
        }
    }

    // Set Hints' descriptions
    if ("Hints" in data) {
        let randoHints = data["Hints"]["World 1"];
        if ("Agitha's Castle Sign" in randoHints)
            flags.get("Agithas Castle Sign").setRandoDescription(randoHints["Agitha's Castle Sign"]);
        if ("Hint Signs" in randoHints) {
            let randoHintSigns = randoHints["Hint Signs"];
            for (let [hintName, hintDescription] of Object.entries(randoHintSigns)) {
                let formattedHintName = hintName.replace(" Hint ", " ");
                if (!flags.has(formattedHintName)) {
                    if (AlternateDusklightFlagNames.has(formattedHintName)) {
                        AlternateDusklightFlagNames.get(formattedHintName).setRandoDescription(hintDescription);
                        continue;
                    }
                    console.log(formattedHintName + " (hint) is not in Flags");
                    continue;
                }
                flags.get(formattedHintName).setRandoDescription(hintDescription);
            }
        }
    }

    // Increase Starting Items
    if ("All Starting Items" in data)
        loadStartingItems(data["All Starting Items"]["World 1"]);

    // Setting Flags 
    setSettingsDependentFlags();

    // Setting randomized dungeon entrances
    if ("All Entrances" in data && "Dungeon" in data["All Entrances"]["World 1"]) {
        let dungeonEntrances = data["All Entrances"]["World 1"]["Dungeon"];
        for (let [entrance, destination] of Object.entries(dungeonEntrances)) {
            entrance = entrance.split(" -> ")[1];
            let dungeonEntrance = RandoDungeonEntrancesMap.get(entrance);
            let enteredDungeon = RandoDungeonEntrancesMap.get(destination);
            if (dungeonEntrance && enteredDungeon)
                dungeonEntrance.setRandoEntrance(enteredDungeon);
        }
    }

    // Set version info
    let hash = "Hash" in data ? data["Hash"] : "Unknown Seed";
    dropZoneText.innerHTML = "Loaded Dusklight Seed:<br><b>" + hash +"</b><br>Click or Drag to load another seed.";
    if ("Dusklight Randomizer Version" in data) {
        let seedVersion = data["Dusklight Randomizer Version"]
        seedVersion = seedVersion.split("-")[0]
        let mapRandoVersion = "v1.0.5";
        if (seedVersion > mapRandoVersion) 
            dropZoneText.innerHTML += `<br><br><b>Warning: The tracker is currently being updated to support the new features added in ${seedVersion} of the Dusklight Randomizer, so some new randomizer features may not work as intended.</b>`;
    }

    if ("Playthrough" in data)
        populateSpheres(data["Playthrough"]);
    seedIsLoaded = true;
    
    // Update Gamemode
    if (selectedGamemode === Gamemodes.Base)
        return;
    if ("Logic Rules" in data) {
        let logicRules = data["Logic Rules"];
        blockMapReloading();
        if (selectedGamemode !== Gamemodes.Glitchless && logicRules === "All Locations Reachable")
            Settings.Gamemode.setValue(Gamemodes.Glitchless);
        else if (selectedGamemode === Gamemodes.Glitchless && logicRules !== "All Locations Reachable")
            Settings.Gamemode.setValue(Gamemodes.Glitched);
        if (!unblockMapReloading() && !start)
            reloadMap();
    }
}
