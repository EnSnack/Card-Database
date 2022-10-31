// Imports
var express = require("express");
var app = express();
var fs = require("fs");
var cheerio = require("cheerio");
/*
 * Class for the card Database
 */
var Database = /** @class */ (function () {
    function Database() {
        this.cards = new Array;
    }
    Object.defineProperty(Database.prototype, "database", {
        get: function () {
            return this.cards;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "uniqueArchetypes", {
        // Maybe combine uniqueArchetypes + uniqueAbilityTypes to one?
        get: function () {
            var _RETURN = [];
            this.cards.forEach(function (card) {
                card.cardArchetypes.forEach(function (archetype) {
                    if (_RETURN.indexOf(archetype) == -1)
                        _RETURN.push(archetype);
                });
            });
            return _RETURN;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "uniqueAbilityTypes", {
        get: function () {
            var _RETURN = [];
            this.cards.forEach(function (card) {
                card.cardAbility.cardAbilityKeywords.forEach(function (abilityType) {
                    if (_RETURN.indexOf(abilityType) == -1)
                        _RETURN.push(abilityType);
                });
            });
            return _RETURN;
        },
        enumerable: false,
        configurable: true
    });
    Database.prototype.addCard = function (cardID, cardData, foil) {
        this.cards.push(new Card(cardID, cardData['name'], cardData['cost'], cardData['damage'], cardData['health'], cardData['ability'], cardData['rarity'], foil, cardData['archetypes']));
    };
    return Database;
}());
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
var Card = /** @class */ (function () {
    function Card(cardID, cardName, cardCost, cardDamage, cardHealth, cardAbility, rarity, foil, archetypes) {
        this.id = cardID;
        this.name = cardName;
        this.cost = cardCost;
        this.damage = cardDamage;
        this.health = cardHealth;
        this.ability = new Ability(cardAbility['abilityText'], cardAbility['abilityKeywords']);
        this.rarity = new Rarity(rarity, foil);
        this.archetypes = archetypes;
    }
    Object.defineProperty(Card.prototype, "cardID", {
        get: function () {
            return this.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "cardName", {
        get: function () {
            return this.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "cardCost", {
        get: function () {
            return this.cost;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "cardDamage", {
        get: function () {
            return this.damage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "cardHealth", {
        get: function () {
            return this.health;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "cardAbility", {
        get: function () {
            return this.ability;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "cardRarity", {
        get: function () {
            return this.rarity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "cardArchetypes", {
        get: function () {
            return this.archetypes;
        },
        enumerable: false,
        configurable: true
    });
    return Card;
}());
/*
 * Class for the rarity status of a card
 * Takes 2 necessary parameters:
 * rarity {number} - The numeric rarity of a card.
 * foil {boolean} - Whether the card is foil or not.
 */
var Rarity = /** @class */ (function () {
    function Rarity(rarity, foil) {
        this.rarity = rarity >= 1 && rarity <= 5 ? rarity : 0;
        this.foil = foil;
    }
    Object.defineProperty(Rarity.prototype, "cardRarityRaw", {
        get: function () {
            return this.rarity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rarity.prototype, "cardRarityStars", {
        get: function () {
            var stars = '';
            for (var i = 0; i < this.rarity; i++) {
                stars += '*';
            }
            return stars;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rarity.prototype, "cardFoil", {
        get: function () {
            return this.foil;
        },
        set: function (value) {
            this.foil = value;
        },
        enumerable: false,
        configurable: true
    });
    return Rarity;
}());
/*
 * Class for the ability of a card
 * Takes 2 necessary parameters:
 * abilityText {string} - The literal ability text of a card.
 * abilityKeywords {Array} - Keywords to be found in the ability text.
 */
var Ability = /** @class */ (function () {
    function Ability(abilityText, abilityKeywords) {
        this.abilityText = abilityText;
        this.abilityKeywords = abilityKeywords;
    }
    Object.defineProperty(Ability.prototype, "cardAbilityText", {
        get: function () {
            return this.abilityText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ability.prototype, "cardAbilityKeywords", {
        get: function () {
            return this.abilityKeywords;
        },
        enumerable: false,
        configurable: true
    });
    return Ability;
}());
function server() {
    var PORT = 3000;
    var cardsJSON = JSON.parse(fs.readFileSync('js/cards.json'));
    app.listen(PORT, function () {
        console.log("Server up on port", PORT);
    });
    app.use("/css", express.static(__dirname + '/css'));
    app.use("/js", express.static(__dirname + '/js'));
    app.get("/", function (req, res) {
        var cardDB = new Database();
        Object.keys(cardsJSON).forEach(function (card) {
            var parent = cardsJSON[card];
            cardDB.addCard(card, parent, false);
        });
        fs.readFile(__dirname + '/index.html', 'utf8', function (err, data) {
            if (err)
                return console.log(err);
            var $ = cheerio.load(data);
            cardDB.database.forEach(function (card) {
                $('#cards').append("<div class=\"card\"><div class=\"cardName header\">".concat(card.cardName, "</div><div class=\"cardRarity\"><b>Rarity:</b> ").concat(card.cardRarity.cardRarityStars, "</div><div class=\"cardCost\"><b>Cost:</b> ").concat(card.cardCost, "</div><div class=\"cardDamage\"><b>Damage:</b> ").concat(card.cardDamage, "</div><div class=\"cardHealth\"><b>Health:</b> ").concat(card.cardHealth, "</div><div class=\"cardAbility\">").concat(card.cardAbility.cardAbilityText, "</div><div class=\"cardArchetypes\"><b>Archetypes:</b> ").concat(card.cardArchetypes.join(","), "</div><div class=\"hidden cardAbilityTypes\">").concat(card.cardAbility.cardAbilityKeywords.join(","), "</div></div>"));
            });
            cardDB.uniqueArchetypes.forEach(function (archetype) {
                $('.filter-Archetypes').append("<div class=\"filter-".concat(archetype, "\"><input type=\"checkbox\" name=\"").concat(archetype, "\" value=\"").concat(archetype, "\"><label for=\"").concat(archetype, "\">").concat(archetype, "</label></div>"));
            });
            cardDB.uniqueAbilityTypes.forEach(function (abilityType) {
                $('.filter-AbilityTypes').append("<div class=\"filter-".concat(abilityType, "\"><input type=\"checkbox\" name=\"").concat(abilityType, "\" value=\"").concat(abilityType, "\"><label for=\"").concat(abilityType, "\">").concat(abilityType, "</label></div>"));
            });
            res.send($.html());
        });
    });
}
server();
