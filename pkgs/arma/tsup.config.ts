import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'react-hooks': 'src/react-hooks.ts',
  },
  external: ['react', 'immer'],
  format: ['cjs', 'esm'],
  dts: true,
})
