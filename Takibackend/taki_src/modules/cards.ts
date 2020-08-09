


export function getCardsForPlayer(oldPack:Array<Card>) {
  let pack:Array<Card> = oldPack.slice()
  let cards:Array<Card> = []
  for (let u = 0; u < 10; u++)
    cards.push(pack.pop() as Card)
  return { cards: cards, pack: pack }
}




export function getShuffledPack(pack:Array<Card>){
  let newPack = [...pack]
  for (let f = 0; f < 300; f++) {
    let cardIndexA = Math.round(Math.random() * (newPack.length - 1))
    let cardIndexB = Math.round(Math.random() * (newPack.length - 1))
    let p = newPack[cardIndexA]
    newPack[cardIndexA] = newPack[cardIndexB]
    newPack[cardIndexB] = p
    f = f + 1
  }
  return newPack
}

