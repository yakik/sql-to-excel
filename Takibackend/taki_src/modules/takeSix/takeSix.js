import { getShuffledPack,  getCardsForPlayer } from '../cards'
import {states} from '../../constants'

//select_cards -> all_selected -> cards_to_piles -> select cards

export function getNewGame() {
    let game = {}
    game.players = []
    game.lastPlayerID = 0
    game.allowSelection = true
    game.state = states.SELECTING_CARDS
    reshuffle(game)
    return game
}
export function revealCards(game) {
    game.players = game.players.sort(function (a, b) { return a.selectedCard.number - b.selectedCard.number })
    for (let i = 0; i < game.players.length; i++)
        game.players[i].selectedCard.show = game.players[i].selectedCard.number + game.players[i].selectedCard.sign
    game.state=states.RELATING_CARDS_TO_PILES
}

export function addNewPlayer(game, name) {
    let cards
    let a = getCardsForPlayer(game.pack)
    cards = a.cards
    game.pack = a.pack
    let ID = game.lastPlayerID++
    game.players.push({ name: name, ID:ID, changeThisTurn: 0,score: 0, cards: cards, selectedCard: { number: "X", sign: "", show: '--' } })
    return ID
}

export function getTakeSixPack() {
    let pack = []
    for (let r = 0; r < 104; r++) {
      pack.push({ number: (r + 1), sign: '', points: 0, show: '--' })
      if (pack[r] == 55)
        pack[r].sign += "*******"
      else {
        pack[r].sign += "*"
        if ((r + 1) % 11 == 0)
          pack[r].sign += "****"
        if ((r + 1) % 10 == 0)
          pack[r].sign += "**"
        if ((r + 1) % 5 == 0 && (r + 1) % 10 != 0)
          pack[r].sign += "*"
        pack[r].points = pack[r].sign.length
      }
  
    }
  
    return pack
  }



export function reshuffle(game) {
    let cards
    game.pack = getShuffledPack(getTakeSixPack())

    game.players.map(player => {
        let a = getCardsForPlayer(game.pack)
        cards = a.cards
        game.pack = a.pack
        player.cards = cards
        player.score = 0
        player.selectedCard = { number: "X", sign: "" }
    })
    game.piles = [[], [], [], []]
    for (let i = 0; i < 4; i++)
        game.piles[i].push(game.pack.pop())
    game.state=states.SELECTING_CARDS
}

export function newGame(game) {
    game.players = []
    game.pack = getShuffledPack(getTakeSixPack())
    game.piles = [[], [], [], []]
    for (let i = 0; i < 4; i++)
        game.piles[i].push(game.pack.pop())
}

export function selectCard(game, msg) {

    game.players.map(player => {
        if (player.ID == msg.playerID) {
            player.selectedCard = msg.selectedCard
            player.selectedCard.show = "?"
        }
    })
    let numberOfPlayersWithSelection = 0
    game.players.map(player => {
        if (player.selectedCard.show === "?")
            numberOfPlayersWithSelection++
    })
    if (numberOfPlayersWithSelection === game.players.length)
        game.state = states.ALL_PLAYERS_SELECTED_CARDS

}

export function removePlayer(game, playerID) {
    let newPlayers = []

    game.players.map(player => {
        if (player.ID !== playerID)
            newPlayers.push(player)
        else{
            player.cards.map(card=>{
                game.pack.push(card)
            })
        }
    })
    game.players = newPlayers
}


export function getPlayers(game) {
    return game.players
}

export function getPiles(game) {
    return game.piles
}

export function whichPileToAdd(piles, selectedCard) {

    let maxAndLength = []
    if (isNaN(selectedCard.number))
        return -1
    for (let i = 0; i < piles.length; i++) {
        maxAndLength.push({ pile: i, max: piles[i][piles[i].length - 1].number })
    }
    maxAndLength = maxAndLength.sort(function (a, b) { return a.max - b.max })
    if (selectedCard.number < maxAndLength[0].max) {
        return -1
    }

    for (let i = maxAndLength.length - 1; i >= 0; i--)
        if (selectedCard.number > maxAndLength[i].max)
            return maxAndLength[i].pile

}


export function updatePilesAndScores(game, pileToReplace, numberOfPlayersToProcess) {


    
    game.players = game.players.sort(function (a, b) { return a.selectedCard.number - b.selectedCard.number })
    let processedPlayers = 0
    let howManyToProcess = 0
    game.players.map(player => {
        if (player.selectedCard.show !== "--")
            howManyToProcess++
    })
    for (let playerIndex = 0; playerIndex < game.players.length; playerIndex++) {
        if (game.players[playerIndex].selectedCard.show !== '--') {
            game.players[playerIndex].changeThisTurn = 0
            let t = whichPileToAdd(game.piles, game.players[playerIndex].selectedCard)
            let newPileItem = Object.assign({}, game.players[playerIndex].selectedCard)
            if (t != -1) {
                if (game.piles[t] === undefined)
                    return -1
                if (game.piles[t].length == 5) {
                    for (let y = 0; y < game.piles[t].length; y++) {
                        game.players[playerIndex].score += game.piles[t][y].points
                        game.players[playerIndex].changeThisTurn += game.piles[t][y].points
                    }
                    game.piles[t] = [newPileItem]
                }
                else {
                    game.piles[t].push(newPileItem)
                }
            }
            if (t == -1) {
                if (game.piles[pileToReplace] === undefined)
                    return -1

                for (let y = 0; y < game.piles[pileToReplace].length; y++) {
                    game.players[playerIndex].score += game.piles[pileToReplace][y].points
                    game.players[playerIndex].changeThisTurn += game.piles[pileToReplace][y].points
                }
                game.piles[pileToReplace] = [newPileItem]
            }
            let newCards = []
            game.players[playerIndex].cards.map(card => {
                if (card.number !== game.players[playerIndex].selectedCard.number)
                    newCards.push(card)
            })
            game.players[playerIndex].cards = newCards
            game.players[playerIndex].selectedCard.show = "--"
            game.players[playerIndex].selectedCard.number = ""

            processedPlayers++
            if (processedPlayers == numberOfPlayersToProcess)
                return (howManyToProcess - processedPlayers)
            if (processedPlayers === howManyToProcess)
                return (howManyToProcess - processedPlayers)

        }
    }
}