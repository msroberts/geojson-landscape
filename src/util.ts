import * as L from 'leaflet'
import { IProperties } from './types'

export function getArea(layer: L.Path|L.Polyline|L.Circle): number {
  if (layer instanceof L.Polyline) {
    let latLngs = layer.getLatLngs()
    while (Array.isArray(latLngs[0])) {
      latLngs = latLngs[0]
    }
    return L.GeometryUtil.geodesicArea(latLngs as L.LatLng[])
  } else if (layer instanceof L.Circle) {
    return layer.getRadius() ** 2 * Math.PI
  }
  else return 0
}

export function getAreaString(layer: L.Path|L.Polyline|L.Circle, isMetric: boolean = false) {
  return L.GeometryUtil.readableArea(getArea(layer), isMetric)
}

export function getDiameterString(layer: L.Circle, isMetric: boolean = false) {
  return L.GeometryUtil.readableDistance(layer.getRadius(), isMetric)
}

export function getDefaultProperties(): IProperties {
  return {    
    name: '',
    description: '',
  }
}

export function createPopupElement(properties: IProperties) {
  let {
    name,
    description,
  } = properties
  const el = document.createElement('span')

  if (!name) {
    name = 'Set in Text Box'
  }
  const heading = document.createElement('strong')
  heading.textContent = name
  el.appendChild(heading)

  if (description) {
    el.appendChild(document.createElement('br'))

    const content = document.createElement('span')
    content.textContent = description
    el.appendChild(content)
  }

  return el
}
