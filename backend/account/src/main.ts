import { Signup } from './application/usecase/Signup'
import { GetAccount } from './application/usecase/GetAccount'
import { MysqlAdpter } from './infra/databaase/MysqlAdapter'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { DatabaseRepositoryFactory } from './infra/databaase/factory/DatabaseRepositoryFactory'
import { Registry } from './infra/dependency-injection/Registry'
import { MainController } from './infra/controller/MainController'

const connection = new MysqlAdpter()
const repositoryFactory = new DatabaseRepositoryFactory(connection)
const signup = new Signup(repositoryFactory)
const getAccount = new GetAccount(repositoryFactory)
const httpServer = new ExpressAdapter()
Registry.getInstance().provide('httpServer', httpServer)
Registry.getInstance().provide('signup', signup)
Registry.getInstance().provide('getAccount', getAccount)
const httpController = new MainController()
// const httpController = new MainController(httpServer)
httpController.registerEndpoints()
httpServer.listen(3000)
