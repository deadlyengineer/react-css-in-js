/* eslint-disable @typescript-eslint/no-var-requires */
import pretty from 'pretty';
import { css } from './css';

type FC = React.FC<{ styles?: string; className?: string }>;

const document = global.document;
let html = '';

beforeEach(() => {
  Object.defineProperty(global, 'document', {
    writable: true,
    configurable: true,
    enumerable: true,
    value: undefined,
  });
  jest.resetModules();
});

afterEach(() => {
  global.document = document;
});

it('should render styles inline when document is undefined', () => {
  const ReactDOMServer = require('react-dom/server');
  const jsx = getJsx();
  html = ReactDOMServer.renderToString(jsx);

  expect(pretty(html)).toMatchInlineSnapshot(`
    "<style data-rcij=\\"1m7siiq\\" data-reactroot=\\"\\">
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
    <style data-rcij=\\"a/cilhif\\">
      .a--rcij-cilhif {
        color: blue;
      }
    </style>
    <div class=\\"a--rcij-cilhif\\">bar</div>
    <style data-rcij=\\"a/g0zrt6\\">
      .a--rcij-g0zrt6 {
        color: red;
      }
    </style>
    <div class=\\"a--rcij-g0zrt6\\">baz</div>
    <style data-rcij=\\"37imqm\\" data-reactroot=\\"\\">
      :root {
        color: black;
      }
    </style>"
  `);
});

it('should rehydrate inline styles into the head.', () => {
  Object.defineProperty(global, 'document', {
    writable: true,
    configurable: true,
    enumerable: true,
    value: document,
  });
  jsdom.window.document.body.innerHTML = `<div id="root">${html}</div>`;
  const ReactDOM = require('react-dom');
  require('.');
  ReactDOM.hydrate(getJsx(), document.getElementById('root'));

  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"1m7siiq\\" data-reactroot=\\"\\">
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
        <style data-rcij=\\"37imqm\\" data-reactroot=\\"\\">
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

function getJsx() {
  const React = require('react');
  const { Style } = require('./components/Style');
  const { Styled } = require('./components/Styled');
  const A: FC = ({ styles, className, children }) => {
    return (
      <Styled name={'a'} css={styles}>
        <div className={className}>{children}</div>
      </Styled>
    );
  };
  return (
    <>
      <Style
        css={css`
          color: green;
        `}
      />
      <Styled
        name={'a'}
        css={css`
          color: blue;
        `}
      >
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
      <Style
        css={css`
          color: black;
        `}
      />
    </>
  );
}
