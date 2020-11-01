import {get, set} from 'idb-keyval'

export const MAPBOX_KEY = 'mapbox-key'

export async function getOrUpdateSetting<T>(settingsKey: string, newValue?: T): Promise<T> {
  if (newValue) {
    await set(settingsKey, newValue)
    return newValue
  }

  return await get<T>(settingsKey)
}
