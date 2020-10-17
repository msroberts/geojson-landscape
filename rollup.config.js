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
  input: 'src/index.ts',
  output:{
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'geojsonLandscape',
    globals: {
      'leaflet': 'L',
    },
  },
  external: Object.keys(dependencies),
  plugins: plugins,
}
