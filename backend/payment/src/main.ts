import { ExpressAdapter } from './infra/http/ExpressAdapter'
import { Registry } from './infra/dependency-injection/Registry'
import { MainController } from './infra/controller/MainController'
import { ProcessPayment } from './application/usecase/ProcessPayment'

const httpServer = new ExpressAdapter()
const processPayment = new ProcessPayment()
Registry.getInstance().provide('httpServer', httpServer)
Registry.getInstance().provide('processPayment', processPayment)
const httpController = new MainController()
httpController.registerEndpoints()
httpServer.listen(3002)
