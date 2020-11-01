import * as L from 'leaflet'
import {set} from 'idb-keyval'
import { SAVED_JSON } from './settings'

export class Editor {
  public mapContainer: HTMLDivElement
  public textBox: HTMLTextAreaElement
  public map: L.Map
  private baseLayers: { [key: string]: L.TileLayer }
  private drawnItems: L.FeatureGroup
  private drawControl: L.Control.Draw

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
      this.updateTextBox()
    })
    this.map.on(L.Draw.Event.EDITED, () => this.updateTextBox())
    this.map.on(L.Draw.Event.DELETED, () => this.updateTextBox())
  }

  private createContainers() {
    this.mapContainer = document.createElement('div')
    this.container.appendChild(this.mapContainer)

    this.textBox = document.createElement('textarea')
    this.textBox.addEventListener('change', (ev) => {
      this.updateDrawnLayer(JSON.parse((ev.target as HTMLTextAreaElement).value))
    })
    this.container.appendChild(this.textBox)
  }

  public getJSON() {
    return this.drawnItems.toGeoJSON()
  }

  public setJSON(json: GeoJSON.GeoJsonObject) {
    this.updateDrawnLayer(json)
    this.updateTextBox()
  }

  private updateDrawnLayer(json: GeoJSON.GeoJsonObject) {
    this.drawnItems.clearLayers()
    L.geoJSON(json, {
      onEachFeature: (_, layer) => {
        this.drawnItems.addLayer(layer)
      }
    })
  }

  private updateTextBox() {
    const value = JSON.stringify(this.getJSON(), null, 2)
    this.textBox.value = value
    set(SAVED_JSON, value).then(() => console.log('Updated saved JSON'))
  }
}
