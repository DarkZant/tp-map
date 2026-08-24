const flags = new Map([
    // Ordon
    ['Uli Cradle Delivery', new Flag(fishingRods.getItemByIndex(0), [-9094, 4809], {
        baseReqs: [firstGoatsReq],
        baseDesc: 'Retrieve the cradle from the monkey using the hawk and deliver it to Uli to receive the fishing rod.',
        randoCategory: Categories.Gifts,
        randoReqs: [],
    })],
    ["Ordon Spring Golden Wolf", new Flag(goldenWolf, [-8542, 4795], {
        baseReqs: [getFlagReq("Death Mountain Howling Stone"), eldinTwilightCleared],
        baseDesc: 'Summoned by the Death Mountain howling stone.',
        randoReqs: [getFlagReq("Death Mountain Howling Stone")],
        randoDesc: 'Summoned by the Death Mountain howling stone. The item is lying on the ground where the Golden Wolf usually is.'
    })],
    ["Herding Goats Reward", new Flag(heartPiece, [-9514, 4964], {
        baseReqs: [eponaReq],
        baseDesc: 'After getting Epona back from the monsters, talk to Fado and complete the Goat Hoarding minigame in under 2 minutes to receive the heart piece.',
        randoCategory: Categories.Gifts,
        randoReqs: [zeldaMetReq],
        randoDesc: 'On Epona, talk to Fado and complete the Goat Hoarding minigame in under 2 minutes to receive the reward.'
    })],
    ["Ordon Hidden Rusl House Rupee", new Flag(Rupees.Orange, [-9058, 4788], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: "This orange rupee is hiding behind Rusl's house, use the boomerang or clawshot through the vines to obtain it.",
        randoCategory: Categories.FreestandingRupees,
    })],  
    ["Ordon Shield House Ledge Grass Rupee", new Flag(Rupees.Purple, [-9006, 4999], { 
        baseDesc: 'Hidden in the tall grass on the little platform to the left of the windmill. You can reach it by calling the hawk to get a Cucco and then flying to the platform.',
        randoCategory: Categories.FreestandingRupees,
        //randoReqs: [nightReq],
    })],
    ["Links Basement Chest", new Flag(chest.with(Rupees.Purple), [-8615, 5082], {
        baseReqs: [lanternReq],
        baseDesc: 'Use the lantern to locate the chest and be able to open it.'
    })],
    ["Wooden Sword Chest", new Flag(chest.with(swords.getItemByIndex(0)), [-8759, 5031], {
        baseReqs: [slingshotReq],
        baseDesc: 'The chest is available after buying the slingshot.',
        randoReqs: [],
        randoDesc: 'The chest is already present if the prologue is skipped'
    })],
    ["Sera Shop Slingshot", new Flag(slingshot, [-8790, 5034], {
        baseReqs: [fishingRodReq, Requirement.fromCountItem(rupees, 30)],
        baseDesc: "After saving Sera's Cat, you can buy the slingshot.",
        randoCategory: Categories.ShopItems,
        randoReqs: [Requirement.fromCountItem(rupees, 30)],
        randoDesc: "You can buy the item for 30 rupees."
    })],
    ["Ordon Cat Rescue", new Flag(seraBottle, [-8837, 4880], {
        baseReqs: [fishingRodReq],
        baseDesc: 'Obtain the bottle by talking to Sera after her cat has returned with a fish you gave him with the fishing rod.',
        randoCategory: Categories.Gifts
    })],
    ["Ordon Sword", new Flag(swords.getItemByIndex(1), [-9004, 4850], {
        baseReqs: [woodenShieldReq],
        baseDesc: 'Pick up the sword on the couch after entering by the side of the house by digging as Wolf Link.',
        randoReqs: [],
        randoDesc: 'Pick up the sword on the couch after entering the house.'
    })],
    ["Ordon Shield", new Flag(woodenShields.getItemByIndex(0), [-9044, 4410], {
        baseReqs: [zeldaMetReq],
        baseDesc: 'Use Midna to jump to the ledge where the shield is, then bonk on the wall twice to make it fall and obtain it.',
        randoReqs: [shadowCrystalReq]
    })],
    ["Wrestling With Bo", new Flag(chest.with(ironBoots), [-9339, 5044], {
        baseDesc: 'After clearing the Eldin Twilight, wrestle against Bo to obtain the Iron Boots.',
        baseReqs: [eponaReq],
        randoCategory: Categories.Gifts,
        randoReqs: [],
        randoDesc: "The chest is available when entering Bo's House."
    })],
    ["Ordon Ranch Grotto Lantern Chest", new Flag(chest.with(Rupees.Purple), [-9267, 4700], {
        baseReqs: [shadowCrystalReq, lanternReq],
        baseDesc: 'Light the 3 torches in front of the elevated platform to make the chest appear.',
    })],
    // Faron
    ["Coro Gate Key", new Flag(coroKey, [-7370, 4898], {
        baseReqs: [faronTwilightCleared],
        baseDesc: "Talk to Coro to obtain the key that opens the gate to the South Faron Cave.",
        randoCategory: Categories.Gifts,
        randoReqs: [],
        randoDesc: "Talk to Coro for a second time to obtain the item."
    })],
    ["Coro Lock", new Flag(faronBulblinLock, [-7496, 4787], {
        baseReqs: [faronTwilightCleared, coroKeyReq],
        baseDesc: "Unlock this gate with the key obtained from Coro to reach the mist area of the forest.",
        randoReqs: [coroKeyReq],
        randoDesc: "This gate is unlocked automatically upon obtaining Coro's key.",
    })],
    ["Faron Mist Lock", new Flag(faronBulblinLock, [-7343, 4351], {
        baseReqs: [faronKeyReq],
        baseDesc: "Unlock this gate to reach the north part of the Faron Woods.",
        randoDesc: "This gate is unlocked automatically upon obtaining the Faron Woods key.",
    })],
    ["Coro Lantern", new Flag(lantern, [-7405, 4910], {
        baseReqs: [firstGoatsReq],
        baseDesc: 'While chasing Talo and the monkey, talk to Coro to obtain the lantern.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Talk to Coro for the first time to obtain the item.'
    })],
    ["Faron Mist Cave Open Chest", new Flag(smallChest.with(faronKey), [-7023, 4805], {
        baseReqs: [lanternReq],
        baseDesc: 'Walk into the cave and open the small chest to obtain the key to the Faron Woods gate.',
        randoDesc: 'Walk into the cave and open the small chest to obtain the item.',
        randoReqs: [[lanternReq, prologueNotSkippedReq]]
    })],
    ["Faron Mist Cave Lantern Chest", new Flag(chest.with(heartPiece), [-7023, 4834], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches besides the small chest and climb the ledge to open the chest.'
    })],
    ["North Faron Woods Deku Baba Chest", new Flag(smallChest.with(Rupees.Yellow), [-7121, 4136], {
        baseReqs: [lanternReq],
        baseDesc: 'Defeat the Deku Baba and open the chest behind it.',
        randoReqs: [[lanternReq, shadowCrystalReq, prologueNotSkippedReq]],
    })],
    ["Coro Bottle", new Flag(coroBottle, [-7405, 4885], {
        baseReqs: [faronTwilightCleared, Requirement.fromCountItem(rupees, 100)],
        baseDesc: 'After clearing the Faron twilight, talk to Coro and he will offer you the oil bottle for 100 rupees.',
        randoCategory: Categories.Gifts,
        randoReqs: [Requirement.fromCountItem(rupees, 100)],
        randoDesc: 'Talk to Coro for a third time to buy the item for 100 rupees.'
    })],
    ["Faron Woods Golden Wolf", new Flag(goldenWolf, [-7104, 4184], {
        baseReqs: [faronTwilightCleared],
        baseDesc: 'Meet the Golden Wolf after clearing the Faron Twilight to learn the Ending Blow.',
        randoDesc: "The item is lying on the ground where the Golden Wolf usually is.",
        randoReqs: [zeldaMetReq, [lanternReq, shadowCrystalReq]],
    })],    
    ["Faron Mist Stump Chest", new Flag(smallChest.with(Rupees.Red), [-7235, 4518], {
        baseReqs: [faronTwilightCleared, lanternReq],
        baseDesc: 'Clear out the purple fog with the lantern and climb the tree stump to reach the chest.',
        randoCategory: Categories.Main,
        randoReqs: [zeldaMetReq, lanternReq],
    })],
    ["Faron Mist North Chest", new Flag(smallChest.with(Rupees.Yellow), [-7010, 4567], {
        baseReqs: [faronTwilightCleared, lanternReq],
        baseDesc: 'Clear out the purple fog with the lantern and go to the left of the cave entrance to find the chest.',
        randoCategory: Categories.Main,
        randoReqs: [zeldaMetReq, lanternReq],
    })],
    ["Faron Mist South Chest", new Flag(chest.with(Rupees.Purple), [-7351, 4513], {
        baseReqs: [faronTwilightCleared, lanternReq], 
        baseDesc: 'Clear out the purple fog with the lantern and from the exit of the mist, go right to find the chest.',
        randoCategory: Categories.Main,
        randoReqs: [zeldaMetReq, lanternReq],
    })],
    ["Faron Field Tree Heart Piece", new Flag(heartPiece, [-6278, 4930], {
        baseReqs: [diababaReq, [boomerangReq, clawshotReq]],
        baseDesc: 'The heart piece is on the leaves of a tree and can be grabbed with a long ranged item.',
        randoCategory: Categories.Main,
        randoReqs: [leaveFaronWoodsReq, [boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is on the leaves of a tree and can be grabbed with a long ranged item.'
    })],
    ["Faron Field Male Beetle", new Flag(beetleM, [-6344, 4764], {
        baseReqs: [diababaReq],
        baseDesc: 'This ♂ Beetle is on a tree trunk, simply pick it up.',
        randoReqs: [leaveFaronWoodsReq],
        randoDesc: "The item is on the ground near the tree where the beetle usually is.",
    })],
    ["Faron Field Female Beetle", new Flag(beetleF, [-5985, 5151], {
        baseReqs: [diababaReq, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Beetle is on an elevated tree trunk, use the boomerang or the clawshot to bring it closer.',
        randoReqs: [leaveFaronWoodsReq, [boomerangReq, clawshotReq]],
        randoDesc: 'The item is on an elevated tree trunk, use the boomerang or the clawshot to grab it.'
    })],
    ["Faron Mist Poe", new Flag(poeSoul, [-7184, 4515], {
        baseReqs: [faronTwilightCleared, [new AndRequirements(gorgePortalReq, eldinTwilight), new AndRequirements(warpOutLanayruTwilightReq, lanayruTwilight), midnasLamentReq]],
        baseDesc: 'Use Midna jumps to reach the tree base where the poe is.',
        randoReqs: [faronTwilightCleared, shadowCrystalReq],
    })], 
    ["Sacred Grove Pedestal Master Sword", new Flag(swords.getItemByIndex(2), [-6801, 3677], {
        baseReqs: [midnasLamentReq],
        baseDesc: 'After clearing the Lakebed Temple, go to the Sacred Grove and pull the Master Sword from its pedestal.',
        randoReqs: [shadowCrystalReq, skullKidReq],
        randoDesc: 'Press A on the Master Sword to obtain the item.'
    })],
    ["Sacred Grove Pedestal Shadow Crystal", new Flag(shadowCrystal, [-6850, 3677], {
        baseReqs: [midnasLamentReq],
        baseDesc: 'After clearing the Lakebed Temple, go to the Sacred Grove and pull the Master Sword from its pedestal to obtain the Shadow Crystal.',
        randoReqs: [shadowCrystalReq, skullKidReq],
        randoDesc: 'Press A on the Master Sword to obtain the item.'
    })],
    ["Sacred Grove Male Snail", new Flag(snailM, [-7184, 3722], {
        baseReqs: [shadowCrystalReq, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♂ Snail is on the ceiling of the alcove with the broken chest.',
        randoReqs: [shadowCrystalReq, [boomerangReq, clawshotReq, ballAndChainReq], skullKidReq],
        randoDesc: 'The item is on the ceiling of the alcove with the broken chest.' 
    })],
    ["Faron Field Bridge Chest", new Flag(chest.with(Rupees.Orange), [-6135, 4891], {
        baseReqs: [clawshotReq],
        baseDesc: 'The chest is under the bridge. Clawshot the target above the chest to reach it.',
        randoReqs: [leaveFaronWoodsReq, clawshotReq]
    })],
    ["Faron Field Poe", new Flag(nightPoe, [-5953, 4955], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'Above the flower patch on the elevated ledge.',
        randoReqs: [leaveFaronWoodsReq, midnasLamentReq, shadowCrystalReq, nightReq]
    })],
    ["Lost Woods Waterfall Poe", new Flag(nightPoe, [-7172, 3043], {
        baseReqs: [blizzetaReq, shadowCrystalReq, nightReq],
        baseDesc: 'Behind the waterfall, accessible while fighting Skull Kid for the second time.',
        randoReqs: [faronTwilightCleared, shadowCrystalReq, nightReq],
        randoDesc: 'Go behind the waterfall to access the poe',
    })],
    ["Lost Woods Lantern Chest", new Flag(chest.with(bombs, 30), [-6975, 3273], {
        baseReqs: [blizzetaReq, lanternReq],
        baseDesc: 'Light the 2 torches in the back of the area to make the chest appear.',
        randoReqs: [faronTwilightCleared, shadowCrystalReq, lanternReq]
    })],
    ["Lost Woods Boulder Poe", new Flag(poeSoul, [-7137, 3529], {
        baseReqs: [shadowCrystalReq, [ballAndChainReq, bombBagReq], skullKidReq],
        baseDesc: 'Destroy the rock above the grotto to make the poe appear.'
    })],
    ["Sacred Grove Spinner Chest", new Flag(chest.with(Rupees.Orange), [-7151, 3457], {
        baseReqs: [blizzetaReq, spinnerReq],
        baseDesc: 'From the top of the vines, ride the spinner tracks until you reach the chest.',
        randoReqs: [shadowCrystalReq, spinnerReq, skullKidReq]
    })],
    ["Sacred Grove Master Sword Poe", new Flag(nightPoe, [-6877, 3703], {
        baseReqs: [blizzetaReq, shadowCrystalReq, nightReq],
        baseDesc: 'After defeating Skull Kid for the 2nd time, you can find this poe in the bottom right of the Master Sword area.',
        randoDesc: 'You can find this poe in the bottom right of the Master Sword area.',
        randoReqs: [shadowCrystalReq, nightReq, skullKidReq],
    })],
    ["Faron Woods Owl Statue Sky Character", new Flag(skybookChar, [-7222, 4800], {
        baseReqs: [domRodReq, boulderReq],
        baseDesc: 'Destroy the boulder, then move the Owl Statue in the back to obtain the sky character.',
    })],
    ["Faron Woods Owl Statue Chest", new Flag(chest.with(heartPiece), [-7199, 4672], {
        baseReqs: [domRodReq, boulderReq, shadowCrystalReq],
        baseDesc: 'Put the Owl Statue in the hole next to the rock, then use Midna Jumps to reach the chest on the other side of the loading zone.'
    })],
    ["Faron Owl Statue Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 17), [-7307, 4866], {
        baseReqs: [boulderReq],
        baseDesc: 'Blocking the way to the Owl Statue. Gives 17 rupees.',
        randoCategory: Categories.NonChecks,
    })],
    ["South Faron Cave Chest", new Flag(smallChest.with(Rupees.Yellow), [-7340, 4450], {
        baseReqs: [lanternReq],
        baseDesc: 'Use the lantern to be able to locate the chest more easily.',
        randoReqs: [],
        randoDesc: 'The chest is located at the end of the tunnel',
    })],
    ["Faron Field Corner Grotto Rear Chest", new Flag(smallChest.with(Rupees.Yellow), [-6928, 5138], {
        baseDesc: 'Defeat all the enemies and cut the grass to make it easier to reach the chest.',
        randoReqs: [leaveFaronWoodsReq, shadowCrystalReq],
    })],
    ["Faron Field Corner Grotto Right Chest", new Flag(smallChest.with(Rupees.Red), [-6533, 5308], {
        baseDesc: 'Defeat all the enemies and cut the grass to make it easier to reach the chest.',
        randoReqs: [leaveFaronWoodsReq, shadowCrystalReq],
    })],
    ["Faron Field Corner Grotto Left Chest", new Flag(smallChest.with(Rupees.Red), [-6370, 5050], {
        baseDesc: 'Defeat all the enemies and cut the grass to make it easier to reach the chest.',
        randoReqs: [leaveFaronWoodsReq, shadowCrystalReq],
    })],
    ["Sacred Grove Baba Serpent Grotto Chest", new Flag(chest.with(heartPiece), [-6868, 3472], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'Defeat all the 8 Deku Serpents to make the chest appear.',
        randoReqs: [shadowCrystalReq, [boomerangReq, bowReq, clawshotReq]],
    })],
    ["Sacred Grove Female Snail", new Flag(snailF, [-7458, 3700], {
        baseReqs: [[boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Snail is too high to reach on the wall, use a long ranged item to make it come down.',
        randoReqs: [[masterSwordReq, openSacredGroveReq], [boomerangReq, clawshotReq], skullKidReq],
        randoDesc: 'The item is high up where the snail usually is, use a long ranged item to get it.'
    })],
    ["Sacred Grove Temple of Time Owl Statue Poe", new Flag(poeSoul, [-7470, 3618], {
        baseReqs: [pastDomRodReq, shadowCrystalReq],
        baseDesc: 'Move the Owl Statue to reveal the poe.',
        randoReqs: [[masterSwordReq, openSacredGroveReq], pastDomRodReq, shadowCrystalReq, skullKidReq]
    })],
    ["Sacred Grove Past Owl Statue Chest", new Flag(chest.with(heartPiece), [-7504, 3704], {
        baseReqs: [pastDomRodReq],
        baseDesc: 'Move the Owl Statue and go to the end of the tunnel behind it to reach the chest.',
        randoReqs: [[masterSwordReq, openSacredGroveReq], pastDomRodReq, skullKidReq]
    })],
    ["North Faron Woods Howling Stone", new Flag(howlingStone, [-7340, 4043], {
        baseReqs: [midnasLamentReq],
        baseDesc: 'Summons the South Castle Town Golden Wolf, accessible while on the way to the Master Sword.',
        randoReqs: [faronTwilightCleared, shadowCrystalReq]
    })],
    ["Faron Field Gate Lock", new Flag(gateLock, [-5825, 4324], {
        baseReqs: [gateKeyReq],
        baseDesc: "Unlock this gate during the escort quest to reach Faron Field.",
        randoDesc: "This gate unlocks automatically upon obtaining the gate keys, giving access to the Lanayru Province."
    })],
    // Eldin
    ["Kakariko Graveyard Lantern Chest", new Flag(chest.with(Rupees.Purple), [-5504, 8095], {
        baseReqs: [eldinTwilightCleared, lanternReq],
        baseDesc: 'Light the 2 torches to make it appear the chest appear.',
        randoReqs: [lanternReq],
    })],
    ["Kakariko Graveyard Male Ant", new Flag(antM, [-5448, 8123], {
        baseReqs: [eldinTwilightCleared],
        baseDesc: 'This ♂ Ant is at the base of the tree.',
        randoDesc: 'The item is on the ground where the bug usually is.'
    })],
    ["Eldin Field Male Grasshopper", new Flag(grasshopperM, [-4064, 6973], {
        baseReqs: [eponaReq],
        baseDesc: 'This ♂ Grasshopper is particulary hard to get. Use the boomerang or clawshot if necessary.',
        randoReqs: [eldinTwilightCleared],
        randoDesc: 'The item is on the ground where the bug usually is.',
    })],
    ["Eldin Field Female Grasshopper", new Flag(grasshopperF, [-3372, 5952], {
        baseReqs: [eponaReq],
        baseDesc: 'This ♀ Grasshopper is just lying on the ground.',
        randoReqs: [eldinTwilightCleared],
        randoDesc: 'The item is on the ground where the bug usually is.'
    })],
    ["Bridge of Eldin Male Phasmid", new Flag(phasmidM, [-3158, 7408], {
        baseReqs: [eponaReq, [boomerangReq, clawshotReq]],
        baseDesc: "This ♂ Phasmid is too high to reach, so you'll need to use the clawshot or the boomerang to make it come down.",
        randoReqs: [eldinTwilightCleared, [boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: "The item is where the bug usually is and is too high to reach.",
    })],
    ["Bridge of Eldin Female Phasmid", new Flag(phasmidF, [-2390, 7561], {
        baseReqs: [eponaReq, [boomerangReq, clawshotReq]],
        baseDesc: "This ♀ Phasmid is too high to reach, you can use the boomerang from down below to reach her, or climb the ledge using the clawshot target.",
        randoReqs: [eldinTwilightCleared, [boomerangReq, clawshotReq]],
        randoDesc: "The item is where the bug usually is and is too high to reach.",
    })],
    ["Kakariko Gorge Female Pill Bug", new Flag(pillbugF, [-5584, 6316], {
        baseReqs: [eldinTwilightCleared],
        baseDesc: 'This ♀ Pill Bug is hidden in the tall grass.',
        randoDesc: "The item is hidden in the tall grass"
    })],
    ["Kakariko Gorge Male Pill Bug", new Flag(pillbugM, [-5431, 6004], {
        baseReqs: [eldinTwilightCleared],
        baseDesc: 'This ♂ Pill Bug is just lying on the ground.',
        randoDesc: 'The item is hidden on the ground where the bug usually is.'
    })],
    ["Kakariko Gorge Spire Heart Piece", new Flag(heartPiece, [-5299, 5673], {
        baseReqs: [eldinTwilightCleared, [boomerangReq, clawshotReq]],
        baseDesc: 'The heart piece is sitting on top of the stone spire.',
        randoDesc: 'The item is sitting on top of the stone spire.',
        randoCategory: Categories.Main,
        randoReqs: [[boomerangReq, clawshotReq]],
    })],
    ["Kakariko Gorge Double Clawshot Chest", new Flag(chest.with(heartPiece), [-5263, 5626], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Use the target path and the vines to reach the chest.',
        glitchedReqs: [[doubleClawshotReq, boomerangReq]],
        glitchedDesc: 'Use the target path and the vines or use a LJA to reach the chest.'
    })],
    ["Talo Sharpshooting", new Flag(heartPiece, [-5130, 7593], {
        baseReqs: [bowReq, fyrusReq],
        baseDesc: 'After completing the Goron Mines, talk to Talo on top of the watchtower to play his minigame, then succeed to obtain the heart piece.',
        randoCategory: Categories.Gifts
    })],
    ["Kakariko Watchtower Alcove Chest", new Flag(chest.with(Rupees.Orange), [-5053, 7538], {
        baseReqs: [bombBagReq],
        baseDesc: "Blow up the rock south of the village near the spring, and use the chickens inside the cave (they are near the center of the village if "+
        "you reload the area) to:<br>1. Climb behind Malo Mart and make the jump to the inn<br>2. Climb on top of the inn and jump towards the top of Barnes' shop<br>" +
        "3. Climb to the base of the watchtower near the goron<br>" + 
        "4. Go to the left side of the watchtower, and jump towards the chest with the chicken.<br>The chest is above the path to Death Mountain.",
        randoReqs: [boulderReq],
    })],
    ["Eldin Spring Underwater Chest", new Flag(chest.with(heartPiece), [-5847, 7696], {
        baseReqs: [bombBagReq, ironBootsReq],
        baseDesc: 'Break the rock to enter the cave, then let yourself sink in the water at the end of the cave.',
        randoReqs: [boulderReq, ironBootsReq],
    })],
    ["Eldin Field Bomb Rock Chest", new Flag(chest.with(heartPiece), [-4399, 6674], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rocks at the bottom of the trail, then start climbing. Once you reach the vines with a rock on top, use a well timed bomb throw or ' +
                'the ball and chain to destroy the rock and jump to climb the vines. Finally, jump down a few times to reach the chest.'
    })],
    ["Rutelas Blessing", new Flag(zoraArmor, [-5474, 8273], {
        baseReqs: [gateKeyReq],
        baseDesc: 'Save Ralis and follow Rutella through the graveyard to obtain the Zora Armor.',
        randoCategory: Categories.Gifts
    })],
    ["Kakariko Village Bomb Shop Poe", new Flag(nightPoe, [-5228, 7767], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: "In the ruins of Barnes' old warehouse.",
        randoReqs: [eldinTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Kakariko Village Watchtower Poe", new Flag(nightPoe, [-5107, 7621], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: "At the base of the watchtower.",
        randoReqs: [eldinTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Kakariko Village Bomb Rock Spire Heart Piece", new Flag(heartPiece, [-5610, 7578], {
        baseReqs: [bombBagReq, boomerangReq],
        baseDesc: "Use the bomb arrows to blow up the rocks up on the ledge, then use the boomerang or the clawshot to obtain the heart piece.",
        randoCategory: Categories.Main,
        randoReqs: [bombBagReq, [boomerangReq, new AndRequirements([bowReq, clawshotReq])]],
    })],
    ["Kakariko Graveyard Open Poe", new Flag(nightPoe, [-5455, 8048], {
        baseReqs: [[new AndRequirements(lanayruTwilight, warpOutLanayruTwilightReq), midnasLamentReq], nightReq],
        baseDesc: "Near the graves.",
        randoReqs: [eldinTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Death Mountain Trail Poe", new Flag(nightPoe, [-4331, 8118], {
        baseReqs: [fyrusReq, shadowCrystalReq, nightReq],
        baseDesc: "Up on the ledge, use a goron or the clawshot to get up."
    })],
    ["Death Mountain Alcove Chest", new Flag(chest.with(heartPiece), [-4049, 8169], {
        baseReqs: [fyrusReq],
        baseDesc: 'Clawshot the vines hanging from the stone bridge or use the Goron to climb and jump down the alcove to the chest.',
        randoReqs: [[clawshotReq, fyrusReq]],
    })],
    ["Goron Springwater Rush", new Flag(heartPiece, [-3944, 5550], {
        baseReqs: [getFlagReq("Kakariko Village Malo Mart Bridge Repaired")],
        baseDesc: 'After repairing the bridge for 1000 rupees, talk to the Goron near the bridge then talk to Gor Liggs in front of the Malo Mart in Kakariko and bring the springwater to the dehydrated Goron.',
        randoCategory: Categories.Gifts,
        randoDesc: 'After repairing the bridge for 1000 rupees, talk to Gor Liggs in front of the Malo Mart in Kakariko and bring the springwater to the dehydrated Goron.',
    })],
    ["Kakariko Gorge Poe", new Flag(nightPoe, [-5347, 5978], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: "Behind the tree with the crows.",
        randoReqs: [midnasLamentReq, shadowCrystalReq, nightReq],
    })],
    ["Gift From Ralis", new Flag(coralEarring, [-5473, 8235], {
        baseReqs: [asheisSketchReq],
        baseDesc: 'Show the sketch to Ralis to obtain the coral earring.',
        randoCategory: Categories.Gifts,
        randoReqs: [gateKeyReq, asheisSketchReq],
        randoDesc: 'Show the sketch to Ralis to obtain the item.',
    })],
    ["Kakariko Graveyard Golden Wolf", new Flag(goldenWolf, [-5479, 8140], {
        baseReqs: [getFlagReq("Snowpeak Howling Stone")],
        baseDesc: 'Summoned by the Snowpeak Howling Stone.'
    })],
    ["Kakariko Graveyard Grave Poe", new Flag(nightPoe, [-5493, 7987], {
        baseReqs: [[new AndRequirements(lanayruTwilight, warpOutLanayruTwilightReq), midnasLamentReq], nightReq],
        baseDesc: 'Push the south-west grave to reveal the poe.',
        randoReqs: [eldinTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Ilia Charm", new Flag(iliasCharm, [-2155, 6620], {
        baseReqs: [woodenStatueReq, bowReq],
        baseDesc: 'Defeat all the Bulblins, then talk to Impaz in front of her house to receive the charm.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Defeat all the Bulblins, then talk to Impaz in front of her house to receive the charm. This check is never randomized.'
    })],
    ["Cats Hide and Seek Minigame", new Flag(heartPiece, [-2165, 6565], {
        baseReqs: [horseCallReq, shadowCrystalReq, clawshotReq],
        baseDesc: 'Start the Cat Seeking Minigame by talking to the Cucco Leader near the howling stone. ' +
                "Once you have spoken to all 20 cats, report back to the Cucco Leader to receive the heart piece in front of Impaz' House",
        randoCategory: Categories.Main,
        randoReqs: [getFlagReq("Ilia Memory Reward"), shadowCrystalReq, clawshotReq],
    })],
    ["Hidden Village Poe", new Flag(nightPoe, [-2018, 6535], {
        baseReqs: [horseCallReq, shadowCrystalReq, nightReq],
        baseDesc: 'On the balcony above the white piece of cloth.',
        randoReqs: [getFlagReq("Skybook From Impaz"), shadowCrystalReq, nightReq],
    })],
    ["Bridge of Eldin Owl Statue Sky Character", new Flag(skybookChar, [-2509, 7359], {
        baseReqs: [domRodReq],
        baseDesc: 'Climb up the ledge and move the Owl Statue to obtain the sky character.'
    })],
    ["Bridge of Eldin Owl Statue Chest", new Flag(chest.with(heartPiece), [-3133, 7298], {
        baseReqs: [domRodReq],
        baseDesc: 'Bring the Owl Statue from the other side of the bridge, then put it in the hole and use it as a platform to reach the ladder. Climb it and open the chest.'
    })],
    ["Kakariko Gorge Owl Statue Sky Character", new Flag(skybookChar, [-4850, 5983], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue to obtain the sky character.'
    })],
    ["Kakariko Gorge Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-4951, 5966], {
        baseReqs: [domRodReq],
        baseDesc: 'Use the Owl Statue as a platform for the first jump, then take control of it right after to set it up for the second jump. Once done, the chest is around the corner.'
    })],
    ["Kakariko Gorge Spire Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 21), [-5380, 5510], {
        baseReqs: [boulderReq],
        baseDesc: 'Blow up the rock with a bomb or hit it with the ball and chain to reveal 21 rupees.',
        randoCategory: Categories.HiddenRupees,
    })],
    ["Kakariko Gorge Owl Statue Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 30), [-5074, 5909], {
        baseReqs: [boulderReq],
        baseDesc: 'The rock is in the middle of the field.',
        randoCategory: Categories.HiddenRupees,
    })],
    ["Eldin Spring Underwater Boulder Rupee", new Flag(rupeeBoulder.with(Rupees.Purple), [-5840, 7667], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: 'The rock is underwater in front of the chest.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [bombBagReq, ironBootsReq],
    })],
    ["Death Mountain Trail Red Rupees", new UnsettableFlag(new MultiItem(Rupees.Red, 4), [-4269, 8150], {
        baseReqs: [[clawshotReq, fyrusReq]],
        baseDesc: 'There are 4 red rupees hidden under rocks near the Poe, for a total of 80 rupees. These respawn every time you go far from Death Mountain.',
    })],
    ["Kakariko Village Bell Rupee", new Flag(Rupees.Silver, [-5513, 7720], {
        baseReqs: [bombBagReq, bowReq],
        baseDesc: 'Climb up the sanctuary with Midna jumps or a Cucco, then shoot a bomb arrow at the bell to make the silver rupee drop.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [eldinTwilightCleared, bombBagReq, [bowReq, boomerangReq]],
    })],
    ["Kakariko Graveyard Underwater Boulder Rupee", new Flag(rupeeBoulder.with(Rupees.Red), [-5518, 8237], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: 'Underwater, right of the Zora shrine.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [gateKeyReq, bombBagReq, ironBootsReq],
    })],
    ["Bridge of Eldin Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 40), [-2391, 7503], {
        baseReqs: [boulderReq],
        baseDesc: 'In the open, below the Eldin Lava Cave entrance.',
        randoCategory: Categories.HiddenRupees,
    })],
    ["Kakariko Village Female Ant", new Flag(antF, [-5239, 7705], {
        baseReqs: [eldinTwilightCleared],
        baseDesc: 'This ♀ Ant is walking around the floor of the house.',
        randoDesc: 'The item is on the floor.'
    })],
    ["Kakariko Inn Chest", new Flag(smallChest.with(Rupees.Red), [-5452, 8068], {
        baseDesc: 'The chest is hidden under the staircase.' // Available during the Twilight
    })],
    ["Barnes Bomb Bag", new Flag(bombBag, [-5300, 7755], {
        baseReqs: [fyrusReq, Requirement.fromCountItem(rupees, 120)],
        baseDesc: 'After clearing the Goron Mines, you can buy this Bomb Bag from Barnes for 120 rupees.',
        randoCategory: Categories.ShopItems,
        randoReqs: [eldinTwilightCleared, Requirement.fromCountItem(rupees, 120)],
        randoDesc: "Select a type of bomb to buy the item from Barnes for 120 rupees"
    })],
    ["Kakariko Watchtower Chest", new Flag(chest.with(Rupees.Purple), [-5181, 7310], {
        baseReqs: [eldinTwilightCleared],
        baseDesc: 'Climb the ladder to reach the chest.',
        randoReqs: [],
    })],
    ["Kakariko Village Malo Mart Hylian Shield", new SharedFlag(hylianShield, [-5445, 7325], {
        baseReqs: [ironBootsReq, Requirement.fromCountItem(rupees, 200)],
        baseDesc: 'You can buy it after saving Collin for 200 rupees.',
        randoCategory: Categories.ShopItems,
        randoReqs: [eldinTwilightCleared, Requirement.fromCountItem(rupees, 200)],
        randoDesc: "You can buy the item for 200 rupees."
    })],
    ["Kakariko Village Malo Mart Wooden Shield", new Flag(woodenShields.getItemByIndex(1), [-5445, 7400], {
        itemCategory: Categories.ShopItems,
        baseReqs: [eldinTwilightCleared, Requirement.fromCountItem(rupees, 50)],
        baseDesc: 'You can buy it after saving Collin for 50 rupees.',
        randoDesc: "You can buy the item for 50 rupees."
    })],
    ["Kakariko Village Malo Mart Red Potion", new Flag(Bottle.RedPotion, [-5445, 7250], { 
        itemCategory: Categories.ShopItems,
        baseReqs: [eldinTwilightCleared, getFlagReq("Kakariko Village Malo Mart Hylian Shield"), Requirement.fromCountItem(rupees, 30)],
        baseDesc: 'You can buy it after saving Collin for 30 rupees.',
        randoDesc: "After buying the Hylian Shield for 200 rupees, you can buy the item for 30 rupees."
    })],
    ["Kakariko Village Malo Mart Hawkeye", new Flag(hawkeye, [-5445, 7475], {
        baseReqs: [eldinTwilightCleared, bowReq, fyrusReq, Requirement.fromCountItem(rupees, 100)],
        baseDesc: "You can buy it for 100 rupees after attempting the Talo's Sharpshooting minigame, available only after completing the Goron Mines.",
        randoCategory: Categories.ShopItems
    })],
    ["Shad Dominion Rod", new Flag(dominionRods.getItemByIndex(1), [-5390, 7453], {
        baseReqs: [skybookReq],
        baseDesc: 'Show the Ancient Sky Book to Shad for him to do an encantation which gives power back to the Dominion Rod.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Show the Ancient Sky Book to Shad for him to give you the item',
    })],
    ["Renados Letter", new Flag(renadosLetter, [-5640, 7377], {
        baseReqs: [armogohmaReq],
        baseDesc: 'After clearing the Temple of Time, talk to Renado to obtain his letter to Telma. ',
        randoCategory: Categories.Gifts,
        randoDesc: "After clearing the Temple of Time, talk to Renado to obtain his letter to Telma. This item is never Randomized."
    })],
    ["Ilia Memory Reward", new Flag(horseCall, [-5669, 7336], {
        baseReqs: [iliasCharmReq],
        baseDesc: 'Show the charm to Ilia for it to be revealed as the horse call and receive it back.',
        randoCategory: Categories.Gifts,
    })],
    ["Eldin Lantern Cave First Chest", new Flag(smallChest.with(Rupees.Red), [-5530, 5822], {
        baseReqs: [[lanternReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Use the lantern, bombs or the ball and chain to destroy the cobwebs and reach the chest.'
    })],
    ["Eldin Lantern Cave Second Chest", new Flag(chest.with(Rupees.Purple), [-5810, 6372], {
        baseReqs: [[lanternReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Defeat the skulltula and open the chest.'
    })],
    ["Eldin Lantern Cave Lantern Chest", new Flag(chest.with(heartPiece), [-5399, 6319], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Eldin Lantern Cave Poe", new Flag(poeSoul, [-5469, 6199], {
        baseReqs: [shadowCrystalReq, [lanternReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Use your senses to see the poe at the end of this branch of the cave.'
    })],
    ["Eldin Field Bomskit Grotto Left Chest", new Flag(smallChest.with(Rupees.Purple), [-3678, 6013], {
        baseDesc: 'Hidden in the tall grass.'
    })],
    ["Eldin Field Bomskit Grotto Lantern Chest", new Flag(chest.with(Rupees.Purple), [-3527, 6279], {
        baseReqs: [shadowCrystalReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Eldin Field Water Bomb Fish Grotto Chest", new Flag(smallChest.with(Rupees.Purple), [-3003, 7176], {
        baseReqs: [],
        baseDesc: 'Cross the water to reach the chest. Be careful of the Skullfish and Bombfish.'
    })],
    ["Eldin Stockcave Upper Chest", new Flag(smallChest.with(Rupees.Red), [-2253, 7920], {
        baseReqs: [ironBootsReq],
        baseDesc: 'From the entrance at the top, jump down in the magnetic field with the Iron Boots to reach the chest.'
    })],
    ["Eldin Stockcave Lantern Chest", new Flag(chest.with(Rupees.Orange), [-2310, 7530], {
        baseReqs: [ironBootsReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Eldin Stockcave Lowest Chest", new Flag(chest.with(heartPiece), [-2419, 7522], {
        baseReqs: [ironBootsReq],
        baseDesc: 'Defeat the Dodongo to make opening the chest easier.'
    })],
    ["Eldin Field Stalfos Grotto Left Small Chest", new Flag(smallChest.with(bombs, 5), [-1529, 6815], {
        baseReqs: [],
        baseDesc: 'Hidden in the west tall grass, cut it to make the chest easier to see.'
    })],
    ["Eldin Field Stalfos Grotto Right Small Chest", new Flag(smallChest.with(bombs, 5), [-1602, 7120], {
        baseReqs: [],
        baseDesc: 'Hidden in the east tall grass, cut it to make the chest easier to see.'
    })],
    ["Eldin Field Stalfos Grotto Stalfos Chest", new Flag(chest.with(heartPiece), [-1282, 6999], {
        baseReqs: [shadowCrystalReq, stalfosReq],
        baseDesc: 'Defeat the 3 Stalfos to make the chest appear.'
    })],
    ["Skybook From Impaz", new Flag(skybook.getItemByReq(1), [-2180, 6604], {
        baseReqs: [iliasCharmReq, bowReq, pastDomRodReq],
        baseDesc: 'Defeat all the Bulblins, then show Impaz the Powerless Dominion Rod to receive the Ancient Sky Book.',
        randoCategory: Categories.Gifts,
        randoReqs: [woodenStatueReq, bowReq, pastDomRodReq],
        randoDesc: 'Defeat all the Bulblins, then show Impaz the Powerless Dominion Rod to receive the item.'
    })],
    ["Death Mountain Howling Stone", new Flag(howlingStone, [-4063, 8232], {
        baseReqs: [[new AndRequirements(getFlagReq("Kakariko Village Portal"), eldinTwilight), shadowCrystalReq]],
        baseDesc: 'Summons the Ordon Spring Golden Wolf, accessible while clearing out the Eldin Twilight.'
    })],
    ["Hidden Village Howling Stone", new Flag(howlingStone, [-2065, 6665], {
        baseReqs: [woodenStatueReq, shadowCrystalReq],
        baseDesc: 'Summons the Hyrule Castle Golden Wolf, accessible when you first get into the Hidden Village.',
    })],
    ["Kakariko Gorge Gate Lock", new Flag(gateLock, [-5253, 6506], {
        baseReqs: [gateKeyReq],
        baseDesc: "Unlock this gate during the escort quest to reach Kakariko Village.",
        randoDesc: "This gate unlocks automatically upon obtaining the gate keys, giving access to Kakariko Village."
    })],
    // Gerudo 
    ["Gerudo Desert Golden Wolf", new Flag(goldenWolf, [-4664, 582], {
        baseReqs: [getFlagReq("Lake Hylia Howling Stone")],
        baseDesc: 'Summoned by the Lake Hylia Howling Stone.'
    })],
    ["Gerudo Desert East Poe", new Flag(nightPoe, [-6110, 2588], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Above the grotto entrance, near the skulls.'
    })],
    ["Gerudo Desert East Canyon Chest", new Flag(smallChest.with(Rupees.Red), [-5736, 2179], {
        baseDesc: 'Clawshot the peahat over the chasm or walk all the way around it to reach the chest.'
    })],
    ["Gerudo Desert Peahat Ledge Chest", new Flag(smallChest.with(Rupees.Red), [-6108, 2148], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the tree peahat to reach the higher platform where the chest is.'
    })],
    ["Gerudo Desert Lone Small Chest", new Flag(smallChest.with(arrows, 10), [-5825, 1480], {
        baseDesc: 'The chest is on the darker rock platform.'
    })],
    ["Gerudo Desert Male Dayfly", new Flag(dayflyM, [-6101, 1450], {
        baseDesc: 'This ♂ Dayfly is flying around above the sand.'
    })],
    ["Gerudo Desert Female Dayfly", new Flag(dayflyF, [-5964, 934], {
        baseDesc: 'This ♀ Dayfly is flying around in the north gap with rocky walls.'
    })],
    ["Gerudo Desert West Canyon Chest", new Flag(smallChest.with(Rupees.Purple), [-5792, 322], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the peahat to cross the chasm and get to the chest.'
    })],
    ["Gerudo Desert Poe Above Cave of Ordeals", new Flag(nightPoe, [-6093, 539], {
        baseReqs: [clawshotReq, shadowCrystalReq, nightReq],
        baseDesc: 'Above the Cave of Ordeals entrance.'
    })],
    ["Gerudo Desert North Peahat Poe", new Flag(nightPoe, [-5125, 1380], {
        baseReqs: [clawshotReq, shadowCrystalReq, nightReq],
        baseDesc: 'Clawshot the tree peahat to reach the higher platform. The Poe is above the grotto entrance.'
    })],
    ["Gerudo Desert Campfire North Chest", new Flag(smallChest.with(Rupees.Red), [-5048, 655], {
        baseDesc: 'The chest is near the campfire.'
    })],
    ["Gerudo Desert Campfire West Chest", new Flag(smallChest.with(arrows, 10), [-5090, 605], {
        baseDesc: 'Destroy the western wooden tower with a boar or the ball and chain to gain access to the chest.'
    })],
    ["Gerudo Desert Campfire East Chest", new Flag(smallChest.with(Rupees.Purple), [-5090, 705], {
        baseDesc: 'Destroy the eastern wooden tower with a boar or the ball and chain to gain access to the chest.'
    })],
    ["Gerudo Desert Northwest Chest Behind Gates", new Flag(smallChest.with(Rupees.Red), [-4936, 356], {
        baseDesc: 'Destroy the western wooden gate with a boar to gain access to the chest.'
    })],
    ["Gerudo Desert Northeast Chest Behind Gates", new Flag(smallChest.with(Rupees.Red), [-4831, 856], {
        baseDesc: 'Destroy the eastern wooden gate with a boar to gain access to the chest.'
    })],
    ["Gerudo Desert South Chest Behind Wooden Gates", new Flag(chest.with(Rupees.Orange), [-6405, 1573], {
        baseDesc: 'Bring a boar from the entrance of the desert or the campfire to destroy the 2 gates blocking access to the chest.'
    })],
    ["Gerudo Desert North Small Chest Before Bulblin Camp", new Flag(smallChest.with(arrows, 10), [-4663, 704], {
        baseDesc: 'Follow the right path after the campfire to reach the chest.'
    })],
    ["Bulblin Camp First Chest Under Tower At Entrance", new Flag(smallChest.with(arrows, 20), [-4320, 692], {
        baseDesc: 'Behind the wooden tower.'
    })],
    ["Bulblin Camp Small Chest in Back of Camp", new Flag(smallChest.with(Rupees.Purple), [-4219, 628], {
        baseDesc: 'In the corner, defeat the Bulblins for easier access to the chest.'
    })], 
    ["Bulblin Camp Roasted Boar", new Flag(heartPiece, [-4171, 711], {
        baseReqs: [[woodenSwordReq, bowReq, ballAndChainReq, bombBagReq]],
        baseDesc: 'Destroy the roasting boar to reveal the heart piece.',
        randoCategory: Categories.Main,
        randoDesc: 'Destroy the roasting boar to reveal the item.'
    })],
    ["Bulblin Guard Key", new Flag(bulblinKey, [-4151, 668], {
        baseReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq]],
        baseDesc: 'Defeat the Bulblin that has the key to collect it.',
        randoReqs: [],
        randoDesc: 'The item is on the ground behind the roasting boar.'
    })],
    ["Bulblin Camp Lock", new Flag(faronBulblinLock, [-4255, 601], {
        baseReqs: [bulblinKeyReq],
        baseDesc: 'Unlock this door to reach the boar at the center of the camp.'
    })],
    ["Outside Arbiters Grounds Poe", new Flag(nightPoe, [-3892, 557], {
        baseReqs: [bulblinKeyReq, shadowCrystalReq, nightReq],
        baseDesc: "On the left of the entrance to Arbiter's Grounds."
    })],
    ["Outside Arbiters Grounds Lantern Chest", new Flag(chest.with(Rupees.Purple), [-3889, 654], {
        baseReqs: [bulblinKeyReq, lanternReq],
        baseDesc: "Light the 2 torches on the right of the entrance to Arbiter's Grounds to make the chest appear."
    })],
    ["Bulblin Camp Poe", new Flag(nightPoe, [-4292, 604], {
        baseReqs: [bulblinKeyReq, shadowCrystalReq, nightReq],
        baseDesc: 'After defeating King Bulblin, return to the area of the fight to find the poe.'
    })],
    ["Outside Bulblin Camp Poe", new Flag(nightPoe, [-4623, 470], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'Take the left path twice from the campfire to reach this poe.'
    })],
    ["Gerudo Desert Owl Statue Sky Character", new Flag(skybookChar, [-6140, 1027], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue between the climbable platform and the one with the sky character to obtain it.'
    })],
    ["Gerudo Desert Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-6193, 1074], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue in the intended places while staying on the platforms and make a few jumps to reach the chest.'
    })],
    ["Gerudo Desert Skulltula Grotto Chest", new Flag(chest.with(Rupees.Orange), [-5762, 2464], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Defeat all the skulltulas to make the chest appear.'
    })],
    ["Gerudo Desert Rock Grotto First Poe", new Flag(poeSoul, [-5038, 1167], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'
    })],
    ["Gerudo Desert Rock Grotto Second Poe", new Flag(poeSoul, [-4941, 1335], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: 'The poe can faze through the rocks to come attack you, just wait it out at the entrance.'
    })],
    ["Gerudo Desert Rock Grotto Lantern Chest", new Flag(chest.with(Rupees.Orange), [-4812, 1381], {
        baseReqs: [clawshotReq, shadowCrystalReq, boulderReq, lanternReq],
        baseDesc: 'Destroy the rocks blocking the way, then light 3 torches to make the chest appear.'
    })],
    ["Cave of Ordeals Floor 14 Orange Rupee", new UnsettableFlag(Rupees.Orange, [-5934, 564], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq],
        baseDesc: 'Buried in the ground, use sense to dig it up. Respawns every time you reach this floor again.'
    })],
    ["Cave of Ordeals Floor 17 Poe", new Flag(poeSoul, [-6294, 735], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq],
        baseDesc: 'In the middle of the room.'
    })],
    ["Cave of Ordeals Floor 33 Poe", new Flag(poeSoul, [-6294, 735], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq, ballAndChainReq, domRodReq],
        baseDesc: 'In the middle of the room.'
    })],
    ["Cave of Ordeals Floor 39 Silver Rupee", new UnsettableFlag(Rupees.Silver, [-5933, 274], {
        baseReqs: [spinnerReq, [clawshotReq, bombBagReq], shadowCrystalReq, ballAndChainReq, domRodReq],
        baseDesc:  "Buried in the middle of the room, use Wolf Link's senses to dig it up. Respawns every time you reach this floor again."
    })],
    ["Cave of Ordeals Floor 44 Poe", new Flag(poeSoul, [-6305, 272], {
        baseReqs: [spinnerReq, shadowCrystalReq, ballAndChainReq, domRodReq, doubleClawshotReq],
        baseDesc: 'In the middle of the room'
    })],
    ["Cave of Ordeals Great Fairy Reward", new RandoFlag(Bottle.Tears, [-5928, 737], {
        itemCategory: Categories.Main,
        baseReqs: [spinnerReq, shadowCrystalReq, ballAndChainReq, domRodReq, doubleClawshotReq],
        baseDesc: "Talk to the Great Fairy to obtain Great Fairy's Tears.",
        randoCategory: Categories.Gifts
    })],
    // Peak
    ["Ashei Sketch", new Flag(asheisSketch, [-606, 4446], {
        baseReqs: [stallordReq],
        baseDesc: 'Speak to Ashei to obtain her sketch.',
        randoReqs: [[lanayruTwilightCleared, snowpeakPortalReq]],
        randoCategory: Categories.Gifts
    })],
    ["Snowpeak Blizzard Poe", new Flag(poeSoul, [-307, 3521], {
        baseReqs: snowpeakReq,
        baseDesc: 'Left of the rock the Reekfish Scent makes you go right of.',
    })],
    ["Snowpeak Above Freezard Grotto Poe", new Flag(poeSoul, [-432, 3728], {
        baseReqs: snowpeakReq,
        baseDesc: 'Above the grotto.',
    })],
    ["Snowpeak Poe Among Trees", new Flag(nightPoe, [-344, 3334], {
        baseReqs: [...snowpeakReq, nightReq],
        baseDesc: 'Above the grotto, behind the tree.',
    })],
    ["Snowpeak Icy Summit Poe", new Flag(poeSoul, [-2985, 1299], {
        baseReqs: [snowpeakPortalReq, shadowCrystalReq],
        baseDesc: 'When in front of the mansion, go back to the snow trail as Wolf Link and climb the spiral structure. The poe is at the top.',
    })],
    ["Snowboard Racing Prize", new Flag(heartPiece, [-691, 3013], {
        baseReqs: [blizzetaReq],
        baseDesc: 'After clearing Snowpeak Ruins, warp to the mountain top. Race Yeto and win, then go back to the mountain top and win against Yeta.',
        randoCategory: Categories.Gifts
    })],
    ["Snowpeak Cave Ice Poe", new Flag(poeSoul, [-655, 3300], {
        baseReqs: [...snowpeakReq, ballAndChainReq],
        baseDesc: 'In the cave, break the north ice block with the ball and chain to reveal the poe.',
    })],
    ["Snowpeak Cave Ice Lantern Chest", new Flag(chest.with(Rupees.Orange), [-675, 3275], {
        baseReqs: [...snowpeakReq, ballAndChainReq, lanternReq],
        baseDesc: 'In the cave, break the 2 ice blocks to reveal torches. Light them up to make the chest appear.',
    })],
    ["Snowpeak Howling Stone", new Flag(howlingStone, [-475, 3393], { 
        baseReqs: snowpeakReq,
        baseDesc: 'Summons the Kakariko Graveyard Golden Wolf, accessible on the way to the Snowpeak Ruins.'
    })],
    ["Snowpeak Freezard Grotto Chest", new Flag(chest.with(Rupees.Orange), [-265, 3631], {
        baseReqs: [...snowpeakReq, ballAndChainReq],
        baseDesc: 'Defeat the furthest Freezard to reveal the chest.',
    })],
    // Lanayru
    ["Zoras Domain Chest By Mother and Child Isles", new Flag(smallChest.with(Rupees.Yellow), [-610, 4930], {
        baseReqs: [meltedIceReq],
        baseDesc: 'From the water, climb the path to reach the chest.',
        randoDesc: 'This chest is available during Twilight.'
    })],
    ["Zoras Domain Chest Behind Waterfall", new Flag(smallChest.with(Rupees.Red), [-601, 4967], {
        baseReqs: [meltedIceReq, [lanayruTwilight, shadowCrystalReq]],
        baseDesc: 'Use Midna jumps to follow the path from the west shore of the domain to reach the chest.',
        randoReqs: [meltedIceReq, shadowCrystalReq],
        randoDesc: 'This chest is available during Twilight.',
    })],
    ["Lake Hylia Underwater Chest", new Flag(chest.with(Rupees.Orange), [-5461, 3284], {
        baseReqs: [lanayruTwilightCleared, ironBootsReq],
        baseDesc: 'The chest is underwater, hidden by some tall seaweed.'
    })],
    ["Lake Hylia Bridge Male Mantis", new Flag(mantisM, [-4604, 3418], {
        baseReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♂ Mantis is on the side of the bridge above the void. If you do not have a long ranged item, wait for it to fly near you.',
        randoReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is above the void, use a long ranged item to get it.'
    })],
    ["Lake Hylia Bridge Female Mantis", new Flag(mantisF, [-5459, 3559], {
        baseReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Mantis is too high to reach, use a long ranged item.',
        randoReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is high above the ground, use a long ranged item to get it.'
    })],
    ["West Hyrule Field Female Butterfly", new Flag(butterflyF, [-3658, 3845], {
        baseReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Butterfly is on a higher ledge hiding in the purples flowers. Clawshot the vines to climb the ledge or grab it from below.',
        randoReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: 'The item is on a higher ledge hiding in the purples flowers. Clawshot the vines to climb the ledge or grab it from below.'
    })],
    ["West Hyrule Field Male Butterfly", new Flag(butterflyM, [-4158, 3966], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: 'This ♂ Butterfly is hiding in some purple flowers.',
        randoDesc: 'The item is hiding in some purple flowers.'
    })],
    ["Lanayru Field Male Stag Beetle", new Flag(stagBeetleM, [-2589, 4365], {
        baseReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♂ Stag Beetle is on the trunk of a tree, a bit too high to reach.',
        randoReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq, ballAndChainReq]],
        randoDesc: "The item is on the trunk of a tree, a bit too high to reach."
    })],
    ["Lanayru Field Female Stag Beetle", new Flag(stagBeetleF, [-2005, 4790], {
        baseReqs: [lanayruTwilightCleared, [boomerangReq, clawshotReq]],
        baseDesc: 'This ♀ Stag Beetle is above the entrance of the ice block cave, and is too high too reach.',
        randoDesc: 'The item is above the entrance of the ice block cave, and is too high too reach.'
    })],
    ["Lanayru Field Behind Gate Underwater Chest", new Flag(chest.with(Rupees.Orange), [-2910, 4880], {
        baseReqs: [lanayruTwilightCleared, ironBootsReq],
        baseDesc: 'The chest is in the cage underwater.',
        randoReqs: [meltedIceReq, ironBootsReq],
    })],
    ["Zoras Domain Extinguish All Torches Chest", new Flag(chest.with(Rupees.Purple), [-206, 4830], {
        baseReqs: [lanayruTwilightCleared, boomerangReq, ironBootsReq],
        baseDesc: 'Extinguish all of the 3 torches with the boomerang to make the chest appear.',
    })],
    ["Zoras Domain Light All Torches Chest", new Flag(chest.with(Rupees.Purple), [-206, 4870], {
        baseReqs: [lanayruTwilightCleared, lanternReq, ironBootsReq],
        baseDesc: 'Light up all the 3 torches with the lantern to make the chest appear.',
        randoReqs: [meltedIceReq, lanternReq, ironBootsReq],
    })],
    ["Zoras Domain Male Dragonfly", new Flag(dragonflyM, [-741, 4977], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: 'This ♂ Dragonfly is hiding in the tall grass.',
        randoDesc: 'The item is hiding in the tall grass.'
    })],
    ["Upper Zoras River Female Dragonfly", new Flag(dragonflyF, [-879, 6022], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: 'This ♀ Dragonfly is on the side of the floating bridge. Drop down from the bridge to get it.',
        randoDesc: 'The item is on the side of the floating bridge. Drop down from the bridge to get it.'
    })],
    ["Fishing Hole Bottle", new Flag(bottle, [-370, 6066], {
        baseReqs: [lanayruTwilightCleared, fishingRodReq],
        baseDesc: 'Cast the fishing in the small pond isolated by the bridge to catch the bottle.',
        randoReqs: [meltedIceReq, fishingRodReq],
    })],
    ["Fishing Hole Heart Piece", new Flag(heartPiece, [-372, 5801], {
        baseReqs: [lanayruTwilightCleared, [Requirement.fromCountItem(rupees, 20), clawshotReq]],
        baseDesc: 'Go fishing with the canoe (20 rupees) and use the provided fishing rod to reel in the heart piece or use the clawshot.',
        randoCategory: Categories.Main,
        randoReqs: [meltedIceReq, [Requirement.fromCountItem(rupees, 20), clawshotReq]],
        randoDesc: "'Go fishing with the canoe (20 rupees) and use the provided fishing rod to reel in the item or use the clawshot.'"
    })],
    ["Iza Helping Hand", new Flag(bombBag, [-853, 6061], {
        baseReqs: [getFlagReq("Upper Zoras River Portal"), bowReq],
        baseDesc: 'Help Iza by blowing up all of the rocks blocking the river to receive the bomb bag.',
        randoCategory: Categories.Gifts,
        randoReqs: [lanayruTwilightCleared, bowReq],
        randoDesc: 'Help Iza by blowing up all of the rocks blocking the river to receive the item.'
    })],
    ["Iza Raging Rapids Minigame", new Flag(giantBombBag, [-904, 6064], {
        baseReqs: [getFlagReq("Iza Helping Hand"), bowReq],
        baseDesc: "Play Iza's Raging Rapids minigame and get atleast 25 points to obtain the giant bomb bag.",
        randoCategory: Categories.Gifts,
        randoDesc: "Play Iza's Raging Rapids minigame and get atleast 25 points to obtain the item."
    })],
    ["Outside South Castle Town Female Ladybug", new Flag(ladybugF, [-4491, 4622], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: 'This ♀ Ladybug is in the grassy area next to the middle tree.',
        randoDesc: 'The item is in the grassy area next to the middle tree.'
    })],
    ["Outside South Castle Town Male Ladybug", new Flag(ladybugM, [-4572, 4909], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: 'This ♂ Ladybug is hiding in the flowers on the ground.',
        randoDesc: 'The item is in the flowers on the ground.'
    })],
    ["West Hyrule Field Golden Wolf", new Flag(goldenWolf, [-3917, 4177], {
        baseReqs: [getFlagReq("Upper Zoras River Howling Stone"), lanayruTwilightCleared],
        baseDesc: "Summoned by the Upper Zora's River Howling Stone.",
        randoReqs: [getFlagReq("Upper Zoras River Howling Stone")],
    })],
    ["East Castle Town Bridge Poe", new Flag(nightPoe, [-3967, 5062], {
        baseReqs: [morpheelReq, nightReq],
        baseDesc: 'This poe is located at the center of the bridge.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Outside South Castle Town Tightrope Chest", new Flag(chest.with(Rupees.Orange), [-4364, 4644], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: '1. Clawshot the top of the target at the top of the right tower and climb up.<br>2. Transform into Wolf Link and cross the rope, then transform ' + 
                'back.<br>3. Slowly walk towards the ledge to hang from it, then hold left to crawl to the left platform.<br>4. Transform back into Wolf and cross the last rope to reach the chest.',
        randoReqs: [lanayruTwilightCleared, clawshotReq, shadowCrystalReq],
    })],
    ["Outside South Castle Town Fountain Chest", new Flag(chest.with(Rupees.Orange), [-4428, 4710], {
        baseReqs: [clawshotReq, spinnerReq],
        baseDesc: '1. Clawshot the top of the target at the top of the right tower and drop down.<br>2. Use the spinner on the railing, then jump below to the chest.',
        randoReqs: [lanayruTwilightCleared, clawshotReq, spinnerReq],
    })],
    ["Outside South Castle Town Poe", new Flag(nightPoe, [-4446, 4641], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'Near the middle of the stairs.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Lake Hylia Bridge Vines Chest", new Flag(chest.with(Rupees.Orange), [-4574, 3388], {
        baseReqs: [clawshotReq],
        baseDesc: "Use the clawshot on the vines and climb up completely on the platform. Then, grab the ledge to the right of the vines " +
                "and slide right until you reach the platform with the chest."
    })],
    ["Isle of Riches Poe", new Flag(nightPoe, [-4920, 3065], {
        baseReqs: [Requirement.fromCountItem(rupees, 20), shadowCrystalReq, nightReq],
        baseDesc: "Can be obtained from the lowest platform with the small chest.",
        randoReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20), shadowCrystalReq, nightReq],
    })],
    ["Flight By Fowl Fifth Platform Chest", new Flag(smallChest.with(Rupees.Yellow), [-4900, 3050], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the lowest platform."
    })],
    ["Flight By Fowl Fourth Platform Chest", new Flag(smallChest.with(Rupees.Red), [-4930, 3075], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the second lowest platform."
    })],
    ["Flight By Fowl Third Platform Chest", new Flag(chest.with(Rupees.Purple), [-4963, 3099], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the second highest platform."
    })],
    ["Flight By Fowl Second Platform Chest", new Flag(chest.with(heartPiece), [-4978, 3120], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the highest platform."
    })],
    ["Flight By Fowl Top Platform Reward", new RandoFlag(chest.with(Rupees.Orange), [-4998, 3137], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the spinning platform. This chest refills everytime you reload Lake Hylia.",
        randoDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the spinning platform."
    })],
    ["Outside Lanayru Spring Left Statue Chest", new Flag(smallChest.with(Rupees.Purple), [-5184, 3469], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the west statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"
    })],
    ["Outside Lanayru Spring Right Statue Chest", new Flag(chest.with(Rupees.Orange), [-5184, 3536], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20)],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the top of the east statue in front of the Lanayru spring. Use the clawshot to reach " + 
                "the chest on the other statue and only play the minigame once"
    })],
    ["Outside South Castle Town Golden Wolf", new Flag(goldenWolf, [-4430, 4591], {
        baseReqs: [getFlagReq("North Faron Woods Howling Stone")],
        baseDesc: 'Summoned by the Faron Woods Howling Stone.',
        randoReqs: [lanayruTwilightCleared, getFlagReq("North Faron Woods Howling Stone")],
    })],
    ["Plumm Fruit Balloon Minigame", new Flag(heartPiece, [-4905, 3923], {
        baseReqs: [midnasLamentReq],
        baseDesc: 'Play the Plumm Fruit Balloon Minigame by howling with hawk grass and get 10 000 points or more to obtain the heart piece.',
        randoCategory: Categories.Gifts,
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq],
        randoDesc: 'Play the Plumm Fruit Balloon Minigame by howling with hawk grass and get 10 000 points or more to obtain the item.'
    })],
    ["Zoras Domain Underwater Goron", new Flag(bombBag, [-163, 4849], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: 'Blow up the rock in the middle of the room with water bombs and talk to the Goron that comes out of it.',
        randoCategory: Categories.Gifts,
        randoReqs: [lanayruTwilightCleared, bombBagReq, ironBootsReq],
    })],
    ["Zoras Domain Waterfall Poe", new Flag(nightPoe, [-475, 4844], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'Behind the waterfall, use Midna jumps to get there.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Zoras Domain Mother and Child Isle Poe", new Flag(nightPoe, [-650, 4949], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'In front of the small chest.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Lanayru Field Bridge Poe", new Flag(nightPoe, [-2598, 4901], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'On the bridge.',
        randoReqs: [midnasLamentReq, shadowCrystalReq, nightReq],
    })],
    ["Upper Zoras River Poe", new Flag(nightPoe, [-1024, 5870], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'Near the tall grass.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Lake Hylia Bridge Cliff Chest", new Flag(chest.with(Rupees.Purple), [-5656, 3789], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq],
        baseDesc: 'Blow up the rocks that are elevated to reveal clawshot targets. Follow the target path until you reach the chest.',
        randoReqs: [meltedIceReq, bombBagReq, [bowReq, boomerangReq], clawshotReq],
    })],
    ["Lake Hylia Bridge Cliff Poe", new Flag(nightPoe, [-5691, 3795], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, shadowCrystalReq, nightReq],
        baseDesc: 'On the left of the chest.',
        randoReqs: [lanayruTwilightCleared, midnasLamentReq, bombBagReq, [bowReq, boomerangReq], clawshotReq, shadowCrystalReq, nightReq],
    })],
    ["Lake Hylia Bridge King Bulblin Gate Keys", new Flag(gateKey, [-5048, 3400], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: 'Defeat King Bulblin for the second time during the escort to obtain the gate keys.',
        randoCategory: Categories.NonChecks,
        randoDesc: 'Defeat King Bulblin for the second time during the escort to obtain the item.'
    })],
    ["Lake Hylia Alcove Poe", new Flag(nightPoe, [-5539, 3312], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'In the middle of the tall grass.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Lake Hylia Dock Poe", new Flag(nightPoe, [-5100, 3989], {
        baseReqs: [midnasLamentReq, nightReq],
        baseDesc: 'Out in the open.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Lake Hylia Tower Poe", new Flag(nightPoe, [-5509, 2724], {
        baseReqs: [shadowCrystalReq, nightReq],
        baseDesc: 'On the left of the watchtower.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq],
    })],
    ["Flight By Fowl Ledge Poe", new Flag(nightPoe, [-4656, 2886], {
        baseReqs: [Requirement.fromCountItem(rupees, 20), shadowCrystalReq, nightReq],
        baseDesc: "Play the Flight By Fowl minigame (20 rupees) and use the Cucco to reach the platform under Fowl's house.",
        randoReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 20), shadowCrystalReq, nightReq],
    })],
    ["Charlo Donation Blessing", new Flag(heartPiece, [-3952, 4594], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 1000)],
        baseDesc: "Donate 1000 total rupees to Charlo to receive the heart piece.",
        randoCategory: Categories.Gifts,
        randoReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 500)],
        randoDesc:  "Donate 500 total rupees to Charlo to receive the item."
    })],
    ["Auru Gift To Fyer", new Flag(aurusMemo, [-5460, 2690], {
        baseDesc: "Climb the tower with the ladder and talk to Auru to obtain the memo.",
        baseReqs: [masterSwordReq],
        randoCategory: Categories.Gifts,
        randoReqs: [lanayruTwilightCleared],
        randoDesc: "Climb the tower with the ladder and talk to Auru to obtain the item."
    })],
    ["Lanayru Field Spinner Track Chest", new Flag(chest.with(heartPiece), [-3349, 3595], {
        baseReqs: [boulderReq, spinnerReq],
        baseDesc: 'Destroy the boulders blocking the way, then use the spinner tracks to reach the chest.'
    })],
    ["Hyrule Field Amphitheater Poe", new Flag(nightPoe, [-4314, 3790], {
        baseReqs: [morpheelReq, nightReq],
        baseDesc: 'At the center of the ruins.',
        randoReqs: [lanayruTwilightCleared, shadowCrystalReq, nightReq]
    })],
    ["Doctors Office Balcony Chest", new Flag(smallChest.with(Rupees.Red), [-3940, 4890], {
        baseReqs: [invoiceReq, shadowCrystalReq],
        baseDesc: 'After giving the doctor the Invoice, push the box hiding the medecine scent, and climb up until you are outside. Once there, the chest is on the balcony.'
    })],
    ["Wooden Statue", new Flag(woodenStatue, [-4676, 4714], {
        baseReqs: [invoiceReq, medicineScentReq, shadowCrystalReq, nightReq],
        baseDesc: 'After collecting the Medicine Scent and talking to Louise, defeat all of the Stallhounds at Night to receive the wooden statue.',
    })],
    ["North Castle Town Golden Wolf", new Flag(goldenWolf, [-3701, 4709], {
        baseReqs: [getFlagReq("Hidden Village Howling Stone")],
        baseDesc: 'Summoned by the Hidden Village Howling Stone.',
        randoReqs: [getFlagReq("Hidden Village Howling Stone"), midnasLamentReq],
    })],
    ["Lake Hylia Bridge Owl Statue Sky Character", new Flag(skybookChar, [-4220, 3378], {
        baseReqs: [clawshotReq, domRodReq],
        baseDesc: 'Move the Owl Statue under the vines, then clawshot them and drop onto the statue. Finally, jump to the sky character to obtain it.'
    })],
    ["Lake Hylia Bridge Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-4216, 3433], {
        baseReqs: [clawshotReq, domRodReq],
        baseDesc: 'Once on the sky character platform, move the Owl Statue next to the east wall. Then, jump on it and onto the plaftorm on your left to reach the chest.'
    })],
    ["Hyrule Field Amphitheater Owl Statue Sky Character", new Flag(skybookChar, [-4281, 3766], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue between the broken part of the stairs and the pillar with the sky character to obtain it.'
    })],
    ["Hyrule Field Amphitheater Owl Statue Chest", new Flag(chest.with(Rupees.Orange), [-4334, 3835], {
        baseReqs: [domRodReq],
        baseDesc: 'Move the Owl Statue between the broken part of the stairs and the pillar with the chest to reach it.'
    })],
    ["Outside South Castle Town Double Clawshot Chasm Chest", new Flag(chest.with(Rupees.Orange), [-4550, 4505], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path down the chasm to reach the chest.',
        randoReqs: [lanayruTwilightCleared, doubleClawshotReq],
    })],
    ["Upper Zoras River Howling Stone", new Flag(howlingStone, [-852, 5918], {
        baseReqs: [meltedIceReq, [lanayruTwilight, shadowCrystalReq]],
        baseDesc: 'Summons the West Castle Town Golden Wolf, accessible while clearing out the Lanayru Twilight.'
    })],
    ["Lake Hylia Howling Stone", new Flag(howlingStone, [-5405, 3014], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Summons the Gerudo Desert Golden Wolf, climb the ladder as human to reach it.',
        randoReqs: [meltedIceReq, shadowCrystalReq],
    })],
    ["Lake Hylia Bridge Faron Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 20), [-5458, 3876], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'Hidden between two larger stone structures.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [meltedIceReq, boulderReq],
    })],
    ["Lake Hylia Bridge Owl Statue Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 20), [-4333, 3548], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'Out in the open, east of the Owl Statue.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq],
    })],
    ["West Hyrule Field Southern Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 35), [-3637, 4089], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'Out in the open, defeat the Bulblins to make it easier to destroy.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq],
    })],
    ["West Hyrule Field Northern Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 38), [-3412, 4111], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'Hidden in the corner.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq],
    })],
    ["Lanayru Field Tree Boulder Rupee", new Flag(rupeeBoulder.with(Rupees.Purple), [-2564, 4084], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'Out in the open in the corner.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq]
    })],
    ["Zoras Domain Shortcut Upper Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 21), [-477, 4750], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'This boulder is in the tunnel from the top of the domain to the balcony.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq],
    })],
    ["Zoras Domain Shortcut Lower Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 17), [-475, 4702], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'This boulder is in the tunnel from the top of the domain to the balcony.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq],
    })],
    ["Zoras Domain North Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 60), [-515, 4850], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, under the waterfall.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [meltedIceReq, bombBagReq, ironBootsReq],
    })],
    ["Zoras Domain Central Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 37), [-680, 4850], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, at the center of the domain.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [meltedIceReq, bombBagReq, ironBootsReq],
    })],
    ["Zoras Domain Throne Room Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 47), [-123, 4793], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, east of the throne. The rocks under the boulder are worth lifting as there is a total of 40 rupees under them.",
        randoCategory: Categories.Rupees,
        randoReqs: [lanayruTwilightCleared, bombBagReq, ironBootsReq],
    })],
    ["Upper Zoras River Central Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 31), [-876, 5882], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, in the trench.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [meltedIceReq, bombBagReq, ironBootsReq],
    })],
    ["Upper Zoras River East Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 32), [-1037, 5965], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, before the wooden gate.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [[new AndRequirements([zoraIceReq, [ballAndChainReq, bombBagReq]]), new AndRequirements([meltedIceReq, bombBagReq, ironBootsReq])]],
    })],
    ["Upper Zoras River West Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 43), [-963, 5806], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, under the tunnel that leads to Lanayru Field.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [[new AndRequirements([zoraIceReq, [ballAndChainReq, bombBagReq]]), new AndRequirements([meltedIceReq, bombBagReq, ironBootsReq])]],
    })],
    ["Lanayru Field North Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 50), [-2355, 4889], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, north of the bridge.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [[new AndRequirements([zoraIceReq, [ballAndChainReq, bombBagReq]]), new AndRequirements([meltedIceReq, bombBagReq, ironBootsReq])]],
    })],
    ["Lanayru Field South Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 31), [-2698, 4923], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, south of the bridge.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [[new AndRequirements([zoraIceReq, [ballAndChainReq, bombBagReq]]), new AndRequirements([meltedIceReq, bombBagReq, ironBootsReq])]],
    })],
    ["Lanayru Field North Spinner Track Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 30), [-2601, 3974], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'These boulders are blocking the north entrance to the spinner area.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq]
    })],
    ["Lanayru Field South Spinner Track Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 20), [-3816, 3385], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'These boulders are blocking the south entrance to the spinner area.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [boulderReq]
    })],
    ["Outside South Castle Town Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 38), [-4422, 4873], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'Out in the open.',
        randoCategory: Categories.HiddenRupees,
    })],
    ["Upper Zoras River Ledge Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 31), [-808, 5851], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: 'In the open near the howling stone.',
        randoCategory: Categories.HiddenRupees,
        randoReqs: [meltedIceReq, boulderReq],
    })],
    ["Lake Hylia Left Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 36), [-4847, 3363], {
        baseReqs: [waterBombReq, zoraArmorReq, ironBootsReq],
        baseDesc: "Deep underwater, west of the entrance to Lakebed Temple.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [lanayruTwilightCleared, zoraArmorReq, ironBootsReq, bombBagReq],
    })],
    ["Lake Hylia Right Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 40), [-4915, 3442], {
        baseReqs: [waterBombReq, zoraArmorReq, ironBootsReq],
        baseDesc: "Deep underwater, east of the entrance to Lakebed Temple.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [lanayruTwilightCleared, zoraArmorReq, ironBootsReq, bombBagReq],
    })],
    ["Agitha Male Ant Reward",           getAgithaRewardFlag(0)],
    ["Agitha Female Ant Reward",         getAgithaRewardFlag(1)],
    ["Agitha Male Dayfly Reward",        getAgithaRewardFlag(2)],
    ["Agitha Female Dayfly Reward",      getAgithaRewardFlag(3)],
    ["Agitha Male Beetle Reward",        getAgithaRewardFlag(4)],
    ["Agitha Female Beetle Reward",      getAgithaRewardFlag(5)],
    ["Agitha Male Mantis Reward",        getAgithaRewardFlag(6)],
    ["Agitha Female Mantis Reward",      getAgithaRewardFlag(7)],
    ["Agitha Male Stag Beetle Reward",   getAgithaRewardFlag(8)],
    ["Agitha Female Stag Beetle Reward", getAgithaRewardFlag(9)],
    ["Agitha Male Pill Bug Reward",      getAgithaRewardFlag(10)],
    ["Agitha Female Pill Bug Reward",    getAgithaRewardFlag(11)],
    ["Agitha Male Butterfly Reward",     getAgithaRewardFlag(12)],
    ["Agitha Female Butterfly Reward",   getAgithaRewardFlag(13)],
    ["Agitha Male Ladybug Reward",       getAgithaRewardFlag(14)],
    ["Agitha Female Ladybug Reward",     getAgithaRewardFlag(15)],
    ["Agitha Male Snail Reward",         getAgithaRewardFlag(16)],
    ["Agitha Female Snail Reward",       getAgithaRewardFlag(17)],
    ["Agitha Male Phasmid Reward",       getAgithaRewardFlag(18)],
    ["Agitha Female Phasmid Reward",     getAgithaRewardFlag(19)],
    ["Agitha Male Grasshopper Reward",   getAgithaRewardFlag(20)],
    ["Agitha Female Grasshopper Reward", getAgithaRewardFlag(21)],
    ["Agitha Male Dragonfly Reward",     getAgithaRewardFlag(22)],
    ["Agitha Female Dragonfly Reward",   getAgithaRewardFlag(23)],
    ["Jovani House Poe", new Flag(poeSoul, [-4193, 5102], {
        baseReqs: [morpheelReq],
        baseDesc: 'Enter the house using the dig spot to obtain this poe soul.',
        randoReqs: [shadowCrystalReq],
    })],
    ["Jovani 20 Poe Soul Reward", new Flag(jovaniBottle, [-3915, 4994], {
        baseReqs: [shadowCrystalReq, Requirement.fromCountItem(poeSoul, 20)],
        baseDesc: "Talk to Jovani after collecting 20 poe souls to receive this reward.",
        randoCategory: Categories.Gifts
    })],
    ["Jovani 60 Poe Soul Reward", new Flag(Rupees.Silver, [-3840, 4994], {
        baseReqs: [shadowCrystalReq, Requirement.fromCountItem(poeSoul, 60)],
        baseDesc: "Talk to Jovani after collecting 60 poe souls to receive a Silver Rupee.",
        randoCategory: Categories.Gifts,
        randoDesc: 'Talk to Jovani after collecting 60 poe souls to receive the reward.'
    })],
    ["STAR Prize 1", new Flag(bigQuiver, [-4113, 4433], {
        baseReqs: [clawshotReq, Requirement.fromCountItem(rupees, 10)],
        baseDesc: 'Pay 10 rupees to play the first STAR minigame and win it to receive the big quiver.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Pay 10 rupees to play the first STAR minigame and win it to receive the reward.'
    })],
    ["STAR Prize 2", new Flag(giantQuiver, [-4128, 4479], {
        baseReqs: [getFlagReq("STAR Prize 1"), doubleClawshotReq, Requirement.fromCountItem(rupees, 15)],
        baseDesc: 'Pay 15 rupees to play the second STAR minigame and win it to receive the giant quiver.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Pay 15 rupees to play the second STAR minigame and win it to receive the reward.'
    })],
    ["Castle Town Malo Mart Magic Armor", new Flag(magicArmor, [-4231, 4706], {
        baseReqs: [getFlagReq("Kakariko Village Malo Mart Castle Town Shop"), Requirement.fromBoolItem(wallets.getItemByIndex(1)), Requirement.fromCountItem(rupees, 598)],
        baseDesc: 'After repairing the Castle Town bridge for 1000 rupees, pay 200 rupees (2000 rupees if you did not do the Goron Springwater ' +
                  'Rush quest) to open the Castle Town Branch of Malo Mart. You can then buy the Magic Armor for 598 rupees. This item costs 1798 rupees total (or 3598 rupees without GSR).',
        randoCategory: Categories.ShopItems,
        randoReqs: [getFlagReq("Kakariko Village Malo Mart Castle Town Shop"), [Requirement.fromBoolItem(wallets.getItemByIndex(1)), walletCapacityReq], Requirement.fromCountItem(rupees, 598)],
        randoDesc: 'After repairing the Castle Town bridge for 500 rupees, pay 200 rupees (2000 rupees if you did not do the Goron Springwater ' +
                  'Rush quest) to open the Castle Town Branch of Malo Mart. You can then buy the Magic Armor for 598 rupees. This item costs 1298 rupees total (or 3098 rupees without GSR).'
    })],
    ["Telma Invoice", new Flag(invoice, [-4108, 5062], {
        baseReqs: [Requirement.fromBoolItem(renadosLetter)],
        baseDesc: "Give Renado's Letter to Telma to receive the Invoice.",
        randoCategory: Categories.Gifts,
        randoDesc: "Give Renado's Letter to Telma to receive the item. This check is never randomized."
    })],
    ["West Hyrule Field Helmasaur Grotto Chest", new Flag(chest.with(Rupees.Orange), [-3718, 3801], {
        baseReqs: [clawshotReq, shadowCrystalReq],
        baseDesc: "Use the clawshot on the vines to reach the grotto entrance. Once inside, defeat all the Helmasaurs to make the chest appear."
    })],
    ["Lanayru Field Skulltula Grotto Chest", new Flag(chest.with(Rupees.Purple), [-1830, 4720], {
        baseReqs: [shadowCrystalReq, lanternReq],
        baseDesc:  'Light the 3 torches separated by the wooden barriers to make the chest appear.'
    })],
    ["Lanayru Field Poe Grotto Right Poe", new Flag(poeSoul, [-2351, 4111], {
        baseReqs: [midnasLamentReq],
        baseDesc: 'On the elevated platform.',
        randoReqs: [shadowCrystalReq],
    })],
    ["Lanayru Field Poe Grotto Left Poe", new Flag(poeSoul, [-2378, 4211], {
        baseReqs: [midnasLamentReq],
        baseDesc: 'Right of the elevated platform.',
        randoReqs: [shadowCrystalReq],
    })],
    ["Lake Hylia Bridge Bubble Grotto Chest", new Flag(chest.with(Rupees.Orange), [-5400, 3629], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, shadowCrystalReq],
        baseDesc: 'Defeat all the Bubbles to make the chest appear.'
    })],
    ["Lake Hylia Water Toadpoli Grotto Chest", new Flag(chest.with(Rupees.Orange), [-5237, 3005], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Defeat all the Toadpolis to make the chest appear. Tip: You can reflect their projectiles with Wolf Link attacks.'
    })],
    ["Lake Hylia Shell Blade Grotto Chest", new Flag(chest.with(Rupees.Orange), [-4354, 2828], {
        baseReqs: [Requirement.fromCountItem(rupees, 20), shadowCrystalReq, [waterBombReq, new AndRequirements([masterSwordReq, ironBootsReq])]],
        baseDesc: "The grotto is on the platform under Fowl's house. Play the Flight By Fowl minigame (20 rupees) and use " + 
                  "the Cucco to reach the platform. Once inside, defeat all 4 Shellblades with a sword or water bombs to make the chest appear.",
        randoReqs: [Requirement.fromCountItem(rupees, 20), shadowCrystalReq, [bombBagReq, new AndRequirements([woodenSwordReq, ironBootsReq])]],
    })],
    ["Outside South Castle Town Tektite Grotto Chest", new Flag(chest.with(Rupees.Orange), [-4292, 4907], {
        baseReqs: [shadowCrystalReq],
        baseDesc: 'Defeat all the Tektites to make the chest appear.',
    })],
    ["Lanayru Spring Underwater Left Chest", new Flag(smallChest.with(Rupees.Blue), [-5210, 3566], {
        baseReqs: [lanayruTwilightCleared, ironBootsReq],
        baseDesc: "Sink down to get this underwater chest on the left side.",
        randoReqs: [ironBootsReq],
    })],
    ["Lanayru Spring Underwater Right Chest", new Flag(smallChest.with(Rupees.Yellow), [-5197, 3360], {
        baseReqs: [lanayruTwilightCleared, ironBootsReq],
        baseDesc: "Sink down to get this underwater chest on the right side.",
        randoReqs: [ironBootsReq],
    })],
    ["Lanayru Spring Back Room Left Chest", new Flag(smallChest.with(bombs, 5), [-5538, 3542], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the vines on either side, open the door and walk to the chest on the left.'
    })],
    ["Lanayru Spring Back Room Right Chest", new Flag(smallChest.with(Rupees.Blue), [-5558, 3491], {
        baseReqs: [clawshotReq],
        baseDesc: 'Clawshot the vines on either side, open the door and walk to the chest on the right.'
    })],
    ["Lanayru Spring Back Room Lantern Chest", new Flag(chest.with(heartPiece), [-5559, 3526], {
        baseReqs: [clawshotReq, lanternReq],
        baseDesc: 'Light the 2 torches in the room to make the chest appear.'
    })],
    ["Lanayru Spring West Double Clawshot Chest", new Flag(chest.with(Rupees.Orange), [-5128, 3232], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path, then take a left to reach the chest.'
    })],
    ["Lanayru Spring East Double Clawshot Chest", new Flag(chest.with(Rupees.Orange), [-5145, 3773], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path, then take a right to reach the chest.'
    })],
    ["Lanayru Spring Lower Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 37), [-5171, 3447], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, near the entrance.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [bombBagReq, ironBootsReq],
    })],
    ["Lanayru Spring Upper Underwater Boulder Rupee", new Flag(rupeeBoulder.with(rupees, 41), [-5322, 3394], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Underwater, in the back.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [bombBagReq, ironBootsReq],
    })],
    ["Lake Lantern Cave First Chest", new Flag(smallChest.with(bombs, 5), [-5696, 3100], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave Second Chest", new Flag(smallChest.with(Rupees.Yellow), [-5665, 3145], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back and defeat the Keese.'
    })],
    ["Lake Lantern Cave Third Chest", new Flag(smallChest.with(Rupees.Red), [-5631, 3200], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave First Poe", new Flag(poeSoul, [-5632, 3440], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'Near the torch in the middle of the room.'
    })],
    ["Lake Lantern Cave Fourth Chest", new Flag(smallChest.with(arrows, 10), [-5631, 3487], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Fifth Chest", new Flag(smallChest.with(Rupees.Red), [-5381, 3422], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Sixth Chest", new Flag(chest.with(Rupees.Orange), [-5418, 3185], {
        baseReqs: [boulderReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Lake Lantern Cave Seventh Chest", new Flag(smallChest.with(Rupees.Red), [-5386, 3183], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the right to reveal the chest.'
    })],
    ["Lake Lantern Cave Eighth Chest", new Flag(smallChest.with(bombs, 5), [-5308, 3098], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back and defeat the Tektites.'
    })],
    ["Lake Lantern Cave Ninth Chest", new Flag(smallChest.with(arrows, 10), [-5375, 2828], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left and defeat the Keese.'
    })], 
    ["Lake Lantern Cave Tenth Chest", new Flag(chest.with(Rupees.Purple), [-5341, 2779], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Second Poe", new Flag(poeSoul, [-5260, 3181], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'Near the torch in the middle of the room.'
    })],
    ["Lake Lantern Cave Eleventh Chest", new Flag(smallChest.with(bombs, 10), [-5262, 3231], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Twelfth Chest", new Flag(chest.with(Rupees.Purple), [-5229, 3182], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave Thirteenth Chest", new Flag(smallChest.with(seeds, 50), [-5303, 3268], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock on the left to reveal the chest.'
    })],
    ["Lake Lantern Cave Fourteenth Chest", new Flag(chest.with(Rupees.Orange), [-5333, 3426], {
        baseReqs: [boulderReq],
        baseDesc: 'Destroy the rock in the back to reveal the chest.'
    })],
    ["Lake Lantern Cave Final Poe", new Flag(poeSoul, [-5523, 3363], {
        baseReqs: [boulderReq, shadowCrystalReq],
        baseDesc: 'At the entrance of the room.'
    })],
    ["Lake Lantern Cave End Lantern Chest", new Flag(chest.with(heartPiece), [-5555, 3364], {
        baseReqs: [boulderReq, lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Lanayru Ice Block Puzzle Cave Chest", new Flag(chest.with(heartPiece), [-1725, 4818], {
        baseReqs: [ballAndChainReq],
        baseDesc: 'Complete the 3 block puzzles to open all the gates to access the chest.'
    })],
    // Forest Temple
    ["Forest Temple Entrance Vines Chest", new Flag(smallChest.with(Rupees.Yellow), [-5935, 4317], {
        baseReqs: [slingshotReq],
        baseDesc: 'Use a long ranged item to defeat the spiders and climb to the chest.',
        randoReqs: [[slingshotReq, boomerangReq, bowReq, clawshotReq]],
    })],
    ["Forest Temple Central Chest Behind Stairs", new Flag(smallChest.with(Rupees.Red), [-5281, 4240], {
        baseReqs: [], // Needs a way to put the Bombling into bomb form (shield/damage) or boulderReq
        baseDesc: 'Use the Bombling on the right to blow up the rock blocking the chest.'
    })],
    ["Forest Temple Central North Chest", new Flag(chest.with(forestMap), [-5260, 4294], {
        baseReqs: [lanternReq],
        baseDesc: 'Use the lantern to light the 4 torches that make the stairs leading to the chest rise.'
    })],
    ["Forest Temple Windless Bridge Chest", new Flag(chest.with(forestSK), [-4710, 4812], {
        baseDesc: 'Left of the entrance of the room.'
    })],
    ["Forest Temple East Water Cave Chest", new Flag(chest.with(Rupees.Yellow), [-5445, 5120], {
        baseDesc: 'Swim to the opening and walk to the end to reach the chest.'
    })],
    ["Forest Temple Second Monkey Under Bridge Chest", new Flag(smallChest.with(Rupees.Yellow), [-5155, 5218], {
        baseReqs: [[forest1SKReq, poleMonkeyLockReq]],
        baseDesc: 'The chest is under the wooden structure.'
    })],
    ["Forest Temple Big Baba Key", new Flag(forestSK, [-5624, 3749], {
        baseReqs: [poleMonkeyReq],
        baseDesc: 'Defeat the Big Baba to obtain the key. Use the Bomblings if you do not have any weapons.',
        randoReqs: [...forestTempleLeftSideReq],
        randoDesc: 'Defeat the Big Baba to obtain the item. Use the Bomblings if you do not have any weapons.'
    })],
    ["Forest Temple West Deku Like Chest", new Flag(chest.with(heartPiece), [-5467, 3901], {
        baseReqs: [poleMonkeyReq],
        baseDesc: 'Defeat the Deku Like that blocks the way to access the chest.',
        randoReqs: [...forestTempleLeftSideReq],
    })],
    ["Forest Temple Totem Pole Chest", new Flag(chest.with(forestSK), [-5277, 3498], {
        baseReqs: [poleMonkeyReq],
        baseDesc: 'Roll into the pillar to make the chest fall.',
        randoReqs: [...forestTempleLeftSideReq],
    })],
    ["Forest Temple West Tile Worm Room Vines Chest", new Flag(smallChest.with(Rupees.Red), [-5224, 3241], {
        baseReqs: [poleMonkeyReq],
        baseDesc: 'Climb the vines to reach the chest.',
        randoReqs: [...forestTempleLeftSideReq]
    })],
    ["Forest Temple Gale Boomerang", new Flag(boomerang, [-4508, 4262], {
        baseReqs: [forestBabaLockReq, forestTileWormLockReq],
        baseDesc: 'Defeat Ook to obtain the Gale Boomerang.',
        randoReqs: [
            [
                new AndRequirements(forestBabaLockReq, forestTileWormLockReq), 
                new AndRequirements([...forestTempleLeftSideReq, boomerangReq])
            ], 
            [woodenSwordReq, shadowCrystalReq, ballAndChainReq, bombBagReq, bowReq]
        ]
    })],
    ["Forest Temple West Tile Worm Chest Behind Stairs", new Flag(chest.with(heartPiece), [-5304, 3050], {
        baseReqs: [poleMonkeyReq, boomerangReq],
        baseDesc: 'Extinguish all the torches to retract the stairs blocking the chest.',
        randoReqs: [...forestTempleLeftSideReq, boomerangReq]
    })],
    ["Forest Temple Central Chest Hanging From Web", new Flag(chest.with(forestCompass), [-5386, 4242], {
        baseReqs: [boomerangReq],
        baseDesc: 'Use a long ranged item to break the web holding the chest.',
        randoReqs: [[boomerangReq, bowReq, clawshotReq, ballAndChainReq]],
    })],
    ["Forest Temple Big Key Chest", new Flag(bossChest.with(forestBK), [-5439, 5042], {
        baseReqs: [boomerangReq],
        baseDesc: 'Use the boomerang on the windmill pillars in this pattern: Bottom Right, Bottom Left, Top Right and Top Left.' + 
                    'This opens the gate to the boss key chest.'
    })],
    ["Forest Temple North Deku Like Chest", new Flag(chest.with(forestSK), [-4322, 4342], {
        baseReqs: [boomerangReq],
        baseDesc: 'Grab a bombling or use one of your own bombs to defeat the Deku Like and jump across the platforms.'
    })],
    ["Forest Temple East Tile Worm Chest", new Flag(chest.with(Rupees.Red), [-4510, 5206], {
        baseReqs: [boomerangReq, [forest1SKReq, forestBridgeLockReq]],
        baseDesc: 'Climb up the room by going in the back or simply get launched by the Tile Worm closest to the chest.'
    })],
    ["Forest Temple Diababa Heart Container", new Flag(heartContainer, [-3773, 4842], {
        baseReqs: [diababaReq],
        baseDesc: 'Defeat Diababa to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [[forestBKReq, forestBossLockReq], boomerangReq, [woodenSwordReq, ballAndChainReq, bombBagReq, bowReq, shadowCrystalReq]],
        randoDesc: 'Defeat Diababa to obtain the item.'
    })],
    ["Forest Temple Dungeon Reward", new Flag(fusedShadow, [-3796, 4777], {
        baseReqs: [diababaReq],
        baseDesc: 'Defeat Diababa to obtain the Fused Shadow.',
        randoReqs: [[forestBKReq, forestBossLockReq], boomerangReq, [woodenSwordReq, ballAndChainReq, bombBagReq, bowReq, shadowCrystalReq]],
        randoDesc: 'Defeat Diababa to obtain the dungeon reward.'
    })],
    ["Forest Temple Diababa", new Flag(diababa, [-3651, 4860], {
        baseReqs: [boomerangReq, [forestBKReq, forestBossLockReq], ordonSwordReq],
        baseDesc: 'Defeat Diababa to clear out the Forest Temple.',
        randoReqs: [[forestBKReq, forestBossLockReq], boomerangReq, [woodenSwordReq, ballAndChainReq, bombBagReq, bowReq, shadowCrystalReq]]
    })],
    ["Forest Temple Ooccoo", new Flag(ooccooPot, [-5250, 4565], {
        baseReqs: [], // Needs a way to put the Bombling into bomb form (shield/damage) or boulderReq
        baseDesc: 'Use the Bombling to blow up the rocks, then pick up or break the pot containing Ooccoo.'
    })],
    ["Forest Temple Tile Worm Monkey Lock", new Flag(forestLock, [-5309, 2943], {
        baseReqs: [poleMonkeyReq, forest1SKReq, lanternReq],
        baseDesc: 'Unlock this door to free the west wing monkey.',
        randoReqs: [...forestTempleLeftSideReq, forest1SKReq],
    })],
    ["Forest Temple Big Baba Monkey Lock", new Flag(forestLock, [-5869, 3752], {
        baseReqs: [poleMonkeyReq, forest1SKReq, lanternReq],
        baseDesc: 'Unlock this door to free the Big Baba Monkey',
        randoReqs: [...forestTempleLeftSideReq, forest1SKReq]
    })],
    ["Forest Temple Totem Pole Monkey Lock", new Flag(forestLock, [-5224, 5130], {
        baseReqs: [forest1SKReq],
        baseDesc: "Unlock this door to reach the room with the totem pole Monkey."
    })],
    ["Forest Temple Windless Bridge Lock", new Flag(forestLock, [-4570, 5080], {
        baseReqs: [forest1SKReq, boomerangReq],
        baseDesc: "Unlock this door to reach the Northeastern Tile Worm Room."
    })],
    ["Forest Temple Boss Lock", new Flag(forestBossLock, [-3854, 4863], {
        baseReqs: [boomerangReq, forestBKReq, hangingCageMonkeyReq, monkeyUnderWebReq, monkeyBehindRocksReq, monkeyWindmillReq],
        baseDesc: "Unlock this door to reach Diababa.",
        randoReqs: [boomerangReq, forestBKReq, [
            new AndRequirements(hangingCageMonkeyReq, monkeyUnderWebReq, monkeyBehindRocksReq, monkeyWindmillReq, forestBabaLockReq, forestTileWormLockReq, poleMonkeyReq), 
            clawshotReq
        ]],
    })],
    // Goron Mines
    ["Goron Mines Entrance Chest", new Flag(smallChest.with(Rupees.Red), [-5791, 4465], {
        baseReqs: [ironBootsReq],
        baseDesc: 'Defeat the Torch Slug to access to the chest.'
    })],
    ["Goron Mines Main Magnet Room Bottom Chest", new Flag(chest.with(minesSK), [-5232, 4603], {
        baseReqs: [ironBootsReq],
        baseDesc:  'Defeat the Bulblins to easily reach the chest.'
    })],
    ["Goron Mines Gor Amato Key Shard", new Flag(minesBKAmoto, [-5004, 3025], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'Talk to goron elder Gor Amoto to obtain this part of the boss key.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Talk to Gor Amoto to obtain the item.'
    })],
    ["Goron Mines Gor Amato Chest", new Flag(chest.with(minesMap), [-4999, 2966], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'The chest is behind the goron elder.'
    })],
    ["Goron Mines Gor Amato Small Chest", new Flag(smallChest.with(Rupees.Red), [-4971, 2941], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'The small chest is behind the goron elder, on the platform.'
    })],
    ["Goron Mines Magnet Maze Chest", new Flag(chest.with(heartPiece), [-4913, 3891], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'Follow the left path when you get on the ceiling to reach the chest.'
    })],
    ["Goron Mines Ooccoo", new Flag(ooccooPot, [-5027, 3150], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'Pick up the pot where Ooccoo is hiding for her to join you.'
    })],
    ["Goron Mines First Floor Lock", new Flag(minesLock, [-5052, 3966], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: "Unlock this door to reach Gor Amoto."
    })],
    ["Goron Mines Crystal Switch Room Underwater Chest", new Flag(chest.with(minesSK), [-4591, 4459], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'Use the Iron Boots to sink down to the underwater chest.'
    })],
    ["Goron Mines Crystal Switch Room Small Chest", new Flag(smallChest.with(Rupees.Red), [-4526, 4441], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'Use the Iron Boots to follow the magnet path onto the platform where the chest is.'
    })],
    ["Goron Mines After Crystal Switch Room Magnet Wall Chest", new Flag(chest.with(heartPiece), [-4471, 4242], {
        baseReqs: [ironBootsReq, [mines1SKReq, minesFirstLockReq]],
        baseDesc: 'Follow the magnet path on the wall and take a left to reach the upper platform.'
    })],
    ["Goron Mines Double Beamos Lock", new Flag(minesLock, [-4200, 4363], {
        baseReqs: [ironBootsReq, [mines2SKReq, new AndRequirements(minesFirstLockReq, mines1SKReq)]],
        baseDesc: "Unlock this door to reach the huge outdoor area."
    })],
    ["Goron Mines Outside Beamos Chest", new Flag(smallChest.with(minesSK), [-3898, 4270], {
        baseReqs: [ironBootsReq, [mines2SKReq, minesSecondLockReq]],
        baseDesc: 'Follow the left barrier to not get noticed by the Beamos and reach the chest.'
    })],
    ["Goron Mines Outside Underwater Chest", new Flag(chest.with(Rupees.Purple), [-3747, 4568], {
        baseReqs: [ironBootsReq, [mines2SKReq, minesSecondLockReq]],
        baseDesc: 'The chest is behind a breakable wooden barrier underwater. However, you can simply go above the barrier by swimming.'
    })],
    ["Goron Mines Outside Clawshot Chest", new Flag(chest.with(Rupees.Purple), [-3629, 4596], {
        baseReqs: [ironBootsReq, clawshotReq, [mines2SKReq, minesSecondLockReq]],
        baseDesc: 'Clawshot the vines from the door to the right of the room to reach the platform with the chest.'
    })],
    ["Goron Mines Outside Lock", new Flag(minesLock, [-3833, 4669], {
        baseReqs: [ironBootsReq, [mines3SKReq, new AndRequirements(minesSecondLockReq, mines1SKReq)]],
    })],
    ["Goron Mines Gor Ebizo Key Shard", new Flag(minesBKEbizo, [-3736, 5491], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq]],
        baseDesc: 'Talk to goron elder Gor Ebizo to obtain this part of the boss key.',
        randoCategory: Categories.Gifts,
        randoDesc: 'Talk to Gor Ebizo to obtain the item.'
    })],
    ["Goron Mines Gor Ebizo Chest", new Flag(smallChest.with(Rupees.Yellow), [-3764, 5566], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq]],
        baseDesc: 'Use the stairs to the right of Gor Ebizo to reach the chest.'
    })],
    ["Goron Mines Chest Before Dangoro", new Flag(smallChest.with(Rupees.Yellow), [-3896, 5243], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq]],
        baseDesc: 'Use the magnet path to reach the chest.'
    })],
    ["Goron Mines Dangoro Chest", new Flag(chest.with(bow.getItemByIndex(0)), [-4550, 5060], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq]],
        baseDesc: 'Defeat Dangoro to gain access to the chest.',
        randoReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], dangoroReq],
    })],
    ["Goron Mines Beamos Room Chest", new Flag(chest.with(minesCompass), [-4786, 4930], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], bowReq],
        baseDesc: 'Defeat the Beamos and pull it to access the chest.',
        randoReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], dangoroReq, bowReq],
    })],
    ["Goron Mines Gor Liggs Key Shard", new Flag(minesBKLiggs, [-4787, 5495], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], bowReq],
        baseDesc: 'Defeat the Beamos and pull it to have access to the room where Gor Liggs gives you a part of the boss key.',
        randoCategory: Categories.Gifts,
        randoReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], dangoroReq, bowReq],
        randoDesc: 'Defeat the Beamos and pull it to have access to the room where Gor Liggs gives you the item.'
    })],
    ["Goron Mines Gor Liggs Chest", new Flag(chest.with(Rupees.Purple), [-4783, 5585], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], bowReq],
        baseDesc: 'Defeat the beamos and pull it to have access to the room where the chest is, behind the goron elder.',
        randoReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], dangoroReq, bowReq],
    })],
    ["Goron Mines Main Magnet Room Top Chest", new Flag(chest.with(Rupees.Purple), [-5155, 4682], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], bowReq],
        baseDesc: 'Jump across to the platform with the chest to reach it.',
        randoReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq], dangoroReq, bowReq],
    })],
    ["Goron Mines Boss Lock", new Flag(minesBossLock, [-4170, 3847], {
        baseReqs: [ironBootsReq, [mines2SKReq, minesSecondLockReq], minesBKReq],
        baseDesc: "Unlock this door to reach Fyrus.",
    })],
    ["Goron Mines Fyrus", new Flag(fyrus, [-4332, 3840], {
        baseReqs: [ironBootsReq, [mines2SKReq, minesSecondLockReq], [minesBKReq, minesBossLockReq], bowReq],
        baseDesc: 'Defeat Fyrus to clear out the Goron Mines.'
    })],
    ["Goron Mines Fyrus Heart Container", new Flag(heartContainer, [-4252, 3815], {
        baseReqs: [fyrusReq],
        baseDesc: 'Defeat Fyrus to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [ironBootsReq, [mines2SKReq, minesSecondLockReq], [minesBKReq, minesBossLockReq], bowReq],
        randoDesc: 'Defeat Fyrus to obtain the item.'
    })],
    ["Goron Mines Dungeon Reward", new Flag(fusedShadow, [-4276, 3884], {
        baseReqs: [fyrusReq],
        baseDesc: 'Defeat Fyrus to obtain the Fused Shadow.',
        randoReqs: [ironBootsReq, [mines2SKReq, minesSecondLockReq], [minesBKReq, minesBossLockReq], bowReq],
        randoDesc: 'Defeat Fyrus to obtain the dungeon reward.'
    })],
    // Lakebed Temple
    ["Lakebed Temple Lobby Rear Chest", new Flag(smallChest.with(waterBombs, 10), [-5601, 4339], {
        baseDesc: 'The chest is on the right of the nearby rock pillar.'
    })],
    ["Lakebed Temple Lobby Left Chest", new Flag(smallChest.with(arrows, 20), [-5509, 4199], {
        baseDesc: 'The chest is between the two rock pillars.'
    })],
    ["Lakebed Temple Stalactite Room Chest", new Flag(smallChest.with(waterBombs, 10), [-4950, 4501], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'Knock down the stalactites with bombs and climb to the chest.'
    })],
    ["Lakebed Temple East Second Floor Southwest Chest", new Flag(smallChest.with(bombs, 5), [-4487, 5223], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed1SKReq, lakebedFirstLockReq]],
        baseDesc: 'On the left when you enter the room from the lobby.'
    })],
    ["Lakebed Temple East Second Floor Southeast Chest", new Flag(chest.with(lakebedSK), [-4585, 5497], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed1SKReq, lakebedFirstLockReq]],
        baseDesc: 'Go around the room and cross by the middle section to reach the chest.'
    })],
    ["Lakebed Temple Chandelier Chest", new Flag(chest.with(heartPiece), [-4373, 4363], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq],
        baseDesc: 'The chest is on the chandelier hanging from the ceiling, use the clawshot to get there.'
    })],
    ["Lakebed Temple West Second Floor Central Small Chest", new Flag(smallChest.with(Rupees.Red), [-4223, 3363], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, [lakebed2SKReq, lakebedSecondLockReq], lakebedEastWaterReq],
        baseDesc: 'Once on the highest vine platform, clawshot the target above the platform where the chest is.'
    })],
    ["Lakebed Temple West Second Floor Northeast Chest", new Flag(chest.with(bombs, 20), [-4212, 3451], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, [lakebed2SKReq, lakebedSecondLockReq], lakebedWestWaterReq],
        baseDesc: 'After activating the water, go back the way you came from through the waterwheel to find the chest.' 
    })], 
    ["Lakebed Temple West Second Floor Southwest Underwater Chest", new Flag(chest.with(Rupees.Red), [-4583, 2965], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, [lakebed2SKReq, lakebedSecondLockReq], ironBootsReq, lakebedEastWaterReq],
        baseDesc: 'Defeat the enemies underwater to have easier access to the chest.'
    })],
    ["Lakebed Temple West Second Floor Southeast Chest", new Flag(smallChest.with(Rupees.Red), [-4561, 3301], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, [lakebed2SKReq, lakebedSecondLockReq], lakebedWestWaterReq],
        baseDesc: 'Go through the middle room accross the spinning gears to get the chest.'
    })],
    ["Lakebed Temple Ooccoo", new Flag(ooccooPot, [-4490, 4552], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'Pick up or break the pot where Ooccoo is hiding.'
    })],
    ["Lakebed Temple Main Room Lock", new Flag(lakebedLock, [-4372, 4666], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed1SKReq, lakebedFirstLockReq]],
        baseDesc: "Unlock this door to reach the second floor of the east wing."
    })],
    ["Lakebed Temple East Water Supply Lock", new Flag(lakebedLock, [-4425, 6048], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, new AndRequirements(lakebedFirstLockReq, lakebed1SKReq)]],
        baseDesc: "Unlock this door to reach the east water supply."
    })],
    ["Lakebed Temple Central Room Small Chest", new Flag(smallChest.with(arrows, 20), [-4518, 4517], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'The chest is accessible when you first get into the room, go down the stairs and take a left.'
    })],
    ["Lakebed Temple Central Room Chest", new Flag(chest.with(lakebedMap), [-4256, 4558], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'The chest is accessible when you first get into the room, manipulate the stairs to reach it.'
    })],
    ["Lakebed Temple East Lower Waterwheel Stalactite Chest", new Flag(chest.with(lakebedSK), [-4506, 5613], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]],
        baseDesc: 'Knock down the stalactite with bombs to make a platform to jump to the chest.'
    })],
    ["Lakebed Temple Before Deku Toad Alcove Chest", new Flag(chest.with(lakebedSK), [-4181, 5694], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], lakebedEastWaterReq],
        baseDesc: 'Defeat the Chus to have an easier time accessing the chest.'
    })],
    ["Lakebed Temple Deku Toad Chest", new Flag(chest.with(clawshots.getItemByIndex(0)), [-3736, 5469], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed3SKReq, lakebedThirdLockReq], ironBootsReq, lakebedEastWaterReq],
        baseDesc: 'Defeat Deku Toad to make it spit out the chest.'
    })],
    ["Lakebed Temple West Lower Small Chest", new Flag(smallChest.with(waterBombs, 10), [-4299, 3311], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, [lakebed2SKReq, lakebedSecondLockReq], lakebedEastWaterReq],
        baseDesc: 'Jump on the hanging platform then shoot the clawshot at the target above the platform with the chest to reach it.'
    })],
    ["Lakebed Temple East Lower Waterwheel Bridge Chest", new Flag(chest.with(heartPiece), [-4718, 5483], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, [lakebed2SKReq, lakebedSecondLockReq], lakebedWestWaterReq],
        baseDesc: 'Once the water level is elevated in the room, press on the switch to open the gate and clawshot the target on the ' + 
                  'back wall to reach the chest. Clawshot the target on the ceiling to get back out.'
    })],
    ["Lakebed Temple Underwater Maze Small Chest", new Flag(smallChest.with(waterBombs, 5), [-4420, 2539], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], clawshotReq, [lakebed2SKReq, lakebedSecondLockReq], lakebedWestWaterReq],
        baseDesc: 'In the section with the entrance to the long tunnel, swim up to find to chest.'
    })],
    ["Lakebed Temple Before Deku Toad Lock", new Flag(lakebedLock, [-4331, 5867], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed3SKReq, new AndRequirements(lakebedSecondLockReq, lakebed1SKReq)], lakebedEastWaterReq],
        baseDesc: "Unlock this door to reach the tunnel to Deku Toad."
    })],
    ["Lakebed Temple East Water Supply Small Chest", new Flag(smallChest.with(bombs, 10), [-4330, 6166], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq]],
        baseDesc: 'Go to the top of the room to reach the chest.'
    })],
    ["Lakebed Temple East Water Supply Clawshot Chest", new Flag(chest.with(Rupees.Purple), [-4378, 6427], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq],
        baseDesc: 'Clawshot the target on the wall behind the chest to reach it.'
    })],
    ["Lakebed Temple West Water Supply Small Chest", new Flag(smallChest.with(bombs, 10), [-4410, 2359], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, lakebedEastWaterReq],
        baseDesc: 'Go to the top of the room using the clawshot targets to reach the chest.'
    })],
    ["Lakebed Temple West Water Supply Chest", new Flag(chest.with(lakebedCompass), [-4362, 2108], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, lakebedEastWaterReq],
        baseDesc: 'Clawshot the target on the wall behind the chest to reach it.'
    })],
    ["Lakebed Temple Central Room Spire Chest", new Flag(chest.with(Rupees.Red), [-4327, 4363], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], lakebedEastWaterReq],
        baseDesc: 'Make the water level rise once by activated the east water supply to access the chest.'
    })],
    ["Lakebed Temple Before Deku Toad Underwater Right Chest", new Flag(chest.with(bombs, 5), [-4021, 5724], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed3SKReq, lakebedThirdLockReq], ironBootsReq, lakebedEastWaterReq],
        baseDesc: 'Walk through the jet stream with the iron boots and take a left to the chest.'
    })],
    ["Lakebed Temple Before Deku Toad Underwater Left Chest", new Flag(chest.with(Rupees.Red), [-4186, 5665], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed3SKReq, lakebedThirdLockReq], ironBootsReq, lakebedEastWaterReq],
        baseDesc: 'Walk away from the jet stream into the tunnel to reach the chest.'
    })],
    ["Lakebed Temple Big Key Chest", new Flag(bossChest.with(lakebedBK), [-4592, 2725], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, lakebedWestWaterReq],
        baseDesc: 'In the room above, hang from the clawshot target and descend towards the chest.'
    })],
    ["Lakebed Temple Boss Lock", new Flag(lakebedBossLock, [-4414, 4362], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, lakebedBKReq, lakebedWestWaterReq],
        baseDesc: "Unlock this door to reach Morpheel."
    })],
    ["Lakebed Temple Morpheel", new Flag(morpheel, [-4416, 4364], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, zoraArmorReq, ironBootsReq, [lakebedBKReq, lakebedBossLockReq], lakebedWestWaterReq],
        baseDesc: 'Defeat Morpheel to clear out the Lakebed Temple.',
        randoReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, zoraArmorReq, ironBootsReq, woodenSwordReq, [lakebedBKReq, lakebedBossLockReq], lakebedWestWaterReq],
    })],
    ["Lakebed Temple Morpheel Heart Container", new Flag(heartContainer, [-4402, 5200], {
        baseReqs: [morpheelReq],
        baseDesc: 'Defeat Morpheel to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, zoraArmorReq, ironBootsReq, woodenSwordReq, [lakebedBKReq, lakebedBossLockReq], lakebedWestWaterReq],
        randoDesc: 'Defeat Morpheel to obtain the item.'
    })],
    ["Lakebed Temple Dungeon Reward", new Flag(fusedShadow, [-4520, 5050], {
        baseReqs: [morpheelReq],
        baseDesc: 'Defeat Morpheel to obtain the third and last Fused Shadow.',
        randoReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], clawshotReq, zoraArmorReq, ironBootsReq, woodenSwordReq, [lakebedBKReq, lakebedBossLockReq], lakebedWestWaterReq],
        randoDesc: 'Defeat Morpheel to obtain the dungeon reward.'
    })],
    // Arbiter's Grounds
    ["Arbiters Grounds Entrance Chest", new Flag(chest.with(arbiterSK), [-5336, 3974], {
        baseReqs: [groundsFirstRoomReq],
        baseDesc: 'Break the wooden barrier and jump across to the chest.'
    })],
    ["Arbiters Grounds Entrance Lock", new Flag(arbitersLock, [-5277, 4323], {
        baseReqs: [groundsFirstRoomReq, [arbiter1SKReq, arbitersFirstLockReq]],
        baseDesc: "Unlock this door to reach the main room of the dungeon."
    })],
    ["Arbiters Grounds Torch Room Poe", new Flag(poeSoul, [-4763, 4329], {
        baseReqs: [shadowCrystalReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
        baseDesc: 'The first of the 4 poes, waits in the middle of the room after the cutscene.'
    })],
    ["Arbiters Grounds Torch Room East Chest", new Flag(chest.with(heartPiece), [-4562, 4481], {
        baseReqs: [groundsFirstRoomReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
        baseDesc: 'Walk across the platforms or use the clawshot to have a way back.'
    })],
    ["Arbiters Grounds Torch Room West Chest", new Flag(chest.with(arbiterMap), [-4561, 4171], {
        baseReqs: [groundsFirstRoomReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
        baseDesc: 'Walk across the quicksand using the sinking platform to reach the chest.'
    })],
    ["Arbiters Grounds West Small Chest Behind Block", new Flag(smallChest.with(Rupees.Red), [-4576, 3840], {
        baseReqs: [groundsFirstRoomReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
        baseDesc: 'Upon entering the room, follow the path to the right to reach the chest.'
    })],
    ["Arbiters Grounds East Turning Room Poe", new Flag(poeSoul, [-4337, 4831], {
        baseReqs: [clawshotReq, shadowCrystalReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
        baseDesc: 'When the room below is spun, clawshot up through the opening, then go in the poe room to defeat it.'
    })],
    ["Arbiters Grounds West Chandelier Chest", new Flag(chest.with(Rupees.Red), [-4920, 3766], {
        baseReqs: [shadowCrystalReq, [arbiter4SKReq, arbitersFourthLockReq], lanternReq],
        baseDesc: 'Pull the chain to raise the chandelier, then cross under it to reach the chest.'
    })],
    ["Arbiters Grounds West Stalfos Northeast Chest", new Flag(smallChest.with(bombs, 5), [-4707, 3322], {
        baseReqs: [shadowCrystalReq, [arbiter4SKReq, arbitersFourthLockReq], lanternReq],
        baseDesc: 'Break the wooden barrier and go to the north-east area to reach the chest.'
    })],
    ["Arbiters Grounds West Stalfos West Chest", new Flag(smallChest.with(bombs, 5), [-4767, 3108], {
        baseReqs: [shadowCrystalReq, [arbiter4SKReq, arbitersFourthLockReq], lanternReq],
        baseDesc: 'Break the wooden barrier and go to the west area to reach the chest.'
    })],
    ["Arbiters Grounds Big Key Chest", new Flag(bossChest.with(arbiterBK), [-4156, 3911], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq],
        baseDesc: 'After clearing the room with the spinner ramps, access to the chest is granted upon entering the next room.'
    })],
    ["Arbiters Grounds East Turning Room Lock", new Flag(arbitersLock, [-4766, 5081], {
        baseReqs: [groundsFirstRoomReq, [arbiter2SKReq, new AndRequirements(arbitersFirstLockReq, arbiter1SKReq)], lanternReq],
        baseDesc: "Unlock this door to reach the eastern wing."
    })],
    ["Arbiters Grounds East Lower Turnable Redead Chest", new Flag(smallChest.with(arbiterSK), [-4626, 4836], {
        baseReqs: [shadowCrystalReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
        baseDesc: 'Dig the sand spot to reveal the lever, then pull it to access the stairs. then, spin the room to gain access to the chest.'
    })],
    ["Arbiters Grounds East Upper Turnable Chest", new Flag(chest.with(arbiterCompass), [-5358, 5475], {
        baseReqs: [groundsFirstRoomReq, [arbiter2SKReq, arbitersSecondLockReq], lanternReq],
        baseDesc: 'Walk up the stairs to find the chest in the area behind the statue.'
    })],
    ["Arbiters Grounds East Upper Turnable Redead Chest", new Flag(chest.with(arbiterSK), [-5241, 5831], {
        baseReqs: [groundsFirstRoomReq, [arbiter2SKReq, arbitersSecondLockReq], lanternReq],
        baseDesc: 'Break the wooden barrier then defeat the Redead to easily open the chest.'
    })],
    ["Arbiters Grounds East Upper Turnable Lock", new Flag(arbitersLock, [-5240, 5251], {
        baseReqs: [groundsFirstRoomReq, [arbiter3SKReq, new AndRequirements(arbitersSecondLockReq, arbiter1SKReq)], lanternReq],
        baseDesc: "Unlock this door to reach the 3rd poe."
    })],
    ["Arbiters Grounds Hidden Wall Poe", new Flag(poeSoul, [-5240, 5021], {
        baseReqs: [shadowCrystalReq, [arbiter3SKReq, arbitersThirdLockReq], lanternReq],
        baseDesc: 'Dig to reveal a lever, then pull it to gain access to the room where the poe awaits.'
    })],
    ["Arbiters Grounds Ghoul Rat Room Chest", new Flag(smallChest.with(arbiterSK), [-4883, 4834], {
        baseReqs: [groundsFirstRoomReq, [arbiter3SKReq, arbitersThirdLockReq], lanternReq],
        baseDesc: 'The chest is below the ring platform.'
    })],
    ["Arbiters Grounds Ghoul Rat Room Lock", new Flag(arbitersLock, [-4767, 4551], {
        baseReqs: [shadowCrystalReq, [arbiter4SKReq, new AndRequirements(arbitersThirdLockReq, arbiter1SKReq)], lanternReq],
        baseDesc: "Unlock this door to reach the chandelier in the torch room."
    })],
    ["Arbiters Grounds West Poe", new Flag(poeSoul, [-5186, 3780], {
        baseReqs: [shadowCrystalReq, [arbiter4SKReq, arbitersFourthLockReq], stalfosReq, lanternReq],
        baseDesc: "Defeat the poe easily by using Midna's charge attack."
    })],
    ["Arbiters Grounds North Turning Room Chest", new Flag(chest.with(arbiterSK), [-4257, 4786], {
        baseReqs: [...poeGateReq],
        baseDesc: 'Enter the tunnel from the entrance with no spikes, then go to the end of it to find the chest.'
    })],
    ["Arbiters Grounds North Turning Room Lock", new Flag(arbitersLock, [-4325, 4791], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, new AndRequirements(arbitersFourthLockReq, arbiter1SKReq)]],
        baseDesc: "Unlock this door to reach the spikes room."
    })],
    ["Arbiters Grounds Ooccoo", new Flag(ooccooPot, [-5201, 4240], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq]],
        baseDesc: 'Pick up or break the pot where Ooccoo is hiding for her to join you.'
    })],
    ["Arbiters Grounds Death Sword Chest", new Flag(chest.with(spinner), [-3598, 4239], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq],
        baseDesc: 'Defeat Death Sword to obtain the Spinner.'
    })],
    ["Arbiters Grounds Spinner Room First Small Chest", new Flag(smallChest.with(bombs, 10), [-4490, 3311], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq],
        baseDesc: 'Use the spinner to float above the quicksand and reach the chest.'
    })],
    ["Arbiters Grounds Spinner Room Second Small Chest", new Flag(smallChest.with(Rupees.Red), [-4486, 3078], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq],
        baseDesc: 'From the previous chest, use the spinner to float above the quicksand and reach the chest.'
    })],
    ["Arbiters Grounds Spinner Room Lower Central Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-4307, 2997], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq],
        baseDesc: 'Hidden under the spinner ramp, use the spinner to float above the quicksand and reach the chest.'
    })],
    ["Arbiters Grounds Spinner Room Stalfos Alcove Chest", new Flag(chest.with(heartPiece), [-4369, 3666], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq],
        baseDesc: 'Use the spinner ramp and defeat the Stalfos to reach this chest.'
    })],
    ["Arbiters Grounds Spinner Room Lower North Chest", new Flag(smallChest.with(Rupees.Yellow), [-4156, 3605], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq],
        baseDesc: 'Use the spinner ramp and defeat the 2 stalfos that are guarding the chest to open it.'
    })],
    ["Arbiters Grounds Boss Lock", new Flag(arbitersBossLock, [-4276, 4326], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq, arbiterBKReq],
        baseDesc: "Unlock this door to reach Stallord."
    })],
    ["Arbiters Grounds Stallord", new Flag(stallord, [-4530, 4332], {
        baseReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq, [arbiterBKReq, arbitersBossLockReq]],
        baseDesc: "Defeat Stallord to clear out the Arbiter's Grounds."
    })],
    ["Arbiters Grounds Stallord Heart Container", new Flag(heartContainer, [-4928, 4384], {
        baseReqs: [stallordReq],
        baseDesc: 'Defeat Stallord to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq, [arbiterBKReq, arbitersBossLockReq]],
        randoDesc: 'Defeat Stallord to obtain the item.'
    })],
    ["Arbiters Grounds Dungeon Reward", new Flag(mirrorShard, [-4726, 4334], {
        itemCategory: Categories.NonChecks,
        baseReqs: [stallordReq],
        baseDesc: 'Defeat Stallord to obtain the dungeon reward.',
        randoCategory: Categories.Main,
        randoReqs: [...poeGateReq, [arbiter5SKReq, arbitersFifthLockReq], stalfosReq, spinnerReq, [arbiterBKReq, arbitersBossLockReq]],
    })],
    // Snowpeak Ruins
    ["Snowpeak Ruins Lobby West Armor Chest", new Flag(smallChest.with(Rupees.Red), [-6017, 4105], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the armor with the Ball and Chain to reveal the chest."
    })],
    ["Snowpeak Ruins Lobby Armor Poe", new Flag(poeSoul, [-6017, 4420], {
        baseReqs: [ballAndChainReq, shadowCrystalReq],
        baseDesc: "Break the armor with the Ball and Chain to reveal the poe."
    })],
    ["Snowpeak Ruins Lobby East Armor Chest", new Flag(smallChest.with(Rupees.Yellow), [-5883, 4428], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the armor with the Ball and Chain to reveal the chest."
    })],
    ["Snowpeak Ruins Lobby Armor Bubble Rupee", new Flag(Rupees.Orange, [-5883, 4119], {
        baseReqs: [ballAndChainReq],
        baseDesc: 'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'
    })],
    ["Snowpeak Ruins Lobby Poe", new Flag(poeSoul, [-5576, 4264], {
        baseReqs: [shadowCrystalReq],
        baseDesc: "The poe is above the ice in the open."
    })],
    ["Snowpeak Ruins Mansion Map", new Flag(snowpeakMap, [-5072, 4316], {
        baseDesc: "Talk to Yeta to obtain the dungeon map.",
        randoCategory: Categories.Gifts,
        randoDes: "Talk to Yeta to obtain the item.",
    })],
    ["Snowpeak Ruins Ooccoo", new Flag(ooccooPot, [-5381, 5064], {
        baseDesc: "Pick up the pot where Ooccoo is hiding."
    })],
    ["Snowpeak Ruins East Courtyard Chest", new Flag(smallChest.with(Rupees.Red), [-4901, 4534], {
        baseDesc: "Near the wall, defeat the Wolfos for easier access."
    })],
    ["Snowpeak Ruins East Courtyard Buried Chest", new Flag(smallChest.with(snowpeakSK), [-4495, 4530], {
        baseReqs: [shadowCrystalReq],
        baseDesc: "Dig the spot where the chest is poking out of."
    })],
    ["Snowpeak Ruins East Corrider Lock", new Flag(snowpeakLock, [-4239, 4797], {
        baseReqs: [snowpeak1SKReq],
        baseDesc: "Unlock this door to reach the north-eastern section of the first floor."
    })],
    ["Snowpeak Ruins Ordon Pumpkin Chest", new Flag(chest.with(pumpkin), [-4369, 5305], {
        baseReqs: [[snowpeak1SKReq, ruinsCorridorLockReq]],
        baseDesc: "Defeat the 2 Chilfos to unlock the door and gain access to the chest.",
        randoReqs: [[snowpeak1SKReq, ruinsCorridorLockReq, new AndRequirements(ruinsLobbyLockReq, ballAndChainReq, clawshotReq)]],
    })],
    ["Snowpeak Ruins West Courtyard Buried Chest", new Flag(smallChest.with(snowpeakSK), [-4462, 3961], {
        baseReqs: [shadowCrystalReq, pumpkinReq],
        baseDesc: "Dig twice on the elevated snow to reveal the chest.",
        randoReqs: [shadowCrystalReq, [ballAndChainReq, pumpkinReq]],
    })],
    ["Snowpeak Ruins Courtyard Central Chest", new Flag(smallChest.with(bombs, 5), [-4943, 4269], {
        baseReqs: [pumpkinReq, [snowpeak1SKReq, ruinsCourtyardLockReq], bombBagReq],
        baseDesc: "Use the cannon or the ball and chain to break the ice that is blocking the chest.",
        randoReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, [snowpeak1SKReq, ruinsCourtyardLockReq], bombBagReq])]],
    })],
    ["Snowpeak Ruins Courtyard West Lock", new Flag(snowpeakLock, [-4611, 3842], {
        baseReqs: [pumpkinReq, snowpeak1SKReq],
        baseDesc: "Unlock this door to reach the cannonballs of the western corridor.",
        randoReqs: [snowpeak1SKReq, [ballAndChainReq, pumpkinReq]],
    })],
    ["Snowpeak Ruins West Cannon Room Central Chest", new Flag(smallChest.with(Rupees.Red), [-4157, 3214], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the ice in front of the chest to reveal it."
    })],
    ["Snowpeak Ruins West Cannon Room Corner Chest", new Flag(smallChest.with(bombs, 5), [-4015, 3896], {
        baseReqs: [pumpkinReq, bombBagReq],
        baseDesc: "Use the cannon or the ball and chain to break the ice that is blocking the chest.",
        randoReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, bombBagReq])]],
    })],
    ["Snowpeak Ruins Wooden Beam Central Chest", new Flag(smallChest.with(Rupees.Red), [-4814, 3397], {
        baseReqs: [pumpkinReq, bombBagReq],
        baseDesc: "Jump across the wooden planks to reach the chest.",
        randoReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, bombBagReq])]],
    })],
    ["Snowpeak Ruins Wooden Beam Northwest Chest", new Flag(chest.with(snowpeakCompass), [-4926, 3578], {
        baseReqs: [pumpkinReq, bombBagReq],
        baseDesc: "Jump across the wooden planks to reach the chest.",
        randoReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, bombBagReq])]],
    })],
    ["Snowpeak Ruins Broken Floor Chest", new Flag(chest.with(heartPiece), [-5373, 3541], {
        baseReqs: [cheeseReq, ballAndChainReq],
        baseDesc: "Break the damaged floor and jump down to chest.",
        glitchedReqs: [[boomerangReq, new AndRequirements([cheeseReq, ballAndChainReq])]],
        glitchedDesc: "Break the damaged floor and jump down to chest or LJA from the other entrance of the room to the chest.",
    })],
    ["Snowpeak Ruins Ball and Chain", new Flag(ballAndChain, [-4072, 4270], {
        baseReqs: [pumpkinReq, [snowpeak1SKReq, ruinsCourtyardLockReq], bombBagReq],
        baseDesc: "Defeat Darkhammer to obtain the Ball and Chain.",
        randoReqs: [[ballAndChainReq, new AndRequirements([pumpkinReq, [snowpeak1SKReq, ruinsCourtyardLockReq], bombBagReq])]],
        randoDesc: "Pick up the Ball and Chain to receive the item.",
    })],
    ["Snowpeak Ruins Chest After Darkhammer", new Flag(chest.with(cheese), [-3611, 4265], {
        baseReqs: [ballAndChainReq],
        baseDesc: "Break the ice blocks to gain access to the chest."
    })],
    ["Snowpeak Ruins Armor Bubble Rupee After Darkhammer", new Flag(Rupees.Orange, [-3767, 4348], {
        baseReqs: [ballAndChainReq],
        baseDesc: 'Break the armor to reveal an Ice Bubble. Upon defeat, it will drop an Orange Rupee.'
    })],
    ["Snowpeak Ruins Chapel Chest", new Flag(chest.with(snowpeakBK), [-3854, 3400], {
        baseReqs: [ballAndChainReq, bombBagReq, [snowpeak2SKReq, ruinsIceRoomLockReq], cheeseReq],
        baseDesc: "Defeat all the Chilfos to unlock the door and access the chest."
    })],
    ["Snowpeak Ruins Ice Room Poe", new Flag(poeSoul, [-5198, 5214], {
        baseReqs: [cheeseReq, ballAndChainReq, [snowpeak1SKReq, ruinsLobbyLockReq], shadowCrystalReq],
        baseDesc: "Break the ice blocks with the Ball and Chain to reveal the poe."
    })],
    ["Snowpeak Ruins Lobby Chandelier Chest", new Flag(chest.with(heartPiece), [-5833, 4268], {
        baseReqs: [cheeseReq, ballAndChainReq, [snowpeak1SKReq, ruinsLobbyLockReq]],
        baseDesc: "Swing from chandelier to chandelier to reach the chest.<br>Tip: Hit the last chandelier when yours is almost at the furthest from the chest."
    })],
    ["Snowpeak Ruins Northeast Chandelier Chest", new Flag(smallChest.with(snowpeakSK), [-4392, 5147], {
        baseReqs: [cheeseReq, ballAndChainReq, [snowpeak1SKReq, ruinsLobbyLockReq], clawshotReq],
        baseDesc:  "Swing from the chandeliers to reach the chest."
    })],
    ["Snowpeak Ruins Wooden Beam Chandelier Chest", new Flag(chest.with(snowpeakSK), [-4563, 3408], {
        baseReqs: [cheeseReq, ballAndChainReq],
        baseDesc: "Swing the chandelier with the Ball and Chain to reach the chest."
    })],
    ["Snowpeak Ruins Lobby Lock", new Flag(snowpeakLock, [-5366, 3839], {
        baseReqs: [cheeseReq, ballAndChainReq, snowpeak1SKReq],
        baseDesc: "Unlock this door to reach the second floor of the lobby."
    })],
    ["Snowpeak Ruins Ice Room Lock", new Flag(snowpeakLock, [-5148, 4597], {
        baseReqs: [cheeseReq, ballAndChainReq, [snowpeak2SKReq, new AndRequirements([snowpeak1SKReq, ruinsLobbyLockReq])]],
        baseDesc: "Unlock this door to reach the central courtyard cannon."
    })],
    ["Snowpeak Ruins Boss Lock", new Flag(snowpeakBossLock, [-4340, 4268], {
        baseReqs: [ballAndChainReq, bombBagReq, [snowpeak2SKReq, ruinsIceRoomLockReq], cheeseReq, bedroomKeyReq],
        baseDesc: "Unlock this door to reach Blizzeta."
    })],
    ["Snowpeak Ruins Blizzeta", new Flag(blizzeta, [-4174, 4268], {
        baseReqs: [ballAndChainReq, bombBagReq, [snowpeak2SKReq, ruinsIceRoomLockReq], cheeseReq, [bedroomKeyReq, ruinsBossLockReq]],
        baseDesc: 'Defeat Blizzeta to clear out the Snowpeak Ruins.'
    })],
    ["Snowpeak Ruins Blizzeta Heart Container", new Flag(heartContainer, [-3963, 4358], {
        baseReqs: [blizzetaReq],
        baseDesc: "Defeat Blizzeta to obtain the Heart Container.",
        randoCategory: Categories.Main,
        randoReqs: [ballAndChainReq, bombBagReq, [snowpeak2SKReq, ruinsIceRoomLockReq], cheeseReq, [bedroomKeyReq, ruinsBossLockReq]],
        randoDesc: "Defeat Blizzeta to obtain the item."
    })],
    ["Snowpeak Ruins Dungeon Reward", new Flag(mirrorShard, [-4066, 4170], {
        baseReqs: [blizzetaReq],
        baseDesc: "Defeat Blizzeta to obtain the Mirror Shard.",
        randoReqs: [ballAndChainReq, bombBagReq, [snowpeak2SKReq, ruinsIceRoomLockReq], cheeseReq, [bedroomKeyReq, ruinsBossLockReq]],
        randoDesc: "Defeat Blizzeta and leave the dungeon via the Midna warp to obtain the item.",
    })],
    // Temple of Time
    ["Temple of Time Lobby Lantern Chest", new Flag(chest.with(templeSK), [-5497, 4635], {
        baseReqs: [lanternReq],
        baseDesc: 'Light the 2 torches to make the chest appear.'
    })],
    ["Temple of Time Boss Lock", new Flag(templeBossLock, [-4197, 4350], {
        baseReqs: [spinnerReq, bowReq, [temple3SKReq, templeDarknutLockReq], pastDomRodReq, templeBKReq],
        baseDesc: "Unlock this door to reach Armogohma.",
        randoReqs: [pastDomRodReq, bowReq, templeBKReq, [doorOfTimeReq, new AndRequirements([[temple3SKReq, templeDarknutLockReq], spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]]
    })],
    ["Temple of Time Armogohma", new Flag(armogohma, [-3724, 4352], {
        baseReqs: [spinnerReq, bowReq, [temple3SKReq, templeDarknutLockReq], pastDomRodReq, [templeBKReq, templeBossLockReq]],
        baseDesc: 'Defeat Armogohma to clear out the Temple of Time.',
        randoReqs: [pastDomRodReq, bowReq, [templeBKReq, templeBossLockReq], [doorOfTimeReq, new AndRequirements([[temple3SKReq, templeDarknutLockReq], spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]],
    })],
    ["Temple of Time Armogohma Heart Container", new Flag(heartContainer, [-3880, 4480], {
        baseReqs: [armogohmaReq],
        baseDesc: 'Defeat Armogohma to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [pastDomRodReq, bowReq, [templeBKReq, templeBossLockReq], [doorOfTimeReq, new AndRequirements([[temple3SKReq, templeDarknutLockReq], spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]],
        randoDesc: 'Defeat Armogohma to obtain the item.'
    })],
    ["Temple of Time Dungeon Reward", new Flag(mirrorShard, [-3880, 4350], {
        baseReqs: [armogohmaReq],
        baseDesc: 'Defeat Armogohma to obtain the Mirror Shard.',
        randoReqs: [pastDomRodReq, bowReq, [templeBKReq, templeBossLockReq], [doorOfTimeReq, new AndRequirements([[temple3SKReq, templeDarknutLockReq], spinnerReq, [bombBagReq, woodenSwordReq, ballAndChainReq]])]],
        randoDesc: "Defeat Armogohma to obtain the dungeon reward."
    })],
    ["Temple of Time First Staircase Gohma Gate Chest", new Flag(smallChest.with(arrows, 30), [-6173, 4351], {
        baseReqs: [[temple1SKReq, templeFirstLockReq]],
        baseDesc: 'Put a pot on the pressure plate in the middle of the room to open the gate and gain access to the chest.'
    })],
    ["Temple of Time Ooccoo", new Flag(ooccoo, [-5725, 4352], {
        baseDesc: 'After opening the chest, Ooccoo will wait for you to join her at the top of the stairs.'
    })],
    ["Temple of Time Lobby Lock", new Flag(templeLock, [-5842, 4352], {
        baseReqs: [temple1SKReq],
        baseDesc: "Unlock this door to reach the first staircase."
    })],
    ["Temple of Time First Staircase Armos Chest", new Flag(chest.with(templeMap), [-5750, 5148], {
        baseReqs: [[temple1SKReq, templeFirstLockReq]],
        baseDesc: 'Defeat the Armos to make the chest appear.',
        randoReqs: [[temple1SKReq, templeFirstLockReq], [woodenSwordReq, bowReq, bombBagReq, spinnerReq, clawshotReq, ballAndChainReq]],
    })],
    ["Temple of Time First Staircase Window Chest", new Flag(smallChest.with(Rupees.Red), [-5818, 5015], {
        baseReqs: [[temple1SKReq, templeFirstLockReq]],
        baseDesc: 'Climb up to reach the ledge where the chest is to reach it.'
    })],
    ["Temple of Time Poe Behind Gate", new Flag(poeSoul, [-5453, 3966], {
        baseReqs: [[temple1SKReq, templeFirstLockReq], pastDomRodReq, shadowCrystalReq],
        baseDesc: 'Break the barrier with the Hammer Statue or put an Iron Pot on the pressure plate behind the gate to get the poe.'
    })],
    ["Temple of Time Armos Antechamber East Chest", new Flag(chest.with(templeSK), [-5956, 4149], {
        baseReqs: [[temple1SKReq, templeFirstLockReq], spinnerReq],
        baseDesc: 'Defeat the 2 Armos to make the chest appear.',
    })],
    ["Temple of Time Armos Antechamber North Chest", new Flag(smallChest.with(Rupees.Red), [-6244, 4351], {
        baseReqs: [[temple1SKReq, templeFirstLockReq], spinnerReq],
        baseDesc: 'You will find this chest in the back of the room, on the elevated ledge.'
    })],
    ["Temple of Time Armos Antechamber Statue Chest", new Flag(chest.with(heartPiece), [-5956, 4566], {
        baseReqs: [[temple1SKReq, templeFirstLockReq], spinnerReq, pastDomRodReq],
        baseDesc: 'Throw two Iron Pots into the railings in the back of the room, and make them fall onto the two pressure plates to make the chest appear.'
    })],
    ["Temple of Time Second Staircase Lock", new Flag(templeLock, [-5147, 4350], {
        baseReqs: [[temple2SKReq, new AndRequirements([templeFirstLockReq, temple1SKReq])], spinnerReq],
        baseDesc: "Unlock this door to reach the second staircase."
    })],
    ["Temple of Time Moving Wall Beamos Room Chest", new Flag(chest.with(templeCompass), [-4977, 3945], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq],
        baseDesc: 'Hit the crystal twice to reach the chest: Once when you are at sword range, the other when you are halfway across the room.',
        randoReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, [bowReq, clawshotReq, ballAndChainReq]],
    })],
    ["Temple of Time Moving Wall Dinalfos Room Chest", new Flag(chest.with(heartPiece), [-5054, 3343], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq, pastDomRodReq],
        baseDesc: 'Use the Dominion Rod on the Iron Pot to make it step on the pressure plate, disabling the electricity and granting access to the chest.'
    })],
    ["Temple of Time Scales Gohma Chest", new Flag(chest.with(Rupees.Purple), [-5319, 4374], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq],
        baseDesc: 'Defeat all the Gohmas in the room (Baby Gohmas and Young Gohmas) to make the chest appear.'
    })],
    ["Temple of Time Scales Upper Chest", new Flag(smallChest.with(Rupees.Red), [-5654, 4496], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq, clawshotReq],
        baseDesc: 'Follow the right edge until you reach the chest.'
    })],
    ["Temple of Time Poe Above Scales", new Flag(poeSoul, [-5386, 4591], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq, clawshotReq, shadowCrystalReq],
    })],
    ["Temple of Time Big Key Chest", new Flag(bossChest.with(templeBK), [-5451, 4960], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq, clawshotReq],
        baseDesc: 'Use the two Iron Pots and the two Helmasaur Shells on the four elevated pressure plates to open the gate that is blocking the chest.'
    })],
    ["Temple of Time Floor Switch Puzzle Room Upper Chest", new Flag(smallChest.with(Rupees.Red), [-5452, 5081], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq, clawshotReq],
        baseDesc: 'Clawshot the target on the ceiling to reach the chest.'
    })],
    ["Temple of Time Guillotine Chest", new Flag(chest.with(templeSK), [-6178, 4981], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq],
        baseDesc: 'Avoid the traps and go behind the sharp pendulum to reach the chest.'
    })],
    ["Temple of Time Chest Before Darknut", new Flag(chest.with(Rupees.Purple), [-5383, 4976], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq],
        baseDesc: 'Defeat all the Baby Gohmas to make the chest appear.'
    })],
    ["Temple of Time Darknut Lock", new Flag(templeLock, [-5511, 4545], {
        baseReqs: [[temple3SKReq, new AndRequirements([templeSecondLockReq, temple1SKReq])], spinnerReq, bowReq],
        baseDesc: 'Unlock this door to reach the Darknut miniboss.'
    })],
    ["Temple of Time Darknut Chest", new Flag(chest.with(dominionRods.getItemByIndex(0)), [-5511, 3804], {
        baseReqs: [[temple3SKReq, templeDarknutLockReq], spinnerReq, bowReq],
        baseDesc: 'Defeat the Darknut to open the gate that is blocking access to the chest.',
        randoReqs:  [[temple3SKReq, templeDarknutLockReq], spinnerReq, bowReq, [bombBagReq, woodenSwordReq, ballAndChainReq]],
    })],
    // City in the Sky
    ["City in The Sky Aeralfos Chest", new Flag(chest.with(clawshots.getItemByIndex(1)), [-4586, 5765], {
        baseReqs: [clawshotReq, spinnerReq, ironBootsReq, [city1SKReq, cityFirstLockReq], boomerangReq],
        baseDesc: 'After defeating the Aeralfos, clawshot the target above the chest to reach it.'
    })],
    ["City in The Sky East Wing Lower Level Chest", new Flag(chest.with(cityCompass), [-4641, 4857], {
        baseReqs: [spinnerReq, [city1SKReq, cityFirstLockReq], doubleClawshotReq],
        baseDesc: 'From the east entrance, follow the falling clawshot target path to reach the chest.'
    })],
    ["City in The Sky West Wing Baba Balcony Chest", new Flag(smallChest.with(arrows, 20), [-4404, 2998], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the clawshot target path, and clawshot the metal mesh above the platform with the chest to reach it.'
    })],
    ["City in The Sky Underwater West Chest", new Flag(chest.with(waterBombs, 15), [-5819, 3835], {
        baseReqs: [ironBootsReq],
        baseDesc: 'Sink to the chest to open it.'
    })],
    ["City in The Sky Underwater East Chest", new Flag(chest.with(Rupees.Red), [-5819, 4039], {
        baseReqs: [ironBootsReq],
        baseDesc: 'Sink to the chest to open it.'
    })],
    ["City in The Sky Ooccoo", new Flag(ooccoo, [-5780, 4471], {
        baseDesc: 'Speak to Ooccoo in the shop for her to join you one last time.'
    })],
    ["City in The Sky Lock", new Flag(cityLock, [-4608, 4822], {
        baseReqs: [city1SKReq],
        baseDesc: "Unlock this door to reach the east wing."
    })],
    ["City in The Sky East First Wing Chest After Fans", new Flag(chest.with(cityMap), [-4638, 5442], {
        baseReqs: [clawshotReq, spinnerReq, [city1SKReq, cityFirstLockReq]],
        baseDesc: 'When you enter the room, the chest is on the right.'
    })],
    ["City in The Sky East Tile Worm Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-4773, 5276], {
        baseReqs: [clawshotReq, spinnerReq, [city1SKReq, cityFirstLockReq]],
        baseDesc: 'Follow the platforms than take a left, avoiding the Tile Worms on the way to reach the chest.'
    })],
    ["City in The Sky West Wing First Chest", new Flag(chest.with(citySK), [-4638, 2693], {
        baseReqs: [clawshotReq, spinnerReq],
        baseDesc: 'Clawshot the target on the ceiling above the chest and drop down to it.',
        randoReqs: [clawshotReq, [spinnerReq, doubleClawshotReq]],
    })],
    ["City in The Sky West Wing Narrow Ledge Chest", new Flag(smallChest.with(Rupees.Red), [-4542, 2796], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'At the end of clawshot path, jump on the narrow platform with the chest to reach it.'
    })],
    ["City in The Sky West Wing Tile Worm Chest", new Flag(smallChest.with(bombs, 10), [-4432, 3028], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Jump across the plateforms while avoiding the Tile Worm to reach the chest.'
    })],
    ["City in The Sky Chest Behind North Fan", new Flag(chest.with(Rupees.Purple), [-3902, 3938], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq],
        baseDesc: 'Clawshot the mesh in front of the fan, then enter the hole in the mesh to find the chest.'
    })],
    ["City in The Sky North Aeralfos Rupee", new Flag(Rupees.Orange, [-3741, 4041], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq],
        baseDesc: "Defeat the Aeralfos to sometimes obtain an Orange Rupee. " + 
                  "The Aeralfos do not respawn, so set this flag is they are defeated even if you did not obtain the rupee."
    })],
    ["City in The Sky East Wing After Dinalfos Alcove Chest", new Flag(smallChest.with(Rupees.Red), [-4916, 5456], {
        baseReqs: [clawshotReq, spinnerReq, [city1SKReq, cityFirstLockReq], boomerangReq],
        baseDesc: 'Open the gate by clawshotting the switch near the entrance of the room, then use an Oocca and a draft to reach the chest.'
    })],
    ["City in The Sky East Wing After Dinalfos Ledge Chest", new Flag(chest.with(Rupees.Purple), [-4902, 5081], {
        baseReqs: [clawshotReq, spinnerReq, [city1SKReq, cityFirstLockReq], boomerangReq],
        baseDesc: 'From the entrance of the room, fly through drafts with an Oocca to reach the chest.'
    })],
    ["City in The Sky West Garden Lone Island Chest", new Flag(chest.with(Rupees.Purple), [-4916, 2736], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Clawshot the flying Peahats until you reach the platform with the big tree where the chest lies.'
    })],
    ["City in The Sky Garden Island Poe", new Flag(poeSoul, [-4920, 2875], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Clawshot the flying Peahats until you reach the platform with the big tree where the poe awaits.'
    })],
    ["City in The Sky West Garden Lower Chest", new Flag(smallChest.with(bombs, 5), [-4523, 2864], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Upon traversing the small oval opening while hanging from the flying Peahat, drop down and head west to the chest.'
    })],
    ["City in The Sky Baba Tower Alcove Chest", new Flag(chest.with(heartPiece), [-4318, 2710], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'At the end of the narrow path, hang on the ledge and move right until you reach the chest.'
    })],
    ["City in The Sky Baba Tower Narrow Ledge Chest", new Flag(smallChest.with(arrows, 20), [-4151, 2867], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Follow the narrow path, the chest is on the left.'
    })],
    ["City in The Sky Chest Below Big Key Chest", new Flag(smallChest.with(Rupees.Red), [-4536, 3936], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Enter the room from outside, then go around the blowing fan to reach the chest.'
    })],
    ["City in The Sky West Garden Corner Chest", new Flag(smallChest.with(Rupees.Red), [-4676, 2604], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'Clawshot the flying Peahats until you reach the chest.'
    })],
    ["City in The Sky West Garden Ledge Chest", new Flag(chest.with(heartPiece), [-4772, 2952], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'From the eastmost flying Peahat, clawshot your way to the room entrance with the chest.'
    })],
    ["City in The Sky Baba Tower Top Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-4198, 2611], {
        baseReqs: [doubleClawshotReq],
        baseDesc: 'After climbing the vines from the first falling clawshot target, turn around and jump on the platform with the chest.'
    })],
    ["City in The Sky Central Outside Ledge Chest", new Flag(smallChest.with(Rupees.Red), [-4703, 3949], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Follow the clawshot and rope path, then climb the vines to reach the chest.'
    })],
    ["City in The Sky Central Outside Poe Island Chest", new Flag(chest.with(Rupees.Purple), [-4601, 4286], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Follow the clawshot and rope path until you reach the platform with the poe, where the chest is also located.'
    })],
    ["City in The Sky Big Key Chest", new Flag(bossChest.with(cityBK), [-4609, 3835], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Go around the blowing fan to reach the chest.'
    })],
    ["City in The Sky Poe Above Central Fan", new Flag(poeSoul, [-4647, 4230], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq],
        baseDesc: 'Follow the clawshot and rope path until you reach the platform with the poe.'
    })],
    ["City in The Sky Boss Lock", new Flag(cityBossLock, [-3900, 3936], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, cityBKReq],
        baseDesc: "Unlock this door to reach Argorok."
    })],
    ["City in The Sky Argorok", new Flag(argorok, [-3923, 3841], {
        baseReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, [cityBKReq, cityBossLockReq]],
        baseDesc: 'Defeat Argorok to clear out the City in the Sky.',
        randoReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, [cityBKReq, cityBossLockReq], woodenSwordReq],
    })],
    ["City in The Sky Argorok Heart Container", new Flag(heartContainer, [-3877, 3766], {
        baseReqs: [argorokReq],
        baseDesc: 'Defeat Argorok to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, [cityBKReq, cityBossLockReq], woodenSwordReq],
        randoDesc: 'Defeat Argorok to obtain the item.',
    })],
    ["City in The Sky Dungeon Reward", new Flag(mirrorShard, [-3789, 3712], {
        baseReqs: [argorokReq],
        baseDesc: "Defeat Argorok to obtain the Mirror Shard.",
        randoReqs: [doubleClawshotReq, shadowCrystalReq, ironBootsReq, [cityBKReq, cityBossLockReq], woodenSwordReq],
        randoDesc: "Defeat Argorok to obtain the dungeon reward."
    })],
    // Palace of Twilight
    ["Palace of Twilight Collect Both Sols", new Flag(swords.getItemByIndex(3), [-5877, 4329], {
        baseReqs: [clawshotReq, westSolReq, eastSolReq],
        baseDesc: 'Bring both Sols to their pedestal to obtain the Light Filled Master Sword.',
        randoReqs: [clawshotReq, [palace4SKReq, new AndRequirements([westSolReq, eastSolReq])], [shadowCrystalReq, woodenSwordReq]],
    })],
    ["Palace of Twilight West Wing Chest Behind Wall of Darkness", new Flag(chest.with(heartPiece), [-5400, 3585], {
        baseReqs: [clawshotReq, [westSolReq, lightMasterSwordReq]],
        baseDesc: 'Disperse the fog with a Sol or the Light Filled Master Sword, then clawshot the target behind the chest to reach it.',
        randoReqs: [clawshotReq, [lightMasterSwordReq, new AndRequirements([palace2SKReq, [shadowCrystalReq, woodenSwordReq]])], bombBagReq],
    })],
    ["Palace of Twilight West Wing First Room Central Chest", new Flag(chest.with(palaceSK), [-5285, 3867], {
        baseReqs: [[masterSwordReq, shadowCrystalReq]],
        baseDesc: 'Defeat the Zant Mask to make the chest appear.',
        randoReqs: [[woodenSwordReq, shadowCrystalReq]],
    })],
    ["Palace of Twilight West Wing First Lock", new Flag(palaceLock, [-5209, 3867], {
        baseReqs: [clawshotReq, palace1SKReq],
        baseDesc: "Unlock this door to reach the second room of the west wing."
    })],
    ["Palace of Twilight West Wing Second Room Central Chest", new Flag(chest.with(palaceSK), [-4837, 3868], {
        baseReqs: [clawshotReq, [palace1SKReq, palaceWestFirstLockReq], [masterSwordReq, shadowCrystalReq]],
        baseDesc: 'Defeat the Zant Mask in the fog to make the chest appear.'
    })],
    ["Palace of Twilight West Wing Second Room Lower South Chest", new Flag(chest.with(palaceCompass), [-5060, 3956], {
        baseReqs: [clawshotReq, [palace1SKReq, palaceWestFirstLockReq], [masterSwordReq, shadowCrystalReq]],
        baseDesc: 'Defeat the Zant Mask in the fog to make the chest appear.'
    })],
    ["Palace of Twilight West Wing Second Room Southeast Chest", new Flag(chest.with(Rupees.Orange), [-5072, 4018], {
        baseReqs: [[palace1SKReq, palaceWestFirstLockReq], doubleClawshotReq],
        baseDesc: 'Use a Sol or the double clawshot to reach the chest.',
        randoReqs: [[palace1SKReq, palaceWestFirstLockReq], [doubleClawshotReq, westSolReq]],
    })],
    ["Palace of Twilight West Wing Second Lock", new Flag(palaceLock, [-4676, 3867], {
        baseReqs: [clawshotReq, [palace2SKReq, new AndRequirements([palaceWestFirstLockReq, palace1SKReq])]],
        baseDesc: "Unlock this door to reach the west Sol."
    })],
    ["Palace of Twilight East Wing First Room Zant Head Chest", new Flag(chest.with(palaceSK), [-5268, 4846], {
        baseReqs: [westSolReq, clawshotReq, [masterSwordReq, shadowCrystalReq]],
        baseDesc: 'Defeat the Zant Mask to make the chest appear.',
        randoReqs: [clawshotReq, [woodenSwordReq, shadowCrystalReq]],
    })],
    ["Palace of Twilight East Wing First Room North Small Chest", new Flag(smallChest.with(Rupees.Purple), [-5266, 4704], {
        baseReqs: [westSolReq, clawshotReq],
        baseDesc: 'Make your way across the moving platforms to reach the chest.',
        randoReqs: [clawshotReq],
    })],
    ["Palace of Twilight East Wing First Room West Alcove Chest", new Flag(smallChest.with(Rupees.Purple), [-5420, 4644], {
        baseReqs: [lightMasterSwordReq],
        baseDesc: 'After obtaining Light Filled Master Sword, return to this room and simply ride the plaftorm below the west alcove until it brings you to the chest.',
        randoReqs: [bothSolReq],
        randoDesc: 'With the Light Filled Master Sword, ride the plaftorm below the west alcove until it brings you to the chest.',
    })],
    ["Palace of Twilight East Wing First Room East Alcove Chest", new Flag(chest.with(heartPiece), [-5420, 4902], {
        baseReqs: [lightMasterSwordReq],
        baseDesc: 'After obtaining the Light Filled Master Sword, return to this room and simply ride the plaftorm below the east alcove until it brings you to the chest.',
        randoReqs: [bothSolReq],
        randoDesc: 'With the Light Filled Master Sword, ride the plaftorm below the east alcove until it brings you to the chest.',
    })],
    ["Palace of Twilight East Wing First Lock", new Flag(palaceLock, [-5209, 4773], {
        baseReqs: [westSolReq, clawshotReq, palace1SKReq],
        baseDesc: "Unlock this door to reach the second room of the east wing.",
        randoReqs: [clawshotReq, palace1SKReq],
    })],
    ["Palace of Twilight East Wing Second Room Southwest Chest", new Flag(chest.with(palaceMap), [-4944, 4606], {
        baseReqs: [westSolReq, [palace1SKReq, palaceEastFirstLockReq], doubleClawshotReq],
        baseDesc: 'Use the Double Clawshot to reach the chest.',
        randoReqs: [[new AndRequirements([[palace1SKReq, palaceEastFirstLockReq], doubleClawshotReq]), new AndRequirements([[palace2SKReq, palaceEastSecondLockReq], clawshotReq, [woodenSwordReq, shadowCrystalReq]])]],
        randoDesc: 'Use the Double Clawshot or the Sol to reach the chest.',
    })],
    ["Palace of Twilight East Wing Second Room Northwest Chest", new Flag(smallChest.with(Rupees.Purple), [-4822, 4606], {
        baseReqs: [westSolReq, clawshotReq, [palace1SKReq, palaceEastFirstLockReq]],
        baseDesc: 'Clawshot the wall target from the platform with the northern door to reach the chest.',
        randoReqs: [clawshotReq, [palace1SKReq, palaceEastFirstLockReq]],
    })],
    ["Palace of Twilight East Wing Second Room Northeast Chest", new Flag(smallChest.with(Rupees.Purple), [-4873, 4940], {
        baseReqs: [westSolReq, [palace1SKReq, palaceEastFirstLockReq], doubleClawshotReq],
        baseDesc: 'Use the Double Clawshot to reach the chest.',
        randoReqs: [[new AndRequirements([[palace1SKReq, palaceEastFirstLockReq], doubleClawshotReq]), new AndRequirements([[palace2SKReq, palaceEastSecondLockReq], clawshotReq, [woodenSwordReq, shadowCrystalReq]])]],
        randoDesc: 'Use the Double Clawshot or the Sol to reach the chest.',
    })],
    ["Palace of Twilight East Wing Second Room Southeast Chest", new Flag(chest.with(palaceSK), [-4944, 4940], {
        baseReqs: [westSolReq, [palace1SKReq, palaceEastFirstLockReq], doubleClawshotReq],
        baseDesc: 'Use the Double Clawshot to reach the chest.',
        randoReqs: [[new AndRequirements([[palace1SKReq, palaceEastFirstLockReq], doubleClawshotReq]), new AndRequirements([[palace2SKReq, palaceEastSecondLockReq], clawshotReq, [woodenSwordReq, shadowCrystalReq]])]],
        randoDesc: 'Use the Double Clawshot or the Sol to reach the chest.',
    })],
    ["Palace of Twilight East Wing Second Lock", new Flag(palaceLock, [-4676, 4773], {
        baseReqs: [clawshotReq, [palace2SKReq, new AndRequirements([palaceEastFirstLockReq, palace1SKReq])]],
        baseDesc: "Unlock this door to reach the east Sol."
    })],
    ["Palace of Twilight Central First Room Chest", new Flag(chest.with(palaceSK), [-4994, 4469], {
        baseReqs: [lightMasterSwordReq],
        baseDesc: 'Defeat all the Zant Masks to make the chest appear.'
    })],
    ["Palace of Twilight Big Key Chest", new Flag(bossChest.with(palaceBK), [-4762, 4101], {
        baseReqs: [lightMasterSwordReq, [palace1SKReq, palaceCentralFirstLockReq], doubleClawshotReq],
        baseDesc: 'Clear out the fog cascade, then clawshot your way up to the chest.'
    })],
    ["Palace of Twilight Central Outdoor Chest", new Flag(chest.with(palaceSK), [-4562, 4007], {
        baseReqs: [lightMasterSwordReq, [palace1SKReq, palaceCentralFirstLockReq]],
        baseDesc: 'Defeat all the Zant Masks (the first one is on the isolated south platform) to make the chest appear.'
    })],
    ["Palace of Twilight Central Tower Chest", new Flag(chest.with(palaceSK), [-4640, 4251], {
        baseReqs: [lightMasterSwordReq, clawshotReq, [palace2SKReq, palaceCentralSecondLockReq]],
        baseDesc: 'Defeat the two Zant Masks on both sides of the room to make the chest appear.'
    })],
    ["Palace of Twilight Central First Room Lock", new Flag(palaceLock, [-4886, 4108], {
        baseReqs: [lightMasterSwordReq, palace1SKReq],
        baseDesc: "Unlock this door to reach the central outdoor area."
    })],
    ["Palace of Twilight Central Outdoor Lock", new Flag(palaceLock, [-4627, 4116], {
        baseReqs: [lightMasterSwordReq, [palace2SKReq, new AndRequirements([palaceCentralFirstLockReq, palace1SKReq])]],
        baseDesc: "Unlock this door to reach the tower climbing room."
    })],
    ["Palace of Twilight Before Zant Lock", new Flag(palaceLock, [-4334, 4326], {
        baseReqs: [lightMasterSwordReq, clawshotReq, [palace3SKReq, new AndRequirements([palaceCentralSecondLockReq, palace1SKReq])]],
        baseDesc: "Unlock this door to reach the Twilit Messenger fight before Zant."
    })],
    ["Palace of Twilight Boss Lock", new Flag(palaceBossLock, [-3907, 4326], {
        baseReqs: [lightMasterSwordReq, [palace3SKReq, palaceCentralThirdLockReq], palaceBKReq],
        baseDesc: "Unlock this door to reach Zant."
    })],
    ["Palace of Twilight Zant", new Flag(zant, [-3721, 4325], {
        baseReqs: [lightMasterSwordReq, [palace3SKReq, palaceCentralThirdLockReq], [palaceBKReq, palaceBossLockReq], boomerangReq, zoraArmorReq, ironBootsReq, ballAndChainReq],
        baseDesc: 'Defeat Zant to clear out the Palace of Twilight.'
    })],
    ["Palace of Twilight Zant Heart Container", new Flag(heartContainer, [-3620, 4324], {
        baseReqs: [zantReq],
        baseDesc: 'Defeat Zant to obtain the Heart Container.',
        randoCategory: Categories.Main,
        randoReqs: [lightMasterSwordReq, [palace3SKReq, palaceCentralThirdLockReq], [palaceBKReq, palaceBossLockReq], boomerangReq, zoraArmorReq, ironBootsReq, ballAndChainReq],
        randoDesc: 'Defeat Zant to obtain the item.'
    })],
    // Hyrule Castle
    ["Hyrule Castle Outside Lock", new Flag(castleLock, [-5304, 4320], {
        baseReqs: [castle1SKReq],
        baseDesc: "Unlock this door to reach the main hall of the castle."
    })],
    ["Hyrule Castle West Courtyard Central Small Chest", new Flag(smallChest.with(Rupees.Red), [-4887, 3598], {
        baseReqs: [],
        baseDesc: 'From the north area, climb up the balcony and drop down to the platform with the chest.',
        randoReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
    })],
    ["Hyrule Castle King Bulblin Key", new Flag(castleSK, [-4419, 3471], {
        baseReqs: [],
        baseDesc: 'Defeat King Bulblin for him to give you the small key.',
        randoCategory: Categories.Gifts,
        randoReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
        randoDesc: 'Defeat King Bulblin for him to give you the item.'
    })],
    ["Hyrule Castle West Courtyard North Small Chest", new Flag(smallChest.with(Rupees.Red), [-4229, 3620], {
        baseReqs: [],
        baseDesc: 'Under the wooden roof, you can go around the platform if you do not wish to fight King Bulblin.',
        randoReqs: [[woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
    })],
    ["Hyrule Castle East Wing Balcony Chest", new Flag(smallChest.with(Rupees.Yellow), [-5205, 4834], {
        baseReqs: [boomerangReq],
        baseDesc: 'In the room with the chest, climb the ladder to reach the balcony. Then, go to the end of the balcony to reach the chest.',
        randoReqs: [boomerangReq, [woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
    })],
    ["Hyrule Castle East Wing Boomerang Puzzle Chest", new Flag(chest.with(castleMap), [-4283, 4456], {
        baseReqs: [boomerangReq],
        baseDesc: "Boomerang the windmills in this order or it's inverse: Bottom Center, Middle Left, Middle Right, Top to open the gate and reach the chest.",
        randoReqs: [boomerangReq, [woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
    })],
    ["Hyrule Castle Graveyard Grave Switch Room Front Left Chest", new Flag(smallChest.with(Rupees.Green), [-3832, 4708], {
        baseReqs: [shadowCrystalReq, boulderReq],
        baseDesc: 'Destroy the rock on the ground before the northern tree and step on the pressure plate to open the gate blocking the chest.'
    })],
    ["Hyrule Castle Graveyard Grave Switch Room Back Left Chest", new Flag(smallChest.with(Rupees.Red), [-3832, 4761], {
        baseReqs: [shadowCrystalReq, boulderReq],
        baseDesc: 'Destroy the rock on the ground before the northern tree and step on the pressure plate to open the gate blocking the chest.'
    })],
    ["Hyrule Castle Graveyard Grave Switch Room Right Chest", new Flag(chest.with(Rupees.Orange), [-3923, 4748], {
        baseReqs: [shadowCrystalReq, boulderReq],
        baseDesc: 'Destroy the rock on the ground before the northern tree and step on the pressure plate to open the gate blocking the chest.'
    })],
    ["Hyrule Castle Graveyard Owl Statue Chest", new Flag(chest.with(castleSK), [-4297, 4310], {
        baseReqs: [shadowCrystalReq, boulderReq, lanternReq, domRodReq],
        baseDesc: 'In the room with the 3 chests, light the torch to stop the rain. Then, quickly make your way to the gate ' + 
                  'blocking the Howl Statues, and light the 2 torches on both sides of the gate. Bring the 2 Howl Statues to ' +
                  'their pedestal south of the area, then jump across them. Finally, pull the chain to open the gate and acces the chest.'
    })],
    ["Hyrule Castle Main Hall Northeast Chest", new Flag(chest.with(castleCompass), [-4809, 4576], {
        baseReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq],
        baseDesc: 'Defeat all the enemies in the room to make the chest appear, then clawshot the chandelier to reach the chest.',
        randoReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, [woodenSwordReq, bowReq, bombBagReq, ballAndChainReq, shadowCrystalReq]],
    })],
    ["Hyrule Castle Main Hall Northwest Chest", new Flag(chest.with(Rupees.Silver), [-4805, 4060], {
        baseReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, boomerangReq, bowReq],
        baseDesc: 'Activate the pressure plate on the south-west platform to make the chest appear. Then, clawshot the lowest chandelier and, from there, ' +
                  'the one above the chest to reach it.',
        randoReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, bowReq],
    })],
    ["Hyrule Castle Main Hall Southwest Chest", new Flag(chest.with(Rupees.Purple), [-5054, 4180], {
        baseReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, boomerangReq, bowReq],
        baseDesc: 'Defeat the 2 Darknuts to unlock the door and gain access to the chest.',
        randoReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, bowReq],
    })],
    ["Hyrule Castle Lantern Staircase Chest", new Flag(chest.with(Rupees.Purple), [-4463, 4319], {
        baseReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, boomerangReq],
        baseDesc: 'Defeat the Darknut to make the chest appear. Then, put out the west torch with the boomerang while standing on the north-most platform to ' + 
                    'make it rise and reach the chest.',
        randoReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq],
    })],
    ["Hyrule Castle Southeast Balcony Tower Chest", new Flag(chest.with(castleSK), [-5628, 5316], {
        baseReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, boomerangReq, [bowReq, lanternReq]],
        baseDesc: 'Defeat the Aeralfos to gain access to the chest.',
        randoReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq]],
    })],
    ["Hyrule Castle Big Key Chest", new Flag(bossChest.with(castleBK), [-5634, 3319], {
        baseReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, boomerangReq, [bowReq, lanternReq]],
        baseDesc: "Approach the chest to be saved and gain access to the chest.",
        randoReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq]],
    })],
    ['Hyrule Castle Balcony Lock', new Flag(castleLock, [-5296, 4322], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], [castle2SKReq, new AndRequirements(castleFirstLockReq, castle1SKReq)]],
        baseDesc: 'Unlock this door to reach the main tower of the castle.',
        randoReqs: [doubleClawshotReq, [castle2SKReq, new AndRequirements(castleFirstLockReq, castle1SKReq)], [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq]],
    })],
    ['Hyrule Castle Darknut Before Boss Rupee', new Flag(Rupees.Orange, [-5169, 4319], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], [castle2SKReq, castleSecondLockReq], spinnerReq],
        baseDesc: 'Defeat the Darknut and it will sometimes drop an Orange Rupee. The Darknut does not respawn so mark this as set once it is defeated, even if the rupee does not spawn.',
        randoReqs: [doubleClawshotReq, [castle2SKReq, castleSecondLockReq], [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
    })],
    ["Hyrule Castle Boss Lock", new Flag(castleBossLock, [-5237, 4323], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], [castle2SKReq, castleSecondLockReq], spinnerReq, castleBKReq],
        baseDesc: "Unlock this door to reach Ganondorf.",
        randoReqs: [doubleClawshotReq, castleBKReq, [castle2SKReq, castleSecondLockReq], [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
    })],
    ["Hyrule Castle Treasure Room Lock", new Flag(castleLock, [-5153, 4525], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, new AndRequirements(castleSecondLockReq, castle1SKReq)]],
        baseDesc: "Unlock this door to reach the treasure chest room.",
        randoReqs: [[castle3SKReq, new AndRequirements(castleSecondLockReq, castle1SKReq)], doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq],
    })],
    ["Hyrule Castle Treasure Room First Chest", new Flag(chest.with(Rupees.Orange), [-5100, 4545], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc:'First from the left of the north row.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Second Chest", new Flag(chest.with(seeds, 50), [-5085, 4565], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Second from the left of the north row.',        
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Third Chest", new Flag(chest.with(Rupees.Silver), [-5070, 4585], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Third from the left of the north row.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Fourth Chest", new Flag(chest.with(bomblings, 10), [-5055, 4605], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Fourth from the left of the north row.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Fifth Chest", new Flag(chest.with(Rupees.Purple), [-5040, 4625], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Fifth from the left of the north row.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Eighth Small Chest", new Flag(smallChest.with(Rupees.Blue), [-5190, 4674], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'First from the left of the south row.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Seventh Small Chest", new Flag(smallChest.with(Rupees.Yellow), [-5173, 4695], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Second from the left of the south row.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Sixth Small Chest", new Flag(smallChest.with(Rupees.Red), [-5156, 4716], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Third from the left of the south row.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Fifth Small Chest", new Flag(smallChest.with(bombs, 20), [-5139, 4737], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'First from the bottom of the east column.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Fourth Small Chest", new Flag(smallChest.with(arrows, 20), [-5120, 4737], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Second from the bottom of the east column.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Third Small Chest", new Flag(smallChest.with(bombs, 20), [-5090, 4737], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Third from the bottom of the east column.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room Second Small Chest", new Flag(smallChest.with(Rupees.Green), [-5065, 4737], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Fourth from the bottom of the east column.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Treasure Room First Small Chest", new Flag(smallChest.with(arrows, 30), [-5040, 4737], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
        baseDesc: 'Fifth from the bottom of the east column.',
        randoReqs: [doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, [bowReq, lanternReq], spinnerReq, [castle3SKReq, castleThirdLockReq]],
    })],
    ["Hyrule Castle Ganondorf", new UnsettableFlag(ganondorf, [-4838, 4328], {
        baseReqs: [doubleClawshotReq, boomerangReq, [bowReq, lanternReq], [castle2SKReq, castleSecondLockReq], spinnerReq, [castleBKReq, castleBossLockReq], shadowCrystalReq, masterSwordReq, endingBlowReq],
        baseDesc: 'Defeat Ganondorf to save Hyrule!'
    })],
    // Rando Hints
    ["Agithas Castle Sign", new Flag(randoHint, [-4155, 4551])],
    ["Arbiters Grounds Sign", new Flag(randoHint, [-4491, 4314], {
        baseReqs: [groundsFirstRoomReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
    })],
    ["Beside Castle Town Sign", new Flag(randoHint, [-3695, 3839], {
        baseReqs: [clawshotReq]
    })],
    ["Bulblin Camp Sign", new Flag(randoHint, [-4151, 531])],
    ["Castle Town Sign", new Flag(randoHint, [-3994, 4707])],
    ["Cave of Ordeals Sign", new Flag(randoHint, [-6268, 581])],
    ["City in the Sky Sign", new Flag(randoHint, [-4589, 4220], {
        baseReqs: [clawshotReq]
    })],
    ["Death Mountain Sign", new Flag(randoHint, [-3828, 8247])],
    ["Eldin Field Sign", new Flag(randoHint, [-4282, 5928])],
    ["Faron Field Sign", new Flag(randoHint, [-6202, 4889], {
        randoReqs: [leaveFaronWoodsReq]
    })],
    ["Faron Woods Sign", new Flag(randoHint, [-7478, 4945])],
    ["Forest Temple Sign", new Flag(randoHint, [-5405, 4055], {
        randoReqs: [[poleMonkeyReq, clawshotReq]]
    })],
    ["Gerudo Desert Sign", new Flag(randoHint, [-5481, 1185])],
    ["Goron Mines Sign", new Flag(randoHint, [-3723, 5334], {
        baseReqs: [ironBootsReq, [mines3SKReq, minesThirdLockReq]]
    })],
    ["Great Bridge of Hylia Sign", new Flag(randoHint, [-4250, 3381], {
        randoReqs: [clawshotReq]
    })],
    ["Hidden Village Sign", new Flag(randoHint, [-2052, 6668], {
        baseReqs: [woodenStatueReq]
    })],
    ["Hyrule Castle Sign", new Flag(randoHint, [-5856, 4318])],
    ["Jovani House Sign", new Flag(randoHint, [-4110, 4837])],
    ["Kakariko Gorge Sign", new Flag(randoHint, [-4999, 5982])],
    ["Kakariko Graveyard Sign", new Flag(randoHint, [-5475, 8300], {
        randoReqs: [gateKeyReq]
    })],
    ["Kakariko Village Sign", new Flag(randoHint, [-5220, 7548], {
        randoReqs: []
    })],
    ["Lake Hylia Sign", new Flag(randoHint, [-4659, 2920])],
    ["Lake Lantern Cave Sign", new Flag(randoHint, [-5335, 3018], {
        baseReqs: [boulderReq]
    })],
    ["Lakebed Temple Sign", new Flag(randoHint, [-4392, 3903], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq]]
    })],
    ["Lanayru Field Sign", new Flag(randoHint, [-2668, 4272])],
    ["Lanayru Spring Sign", new Flag(randoHint, [-5238, 3468], {
        baseReqs: [[ironBootsReq, magicArmorReq]],
    })],
    ["North Eldin Sign", new Flag(randoHint, [-1657, 6880], {
        randoReqs: [lanayruRandoReq]
    })],
    ["Ordon Sign", new Flag(randoHint, [-8842, 4938])],
    ["Palace of Twilight Sign", new Flag(randoHint, [-5753, 4356])],
    ["Sacred Grove Sign", new Flag(randoHint, [-7214, 3630], {
        randoReqs: [shadowCrystalReq, skullKidReq]
    })],
    ["Snowpeak Mountain Sign", new Flag(randoHint, [-483, 3939], {
        randoReqs: [[lanayruTwilightCleared, snowpeakPortalReq]],
    })],
    ["Snowpeak Ruins Sign", new Flag(randoHint, [-5035, 4186])],
    ["South of Castle Town Sign", new Flag(randoHint, [-4475, 4710], {
        randoReqs: [lanayruTwilightCleared],
    })],
    ["Temple of Time Beyond Point Sign", new Flag(randoHint, [-4928, 3970], {
        baseReqs: [[temple2SKReq, templeSecondLockReq], spinnerReq, bowReq]
    })],
    ["Temple of Time Sign", new Flag(randoHint, [-5721, 4278])],
    ["Upper Zoras River Sign", new Flag(randoHint, [-590, 5780], {
        randoReqs: [meltedIceReq],
    })],
    ["Zoras Domain Sign", new Flag(randoHint, [-748, 4751], {
        randoReqs: [[shadowCrystalReq, ...boulderReq]]
    })],
    ["Arbiters Grounds Poe Scent", new Flag(scents.getItemByIndex(2), [-4656, 4329], {
        baseReqs: [shadowCrystalReq, [arbiter1SKReq, arbitersFirstLockReq], lanternReq],
        baseDesc: "After defeating the poe, activate your senses to learn the Poe Scent.",
        randoCategory: Categories.Quest,
    })],
    ["Zoras Domain Reekfish Scent", new Flag(scents.getItemByIndex(3), [-705, 4947], {
        baseReqs: [coralEarringReq, shadowCrystalReq],
        baseDesc: "After catching a Reekfish, transform into Wolf and use your senses to learn the Reekfish Scent.",
        randoCategory: Categories.Quest,
    })],
    ["Doctors Office Medicine Scent", new Flag(scents.getItemByIndex(4), [-3750, 4917], {
        baseReqs: [invoiceReq, shadowCrystalReq],
        baseDesc: "After giving the invoice to the doctor, transform into Wolf and push the box to reveal the Medicine Scent.",
        randoCategory: Categories.Quest,
    })],
    ["Kakariko Gorge Youths Scent", new Flag(scents.getItemByIndex(0), [-5772, 5762], {
        baseReqs: [eldinTwilight],
        baseDesc: "After entering the Eldin Twilight, use your senses near the wooden sword on the ground to learn the Youths' Scent. The wooden sword disappears after clearing the Twilight.",
        randoCategory: Categories.Quest,
    })],
    ["Lanayru Field Scent of Ilia", new Flag(scents.getItemByIndex(1), [-2093, 6116], {
        baseReqs: [bombBagReq, lanayruTwilight],
        baseDesc: "After entering the Lanayru Twilight, use your senses near the purse on the ground to learn the Scent of Ilia. The purse disappears after clearing the Twilight.",
        randoCategory: Categories.Quest,
    })],
    ["Kakariko Village Malo Mart Bridge Repaired", new Flag(gorEbizoDonation, [-5187, 7340], {
        baseReqs: [shadowCrystalReq, Requirement.fromCountItem(rupees, 1000)],
        baseDesc: "Donate 1000 Rupees to Gor Ebizo to have the bridge repaired.",
        randoReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 500)],
        randoDesc: "Donate 500 Rupees to Gor Ebizo to have the bridge repaired.",
    })],
    ["Kakariko Village Malo Mart Castle Town Shop", new Flag(gorEbizoDonation, [-5248, 7221], {
        baseReqs: [eldinTwilightCleared, getFlagReq("Kakariko Village Malo Mart Bridge Repaired"), 
                    [Requirement.fromCountItem(rupees, 2000), 
                    new AndRequirements([getFlagReq("Goron Springwater Rush"), Requirement.fromCountItem(rupees, 200)])]],
        baseDesc: "Donate 2000 Rupees (or 200 rupees if the Goron Springwater Rush quest is completed) to Gor Ebizo to unlock the Castle Town shop."
    })],
    ["Castle Town Goron Shop Red Potion", new Flag(Bottle.RedPotion, [-4159, 4718], {
        itemCategory: Categories.ShopItems,
        baseReqs: [Requirement.fromCountItem(rupees, 40)],
        baseDesc: "Buy the Red Potion from the young goron for 40 Rupees.",
        randoDesc: "Buy the item from the young goron for 40 rupees."
    })],
    ['Castle Town Goron Shop Hylian Shield', new SharedFlag(hylianShield, [-4050, 4753], {
        baseReqs: [Requirement.fromCountItem(rupees, 210)],
        baseDesc: "Buy the Hylian Shield from the adult goron for 210 Rupees.",
        randoCategory: Categories.ShopItems,
        randoDesc: "Buy the item from the adult goron for 210 rupees.",
    })],
    ['Castle Town Goron Shop Lantern Oil', new Flag(Bottle.Oil, [-4328, 4597], {
        itemCategory: Categories.ShopItems,
        baseReqs: [Requirement.fromCountItem(rupees, 30)],
        baseDesc: "Buy the Lantern Oil from the young goron for 30 Rupees.",
        randoDesc: "Buy the item from the young goron for 30 rupees."
    })],
    ['Castle Town Goron Shop Arrow Refill', new Flag(new MultiItem(arrows, 30), [-4087, 4707], {
        itemCategory: Categories.ShopItems,
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 40)],
        baseDesc: "Buy the 30 Arrow Refill from the adult goron for 40 Rupees.",
        randoDesc: "Buy the item from the adult goron for 40 rupees."
    })],
    ['Faron Twilight Cleared', new Flag(vesselOfLight, [-7623, 4734], {
        baseReqs: [getFlagReq("South Faron Portal"), getFlagReq("North Faron Portal")],
        baseDesc: "Collect all the tears of light in the Faron region to clear the Faron Twilight.",
        randoReqs: [zeldaMetReq, shadowCrystalReq, getFlagReq("South Faron Portal"), getFlagReq("North Faron Portal")],
    })],
    ['Eldin Twilight Cleared', new Flag(vesselOfLight, [-5729, 7689], {
        baseReqs: [getFlagReq("Death Mountain Portal")],
        baseDesc: "Collect all the tears of light in the Eldin region to clear the Eldin Twilight.",
        randoReqs: [getFlagReq("Death Mountain Portal"), shadowCrystalReq],
    })],
    ['Lanayru Twilight Cleared', new Flag(vesselOfLight, [-5144, 3503], {
        baseReqs: [getFlagReq("Castle Town Portal")],
        baseDesc: "Collect all the tears of light in the Lanayru region to clear the Lanayru Twilight.",
        randoReqs: [getFlagReq("Castle Town Portal"), shadowCrystalReq],
    })],
    ["Ordon Rupee In Grass By Bo", new Flag(Rupees.Green, [-9212, 4845], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq],
        baseDesc: "Hidden in the grass near the ranch entrance.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Rupee In River 1", new Flag(Rupees.Green, [-9150, 4770], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq],
        baseDesc: "In the river near Rusl's House.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Rupee In River 2", new Flag(Rupees.Green, [-9150, 4800], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq], 
        baseDesc: "In the river near Rusl's House.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Rupee Under Bridge", new Flag(Rupees.Green, [-9083, 4957], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq],
        baseDesc: "Under the bridge.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Rupee Under Tall Tree 1", new Flag(Rupees.Green, [-9069, 4858], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq],
        baseDesc: "Under the tall tree, above Hanch's house.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Rupee Under Tall Tree 2", new Flag(Rupees.Green, [-9053, 4856], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq], 
        baseDesc: "Under the tall tree, above Hanch's house.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Tree Long Branch Rupee", new Flag(Rupees.Yellow, [-9006, 4864], {
        baseDesc: "Climb the vines to reach the top of the tree, then go to the end of the long branch.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Ordon Tree Short Branch Rupee", new Flag(Rupees.Blue, [-9024, 4877], {
        baseDesc: "Climb the vines to reach the top of the tree, then go to the end of the short branch.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Ordon Bo Window Rupee 1", new Flag(Rupees.Green, [-9177, 4918], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq],  
        baseDesc: "In front of the window on Mayor Bo's House. Climb the ladder behind Bo's house to reach it.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Bo Window Rupee 2", new Flag(Rupees.Green, [-9156, 4920], {
        baseReqs: [firstGoatsReq, zeldaNotMetReq], 
        baseDesc: "In front of the window on Mayor Bo's House. Climb the ladder behind Bo's house to reach it.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [],
    })],
    ["Ordon Bo Roof Rupee", new Flag(Rupees.Yellow, [-9172, 4944], {
        baseDesc: "On the roof near the hawk grass on Bo's House. Climb the ladder behind Bo's house to reach it.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Ordon Bo Cliff Rupee", new Flag(Rupees.Yellow, [-9241, 4899], {
        baseDesc: "On the cliff above Bo's House. Use the hawk grass on top of Bo's House to catch a Cucco, then use the it to fly to the cliff.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Ordon Rusl House Roof Rupee 1", new Flag(Rupees.Yellow, [-9099, 4759], {
        baseDesc: "On the roof of Rusl's House. Jump from Rusl's porch onto the house sign and then onto the roof.",
        randoCategory: Categories.FreestandingRupees,        
    })],
    ["Ordon Rusl House Roof Rupee 2", new Flag(Rupees.Yellow, [-9080, 4754], {
        baseDesc: "On the roof of Rusl's House. Jump from Rusl's porch onto the house sign and then onto the roof.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Faron Woods Coro Boulder Rupee 4", new Flag(Rupees.Yellow, [-7321, 4890], {
        itemCategory: Categories.HiddenRupees,
        baseReqs: [boulderReq],
        baseDesc: "Hidden in the boulder blocking the way to the Owl Statue.",
        randoCategory: Categories.HiddenRupees,
    })],
    ["Faron Woods Coro Boulder Rupee 1", new Flag(Rupees.Green, [-7321, 4855], {
        itemCategory: Categories.HiddenRupees,
        baseReqs: [boulderReq],
        baseDesc: "Hidden in the boulder blocking the way to the Owl Statue.",
        randoCategory: Categories.HiddenRupees,
    })],
    ["Faron Woods Coro Boulder Rupee 2", new Flag(Rupees.Green, [-7291, 4855], {
        itemCategory: Categories.HiddenRupees,
        baseReqs: [boulderReq],
        baseDesc: "Hidden in the boulder blocking the way to the Owl Statue.",
        randoCategory: Categories.HiddenRupees,
    })],
    ["Faron Woods Coro Boulder Rupee 3", new Flag(Rupees.Blue, [-7291, 4890], {
        itemCategory: Categories.HiddenRupees,
        baseReqs: [boulderReq],
        baseDesc: "Hidden in the boulder blocking the way to the Owl Statue.",
        randoCategory: Categories.HiddenRupees,
    })],
    ["Kakariko Village Spring Shortcut Box Rupee 1", new Flag(Rupees.Blue, [-5696, 7514], {
        baseReqs: [boulderReq],
        baseDesc: "In the right box behind the boulder leading to the back of the Eldin Spring.",
        randoCategory: Categories.HiddenRupees,
    })],
    ["Kakariko Village Spring Shortcut Box Rupee 2", new Flag(Rupees.Yellow, [-5696, 7545], {
        baseReqs: [boulderReq],
        baseDesc: "In the left box behind the boulder leading to the back of the Eldin Spring.",
        randoCategory: Categories.HiddenRupees,
    })],
    ["Kakariko Village Ant House Ledge Box Rupee", new Flag(Rupees.Red, [-5304, 7675], {
        baseReqs: [eldinTwilightCleared, boomerangReq],
        baseDesc: "In a box on the right end of the lower wooden scaffolding above the ant house.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [eldinTwilightCleared, [new AndRequirements([boulderReq, [woodenSwordReq, shadowCrystalReq]]), boomerangReq, clawshotReq]],
    })],
    ["Kakariko Village Hot Spring Ledge Box Rupee", new Flag(Rupees.Yellow, [-5209, 7583], {
        baseReqs: [eldinTwilightCleared, boomerangReq],
        baseDesc: "In a box on the wooden scaffolding to the left of the hot spring.",
        randoCategory: Categories.HiddenRupees,
        randoReqs: [eldinTwilightCleared, [new AndRequirements([boulderReq, [woodenSwordReq, shadowCrystalReq]]), boomerangReq, clawshotReq]],
    })],
    ["Death Mountain Volcano Pipe Ledge Rock Rupee", new Flag(Rupees.Red, [-3614, 8232], {
        baseReqs: [ironBootsReq],
        baseDesc: "Hidden under the rock on the ledge below the pipe. Reach it by using the Goron.",
         randoReqs: [eldinTwilightCleared],
        randoCategory: Categories.HiddenRupees,
    })],
    ["Death Mountain Volcano Ledge Rupee 3", new Flag(Rupees.Yellow, [-3691, 8188], {
        baseReqs: [ironBootsReq],
        baseDesc: "Launch yourself onto the ledge with the help of the highest Goron to reach the rupee.",
         randoReqs: [eldinTwilightCleared],
        randoCategory: Categories.FreestandingRupees,
    })],
     ["Death Mountain Volcano Ledge Rupee 2", new Flag(Rupees.Yellow, [-3702, 8177], {
        baseReqs: [ironBootsReq],
        baseDesc: "Launch yourself onto the ledge with the help of the highest Goron to reach the rupee.",
        randoReqs: [eldinTwilightCleared],
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Death Mountain Volcano Ledge Rupee 1", new Flag(Rupees.Yellow, [-3708, 8160], {
        baseReqs: [ironBootsReq],
        baseDesc: "Launch yourself onto the ledge with the help of the highest Goron to reach the rupee.",
        randoReqs: [eldinTwilightCleared],
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Zoras Domain Throne West Gate Underwater Rupee", new Flag(Rupees.Blue, [-253, 4831], {
        baseReqs: [lanayruTwilightCleared, ironBootsReq],
        baseDesc: "Underwater, behind the west gate of the throne room.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Zoras Domain Throne East Gate Underwater Rupee", new Flag(Rupees.Blue, [-253, 4865], {
        baseReqs: [lanayruTwilightCleared, ironBootsReq],
        baseDesc: "Underwater, behind the east gate of the throne room.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Zoras Domain Throne West Underwater Rupee", new Flag(Rupees.Yellow, [-124, 4795], {
        baseReqs: [lanayruTwilightCleared, [ironBootsReq, zoraArmorReq]],
        baseDesc: "Underwater in the throne room, above the boulder.",
        randoCategory: Categories.FreestandingRupees, 
    })],
    ["Zoras Domain Throne Northwest Underwater Rupee", new Flag(Rupees.Yellow, [-99, 4827], {
        baseReqs: [lanayruTwilightCleared, [ironBootsReq, zoraArmorReq]],
        baseDesc: "Underwater in the throne room, northeast and far above the boulder.",
        randoCategory: Categories.FreestandingRupees, 
    })],
    ["Zoras Domain Throne East Underwater Rupee", new Flag(Rupees.Yellow, [-147, 4910], {
        baseReqs: [lanayruTwilightCleared, [ironBootsReq, zoraArmorReq]],
        baseDesc: "Underwater in the throne room, east of the room.",
        randoCategory: Categories.FreestandingRupees, 
    })],
    ["Zoras Domain Throne South Underwater Rupee", new Flag(Rupees.Yellow, [-240, 4831], {
        baseReqs: [lanayruTwilightCleared, [ironBootsReq, zoraArmorReq]],
        baseDesc: "Underwater in the throne room, south of the room.",
        randoCategory: Categories.FreestandingRupees, 
    })],
    ["Zoras Domain Waterfall Ledge Rupee", new Flag(Rupees.Blue, [-520, 4811], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: "On the ledge near the waterfall, left of the poe.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Zoras Domain Behind Waterfall Rupee", new Flag(Rupees.Blue, [-500, 4892], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: "Behind the waterfall above the vines, right of the poe.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Zoras Domain Vine Ledge Rupee", new Flag(Rupees.Blue, [-581, 4790], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: "Below the vines leading to the place with the Shadow Bug.",
        randoCategory: Categories.FreestandingRupees, 
    })],
    ["Zoras Domain Shortcut Ledge Rupee", new Flag(Rupees.Yellow, [-595, 4770], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: "Above the vines leading to the place with the Shadow Bug.",
        randoCategory: Categories.FreestandingRupees, 
    })],
    ["Zoras Domain Top Ledge Rupee", new Flag(Rupees.Yellow, [-508, 4782], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: "On the very last ledge before reaching the top of the waterfall, next to the vines.",
        randoCategory: Categories.FreestandingRupees, 
    })],
    ["Lake Hylia Left Underwater Pillar Rupee", new Flag(Rupees.Yellow, [-4902, 3374], {
        baseReqs: [zoraArmorReq],
        baseDesc: "Underwater, on top of one of the broken pillars left of the entrance.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [lanayruTwilightCleared, zoraArmorReq],
    })],
    ["Lake Hylia Right Underwater Pillar Rupee", new Flag(Rupees.Yellow, [-4839, 3444], {
        baseReqs: [zoraArmorReq],
        baseDesc: "Underwater, on top of one of the broken pillars right of the entrance.",
        randoCategory: Categories.FreestandingRupees,
        randoReqs: [lanayruTwilightCleared, zoraArmorReq],
    })],
    ["Snowboarding Top Right Rupee", new RandoFlag(Rupees.Green, [-521, 2349], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the right ledge near the start of the path.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Top Left Rupee", new RandoFlag(Rupees.Green, [-833, 2420], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the left ledge near the start of the path.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Bridge Ledge Upper Rupee", new RandoFlag(Rupees.Green, [-680, 2128], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the right ledge above the bridge.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Bridge Ledge Middle Rupee", new RandoFlag(Rupees.Green, [-701, 2037], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the right ledge above the bridge.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Bridge Ledge Bottom Rupee", new RandoFlag(Rupees.Green, [-877, 1974], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the right ledge above the bridge.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Snowy Tree Top Rupee 1", new RandoFlag(Rupees.Blue, [-1650, 1954], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the tree tops that have snow ledges on them.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Snowy Tree Top Rupee 2", new RandoFlag(Rupees.Red, [-1748, 1946], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the tree tops that have snow ledges on them.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Snowy Tree Top Rupee 3", new RandoFlag(Rupees.Purple, [-1842, 1938], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, leap onto the tree tops that have snow ledges on them.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 1", new RandoFlag(Rupees.Green, [-2179, 1985], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 2", new RandoFlag(Rupees.Green, [-2229, 2000], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 3", new RandoFlag(Rupees.Green, [-2469, 2096], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 4", new RandoFlag(Rupees.Red, [-2513, 2089], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 5", new RandoFlag(Rupees.Green, [-2542, 2088], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 6", new RandoFlag(Rupees.Green, [-2581, 2086], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 7", new RandoFlag(Rupees.Green, [-2613, 2089], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 8", new RandoFlag(Rupees.Green, [-2669, 2107], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 9", new RandoFlag(Rupees.Green, [-2747, 2115], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 10", new RandoFlag(Rupees.Green, [-2831, 2109], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Snowboarding Shortcut Rupee 11", new RandoFlag(Rupees.Green, [-2910, 2088], {
        baseReqs: [snowpeakPortalReq],
        baseDesc: "While Snowboarding down the mountain, take the shortcut to the left to reach the rupee.",
        randoCategory: Categories.FreestandingRupees,
    })],
    ["Bridge of Eldin Portal", new Flag(Portals.BridgeOfEldin, [-2809, 7396], {
        baseReqs: [bombBagReq],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
        randoReqs: [[shadowCrystalReq, woodenSwordReq]],
    })],
    ["Castle Town Portal", new Flag(Portals.CastleTown, [-3963, 4147], {
        baseReqs: [meltedIceReq],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["Death Mountain Portal", new Flag(Portals.DeathMountain, [-3697, 8279], {
        baseReqs: [getFlagReq("Kakariko Village Portal")],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["Gerudo Desert Portal", new Flag(Portals.GerudoDesert, [-6059, 593], {
        baseReqs: [clawshotReq, [woodenSwordReq, shadowCrystalReq]],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["Kakariko Gorge Portal", new Flag(Portals.KakarikoGorge, [-5457, 6027], {
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["Kakariko Village Portal", new Flag(Portals.KakarikoVillage, [-5552, 7586], {
        baseReqs: [gorgePortalReq],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["Lake Hylia Portal", new Flag(Portals.LakeHylia, [-5271, 3175], {
        baseReqs: [meltedIceReq],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["Mirror Chamber Portal", new Flag(Portals.MirrorChamber, [-3732, 604], {
        baseReqs: [stallordReq, [woodenSwordReq, shadowCrystalReq]],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["North Faron Portal", new Flag(Portals.NorthFaron, [-7341, 4230], {
        baseReqs: [getFlagReq("South Faron Portal")],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
    })],
    ["Sacred Grove Portal", new Flag(Portals.SacredGrove, [-7064, 3676], {
        baseReqs: [blizzetaReq, [masterSwordReq, shadowCrystalReq]],
        baseDesc: "After striking the Master Sword in its pedestal, defeat the Shadow Beasts that appear to open the portal.",
        randoReqs: [skullKidReq, [woodenSwordReq, shadowCrystalReq]],
        randoDesc: "After defeating Skull Kid, defeat the Shadow Beasts that appear to open the portal.",
    })],   
    ["Snowpeak Portal", new Flag(Portals.Snowpeak, [-663, 3166], {
        baseReqs: [reekfishScentReq, [masterSwordReq, shadowCrystalReq]],
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
        randoReqs: [reekfishScentReq, [woodenSwordReq, shadowCrystalReq]],
    })],
    ["South Faron Portal", new Flag(Portals.SouthFaron, [-7835, 4839], {
        baseReqs: [ordonPortalReq],
        baseDesc: "Defeat the Shadow Beasts that appear with a Midna charge attack to open the portal.",
        randoReqs: [zeldaMetReq, [woodenSwordReq, shadowCrystalReq]],
    })],
    ["Upper Zoras River Portal", new Flag(Portals.UpperZorasRiver, [-786, 5985], {
        baseReqs: [lanayruTwilightCleared],
        baseDesc: "After talking to Iza, defeat the Shadow Beasts that appear to open the portal.",
        randoReqs: [lanayruTwilightCleared, woodenSwordReq],
    })],
    ["Zoras Domain Portal", new Flag(Portals.ZorasDomain, [-131, 4848], {
        baseDesc: "Defeat the Shadow Beasts that appear to open the portal.",
        randoReqs: [[shadowCrystalReq, woodenSwordReq]],
    })],
    ["Ordon Spring Portal", new Flag(Portals.OrdonSpring, [-8497, 4768], {
        baseReqs: [ordonSwordReq, woodenShieldReq],
        baseDesc: "After talking to the Light Spirit, defeat the Shadow Beast that appears to open the portal.",
        randoReqs: [],
        randoDesc: "This portal is unlocked from the start in Rando."
    })],
    ["Ordon First Goats Herding", new Flag(goatHerding, [-9478, 4861], {
        baseDesc: "Heard the goats with Epona for the first time.<br>" +
                  "This concludes Day 1 of the Prologue."
    })],
    ["Faron Woods Talo Saved", new Flag(saveTalo, [-6963, 4098], {
        baseReqs: [woodenSwordReq, lanternReq],
        baseDesc: "Follow Talo while he is chasing the monkey and free him from the cage to save him.<br>" +
                  "This concludes Day 2 of the Prologue."
    })],
    ["Met Zelda", new Flag(metZelda, [-8345, 4927], {
        baseReqs: [taloSavedReq],
        baseDesc: "Meet Zelda in her tower after having been imprisoned.",
        randoDesc: "Meet Zelda in her tower after having been imprisoned. Also unlocks the Hero's Clothes in Rando." 
    })],
    ["Forest Temple Pole Monkey", new Flag(saveMonkey, [-5225, 5296], {
        baseReqs: [[forest1SKReq, poleMonkeyLockReq]],
        baseDesc: "Save the monkey by rolling into the totem pole to make the cage fall.",
    })],
    ["Forest Temple Hanging Cage Monkey", new Flag(saveMonkey, [-4752, 3792], {
        baseReqs: [...forestTempleLeftSideReq, boomerangReq],
        baseDesc: "Free the monkey by using the boomerang on the web holding the cage.",
    })],
    ["Forest Temple Monkey Under Web", new Flag(saveMonkey, [-4551, 4580], {
        baseReqs: [boomerangReq, lanternReq],
        baseDesc: "Burn the north web above the monkey's platform with the lantern to reach it.",
    })],
    ["Forest Temple Monkey Behind Rocks", new Flag(saveMonkey, [-4190, 3998], {
        baseReqs: [boomerangReq],
        baseDesc: "Use the boomerang and the bombling to destroy the rocks and free the monkey.",
    })],
    ["Forest Temple Monkey Behind Windmill Gate", new Flag(saveMonkey, [-4556, 5616], {
        baseReqs: [boomerangReq, [forest1SKReq, forestBridgeLockReq]],
        baseDesc: "Free the monkey by activating the two windmills with one boomerang throw.",
    })],
    ["Retamed Epona", new Flag(epona, [-5485, 7617], {
        baseReqs: [eldinTwilightCleared],
        baseDesc: "After being outmached by the Gorons, retame Epona as she gallops wildly in Kakariko Village.",
    })],
    ["Melted Zora's Domain Ice", new Flag(moltenShard, [-299, 4848], {
        baseReqs: [getFlagReq("Zoras Domain Portal")],
        baseDesc: "Warp the molten shard from Death Mountain to Zora's Domain to melt the ice."
    })],
    ["Kakariko Gorge Eldin Field Boulder", new Flag(emptyBoulder, [-4715, 5769], {
        baseReqs: [eldinTwilightCleared, boulderReq],
        baseDesc: "Destroy the boulders to clear a path from Kakariko Gorge to Eldin Field.",
        randoReqs: [boulderReq],
    })],
    ["Lakebed Temple East Water Supply", new Flag(waterSupply, [-4378, 6290], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq]],
        baseDesc: 'Go to the top of the room and pull the lever to activate the east water supply.'
    })],
    ["Lakebed Temple West Water Supply", new Flag(waterSupply, [-4362, 2219], {
        baseReqs: [bombBagReq, [bowReq, boomerangReq], [lakebed2SKReq, lakebedSecondLockReq], lakebedEastWaterReq],
        baseDesc: 'Go to the top of the room and pull the lever to activate the west water supply.'
    })],
    ["Midna's Lament Completed", new Flag(midnasLament, [-3470, 4776], {
        baseReqs: [morpheelReq],
        baseDesc: "Save Midna by bringing her to Zelda after she was injured during the encounter with Zant."
    })],
    ["Kakariko Graveyard Lake Hylia Boulder", new Flag(emptyBoulder, [-5423, 8230], {
        baseReqs: [waterBombReq, ironBootsReq],
        baseDesc: "Destroy this boulder to gain access to the shortcut from Kakariko Graveyard to Lake Hylia.",
        randoReqs: [gateKeyReq, bombBagReq, ironBootsReq],
    })],
    ["Lanayru Field Zora's Domain Boulder", new Flag(emptyBoulder, [-1796, 4861], {
        baseReqs: [lanayruTwilightCleared, boulderReq],
        baseDesc: "Destroy this boulder to gain access to the shortcut from Lanayru Field to Zora's Domain.",
        randoReqs: [boulderReq],
    })],
    ["Faron Field South Castle Town Boulder", new Flag(emptyBoulder, [-4798, 4711], {
        baseReqs: [getFlagReq("Goron Springwater Rush"), Requirement.fromCountItem(bottle)],
        baseDesc: "Bring Hot Springwater in a bottle to the Goron in front of the boulder for him to destroy it. " + 
        "This unlock a shortcut between Faron Field and South of Castle Town.",
    })],
    ["Mirror Chamber Mirror Shard", new Flag(mirrorShard, [-3686, 603], {
        baseReqs: [getFlagReq("Mirror Chamber Portal")],
        baseDesc: "The piece of the mirror that remains is added to your inventory after talking to the sages.",
        randoCategory: Categories.NonChecks,
    })],
    ["Hyrule Castle West Hall Darknut Rupee", new Flag(Rupees.Orange, [-5210, 4135], {
        baseReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, boomerangReq, bowReq],
        baseDesc: 'Defeat the 2 Darknuts and one of them might drop an orange rupee. Set this flag once they are defeated as they do not respawn, even if no rupee was dropped.',
        randoReqs: [[castle1SKReq, castleFirstLockReq], doubleClawshotReq, [bombBagReq, woodenSwordReq, ballAndChainReq], boomerangReq, bowReq],
    })],
    ["Gengle Silver Rupee", new UnsettableFlag(Rupees.Silver, [-4116, 4902], {
        baseReqs: [getFlagReq("Jovani 60 Poe Soul Reward")],
        baseDesc: " After talking to Jovani at Telma's bar, everytime you come back to his house, " +
                  "talk to his cat Gengle to receive a Silver Rupee (You must leave Castle Town to get another one).",
    })],
    ["Fishing Hole Sinking Lure", new UnsettableFlag(sinkingLure, [-199, 5976], {
        baseReqs: [coralEarringReq], // TODO: Add Bass, Pike, and Catfish
        baseDesc: "After obtaining the Coral Earring and lure fishing the Hyrule Bass, Hyrule Pike and Hyrule Catfish, " +
                  "cast your fishing rod near the top of the eastern bank to catch the Sinking Lure. It can also be caught " +
                  "near the top of the western bank.<br>" +
                  "If it is confiscated by Hena, you can fish in the same locations to obtain a new one.",
        randoCategory: Categories.NonChecks,
    })],
    ["Fishing Hole Frog Lure", new Flag(frogLure, [-657, 6258], {
        baseReqs: [lanayruTwilightCleared, Requirement.fromCountItem(rupees, 40)],
        baseDesc: "After clearing the first 8 levels of the rollgoal minigame, Hena will reward you with the Frog Lure.",
        randoCategory: Categories.NonChecks,
    })],



]); // Always add flags at the end to preserve storage IDs

// Flag initialization
const flagsSU = new StorageUnit('flags', flags.values());
for (let [name, flag] of flags.entries()) {
    flag.setName(name);
    flag.initialize();
}

// Flag groups initialization
agithaRewards.initialize();

// Flag Requirements initialization
initializeFlagRequirements();

// Shared flags assignement
flags.get("Kakariko Village Malo Mart Hylian Shield").setSharedFlag(flags.get('Castle Town Goron Shop Hylian Shield'))
flags.get('Castle Town Goron Shop Hylian Shield').setSharedFlag(flags.get("Kakariko Village Malo Mart Hylian Shield"))