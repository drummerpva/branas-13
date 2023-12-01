export interface HttpServer {
  on(
    method: string,
    path: string,
    handler: (body?: any, params?: any, headers?: any) => Promise<any>,
  ): void
  listen(port: number): void
}
