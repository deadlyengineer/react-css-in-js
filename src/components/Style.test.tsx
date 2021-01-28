/* eslint-disable @typescript-eslint/no-var-requires */
import pretty from 'pretty';
import { css } from '../css';

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
  const { Style } = await import('./Style');

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Style
          css={css`
            color: red;
          `}
        />
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"9pvgme\\" data-reactroot=\\"\\">
      :root {
        color: red;
      }
    </style>"
  `);
});
