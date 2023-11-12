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
import { GetRideView } from '../../src/view/GetRideVIew'
import { GeolocationGateway } from '../../src/infra/gateway/GeolocatioGateway'

let httpClient: HttpClient
let rideGateway: RideGateway
let geoLocationGateway: GeolocationGateway
let createAccount: JSX.Element
let sut: JSX.Element
beforeAll(() => {
  httpClient = new FetchAdapter()
  rideGateway = new RideGatewayHttp(httpClient)
  geoLocationGateway = {
    getGeolocation: async () => ({
      lat: -27.584905257808835,
      long: -48.545022195325124,
    }),
  }
  createAccount = (
    <DependencyProvider dependency={{ rideGateway }}>
      <SignupView />
    </DependencyProvider>
  )
  sut = (
    <DependencyProvider dependency={{ rideGateway, geoLocationGateway }}>
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
  const passengerId = await createUser()
  if (!passengerId) throw new Error('accountId is undefined')
  const { container } = render(sut)
  await userEvent.type(
    container.querySelector('.request-account-id')!,
    passengerId,
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
  expect(rideId).toHaveLength(36)
  const { container: containerGetRide } = render(
    <DependencyProvider dependency={{ rideGateway }}>
      <GetRideView />
    </DependencyProvider>,
  )
  await userEvent.type(
    containerGetRide.querySelector('.get-ride-ride-id')!,
    rideId!,
  )
  await userEvent.click(containerGetRide.querySelector('.get-ride-submit')!)
  const passengerIdElement = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('get-ride-passenger-id')
  })
  expect(passengerIdElement).toBeInTheDocument()
  expect(passengerIdElement?.textContent).toBe(passengerId)
  expect(containerGetRide.querySelector('.get-ride-status')?.textContent).toBe(
    'requested',
  )
  expect(
    containerGetRide.querySelector('.get-ride-passenger-name')?.textContent,
  ).toBe('John Doe')
  expect(
    containerGetRide.querySelector('.get-ride-passenger-email')?.textContent
      ?.length,
  ).toBeGreaterThan(4)
  expect(
    containerGetRide.querySelector('.get-ride-passenger-cpf')?.textContent,
  ).toBe('98765432100')
})
