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
    static fromFlag(flag) {
        return new Requirement(
            flag.getImage(),
            flag.name,
            () => flag.isSet()
        );
    }
    static fromUnsetFlag(flag, name=flag.name) {
        return new Requirement(
            flag.getImage(),
            name,
            () => !flag.isSet()
        );
    }
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
    constructor() {super(); }
    initialize(flagName) {
        let flag = flags.get(flagName.slice(0, -1)); // Remove the added "/"
        this.image = flag.getImage();
        this.text = flag.getFlagName() + " Not Set";
        this.condition = () => !flag.isSet();
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
    // debugger;
    if (!Settings.TrackerLogic.isEnabled())
        return true;
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
let forest1SKReq = Requirement.fromCountItem(forestSK);
let forest2SKReq = Requirement.fromCountItem(forestSK, 2);
let forest3SKReq = Requirement.fromCountItem(forestSK, 3);
let forest4SKReq = Requirement.fromCountItem(forestSK, 4);
let forestBKReq = Requirement.fromBoolItem(forestBK);
let forestTempleLeftSideReq = [webReq, [forest1SKReq, clawshotReq]];

let fyrusReq = Requirement.fromBoss(fyrus);
let mines1SKReq = Requirement.fromCountItem(minesSK);
let mines2SKReq = Requirement.fromCountItem(minesSK, 2);
let mines3SKReq = Requirement.fromCountItem(minesSK, 3);
let dangoroReq = [woodenSwordReq, ballAndChainReq, bombBagReq];
let minesBKReq = Requirement.fromBoolItem(minesBK.getItemByReq(3));
let morpheelReq = Requirement.fromBoss(morpheel);
let lakebed1SKReq = Requirement.fromCountItem(lakebedSK);
let lakebed2SKReq = Requirement.fromCountItem(lakebedSK, 2);
let lakebed3SKReq = Requirement.fromCountItem(lakebedSK, 3);
let lakebedBKReq = Requirement.fromBoolItem(lakebedBK);
let stallordReq = Requirement.fromBoss(stallord);
let arbiter1SKReq = Requirement.fromCountItem(arbiterSK);
let arbiter2SKReq = Requirement.fromCountItem(arbiterSK, 2);
let arbiter3SKReq = Requirement.fromCountItem(arbiterSK, 3);
let arbiter4SKReq = Requirement.fromCountItem(arbiterSK, 4);
let arbiter5SKReq = Requirement.fromCountItem(arbiterSK, 5);
let arbiterBKReq = Requirement.fromBoolItem(arbiterBK);
let blizzetaReq = Requirement.fromBoss(blizzeta);
let snowpeak1SKReq = Requirement.fromCountItem(snowpeakSK);
let snowpeak2SKReq = Requirement.fromCountItem(snowpeakSK, 2);
let snowpeak3SKReq = Requirement.fromCountItem(snowpeakSK, 3);
let snowpeak4SKReq = Requirement.fromCountItem(snowpeakSK, 4);
let bedroomKeyReq = Requirement.fromBoolItem(snowpeakBK);
let pumpkinReq = Requirement.fromBoolItem(pumpkin);
let cheeseReq = Requirement.fromBoolItem(cheese);
let armogohmaReq = Requirement.fromBoss(armogohma);
let temple1SKReq = Requirement.fromCountItem(templeSK);
let temple2SKReq = Requirement.fromCountItem(templeSK, 2);
let temple3SKReq = Requirement.fromCountItem(templeSK, 3);
let templeBKReq = Requirement.fromBoolItem(templeBK);
let argorokReq = Requirement.fromBoss(argorok);
let city1SKReq = Requirement.fromCountItem(citySK);
let cityBKReq = Requirement.fromBoolItem(cityBK);
let zantReq = Requirement.fromBoss(zant);
let palace1SKReq = Requirement.fromCountItem(palaceSK);
let palace2SKReq = Requirement.fromCountItem(palaceSK, 2);
let palace3SKReq = Requirement.fromCountItem(palaceSK, 3);
let palace4SKReq = Requirement.fromCountItem(palaceSK, 4);
let palace5SKReq = Requirement.fromCountItem(palaceSK, 5);
let palace6SKReq = Requirement.fromCountItem(palaceSK, 6);
let palace7SKReq = Requirement.fromCountItem(palaceSK, 7);
let palaceBKReq = Requirement.fromBoolItem(palaceBK);
let castle1SKReq = Requirement.fromCountItem(castleSK);
let castle2SKReq = Requirement.fromCountItem(castleSK, 2);
let castle3SKReq = Requirement.fromCountItem(castleSK, 3);
let castleBKReq = Requirement.fromBoolItem(castleBK);
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

function flagReqExists(flagName) {
    return FlagRequirements.has(flagName) || FlagRequirements.has(flagName + "/");
}

function initializeFlagRequirements() {
    for (let [flagName, flagReq] of FlagRequirements.entries())
        flagReq.initialize(flagName);
}

let tileWormReq = [boomerangReq, ironBootsReq];
let groundsFirstRoomReq = [clawshotReq, shadowCrystalReq];
let goronMinesFirstRoomReq = [ironBootsReq, [shadowCrystalReq, woodenSwordReq, ballAndChainReq, bombBagReq]] // TODO Test spinner on wooden barriers
let skullKidReq = [openMapReq, bowReq, new AndRequirements([ballAndChainReq, boomerangReq, bombBagReq])];
let leaveFaronWoodsReq = [diababaReq, openWoodsReq];
let lanayruRandoReq = [...boulderReq, gateKeyReq, new AndRequirements([shadowCrystalReq, openMapReq]), getFlagReq("Kakariko Village Malo Mart Bridge Repaired")];

