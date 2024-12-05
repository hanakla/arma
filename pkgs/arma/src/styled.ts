export function styleWhen(flag: boolean) {
  return (template: TemplateStringsArray, ...rest: any[]) =>
    flag ? String.raw(template, ...rest) : ''
}
