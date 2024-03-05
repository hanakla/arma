export const cssurl = (url: string | null | undefined) =>
  url ? `url(${encodeURI(url)})` : void 0
