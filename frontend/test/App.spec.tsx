import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { setTimeout as sleep } from 'node:timers/promises'
import { RideGateway } from '../src/infra/gateway/RideGateway'
import { RideGatewayHttp } from '../src/infra/gateway/RideGatewayHttp'
import { DependencyProvider } from '../src/hooks/useDependency'
import { HttpClient } from '../src/infra/http/HttpClient'
import { AxiosAdapter } from '../src/infra/http/AxiosAdapter'
import { FetchAdapter } from '../src/infra/http/FetchAdapter'

let httpClient: HttpClient
let rideGateway: RideGateway
let sut: JSX.Element
beforeAll(() => {
  // httpClient = new AxiosAdapter()
  httpClient = new FetchAdapter()
  rideGateway = new RideGatewayHttp(httpClient)
  sut = (
    <DependencyProvider dependency={{ rideGateway }}>
      <App />
    </DependencyProvider>
  )
})

test('Deve criar um passageiro', async () => {
  const { container } = render(sut)
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
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
  expect(element).toBeInTheDocument()
  expect(element.textContent).toHaveLength(36)
})
test('Não deve criar um passageiro se o CPF estiver inválido', async () => {
  const { container } = render(sut)
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
  await userEvent.type(container.querySelector('.signup-name')!, 'John Doe')
  await userEvent.type(
    container.querySelector('.signup-email')!,
    `John.doe${Math.random()}@gmail.com`,
  )
  await userEvent.type(container.querySelector('.signup-cpf')!, '98765432101')
  await userEvent.click(container.querySelector('.signup-is-passenger')!)
  await userEvent.click(container.querySelector('.signup-submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('signup-error')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent).toBe('Invalid cpf')
})
test('Não deve criar um passageiro se o nome estiver inválido', async () => {
  const { container } = render(sut)
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
  await userEvent.type(container.querySelector('.signup-name')!, 'John')
  await userEvent.type(
    container.querySelector('.signup-email')!,
    `John.doe${Math.random()}@gmail.com`,
  )
  await userEvent.type(container.querySelector('.signup-cpf')!, '98765432100')
  await userEvent.click(container.querySelector('.signup-is-passenger')!)
  await userEvent.click(container.querySelector('.signup-submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('signup-error')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent).toBe('Invalid name')
})
test('Não deve criar um passageiro se o email estiver inválido', async () => {
  const { container } = render(sut)
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
  await userEvent.type(container.querySelector('.signup-name')!, 'John Doe')
  await userEvent.type(container.querySelector('.signup-email')!, `John.doe`)
  await userEvent.type(container.querySelector('.signup-cpf')!, '98765432100')
  await userEvent.click(container.querySelector('.signup-is-passenger')!)
  await userEvent.click(container.querySelector('.signup-submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('signup-error')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent).toBe('Invalid email')
})
test('Não deve criar um passageiro se o email estiver duplicado', async () => {
  const { container } = render(sut)
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
  await act(async () => {
    await userEvent.type(container.querySelector('.signup-name')!, 'John Doe')
    await userEvent.type(
      container.querySelector('.signup-email')!,
      `John.doe${Math.random()}@gmail.com`,
    )
    await userEvent.type(container.querySelector('.signup-cpf')!, '98765432100')
    await userEvent.click(container.querySelector('.signup-is-passenger')!)
    await userEvent.click(container.querySelector('.signup-submit')!)
    await sleep(50)
    await userEvent.click(container.querySelector('.signup-submit')!)
  })
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('signup-error')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent).toBe('Account already exists')
})
test('Deve criar um passageiro usando fake', async () => {
  const rideGatewayFake: RideGateway = {
    signup: async () => ({ accountId: '954cfde4-94dc-4955-8f71-9441eda4f24f' }),
  }
  const { container } = render(
    <DependencyProvider dependency={{ rideGateway: rideGatewayFake }}>
      <App />
    </DependencyProvider>,
  )
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
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
  expect(element).toBeInTheDocument()
  expect(element.textContent).toHaveLength(36)
})
test('Não deve criar um passageiro com nome inválido usando fake', async () => {
  const rideGatewayFake: RideGateway = {
    signup: async () => {
      throw new Error('Invalid name')
    },
  }
  const { container } = render(
    <DependencyProvider dependency={{ rideGateway: rideGatewayFake }}>
      <App />
    </DependencyProvider>,
  )
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
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
    return element.classList.contains('signup-error')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent).toBe('Invalid name')
})
