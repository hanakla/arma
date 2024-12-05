import immer, { Draft } from 'immer'
import {
  DependencyList,
  MutableRefObject,
  RefObject,
  useCallback,
  useDebugValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export function useObjectState<T extends object>(initialState: T) {
  const [state, update] = useState<T>(initialState)

  const updater = useCallback(
    (patch: Partial<T> | ((draft: Draft<T>) => void)) => {
      typeof patch === 'function'
        ? update((prev) => immer(prev, patch))
        : update((prev) =>
            immer(prev, (draft) => {
              Object.assign(draft, patch)
            }),
          )
    },
    [update],
  )

  useDebugValue(state)

  return [state, updater] as const
}

export function useChangedEffect(
  effect: () => void | (() => void | undefined),
  watch: DependencyList,
) {
  const fnRef = useRef(effect)
  const prevWatch = useRef<DependencyList | null>(null)

  fnRef.current = effect

  useEffect(() => {
    if (prevWatch.current == null) {
      prevWatch.current = watch
      return
    }

    for (const idx in watch) {
      if (prevWatch.current[idx] !== watch[idx]) {
        prevWatch.current = watch
        return fnRef.current()
      }
    }
  }, [...watch])
}

export function useAsyncEffect(
  effect: (
    signal: AbortSignal,
  ) => Promise<undefined | (() => void | undefined)>,
  deps?: DependencyList,
) {
  useEffect(() => {
    let disposed = false
    let dispose: (() => void | undefined) | undefined | null = null
    const abort = new AbortController()

    effect(abort.signal).then((destroy) => {
      dispose = destroy
      abort.abort()
      if (disposed) dispose?.()
    })

    return () => {
      disposed = true
      abort.abort()
      dispose?.()
    }
  }, deps)
}

export function useIntersection<
  E extends HTMLElement | null = HTMLElement,
  RootElement extends HTMLElement | null = HTMLElement,
>() {
  const rootRef = useRef<RootElement | null>(null)
  const ref = useRef<E | null>(null)
  const [intersected, setIntersected] = useState(false)

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([entry]) => {
        setIntersected(entry.isIntersecting)
      },
      {
        root: rootRef.current,
        threshold: [0, 0.5, 1],
      },
    )

    if (!ref.current) return
    ob.observe(ref.current!)
    return () => ob.disconnect()
  }, [ref.current, rootRef.current])

  return [intersected, ref, rootRef] as [
    isIntersected: boolean,
    target: MutableRefObject<E>,
    root: MutableRefObject<RootElement>,
  ]
}

/** 今画面のいい感じのところにあるアンカー名を返すhooks */
export function useCurrentVisibleAnchorName() {
  const [currentAnchor, setAnchor] = useState<string | null>(null)

  useEffect(() => {
    const handle = () => {
      const scrollPos = window.scrollY + window.innerHeight
      const anchors = Array.from(document.querySelectorAll('a[id]'))
        .map((el) => ({ el, top: (el as HTMLElement).offsetTop }))
        .sort((a, b) => a.top - b.top)

      for (let i = 0; i < anchors.length; i++) {
        const { top, el } = anchors[i]
        const nextAnchor = anchors[i + 1]

        if (nextAnchor && scrollPos >= top && scrollPos < nextAnchor.top) {
          setAnchor(el.id)
          break
        }

        setAnchor(el.id)
      }
    }

    window.addEventListener('scroll', handle, { passive: true })
  }, [])

  return { currentAnchor }
}

/**
 * ```
 * // `refs` is current mounted elements
 * const [refs, bindRef] = useSetRef()
 *
 * return (
 *   <>{items.map(item => <Item ref={bindRef} />)}</>
 * )
 * ```
 */
export function useSetRef<T extends Element>() {
  const [refs, setRefs] = useState(new Set<T>())
  const keeped = useMemo(() => new WeakSet<T>(), [])

  const bindRef = useCallback((el: T) => {
    if (el == null) {
      // Remove GCed elements
      setRefs(new Set([...refs].filter((el) => keeped.has(el))))
    } else {
      refs.add(el)
    }
  }, [])

  useEffect(() => {
    return () => refs.clear()
  }, [])

  return [refs, bindRef] as const
}

/**
 * Combile multiple refs into one ref
 *
 * ```
 * // Example
 * const [ref1] = useSomeHook()
 * const [ref2] = useSomeHook2()
 * const ref = useCombinedRef(ref1, ref2)
 * ```
 */
export function useCombineRef<T>(
  ...refs: Array<React.MutableRefObject<T> | ((el: T | null) => void)>
): RefObject<T> {
  const ref = useRef<T>()

  return useMemo(
    () => ({
      get current() {
        return ref.current
      },
      set current(el: any) {
        ref.current = el
        refs.forEach((ref) => {
          if (ref == null) return
          if (typeof ref === 'function') ref(el)
          else ref.current = el
        })
      },
    }),
    [...refs],
  )
}

export function useStableCallback<T extends (...args: any[]) => any>(fn: T) {
  const latestRef = useRef<T | null>(null)
  const stableRef = useRef<T | null>(null)

  if (stableRef.current == null) {
    stableRef.current = function () {
      latestRef.current!.apply(this, arguments as any)
    } as T
  }

  useLayoutEffect(() => {
    latestRef.current = fn
  }, [fn])

  return stableRef.current
}

export function useStablePreviousRef<T>(value: T) {
  const latestRef = useRef<T>(value)

  useLayoutEffect(() => {
    latestRef.current = value
  }, [value])

  return latestRef.current
}

/**
 * @deprecated use `useStableCallback` instead
 */
export function useFunk<T extends (...args: any[]) => any>(fn: T): T {
  const prev = useRef<T | null>(fn)
  prev.current = fn

  useDebugValue(fn)

  return useMemo(
    (): any =>
      (...args) =>
        prev.current!(...args),
    [],
  )
}
