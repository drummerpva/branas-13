import mysql, { Pool } from 'mysql2/promise'
import { Connection } from './Connection'

export class UnitOfWork implements Connection {
  connection: Pool
  transactions: { statement: string; data: any }[]
  constructor() {
    this.connection = mysql.createPool(
      'mysql://root:root@localhost:3306/branas13',
    )
    this.transactions = []
  }

  async query(
    statement: string,
    data: any[],
    transactional = false,
  ): Promise<any> {
    if (transactional) {
      this.transactions.push({ statement, data })
      return
    }
    const [rows] = await this.connection?.query(statement, data)
    return rows
  }

  async execute(): Promise<void> {
    await this.connection.beginTransaction()
    try {
      for (const transaction of this.transactions) {
        this.connection.query(transaction.statement, transaction.data)
      }
      await this.connection.commit()
    } catch (error) {
      await this.connection.rollback()
    }
  }

  async close(): Promise<void> {
    this.connection.pool.end()
  }
}
