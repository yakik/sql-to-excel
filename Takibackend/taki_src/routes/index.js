

import {   revealCards,  updatePilesAndScores} from '../modules/takeSix/takeSix'
import { setTestGame,addCardToPlayer,takeCard, takeCardBack,reshuffleUsedCards, handleSpecialCard} from '../modules/taki/taki'
import { handleEndTakiSeries} from '../modules/taki/takiTurns'
import { getGameType,reshuffle ,getGame, addGame, doesGameIDExist, addPlayer, removePlayer,updateState,selectCard} from '../modules/games'
import {gameTypes,routes,socketMsgTypes,states, envTypes} from '../constants'
var cors = require('cors')
var express = require('express');
var router = express.Router();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

if (process.env.NODE_ENV!==envTypes.PRODUCTION){
  router.post(routes.START_TESTING_NEW_GAME, cors(corsOptions), (req, res) => {
    let newID = addGame(req.body.gameType,999)
    setTestGame(getGame(newID))
    return res.json({ success: true, gameID: 999, });
  });
}

router.post(routes.START_NEW_GAME, cors(corsOptions), (req, res) => {
  let newID = addGame(req.body.gameType)
  let playerID = addPlayer(newID,req.body.playerName)
  return res.json({ success: true, gameID: newID, playerID:playerID });
});

router.post(routes.JOIN_GAME, cors(corsOptions), (req, res) => {
  let exist = doesGameIDExist(req.body.gameID)
  let status = true
  let playerID
  if (exist)
    playerID=addPlayer(req.body.gameID,req.body.playerName)
  return res.json({ success: status, exist: exist, playerID:playerID });
});

const sendState=(io, gameID, game)=>{
  io.emit(socketMsgTypes.SET_GAME_STATE, {gameID,game:game});
}

module.exports = function (io) {
  //Socket.IO
  io.on(socketMsgTypes.CONNECTION, function (socket) {
    //ON Events
    socket.on(socketMsgTypes.REFRESH, function (msg) {
      io.emit(socketMsgTypes.SET_GAME_STATE, {gameID:msg.gameID,game:getGame(msg.gameID)});
    });
    socket.on(socketMsgTypes.START_GAME, function (msg) {
      updateState(msg.gameID,states.SELECTING_CARDS)
      io.emit(socketMsgTypes.SET_GAME_STATE, {gameID:msg.gameID,game:getGame(msg.gameID)});
    });
    if (process.env.NODE_ENV!==envTypes.PRODUCTION){
      socket.on(socketMsgTypes.TESTING_ADD_CARD_TO_PLAYER, function (msg) {
        addCardToPlayer(getGame(msg.gameID),msg.playerID,msg.card)
        sendState(io,msg.gameID,getGame(msg.gameID))
      });
    }

    socket.on(socketMsgTypes.UPDATE_PILES_AND_SCORES, function (msg) {
      let remainingCards = updatePilesAndScores(getGame(msg.gameID),msg.selectedPile, msg.playersToProcess)
      if (remainingCards==0)
        updateState(msg.gameID,states.SELECTING_CARDS)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });
    socket.on(socketMsgTypes.REMOVE_PLAYER, function (msg) {
      removePlayer(msg.gameID,msg.playerID)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });
    socket.on(socketMsgTypes.REVEAL_CARDS, function (msg) {
      
      revealCards(getGame(msg.gameID))
      sendState(io,msg.gameID,getGame(msg.gameID))
    });
   
    socket.on(socketMsgTypes.RESHUFFLE, function (msg) {
      reshuffle(msg.gameID)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });

    socket.on(socketMsgTypes.TAKI_SPECIAL_CARD, function (msg) {
      handleSpecialCard(msg)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });

    socket.on(socketMsgTypes.TAKI_END_TAKI_SERIES, function (msg) {
      handleEndTakiSeries(getGame(msg.gameID),msg.playerID)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });
   
    socket.on(socketMsgTypes.SELECT_CARDS, function (msg) {
      selectCard(msg.gameID,msg)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });

    socket.on(socketMsgTypes.TAKE_CARD, function (msg) {
      takeCard(getGame(msg.gameID),msg.playerID)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });
    socket.on(socketMsgTypes.TAKE_CARD_BACK, function (msg) {
      takeCardBack(getGame(msg.gameID),msg.playerID)
      sendState(io,msg.gameID,getGame(msg.gameID))
    });
    socket.on(socketMsgTypes.RESHUFFLE_USED_CARDS, function (msg) {
      reshuffleUsedCards(getGame(msg.gameID))
      sendState(io,msg.gameID,getGame(msg.gameID))
    });

  });
  return router;
};

