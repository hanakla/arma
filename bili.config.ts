import { Config } from 'bili'
import typescript from 'rollup-plugin-typescript2'
import { defaultBiliConfig } from './src/bili.config.base'

export default {
  input: ['src/index.ts', 'src/bili.config.base.js'],
  plugins: {
    typescript2: typescript(),
    ...defaultBiliConfig.plugins,
  },
  bundleNodeModules: defaultBiliConfig.bundleNodeModules,
  output: {
    format: ['cjs', 'esm'],
  },
} as Config
