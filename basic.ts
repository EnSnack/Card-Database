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
	
	addCard(cardID: string, cardName: string, cardCost: number, cardDamage: number, cardHealth: number, cardAbility: string, rarity: number, foil: boolean) {
		this.cards.push(new Card(cardID,cardName,cardCost,cardDamage,cardHealth,cardAbility,rarity,foil))
	}
}

/*
 * Class for the individual cards
 * Takes 7 necessary parameters:
 * id {string} - UID of card.
 * name {string} - Name of card.
 * cost {number} - Cost of card.
 * damage {number} - Damage card deals on hit.
 * health {number} - Damage card can take before destruction.
 * ability {string} - Unique ability of the card.
 * rarity {Rarity} - The rarity and foil status of the card.
 */
class Card {
	id: string;
	name: string;
	cost: number;
	damage: number;
	health: number;
	ability: string;
	rarity: Rarity;
	
	constructor(cardID: string, cardName: string, cardCost: number, cardDamage: number, cardHealth: number, cardAbility: string, rarity: number, foil: boolean) {
		this.id = cardID;
		this.name = cardName;
		this.cost = cardCost;
		this.damage = cardDamage;
		this.health = cardHealth;
		this.ability = cardAbility;
		this.rarity = new Rarity(rarity,foil);
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
	get cardAbility(): string {
		return this.ability;
	}
	get cardRarity(): Rarity {
		return this.rarity;
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
		this.rarity = rarity >= 0 && rarity <= 5 ? rarity : 0
		this.foil = foil;
	}
	
	get cardRarity(): number {
		return this.rarity;
	}
	set cardRarity(value: number) {
		if(value < 0 || value > 5) {
			throw new Error('Please input valid rarity.');
			return;
		}
		
		this.rarity = value;
	}
	
	get cardFoil(): boolean {
		return this.foil;
	}
	set cardFoil(value: boolean) {		
		this.foil = value;
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
		let cardDB = new Database();

		Object.keys(cardsJSON).forEach((card) => {
			let parent = cardsJSON[card]
			cardDB.addCard(card,parent['name'],parent['cost'],parent['damage'],parent['health'],parent['ability'],2,false);
		})
		
		fs.readFile(__dirname + '/index.html', 'utf8', function (err,data) {
			if (err) return console.log(err);
			
			const $ = cheerio.load(data);
			cardDB.database.forEach((card) => {
				$('#content').append(`<div class="card"><div class="cardName">${card.cardName}</div><div class="cardCost">Cost: ${card.cardCost}</div><div class="cardDamage">Damage: ${card.cardDamage}</div><div class="cardHealth">Health: ${card.cardHealth}</div><div class="cardAbility">${card.cardAbility}</div></div>`)
				
			});
		 
			res.send($.html());
		});
	});
}

main();