export const selectFile = async ({
  extensions,
  directory,
  multiple,
}: {
  /** Accept extensions with `.` prefix */
  extensions?: string[]
  directory?: boolean
  multiple?: boolean
} = {}): Promise<File[]> => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = (extensions || []).join(',')
  input.multiple = !!multiple
  input.style.display = 'none'
  if (directory) input.setAttribute('webkitDirectory', '')

  // DOMに追加しないとsafariで動かしたときにresolveCallbackが呼ばれる前にinput要素が消えてしまう
  document.body.appendChild(input)

  return new Promise((resolve) => {
    const resolveCallback = () => {
      resolve(Array.from(input.files ?? []))
      input.parentElement?.removeChild(input)
    }

    input.addEventListener('change', resolveCallback, { once: true })

    // キャンセル時の処理
    document.body.addEventListener(
      'focusin',
      () => {
        // changeが発生するより先にfocusinが発生するので
        // changeが終わってそうな時間だけ遅延させる
        setTimeout(() => {
          resolve([])
          input.parentElement?.removeChild(input)
          input.removeEventListener('change', resolveCallback)
        }, 10000)
      },
      { once: true },
    )

    input.click()
  })
}

export const letDownload = (url: string, filename?: string) => {
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: filename ?? '',
  })

  a.click()
}

export const ClipBoardUtil = {
  writeText(text: string) {
    const input = document.createElement('textarea')
    input.value = text
    input.readOnly = true

    Object.assign(input.style, {
      border: '0',
      padding: '0',
      margin: '0',

      position: 'absolute',
      left: '-9999px',
      top: `${window.pageYOffset || document.documentElement.scrollTop}px`,

      // Prevent zooming on iOS
      fontSize: '12px',
    })

    document.body.appendChild(input)
    input.focus({ preventScroll: true })
    input.setSelectionRange(0, Array.from(text).length)

    const result = document.execCommand('copy')
    document.body.removeChild(input)
    return result
  },
}
