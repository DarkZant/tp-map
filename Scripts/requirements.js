class Requirement {
    constructor(imageInfo, text, 
        condition=() => { return true; }
    ) {
        this.image = getIconImage(imageInfo);
        this.text = text;
        this.condition = condition;
    }
    static fromBoolItem(item) {
        return new Requirement(
            item.image, 
            item.name, 
            () => item.isObtained()
        );
    }
    static fromBoss(boss) {
        return new Requirement(
            boss.image,
            boss.name + " Defeated",
            () => boss.isObtained()
        );
    }
    static fromAlwaysMetBoolItem(item) {
        return new Requirement(
            item.image,
            item.name
        );
    }
    static fromCountItem(item, amount=1) {
        return new Requirement(
            item.image, 
            amount > 1 ? MultiItem.getNameFormat(item, amount) : item.name, 
            () => item.amountIsObtained(amount)
        );
    }
    // static fromFlag(flag) {
    //     return new Requirement(
    //         flag.getImage(),
    //         flag.name,
    //         () => flag.isSet()
    //     );
    // }
    // static fromUnsetFlag(flag, name=flag.name) {
    //     return new Requirement(
    //         flag.getImage(),
    //         name,
    //         () => !flag.isSet()
    //     );
    // }
    static fromCheckboxRandoSetting(randoSetting, enabled=true) {
        let condition = () => enabled ? randoSetting.isEnabled() : !randoSetting.isEnabled();
        return new Requirement(
            randoSetting.getImage(),
            randoSetting.getName() + (!enabled ? " Disabled" : ""),
            condition
        );
    }
    static fromSelectRandoSetting(randoSetting, value) {
        return new Requirement(
            randoSetting.getImage(),
            randoSetting.getName() + " is " + value,
            () => randoSetting.valueIsEqualTo(value)
        );
    }
    isMet() {
        if (Settings.TrackerLogic.isDisabled())
            return true;
        return this.condition();
    }
    copyConditionAndImageAndName(item) {
        return new Requirement(
            item.getImage(),
            item.getName(),
            this.condition
        )
    }
}

class FlagRequirement {
    constructor() { }
    initialize(flagName) {
        let flag = flags.get(flagName);
        this.image = flag.getImage();
        this.text = flag.getFlagName();
        this.condition = () => flag.isSet();
    }
    isMet() {
        if (Settings.FlagLogic.isDisabled())
            return true;
        return this.condition();
    }
    copyConditionWithImageAndName(image, name) {
        return new Requirement(
            image,
            name,
            () => this.isMet()
        );
    }
    copyWithItemImageAndName(item) {
        return new Requirement(
            item.getImage(),
            item.getName(),
            () => this.isMet()
        );
    }
}

class UnsetFlagRequirement extends FlagRequirement {
    constructor() { super(); }
    initialize(flagName) {
        let flag = flags.get(flagName.slice(0, -1)); // Remove the added "/"
        this.image = flag.getImage();
        this.text = flag.getFlagName() + " Not Set";
        this.condition = () => !flag.isSet();
    }
}

class DungeonProgressionItemRequirement {
    constructor(item, amount=1) {
        this.image = item.image;
        let itemIsBool = item instanceof BoolItem;
        if (itemIsBool) {
            this.text = item.name;
            this.condition = () => item.isObtained();
        }
        else {
            this.text = amount > 1 ? MultiItem.getNameFormat(item, amount) : item.name;
            this.condition = () => item.amountIsObtained(amount)
        }
    }
    isMet() {
        if (Settings.TrackerLogic.isDisabled() || Settings.KeyLogic.isEnabled())
            return true;
        return this.condition();
    }
}

class DungeonProgressionFlagRequirement extends FlagRequirement {
    constructor() { super(); }
    initialize(flagName) { super.initialize(flagName); }
    isMet() {
        if (Settings.FlagLogic.isDisabled() || Settings.KeyLogic.isEnabled())
            return true;
        return this.condition();
    }
}

class AndRequirements {
    constructor(...args) {
        if (args.length === 1 && Array.isArray(args[0])) {
            // If single argument (array) is passed
            this.requirements = args[0];
        } else {
            // If multiple arguments are passed
            this.requirements = args;
        }
    }
    isMet() {
        return verifyRequirements(this.requirements);
    }
    getRequirements() {
        return this.requirements;
    }
}

