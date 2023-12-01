import { sign } from 'jsonwebtoken'
import { Account } from './Account'

export class TokenGenerator {
  static generate(account: Account, date: Date) {
    const token = sign(
      { cpf: account.cpf.getValue(), iat: date.getTime(), expiresIn: 1e8 },
      'secret',
    )
    return token
  }
}
