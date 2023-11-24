import { RequestRide } from '../../src/application/usecase/RequestRide'
import { GetRide } from '../../src/application/usecase/GetRide'
import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { Signup } from '../../src/application/usecase/Signup'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'
import { StartRide } from '../../src/application/usecase/StartRide'
import { UpdatePositionV2 } from '../../src/application/usecase/UpdatePositionV2'
import { PositionRepository } from '../../src/application/repository/PositionRepository'
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepositoryDatabase'
import { RideRepository } from '../../src/application/repository/RideRepository'
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepositoryDatabase'
import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory'
import { DatabaseRepositoryFactory } from '../../src/infra/databaase/factory/DatabaseRepositoryFactory'

let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePositionV2
let signup: Signup
let mysqlAdapter: MysqlAdpter
let positionRepository: PositionRepository
let rideRepository: RideRepository
let repositoryFactory: RepositoryFactory
beforeAll(() => {
  mysqlAdapter = new MysqlAdpter()
  rideRepository = new RideRepositoryDatabase(mysqlAdapter)
  positionRepository = new PositionRepositoryDatabase(mysqlAdapter)
  repositoryFactory = new DatabaseRepositoryFactory(mysqlAdapter)
  requestRide = new RequestRide(repositoryFactory)
  getRide = new GetRide(repositoryFactory)
  acceptRide = new AcceptRide(repositoryFactory)
  updatePosition = new UpdatePositionV2(rideRepository, positionRepository)
  startRide = new StartRide(rideRepository)
  signup = new Signup(repositoryFactory)
})
afterAll(async () => {
  await mysqlAdapter.close()
})
test('Deve solicitar, aceitar, iniciar e atualizar a posição de uma corrida', async () => {
  const inputSignupPassenger: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  }
  const outputSignupPassenger = await signup.execute(inputSignupPassenger)
  const inputRequestRide: any = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'ABC1234',
    isDriver: true,
  }
  const outputSignupDriver = await signup.execute(inputSignupDriver)
  const inputAcceptRide: any = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const inputStatRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStatRide)
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
  }
  await updatePosition.execute(inputUpdatePosition1)
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  await updatePosition.execute(inputUpdatePosition2)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('in_progress')
  // expect(outputGetRide.distance).toBe(10)
})
