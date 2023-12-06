import { Connection } from '../../infra/databaase/Connection'
import { JSONPresenter } from '../../infra/presenter/JSONPresenter'
import { Presenter } from '../presenter/Presenter'

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
  constructor(
    readonly connection: Connection,
    readonly presenter: Presenter = new JSONPresenter(),
  ) {}

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
    const output = ridesData.map((rideData: any) => ({
      rideId: rideData.ride_id,
      passengerName: rideData.passenger_name,
      driverEmail: rideData.driver_email,
    }))
    return this.presenter.present(output)
  }
}
