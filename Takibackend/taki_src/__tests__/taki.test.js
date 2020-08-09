import { takeCard, getPlayer, addNewPlayer as addNewTakiPlayer, 
    getNewGame as getNewTakiGame, removePlayer as removeTakiPlayer, selectCard as selectCardTaki } from '../modules/taki/taki'
import { pullCardFromPack, setGamePack, getTakiPack } from "../modules/taki/takiPack"
import { takiCardTypes, takiColors, takiSpecialAction } from '../constants'



describe("taki add remove player and pack management tests", () => {


    test("add player", () => {
        let game = getNewTakiGame()
        let playerOneID = addNewTakiPlayer(game, "player one")
        let playerOne = getPlayer(game, playerOneID)
       
        expect(playerOne.ID).toBe(playerOneID)
        expect(playerOne.name).toBe("player one")
    })

    test("remove player", () => {
        let game = getNewTakiGame()
        let playerOneID = addNewTakiPlayer(game, "player one")
        removeTakiPlayer(game,playerOneID)
       
        expect(game.players.length).toBe(0)
    })

    test("remove player, 2 players", () => {
        let game = getNewTakiGame()
        let playerOneID = addNewTakiPlayer(game, "player one")
        let playerTwoID = addNewTakiPlayer(game, "player two")
        removeTakiPlayer(game,playerOneID)
        let playerOne = getPlayer(game, playerOneID)
        let playerTwo = getPlayer(game, playerTwoID)
       
        expect(game.players.length).toBe(1)
        expect(playerOne).toBe(undefined)
        expect(playerTwo.name).toBe("player two")
    })

    test("add card to player", () => {
        let game = getNewTakiGame()
        setGamePack(game,getTakiPack())
        let playerOneID = addNewTakiPlayer(game, "player one")
        
        let playerOne = getPlayer(game, playerOneID)
        expect(playerOne.cards.length).toBe(0)
        takeCard(game,playerOneID,{color: takiColors.BLUE, number:5,type:takiCardTypes.NUMBER})
        playerOne = getPlayer(game, playerOneID)
        expect(playerOne.cards.length).toBe(1)
        expect(playerOne.newCard.color).toBe(takiColors.BLUE)
        expect(playerOne.newCard.number).toBe(5)
        expect(playerOne.newCard.type).toBe(takiCardTypes.NUMBER)
    })

    test("take last card from the pack no criterion", () => {
        let game = getNewTakiGame()
        setGamePack(game,getTakiPack())

        expect(game.pack.length).toBe(116)
        let cardInPack = game.pack[game.pack.length-1]
        let card = pullCardFromPack(game)
        
        expect(game.pack.length).toBe(115)
        expect(card).toBe(cardInPack)
       
    })

    test("take a card from the pack NUMBER", () => {
        let game = getNewTakiGame()
        setGamePack(game,getTakiPack())
        expect(game.pack.length).toBe(116)
        let card = pullCardFromPack(game,{color: takiColors.BLUE, number:5,type:takiCardTypes.NUMBER})
       
        expect(game.pack.length).toBe(115)
        expect(card.color).toBe(takiColors.BLUE)
        expect(card.number).toBe(5)
        expect(card.type).toBe(takiCardTypes.NUMBER)
    })

    test("take a card from the pack NON NUMBER - change direction", () => {
        let game = getNewTakiGame()
        setGamePack(game,getTakiPack())
        expect(game.pack.length).toBe(116)
        let card = pullCardFromPack(game,{color: takiColors.BLUE, type:takiCardTypes.CHANGE_DIRECTION})
       
        expect(game.pack.length).toBe(115)
        expect(card.color).toBe(takiColors.BLUE)
        expect(card.type).toBe(takiCardTypes.CHANGE_DIRECTION)
    })

    test("take a card from the pack NON NUMBER - king", () => {
        let game = getNewTakiGame()
        setGamePack(game,getTakiPack())
        expect(game.pack.length).toBe(116)
        let card = pullCardFromPack(game,{color: takiColors.NOT_APPLICABLE, type:takiCardTypes.KING})
       
        expect(game.pack.length).toBe(115)
        expect(card.color).toBe(takiColors.NOT_APPLICABLE)
        expect(card.type).toBe(takiCardTypes.KING)
    })

   


})