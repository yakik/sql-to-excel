import { takiCardTypes, errors } from "../../constants"

export function selectCardValidation(game, playerID, card) {
    if (card.type === takiCardTypes.KING) {
        if (card.configuration === undefined) {
            return {playerID:playerID, error:errors.KING_MISSING_SELECTED_TYPE}
        }
        if (card.configuration.type !== takiCardTypes.PLUS_THREE &&
            card.configuration.type !== takiCardTypes.PLUS_THREE_BREAK &&
            card.configuration.color===undefined) {
            return {playerID:playerID, error:errors.KING_MISSING_COLOR_SELECTION}
        }
    }
    if (card.type === takiCardTypes.CHANGE_COLOR) {
        if (card.configuration === undefined || card.configuration.color===undefined) {
            return {playerID:playerID, error:errors.CHANGE_COLOR_MISSING_COLOR_SELECTION}
        }
    }
    return undefined 
}