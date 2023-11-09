import { HttpClient } from './HttpClient'

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    try {
      const response = await fetch(url)
      return response.json()
    } catch (error: any) {}
  }

  async post(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const output = await response.json()
    if (!response.ok) throw new Error(output.error)
    return output
  }
}
