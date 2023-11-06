import express, { Request, Response } from 'express'
import { HttpServer } from './HttpServer'

export class ExpressAdapter implements HttpServer {
  app: any
  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  on(method: string, path: string, callback: any): void {
    this.app[method](path, async (req: Request, res: Response) => {
      const output = await callback(req.params, req.body, req.headers)
      res.json(output)
    })
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log('Express server running...'))
  }
}
