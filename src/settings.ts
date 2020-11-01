import {get, set} from 'idb-keyval'

export const MAPBOX_KEY = 'mapbox-key'

export const SAVED_JSON = 'saved-json'

export async function getOrUpdateSetting<T>(settingsKey: string, newValue?: T): Promise<T> {
  if (newValue) {
    await set(settingsKey, newValue)
    return newValue
  }

  return await get<T>(settingsKey)
}
