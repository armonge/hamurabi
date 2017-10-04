'use strict';

var _ = require('lodash')
  , Promise = require('bluebird')
  , lang = require('alexa-helpers').lang
  , gameParams = require('../config').game
  ;

exports.accident = function(game) {
  return _.sample(['fire','earthquake','hurricane','tornado','tsunami','alien invasion','mole men attack']);
}

exports.mostCanBuyAcres = function(game) {
  return lang.quantify(game.command.mostCanBuy(game),'acre');
}

exports.mostCanSellAcres = function(game) {
  return lang.quantify(game.command.mostCanSell(game),'acre');
}

exports.leastCanSellAcres = function(game) {
  return lang.quantify(game.command.leastCanSell(game),'acre');
}

exports.mostCanFeedPeople = function(game) {
  return lang.quantify(game.command.mostCanFeed(game),'person','people');
}

exports.mostCanPlantAcres = function(game) {
  return lang.quantify(game.command.mostCanPlant(game),'acre');
}

exports.mostCanPlantBushels = function(game) {
  return lang.quantify(game.command.mostCanPlant(game),'bushel');
}

exports.acresCost = function(game) {
  return lang.quantify(game.acresCost,'bushel');
}

exports.buyAcres = function(game) {
  if(game.command.buy === 0) return 'no acres';
  return lang.quantify(Math.abs(game.command.buy),'acre');
}

exports.sellAcres = function(game) {
  if(game.command.buy === 0) return 'no acres';
  return lang.quantify(-1 * game.command.buy,'acre');
}

exports.attemptedSellAcres = function(game) {
  return lang.quantify(-1 * game.command.attemptedBuy,'acre');
}

exports.buyBushels = function(game) {
  return lang.quantify(game.command.buy * game.acresCost,'bushel');
}

exports.sellBushels = function(game) {
  return lang.quantify(-1 * game.command.buy * game.acresCost,'bushel');
}

exports.feedPeople = function(game) {
  return lang.quantify(game.command.feed,'person','people');
}

exports.starvePeople = function(game) {
  return lang.quantify(game.population - game.command.feed,'person','people');
}

exports.populationPeople = function(game) {
  return lang.quantify(game.population,'person','people');
}

exports.feedBushels = function(game) {
  return lang.quantify(game.command.feed * gameParams.bushelsToFeedPerson,'bushel');
}

exports.plantAcres = function(game) {
  return lang.quantify(game.command.plant,'acre');
}

exports.plantBushels = function(game) {
  return lang.quantify(game.command.plant,'bushel');
}

exports.bushels = function(game) {
  return lang.quantify(game.bushels,'bushel');
}

exports.acres = function(game) {
  return lang.quantify(game.acres,'acre');
}

exports.acresUnused = function(game) {
  return lang.quantify(game.command.acresLeft(game),'unused acres');
}

exports.bushelsUnused = function(game) {
  return lang.quantify(game.command.bushelsLeft(game),'unused bushel');
}

exports.bushelsLeft = function(game) {
  return lang.quantify(game.command.bushelsLeft(game),'bushel') + ' left';
}

exports.bushelsRemaining = function(game) {
  return lang.quantify(game.command.bushelsLeft(game),'remaining bushel');
}

exports.commandStatus = function(game) {
  var statements = [];
  if(game.command.buy > 0) statements.push("You're buying " + exports.buyAcres(game,game.command) +'.')
  if(game.command.buy < 0) statements.push("You're selling " + exports.buyAcres(game,game.command) +'.')
  if(game.command.plant) statements.push("You're planting " + exports.plantAcres(game,game.command) +'.')
  if(game.command.feed) statements.push("You're feeding " + exports.feedPeople(game,game.command) +'.')

  if(!statements.length) return "You've got no plans yet this year and have " + exports.bushels(game,game.command) +  ".";
  return statements.join('\n') + "\nYou've got " + exports.bushelsRemaining(game,game.command)+".";
}

exports.kingdomStatus = function(game) {
  if(game.year == 1) {
    return "hamurabi: i beg to report to you,\n" +
  "in year " + game.year +" your population is " + game.population + ".\n" +
  "the city owns " + acres(game.acres) + ".\n" +
  ( game.year != 1 ?"you harvested " + bushels(game.yield) +" per acre.\n":'') +
  "you have " + bushels(game.bushels) +" in store.\n" +
  "land is trading at " + bushels(game.acresCost) + " per acre."
  }

  return "hamurabi: i beg to report to you,\n" +
"in year " + game.year +" " + people(game.peopleDied) + " starved and " + people(game.immigrants) +" came to the city.\n" +
( game.hadPlague  ? "a horrible plague struck! half the people died.\n" :'') +
"population is now " + game.population + ".\n" +
"the city now owns " + acres(game.acres) + ".\n" +
( game.year != 1 ?"you harvested " + bushels(game.yield) +" per acre.\n":'') +
( game.eaten ?"rats ate " + bushels(game.eaten) +".\n":'') +
"you now have " + bushels(game.bushels) +" in store.\n" +
"land is trading at " + bushels(game.acresCost) + " per acre."
          ;
}

exports.finalKingdomStatus = function(game) {
  var despedida ="so long for now."
    , loseMsg =
      "due to this extreme mismanagement you have not only\n" +
      "been impeached and thrown out of office but you have\n" +
      "also been declared national fink!!\n" + despedida
  , acresPerPerson = game.acresPerPerson
;

  if(game.hasRevolt) {
    return "you starved " + people(game.peopleDied) + " in one year!!!\n" + loseMsg;
  }
  var msg =
"in your 10-year term of office, " + game.percentPopDied.toFixed(0) + " percent of the\n" +
"population starved per year on average, i.e., a total of " + people(game.peopleDied) + " died!!\n"+
"you started with 10 acres per person and ended with " + acresPerPerson + " acres per person.\n";

  if (game.percentPopDied > 33 || acresPerPerson < 7) return msg + loseMsg;
  if (game.percentPopDied > 10 || acresPerPerson < 9)
  {
    return msg + "your heavy-handed performance smacks of nero and ivan iv.\n" +
      "the people (remaining) find you an unpleasant ruler, and,\n"+
      "frankly, hate your guts!\n" + despedida;
      ;
  }
  else if (game.percentPopDied > 3 || acresPerPerson < 10)
  {
    return msg + "your performance could have been somewhat better, but really wasn't too bad at all.\n" +
      Math.floor(game.population * .8 * Math.random() )+ " people would " +
      "dearly like to see you assassinated but we all have our " +
      "trivial problems.\n" + despedida;
  }
  else
  {
    return msg +"a fantastic performance!!! charlemange, disraeli, and\n" +
      "jefferson combined could not have done better!\n" + despedida;
  }
}

function people(cnt) {
  return !cnt ? 'nobody'
       : cnt == 1 ? '1 person'
       : '' + cnt +' people'
}

function acres(cnt) {
  return !cnt ? 'no acres'
       : cnt == 1 ? '1 acre'
       : cnt <= 1 ? '1 acre'
       : '' + cnt +' acres'
}

function bushels(cnt) {
  return !cnt ? 'no bushels'
       : cnt == 1 ? '1 bushel'
       : '' + cnt +' bushels'
}
