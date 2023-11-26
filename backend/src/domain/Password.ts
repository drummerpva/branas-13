import { createHash, pbkdf2Sync, randomBytes } from 'node:crypto'

export interface Password {
  value: string
  salt: string
  algorithm: string
  validate(password: string): boolean
}

export class PlainTextPassword implements Password {
  algorithm: string

  constructor(
    readonly value: string,
    readonly salt: string = '',
  ) {
    this.algorithm = 'plain'
  }

  static create(password: string) {
    return new PlainTextPassword(password, '')
  }

  static restore(password: string, salt: string) {
    return new PlainTextPassword(password, salt)
  }

  validate(password: string): boolean {
    return this.value === password
  }
}

export class SHA1Password implements Password {
  algorithm: string

  constructor(
    readonly value: string,
    readonly salt: string = '',
  ) {
    this.algorithm = 'sha1'
  }

  static create(password: string) {
    const value = createHash('sha1').update(password).digest('hex')
    return new SHA1Password(value, '')
  }

  static restore(password: string, salt: string) {
    return new SHA1Password(password, salt)
  }

  validate(password: string): boolean {
    const value = createHash('sha1').update(password).digest('hex')
    return this.value === value
  }
}
export class Pbkdf2Password implements Password {
  algorithm: string

  constructor(
    readonly value: string,
    readonly salt: string = '',
  ) {
    this.algorithm = 'pbkdf2'
  }

  static create(password: string) {
    const salt = randomBytes(20).toString('hex')
    const value = pbkdf2Sync(password, salt, 100, 64, 'sha512').toString('hex')
    return new Pbkdf2Password(value, salt)
  }

  static restore(password: string, salt: string) {
    return new Pbkdf2Password(password, salt)
  }

  validate(password: string): boolean {
    const value = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString(
      'hex',
    )
    return this.value === value
  }
}

export class PasswordFactory {
  static create(algorithm: string) {
    if (algorithm === 'plain') return PlainTextPassword
    if (algorithm === 'sha1') return SHA1Password
    if (algorithm === 'pbkdf2') return Pbkdf2Password
    throw new Error()
  }
}
