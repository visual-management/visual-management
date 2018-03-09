import Plugin from './plugin'

export default class PluginManager {
  constructor (plugins) {
    this._plugins = []
    for (let plugin of plugins) {
      this._plugins.push(new Plugin(plugin))
    }
  }

  get plugins () {
    return this._plugins
  }

  set plugins (arg) {
    throw new Error('plugins array is immutable')
  }

  getPluginById (pluginId) {
    for (let plugin of this._plugins) {
      if (plugin.id === pluginId) {
        return plugin
      }
    }
  }
}
