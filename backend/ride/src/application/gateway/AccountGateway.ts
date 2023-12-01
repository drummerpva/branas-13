export interface AccountGateway {
  getById(id: string): Promise<any>
  signup(input: any): Promise<any>
}
