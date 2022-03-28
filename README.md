# @hanakla/arma

Floor killer single functions for Web frontend

## Functions

CSS: `cssurl`

DOM: `selectFile` / `letDownload` / `ClipBoardUtil` / `loadImage` / `loadImageFromBlob`

Files: `loadImage` / `loadImageFromBlob`

React Hooks: `useAsyncEffect` / `useChangedEffect` / `useObjectState` / `useSetRef` / `useCombineRef` / `useCurrentVisibleAnchorName` / `useIntersection`

String: `lineBreakToSpace` / `ellipsisString` / `trimString`

styled-components: `styleWhen`

Lang feature: `rescue` / `match`


## bili.config

```ts
import defaultConfig from '@hanakla/arma/dist/bili.config.base'

import { Config } from 'bili'
import typescript from 'rollup-plugin-typescript2'
import { defaultBiliConfig } from '../../bili.default.config'

export default {
  input: 'src/index.ts',
  plugins: {
    typescript2: typescript(),
    terser: defaultConfig.plugins.terser,
  },
  babel: defaultConfig.babel,
  bundleNodeModules: defaultConfig.bundleNodeModules,
  output: {
    format: ['cjs', 'esm'],
  },
} as Config

```
