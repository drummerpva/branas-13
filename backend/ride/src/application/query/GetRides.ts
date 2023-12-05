import { Connection } from '../../infra/databaase/Connection'

type Output = {
  rideId: string
  passengerName: string
  driverEmail: string
}[]
/* type Input = {
  pageSize?: number
  date: Date
} */
// Read Model
export class GetRides {
  constructor(readonly connection: Connection) {}

  async execute(): Promise<Output> {
    const ridesData = await this.connection.query(
      `
      SELECT r.*, p.name as passenger_name, p.email as passenger_email, d.name as driver_name, d.email as driver_email
      FROM ride r 
        INNER JOIN account p on r.passenger_id = p.account_id
        LEFT JOIN account d on r.driver_id = d.account_id
    `,
      [],
    )
    return ridesData.map((rideData: any) => ({
      rideId: rideData.ride_id,
      passengerName: rideData.passenger_name,
      driverEmail: rideData.driver_email,
    }))
  }
}
