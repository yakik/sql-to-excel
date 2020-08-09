import { userActions, takiCardTypes, takiSpecialAction, takiColors } from '../../constants'
import { getTakiCard,areEqual, pullCardFromPack } from './takiPack'
import { allowed, updateTurnAfterSeletingCard, updateTurnAfterTakingCard} from './takiTurns'
import {selectCardValidation} from './takiValidations'


export function getNewGame() {
    let game = {}
    game.players = []
    game.lastPlayerID = 0
    game.pack=[]
    game.onTable = []
    game.turn = {inTakiSeries:false}

    return game
}
export function assignCardsForPlayers(game) {
    game.players.forEach(player => {
        player.cards = []
        for (let i = 0; i < 8; i++)
            player.cards.push(pullCardFromPack(game))
        player.cards = player.cards.sort(sortCards)
    })
}

export function setTestGame(game){
    addNewPlayer(game,"0",0)
    addNewPlayer(game,"1",1)
    addNewPlayer(game,"2",2)
    addNewPlayer(game,"3",3)
    for (let i = 0; i < 20; i++)
        game.pack.push(getTakiCard(takiCardTypes.NUMBER,{color:takiColors.GREEN,number:"5"}));
    game.onTable.push(getTakiCard(takiCardTypes.NUMBER,{color:takiColors.GREEN,number:"5"}))
  }



export function addNewPlayer(game, name, playerID) {
    let ID
    if (playerID===undefined)
        ID = game.lastPlayerID++
    else
        ID = playerID
    game.players.push({ name: name, ID: ID, cards: [], message:''})
    if (game.turn.playerID===undefined)
        game.turn.playerID=ID
    
    return ID
}

export function removePlayer(game, playerID) {
    let newPlayers = []

    game.players.map(player => {
        if (player.ID !== playerID)
            newPlayers.push(player)
        else {
            if (player.cards !== undefined) {
                player.cards.forEach(card => {
                    game.pack.push(card)
                })
            }
        }
    })
    game.players = newPlayers
}

export function getPlayer(game, ID) {
    return game.players.find((player) => player.ID === ID)
}

export function getPlayerID(game, name) {
    return game.players.find((player) => player.name === name).ID
}

export function getPlayerName(game, ID) {
    return game.players.find((player) => player.ID === ID).name
}



export function selectCard(game, msg) {
    getPlayer(game,msg.playerID).error=undefined
   
    if (!allowed(game,msg.playerID,userActions.SELECT_CARD,msg.selectCard))
        return
    let error=selectCardValidation(game,msg.playerID, msg.selectedCard)
    if (error!=undefined){
        getPlayer(game,msg.playerID).error = error
        return
    }
    
    game.players = resetTakenCards(game.players)
    moveCardFromPlayerToTable(game,msg.playerID,msg.selectedCard)
    updateTurnAfterSeletingCard(game,msg.playerID,msg.selectedCard)
    game.lastPlayerPlacedCard = msg.playerID
}

const moveCardFromPlayerToTable=(game,playerID,cardToMove)=>{
    let player = getPlayer(game, playerID)
    let newCards = player.cards.filter((card) => !areEqual(card,cardToMove))
    game.onTable.push({ ...cardToMove, player: player.name })
    player.cards = newCards.sort(sortCards)
}

const resetTakenCards = (players) => {
    return players.map(player => {
        let newPlayer = { ...player }
        newPlayer.newCard = undefined
        return newPlayer
    })
}

export function addCardToPlayer(game,playerID,card){
    let player = getPlayer(game, playerID)
    player.newCard = card
    player.cards.push(card)

}



export function takeCard(game, playerID, criterion) {
    if (!allowed(game, playerID, userActions.TAKE_CARD))
        return
    game.players = resetTakenCards(game.players)
    if (game.pack.length === 0)
        return
    let card = pullCardFromPack(game, criterion)
    let player = getPlayer(game, playerID)
    
    addCardToPlayer(game,playerID,card)

    updateTurnAfterTakingCard(game,playerID)
    

    player.cards = player.cards.sort(sortCards)
}

export function resetCard(card) {
    let newCard = { ...card }
    if (newCard.type === takiCardTypes.KING)
        newCard.kingSelection = undefined
    if (newCard.type === takiCardTypes.CHANGE_COLOR)
        newCard.changeColorSelection = undefined
    newCard.player = undefined
    return newCard

}

export function takeCardBack(game, playerID) {
    if (playerID === game.lastPlayerPlacedCard) {
        let player = getPlayer(game, playerID)
        let card = game.onTable.pop()
        player.cards.push(resetCard(card))
        player.cards = player.cards.sort(sortCards)
        game.lastPlayerPlacedCard = undefined
    }
}

const getCardValueForSorting=(card)=>{
    let value = 0;
    switch (card.color){
        case takiColors.NOT_APPLICABLE: value+=1000
        break
        case takiColors.BLUE: value+=100
        break
        case takiColors.RED: value+=200
        break
        case takiColors.YELLOW: value+=300
        break
        case takiColors.GREEN: value+=400
        break
    }

    switch (card.type){
        case takiCardTypes.NUMBER: value+=card.number
        break
        case takiCardTypes.PLUS_TWO: value+=2
        break
        case takiCardTypes.TAKI: value+=20
        break
        case takiCardTypes.STOP: value+=25
        break
        case takiCardTypes.CHANGE_DIRECTION: value+=30
        break
        case takiCardTypes.PLUS: value+=35
        break
        case takiCardTypes.CHANGE_COLOR: value+=40
        break
        case takiCardTypes.KING: value+=45
        break
        case takiCardTypes.PLUS_THREE: value+=50
        break
        case takiCardTypes.PLUS_THREE_BREAK: value+=55
        break
    }
    return value
}

const sortCards = (a, b) => {
    
    return getCardValueForSorting(a) - getCardValueForSorting(b)

}


