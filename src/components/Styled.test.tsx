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
    "<style data-rcij=\\"foo/vgpg57\\">
      .foo--rcij-vgpg57 {
        padding: 32px;
        background-color: hotpink;
        font-size: 24px;
        border-radius: 4px;
      }

      .foo--rcij-vgpg57:hover {
        color: white;
      }
    </style>
    <div class=\\"foo--rcij-vgpg57\\"></div>"
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
    "<style data-rcij=\\"baz/1bg8z9n\\">
      .baz--rcij-1bg8z9n {
        color: blue;
      }
    </style>
    <style data-rcij=\\"bar/9trfw\\">
      .bar--rcij-9trfw {
        color: green;
        color: blue;
      }
    </style>
    <style data-rcij=\\"foo/ktewn7\\">
      .foo--rcij-ktewn7 {
        color: red;
        color: green;
        color: blue;
      }
    </style>
    <div class=\\"a b c render foo--rcij-ktewn7\\"></div>"
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
    "<style data-rcij=\\"a/1bg8z9n\\">
      .a--rcij-1bg8z9n {
        color: blue;
      }
    </style>
    <style data-rcij=\\"b/9trfw\\">
      .b--rcij-9trfw {
        color: green;
        color: blue;
      }
    </style>
    <style data-rcij=\\"c/ktewn7\\">
      .c--rcij-ktewn7 {
        color: red;
        color: green;
        color: blue;
      }
    </style>
    <div class=\\"c--rcij-ktewn7\\"></div>"
  `);
});
