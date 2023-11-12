import { GeolocationGateway } from './GeolocatioGateway'

export class GeolocationGatewayBrowser implements GeolocationGateway {
  getGeolocation(): Promise<any> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) =>
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }),
      )
    })
  }
}
