/* eslint-disable @typescript-eslint/no-var-requires */
import { ReactNode, VFC } from 'react';
import pretty from 'pretty';

const documentDesc = Object.getOwnPropertyDescriptor(global, 'document') as PropertyDescriptor;

beforeEach(() => {
  jest.resetModules();
  Object.defineProperty(global, 'document', { configurable: true, value: undefined });
});

afterEach(() => {
  Object.defineProperty(global, 'document', documentDesc);
});

it('should render to string', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('../');

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
  const { css, Styled } = await import('../');

  const A: VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled scope={'foo'} className={className}>
        {css`
          color: red;
        `}
        <div className={'a'}></div>
      </Styled>
    );
  };

  const B: VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled scope={'bar'} className={className}>
        {css`
          color: green;
        `}
        <A className={'b'} />
      </Styled>
    );
  };

  const C: VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled scope={'baz'} className={className}>
        {css`
          color: blue;
        `}
        <B className={'c'} />
      </Styled>
    );
  };

  expect(pretty(ReactDOMServer.renderToString(<C className={'render'} />))).toMatchInlineSnapshot(`
    "<style data-rcij=\\"baz/cilhif\\">
      .baz--rcij-cilhif {
        color: blue;
      }
    </style>
    <style data-rcij=\\"bar/1dmttsw\\">
      .bar--rcij-1dmttsw {
        color: green;
        color: blue;
      }
    </style>
    <style data-rcij=\\"foo/ezbhyn\\">
      .foo--rcij-ezbhyn {
        color: red;
        color: green;
        color: blue;
      }
    </style>
    <div class=\\"a b c render foo--rcij-ezbhyn\\"></div>"
  `);
});

it('should includes styles when directly nested', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('../');

  const AStyled = ({ className, children }: { className?: string; children?: ReactNode }) => {
    return (
      <Styled scope={'a'} className={className}>
        {css`
          color: blue;
        `}
        {children}
      </Styled>
    );
  };

  const BStyled = ({ className, children }: { className?: string; children?: ReactNode }) => {
    return (
      <Styled scope={'b'} className={className}>
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
            <Styled scope={'c'}>
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
    "<style data-rcij=\\"a/cilhif\\">
      .a--rcij-cilhif {
        color: blue;
      }
    </style>
    <style data-rcij=\\"b/1dmttsw\\">
      .b--rcij-1dmttsw {
        color: green;
        color: blue;
      }
    </style>
    <style data-rcij=\\"c/ezbhyn\\">
      .c--rcij-ezbhyn {
        color: red;
        color: green;
        color: blue;
      }
    </style>
    <div class=\\"c--rcij-ezbhyn\\"></div>"
  `);
});

it('should use each tagged template as a wrapper for subsequent elements', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Styled } = await import('../');

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
