// Imports
const express = require("express");
const app = express();
const fs = require("fs");
const cheerio = require("cheerio");

/*
 * Class for the card Database
 */
class Database {
	cards: Array<Card>;
	
	constructor() {
		this.cards = new Array<Card>;
	}
	
	get database(): Array<Card> {
		return this.cards;
	}
	
	get uniqueArchetypes(): Array<string> {
		let _RETURN: Array<string> = [];
		this.cards.forEach((card) => {
			card.cardArchetypes.forEach((archetype) => {
				_RETURN.push(archetype);
			})
		})
		return [... new Set(_RETURN)];
	}
	get uniqueAbilityTypes(): Array<string> {
		let _RETURN: Array<string> = [];
		this.cards.forEach((card) => {
			card.cardAbility.cardAbilityKeywords.forEach((abilityType) => {
				_RETURN.push(abilityType);
			})
		})
		return [... new Set(_RETURN)];
	}
	get uniqueRarities(): Array<string> {
		let _RETURN: Array<string> = [];
		this.cards.forEach((card) => {
			_RETURN.push(card.cardRarity.cardRarityStars);
		})
		return [... new Set(_RETURN)].sort();
	}
	
	addCard(cardID: string, cardData: object) {
		this.cards.push(new Card(cardID,cardData['type'],cardData['name'],cardData['cost'],cardData['ability'],cardData['rarity'],cardData['archetypes'],cardData['damage'],cardData['health']));
	}
}

/*
 * Class for the individual cards
 * Takes 8 mandatory and 2 optional parameters:
 * id {string} - UID of card.
 * type {string} - Type of card.
 * name {string} - Name of card.
 * cost {number} - Cost of card.
 * ability {Ability} - Unique ability of the card.
 * rarity {Rarity} - The rarity and foil status of the card.
 * archetypes {array} - Archetypes of the card.
 * [damage] {number} - Damage card deals on hit.
 * [health] {number} - Damage card can take before destruction.
 */
class Card {
	id: string;
	type: string;
	name: string;
	cost: number;
	ability: Ability;
	rarity: Rarity;
	archetypes: Array<string>;
	damage: number;
	health: number;
	
	constructor(cardID: string, cardType: string, cardName: string, cardCost: number, cardAbility: object, rarity: number, archetypes: Array<string>, cardDamage?: number, cardHealth?: number) {
		this.id = cardID;
		this.type = cardType;
		this.name = cardName;
		this.cost = cardCost;
		this.damage = cardDamage;
		this.health = cardHealth;
		this.ability = new Ability(cardAbility['abilityText'],cardAbility['abilityKeywords']);
		this.rarity = new Rarity(rarity);
		this.archetypes = archetypes;
	}
	
	get cardID(): string {
		return this.id;
	}
	get cardType(): string {
		return this.type;
	}
	get cardName(): string {
		return this.name;
	}
	get cardCost(): number {
		return this.cost;
	}
	get cardDamage(): number {
		return this.damage;
	}
	get cardHealth(): number {
		return this.health;
	}
	get cardAbility(): Ability {
		return this.ability;
	}
	get cardRarity(): Rarity {
		return this.rarity;
	}
	get cardArchetypes(): Array<string> {
		return this.archetypes;
	}
}

/*
 * Class for the rarity status of a card
 * Takes 2 necessary parameters:
 * rarity {number} - The numeric rarity of a card.
 */
class Rarity {
	rarity: number;
	foil: boolean;
	
	constructor(rarity: number) {
		this.rarity = rarity >= 1 && rarity <= 5 ? rarity : 1;
	}
	
	get cardRarityRaw(): number {
		return this.rarity;
	}
	get cardRarityStars(): string {
		let stars = '';
		for(let i=0;i<this.rarity;i++) {
			stars+='*';
		}
		return stars;
	}
}

/*
 * Class for the ability of a card
 * Takes 2 necessary parameters:
 * abilityText {string} - The literal ability text of a card.
 * abilityKeywords {Array} - Keywords to be found in the ability text.
 */
class Ability {
	abilityText: string;
	abilityKeywords: Array<string>;
	
	constructor(abilityText: string, abilityKeywords: Array<string>) {
		this.abilityText = abilityText;
		this.abilityKeywords = abilityKeywords;
	}
	
	get cardAbilityText(): string {
		return this.abilityText;
	}
	get cardAbilityKeywords(): Array<string> {
		return this.abilityKeywords;
	}
}

function server() : void {
	const PORT = 3000;
	const cardsJSON = JSON.parse(fs.readFileSync('client/cards.json'));

	app.listen(PORT, () => {
		console.log("Server up on port", PORT);
	});

	app.use("/css", express.static(__dirname + '/css'));
	app.use("/client", express.static(__dirname + '/client'));

	app.get("/", (req, res) => {
		const cardDB = new Database();

		Object.keys(cardsJSON).forEach((card) => {
			const parent = cardsJSON[card];
			cardDB.addCard(card,parent);
		})
		
		fs.readFile(__dirname + '/index.html', 'utf8', function (err,data) {
			if (err) return console.log(err);
			
			const $ = cheerio.load(data);
			cardDB.database.forEach((card) => {
				$('#cards').append(`<div class="card"><div class="cardName header">${card.cardName}</div><div class="cardRarity"><b>Rarity:</b> ${card.cardRarity.cardRarityStars}</div><div class="cardCost"><b>Cost:</b> ${card.cardCost}</div><div class="cardDamage"><b>Damage:</b> ${card.cardDamage}</div><div class="cardHealth"><b>Health:</b> ${card.cardHealth}</div><div class="cardAbility">${card.cardAbility.cardAbilityText}</div><div class="cardArchetypes"><b>Archetypes:</b> ${card.cardArchetypes.join(",")}</div><div class="hidden cardAbilityTypes">${card.cardAbility.cardAbilityKeywords.join(",")}</div></div>`);
			});
			
			cardDB.uniqueArchetypes.forEach((archetype) => {
				$('.filter-Archetypes').append(`<div class="filter-${archetype}"><input type="checkbox" name="${archetype}" value="${archetype}"><label for="${archetype}">${archetype}</label></div>`);
			});
			cardDB.uniqueAbilityTypes.forEach((abilityType) => {
				$('.filter-AbilityTypes').append(`<div class="filter-${abilityType}"><input type="checkbox" name="${abilityType}" value="${abilityType}"><label for="${abilityType}">${abilityType}</label></div>`);
			});
			cardDB.uniqueRarities.forEach((rarities) => {
				$('.filter-Rarity').append(`<div class="filter-${rarities}"><input type="checkbox" name="${rarities}" value="${rarities}"><label for="${rarities}">${rarities}</label></div>`);
			});
		 
			res.send($.html());
		});
	});
}

server();