function verifyRequirements(requirements) {
    for (let req of requirements) {
        if (Array.isArray(req)) {
            if (!req.some(orReq => orReq.isMet()))
                return false;
            else 
                continue;
        }
        else if (!req.isMet())
            return false;
    }
    return true;
}

function verifySubmapRequirements(submap) {
    if (selectedGamemode === Gamemodes.Base) 
        return verifyRequirements(submap.baseReqs);
    return verifyRequirements(selectedGamemode === Gamemodes.Glitchless ? submap.randoReqs : submap.glitchedReqs)
}

function addRandoRequirements(submap, reqs) {
    if (submap.origRandoReqs === undefined) {
        submap.origRandoReqs = submap.randoReqs;
        submap.origGlitchedReqs = submap.glitchedReqs;
    }

    let glitchlessReqs = submap.origRandoReqs.slice();
    let glitchedReqs = submap.origGlitchedReqs.slice();
    
    glitchlessReqs.push(...reqs);
    glitchedReqs.push(...reqs);

    submap.randoReqs = glitchlessReqs;
    submap.glitchedReqs = glitchedReqs;
    
    submap.reloadMarker();
}

let clawshotReq = Requirement.fromBoolItem(clawshots.getItemByIndex(0));
let doubleClawshotReq = Requirement.fromBoolItem(clawshots.getItemByIndex(1));
let bombBagReq = Requirement.fromCountItem(bombBag);
let ballAndChainReq = Requirement.fromBoolItem(ballAndChain);
let ironBootsReq = Requirement.fromBoolItem(ironBoots);
let magicArmorReq = Requirement.fromBoolItem(magicArmor);
let zoraArmorReq = Requirement.fromBoolItem(zoraArmor);
let shadowCrystalReq = Requirement.fromBoolItem(shadowCrystal);
let spinnerReq = Requirement.fromBoolItem(spinner);
let boomerangReq = Requirement.fromBoolItem(boomerang);
let lanternReq = Requirement.fromBoolItem(lantern);
let slingshotReq = Requirement.fromBoolItem(slingshot);
let fishingRodReq = Requirement.fromBoolItem(fishingRods.getItemByIndex(0));
let coralEarringReq = Requirement.fromBoolItem(fishingRods.getItemByIndex(1));
let pastDomRodReq = Requirement.fromBoolItem(dominionRods.getItemByIndex(0));
let domRodReq = Requirement.fromBoolItem(dominionRods.getItemByIndex(1));
let woodenSwordReq = Requirement.fromBoolItem(swords.getItemByIndex(0));
let ordonSwordReq = Requirement.fromBoolItem(swords.getItemByIndex(1));
let masterSwordReq = Requirement.fromBoolItem(swords.getItemByIndex(2));
let lightMasterSwordReq = Requirement.fromBoolItem(swords.getItemByIndex(3));
let bowReq = Requirement.fromBoolItem(bow.getItemByIndex(0));
let invoiceReq = Requirement.fromBoolItem(invoice);
let woodenStatueReq = Requirement.fromBoolItem(woodenStatue);
let iliasCharmReq = Requirement.fromBoolItem(iliasCharm);
let horseCallReq = Requirement.fromBoolItem(horseCall);
let endingBlowReq = Requirement.fromBoolItem(hiddenSkills.getItemByReq(1));
let faronKeyReq = Requirement.fromBoolItem(faronKey);
let coroKeyReq = Requirement.fromBoolItem(coroKey);
let gateKeyReq = Requirement.fromBoolItem(gateKey);
let bulblinKeyReq = Requirement.fromBoolItem(bulblinKey);
let aurusMemoReq = Requirement.fromBoolItem(aurusMemo);
let asheisSketchReq = Requirement.fromBoolItem(asheisSketch);
let allFusedShadowsReq = Requirement.fromCountItem(fusedShadow, 3);
let completedMirrorReq = Requirement.fromCountItem(mirrorShard, 4);
let skybookReq = Requirement.fromBoolItem(skybook.getItemByReq(1));
let completedSkybookReq = Requirement.fromBoolItem(skybook.getItemByReq(7));
let woodenShieldReq = Requirement.fromBoolItem(woodenShields.getItemByIndex(0));

