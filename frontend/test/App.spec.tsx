import { test, expect } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import App from '../src/App'
import { setTimeout as sleep } from 'node:timers/promises'

test('Deve criar um passageiro', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
  fireEvent.change(container.querySelector('.signup-name')!, {
    target: { value: 'John Doe' },
  })
  fireEvent.change(container.querySelector('.signup-email')!, {
    target: { value: `John.doe${Math.random()}@gmail.com` },
  })
  fireEvent.change(container.querySelector('.signup-cpf')!, {
    target: { value: '98765432100' },
  })
  fireEvent.click(container.querySelector('.signup-is-passenger')!)
  fireEvent.click(container.querySelector('.signup-submit')!)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('signup-account-id')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent).toHaveLength(36)
})
test.only('Não deve criar um passageiro se o CPF estiver inválido', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.signup-title')?.textContent).toBe('Signup')
  fireEvent.change(container.querySelector('.signup-name')!, {
    target: { value: 'John Doe' },
  })
  fireEvent.change(container.querySelector('.signup-email')!, {
    target: { value: `John.doe${Math.random()}@gmail.com` },
  })
  fireEvent.change(container.querySelector('.signup-cpf')!, {
    target: { value: '98765432101' },
  })
  fireEvent.click(container.querySelector('.signup-is-passenger')!)
  fireEvent.click(container.querySelector('.signup-submit')!)
  await sleep(500)
  const element = await screen.findByText((_content, element) => {
    if (!element) return false
    return element.classList.contains('signup-error')
  })
  expect(element).toBeInTheDocument()
  expect(element.textContent).toBe('Invalid cpf')
})
