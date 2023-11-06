import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { MysqlAdpter } from './infra/databaase/MysqlAdapter'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { MainController } from './infra/controller/MainController'
import { AccountDAODatabase } from './infra/repository/AccountDAODatabase'

const connection = new MysqlAdpter()
const acountDAO = new AccountDAODatabase(connection)
const signup = new Signup(acountDAO)
const getAccount = new GetAccount(acountDAO)
const httpServer = new ExpressAdapter()
const httpController = new MainController(httpServer, signup, getAccount)
httpController.registerEndpoints()
httpServer.listen(3000)
