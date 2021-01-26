import React from 'react';
import ReactDOMServer from 'react-dom/server';
import pretty from 'pretty';
import { Styled } from './Styled';
import { css } from '../css';
import { cx } from '../cx';

jest.mock('../private/_styleManager', () => ({
  _styleManager: null,
}));

it('should render to string', () => {
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

it('should allow for style overrides using Styled wrappers', () => {
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
