import * as L from 'leaflet'

export class Editor {
  public map: L.Map

  constructor(public container: HTMLElement) {
    this.map = L.map(container)
  }
}
