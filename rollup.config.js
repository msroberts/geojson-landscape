import typescript from 'rollup-plugin-typescript'
import compiler from 'typescript'

const plugins = [
  typescript({
    // Use latest typescript
    typescript: compiler,
  })
]

export default {
  entry: 'src/index.ts',
  dest: 'dist/bundle.js',
  format: 'umd',
  plugins: plugins,
}
