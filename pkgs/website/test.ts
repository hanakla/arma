import { dirname, join } from 'path'
import { Project } from 'ts-morph'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export type Content = { filename: string } & (
  | { contents: { name: string; body: string }; fileContent: null }
  | { contents: null; fileContent: string }
)

export async function getLibContents(): Promise<Content[]> {
  const project = new Project({})
  console.log(__dirname)
  project.addSourceFilesAtPaths(join(__dirname, '../arma/src/*.ts'))

  return project.getSourceFiles().map((f) => {
    const fileContent = f.getFullText()

    console.log(/\/\/ arma:publish-file/.test(fileContent))
    if (/\/\/ arma:publish-file/.test(fileContent)) {
      return {
        filename: f.getBaseName(),
        fileContent: fileContent,
        contents: null,
      }
    }

    return {
      filename: f.getBaseName(),
      contents: f
        .getExportSymbols()
        .map((s) =>
          f.getFunction(s.getName())
            ? {
                name: s.getName() + '()',
                body: f.getFunction(s.getName())?.getFullText().trim(),
              }
            : undefined,
        )
        .filter((v): v is Exclude<typeof v, undefined> => !!v),
    }
  })
}

// console.log(JSON.stringify(await getLibContents(), null, 2))
