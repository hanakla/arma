export function cssurl(url: string | null | undefined) {
  return url ? `url(${encodeURI(url)})` : void 0
}
