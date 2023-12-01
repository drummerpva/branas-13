import { MysqlAdpter } from './infra/databaase/MysqlAdapter'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { RequestRide } from './application/usecase/RequestRide'
import { GetRide } from './application/usecase/GetRide'
import { DatabaseRepositoryFactory } from './infra/databaase/factory/DatabaseRepositoryFactory'
import { Registry } from './infra/dependency-injection/Registry'
import { MainController } from './infra/controller/MainController'

const connection = new MysqlAdpter()
const repositoryFactory = new DatabaseRepositoryFactory(connection)
const httpServer = new ExpressAdapter()
const requestRide = new RequestRide(repositoryFactory)
const getRide = new GetRide(repositoryFactory)
Registry.getInstance().provide('httpServer', httpServer)
Registry.getInstance().provide('requestRide', requestRide)
Registry.getInstance().provide('getRide', getRide)
const httpController = new MainController()
// const httpController = new MainController(httpServer)
httpController.registerEndpoints()
httpServer.listen(3001)
