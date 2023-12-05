import { Connection } from '../../infra/databaase/Connection'
import { RepositoryFactory } from '../factory/RepositoryFactory'
import { AccountGateway } from '../gateway/AccountGateway'
import { RideRepository } from '../repository/RideRepository'

type Input = {
  rideId: string
  fare: number
}

export class UpdateRideProjection {
  private rideRepository: RideRepository
  constructor(
    repositoryFactory: RepositoryFactory,
    readonly accountGateway: AccountGateway,
    readonly connection: Connection,
  ) {
    this.rideRepository = repositoryFactory.createRideRepository()
  }

  async execute({ rideId }: Input) {
    console.log('updateRideProjection', rideId)
    const ride = await this.rideRepository.getById(rideId)
    const passenger = await this.accountGateway.getById(ride.passengerId)
    if (!ride || !passenger) throw new Error()
    const rideProjection = {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      fromLat: ride.from.getLat(),
      fromLong: ride.from.getLong(),
      toLat: ride.to.getLat(),
      toLong: ride.to.getLong(),
      date: ride.date,
      status: ride.getStatus(),
      distance: ride.getDistance(),
      fare: ride.getFare(),
      passenger: {
        name: passenger.name,
        email: passenger.email,
        cpf: passenger.cpf,
        carPlate: passenger.carPlate,
        isPassenger: passenger.isPassenger,
        isDriver: passenger.isDriver,
        accountId: passenger.accountId,
      },
    }
    // mongodb, redis, postgres, save rideProjection (CQRS)
    await this.connection.query(
      `INSERT INTO 
        ride_projection (ride_id, passenger_name, passenger_email, status) 
      VALUES(?,?,?,?) 
      ON DUPLICATE KEY UPDATE
        passenger_name = VALUES(passenger_name),
        passenger_email = VALUES(passenger_email),
        status = VALUES(status)
      `,
      [
        rideProjection.rideId,
        rideProjection.passenger.name,
        rideProjection.passenger.email,
        rideProjection.status,
      ],
    )
  }
}
