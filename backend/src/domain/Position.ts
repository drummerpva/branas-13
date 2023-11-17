import { Coord } from './Coord'

export class Position {
  constructor(
    readonly positionId: string,
    coord: Coord,
    date: Date,
  ) {}
}
