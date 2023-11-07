import express, { Request, Response } from 'express'
import cors from 'cors'
import { HttpServer } from './HttpServer'

export class ExpressAdapter implements HttpServer {
  app: any
  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.app.use(cors())
  }

  on(method: string, path: string, callback: any): void {
    this.app[method](path, async (req: Request, res: Response) => {
      try {
        const output = await callback(req.params, req.body, req.headers)
        res.json(output)
      } catch (error: any) {
        res.status(422).json({ error: error.message })
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log('Express server running...'))
  }
}
