import React from 'react';
import ReactDOM from 'react-dom/server';
import pretty from 'pretty';
import { Styled } from './Styled';
import { css } from '../css';
import { cx } from '../cx';

jest.mock('../private/_getCache', () => ({
  _getCache: jest.fn().mockReturnValue({ manager: null, refCounts: new Map() }),
}));

it('should render to string', () => {
  expect(
    pretty(
      ReactDOM.renderToString(
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
    "<style data-rcij=\\"foo/shgm5m\\">
      .foo--rcij-shgm5m {
        color: red;
      }
    </style>
    <div class=\\"foo--rcij-shgm5m\\"></div>"
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

  expect(pretty(ReactDOM.renderToString(<C className={'render'} />))).toMatchInlineSnapshot(`
    "<style data-rcij=\\"baz/mmkps7\\">
      .baz--rcij-mmkps7 {
        color: blue;
      }
    </style>
    <style data-rcij=\\"bar/3e3m74\\">
      .bar--rcij-3e3m74 {
        color: green;
        color: blue;
      }
    </style>
    <style data-rcij=\\"foo/k8ih2n\\">
      .foo--rcij-k8ih2n {
        color: red;
        color: green;
        color: blue;
      }
    </style>
    <div class=\\"a b c render foo--rcij-k8ih2n\\"></div>"
  `);
});
