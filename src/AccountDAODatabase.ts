import mysql from 'mysql2/promise'
import { AccountDAO } from './AccountDAO'
import { Account } from './Account'
export class AccountDAODatabase implements AccountDAO {
  async save(account: Account) {
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
    if (!accountData) return
    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
      accountData.date,
      accountData.verification_code,
    )
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
    if (!accountData) return
    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
      accountData.date,
      accountData.verification_code,
    )
  }
}
