type Outuput = {
  status: string
}
export class ProcessPayment {
  async execute(input: any): Promise<Outuput> {
    console.log(input)
    return { status: 'approved' }
  }
}
