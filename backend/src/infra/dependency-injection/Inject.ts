import { Registry } from './Registry'

export function inject(name: string) {
  return (target: any, pKey: string) => {
    target[pKey] = new Proxy(
      {},
      {
        get(target: any, propertyKey) {
          const dependency = Registry.getInstance().inject(name)
          return dependency[propertyKey]
        },
      },
    )
  }
}

/* const InjectableProperties = new Map<object, Map<string, string>>()

export function inject(name: string) {
  return function (target: any, propertyKey: string) {
    let properties = InjectableProperties.get(target)
    if (!properties) {
      properties = new Map<string, string>()
      InjectableProperties.set(target, properties)
    }
    properties.set(propertyKey, name)
  }
}

export function injectDependencies(instance: any) {
  const properties = InjectableProperties.get(Object.getPrototypeOf(instance))
  if (properties) {
    properties.forEach((name, propertyKey) => {
      instance[propertyKey] = Registry.getInstance().inject(name)
    })
  }
}
 */