let boulderReq = [bombBagReq, ballAndChainReq];
let sinkReq = [ironBootsReq, magicArmorReq];
let webReq = [lanternReq, bombBagReq, ballAndChainReq];
let stalfosReq = boulderReq;

let diababaReq = Requirement.fromBoss(diababa);
let forest1SKReq = new DungeonProgressionItemRequirement(forestSK);
let forest2SKReq = new DungeonProgressionItemRequirement(forestSK, 2);
let forest3SKReq = new DungeonProgressionItemRequirement(forestSK, 3);
let forest4SKReq = new DungeonProgressionItemRequirement(forestSK, 4);
let forestBKReq = new DungeonProgressionItemRequirement(forestBK);

let fyrusReq = Requirement.fromBoss(fyrus);
let mines1SKReq = new DungeonProgressionItemRequirement(minesSK);
let mines2SKReq = new DungeonProgressionItemRequirement(minesSK, 2);
let mines3SKReq = new DungeonProgressionItemRequirement(minesSK, 3);
let dangoroReq = [woodenSwordReq, ballAndChainReq, bombBagReq];
let minesBKReq = new DungeonProgressionItemRequirement(minesBK.getItemByReq(3));

let morpheelReq = Requirement.fromBoss(morpheel);
let lakebed1SKReq = new DungeonProgressionItemRequirement(lakebedSK);
let lakebed2SKReq = new DungeonProgressionItemRequirement(lakebedSK, 2);
let lakebed3SKReq = new DungeonProgressionItemRequirement(lakebedSK, 3);
let lakebedBKReq = new DungeonProgressionItemRequirement(lakebedBK);

let stallordReq = Requirement.fromBoss(stallord);
let arbiter1SKReq = new DungeonProgressionItemRequirement(arbiterSK);
let arbiter2SKReq = new DungeonProgressionItemRequirement(arbiterSK, 2);
let arbiter3SKReq = new DungeonProgressionItemRequirement(arbiterSK, 3);
let arbiter4SKReq = new DungeonProgressionItemRequirement(arbiterSK, 4);
let arbiter5SKReq = new DungeonProgressionItemRequirement(arbiterSK, 5);
let arbiterBKReq = new DungeonProgressionItemRequirement(arbiterBK);

let blizzetaReq = Requirement.fromBoss(blizzeta);
let snowpeak1SKReq = new DungeonProgressionItemRequirement(snowpeakSK);
let snowpeak2SKReq = new DungeonProgressionItemRequirement(snowpeakSK, 2);
let snowpeak3SKReq = new DungeonProgressionItemRequirement(snowpeakSK, 3);
let snowpeak4SKReq = new DungeonProgressionItemRequirement(snowpeakSK, 4);
let bedroomKeyReq = new DungeonProgressionItemRequirement(snowpeakBK);
let pumpkinReq = new DungeonProgressionItemRequirement(pumpkin);
let cheeseReq = new DungeonProgressionItemRequirement(cheese);

let armogohmaReq = Requirement.fromBoss(armogohma);
let temple1SKReq = new DungeonProgressionItemRequirement(templeSK);
let temple2SKReq = new DungeonProgressionItemRequirement(templeSK, 2);
let temple3SKReq = new DungeonProgressionItemRequirement(templeSK, 3);
let templeBKReq = new DungeonProgressionItemRequirement(templeBK);

let argorokReq = Requirement.fromBoss(argorok);
let city1SKReq = new DungeonProgressionItemRequirement(citySK);
let cityBKReq = new DungeonProgressionItemRequirement(cityBK);

let zantReq = Requirement.fromBoss(zant);
let palace1SKReq = new DungeonProgressionItemRequirement(palaceSK);
let palace2SKReq = new DungeonProgressionItemRequirement(palaceSK, 2);
let palace3SKReq = new DungeonProgressionItemRequirement(palaceSK, 3);
let palace4SKReq = new DungeonProgressionItemRequirement(palaceSK, 4);
let palace5SKReq = new DungeonProgressionItemRequirement(palaceSK, 5);
let palace6SKReq = new DungeonProgressionItemRequirement(palaceSK, 6);
let palace7SKReq = new DungeonProgressionItemRequirement(palaceSK, 7);
let palaceBKReq = new DungeonProgressionItemRequirement(palaceBK);

