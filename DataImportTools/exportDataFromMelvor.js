let styleMap = new Map([["melee", "Melee"], ["ranged", "Ranged"], ["magic", "Magic"]]);
let monsterMap = game.monsters
	.filter(monster => {
		// const ignoredMonsters = ["Mysterious Figure - Phase 1",
		// 	"Mysterious Figure - Phase 2",
		// 	"Ahrenia",
		// 	"Bane",
		// 	"Bane, Instrument of Fear",
		// 	"The Herald"];
		// return !ignoredMonsters.includes(monster.name);
		const ignoredMonsters = ["melvorF:MysteriousFigurePhase1",
			"melvorF:MysteriousFigurePhase2",
			"melvorF:Ahrenia",
			"melvorF:Bane",
			"melvorF:BaneInstrumentOfFear",
			"melvorTotH:TheHeraldPhase1",
			"melvorTotH:TheHeraldPhase2",
			"melvorTotH:TheHeraldPhase3",
		]
		return !ignoredMonsters.includes(monster.id);
	})
	.sort((a, b) => {
		return game.monsters.getObjectByID(a.id).combatLevel - game.monsters.getObjectByID(b.id).combatLevel;
	})
	.map(x => {
		let res = {};
		res.name = x.name;
		res.attackStyle = styleMap.get(x.attackType);
		res.canStun = false;
		res.canSleep = false;
		res.usesNormalHit = false;

		if (res.attackStyle === "Melee") {
			res.attackLevel = x.levels.Strength;
			if (x.equipmentStats && x.equipmentStats.length != 0 && x.equipmentStats.find(o => o.key === 'meleeStrengthBonus')) {
				res.attackBonus = x.equipmentStats.find(o => o.key === 'meleeStrengthBonus').value;
			} else {
				res.attackBonus = 0;
			}
		}
		if (res.attackStyle === "Ranged") {
			res.attackLevel = x.levels.Ranged;
			if (x.equipmentStats && x.equipmentStats.length != 0 && x.equipmentStats.find(o => o.key === "rangedStrengthBonus")) {
				res.attackBonus = x.equipmentStats.find(o => o.key === 'rangedStrengthBonus').value;
			} else {
				res.attackBonus = 0;
			}
		}
		if (res.attackStyle === "Magic") {
			res.attackLevel = x.levels.Magic;
			if (x.equipmentStats && x.equipmentStats.length != 0 && x.equipmentStats.find(o => o.key === "magicDamageBonus")) {
				res.attackBonus = x.equipmentStats.find(o => o.key === 'magicDamageBonus').value;
			} else {
				res.attackBonus = 0;
			}
			if (x.selectedSpell) {
				res.spellMaxHit = x.selectedSpell.maxHit
			}
		}

		res.specialAttack = [];
		if (x.specialAttacks) {
			let totalchance = 0
			for (special of x.specialAttacks) {
				if (special.attack.onhitEffects && special.attack.onhitEffects.length != 0) {
					for (effects of special.attack.onhitEffects) {
						if (effects.type === "Stun") {
							res.canStun = true;
						}
						if (effects.type === "Sleep") {
							res.canSleep = true;
						}
						if (special?.damage?.length === 0 &&
							(effects.type === "Stun" || effects.type === "Sleep" || effects.type === "Modifier")) {
							res.usesNormalHit = true;
						}
					}
				}
				if (special.attack.prehitEffects && special.attack.prehitEffects.length != 0) {
					for (effects of special.attack.prehitEffects) {
						if (effects.type === "Stun") {
							res.canStun = true;
						}
						if (effects.type === "Sleep") {
							res.canSleep = true;
						}
						if (special?.damage?.length === 0 &&
							(effects.type === "Stun" || effects.type === "Sleep" || effects.type === "Modifier")) {
							res.usesNormalHit = true;
						}
					}
				}

				v = {};
				v.name = special.attack.name;
				if (special.attack.damage.length != 0)
					v.maxHit = special.attack.damage[0].maxPercent;
				else {
					v.maxHit = 0;
				}
				totalchance = totalchance + special.attack.defaultChance;
				res.specialAttack.push(v);
			}

			if (totalchance < 100) {
				res.usesNormalHit = true;
			}
		}

		return res;
	});
monsterMap;

// let easySlayer = game.monsters.filter((monster, id) => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[0].minLevel && combatLevel <= SlayerTask.data[0].maxLevel);
// }).map(x => { return x.name });
// easySlayer;

// let normalSlayer = game.monsters.filter((monster, id) => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[1].minLevel && combatLevel <= SlayerTask.data[1].maxLevel);
// }).map(x => { return x.name });
// normalSlayer;

// let hardSlayer = game.monsters.filter((monster, id) => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[2].minLevel && combatLevel <= SlayerTask.data[2].maxLevel);
// }).map(x => { return x.name });
// hardSlayer;

// let eliteSlayer = game.monsters.filter((monster, id) => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[3].minLevel && combatLevel <= SlayerTask.data[3].maxLevel);
// }).map(x => { return x.name });
// eliteSlayer;

// let masterSlayer = game.monsters.filter((monster, id) => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[4].minLevel && combatLevel <= SlayerTask.data[4].maxLevel);
// }).map(x => { return x.name });
// masterSlayer;

// let legendarySlayer = game.monsters.filter((monster, id) => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[5].minLevel && combatLevel <= SlayerTask.data[5].maxLevel);
// }).map(x => { return x.name });
// legendarySlayer;

// let mythicalSlayer = game.monsters.filter((monster, id) => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[6].minLevel && combatLevel <= SlayerTask.data[6].maxLevel);
// }).map(x => { return x.name });
// mythicalSlayer;

// slayerTiers = [
// 	"easy",
// 	"normal",
// 	"hard",
// 	"elite",
// 	"master",
// 	"legendary",
// 	"mythical"
// ]

// let slayerTaskList = {}
// SlayerTask.data.forEach((tier, tierID) => slayerTaskList[tier.engDisplay] = game.monsters.filter(monster => {
// 	const combatLevel = monster.combatLevel;
// 	return (monster.canSlayer && combatLevel >= SlayerTask.data[tierID].minLevel && combatLevel <= SlayerTask.data[tierID].maxLevel);
// }).map(x => { return x.name })
// ) // Object which returns all monsters in a given slayer tier. Grabs slayer task tiers automatically

// let dungeonList = {}
// game.dungeons.forEach(dungeon => dungeonList[dungeon.name] = [...new Set(dungeon.monsters.map(monster => monster.name))]) 

let slayerTaskList = []
SlayerTask.data.forEach((tier, tierID) => {
	let monstersInTier = game.monsters.filter(monster => {
		const combatLevel = monster.combatLevel;
		return (monster.canSlayer && combatLevel >= SlayerTask.data[tierID].minLevel && combatLevel <= SlayerTask.data[tierID].maxLevel);
	}).map(x => { return x.name })
	slayerTaskList.push({ name: tier.engDisplay, monsters: monstersInTier})
}) // Array for all slayer task monsters

let dungeonList = []
game.dungeons.forEach(dungeon => dungeonList.push({ name: dungeon.name, monsters: [...new Set(dungeon.monsters.map(monster => monster.name))] })) // Grab all dungeon monsters, removing duplicates with Set

JSON.stringify(slayerTaskList)
JSON.stringify(dungeonList)
JSON.stringify(monsterMap)