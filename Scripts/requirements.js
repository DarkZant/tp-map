class Requirement {
    constructor(imageInfo, text, condition) {
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
    static fromCountItem(item, amount=1) {
        return new Requirement(
            item.image, 
            amount > 1 ? item.name + "&nbsp × &nbsp" + amount : item.name, 
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
    isMet() {
        return this.condition();
    }
}

class AndRequirements {
    constructor(requirements) {
        this.requirements = requirements;
    }
    isMet() {
        return verifyRequirements(this.requirements);
    }
}

function verifyRequirements(requirements) {
    for (let req of requirements) {
        if (req instanceof Requirement && !req.isMet())
            return false;
        else if (Array.isArray(req) && !req.some(orReq => orReq.isMet())) {
            return false;
        }
        else if (req instanceof AndRequirements && !req.isMet())
            return false
    }
    return true;
}

function verifySubmapRequirements(submap) {
    if (!Settings.TrackerLogic.isEnabled())
            return true;
    if (selectedGamemode === Gamemodes.Base) 
            return verifyRequirements(submap.baseReqs);
    return verifyRequirements(selectedGamemode === Gamemodes.Glitchless ? submap.randoReqs : submap.glitchedReqs)
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
let horseCallReq = Requirement.fromBoolItem(horseCall);
let endingBlowReq = Requirement.fromBoolItem(hiddenSkills.getItemByReq(1));
let bulblinKeyReq = Requirement.fromBoolItem(bulblinKey);
let aurusMemoReq = Requirement.fromBoolItem(aurusMemo);
let completedMirrorReq = Requirement.fromCountItem(mirrorShard, 4);
let completedSkybookReq = Requirement.fromBoolItem(skybook.getItemByReq(7));

let diababaReq = Requirement.fromBoolItem(diababa);
let forest1SKReq = Requirement.fromCountItem(forestSK);
let forestBKReq = Requirement.fromBoolItem(forestBK);
let fyrusReq = Requirement.fromBoolItem(fyrus);
let mines1SKReq = Requirement.fromCountItem(minesSK);
let mines2SKReq = Requirement.fromCountItem(minesSK, 2);
let mines3SKReq = Requirement.fromCountItem(minesSK, 3);
let dangoroReq = [woodenSwordReq, ballAndChainReq, bombBagReq];
let minesBKReq = Requirement.fromBoolItem(minesBK.getItemByReq(3));
let morpheelReq = Requirement.fromBoolItem(morpheel);
let lakebed1SKReq = Requirement.fromCountItem(lakebedSK);
let lakebed2SKReq = Requirement.fromCountItem(lakebedSK, 2);
let lakebed3SKReq = Requirement.fromCountItem(lakebedSK, 3);
let lakebedBKReq = Requirement.fromBoolItem(lakebedBK);
let stallordReq = Requirement.fromBoolItem(stallord);
let arbiter1SKReq = Requirement.fromCountItem(arbiterSK);
let arbiter2SKReq = Requirement.fromCountItem(arbiterSK, 2);
let arbiter3SKReq = Requirement.fromCountItem(arbiterSK, 3);
let arbiter4SKReq = Requirement.fromCountItem(arbiterSK, 4);
let arbiter5SKReq = Requirement.fromCountItem(arbiterSK, 5);
let arbiterBKReq = Requirement.fromBoolItem(arbiterBK);
let blizzetaReq = Requirement.fromBoolItem(blizzeta);
let snowpeak1SKReq = Requirement.fromCountItem(snowpeakSK);
let snowpeak2SKReq = Requirement.fromCountItem(snowpeakSK, 2);
let snowpeak3SKReq = Requirement.fromCountItem(snowpeakSK, 3);
let snowpeak4SKReq = Requirement.fromCountItem(snowpeakSK, 4);
let bedroomKeyReq = Requirement.fromBoolItem(snowpeakBK);
let pumpkinReq = Requirement.fromBoolItem(pumpkin);
let cheeseReq = Requirement.fromBoolItem(cheese);
let armogohmaReq = Requirement.fromBoolItem(armogohma);
let temple1SKReq = Requirement.fromCountItem(templeSK);
let temple2SKReq = Requirement.fromCountItem(templeSK, 2);
let temple3SKReq = Requirement.fromCountItem(templeSK, 3);
let templeBKReq = Requirement.fromBoolItem(templeBK);
let argorokReq = Requirement.fromBoolItem(argorok);
let city1SKReq = Requirement.fromCountItem(citySK);
let cityBKReq = Requirement.fromBoolItem(cityBK);
let zantReq = Requirement.fromBoolItem(zant);
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

let reekfishScentReq = Requirement.fromBoolItem(scents.getItemByName("Reekfish Scent"));
reekfishScentReq.condition = () => true; // To avoid items being hidden by scents
let medicineScentReq = Requirement.fromBoolItem(scents.getItemByName("Medicine Scent"));
medicineScentReq.condition = () => true; // To avoid items being hidden by scents
let nightReq = new Requirement('Moon', 'Night Time', () => true);
let randoSettingReq = new Requirement('Settings', 'Rando Setting', () => true) //TODO Apply rando setting requirements