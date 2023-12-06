import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { MysqlAdpter } from './infra/databaase/MysqlAdapter'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { DatabaseRepositoryFactory } from './infra/databaase/factory/DatabaseRepositoryFactory'
import { Registry } from './infra/dependency-injection/Registry'
import { MainController } from './infra/controller/MainController'
import { VerifyToken } from './application/usecase/VerifyToken'

const connection = new MysqlAdpter()
const repositoryFactory = new DatabaseRepositoryFactory(connection)
const signup = new Signup(repositoryFactory)
const getAccount = new GetAccount(repositoryFactory)
const httpServer = new ExpressAdapter()
const verifyToken = new VerifyToken()
Registry.getInstance().provide('httpServer', httpServer)
Registry.getInstance().provide('signup', signup)
Registry.getInstance().provide('getAccount', getAccount)
Registry.getInstance().provide('verifyToken', verifyToken)
const httpController = new MainController()
// const httpController = new MainController(httpServer)
httpController.registerEndpoints()
httpServer.listen(3000)
