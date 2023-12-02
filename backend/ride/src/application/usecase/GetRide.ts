import { RepositoryFactory } from '../factory/RepositoryFactory'
import { AccountGateway } from '../gateway/AccountGateway'
import { RideRepository } from '../repository/RideRepository'

type Output = {
  rideId: string
  passengerId: string
  driverId?: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  date: Date
  status: string
  distance: number
  fare: number
  passenger: {
    accountId: string
    name: string
    email: string
    cpf: string
    carPlate: string
    isPassenger: boolean
    isDriver: boolean
  }
}
export class GetRide {
  private rideRepository: RideRepository
  constructor(
    repositoryFactory: RepositoryFactory,
    readonly accountGateway: AccountGateway,
  ) {
    this.rideRepository = repositoryFactory.createRideRepository()
  }

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId)
    const passenger = await this.accountGateway.getById(ride.passengerId)
    if (!ride || !passenger) throw new Error()
    return {
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
  }
}
