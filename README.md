# React CSS-in-JS

Minimal React css-in-js styled components.

- Component and global styling using CSS tagged template strings.
- SCSS-like ampersand (`&`) parent selectors.
- Supports all CSS at-rules (e.g. `@media`).
- Supports server side rendering with zero configuration.
- Theming with Typescript typed themes.
- Zero dependencies.
- Tiny bundle size.
- Stable class names (configurable).
- Pretty or minimal CSS formatting (configurable).

## Create a styled component

```tsx
import React from 'react';
import { Styled, css } from 'react-css-in-js';

export const MyStyledComponent: React.FC = ({ children }) => {
  return (
    <Styled
      className={'my-styled-component'}
      css={css`
        color: red;
        &:hover {
          color: blue;
        }
      `}
    >
      <div>{children}</div>
    </Styled>
  );
};
```

## Inject a global style

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Style, css } from 'react-css-in-js';

ReactDOM.render(
  <Style
    css={css`
      html,
      body {
        padding: 0;
        margin: 0;
      }
    `}
  />,
  document.getElementById('root')
);
```

## Create a theme

```tsx
import { createTheme } from 'react-css-in-js';

export const [useTheme, ThemeProvider] = createTheme({
  color: 'red',
});
```
