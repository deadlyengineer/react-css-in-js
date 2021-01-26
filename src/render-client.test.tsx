import React from 'react';
import ReactDOM from 'react-dom';
import pretty from 'pretty';

import { css } from './css';
import { Style } from './components/Style';
import { Styled } from './components/Styled';

type FC = React.FC<{ styles?: string; className?: string }>;

it('should insert styles into the head', () => {
  jsdom.window.document.body.innerHTML = `<div id="root" />`;

  ReactDOM.render(getJsx(), document.getElementById('root'));
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

function getJsx() {
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
