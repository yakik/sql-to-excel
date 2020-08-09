import { reshuffle as reshuffleTakeSix, removePlayer as removeTakeSixPlayer, 
    addNewPlayer as addNewTakeSixPlayer, getNewGame as getNewTakeSixGame, selectCard as selectCardTakeSix } from './takeSix/takeSix'
import {  addNewPlayer as addNewTakiPlayer, 
    getNewGame as getNewTakiGame, removePlayer as removeTakiPlayer, selectCard as selectCardTaki } from './taki/taki'
    import {reshuffle as reshuffleTaki} from './takiPack'
import {gameTypes} from '../constants'

let games:Array<Game> = []

let errorGame:Game = {ID:'999999', type:gameTypes.ERROR}
let errorSpecificGame:SpecificGame = {}


export function getGame(gameID:string):SpecificGame{
    for (let i=0;i<games.length;i++)
        if (games[i].ID == gameID)
            return games[i].game as SpecificGame
    return errorSpecificGame
}

export function getGameObject(gameID:string):Game{
    for (let i=0;i<games.length;i++)
        if (games[i].ID == gameID)
            return games[i]
    return errorGame
}

export function doesGameIDExist(gameID:string){
    let exist=false
    for (let i=0;i<games.length;i++)
        if (games[i].ID == gameID)
            exist=true
    return exist
}

export function updateState(gameID:string, state:string) {
    let game:TakeSixGame = getGame(gameID) as TakeSixGame
    game.state = state
}

export function reshuffle(gameID:string){
    let game = getGameObject(gameID)
    if (game.type===gameTypes.TAKE_SIX)
        return reshuffleTakeSix(game.game as TakeSixGame)
        if (game.type===gameTypes.TAKI)
        return reshuffleTaki(game.game as TakiGame)

}
export function selectCard(gameID:string, msg:string){
    let game = getGameObject(gameID)
    if (game.type===gameTypes.TAKE_SIX)
        return selectCardTakeSix(game.game as TakeSixGame, msg)
        if (game.type===gameTypes.TAKI)
        return selectCardTaki(game.game as TakiGame, msg)

}


export function addPlayer(gameID:string, name:string, playerID:string) {
    let game = getGameObject(gameID)
    if (game.type === gameTypes.TAKE_SIX)
        return addNewTakeSixPlayer(game.game as TakeSixGame, name, playerID)
    if (game.type === gameTypes.TAKI)
        return addNewTakiPlayer(game.game as TakiGame, name, playerID)
}

export function removePlayer(gameID:string, playerID:string){
    let game = getGameObject(gameID)
    if (game.type===gameTypes.TAKE_SIX)
        return removeTakeSixPlayer(game.game as TakeSixGame, playerID)
        if (game.type===gameTypes.TAKI)
        return removeTakiPlayer(game.game as TakiGame, playerID)
}

export function getGameType(gameID:string){
    let game = getGameObject(gameID)
        return game.type
}

export function addGame(type:string,gameID:string)
{
    let newGameID:string
    if (gameID===undefined)
        newGameID = Math.round(Math.random() * 99).toString()
    else
        newGameID = gameID
    for( let i = 0; i < games.length; i++)
        if ( games[i].ID === newGameID)
            games.splice(i, 1);
    if (type===gameTypes.TAKE_SIX){
        games.push({ID:newGameID,game:getNewTakeSixGame(),type:gameTypes.TAKE_SIX})
    }
    if (type===gameTypes.TAKI){
        games.push({ID:newGameID,game:getNewTakiGame(),type:gameTypes.TAKI})
    }

    return newGameID

    
}