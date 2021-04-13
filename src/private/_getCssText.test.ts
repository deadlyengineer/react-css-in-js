import { _getCssText } from './_getCssText';
import { _getTokens } from './_getTokens';

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
        @namespace foo;
        @import url('foo');
        @media screen0 {
          @charset "utf-8";
          @namespace bar;
          @import url('bar');
          @media screen1 {
            color: blue;
          }
          .foo {
            color: green;
            @import url('baz');
            @namespace baz;
            @media screen2 {
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

    @namespace foo;
    @namespace bar;
    @namespace baz;

    @media screen1 {
      :root {
        color: blue;
      }
    }
    @media screen0 {
      .foo {
        color: green;
      }
    }
    @media screen2 {
      .foo {
        color: teal;
      }
    }
    @media screen0 {
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

it('should print other at-rule properties', () => {
  expect(
    _getCssText(
      _getTokens(`
        @foo bar baz;
        @font-feature-values Font {
          @styleset {
            nice-style: 12;
          }
        }
      `)
    )
  ).toMatchInlineSnapshot(`
    "@foo bar baz;

    @font-feature-values Font {
      @styleset {
        nice-style: 12;
      }
    }
    "
  `);
});
