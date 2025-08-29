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
    ["Goron_Mines_Small_Key", minesSK],
    ["Goron_Mines_Dungeon_Map", minesMap],
    ["Goron_Mines_Compass", minesCompass],
    ["Goron_Mines_Key_Shard", minesBK],
    ["Lakebed_Temple_Small_Key", lakebedSK],
    ["Lakebed_Temple_Dungeon_Map", lakebedMap],
    ["Lakebed_Temple_Compass", lakebedCompass],
    ["Lakebed_Temple_Big_Key", lakebedBK],
    ["Arbiters_Grounds_Small_Key", arbiterSK],
    ["Arbiters_Grounds_Dungeon_Map", arbiterMap],
    ["Arbiters_Grounds_Compass", arbiterCompass],
    ["Arbiters_Grounds_Big_Key", arbiterBK],
    ["Snowpeak_Ruins_Small_Key", snowpeakSK],
    ["Snowpeak_Ruins_Dungeon_Map", snowpeakMap],
    ["Snowpeak_Ruins_Ordon_Pumpkin", pumpkin],
    ["Snowpeak_Ruins_Ordon_Goat_Cheese", cheese],
    ["Snowpeak_Ruins_Compass", snowpeakCompass],
    ["Snowpeak_Ruins_Bedroom_Key", snowpeakBK],
    ["Temple_of_Time_Small_Key", templeSK],
    ["Temple_of_Time_Dungeon_Map", templeMap],
    ["Temple_of_Time_Compass", templeCompass],
    ["Temple_of_Time_Big_Key", templeBK],
    ["City_in_The_Sky_Small_Key", citySK],
    ["City_in_The_Sky_Dungeon_Map", cityMap],
    ["City_in_The_Sky_Compass", cityCompass],
    ["City_in_The_Sky_Big_Key", cityBK],
    ["Palace_of_Twilight_Small_Key", palaceSK],
    ["Palace_of_Twilight_Dungeon_Map", palaceMap],
    ["Palace_of_Twilight_Compass", palaceCompass],
    ["Palace_of_Twilight_Big_Key", palaceBK],
    ["Hyrule_Castle_Small_Key", castleSK],
    ["Hyrule_Castle_Dungeon_Map", castleMap],
    ["Hyrule_Castle_Compass", castleCompass],
    ["Hyrule_Castle_Big_Key", castleBK],

    ["North_Faron_Woods_Gate_Key", faronKey],
    ["Coro_Gate_Key", coroKey],
    ["Gerudo_Desert_Bulblin_Camp_Key", bulblinKey],
    ["Gate_Keys", gateKey],

    ["Foolish_Item", randoFoolishItem],

]);

