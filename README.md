# @hanakla/arma

Floor killer single functions for Web frontend

## Functions

See details from type definition and カン.

### CSS

- `cssurl` - null safe css `url()` wrapper.

### DOM

- `selectFile` - open file selector
- `letDownload` - Allow users to download blob as file
- `ClipBoardUtil`
- `loadImage` - load image by url
- `loadImageFromBlob` - load image by blob

### React Hooks

- `useAsyncEffect`
- `useChangedEffect`
- `useObjectState`
- `useSetRef`
- `useCombineRef` - combile multiple refs into one ref
- `useCurrentVisibleAnchorName`
- `useIntersection`
- `useFunk` - Dependecy free `useCallback`

### String

- `lineBreakToSpace`
- `ellipsisString`
- `trimString`

### styled-components

- `styleWhen` - conditional styling helper function

### Lang feature

- `rescue` - exception handling function
- `match` - simple pattern mather

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
