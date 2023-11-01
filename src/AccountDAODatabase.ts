import mysql from 'mysql2/promise'
import { AccountDAO } from './AccountDAO'
export class AccountDAODatabase implements AccountDAO {
  async save(account: any) {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    await connection.query(
      'insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values (?,?,?,?,?,?,?,?,?,?)',
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
        account.date,
        false,
        account.verificationCode,
      ],
    )
    connection.destroy()
  }

  async getByEmail(email: string) {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    const [[accountData]] = (await connection.query(
      'select * from account where email = ?',
      [email],
    )) as any[]
    connection.destroy()
    return accountData
  }

  async getById(accountId: string) {
    const connection = await mysql.createConnection(
      'mysql://root:root@localhost:3306/branas13',
    )
    const [[accountData]] = (await connection.query(
      'select * from account where account_id = ?',
      [accountId],
    )) as any[]
    connection.destroy()
    return accountData
  }
}
