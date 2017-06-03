import * as L from 'leaflet'

export function createMap(container: HTMLElement) {
  const map = L.map(container)

  return map
}
