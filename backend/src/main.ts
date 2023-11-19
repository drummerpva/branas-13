import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { MysqlAdpter } from './infra/databaase/MysqlAdapter'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { MainController } from './infra/controller/MainController'
import { RequestRide } from './application/usecase/RequestRide'
import { GetRide } from './application/usecase/GetRide'
import { RideRepositoryDatabase } from './infra/repository/RideRepositoryDatabase'
import { AccountRepositoryDatabase } from './infra/repository/AccountRepositoryDatabase'

const connection = new MysqlAdpter()
const acountDAO = new AccountRepositoryDatabase(connection)
const signup = new Signup(acountDAO)
const getAccount = new GetAccount(acountDAO)
const httpServer = new ExpressAdapter()
const rideRepository = new RideRepositoryDatabase(connection)
const requestRide = new RequestRide(rideRepository, acountDAO)
const getRide = new GetRide(rideRepository, acountDAO)
const httpController = new MainController(
  httpServer,
  signup,
  getAccount,
  requestRide,
  getRide,
)
httpController.registerEndpoints()
httpServer.listen(3000)
