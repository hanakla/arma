export async function loadImageFromBlob(blob: Blob): Promise<{
  image: HTMLImageElement
  url: string
  [Symbol.dispose]: () => void
}> {
  const url = URL.createObjectURL(blob)

  const obj = { image: await loadImage(url), url }
  if (Symbol.dispose != null) {
    obj[Symbol.dispose] = () => {
      URL.revokeObjectURL(url)
    }
  }

  return obj as any
}
export async function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = url
  })
}

export async function createDisposableObjectURL(blob: Blob) {
  const url = URL.createObjectURL(blob)

  return Object.assign(url, {
    [Symbol.dispose]: () => {
      URL.revokeObjectURL(url);
    }
  })
}
