export const defaultBiliConfig = {
  plugins: {
    terser: {
      mangle: {
        keep_classnames: true,
      },
      compress: {
        arrows: true,
        arguments: true,
        ecma: 2015,
      },
      output: {
        beautify: true,
      },
    },
  },
  bundleNodeModules: ['tslib'],
  babel: {
    asyncToPromises: true,
  },
}