let castle1SKReq = new DungeonProgressionItemRequirement(castleSK);
let castle2SKReq = new DungeonProgressionItemRequirement(castleSK, 2);
let castle3SKReq = new DungeonProgressionItemRequirement(castleSK, 3);
let castleBKReq = new DungeonProgressionItemRequirement(castleBK);

let allDungeonsReq = [
    diababaReq, fyrusReq, morpheelReq, stallordReq, blizzetaReq, armogohmaReq, argorokReq, zantReq
];

let reekfishScentReq = Requirement.fromBoolItem(scents.getItemByName("Reekfish Scent"));
let medicineScentReq = Requirement.fromBoolItem(scents.getItemByName("Medicine Scent"));
let nightReq = new Requirement('Moon', 'Night Time');

let prologueNotSkippedReq = Requirement.fromCheckboxRandoSetting(RandoSettings.SkipPrologue, false);
let openMapReq = Requirement.fromCheckboxRandoSetting(RandoSettings.UnlockMapRegions);
let openWoodsReq = Requirement.fromSelectRandoSetting(RandoSettings.FaronWoodsLogic, 'Open');
let walletCapacityReq = Requirement.fromCheckboxRandoSetting(RandoSettings.WalletCapacity);
let lakebedBombsReq = Requirement.fromCheckboxRandoSetting(RandoSettings.LakebedBombs);
let snowpeakScentReq = Requirement.fromCheckboxRandoSetting(RandoSettings.SnowpeakReekfish);
let doorOfTimeReq = Requirement.fromCheckboxRandoSetting(RandoSettings.OpenDoT);
let openMinesReq = Requirement.fromSelectRandoSetting(RandoSettings.MinesEntrance, 'Open');
let arbitersCampReq = Requirement.fromCheckboxRandoSetting(RandoSettings.ArbitersCamp);
let openSacredGroveReq = Requirement.fromSelectRandoSetting(RandoSettings.TempleTime, 'Open Grove');
let openToTReq = Requirement.fromSelectRandoSetting(RandoSettings.TempleTime, 'Open');
let openCityReq = Requirement.fromCheckboxRandoSetting(RandoSettings.CitySkybook);
let transformAnywhereReq = Requirement.fromCheckboxRandoSetting(RandoSettings.TransformAnywhere);


const FlagRequirements = new Map();

function createNewFlagReq(key, metWhenSet) {
    let flagReq = metWhenSet ? new FlagRequirement() : new UnsetFlagRequirement();
    FlagRequirements.set(key, flagReq);
    return flagReq;
}

function getFlagReq(flagName, metWhenSet=true) {
    // Use this when creating requirements for flags in flags.js
    let key = metWhenSet ? flagName : flagName + "/";
    let flagReq = FlagRequirements.get(key);
    if (flagReq === undefined)
        flagReq = createNewFlagReq(key, metWhenSet);
    return flagReq;
}

function getDungeonProgressionFlagReq(flagName) {
    let flagReq = FlagRequirements.get(flagName);
    if (flagReq === undefined) {
        flagReq = new DungeonProgressionFlagRequirement();
        FlagRequirements.set(flagName, flagReq);
    }
    return flagReq;
}

function flagReqExists(flagName) {
    return FlagRequirements.has(flagName) || FlagRequirements.has(flagName + "/");
}

function initializeFlagRequirements() {
    for (let [flagName, flagReq] of FlagRequirements.entries())
        flagReq.initialize(flagName);
}

let faronTwilightCleared = getFlagReq("Faron Twilight Cleared");
let eldinTwilightCleared = getFlagReq("Eldin Twilight Cleared");
let lanayruTwilightCleared = getFlagReq("Lanayru Twilight Cleared");
let faronTwilight = getFlagReq("Faron Twilight Cleared", false);
let eldinTwilight = getFlagReq("Eldin Twilight Cleared", false);
let lanayruTwilight = getFlagReq("Lanayru Twilight Cleared", false);

