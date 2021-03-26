import { FC, ReactElement } from 'react';
import pretty from 'pretty';

type TestFC = FC<{ styles?: ReactElement; className?: string }>;

describe('SSR', () => {
  let _document: Document | undefined;

  beforeEach(() => {
    _document = (window as { _document?: Document })._document;
    jest.resetModules();
  });

  afterEach(() => {
    (window as { _document?: Document })._document = _document;
  });

  let html = '';

  it('should render styles inline when document is undefined', async () => {
    (window as { _document?: Document })._document = undefined;

    const ReactDOMServer = await import('react-dom/server');
    const jsx = await getJsx();

    html = ReactDOMServer.renderToString(jsx);

    expect(pretty(html)).toMatchInlineSnapshot(`
      "<style data-rcij=\\"1m7siiq\\">
        :root {
          color: green;
        }
      </style>
      <style data-rcij=\\"a/cilhif\\">
        .a--rcij-cilhif {
          color: blue;
        }
      </style>
      <style data-rcij=\\"a/35ggvc\\">
        .a--rcij-35ggvc {
          color: red;
          color: blue;
        }
      </style>
      <div class=\\"a--rcij-35ggvc\\">foo</div>
      <div class=\\"a--rcij-cilhif\\">bar</div>
      <style data-rcij=\\"a/g0zrt6\\">
        .a--rcij-g0zrt6 {
          color: red;
        }
      </style>
      <div class=\\"a--rcij-g0zrt6\\">baz</div>
      <style data-rcij=\\"37imqm\\">
        :root {
          color: black;
        }
      </style>"
    `);
  });

  it('should rehydrate inline styles into the head.', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('root')!.innerHTML = html;

    const ReactDOM = await import('react-dom');
    await import('./');

    expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
      "<!DOCTYPE html>
      <html>

        <head></head>

        <body>
          <div id=\\"root\\">
            <div class=\\"a--rcij-35ggvc\\">foo</div>
            <div class=\\"a--rcij-cilhif\\">bar</div>
            <div class=\\"a--rcij-g0zrt6\\">baz</div>
          </div>
        </body>

      </html>"
    `);

    ReactDOM.hydrate(await getJsx(), document.getElementById('root'));

    expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
      "<!DOCTYPE html>
      <html>

        <head>
          <style data-rcij=\\"1m7siiq\\">
            :root {
              color: green;
            }
          </style>
          <style data-rcij=\\"a/cilhif\\">
            .a--rcij-cilhif {
              color: blue;
            }
          </style>
          <style data-rcij=\\"a/35ggvc\\">
            .a--rcij-35ggvc {
              color: red;
              color: blue;
            }
          </style>
          <style data-rcij=\\"a/g0zrt6\\">
            .a--rcij-g0zrt6 {
              color: red;
            }
          </style>
          <style data-rcij=\\"37imqm\\">
            :root {
              color: black;
            }
          </style>
        </head>

        <body>
          <div id=\\"root\\">
            <div class=\\"a--rcij-35ggvc\\">foo</div>
            <div class=\\"a--rcij-cilhif\\">bar</div>
            <div class=\\"a--rcij-g0zrt6\\">baz</div>
          </div>
        </body>

      </html>"
    `);
  });

  async function getJsx() {
    const React = await import('react');
    const { css, Style, Styled } = await import('./');
    const A: TestFC = ({ styles, className, children }) => {
      return (
        <Styled scope={'a'} className={className}>
          {styles}
          <div>{children}</div>
        </Styled>
      );
    };
    return (
      <>
        <Style>{css`
          color: green;
        `}</Style>
        <Styled scope={'a'}>
          {css`
            color: blue;
          `}
          <A
            styles={css`
              color: red;
            `}
          >
            foo
          </A>
        </Styled>
        <A
          styles={css`
            color: blue;
          `}
        >
          bar
        </A>
        <A
          styles={css`
            color: red;
          `}
        >
          baz
        </A>
        <Style>{css`
          color: black;
        `}</Style>
      </>
    );
  }
});
