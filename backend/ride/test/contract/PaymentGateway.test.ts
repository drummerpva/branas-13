import { PaymentGatewayHttp } from '../../src/infra/gateway/PaymentGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/AxiosAdapter'

test.skip('Deve processar um pagamento', async () => {
  const httpClient = new AxiosAdapter()
  const gateway = new PaymentGatewayHttp(httpClient)
  const input = {
    rideId: '12345678',
    fare: 10,
  }
  const output = await gateway.process(input)
  expect(output.status).toBe('approved')
})