const RandoSettingsMap = new Map([
    ["skipPrologue", RandoSettings.SkipPrologue],
    ["faronWoodsLogic", RandoSettings.FaronWoodsLogic],
    ["openMap", RandoSettings.UnlockMapRegions],
    ["openDot", RandoSettings.OpenDoT],
    ["increaseWallet", RandoSettings.WalletCapacity],
    ["skipLakebedEntrance", RandoSettings.LakebedBombs],
    ["skipArbitersEntrance", RandoSettings.ArbitersCamp],
    ["skipSnowpeakEntrance", RandoSettings.SnowpeakReekfish],
    ["totEntrance", RandoSettings.TempleTime],
    ["skipCityEntrance", RandoSettings.CitySkybook],
    ["transformAnywhere", RandoSettings.TransformAnywhere],
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

function displayInvalidFile(filename) {
    dropZoneText.innerHTML = filename + "<br>is not a valid spoiler log file!";
}

fileInput.addEventListener('change', (e) => {
    let files = e.target.files;
    manageFile(files[0]);
});

const spoilerLogStorageName = "spoilerLog";

function manageFile(file) {
    if (!file.name.toLowerCase().endsWith('.json')) {
        displayInvalidFile(file.name);
        return;
    }

    let reader = new FileReader();

    reader.onload = (e) => {
        try {
            let textResult = e.target.result;
            let data = JSON.parse(textResult)
            if (textResult === localStorage.getItem(spoilerLogStorageName)) {
                dropZoneText.innerHTML = "<b>This seed is already loaded!</b>";
                setTimeout(() => {
                    dropZoneText.innerHTML = "Loaded Seed:<br><b>" + data["playthroughName"] +"</b><br>Click or Drag to load another seed.";
                }, 2500)
                return;
            }
            resetRandoItems();
            loadSpoilerLog(data);
            localStorage.setItem(spoilerLogStorageName, textResult);
            Settings.RevealSetJunkFlags.reset();
            Settings.RevealSpoilerLog.reset();
        } 
        catch (error) {
            displayInvalidFile(file.name)
            console.log(error);
        }
    }

    reader.readAsText(file);
}

function checkRandoSeed() {
    let savedLog = localStorage.getItem(spoilerLogStorageName);
    if (!savedLog)
        return;
    loadSpoilerLog(JSON.parse(savedLog), true);
}

function resetRandoItems() {
    if (!seedIsLoaded)
        return;

    for (let flag of flags.values())
        flag.resetRandoItem();
}

function unloadSeed() {
    resetRandoItems();
    localStorage.removeItem(spoilerLogStorageName);
    seedIsLoaded = false;
    fileInput.value = '';
    reloadMap();

    
    dropZoneText.innerHTML = "Seed Unloaded!";
    document.getElementById("seedSettings").style.display = "none";
    document.getElementById("seedLink").style.display = "none";
    let unloadButton = document.getElementById("Unload_Seed");
    resetButtonText(unloadButton, "Unloading...");
    resetButtonsFeedback(unloadButton, "Seed Unloaded!");

    setTimeout(() => {
        unloadButton.style.display = "none";
        dropZoneText.innerHTML = "Import Seed Spoiler Log<br>Drag and drop a file<br><i>or</i><br>Click to select a file";
    }, 2000);
}


let seedIsLoaded = false;

function loadSpoilerLog(data, start=false) {
    document.getElementById("Unload_Seed").style.display = "inline";
    document.getElementById("seedSettings").style.display = "inline";

    let seedLink = document.getElementById("seedLink");
    seedLink.style.display = "flex";
    seedLink.href = "https://generator.tprandomizer.com/s/" + data['meta']['seedId'];

    let settings = data["settings"];

    // Set Rando Settings
    for (let [settingName, setting] of RandoSettingsMap.entries()) {
        setting.set(settings[settingName]);
    }
    addRandoRequirements(Dungeons.Castle, HyruleCastleRandoReqs.get(settings["castleRequirements"]));
    addRandoRequirements(Dungeons.Palace, PalaceOfTwilightRandoReqs.get(settings["palaceRequirements"]));

    // Display Required Dungeons
    for (let requiredElem of document.querySelectorAll(".tdungeon > span"))
        requiredElem.style.display = "none";

    for (let dungeonName of data["requiredDungeons"]) {
        let requiredElem = document.getElementById(dungeonName);
        if (window.getComputedStyle(requiredElem).display === 'none')
            requiredElem.style.display = 'inline';
    }

    // Set Flag Items
    for (let [flagName, itemName] of Object.entries(data["itemPlacements"])) {
        let item = getRandoItem(itemName);
        if (item === undefined) {
            console.log(itemName + " is not in RandoItemMap");
            continue;
        }
        flags.get(flagName).setRandoItem(item);
    }

    // Set Hints
    for (let [hintName, hintDescriptions] of Object.entries(data["hints"])) {
        let randoText = "";
        for (let description of hintDescriptions)
            randoText += description["text"].replace(/[{}]/g, '') + "<br><br>";
        flags.get(underscoreToSpace(hintName)).setRandoDescription(randoText);
    }

    dropZoneText.innerHTML = "Loaded Seed:<br><b>" + data["playthroughName"] +"</b><br>Click or Drag to load another seed.";
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
