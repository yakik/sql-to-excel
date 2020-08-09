import { getNextPlayerID } from "../modules/taki/takiTurns"
import { turnDirections, takiCardTypes } from '../constants'



describe("taki Next Turn", () => {


    test("next turn", () => {
        let players = []
        players.push({ID:2})
        players.push({ID:7})
        players.push({ID:4})

       
        expect(getNextPlayerID(2,players,turnDirections.LEFT_TO_RIGHT)).toBe(7)
        expect(getNextPlayerID(2,players,turnDirections.RIGHT_TO_LEFT)).toBe(4)
        expect(getNextPlayerID(4,players,turnDirections.LEFT_TO_RIGHT)).toBe(2)
        expect(getNextPlayerID(4,players,turnDirections.RIGHT_TO_LEFT)).toBe(7)
        expect(getNextPlayerID(7,players,turnDirections.LEFT_TO_RIGHT)).toBe(4)
        expect(getNextPlayerID(7,players,turnDirections.RIGHT_TO_LEFT)).toBe(2)
    })

    test("next turn STOP", () => {
        let players = []
        players.push({ID:2})
        players.push({ID:7})
        players.push({ID:4})

       
        expect(getNextPlayerID(2,players,turnDirections.LEFT_TO_RIGHT, takiCardTypes.STOP)).toBe(4)
        expect(getNextPlayerID(2,players,turnDirections.RIGHT_TO_LEFT, takiCardTypes.STOP)).toBe(7)
        expect(getNextPlayerID(4,players,turnDirections.LEFT_TO_RIGHT, takiCardTypes.STOP)).toBe(7)
        expect(getNextPlayerID(4,players,turnDirections.RIGHT_TO_LEFT, takiCardTypes.STOP)).toBe(2)
        expect(getNextPlayerID(7,players,turnDirections.LEFT_TO_RIGHT, takiCardTypes.STOP)).toBe(2)
        expect(getNextPlayerID(7,players,turnDirections.RIGHT_TO_LEFT, takiCardTypes.STOP)).toBe(4)
    })


})