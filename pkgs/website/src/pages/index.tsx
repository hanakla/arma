import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getLibContents } from '../../test'
import { useStableCallback, clipbordWriteText } from '@hanakla/arma'
import Head from 'next/head'

type Props = {
  contents: Awaited<ReturnType<typeof getLibContents>>
}

export default function Index({ contents }: Props) {
  return (
    <>
      <Head>
        <title>@hanakla/Arma</title>
      </Head>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body { margin: 0; }
            *,*::before,*::after { box-sizing: border-box; }
        `.trim(),
        }}
      />
      <div
        style={{
          display: 'flex',
          maxWidth: 1120,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            flex: 'none',
            marginRight: 32,
            borderRight: '1px solid #ddd',
          }}
        >
          <h1
            style={{
              margin: '16px 0 0',
            }}
          >
            Arma
          </h1>

          <summary
            style={{
              position: 'sticky',
              top: 0,
              padding: '24px 16px 0 0',
            }}
          >
            <ul
              style={{
                margin: 0,
                paddingLeft: 0,
              }}
            >
              {contents.map((c) => (
                <li>
                  <a
                    key={c.filename}
                    href={`#${c.filename}`}
                    style={{
                      textDecoration: 'none',
                    }}
                  >
                    {c.filename}
                  </a>

                  <ul>
                    {c.contents?.map((d) => (
                      <li key={d.name}>
                        <a
                          href={`#${c.filename}--${d.name}`}
                          style={{
                            textDecoration: 'none',
                          }}
                        >
                          {d.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </summary>
        </div>

        <div style={{ flex: '1', overflow: 'hidden' }}>
          <header style={{ textAlign: 'center' }}>
            <h1>
              <small style={{ fontSize: 16, color: '#aaa', marginRight: 4 }}>
                @hanakla/
              </small>
              Arma
            </h1>
            <p>Arma is a tactical code snippets library for Web.</p>
          </header>
          <h2 style={{ textAlign: 'center' }}>Contents</h2>
          {contents.map((c) => (
            <section key={c.filename}>
              <a id={c.filename} />
              <h3 style={{ textAlign: 'center' }}>{c.filename}</h3>

              <ul>
                {c.fileContent ? (
                  <li style={{ listStyle: 'none' }}>
                    <div style={{ fontSize: 14 }}>
                      <CodeBlock>{c.fileContent}</CodeBlock>
                    </div>
                  </li>
                ) : (
                  c.contents!.map((d) => (
                    <li key={d.name} style={{ listStyle: 'none' }}>
                      <a id={`${c.filename}--${d.name}`} />

                      <h4>{d.name}</h4>

                      <div style={{ fontSize: 14 }}>
                        <CodeBlock>{d.body!}</CodeBlock>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>
          ))}
          d
        </div>
      </div>
    </>
  )
}

function CodeBlock({ children }: { children: string }) {
  const handleCopy = useStableCallback(() => {
    clipbordWriteText(children)
  })

  return (
    <div
      style={{
        position: 'relative',
        fontSize: 14,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          padding: 4,
        }}
      >
        <button type="button" onClick={handleCopy}>
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        language="typescript"
        wrapLines
        wrapLongLines
        // style={xonokai}
        customStyle={{
          paddingTop: 32,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

export async function getStaticProps() {
  const contents = await getLibContents()

  return {
    props: {
      contents,
    },
  }
}
