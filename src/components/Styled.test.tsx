/* eslint-disable @typescript-eslint/no-var-requires */
import pretty from 'pretty';
import { css } from '../css';
import { cx } from '../cx';
import type { StyledFC } from '../types/StyledFC';

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
  const { Styled } = await import('../');

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Styled
          name={'foo'}
          css={css`
            color: red;
          `}
        >
          <div />
        </Styled>
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"foo/g0zrt6\\">
      .foo--rcij-g0zrt6 {
        color: red;
      }
    </style>
    <div class=\\"foo--rcij-g0zrt6\\"></div>"
  `);
});

it('should allow for style overrides using Styled wrappers', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { Styled } = await import('../');

  const A: React.VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled
        name={'foo'}
        css={css`
          color: red;
        `}
      >
        <div className={cx('a', className)}></div>
      </Styled>
    );
  };

  const B: React.VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled
        name={'bar'}
        css={css`
          color: green;
        `}
      >
        <A className={cx('b', className)} />
      </Styled>
    );
  };

  const C: React.VFC<{ className?: string }> = ({ className }) => {
    return (
      <Styled
        name={'baz'}
        css={css`
          color: blue;
        `}
      >
        <B className={cx('c', className)} />
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
  const { Styled, cx } = await import('../');

  const AStyled: StyledFC = ({ className, children }) => {
    return (
      <Styled
        name={'a'}
        className={cx('a-styled', className)}
        css={css`
          color: blue;
        `}
      >
        {children}
      </Styled>
    );
  };

  const BStyled: StyledFC = ({ className, children }) => {
    return (
      <Styled
        name={'b'}
        className={cx('b-styled', className)}
        css={css`
          color: green;
        `}
      >
        {children}
      </Styled>
    );
  };

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <AStyled>
          <BStyled>
            <Styled
              name={'c'}
              css={css`
                color: red;
              `}
            >
              <div className={'c-styled'} />
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
    <div class=\\"c-styled b-styled a-styled c--rcij-ezbhyn\\"></div>"
  `);
});