let firstGoatsReq = getFlagReq("Ordon First Goats Herding");
let ordonPortalReq = getFlagReq("Ordon Spring Portal");
let taloSavedReq = getFlagReq("Faron Woods Talo Saved");
let zeldaMetReq = getFlagReq("Met Zelda");
let zeldaNotMetReq = getFlagReq("Met Zelda", false);

let poleMonkeyReq = getDungeonProgressionFlagReq("Forest Temple Pole Monkey");
let hangingCageMonkeyReq = getDungeonProgressionFlagReq("Forest Temple Hanging Cage Monkey");
let monkeyUnderWebReq = getDungeonProgressionFlagReq("Forest Temple Monkey Under Web");
let monkeyBehindRocksReq = getDungeonProgressionFlagReq("Forest Temple Monkey Behind Rocks");
let monkeyWindmillReq = getDungeonProgressionFlagReq("Forest Temple Monkey Behind Windmill Gate");
let poleMonkeyLockReq = getDungeonProgressionFlagReq("Forest Temple Totem Pole Monkey Lock");
let forestBabaLockReq = getDungeonProgressionFlagReq("Forest Temple Big Baba Monkey Lock");
let forestTileWormLockReq = getDungeonProgressionFlagReq("Forest Temple Tile Worm Monkey Lock");
let forestBridgeLockReq = getDungeonProgressionFlagReq("Forest Temple Windless Bridge Lock");
let forestBossLockReq = getDungeonProgressionFlagReq("Forest Temple Boss Lock");

let gorgePortalReq = getFlagReq("Kakariko Gorge Portal");
let warpOutEldinTwilightReq = gorgePortalReq;
let eponaReq = getFlagReq("Retamed Epona");

let minesFirstLockReq = getDungeonProgressionFlagReq("Goron Mines First Floor Lock");
let minesSecondLockReq = getDungeonProgressionFlagReq("Goron Mines Double Beamos Lock");
let minesThirdLockReq = getDungeonProgressionFlagReq("Goron Mines Outside Lock");
let minesBossLockReq = getDungeonProgressionFlagReq("Goron Mines Boss Lock");

let lakebedFirstLockReq = getDungeonProgressionFlagReq("Lakebed Temple Main Room Lock");
let lakebedSecondLockReq = getDungeonProgressionFlagReq("Lakebed Temple East Water Supply Lock");
let lakebedThirdLockReq = getDungeonProgressionFlagReq("Lakebed Temple Before Deku Toad Lock");
let lakebedEastWaterReq = getDungeonProgressionFlagReq("Lakebed Temple East Water Supply");
let lakebedWestWaterReq = getDungeonProgressionFlagReq("Lakebed Temple West Water Supply");
let lakebedBossLockReq = getDungeonProgressionFlagReq("Lakebed Temple Boss Lock");

let arbitersFirstLockReq = getDungeonProgressionFlagReq("Arbiters Grounds Entrance Lock");
let arbitersSecondLockReq = getDungeonProgressionFlagReq("Arbiters Grounds East Turning Room Lock");
let arbitersThirdLockReq = getDungeonProgressionFlagReq("Arbiters Grounds East Upper Turnable Lock");
let arbitersFourthLockReq = getDungeonProgressionFlagReq("Arbiters Grounds Ghoul Rat Room Lock");
let poeGateReq = [getDungeonProgressionFlagReq("Arbiters Grounds Torch Room Poe"), getDungeonProgressionFlagReq("Arbiters Grounds East Turning Room Poe"), 
    getDungeonProgressionFlagReq("Arbiters Grounds Hidden Wall Poe"), getDungeonProgressionFlagReq("Arbiters Grounds West Poe")];
let arbitersFifthLockReq = getDungeonProgressionFlagReq("Arbiters Grounds North Turning Room Lock");
let arbitersBossLockReq = getDungeonProgressionFlagReq("Arbiters Grounds Boss Lock");

let ruinsCorridorLockReq = getDungeonProgressionFlagReq("Snowpeak Ruins East Corrider Lock");
let ruinsLobbyLockReq = getDungeonProgressionFlagReq("Snowpeak Ruins Lobby Lock");
let ruinsCourtyardLockReq = getDungeonProgressionFlagReq("Snowpeak Ruins Courtyard West Lock");
let ruinsIceRoomLockReq = getDungeonProgressionFlagReq("Snowpeak Ruins Ice Room Lock");
let ruinsBossLockReq = getDungeonProgressionFlagReq("Snowpeak Ruins Boss Lock");

