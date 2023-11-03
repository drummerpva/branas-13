import mysql from 'mysql2/promise'
import { RideDAO } from './RideDAO'
import { Ride } from './Ride'
export class RideDAODatabase implements RideDAO {
  async save(ride: Ride) {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    await connection.query(
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
    connection.destroy()
  }

  async update(ride: Ride): Promise<void> {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    await connection.query(
      /* sql */
      `update ride set driver_id = ?, status = ? where ride_id = ?`,
      [ride.driverId, ride.getStatus(), ride.rideId],
    )
    connection.destroy()
  }

  async getById(rideId: string): Promise<Ride> {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    const [[rideData]] = (await connection.query(
      'SELECT * FROM ride WHERE ride_id = ?',
      [rideId],
    )) as any
    connection.destroy()
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
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    const [rides] = (await connection.query(
      /* sql */ `SELECT * FROM ride WHERE passenger_id = ? AND status IN("requested", "accepted", "in_progress")`,
      [passengerId],
    )) as any
    connection.destroy()
    return rides
  }

  async getActiveRideByDriverId(driverId: string): Promise<any> {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    const [rides] = (await connection.query(
      /* sql */ `SELECT * FROM ride WHERE driver_id = ? AND status IN("accepted", "in_progress")`,
      [driverId],
    )) as any
    connection.destroy()
    return rides
  }
}
