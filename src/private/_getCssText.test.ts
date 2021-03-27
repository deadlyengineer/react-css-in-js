import { _getCssText } from './_getCssText';
import { _getTokens } from './_getTokens';

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
      _getTokens(`
        .foo,
        .bar {
          color: red;
        }
      `)
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
      _getTokens(`
        .foo {
          color: blue`)
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
      _getTokens(`
        color: white;
        .foo {
          color: red;
          .bar {
            color: blue;
          }
          color: green;
        }
        color: black;
      `)
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
      _getTokens(`
        .foo {
          .bar & {
            color: red;
            &:hover {
              color: blue;
            }
          }
        }
      `)
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
      _getTokens(`
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
      `)
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

it('should correctly handle nested at-rules', () => {
  expect(
    _getCssText(
      _getTokens(`
        @charset "utf-8";
        @import url('foo');
        @media screen {
          @charset "utf-8";
          @import url('bar');
          @media screen {
            color: blue;
          }
          .foo {
            color: green;
            @import url('baz');
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
      `)
    )
  ).toMatchInlineSnapshot(`
    "@import url('foo');
    @import url('bar');
    @import url('baz');

    @media screen {
      @media screen {
        :root {
          color: blue;
        }
      }
      .foo {
        color: green;
      }
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
      _getTokens(`
        @media screen {
          .foo {
            color: red;
          }
        }
      `)
    )
  ).toMatchInlineSnapshot(`"@media screen{.foo{color:red;}}"`);
});

it('should merge comma separated selectors', () => {
  expect(
    _getCssText(
      _getTokens(`
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
      `)
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
