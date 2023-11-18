import { RequestRide } from '../../src/application/usecase/RequestRide'
import { GetRide } from '../../src/application/usecase/GetRide'
import { AcceptRide } from '../../src/application/usecase/AcceptRide'
import { Signup } from '../../src/application/usecase/Signup'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'
import { AccountDAODatabase } from '../../src/infra/repository/AccountDAODatabase'
import { AccountDAO } from '../../src/application/repository/AccountDAO'
import { RideDAO } from '../../src/application/repository/RideDAO'
import { RideDAODatabase } from '../../src/infra/repository/RideDAODatabase'
import { StartRide } from '../../src/application/usecase/StartRide'
import { UpdatePositionV2 } from '../../src/application/usecase/UpdatePositionV2'
import { PositionRepository } from '../../src/application/repository/PositionRepository'
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepositoryDatabase'
import { FinishRide } from '../../src/application/usecase/FinishRide'

let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePositionV2
let finishRide: FinishRide
let signup: Signup
let mysqlAdapter: MysqlAdpter
let accountDAO: AccountDAO
let positionRepository: PositionRepository
let rideDAO: RideDAO
beforeAll(() => {
  mysqlAdapter = new MysqlAdpter()
  rideDAO = new RideDAODatabase(mysqlAdapter)
  accountDAO = new AccountDAODatabase(mysqlAdapter)
  positionRepository = new PositionRepositoryDatabase(mysqlAdapter)
  requestRide = new RequestRide(rideDAO, accountDAO)
  getRide = new GetRide(rideDAO, accountDAO)
  acceptRide = new AcceptRide(rideDAO, accountDAO)
  updatePosition = new UpdatePositionV2(rideDAO, positionRepository)
  startRide = new StartRide(rideDAO)
  finishRide = new FinishRide(rideDAO, positionRepository)
  signup = new Signup(accountDAO)
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
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  }
  await finishRide.execute(inputFinishRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('completed')
  expect(outputGetRide.distance).toBe(10)
  expect(outputGetRide.fare).toBe(21)
})