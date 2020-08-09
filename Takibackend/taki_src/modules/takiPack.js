import { takiCardTypes, takiColors } from '../constants';
import { getShuffledPack } from './cards';
import { resetCard, assignCardsForPlayers } from './taki/taki';


export function reshuffleUsedCards(game) {
    let cardsOnTable = game.onTable.length - 1;
    for (let i = 0; i < cardsOnTable; i++)
        game.pack.push(resetCard(game.onTable.shift()));
    if (game.pack.length > 1) {
        for (let f = 0; f < 300; f++) {
            let cardIndexA = Math.round(Math.random() * (game.pack.length - 1));
            let cardIndexB = Math.round(Math.random() * (game.pack.length - 1));
            let p = game.pack[cardIndexA];
            game.pack[cardIndexA] = game.pack[cardIndexB];
            game.pack[cardIndexB] = p;
            f = f + 1;
        }
    }
}
export function setOnTable(game, card) {
    game.onTable = [];
    game.onTable.push(card);
}
export function setGamePack(game, pack) {
    game.pack = pack;
}
export function reshuffle(game) {
    game.onTable = [];
    setGamePack(game, getShuffledPack(getTakiPack()));
    assignCardsForPlayers(game);
    setOnTable(game, pullCardFromPack(game, { type: takiCardTypes.NUMBER }));
}
export function pullCardFromPack(game, criterion) {
    if (criterion === undefined)
        return game.pack.pop();
    else {
        let cardIndex;
        if (criterion.type === takiCardTypes.NUMBER) {
            if (criterion.color === undefined && criterion.number === undefined)
                cardIndex = game.pack.findIndex((card) => (card.type === takiCardTypes.NUMBER));
            else
                cardIndex = game.pack.findIndex((card) => (card.type === criterion.type && card.color === criterion.color && card.number === criterion.number));
        }
        else {
            if (criterion.color !== undefined)
                cardIndex = game.pack.findIndex((card) => (card.color === criterion.color && card.type === criterion.type));
            else
                cardIndex = game.pack.findIndex((card) => (card.type === criterion.type));
        }
        let card = game.pack.splice(cardIndex, 1)[0];
        return card;
    }
}

let cardID=0

export function getTakiCard(type,options) {
    let card = { ID: cardID++, type: type }
    if (options.color !== undefined)
        card = { ...card, color: options.color }
    if (options.number !== undefined)
        card = { ...card, number: options.number }
        return card
}

export function getTakiPack() {
    let pack = [];
    let colorCounter = 0;
    let colors = [takiColors.GREEN, takiColors.YELLOW, takiColors.BLUE, takiColors.RED];
    colors.map(color => {
        colorCounter++;
        for (let j = 0; j < 2; j++) {
            for (let i = 1; i < 10; i++) {
                if (i !== 2)
                    pack.push(getTakiCard(takiCardTypes.NUMBER,{number:i,color:color} ));
                else
                    pack.push(getTakiCard(takiCardTypes.PLUS_TWO,{color:color}));
            }
            pack.push(getTakiCard(takiCardTypes.STOP,{color:color}));
            pack.push(getTakiCard(takiCardTypes.CHANGE_DIRECTION,{color:color}));
            pack.push(getTakiCard(takiCardTypes.PLUS,{color:color}));
            pack.push(getTakiCard(takiCardTypes.TAKI,{color:color}));
        }
    });
    for (let i = 0; i < 6; i++)
        pack.push(getTakiCard(takiCardTypes.CHANGE_COLOR,{color: takiColors.NOT_APPLICABLE} ));
    pack.push(getTakiCard(takiCardTypes.KING,{color: takiColors.NOT_APPLICABLE} ));
    pack.push(getTakiCard(takiCardTypes.KING,{color: takiColors.NOT_APPLICABLE} ));
    for (let i = 0; i < 2; i++)
        pack.push(getTakiCard(takiCardTypes.PLUS_THREE_BREAK,{color: takiColors.NOT_APPLICABLE} ));
    for (let i = 0; i < 2; i++)
        pack.push(getTakiCard(takiCardTypes.PLUS_THREE,{color: takiColors.NOT_APPLICABLE} ));
    return pack;
}

