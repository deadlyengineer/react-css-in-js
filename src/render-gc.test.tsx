/* eslint-disable @typescript-eslint/no-var-requires */
import React, { VFC } from 'react';
import ReactDOM from 'react-dom';
import pretty from 'pretty';
import { css } from './css';
import { Styled } from './components/Styled';
import { Style } from './components/Style';

const A: VFC = () => {
  return (
    <Styled scope={'a'}>
      {css`
        color: red;
      `}
      <div />
    </Styled>
  );
};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should gc unused styles', async () => {
  window.document.body.innerHTML = `<div id="root" />`;
  const root = window.document.getElementById('root');

  ReactDOM.render(
    <>
      <A key={'1'} />
    </>,
    root
  );
  jest.runAllTimers();

  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"a/g0zrt6\\">
          .a--rcij-g0zrt6 {
            color: red;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\">
          <div class=\\"a--rcij-g0zrt6\\"></div>
        </div>
      </body>

    </html>"
  `);

  ReactDOM.render(
    <>
      <A key={'1'} />
      <A key={'2'} />
    </>,
    root
  );
  jest.runAllTimers();

  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"a/g0zrt6\\">
          .a--rcij-g0zrt6 {
            color: red;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\">
          <div class=\\"a--rcij-g0zrt6\\"></div>
          <div class=\\"a--rcij-g0zrt6\\"></div>
        </div>
      </body>

    </html>"
  `);

  ReactDOM.render(
    <>
      <A key={'2'} />
    </>,
    root
  );
  jest.runAllTimers();

  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"a/g0zrt6\\">
          .a--rcij-g0zrt6 {
            color: red;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\">
          <div class=\\"a--rcij-g0zrt6\\"></div>
        </div>
      </body>

    </html>"
  `);

  ReactDOM.render(<></>, root);
  jest.runAllTimers();

  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head></head>

      <body>
        <div id=\\"root\\"></div>
      </body>

    </html>"
  `);
});

it('should inject stylesheets after replaced stylesheets', () => {
  window.document.body.innerHTML = `<div id="root" />`;
  const root = window.document.getElementById('root');

  ReactDOM.render(
    <>
      <Style>{css`
        padding-top: 0;
      `}</Style>
      <Style>{css`
        padding-bottom: 0;
      `}</Style>
    </>,
    root
  );
  jest.runAllTimers();
  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"inr8qr\\">
          :root {
            padding-top: 0;
          }
        </style>
        <style data-rcij=\\"1379y87\\">
          :root {
            padding-bottom: 0;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\"></div>
      </body>

    </html>"
  `);

  ReactDOM.render(
    <>
      <Style>{css`
        padding-top: 1px;
      `}</Style>
      <Style>{css`
        padding-bottom: 0;
      `}</Style>
    </>,
    root
  );
  jest.runAllTimers();
  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"1k8ro0a\\">
          :root {
            padding-top: 1px;
          }
        </style>
        <style data-rcij=\\"1379y87\\">
          :root {
            padding-bottom: 0;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\"></div>
      </body>

    </html>"
  `);
});

it('should not leak styles when re-rendering rapidly', () => {
  window.document.body.innerHTML = `<div id="root" />`;
  const root = window.document.getElementById('root');

  ReactDOM.render(
    <>
      <Style>{css`
        padding-top: 0;
      `}</Style>
    </>,
    root
  );
  ReactDOM.render(
    <>
      <Style>{css`
        padding-top: 1px;
      `}</Style>
    </>,
    root
  );
  jest.runAllTimers();
  expect(pretty(jsdom.serialize())).toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <html>

      <head>
        <style data-rcij=\\"1k8ro0a\\">
          :root {
            padding-top: 1px;
          }
        </style>
      </head>

      <body>
        <div id=\\"root\\"></div>
      </body>

    </html>"
  `);
});
