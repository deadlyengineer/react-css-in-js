/* eslint-disable @typescript-eslint/no-var-requires */
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
  const { css, Style } = await import('../');

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Style>
          {css`
            color: red;
          `}
          <div />
        </Style>
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"g0zrt6\\">
      :root {
        color: red;
      }
    </style>"
  `);
});

it('should render multiple styles if multiple style tagged templates are used', async () => {
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { css, Style } = await import('../');

  expect(
    pretty(
      ReactDOMServer.renderToString(
        <Style>
          {css`
            color: red;
          `}
          {css`
            color: blue;
          `}
        </Style>
      )
    )
  ).toMatchInlineSnapshot(`
    "<style data-rcij=\\"g0zrt6\\">
      :root {
        color: red;
      }
    </style>
    <style data-rcij=\\"cilhif\\">
      :root {
        color: blue;
      }
    </style>"
  `);
});
