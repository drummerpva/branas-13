type Coordinate = {
  lat: number
  long: number
}
export class RequestRide {
  constructor(
    readonly passengerId: string,
    readonly from: Coordinate,
    readonly to: Coordinate,
  ) {}
}
