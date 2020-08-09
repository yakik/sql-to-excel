const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");
import {
  getPlayerName,addCardToPlayer,getPlayerID,selectCard, takeCard, getPlayer, addNewPlayer as addNewTakiPlayer,
  getNewGame as getNewTakiGame, removePlayer as removeTakiPlayer, selectCard as selectCardTaki
} from '../../modules/taki/taki'
import { getTakiPack, getTakiCard, setGamePack } from "../../modules/taki/takiPack"
import {  messages,takiCardTypes, turnDirections } from '../../constants'
import {handleEndTakiSeries, setTurn, getCurrentTurnPlayerID} from '../../modules/taki/takiTurns'
import { getShuffledPack } from '../../modules/cards';

Given("a game with players:", function(dataTable) {
  this.game = getNewTakiGame()
  setGamePack(this.game, getShuffledPack(getTakiPack()));
  dataTable.rawTable[0].forEach(player=>addNewTakiPlayer(this.game, player))
});

Given("it is {string} turn, direction is {string}", function(playerName,turnDirection) {
  setTurn(this.game,getPlayerID(this.game,playerName),turnDirections[turnDirection])
});

When('{string} places a {string} {int} card on the table', function (playerName, color, number) {
  let card = getTakiCard(takiCardTypes.NUMBER,{number:number,color:color} )
  addCardToPlayer(this.game,getPlayerID(this.game,playerName),card)
  selectCard(this.game, { playerID: getPlayerID(this.game,playerName), selectedCard: card })
  
});

When('{string} takes a card from the pack', function (playerName) {
  takeCard(this.game, getPlayerID(this.game,playerName))
});

When('{string} takes {int} cards from the pack', function (playerName, numberOfCards) {
  for (let i=0;i<numberOfCards;i++)
    takeCard(this.game, getPlayerID(this.game,playerName))
  });

When('{string} places a {string} {string} card on the table', function (playerName, color, cardType) {
  let card = getTakiCard(takiCardTypes[cardType],{color:color})
  addCardToPlayer(this.game,getPlayerID(this.game,playerName),card)
  selectCard(this.game, { playerID: getPlayerID(this.game,playerName), selectedCard: card })
});

When('{string} places a plus three card on the table', function (playerName) {
  let card = getTakiCard(takiCardTypes.PLUS_THREE)
  addCardToPlayer(this.game,getPlayerID(this.game,playerName),card)
  selectCard(this.game, { playerID: getPlayerID(this.game,playerName), selectedCard: card })
});

When('{string} suddenly comes up with a plus three break card and places it on the table', function (playerName) {
  let card = getTakiCard(takiCardTypes.PLUS_THREE_BREAK)
  addCardToPlayer(this.game,getPlayerID(this.game,playerName),card)
  selectCard(this.game, { playerID: getPlayerID(this.game,playerName), selectedCard: card })
});


When('{string} places a King {string} {string} card on the table', function (playerName, color, cardType) {
  let card = getTakiCard(takiCardTypes.KING)
  addCardToPlayer(this.game,getPlayerID(this.game,playerName),card)
  selectCard(this.game, { playerID: getPlayerID(this.game,playerName),
    selectedCard: {...card,configuration:{type:takiCardTypes[cardType],color:color}}})
});

When('{string} indicates Taki series is done', function (playerName) {
  handleEndTakiSeries(this.game,getPlayerID(this.game,playerName))
});

Then('next player is {string}', function (playerName) {
  expect(getPlayerName(this.game,getCurrentTurnPlayerID(this.game))).to.eql(playerName)
});

Then('{string} is asked to either take {int} cards or place a plus two card', function (playerName, numberOfCards) {
  expect(getPlayer(this.game,getPlayerID(this.game,playerName)).message).to.eql(messages.PleaseEitherPlaceTwoPlusOrTakeCards(numberOfCards))
  });

Then('{string} is asked to take {int} cards', function (playerName, numberOfCards) {
  expect(getPlayer(this.game,getPlayerID(this.game,playerName)).message).to.eql(messages.pleaseTakeXCards(numberOfCards))
});

Then('it is still {string} turn. The following players need to take cards:', function (playerName, dataTable) {
  expect(getPlayerName(this.game, getCurrentTurnPlayerID(this.game))).to.eql(playerName,"Player name check")
  expect(this.game.turn.plusThreePlayersToTakeCards.length).to.eql(dataTable.rawTable.length,"number of players to take cards")
  dataTable.rawTable.forEach(playerToTakeCards => {
    let playerID = getPlayerID(this.game, playerToTakeCards[0])
    let cardsToTake = playerToTakeCards[1]
    expect(parseInt(cardsToTake, 10)).to.eql(
      this.game.turn.plusThreePlayersToTakeCards.find(player => player.playerID === playerID).remainingCardsToTake,"number of cards to take for player ID:"+playerID)
    //expect(getPlayer(this.game,playerID).message).to.eql(messages.pleaseTakeXCards(cardsToTake))

  })

});

 
