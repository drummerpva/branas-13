import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupView from '../../src/view/SignupView'
// import { setTimeout as sleep } from 'node:timers/promises'
import { RideGateway } from '../../src/infra/gateway/RideGateway'
import { RideGatewayHttp } from '../../src/infra/gateway/RideGatewayHttp'
import { DependencyProvider } from '../../src/hooks/useDependency'
import { HttpClient } from '../../src/infra/http/HttpClient'
import { FetchAdapter } from '../../src/infra/http/FetchAdapter'
import { RequestRideView } from '../../src/view/RequestRideView'

let httpClient: HttpClient
let rideGateway: RideGateway
let createAccount: JSX.Element
let sut: JSX.Element
beforeAll(() => {
  httpClient = new FetchAdapter()
  rideGateway = new RideGatewayHttp(httpClient)
  createAccount = (
    <DependencyProvider dependency={{ rideGateway }}>
      <SignupView />
    </DependencyProvider>
  )
  sut = (
    <DependencyProvider dependency={{ rideGateway }}>
      <RequestRideView />
    </DependencyProvider>
  )
})

export const createUser = async () => {
  const { container } = render(createAccount)
  await userEvent.type(container.querySelector('.signup-name')!, 'John Doe')
  await userEvent.type(
    container.querySelector('.signup-email')!,
    `John.doe${Math.random()}@gmail.com`,
  )
  await userEvent.type(container.querySelector('.signup-cpf')!, '98765432100')
  await userEvent.click(container.querySelector('.signup-is-passenger')!)
  await userEvent.click(container.querySelector('.signup-submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('signup-account-id')
  })
  const accountId = element.textContent
  return accountId
}

test('Deve solicitar uma corrida', async () => {
  const accountId = await createUser()
  if (!accountId) throw new Error('accountId is undefined')
  const { container } = render(sut)
  await userEvent.type(
    container.querySelector('.request-account-id')!,
    accountId,
  )
  await userEvent.type(
    container.querySelector('.request-from-lat')!,
    '-27.584905257808835',
  )
  await userEvent.type(
    container.querySelector('.request-from-long')!,
    '-48.545022195325124',
  )
  await userEvent.type(
    container.querySelector('.request-to-lat')!,
    '-27.496887588317275',
  )
  await userEvent.type(
    container.querySelector('.request-to-long')!,
    '-48.522234807851476',
  )
  await userEvent.click(container.querySelector('.request-submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('request-ride-id')
  })
  expect(element).toBeInTheDocument()
  const rideId = element.textContent
  console.log({ rideId })
  expect(rideId).toHaveLength(36)
})
