import React, { FC, ReactElement, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import pretty from 'pretty';

import { css } from './css';
import { Style } from './components/Style';
import { Styled } from './components/Styled';

type TestFC = FC<{ styles?: ReactElement; className?: string }>;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should insert styles into the head', () => {
  ReactDOM.render(getJsx(), document.getElementById('root'));
  jest.runAllTimers();
  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"1wbqmg8\\">
          :root {
            color: green;
            padding: 0 1px 2em 3rem;
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
        padding: 0 1px 2em 3rem;
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

it('should regenerate styles which were previously removed', async () => {
  ReactDOM.render(
    <StrictMode>
      <Styled>
        {css`
          color: red;
        `}
        <div />
      </Styled>
    </StrictMode>,
    document.getElementById('root')
  );
  jest.runAllTimers();
  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"g0zrt6\\">
          .rcij-g0zrt6 {
            color: red;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\">
          <div class=\\"rcij-g0zrt6\\"></div>
        </div>
      </body>

    </html>"
  `);

  ReactDOM.render(
    <Styled>
      {css`
        color: blue;
      `}
      <div />
    </Styled>,
    document.getElementById('root')
  );
  jest.runAllTimers();
  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"cilhif\\">
          .rcij-cilhif {
            color: blue;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\">
          <div class=\\"rcij-cilhif\\"></div>
        </div>
      </body>

    </html>"
  `);

  ReactDOM.render(
    <Styled>
      {css`
        color: red;
      `}
      <div />
    </Styled>,
    document.getElementById('root')
  );
  jest.runAllTimers();
  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"g0zrt6\\">
          .rcij-g0zrt6 {
            color: red;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\">
          <div class=\\"rcij-g0zrt6\\"></div>
        </div>
      </body>

    </html>"
  `);
});
