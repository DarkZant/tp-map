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
    [RandoOutsideDungeonString.Forest, Dungeons.Forest],
    ["Forest Temple Entrance", Dungeons.Forest],
    // Goron Mines
    [RandoOutsideDungeonString.Mines, Dungeons.Mines],
    ["Goron Mines Entrance", Dungeons.Mines],
    // Lakebed Temple
    [RandoOutsideDungeonString.Lakebed, Dungeons.Lakebed],
    ["Lakebed Temple Entrance", Dungeons.Lakebed],
    // Arbiter's Grounds
    [RandoOutsideDungeonString.Grounds, Dungeons.Grounds],
    ["Arbiters Grounds Entrance", Dungeons.Grounds],
    // Snowpeak Ruins
    [RandoOutsideDungeonString.SnowpeakLeft, Dungeons.Snowpeak],
    [RandoOutsideDungeonString.SnowpeakRight, Dungeons.Snowpeak],
    ["Snowpeak Ruins Left Door", Dungeons.Snowpeak],
    ["Snowpeak Ruins Right Door", Dungeons.Snowpeak],
    // Temple of Time
    [RandoOutsideDungeonString.Time, Dungeons.Time],
    ["Temple of Time Entrance", Dungeons.Time],
    // City in the Sky
    [RandoOutsideDungeonString.City, Dungeons.City],
    ["City in The Sky Entrance", Dungeons.City],
    // Palace of Twilight
    [RandoOutsideDungeonString.Palace, Dungeons.Palace],
    ["Palace of Twilight Entrance", Dungeons.Palace],
    // Hyrule Castle
    [RandoOutsideDungeonString.Castle, Dungeons.Castle],
    ["Hyrule Castle Entrance", Dungeons.Castle],
]);

const RandoSettingsMap = new Map([
    ["skipPrologue", RandoSettings.SkipPrologue],
    ["faronTwilightCleared", RandoSettings.FaronTwilightCleared],
    ["eldinTwilightCleared", RandoSettings.EldinTwilightCleared],
    ["lanayruTwilightCleared", RandoSettings.LanayruTwilightCleared],
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
let spheresDetail = document.getElementById('spheresDetails');
let spheresList = document.getElementById("spheresList");


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
        let textResult = e.target.result;
        let data = JSON.parse(textResult);
        if (textResult === localStorage.getItem(spoilerLogStorageName)) { // TODO: Compare seed IDs instead
            dropZoneText.innerHTML = "<b>This seed is already loaded!</b>";
            setTimeout(() => {
                dropZoneText.innerHTML = "Loaded Seed:<br><b>" + data["playthroughName"] +"</b><br>Click or Drag to load another seed.";
            }, 2500)
            return;
        }
        resetRandoItems();
        resetRandoEntrances();
        try {
            loadSpoilerLog(data);
            localStorage.setItem(spoilerLogStorageName, textResult);
            resetSpoilingSettings();
        } 
        catch (error) {
            displayInvalidFile(file.name)
            console.log(error);
        }
        pushGAEvent('seed_import', {seed_id: data['meta']['seedId']});
    }

    reader.readAsText(file);
}

function resetSpoilingSettings() {
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
    loadSpoilerLog(JSON.parse(savedLog), true);
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

function populateSpheres(data) {
    spheresList.innerHTML = "";

    for (let [sphereIndex, sphere] of Object.entries(data['spheres'])) {
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
            
            let item = getRandoItem(itemName);
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

function loadSpoilerLog(data, start=false) {
    document.getElementById("loadedSeed").style.display = "flex";
    document.getElementById("Unload_Seed").style.display = "inline";

    let seedLink = document.getElementById("seedLink");
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
            console.log(itemName + " is not in RandoItemMap");
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
    found_progressive_items = new Map();
    for (let itemName of settings["startingItems"]) {
        let item = getRandoItem(itemName);
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

    // Setting Flags 
    if (RandoSettings.SkipPrologue.isEnabled()) {
        flags.get("Ordon Spring Portal").set();
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

    populateSpheres(data);
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
