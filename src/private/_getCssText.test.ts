import { css } from '../css';
import { _getCssText } from './_getCssText';
import { _getStyleTokens } from './_getStyleTokens';

const initialConfig = { ...jest.requireActual('./_getConfig')._getConfig(), pretty: true };
let config = { ...initialConfig };

jest.mock('./_getConfig', () => ({
  _getConfig: jest.fn().mockImplementation(() => config),
}));

afterEach(() => {
  config = { ...initialConfig };
});

it('should render simple css', () => {
  expect(
    _getCssText(
      _getStyleTokens(css`
        .foo,
        .bar {
          color: red;
        }
      `)[0]
    )
  ).toMatchInlineSnapshot(`
    ".foo,
    .bar {
      color: red;
    }
    "
  `);
});

it('should include un-terminated rules', () => {
  expect(
    _getCssText(
      _getStyleTokens(`
        .foo {
          color: blue`)[0]
    )
  ).toMatchInlineSnapshot(`
    ".foo {
      color: blue;
    }
    "
  `);
});

it('should render nested css', () => {
  expect(
    _getCssText(
      _getStyleTokens(css`
        color: white;
        .foo {
          color: red;
          .bar {
            color: blue;
          }
          color: green;
        }
        color: black;
      `)[0]
    )
  ).toMatchInlineSnapshot(`
    ":root {
      color: white;
    }
    .foo {
      color: red;
    }
    .foo .bar {
      color: blue;
    }
    .foo {
      color: green;
    }
    :root {
      color: black;
    }
    "
  `);
});

it('should replace & placeholders', () => {
  expect(
    _getCssText(
      _getStyleTokens(css`
        .foo {
          .bar & {
            color: red;
            &:hover {
              color: blue;
            }
          }
        }
      `)[0]
    )
  ).toMatchInlineSnapshot(`
    ".bar .foo {
      color: red;
    }
    .bar .foo:hover {
      color: blue;
    }
    "
  `);
});

it('should hoist at-rules', () => {
  expect(
    _getCssText(
      _getStyleTokens(css`
        .foo {
          color: red;
          @media screen {
            color: orange;
            .bar {
              color: yellow;
            }
            color: lime;
          }
          color: green;
        }
      `)[0]
    )
  ).toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    @media screen {
      .foo {
        color: orange;
      }
      .foo .bar {
        color: yellow;
      }
      .foo {
        color: lime;
      }
    }
    .foo {
      color: green;
    }
    "
  `);
});

it('should nest at-rules', () => {
  expect(
    _getCssText(
      _getStyleTokens(css`
        @import url('foo');
        @media screen {
          @import url('foo');
          @media screen {
            color: blue;
          }
          .foo {
            color: green;
            @import url('bar');
            @media screen {
              color: teal;
            }
            color: purple;
          }
        }
        @keyframes foo {
          from {
            color: black;
          }
          to {
            color: white;
          }
        }
      `)[0]
    )
  ).toMatchInlineSnapshot(`
    "@import url('foo');
    @media screen {
      @import url('foo');
      @media screen {
        :root {
          color: blue;
        }
      }
      .foo {
        color: green;
      }
      @import url('bar');
      @media screen {
        .foo {
          color: teal;
        }
      }
      .foo {
        color: purple;
      }
    }
    @keyframes foo {
      from {
        color: black;
      }
      to {
        color: white;
      }
    }
    "
  `);
});

it('should print a single line if "pretty" option is unset', () => {
  config.pretty = false;

  expect(
    _getCssText(
      _getStyleTokens(css`
        @media screen {
          .foo {
            color: red;
          }
        }
      `)[0]
    )
  ).toMatchInlineSnapshot(`"@media screen{.foo{color:red;}}"`);
});

it('should merge comma separated selectors', () => {
  expect(
    _getCssText(
      _getStyleTokens(css`
        .foo,
        .bar {
          .baz {
            color: red;
          }
        }
        .zip {
          .zot,
          .zow {
            color: blue;
          }
        }
      `)[0]
    )
  ).toMatchInlineSnapshot(`
    ".foo .baz,
    .bar .baz {
      color: red;
    }
    .zip .zot,
    .zip .zow {
      color: blue;
    }
    "
  `);
});
