// Imports
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

/*
 * Class for the card Database
 */
class Database {
	cards: Card[];
	
	constructor() {
		this.cards = new Array<Card>();
	}
	
	get database(): Array<Card> {
		return this.cards;
	}
	
	uniqueAttributes(attr: string): string[] {
		let _RETURN: Array<string> = [];
		this.cards.forEach((card) => {
			if (typeof card[attr] == "object") {
				card[attr].forEach((item) => {
					_RETURN.push(item);
				});
			} else {
				_RETURN.push(card[attr]);
			}
		});
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
	ability: { abilityText: string; abilityKeywords: string[] };
	rarity: number;
	archetypes: string[];
	damage: number;
	health: number;
	
	constructor(cardID: string, cardType: string, cardName: string, cardCost: number, cardAbility: object, rarity: number, archetypes: string[], cardDamage?: number, cardHealth?: number) {
		this.id = cardID;
		this.type = cardType;
		this.name = cardName;
		this.cost = cardCost;
		this.damage = cardDamage || null;
		this.health = cardHealth || null;
		this.ability = { abilityText: cardAbility['abilityText'] as string, abilityKeywords: cardAbility['abilityKeywords'] as string[] };
		this.rarity = rarity;
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
	get cardAbilityText(): string {
		return this.ability['abilityText'];
	}
	get cardAbilityKeywords(): string[] {
		return this.ability['abilityKeywords'];
	}
	get cardRarity(): number {
		return this.rarity;
	}
	get cardRarityStars(): string {
		let stars = '';
		for(let i=0;i<this.rarity;i++) {
			stars+='*';
		}
		return stars;
	}
	get cardArchetypes(): string[] {
		return this.archetypes;
	}
}

function server() : void {
	const PORT = 3000;
	const cardsJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './client/cards.json')));

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
				$('#cards').append(`<div id="${card.cardID}" class="card"></div>`);
				$(`#${card.cardID}`).append(`<div class="cardName header">${card.cardName}</div><div class="cardRarity"><b>Rarity:</b> ${card.cardRarityStars}</div><div class="cardCost"><b>Cost:</b> ${card.cardCost}</div><div class="cardDamage"><b>Damage:</b> ${card.cardDamage}</div><div class="cardHealth"><b>Health:</b> ${card.cardHealth}</div><div class="cardAbility">${card.cardAbilityText}</div><div class="cardArchetypes"><b>Archetypes:</b> ${card.cardArchetypes.join(",")}</div><div class="hidden cardAbilityTypes">${card.cardAbilityKeywords.join(",")}</div>`);
			});
			
			const _U = ["cardArchetypes", "cardAbilityKeywords", "cardRarityStars" ,"cardType"];
			for(let i=0;i<_U.length;i++) {
				cardDB.uniqueAttributes(_U[i]).forEach((item) => {
					$(`.filter-${_U[i].substring(4)}`).append(`<div class="filter-${item}"><input type="checkbox" name="${item}" value="${item}"><label for="${item}">${item}</label></div>`);
				});
			}
		 
			res.send($.html());
		});
	});
}

server();