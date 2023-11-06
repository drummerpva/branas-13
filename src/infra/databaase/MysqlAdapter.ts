import mysql, { Pool } from 'mysql2/promise'
import { Connection } from './Connection'

export class MysqlAdpter implements Connection {
  connection: Pool
  constructor() {
    this.connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas13',
    )
  }

  async query(statement: string, data: any[]): Promise<any> {
    const [rows] = await this.connection?.query(statement, data)
    return rows
  }

  async close(): Promise<void> {
    this.connection.pool.end()
  }
}
