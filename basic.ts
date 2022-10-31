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
				if(_RETURN.indexOf(archetype) == -1) _RETURN.push(archetype);
			})
		})
		return _RETURN;
	}
	
	addCard(cardID: string, cardData: object, foil: boolean) {
		this.cards.push(new Card(cardID,cardData['name'],cardData['cost'],cardData['damage'],cardData['health'],cardData['ability'],cardData['rarity'],foil,cardData['archetypes']));
	}
}

/*
 * Class for the individual cards
 * Takes 9 necessary parameters:
 * id {string} - UID of card.
 * name {string} - Name of card.
 * cost {number} - Cost of card.
 * damage {number} - Damage card deals on hit.
 * health {number} - Damage card can take before destruction.
 * ability {Ability} - Unique ability of the card.
 * rarity {Rarity} - The rarity and foil status of the card.
 * archetypes {array} - Archetypes of the card.
 */
class Card {
	id: string;
	name: string;
	cost: number;
	damage: number;
	health: number;
	ability: Ability;
	rarity: Rarity;
	archetypes: Array<string>;
	
	constructor(cardID: string, cardName: string, cardCost: number, cardDamage: number, cardHealth: number, cardAbility: object, rarity: number, foil: boolean, archetypes: Array<string>) {
		this.id = cardID;
		this.name = cardName;
		this.cost = cardCost;
		this.damage = cardDamage;
		this.health = cardHealth;
		this.ability = new Ability(cardAbility['abilityText'],cardAbility['abilityKeywords']);
		this.rarity = new Rarity(rarity,foil);
		this.archetypes = archetypes;
	}
	
	get cardID(): string {
		return this.id;
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
 * foil {boolean} - Whether the card is foil or not.
 */
class Rarity {
	rarity: number;
	foil: boolean;
	
	constructor(rarity: number, foil: boolean) {
		this.rarity = rarity >= 1 && rarity <= 5 ? rarity : 0
		this.foil = foil;
	}
	
	get cardRarityRaw(): number {
		return this.rarity;
	}
	get cardRarityStars(): string {
		let stars = '';
		for(let i=0;i<this.rarity;i++) {
			stars+='*'
		}
		return stars;
	}
	get cardFoil(): boolean {
		return this.foil;
	}
	set cardFoil(value: boolean) {		
		this.foil = value;
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

function main() : void {
	const PORT = 3000;
	const cardsJSON = JSON.parse(fs.readFileSync('cards.json'));

	app.listen(PORT, () => {
		console.log("Server up on port", PORT);
	});

	app.use("/css", express.static(__dirname + '/css'));

	app.get("/", (req, res) => {
		const cardDB = new Database();

		Object.keys(cardsJSON).forEach((card) => {
			const parent = cardsJSON[card];
			cardDB.addCard(card,parent,false);
		})
		
		fs.readFile(__dirname + '/index.html', 'utf8', function (err,data) {
			if (err) return console.log(err);
			
			const $ = cheerio.load(data);
			cardDB.database.forEach((card) => {
				$('#cards').append(`<div class="card"><div class="cardName header">${card.cardName}</div><div class="cardRarity"><b>Rarity:</b> ${card.cardRarity.cardRarityStars}</div><div class="cardCost"><b>Cost:</b> ${card.cardCost}</div><div class="cardDamage"><b>Damage:</b> ${card.cardDamage}</div><div class="cardHealth"><b>Health:</b> ${card.cardHealth}</div><div class="cardAbility">${card.cardAbility.cardAbilityText}</div><div class="cardArchetypes"><b>Archetypes:</b> ${card.cardArchetypes.join(",")}</div></div>`);
			});
			
			console.log(cardDB.uniqueArchetypes);
		 
			res.send($.html());
		});
	});
}

main();