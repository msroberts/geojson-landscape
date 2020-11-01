import {Editor} from './editor'

export * from './editor'

export * from './util'

export * from './settings'

export function createMap(container: HTMLElement, accessToken: string) {
  const map = new Editor(container, accessToken)

  return map
}
