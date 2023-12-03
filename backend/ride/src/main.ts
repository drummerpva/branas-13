import { MysqlAdpter } from './infra/databaase/MysqlAdapter'
import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { RequestRide } from './application/usecase/RequestRide'
import { GetRide } from './application/usecase/GetRide'
import { DatabaseRepositoryFactory } from './infra/databaase/factory/DatabaseRepositoryFactory'
import { Registry } from './infra/dependency-injection/Registry'
import { MainController } from './infra/controller/MainController'
import { AccountGatewayHttp } from './infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from './infra/http/AxiosAdapter'
import { RabbitMQAdapter } from './infra/queue/RabbitMQAdapter'
import { QueueController } from './infra/controller/QueueController'

const connection = new MysqlAdpter()
const repositoryFactory = new DatabaseRepositoryFactory(connection)
const httpServer = new ExpressAdapter()
const httpClient = new AxiosAdapter()
const accountGateway = new AccountGatewayHttp(httpClient)
const requestRide = new RequestRide(repositoryFactory, accountGateway)
const getRide = new GetRide(repositoryFactory, accountGateway)
const queue = new RabbitMQAdapter()
Registry.getInstance().provide('queue', queue)
Registry.getInstance().provide('httpServer', httpServer)
Registry.getInstance().provide('requestRide', requestRide)
Registry.getInstance().provide('getRide', getRide)
const httpController = new MainController()
const queueController = new QueueController()
queueController.registerConsumers()
httpController.registerEndpoints()
httpServer.listen(3001)
