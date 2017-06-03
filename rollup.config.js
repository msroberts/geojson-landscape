import typescript from 'rollup-plugin-typescript'
import compiler from 'typescript'

const {dependencies} = require('./package.json')

const plugins = [
  typescript({
    // Use latest typescript
    typescript: compiler,
  })
]

export default {
  entry: 'src/index.ts',
  dest: 'dist/bundle.js',
  external: Object.keys(dependencies),
  format: 'umd',
  moduleName: 'geojsonLandscape',
  plugins: plugins,
}
