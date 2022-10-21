const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = 3000;

let cardsJSON = JSON.parse(fs.readFileSync('cards.json'));

app.listen(PORT, () => {
	console.log("Server up, on port", PORT);
});

class Database {
	cards: Array<Card>;
	
	constructor() {
		this.cards = new Array<Card>;
	}
	
	get database(): Array<Card> {
		return this.cards;
	}
	
	addCard(cardName: string, cardCost: number, cardDamage: number, cardHealth: number, cardAbility: string, rarity: number, foil: boolean) {
		this.cards.push(new Card(cardName,cardCost,cardDamage,cardHealth,cardAbility,rarity,foil))
	}
}
class Card {
	name: string;
	cost: number;
	damage: number;
	health: number;
	ability: string;
	rarity: Rarity;
	
	constructor(cardName: string, cardCost: number, cardDamage: number, cardHealth: number, cardAbility: string, rarity: number, foil: boolean) {
		this.name = cardName;
		this.cost = cardCost;
		this.damage = cardDamage;
		this.health = cardHealth;
		this.ability = cardAbility;
		this.rarity = new Rarity(rarity,foil);
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

let cardDB = new Database();

Object.keys(cardsJSON).forEach((card) => {
	let parent = cardsJSON[card]
	cardDB.addCard(parent['name'],parent['cost'],parent['attack'],parent['health'],parent['ability'],2,false);
})	



app.get("/", (req, res) => {
  res.sendFile('index.html', {root : __dirname});
});