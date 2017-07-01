import * as L from 'leaflet'

export function getArea(layer: L.Path|L.Polyline|L.Circle): number {
  if (layer instanceof L.Polyline) {
    let latLngs = layer.getLatLngs()
    if (Array.isArray(latLngs[0])) {
      latLngs = latLngs[0]
    }
    return L.GeometryUtil.geodesicArea(latLngs)
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
