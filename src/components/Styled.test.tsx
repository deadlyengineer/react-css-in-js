import React from 'react';
import ReactDOM from 'react-dom/server';
import { css } from '../css';
import { Styled } from './Styled';

it('should render to string', () => {
  expect(
    ReactDOM.renderToString(
      <Styled
        className={'foo'}
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
