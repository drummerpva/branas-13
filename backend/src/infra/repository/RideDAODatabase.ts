import { RideDAO } from '../../application/repository/RideDAO'
import { Coord } from '../../domain/Coord'
import { Position } from '../../domain/Position'
import { Ride } from '../../domain/Ride'
import { Connection } from '../databaase/Connection'
export class RideDAODatabase implements RideDAO {
  constructor(readonly connection: Connection) {}

  async save(ride: Ride) {
    await this.connection.query(
      `insert into ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values(?,?,?,?,?,?,?,?)`,
      [
        ride.rideId,
        ride.passengerId,
        ride.from.getLat(),
        ride.from.getLong(),
        ride.to.getLat(),
        ride.to.getLong(),
        ride.getStatus(),
        ride.date,
      ],
    )
  }

  async update(ride: Ride): Promise<void> {
    await this.connection.query(
      /* sql */
      `update ride set driver_id = ?, status = ?, distance = ? where ride_id = ?`,
      [ride.driverId, ride.getStatus(), ride.getDistance(), ride.rideId],
    )
    for (const position of ride.positions) {
      await this.connection.query(
        /* sql */
        `INSERT IGNORE INTO \`position\` (position_id, ride_id, lat, lng, date) VALUES(?,?,?,?,?)`,
        [
          position.positionId,
          ride.rideId,
          position.coord.getLat(),
          position.coord.getLong(),
          position.date,
        ],
      )
    }
  }

  async getById(rideId: string): Promise<Ride> {
    const [rideData] = await this.connection.query(
      `SELECT * FROM ride WHERE ride_id = ?`,
      [rideId],
    )
    const ride = Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      rideData.status,
      Number(rideData.from_lat),
      Number(rideData.from_long),
      Number(rideData.to_lat),
      Number(rideData.to_long),
      rideData.date,
      Number(rideData.distance),
    )
    const positionsData = await this.connection.query(
      `SELECT * FROM position WHERE ride_id = ?`,
      [rideId],
    )
    for (const positionData of positionsData) {
      ride.positions.push(
        new Position(
          positionData.position_id,
          new Coord(Number(positionData.lat), Number(positionData.lng)),
          positionData.date,
        ),
      )
    }

    return ride
  }

  async getActiveRideByPassengerId(passengerId: string): Promise<any> {
    const rides = await this.connection.query(
      /* sql */ `SELECT * FROM ride WHERE passenger_id = ? AND status IN("requested", "accepted", "in_progress")`,
      [passengerId],
    )
    return rides
  }

  async getActiveRideByDriverId(driverId: string): Promise<any> {
    const rides = await this.connection.query(
      /* sql */ `SELECT * FROM ride WHERE driver_id = ? AND status IN("accepted", "in_progress")`,
      [driverId],
    )
    return rides
  }
}
