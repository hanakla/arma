export const loadImageFromBlob = async (blob: Blob) => {
  const url = URL.createObjectURL(blob)
  return { image: await loadImage(url), url }
}
export const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = url
  })

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
