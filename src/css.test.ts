import { css } from './css';
import { _metaKey } from './private/_constants';
import { _getCssText } from './private/_getCssText';
import { _getTokens } from './private/_getTokens';

it('should work with nested css tagged templates', () => {
  expect(
    _getCssText(
      _getTokens(
        css`
          .foo {
            color: red;
            ${css`
              .bar {
                color: blue;
              }
              color: green;
            `}
          }
        `.props[_metaKey]
      )
    )
  ).toMatchInlineSnapshot(`
    ".foo {
      color: red;
    }
    .foo .bar {
      color: blue;
    }
    .foo {
      color: green;
    }
    "
  `);
});
