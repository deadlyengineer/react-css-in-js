import { FC, ReactElement } from 'react';
import pretty from 'pretty';

type TestFC = FC<{ styles?: ReactElement; className?: string }>;

const documentDesc = Object.getOwnPropertyDescriptor(global, 'document') as PropertyDescriptor;

beforeEach(() => {
  jest.resetModules();
  Object.defineProperty(global, 'document', { configurable: true, value: undefined });
});

afterEach(() => {
  Object.defineProperty(global, 'document', documentDesc);
});

let html = '';

it('should render styles inline when document is undefined', async () => {
  const ReactDOMServer = await import('react-dom/server');
  const jsx = await getJsx();

  html = ReactDOMServer.renderToString(jsx);

  expect(pretty(html)).toMatchInlineSnapshot(`
    "<style data-rcij=\\"8vcj72\\">
      :root {
        color: green;
      }
    </style>
    <style data-rcij=\\"a/1bg8z9n\\">
      .a--rcij-1bg8z9n {
        color: blue;
      }
    </style>
    <style data-rcij=\\"a/edkdb8\\">
      .a--rcij-edkdb8 {
        color: red;
        color: blue;
      }
    </style>
    <div class=\\"a--rcij-edkdb8\\">foo</div>
    <style data-rcij=\\"a/1bg8z9n\\">
      .a--rcij-1bg8z9n {
        color: blue;
      }
    </style>
    <div class=\\"a--rcij-1bg8z9n\\">bar</div>
    <style data-rcij=\\"a/9pvgme\\">
      .a--rcij-9pvgme {
        color: red;
      }
    </style>
    <div class=\\"a--rcij-9pvgme\\">baz</div>
    <style data-rcij=\\"d1z182\\">
      :root {
        color: black;
      }
    </style>"
  `);
});

it('should rehydrate inline styles into the head.', async () => {
  Object.defineProperty(global, 'document', documentDesc);

  const ReactDOM = await import('react-dom');

  jsdom.window.document.body.innerHTML = '<div id="root">' + html + '</div>';
  await import('./');

  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head></head>

      <body>
        <div id=\\"root\\">
          <div class=\\"a--rcij-edkdb8\\">foo</div>
          <div class=\\"a--rcij-1bg8z9n\\">bar</div>
          <div class=\\"a--rcij-9pvgme\\">baz</div>
        </div>
      </body>

    </html>"
  `);

  ReactDOM.hydrate(await getJsx(), document.getElementById('root'));

  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"8vcj72\\">
          :root {
            color: green;
          }
        </style>
        <style data-rcij=\\"a/1bg8z9n\\">
          .a--rcij-1bg8z9n {
            color: blue;
          }
        </style>
        <style data-rcij=\\"a/edkdb8\\">
          .a--rcij-edkdb8 {
            color: red;
            color: blue;
          }
        </style>
        <style data-rcij=\\"a/9pvgme\\">
          .a--rcij-9pvgme {
            color: red;
          }
        </style>
        <style data-rcij=\\"d1z182\\">
          :root {
            color: black;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\">
          <div class=\\"a--rcij-edkdb8\\">foo</div>
          <div class=\\"a--rcij-1bg8z9n\\">bar</div>
          <div class=\\"a--rcij-9pvgme\\">baz</div>
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
