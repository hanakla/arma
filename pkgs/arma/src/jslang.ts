export { rescue } from '@hanakla/rescue'

type ValueOrReturnType<T extends any | ((_: void) => any)> = T extends (
  _: void,
) => infer R
  ? R
  : T

type Matcher<R> = {
  when<R1 extends any | ((_: void) => any)>(
    expect: any,
    value: R1,
  ): Matcher<R | ValueOrReturnType<R1>>
  _<R1 extends any | ((_: void) => any | Error) = R>(
    value?: R1,
  ): Exclude<R | ValueOrReturnType<R1>, Error>
}

export function match<T>(actual: T) {
  let matched = false
  let result: any | null = null

  const matcher: Matcher<never> = {
    when: (expect, value) => {
      if (expect === actual) {
        matched = true
        result = typeof value === 'function' ? value() : value
        if (result instanceof Error) throw result
      }

      return matcher
    },
    _: (value?) => {
      if (!matched) {
        const retval = typeof value === 'function' ? value() : value
        if (retval instanceof Error) throw retval
        return retval
      }

      return result
    },
  }

  return matcher
}
