import immer, { Draft } from 'immer'
import {
  DependencyList,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export const useObjectState = <T extends object>(initialState: T) => {
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

  return [state, updater] as const
}

export const useChangedEffect = (
  effect: () => void | (() => void | undefined),
  watch: DependencyList,
) => {
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

export const useAsyncEffect = (
  effect: () => Promise<undefined | (() => void | undefined)>,
  deps?: DependencyList,
) => {
  useEffect(() => {
    let disposed = false
    let dispose: (() => void | undefined) | undefined | null = null

    effect().then((destroy) => {
      dispose = destroy
      if (disposed) dispose?.()
    })

    return () => {
      disposed = true
      dispose?.()
    }
  }, deps)
}

export const useIntersection = <
  E extends HTMLElement | null = HTMLElement,
  RootElement extends HTMLElement | null = HTMLElement
>() => {
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
export const useCurrentVisibleAnchorName = () => {
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
export const useSetRef = <T extends Element>() => {
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
export const useCombineRef = <T>(
  ...refs: Array<React.MutableRefObject<T> | ((el: T | null) => void)>
): RefObject<T> => {
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
