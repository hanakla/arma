export async function loadImageFromBlob(blob: Blob): Promise<{
  image: HTMLImageElement
  url: string
  [Symbol.dispose]?: () => void
}> {
  const url = URL.createObjectURL(blob)

  const obj = { image: await loadImage(url), url }
  if (Symbol.dispose != null) {
    obj[Symbol.dispose] = () => {
      URL.revokeObjectURL(url)
    }
  }

  return obj
}
export async function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = url
  })
}

export function readFileAsBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as ArrayBuffer)
    }
    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}
