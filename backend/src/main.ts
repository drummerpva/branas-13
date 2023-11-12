import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { MysqlAdpter } from './infra/databaase/MysqlAdapter'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { MainController } from './infra/controller/MainController'
import { AccountDAODatabase } from './infra/repository/AccountDAODatabase'
import { RequestRide } from './application/usecase/RequestRide'
import { RideDAODatabase } from './infra/repository/RideDAODatabase'
import { GetRide } from './application/usecase/GetRide'

const connection = new MysqlAdpter()
const acountDAO = new AccountDAODatabase(connection)
const signup = new Signup(acountDAO)
const getAccount = new GetAccount(acountDAO)
const httpServer = new ExpressAdapter()
const rideDAO = new RideDAODatabase(connection)
const requestRide = new RequestRide(rideDAO, acountDAO)
const getRide = new GetRide(rideDAO, acountDAO)
const httpController = new MainController(
  httpServer,
  signup,
  getAccount,
  requestRide,
  getRide,
)
httpController.registerEndpoints()
httpServer.listen(3000)
