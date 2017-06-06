import * as L from 'leaflet'

export class Editor {
  public map: L.Map
  baseLayers: { [key: string]: L.TileLayer }

  constructor(public container: HTMLElement, public accessToken: string, options: any = {}) {
    this.setTileLayers()

    if (!options.layers) {
      options.layers = [this.baseLayers[Object.keys(this.baseLayers)[0]]]
    }

    this.map = L.map(container, options)

    L.control.layers(this.baseLayers).addTo(this.map)
  }

  setTileLayers(): void {
    this.baseLayers = {
      'Streets': this.mapboxLayer('mapbox.streets'),
      'Satellite': this.mapboxLayer('mapbox.streets-satellite'),
      'Terrain': this.mapboxLayer('mapbox.outdoors'),
    }
  }

  mapboxLayer(id: string): L.TileLayer {
    return L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${this.accessToken}`, {
      attribution: `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
        <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
        Imagery © <a href="http://mapbox.com">Mapbox</a>`,
      id: id,
    })
  }
}
