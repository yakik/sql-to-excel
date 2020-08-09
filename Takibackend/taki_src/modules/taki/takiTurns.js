import { messages, turnDirections, takiCardTypes, userActions } from "../../constants";
import { getTopCardOnTable } from "./takiPack"
import {getPlayer,getPlayerName} from "./taki"

export function allowed(game, playerID, action, selectedCard) {

    if (game.turn.inPlusThree) {
        if (action = userActions.SELECT_CARD) {
            let allowed = false
            game.turn.plusThreePlayersToTakeCards.forEach(playerToTake => {
                if (playerToTake.playerID === playerID && playerToTake.remainingCardsToTake > 0)
                    allowed = true
            })

            if (allowed)
                return true
        }
        else {
            if (getCardType(selectedCard)!==takiCardTypes.PLUS_THREE_BREAK){
                game.message = messages.NOT_ALLOWED_TO_PLACE_CARDS_ON_A_PLUST_THREE
                return false
            }
            else
                return true
        }
    }

    if (game.turn === undefined || game.turn.playerID === playerID){
        return true
    }
    else
        getPlayer(game,playerID).message=messages.NOT_YOUR_TURN
        return false
}

export function setTurn(game, playerID, direction) {
    game.turn = { playerID: playerID, direction: direction }
}

export function getCurrentTurnPlayerID(game) {
    return game.turn.playerID
}

const setNextPlayer = (game, nextPlayerID) => {
    game.turn.playerID = nextPlayerID
}

const getCardType = (card) => {
    if (card.type === takiCardTypes.KING)
        return card.configuration.type
    return card.type
}

const changeDirection = (game) => {
    if (game.turn.direction === turnDirections.LEFT_TO_RIGHT)
        game.turn.direction = turnDirections.RIGHT_TO_LEFT
    else
        game.turn.direction = turnDirections.LEFT_TO_RIGHT
}

export function handleEndTakiSeries(game, playerID) {
    game.turn = { ...game.turn, inTakiSeries: false, inTakiSeriesPlayerID: undefined }
    updateTurnAfterSeletingCard(game, playerID, getTopCardOnTable(game), true)
}

export function setDefaultTurn(game) {
    if (game.turn === undefined) {
        game.turn = { playerID: game.players[0].ID, direction: turnDirections.LEFT_TO_RIGHT }
    }
}


export function updateTurnAfterSeletingCard(game, playerID, selectedCard, lastTakiCard) {
    if (lastTakiCard === undefined)
        lastTakiCard = false
    
        let message = ""

    setDefaultTurn(game)

    if (!lastTakiCard && getCardType(selectedCard) === takiCardTypes.TAKI) {
        game.turn = { ...game.turn, inTakiSeries: true, inTakiSeriesPlayerID: playerID }
        return
    }

    if (game.turn.inPlus) {
        game.turn = { ...game.turn, inPlus: false, inPlusPlayerID: undefined }
    }

    if (!game.turn.inTakiSeries) {
        if (getCardType(selectedCard) === takiCardTypes.CHANGE_DIRECTION)
            changeDirection(game)

        if (getCardType(selectedCard) === takiCardTypes.PLUS_TWO) {
            if (game.turn.plusTwo === undefined)
                game.turn.plusTwo = 0
            game.turn.plusTwo += 2
            game.turn.plusTwoAdding=true
           // message = messages.pleaseTakeXCards(game.turn.plusTwo)
        }

        if (getCardType(selectedCard) === takiCardTypes.PLUS) {
            game.turn = { ...game.turn, inPlus: true, inPlusPlayerID: playerID }
            return
        }

        if (getCardType(selectedCard) === takiCardTypes.PLUS_THREE) {
            
            game.turn = { ...game.turn, inPlusThree: true, plusThreeInitiator: playerID }
            let plusThreePlayersToTakeCards = []
            game.players.forEach(player => {
                if (player.ID !== game.turn.plusThreeInitiator)
                    plusThreePlayersToTakeCards.push({ playerID: player.ID, remainingCardsToTake: 3 })
            })
            game.turn = { ...game.turn, plusThreePlayersToTakeCards: plusThreePlayersToTakeCards }
            game.message =  messages.everyoneShouldTakeThreeCardsExcept(getPlayerName(game,playerID))
            return
        }

        if (getCardType(selectedCard) === takiCardTypes.PLUS_THREE_BREAK && game.turn.inPlusThree) {
            game.turn = { ...game.turn,
                plusThreePlayersToTakeCards: [{playerID:game.turn.plusThreeInitiator,remainingCardsToTake:3}] }
                game.message = messages.shouldTakeThreeCards(getPlayerName(game,playerID))
                return
        }

        setNextPlayer(game, getNextPlayerID(game.turn.playerID, game.players, game.turn.direction, getCardType(selectedCard)))
       
                game.message = messages.itIsPlayerXTurn(getPlayerName(game, game.turn.playerID))
                if (game.turn.plusTwo>0)
                    getPlayer(game,game.turn.playerID).message = messages.PleaseEitherPlaceTwoPlusOrTakeCards(game.turn.plusTwo)
    }
}

export function updateTurnAfterTakingCard(game, playerID) {
    setDefaultTurn(game)
    if (game.turn.inPlusThree) {

        let allPlayersTookTheirThree = true
        let newPlusThreePlayersToTakeCards = []
        
        game.turn.plusThreePlayersToTakeCards.forEach(playerToTake => {

            if (playerToTake.playerID === playerID) {
                playerToTake.remainingCardsToTake -= 1
            }
            if (playerToTake.remainingCardsToTake > 0){
                allPlayersTookTheirThree = false
                newPlusThreePlayersToTakeCards.push(playerToTake)
            }
        })

        if (allPlayersTookTheirThree) {
            game.turn = {
                ...game.turn, inPlusThree: false,
                plusThreeInitiator: undefined, plusThreePlayersToTakeCards: undefined
            }
        }
        else
            game.turn = {...game.turn, plusThreePlayersToTakeCards:newPlusThreePlayersToTakeCards}
    }

    if (!game.turn.inPlusThree) {
        if (game.turn.plusTwo !== undefined && game.turn.plusTwo > 1) {
            game.turn.plusTwo -= 1
            game.turn.plusTwoAdding=false
            getPlayer(game,game.turn.playerID).message = messages.pleaseTakeXCards(game.turn.plusTwo)
        }
        else
            setNextPlayer(game, getNextPlayerID(game.turn.playerID, game.players, game.turn.direction))
    }
    game.message = messages.itIsPlayerXTurn(getPlayerName(game, game.turn.playerID))
    
}

export function getNextPlayerID(currentPlayerID, players, direction, cardType) {
    let currentPlayerIndex = players.findIndex((player) => player.ID === currentPlayerID)
    let nextPlayerIndex
    let steps = 1
    if (cardType !== undefined) {
        if (cardType === takiCardTypes.STOP)
            steps = 2
    }
    if (direction === turnDirections.LEFT_TO_RIGHT)
        nextPlayerIndex = (currentPlayerIndex + steps) % (players.length)
    else
        nextPlayerIndex = (players.length + currentPlayerIndex - steps) % players.length

    return players[nextPlayerIndex].ID
}
