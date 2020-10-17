import * as L from 'leaflet'

export class Editor {
  public map: L.Map
  baseLayers: { [key: string]: L.TileLayer }
  drawnItems: L.FeatureGroup

  drawControl: L.Control.Draw

  constructor(public container: HTMLElement, public accessToken: string, options: any = {}) {
    this.setTileLayers()

    if (!options.layers) {
      options.layers = [this.baseLayers[Object.keys(this.baseLayers)[0]]]
    }

    this.map = L.map(container, options)

    L.control.layers(this.baseLayers).addTo(this.map)

    this.setDrawLayer()
  }

  setTileLayers(): void {
    this.baseLayers = {
      'Streets': this.mapboxLayer('mapbox/streets-v11'),
      'Satellite': this.mapboxLayer('mapbox/satellite-streets-v11'),
      'Terrain': this.mapboxLayer('mapbox/outdoors-v11'),
    }
  }

  mapboxLayer(id: string): L.TileLayer {
    return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
        <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
        Imagery © <a href="http://mapbox.com">Mapbox</a>`,
      id: id,
      accessToken: this.accessToken,
    })
  }

  setDrawLayer(): void {
    this.drawnItems = new L.FeatureGroup([])
      .addTo(this.map)

    this.drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawnItems
      }
    }).addTo(this.map)

    this.map.on(L.Draw.Event.CREATED, event => {
      this.drawnItems.addLayer(event.layer)
    })
  }

  getJSON() {
    return this.drawnItems.toGeoJSON()
  }

  setJSON(json: GeoJSON.GeoJsonObject) {
    L.geoJSON(json, {
      onEachFeature: (feature, layer) => {
        this.drawnItems.addLayer(layer)
      }
    })
  }
}
