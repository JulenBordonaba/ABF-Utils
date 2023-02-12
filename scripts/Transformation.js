let myActor = game.actors.get("PzL4tdVVG3LzdDhz"); //your actor id
let transformedActor = game.actors.get("bFxu7qaxKjoZTRSM"); //transformed actor id
let notTransformedActor = game.actors.get("whVo6tN0xMtfm4Ff"); //not transformed actor id

let notTransformedImg = notTransformedActor.data.token.img;
let transformedImg = transformedActor.data.token.img;

let isTransformed = token.data.img === transformedImg;

new Sequence()
	.effect()
	.file("jb2a.misty_step.02.blue")
	.atLocation(token)
	.scaleToObject(2.5)
	.randomRotation()
	.wait(1500)
	.thenDo(() => { DoTransfom(); })
	.play()

function DoTransfom() {

	var currentStateData = GetCurrentStateData(myActor);
	console.log(currentStateData);

	let finalActor = isTransformed ? notTransformedActor : transformedActor;

	//var nextTokenData = GetTokenData(finalActor);

	var jsonActor = JSON.stringify(finalActor.toJSON());
	myActor.importFromJSON(jsonActor);
	token.refresh();
	console.log(myActor);

	let img = isTransformed ? notTransformedImg : transformedImg;
	token.document.update({ img });

	console.log(currentStateData.fatigue);
	SetGeneralStateData(myActor, currentStateData);
	SetMysticStateData(myActor, currentStateData);
	SetDomineStateData(myActor, currentStateData);
	SetPsychicStateData(myActor, currentStateData);
	//SetTokenData(nextTokenData);
}

function GetTokenData(token) {
	var result = {};

	result["width"] = actor.data.token.width;
	result["height"] = actor.data.token.height;
	result["scale"] = actor.data.token.scale;

	return result;
}

function SetTokenData(newTokenData) {
	console.log(newTokenData);
	token.update({ hitArea: { width: (100 * newTokenData.width) } });
	token.update({ hitArea: { height: (100 * newTokenData.height) } });
}

function GetCurrentStateData(actor) {
	var result = {};
	var kiAccumulation = {};

	kiAccumulation["agility"] = actor.data.data.domine.kiAccumulation.agility.accumulated.value;
	kiAccumulation["constitution"] = actor.data.data.domine.kiAccumulation.constitution.accumulated.value;
	kiAccumulation["dexterity"] = actor.data.data.domine.kiAccumulation.dexterity.accumulated.value;
	kiAccumulation["power"] = actor.data.data.domine.kiAccumulation.power.accumulated.value;
	kiAccumulation["strength"] = actor.data.data.domine.kiAccumulation.strength.accumulated.value;
	kiAccumulation["willPower"] = actor.data.data.domine.kiAccumulation.willPower.accumulated.value;

	result["kiAccumulation"] = kiAccumulation;
	result["health"] = actor.data.data.characteristics.secondaries.lifePoints.value;
	result["healthMax"] = actor.data.data.characteristics.secondaries.lifePoints.max;
	result["fatigue"] = actor.data.data.characteristics.secondaries.fatigue.value;
	result["fatigueMax"] = actor.data.data.characteristics.secondaries.fatigue.max;
	result["movementType"] = actor.data.data.characteristics.secondaries.movementType.mod.value;
	result["regenerationType"] = actor.data.data.characteristics.secondaries.regenerationType.mod.value;
	result["ki"] = actor.data.data.domine.kiAccumulation.generic.value;
	result["allActionsodifier"] = actor.data.data.general.modifiers.allActions.base.value;
	result["physicalActionsModifier"] = actor.data.data.general.modifiers.physicalActions.value;
	result["accumulatedZeon"] = actor.data.data.mystic.zeon.accumulated.value;
	result["zeon"] = actor.data.data.mystic.zeon.value;
	result["psychicPoints"] = actor.data.data.psychic.psychicPoints.value;

	return result;
}

function SetGeneralStateData(actor, stateData) {

	SetFatigue(actor, stateData.fatigue);
	SetHealth(actor, stateData.health);

	actor.update({ data: { characteristics: { secondaries: { movementType: { mod: { value: stateData.movementType } } } } } });
	actor.update({ data: { characteristics: { secondaries: { regenerationType: { mod: { value: stateData.regenerationType } } } } } });
	actor.update({ data: { general: { modifiers: { allActions: { base: { value: stateData.allActionsodifier } } } } } });
	actor.update({ data: { general: { modifiers: { physicalActions: { base: { value: stateData.physicalActionsModifier } } } } } });
}

function SetMysticStateData(actor, stateData) {

	SetZeon(actor, stateData.zeon);
	actor.update({ data: { mystic: { zeon: { accumulated: { value: stateData.accumulatedZeon } } } } });
}

function SetDomineStateData(actor, stateData) {

	SetKi(actor, stateData.ki);
	SetAccumulatedKiData(actor, stateData.kiAccumulation);
}

function SetPsychicStateData(actor, stateData) {

	SetPsychicPoints(actor, stateData.psychicPoints);
}

function SetHealth(actor, newLifePoints) {

	newLifePoints = Math.min(newLifePoints, actor.data.data.characteristics.secondaries.lifePoints.max);

	actor.update({
		data: {
			characteristics: {
				secondaries: { lifePoints: { value: newLifePoints } }
			}
		}
	});
}

function SetFatigue(actor, newFatigue) {
	console.log(newFatigue);
	newFatigue = Math.min(newFatigue, actor.data.data.characteristics.secondaries.fatigue.max);
	console.log(newFatigue);

	actor.update({
		data: {
			characteristics: {
				secondaries: { fatigue: { value: newFatigue } }
			}
		}
	});
}

function SetZeon(actor, newZeon) {

	newZeon = Math.min(newZeon, actor.data.data.mystic.zeon.max);

	actor.update({
		data: {
			characteristics: {
				secondaries: { fatigue: { value: newZeon } }
			}
		}
	});
}

function SetKi(actor, newKi) {

	newKi = Math.min(newKi, actor.data.data.domine.kiAccumulation.generic.max);

	actor.update({
		data: {
			characteristics: {
				secondaries: { fatigue: { value: newKi } }
			}
		}
	});
}

function SetPsychicPoints(actor, newPsychicPoints) {

	newPsychicPoints = Math.min(newPsychicPoints, actor.data.data.psychic.psychicPoints.max);

	actor.update({
		data: {
			psychic: {
				psychicPoints: { value: newPsychicPoints }
			}
		}
	});
}

function SetAccumulatedKiData(actor, newKiAccumulationData) {
	actor.update({ data: { domine: { kiAccumulation: { agility: { value: newKiAccumulationData.agility } } } } });
	actor.update({ data: { domine: { kiAccumulation: { constitution: { value: newKiAccumulationData.constitution } } } } });
	actor.update({ data: { domine: { kiAccumulation: { dexterity: { value: newKiAccumulationData.dexterity } } } } });
	actor.update({ data: { domine: { kiAccumulation: { strength: { value: newKiAccumulationData.strength } } } } });
	actor.update({ data: { domine: { kiAccumulation: { power: { value: newKiAccumulationData.power } } } } });
	actor.update({ data: { domine: { kiAccumulation: { willPower: { value: newKiAccumulationData.willPower } } } } });
}