import { takeCardBack, selectCard, takeCard, getPlayer, addNewPlayer as addNewTakiPlayer, 
    getNewGame as getNewTakiGame, removePlayer as removeTakiPlayer, selectCard as selectCardTaki } from '../modules/taki/taki'
import { getTakiPack, reshuffleUsedCards, pullCardFromPack, setGamePack } from "../modules/taki/takiPack"
import { takiCardTypes, takiColors, takiSpecialAction } from '../constants'



describe("take and return cards", () => {


    test("take card", () => {
        let game = getNewTakiGame()
        let gameJustForPack = getNewTakiGame()
        setGamePack(gameJustForPack,getTakiPack())

        game.pack.push(pullCardFromPack(gameJustForPack,{number: 5, color: takiColors.RED, type:takiCardTypes.NUMBER}))
        game.pack.push(pullCardFromPack(gameJustForPack,{number: 6, color: takiColors.RED, type:takiCardTypes.NUMBER}))
        
        expect(game.pack.length).toBe(2)
        
        let playerOneID = addNewTakiPlayer(game, "player one")

        takeCard(game, playerOneID)

        expect(game.pack.length).toBe(1)

        expect(getPlayer(game, playerOneID).cards.length).toBe(1)
        expect(getPlayer(game, playerOneID).cards[0].number).toBe(6)
        expect(getPlayer(game, playerOneID).cards[0].type).toBe(takiCardTypes.NUMBER)
        expect(getPlayer(game, playerOneID).cards[0].color).toBe(takiColors.RED)
        
        takeCard(game, playerOneID)

        expect(game.pack.length).toBe(0)
        expect(getPlayer(game, playerOneID).cards.length).toBe(2)
        
    })

    test("take card from empty pack", () => {
        let game = getNewTakiGame()
        
        expect(game.pack.length).toBe(0)
        
        let playerOneID = addNewTakiPlayer(game, "player one")

        takeCard(game, playerOneID)

        expect(game.pack.length).toBe(0)

        expect(getPlayer(game, playerOneID).cards.length).toBe(0)
    })

    test("whole cycle", () => {
        let game = getNewTakiGame()
        let gameJustForPack = getNewTakiGame()
        setGamePack(gameJustForPack,getTakiPack())
        game.pack.push(pullCardFromPack(gameJustForPack,{number:4, color: takiColors.RED, type:takiCardTypes.NUMBER}))
        let card = pullCardFromPack(gameJustForPack,{number: 5, color: takiColors.RED, type:takiCardTypes.NUMBER})
        game.pack.push(card)
        let playerOneID = addNewTakiPlayer(game, "player one")

        expect(game.pack.length).toBe(2)
        expect(game.onTable.length).toBe(0)
        expect(getPlayer(game, playerOneID).cards.length).toBe(0)

        takeCard(game, playerOneID)

        expect(game.pack.length).toBe(1)
        expect(game.onTable.length).toBe(0)
        expect(getPlayer(game, playerOneID).cards.length).toBe(1)
        expect(getPlayer(game, playerOneID).cards[0]).toEqual(card)

        selectCard(game, {playerID:playerOneID, selectedCard:getPlayer(game, playerOneID).cards[0]}) 

        expect(game.pack.length).toBe(1)
        expect(game.onTable.length).toBe(1)
        expect(getPlayer(game, playerOneID).cards.length).toBe(0)
        expect(game.onTable[0]).toEqual({...card,player:"player one"})
        
        takeCardBack(game, playerOneID)

        expect(game.pack.length).toBe(1)
        expect(game.onTable.length).toBe(0)
        expect(getPlayer(game, playerOneID).cards.length).toBe(1)
        expect(getPlayer(game, playerOneID).cards[0]).toEqual(card)

        takeCard(game, playerOneID)
        reshuffleUsedCards(game) //just making sure reshuffle doesn't fail when no cards on table

        expect(game.pack.length).toBe(0)
        expect(game.onTable.length).toBe(0)
        expect(getPlayer(game, playerOneID).cards.length).toBe(2)

        selectCard(game, {playerID:playerOneID, selectedCard:getPlayer(game, playerOneID).cards[0]})
        selectCard(game, {playerID:playerOneID, selectedCard:getPlayer(game, playerOneID).cards[0]})

        expect(game.pack.length).toBe(0)
        expect(game.onTable.length).toBe(2)
        expect(getPlayer(game, playerOneID).cards.length).toBe(0)

        reshuffleUsedCards(game)

        expect(game.pack.length).toBe(1)
        expect(game.onTable.length).toBe(1)
        expect(getPlayer(game, playerOneID).cards.length).toBe(0)


    })



})