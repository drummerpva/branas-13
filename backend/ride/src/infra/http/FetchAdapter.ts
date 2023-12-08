import { HttpClient } from './HttpClient'
import fetch from 'node-fetch'
export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url)
    return response.json()
  }

  async post(url: string, data: any): Promise<any> {
    const reponse = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    return reponse.json()
  }
}
