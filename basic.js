var express = require("express");
var app = express();
var fs = require("fs");
var cheerio = require("cheerio");
var PORT = 3000;
var cardsJSON = JSON.parse(fs.readFileSync('cards.json'));
app.listen(PORT, function () {
    console.log("Server up, on port", PORT);
});
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
    Database.prototype.addCard = function (cardName, cardCost, cardDamage, cardHealth, cardAbility, rarity, foil) {
        this.cards.push(new Card(cardName, cardCost, cardDamage, cardHealth, cardAbility, rarity, foil));
    };
    return Database;
}());
var Card = /** @class */ (function () {
    function Card(cardName, cardCost, cardDamage, cardHealth, cardAbility, rarity, foil) {
        this.name = cardName;
        this.cost = cardCost;
        this.damage = cardDamage;
        this.health = cardHealth;
        this.ability = cardAbility;
        this.rarity = new Rarity(rarity, foil);
    }
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
    return Card;
}());
var Rarity = /** @class */ (function () {
    function Rarity(rarity, foil) {
        this.rarity = rarity >= 0 && rarity <= 5 ? rarity : 0;
        this.foil = foil;
    }
    Object.defineProperty(Rarity.prototype, "cardRarity", {
        get: function () {
            return this.rarity;
        },
        set: function (value) {
            if (value < 0 || value > 5) {
                throw new Error('Please input valid rarity.');
                return;
            }
            this.rarity = value;
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
var cardDB = new Database();
Object.keys(cardsJSON).forEach(function (card) {
    var parent = cardsJSON[card];
    cardDB.addCard(parent['name'], parent['cost'], parent['damage'], parent['health'], parent['ability'], 2, false);
});
app.get("/", function (req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function (err, data) {
        if (err)
            return console.log(err);
        var $ = cheerio.load(data);
        cardDB.database.forEach(function (card) {
            $('#content').append("<div class=\"card\"><div id=\"cardName\">".concat(card.cardName, "</div><div id=\"cardCost\">").concat(card.cardCost, "</div><div id=\"cardDamage\">").concat(card.cardDamage, "</div><div id=\"cardHealth\">").concat(card.cardHealth, "</div></div>"));
        });
        res.send($.html());
    });
});
