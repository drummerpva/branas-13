import { randomUUID } from 'node:crypto'
import { Coord } from './Coord'
import { Status, StatusFactory } from './Status'
import { Position } from './Position'
import { DistanceCalculator } from './DistanceCalculator'

export class Ride {
  driverId?: string
  status: Status
  positions: Position[]
  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    status: string,
    readonly from: Coord,
    readonly to: Coord,
    readonly date: Date,
    private distance: number,
  ) {
    this.status = StatusFactory.create(this, status)
    this.positions = []
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = randomUUID()
    const status = 'requested'
    const date = new Date()
    return new Ride(
      rideId,
      passengerId,
      status,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
      date,
      0,
    )
  }

  static restore(
    rideId: string,
    passengerId: string,
    driverId: string,
    status: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    date: Date,
    distance: number,
  ) {
    const ride = new Ride(
      rideId,
      passengerId,
      status,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
      date,
      distance,
    )
    ride.driverId = driverId
    return ride
  }

  accept(driverId: string) {
    this.driverId = driverId
    this.status.accept()
  }

  start() {
    this.status.start()
  }

  updatePosition(lat: number, long: number) {
    this.distance = 0
    this.positions.push(Position.create(lat, long))
    for (const [index, position] of this.positions.entries()) {
      const nextPosition = this.positions[index + 1]
      if (!nextPosition) break
      this.distance += DistanceCalculator.calculate(
        position.coord,
        nextPosition.coord,
      )
    }
  }

  getDistance() {
    return this.distance
  }

  finish() {
    this.status.finish()
  }

  getStatus() {
    return this.status.value
  }
}
