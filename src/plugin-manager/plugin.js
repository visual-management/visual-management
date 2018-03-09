export default class Plugin {
  constructor (plugin) {
    this._components = plugin.components
    this.id = plugin.id
    this.name = plugin.name
  }

  getComponentByTag (componentName) {
    for (let component of this._components) {
      if (component.tag === componentName) {
        return component
      }
    }
  }
}
