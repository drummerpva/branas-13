import { RideDAO } from './RideDAO'
import { Ride } from './Ride'
import { Connection } from './Connection'
export class RideDAODatabase implements RideDAO {
  constructor(readonly connection: Connection) {}

  async save(ride: Ride) {
    await this.connection.query(
      'insert into ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values(?,?,?,?,?,?,?,?) ',
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
      ],
    )
  }

  async update(ride: Ride): Promise<void> {
    await this.connection.query(
      /* sql */
      `update ride set driver_id = ?, status = ? where ride_id = ?`,
      [ride.driverId, ride.getStatus(), ride.rideId],
    )
  }

  async getById(rideId: string): Promise<Ride> {
    const [rideData] = await this.connection.query(
      'SELECT * FROM ride WHERE ride_id = ?',
      [rideId],
    )
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      rideData.status,
      Number(rideData.from_lat),
      Number(rideData.from_long),
      Number(rideData.to_lat),
      Number(rideData.to_long),
      rideData.date,
    )
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
