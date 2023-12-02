import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { Registry } from './infra/dependency-injection/Registry'
import { MainController } from './infra/controller/MainController'
import { ProcessPayment } from './application/usecase/ProcessPayment'
import { RabbitMQAdapter } from './infra/queue/RabbitMQAdapter'
import { QueueController } from './infra/controller/QueueController'

const httpServer = new ExpressAdapter()
const queue = new RabbitMQAdapter()
const processPayment = new ProcessPayment(queue)
Registry.getInstance().provide('queue', queue)
Registry.getInstance().provide('httpServer', httpServer)
Registry.getInstance().provide('processPayment', processPayment)
const queueController = new QueueController()
const httpController = new MainController()
queueController.registerConsumers()
httpController.registerEndpoints()
httpServer.listen(3002)
