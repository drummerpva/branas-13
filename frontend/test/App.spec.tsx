import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../src/App'

test('First', () => {
  const { getByText } = render(<App />)
  expect(getByText('Clean Dev')).toBeInTheDocument()
})
