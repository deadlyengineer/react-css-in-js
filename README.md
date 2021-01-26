# React CSS-in-JS

[![Version](https://badgen.net/npm/v/react-css-in-js)](https://www.npmjs.com/package/react-css-in-js)
[![Size](https://badgen.net/bundlephobia/minzip/react-css-in-js@latest)](https://bundlephobia.com/result?p=react-css-in-js@latest)
[![Deps](https://badgen.net/bundlephobia/dependency-count/react-css-in-js@latest)](https://bundlephobia.com/result?p=react-css-in-js@latest)
[![TreeShaking](https://badgen.net/bundlephobia/tree-shaking/react-css-in-js@latest)](https://bundlephobia.com/result?p=react-css-in-js@latest)

Minimal React css-in-js styled components.

- Write styles using tagged template strings.
- Style any component that accepts a `className` property.
- Theme with type-safety.
- Small bundle size.
- Zero dependencies.
- Class names are stable and include a user provided prefix to avoid collisions.
- Supports SCSS-like nesting with parent (`&`) selectors.
- Supports _all_ CSS at-rules.
- Supports zero-configuration server-side rendering.

Try it on [codesandbox.io](https://codesandbox.io/s/react-css-in-js-iup6f).

## In comparison to other libraries

Like Emotion's `css` property, but you don't have to use a special JSX pragma or worry about [css property gotchas](https://emotion.sh/docs/css-prop#gotchas).

Like the styled-components pattern, except you have direct control over how component props become HTML element attributes, and you don't have to create multiple components to add integral children. All the patterns you can use with styled components are still there, but now they're visible. Need an `as` prop? Give your component an `as` prop. It's not automatic, _and that's a good thing._

More verbose than Emotion's `css` prop or styled-components, but in return you get less magic, the full flexibility and simplicity of plain React, and a shallower learning curve.

_Less than half the size of both the [styled-components](https://bundlephobia.com/result?p=styled-components) and [@emotion/react](https://bundlephobia.com/result?p=@emotion/react) packages._

## Create a styled component

```tsx
import React from 'react';
import { css, Styled } from 'react-css-in-js';

export const Foo: React.FC<{ className?: string }> = ({ className = '', children }) => {
  return (
    <Styled
      name={'foo'}
      css={css`
        color: red;
      `}
    >
      <div className={className}>{children}</div>
    </Styled>
  );
};
```

**Result**

```html
<div class="foo--rcij-g0zrt6">...</div>
```

The `<Styled>` component will inject a dynamic class name into the child element, merging with any class names the child already has. A `name` property value is required because it reduces the risk of hash collisions. Hashes only have to be unique within the scope of that name, instead of across your whole application. Using [BEM](http://getbem.com) is the recommended convention for naming.

You can also _extend/override_ a styled component's styles by wrapping it with another `<Styled>` component.

```tsx
import React from 'react';
import { cx, css, Styled } from 'react-css-in-js';
import { Foo } from './Foo';

export const Bar: React.FC<{ className: string }> = ({ className, children }) => {
  return (
    <Styled
      name={'bar'}
      css={css`
        &:hover {
          color: orange;
        }
      `}
    >
      <Foo className={cx('bar', className)}>{children}</Foo>
    </Styled>
  );
};
```

_You should ALWAYS use the `cx` utility to combine classes instead of simple string templates or concatenation!_

The `cx` utility joins non-falsy class names, and correctly allows outer styled components to override the styles of inner styled components. Simple string manipulation may not result in the correct precedence of styles injected from a parent `Styled` wrapper.

## Inject a global style

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { css, Style } from 'react-css-in-js';

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

## Create a type-safe theme

```tsx
import { createTheme } from 'react-css-in-js';

export const [useTheme, ThemeProvider, ThemeConsumer] = createTheme({
  color: 'red',
});
```

## Create a reusable styled wrapper

```tsx
import React from 'react';
import { css, Styled, StyledFC } from 'react-css-in-js';

export const FooStyled: StyledFC = ({ className, children }) => {
  return (
    <Styled
      name={'my-style'}
      className={className}
      css={css`
        color: red;
      `}
    >
      {children}
    </Styled>
  );
};
```

Notice that the `Styled` component also accepts a `className` property which is merged with the dynamic class and passed to the child element. This is to support specifically this scenario, when the child element will be injected. When you _can_ pass the class name directly to the child element, that is the recommended pattern.

## Create a style helper

**Helper File (`hover.ts`)**

```tsx
import { css } from 'react-css-in-js';

export const hover = (color: string): string => css`
  &:hover {
    color: ${color};
  }
`;
```

The `css` function is an alias for `String.raw`, which returns a simple string with escape sequences intact. The alias is just shorter, and allows IDE syntax checking/highlighting.

**Component File**

```tsx
import React from 'react';
import { css, Styled } from 'react-css-in-js';
import { hover } from './hover';

export const Foo: React.VFC = () => {
  return (
    <Styled
      name={'foo'}
      css={css`
        color: blue;
        ${hover('red')}
      `}
    >
      <div>Blue by default, and red when hovered.</div>
    </Styled>
  );
};
```

## Advanced configuration

```tsx
import { configure } from 'react-css-in-js';

configure({
  // The injected CSS text will be pretty formatted when this option is true.
  // Defaults to false. This should not be significantly slower to generate,
  // but may result in larger styles which could increase the transfer size
  // when using server side rendering. It will not affect class name hashes.
  pretty: true,

  // A custom style manager can be used to change how styles are injected into
  // the DOM, or to capture styles during server-side rendering if the default
  // SSR inline injection behavior isn't suitable for your application.
  customStyleManager: myCustomStyleManager,

  // A custom hash function can be used for testing, enhanced collision
  // avoidance, etc.
  //
  // The default hash function (https://github.com/darkskyapp/string-hash) is
  // the same one used by Emotion and styled-components.
  customHashFunction: myCustomHashFunction,
});
```

_The `configure()` method MUST be called before rendering!_

It will have no effect if called after rendering, and a warning will be printed to the console.
