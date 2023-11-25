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
