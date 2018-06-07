import VueGridLayout from 'vue-grid-layout'
import PluginManager from './plugin-manager/plugin-manager'
import { Plugins } from './plugins'

let comps = {
  GridLayout: VueGridLayout.GridLayout,
  GridItem: VueGridLayout.GridItem
}

console.info(`%cLoading plugins`, `color: #37718E;font-weight:bold;`)
for (let plugin of Plugins) {
  console.info(`    %c${plugin.name}`, `color: gray;`)
  for (let component of plugin.components) {
    comps[component.tag] = component.vue
  }
}

export const components = comps
export const plugins = new PluginManager(Plugins)
