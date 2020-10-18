import * as L from 'leaflet'

export class Editor {
  public mapContainer: HTMLDivElement
  public textBox: HTMLTextAreaElement
  public map: L.Map
  baseLayers: { [key: string]: L.TileLayer }
  drawnItems: L.FeatureGroup
  drawControl: L.Control.Draw

  constructor(public container: HTMLElement, public accessToken: string, options: any = {}) {
    this.setTileLayers()

    if (!options.layers) {
      options.layers = [this.baseLayers[Object.keys(this.baseLayers)[0]]]
    }

    this.createContainers()

    this.map = L.map(this.mapContainer, options)

    L.control.layers(this.baseLayers).addTo(this.map)

    this.setDrawLayer()
  }

  private setTileLayers(): void {
    this.baseLayers = {
      'Streets': this.mapboxLayer('mapbox/streets-v11'),
      'Satellite': this.mapboxLayer('mapbox/satellite-streets-v11'),
      'Terrain': this.mapboxLayer('mapbox/outdoors-v11'),
    }
  }

  private mapboxLayer(id: string): L.TileLayer {
    return L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
        <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
        Imagery © <a href="http://mapbox.com">Mapbox</a>`,
      id: id,
      accessToken: this.accessToken,
    })
  }

  private setDrawLayer(): void {
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

  private createContainers() {
    this.mapContainer = document.createElement('div')
    this.container.appendChild(this.mapContainer)

    this.textBox = document.createElement('textarea')
    this.container.appendChild(this.textBox)
  }

  public getJSON() {
    return this.drawnItems.toGeoJSON()
  }

  public setJSON(json: GeoJSON.GeoJsonObject) {
    L.geoJSON(json, {
      onEachFeature: (_, layer) => {
        this.drawnItems.addLayer(layer)
      }
    })
  }
}
