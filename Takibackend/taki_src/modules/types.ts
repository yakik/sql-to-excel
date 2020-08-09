interface Card {
  type: string
  color?: string
  number?: number
  configuration?: {
    type?: string
    color?: string
  }
}

interface TakiTurn {

}

interface TakiPlayer {

}

interface SpecificGame {

}

interface TakeSixGame extends SpecificGame {
  state:string

}

interface TakiGame extends SpecificGame {
  players: Array<TakiPlayer>
  lastPlayerID: number
  pack?: Array<Card>
  onTable?: Array<Card>
  turn: TakiTurn

}

interface Game {
  ID: string
  game?: TakiGame | TakeSixGame
  type: string

}
