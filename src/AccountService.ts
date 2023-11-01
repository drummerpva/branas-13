import crypto from 'crypto'
import mysql from 'mysql2/promise'
import { CpfValidator } from './CpfValidator'

export class AccountService {
  cpfValidator: CpfValidator

  constructor() {
    this.cpfValidator = new CpfValidator()
  }

  async sendEmail(email: string, subject: string, message: string) {
    console.log(email, subject, message)
  }

  async signup(input: any) {
    // const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    try {
      const accountId = crypto.randomUUID()
      const verificationCode = crypto.randomUUID()
      const date = new Date()
      const [existingData] = (await connection.query(
        'select * from account where email = ?',
        [input.email],
      )) as any[]
      const existingAccount = existingData[0]
      if (existingAccount) throw new Error('Account already exists')
      if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/))
        throw new Error('Invalid name')
      if (!input.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email')
      if (!this.cpfValidator.validate(input.cpf)) throw new Error('Invalid cpf')
      if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/))
        throw new Error('Invalid plate')
      await connection.query(
        'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values (?,?,?,?,?,?,?,?,?,?)',
        [
          accountId,
          input.name,
          input.email,
          input.cpf,
          input.carPlate,
          !!input.isPassenger,
          !!input.isDriver,
          date,
          false,
          verificationCode,
        ],
      )
      await this.sendEmail(
        input.email,
        'Verification',
        `Please verify your code at first login ${verificationCode}`,
      )
      return {
        accountId,
      }
    } finally {
      connection.destroy()
    }
  }

  async getAccount(accountId: string) {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    const [[account]] = (await connection.query(
      'select * from account where account_id = ?',
      [accountId],
    )) as any
    connection.destroy()
    return account
  }
}
