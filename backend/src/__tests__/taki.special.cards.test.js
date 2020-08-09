import {
    selectCard, takeCard, getPlayer, addNewPlayer as addNewTakiPlayer,
    getNewGame as getNewTakiGame, removePlayer as removeTakiPlayer, selectCard as selectCardTaki
} from '../modules/taki/taki'
import { getTakiPack, pullCardFromPack, setGamePack } from "../modules/taki/takiPack"
import { instructionTypes, takiCardTypes, takiColors, errors } from '../constants'



describe("Special cards", () => {


    test("change color", () => {
        let game = getNewTakiGame()
        let gameJustForPack = getNewTakiGame()
        setGamePack(gameJustForPack, getTakiPack())

        game.pack.push(pullCardFromPack(gameJustForPack, { type: takiCardTypes.CHANGE_COLOR }))

        let playerOneID = addNewTakiPlayer(game, "player one")

        takeCard(game, playerOneID)

        selectCard(game, { playerID: playerOneID, selectedCard: getPlayer(game, playerOneID).cards[0] })

        expect(getPlayer(game, playerOneID).cards.length).toBe(1) //card not taken
        expect(getPlayer(game, playerOneID).error.playerID).toBe(playerOneID)
        expect(getPlayer(game, playerOneID).error.error).toBe(errors.CHANGE_COLOR_MISSING_COLOR_SELECTION)

        selectCard(game, {
            playerID: playerOneID,
            selectedCard: {
                ...getPlayer(game, playerOneID).cards[0],
                configuration: { color: takiColors.BLUE }
            }
        })

        expect(getPlayer(game, playerOneID).cards.length).toBe(0) //card taken
        expect(getPlayer(game, playerOneID).error).toBe(undefined)
    })
    
    test("king", () => {
        let game = getNewTakiGame()
        let gameJustForPack = getNewTakiGame()
        setGamePack(gameJustForPack, getTakiPack())

        game.pack.push(pullCardFromPack(gameJustForPack, { type: takiCardTypes.KING }))

        let playerOneID = addNewTakiPlayer(game, "player one")

        takeCard(game, playerOneID)

        selectCard(game, { playerID: playerOneID, selectedCard: getPlayer(game, playerOneID).cards[0] })

        expect(getPlayer(game, playerOneID).cards.length).toBe(1) //card not taken
        expect(getPlayer(game, playerOneID).error.playerID).toBe(playerOneID)
        expect(getPlayer(game, playerOneID).error.error).toBe(errors.KING_MISSING_SELECTED_TYPE)
  

        selectCard(game, { playerID: playerOneID,
            selectedCard: {
                ...getPlayer(game, playerOneID).cards[0],
                configuration: { type: takiCardTypes.CHANGE_COLOR}
            }})

        expect(getPlayer(game, playerOneID).cards.length).toBe(1) //card not taken
        expect(getPlayer(game, playerOneID).error.playerID).toBe(playerOneID)
        expect(getPlayer(game, playerOneID).error.error).toBe(errors.KING_MISSING_COLOR_SELECTION)
 

        selectCard(game, { playerID: playerOneID,
            selectedCard: {
                ...getPlayer(game, playerOneID).cards[0],
                configuration: { type: takiCardTypes.CHANGE_COLOR, color: takiColors.BLUE}
            }})

        expect(getPlayer(game, playerOneID).cards.length).toBe(0) //card taken
        expect(getPlayer(game, playerOneID).error).toBe(undefined)
    })


})