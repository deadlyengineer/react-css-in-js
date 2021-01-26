import React from 'react';
import ReactDOM from 'react-dom/server';
import pretty from 'pretty';
import { Style } from './Style';
import { css } from '../css';

jest.mock('../private/_styleManager', () => ({
  _styleManager: null,
}));

it('should render to string', () => {
  expect(
    pretty(
      ReactDOM.renderToString(
        <Style
          css={css`
            color: red;
          `}
        />
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"g0zrt6\\" data-reactroot=\\"\\">
      :root {
        color: red;
      }
    </style>"
  `);
});
