import { Signup } from './Signup'
import { GetAccount } from './GetAccount'
import { MysqlAdpter } from './MysqlAdapter'
import { AccountDAODatabase } from './AccountDAODatabase'
import { ExpressAdapter } from './ExpressAdapter'
import { MainController } from './MainController'

const connection = new MysqlAdpter()
const acountDAO = new AccountDAODatabase(connection)
const signup = new Signup(acountDAO)
const getAccount = new GetAccount(acountDAO)
const httpServer = new ExpressAdapter()
const httpController = new MainController(httpServer, signup, getAccount)
httpController.registerEndpoints()
httpServer.listen(3000)
