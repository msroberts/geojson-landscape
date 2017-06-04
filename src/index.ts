import {Editor} from './editor'

export * from './editor'

export function createMap(container: HTMLElement) {
  const map = new Editor(container)

  return map
}
