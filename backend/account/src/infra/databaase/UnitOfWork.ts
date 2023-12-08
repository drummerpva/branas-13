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
    const connection = await this.connection.getConnection()
    await connection.beginTransaction()
    try {
      for (const transaction of this.transactions) {
        await connection.query(transaction.statement, transaction.data)
      }
      await connection.commit()
    } catch (error) {
      await connection.rollback()
    } finally {
      connection.release()
    }
  }

  async close(): Promise<void> {
    this.connection.pool.end()
  }
}
