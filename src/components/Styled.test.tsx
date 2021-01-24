import React from 'react';
import ReactDOM from 'react-dom/server';
import { Styled } from './Styled';
import { css } from '../css';
import { cx } from '../cx';

it('should render to string', () => {
  expect(
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
  ).toMatchInlineSnapshot(
    `"<style>.foo--rcijs-18pidyi{color: red;}</style><div class=\\"foo--rcijs-18pidyi\\"></div>"`
  );
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

  expect(ReactDOM.renderToString(<C className={'render'} />)).toMatchInlineSnapshot(
    `"<style>.baz--rcijs-mmkps7{color: blue;}</style><style>.bar--rcijs-3e3m74{color: green;color: blue;}</style><style>.foo--rcijs-k8ih2n{color: red;color: green;color: blue;}</style><div class=\\"a b c render foo--rcijs-k8ih2n\\"></div>"`
  );
});