let templeFirstLockReq = getDungeonProgressionFlagReq("Temple of Time Lobby Lock");
let templeSecondLockReq = getDungeonProgressionFlagReq("Temple of Time Second Staircase Lock");
let templeDarknutLockReq = getDungeonProgressionFlagReq("Temple of Time Darknut Lock");
let templeBossLockReq = getDungeonProgressionFlagReq("Temple of Time Boss Lock");

let cityFirstLockReq = getDungeonProgressionFlagReq("City in The Sky Lock");
let cityBossLockReq = getDungeonProgressionFlagReq("City in The Sky Boss Lock");

let palaceWestFirstLockReq = getDungeonProgressionFlagReq("Palace of Twilight West Wing First Lock");
let palaceWestSecondLockReq = getDungeonProgressionFlagReq("Palace of Twilight West Wing Second Lock");
let westSolReq = palaceWestSecondLockReq.copyConditionWithImageAndName(getIconImage("Sol"), "West Sol");
let palaceEastFirstLockReq = getDungeonProgressionFlagReq("Palace of Twilight East Wing First Lock");
let palaceEastSecondLockReq = getDungeonProgressionFlagReq("Palace of Twilight East Wing Second Lock");
let eastSolReq = palaceEastSecondLockReq.copyConditionWithImageAndName(getIconImage("Sol"), "East Sol");
let bothSolReq = getDungeonProgressionFlagReq("Palace of Twilight Collect Both Sols");
let palaceCentralFirstLockReq = getDungeonProgressionFlagReq("Palace of Twilight Central First Room Lock");
let palaceCentralSecondLockReq = getDungeonProgressionFlagReq("Palace of Twilight Central Outdoor Lock");
let palaceCentralThirdLockReq = getDungeonProgressionFlagReq("Palace of Twilight Before Zant Lock");
let palaceBossLockReq = getDungeonProgressionFlagReq("Palace of Twilight Boss Lock");

let castleFirstLockReq = getDungeonProgressionFlagReq("Hyrule Castle Outside Lock");
let castleSecondLockReq = getDungeonProgressionFlagReq('Hyrule Castle Balcony Lock');
let castleThirdLockReq = getDungeonProgressionFlagReq("Hyrule Castle Treasure Room Lock");
let castleBossLockReq = getDungeonProgressionFlagReq("Hyrule Castle Boss Lock");

let zoraIceReq = getFlagReq("Melted Zora's Domain Ice", false);
let meltedIceReq = getFlagReq("Melted Zora's Domain Ice");
let warpOutLanayruTwilightReq = getFlagReq("Zoras Domain Portal");
let gorgeEldinBoulderReq = getFlagReq("Kakariko Gorge Eldin Field Boulder");
let waterBombReq = zoraArmorReq.copyConditionAndImageAndName(waterBombs);
let midnasLamentReq = getFlagReq("Midna's Lament Completed");
let midnasLamentNotCompletedReq = getFlagReq("Midna's Lament Completed", false);

let snowpeakPortalReq = getFlagReq("Snowpeak Portal");
let snowpeakReq = [shadowCrystalReq, [reekfishScentReq, snowpeakPortalReq]];

let tileWormReq = [boomerangReq, ironBootsReq];
let groundsFirstRoomReq = [clawshotReq, shadowCrystalReq];
let goronMinesFirstRoomReq = [ironBootsReq, [shadowCrystalReq, woodenSwordReq, ballAndChainReq, bombBagReq]] // TODO Test spinner on wooden barriers
let skullKidReq = [openMapReq, bowReq, new AndRequirements([boomerangReq, bombBagReq])];
let leaveFaronWoodsReq = [diababaReq, openWoodsReq];
let lanayruRandoReq = [...boulderReq, gateKeyReq, new AndRequirements([shadowCrystalReq, openMapReq]), getFlagReq("Kakariko Village Malo Mart Bridge Repaired")];
let forestTempleLeftSideReq = [webReq, [getFlagReq("Forest Temple Pole Monkey"), clawshotReq]];

