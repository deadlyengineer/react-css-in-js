/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNode, VFC } from 'react';
import pretty from 'pretty';

let _document: Document | undefined;

beforeEach(() => {
  jest.resetModules();
  _document = (window as { _document?: Document })._document;
  (window as { _document?: Document })._document = undefined;
});

afterEach(() => {
  (window as { _document?: Document })._document = _document;
});

it('should render to string', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('..');

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Styled scope={'foo'}>
          {css`
            padding: 32px;
            background-color: hotpink;
            font-size: 24px;
            border-radius: 4px;
            &:hover {
              color: white;
            }
          `}
          <div />
        </Styled>
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"foo/nxem63\\">
      .foo--rcij-nxem63 {
        padding: 32px;
        background-color: hotpink;
        font-size: 24px;
        border-radius: 4px;
      }

      .foo--rcij-nxem63:hover {
        color: white;
      }
    </style>
    <div class=\\"foo--rcij-nxem63\\"></div>"
  `);
});

it('should allow for style overrides using Styled wrappers', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('..');

  const A: VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled className={className}>
        {css`
          color: red;
        `}
        <div className={'a'}></div>
      </Styled>
    );
  };

  const B: VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled className={className}>
        {css`
          color: green;
        `}
        <A className={'b'} />
      </Styled>
    );
  };

  const C: VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled className={className}>
        {css`
          color: blue;
        `}
        <B className={'c'} />
      </Styled>
    );
  };

  expect(pretty(ReactDOMServer.renderToString(<C className={'render'} />))).toMatchInlineSnapshot(`
    "<style data-rcij=\\"cilhif\\">
      .rcij-cilhif {
        color: blue;
      }
    </style>
    <style data-rcij=\\"1dmttsw\\">
      .rcij-1dmttsw {
        color: green;
        color: blue;
      }
    </style>
    <style data-rcij=\\"ezbhyn\\">
      .rcij-ezbhyn {
        color: red;
        color: green;
        color: blue;
      }
    </style>
    <div class=\\"a b c render rcij-ezbhyn\\"></div>"
  `);
});

it('should includes styles when directly nested', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('..');

  const AStyled = ({ className, children }: { className?: string; children?: ReactNode }) => {
    return (
      <Styled className={className}>
        {css`
          color: blue;
        `}
        {children}
      </Styled>
    );
  };

  const BStyled = ({ className, children }: { className?: string; children?: ReactNode }) => {
    return (
      <Styled className={className}>
        {css`
          color: green;
        `}
        {children}
      </Styled>
    );
  };

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <AStyled>
          <BStyled>
            <Styled>
              {css`
                color: red;
              `}
              <div />
            </Styled>
          </BStyled>
        </AStyled>
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"cilhif\\">
      .rcij-cilhif {
        color: blue;
      }
    </style>
    <style data-rcij=\\"1dmttsw\\">
      .rcij-1dmttsw {
        color: green;
        color: blue;
      }
    </style>
    <style data-rcij=\\"ezbhyn\\">
      .rcij-ezbhyn {
        color: red;
        color: green;
        color: blue;
      }
    </style>
    <div class=\\"rcij-ezbhyn\\"></div>"
  `);
});

it('should use each tagged template as a wrapper for subsequent elements', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('..');

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Styled scope={'foo'}>
          <div />
          <div className={'1'} />
          {css`
            color: red;
          `}
          <div className={'2'} />
          {css`
            color: blue;
          `}
          {css`
            color: green;
          `}
          <div className={'3'} />
          testing
          {css`
            color: purple;
          `}
        </Styled>
      )
    )
  ).toMatchInlineSnapshot(`
    "<div></div>
    <div class=\\"1\\"></div>
    <style data-rcij=\\"foo/g0zrt6\\">
      .foo--rcij-g0zrt6 {
        color: red;
      }
    </style>
    <div class=\\"2 foo--rcij-g0zrt6\\"></div>
    <style data-rcij=\\"foo/g8drrj\\">
      .foo--rcij-g8drrj {
        color: green;
        color: blue;
        color: red;
      }
    </style>
    <div class=\\"3 foo--rcij-g8drrj\\"></div><span class=\\"foo--rcij-g8drrj\\">testing</span>"
  `);
});

it('should omit properties with null/undefined values', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('..');

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Styled>
          {css`
            color: red;
            color: ${undefined};
            color: ${null};
            color: blue;
          `}
          <div />
        </Styled>
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"4gjap4\\">
      .rcij-4gjap4 {
        color: red;
        color: blue;
      }
    </style>
    <div class=\\"rcij-4gjap4\\"></div>"
  `);
});

it('should override scopes when nested', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('..');

  const C: VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled scope={'c'} className={className}>
        {css`
          color: green;
        `}
        <div />
      </Styled>
    );
  };

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Styled scope={'a'}>
          {css`
            color: red;
          `}
          <Styled scope={'b'}>
            {css`
              color: ${'blue'};
            `}
            <div />
          </Styled>
          <C />
        </Styled>
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"a/g0zrt6\\">
      .a--rcij-g0zrt6 {
        color: red;
      }
    </style>
    <style data-rcij=\\"a/1e7edc8\\">
      .a--rcij-1e7edc8 {
        color: blue;
        color: red;
      }
    </style>
    <div class=\\"a--rcij-1e7edc8\\"></div>
    <style data-rcij=\\"a/mn80jx\\">
      .a--rcij-mn80jx {
        color: green;
        color: red;
      }
    </style>
    <div class=\\"a--rcij-mn80jx\\"></div>"
  `);
});
