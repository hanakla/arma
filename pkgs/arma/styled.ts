export const styleWhen = (flag: boolean) => (
  template: TemplateStringsArray,
  ...rest: any[]
) => (flag ? String.raw(template, ...rest) : '')
