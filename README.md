# React CSS-in-JS

[![stars](https://badgen.net/github/stars/ChrisAckerman/react-css-in-js)](https://github.com/ChrisAckerman/react-css-in-js)
[![npm](https://badgen.net/badge/npm/1.2.1/red)](https://www.npmjs.com/package/react-css-in-js)
[![downloads](https://badgen.net/npm/dw/react-css-in-js)](https://www.npmjs.com/package/react-css-in-js)
[![license](https://badgen.net/badge/license/ISC/orange)](https://opensource.org/licenses/ISC)
[![minzip](https://badgen.net/bundlephobia/minzip/react-css-in-js@1.2.1)](https://bundlephobia.com/result?p=react-css-in-js@1.2.1)
[![dependency-count](https://badgen.net/bundlephobia/dependency-count/react-css-in-js@1.2.1)](https://bundlephobia.com/result?p=react-css-in-js@1.2.1)
[![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/react-css-in-js@1.2.1)](https://bundlephobia.com/result?p=react-css-in-js@1.2.1)
[![coverage](https://badgen.net/badge/coverage/94,84,88,93/purple?list=|)](#)

Minimal React css-in-js styled components.

- Write styles using tagged template strings.
- Style any component that accepts a `className` property.
- Style multiple components at once.
- Styles are not duplicated when used repeatedly.
- Styles are removed when unused.
- Theme with type-safety.
- Stable class names.
- Hashes and style element injection can be configured.
- Supports SCSS-like nesting with parent (`&`) selectors.
- Supports _all_ CSS at-rules.
- Supports zero-configuration server-side rendering.
- Small bundle size.
- Zero dependencies.
- No babel plugins or additional compilation required.

Try it on [codesandbox.io](https://codesandbox.io/s/react-css-in-js-iup6f).

## In comparison to other libraries

Like [@emotion/react](https://www.npmjs.com/package/@emotion/react), but you don't have to use a special JSX pragma or worry about [css property gotchas](https://emotion.sh/docs/css-prop#gotchas).

Like [styled-components](https://styled-components.com) or [@emotion/styled](https://www.npmjs.com/package/@emotion/styled), except you have direct control over how component props become HTML element attributes, and you don't have to create multiple components to add integral children. All the patterns you can use with styled components are still there, but now they're visible. Need an `as` prop? Give your component an `as` prop. It's not automatic, _and that's a good thing._

Like [styled-jsx](https://www.npmjs.com/package/styled-jsx), but you don't need a babel plugin or the `<style jsx>` wrapper around the style. Also, the style more intuitively _precedes_ styled component.

_Slightly_ more verbose than Emotion's `css` prop or styled-components, but in return you get less magic, the full flexibility and simplicity of plain React, and a shallower learning curve. Also, ability to style multiple components at once, which can be more efficient than repeating the same styled child multiple times.

It can be used with any tech stack, because no babel plugins or compilation are required. It can be used in component libraries, because it's small, has no dependencies, and requires no setup.

_Less than half the size of both the [styled-components](https://bundlephobia.com/result?p=styled-components) and [@emotion/react](https://bundlephobia.com/result?p=@emotion/react) packages._

## Make something styled

```tsx
import { css, Styled } from 'react-css-in-js';

const color = 'white';

render(
  <Styled scope={'foo'}>
    {css`
      padding: 32px;
      background-color: hotpink;
      font-size: 24px;
      border-radius: 4px;
      &:hover {
        color: ${color};
      }
    `}
    <div className={'bar'}>Hover to change color.</div>
  </Styled>
);
```

The `<Styled>` component's _string_ children are used as styles which apply to any sibling elements which follow. Multiple styles and elements can be used, but only the styles preceding an element will be used to style it. Order matters!

The `scope` property is optional, but using it can help reduce the risk of hash collisions. The value is used to prefix the dynamic class name, which means that hashes only have to be unique within the scope, instead of across your whole application. The scope should be safe to use in a class name.

The `css` tagged-template function is optional. It just returns a string, so any string value will work. But, the function allows IDEs to do syntax checking and highlighting, and it also treats all escape sequences as literal so you don't have to double escape anything.

**Result**

```html
<div class="bar foo--rcij-vgpg57">Hover to change color.</div>
```

A dynamic class name was injected into the child element. The child element already had a class (`bar`), so the dynamic class was appended to it (`bar foo--rcij-vgpg57`).

## Extend a styled component

```tsx
import { cx, css, Styled } from 'react-css-in-js';

export const Foo = ({ className }: { className?: string }) => (
  <Styled>
    {css`
      color: blue;
      text-decoration: underline;
    `}
    <div className={cx('foo', className)}>Lorem ipsum</div>
  </Styled>
);

render(
  <Styled>
    {css`
      text-decoration: line-through;
    `}
    {/* Foo is still blue, but now it's crossed out. */}
    <Foo />
  </Styled>
);
```

The `<Styled>` component can style anything that accepts a `className` property. This includes other styled components as long as they accept a class name!

You should always use the `cx` utility to combine classes (as in `<Foo>` above) instead of simple string templates or concatenation. It maintains the correct style precedence when joining literal class names with a class name injected by a `<Styled>` wrapper.

## Inject a global style

```tsx
import { css, Style } from 'react-css-in-js';

render(
  <Style>{css`
    html,
    body {
      padding: 0;
      margin: 0;
    }
  `}</Style>
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
import { css, Styled, StyledFC } from 'react-css-in-js';

export const FooStyled: StyledFC = ({ className, children }) => (
  <Styled className={className}>
    {css`
      color: red;
    `}
    {children}
  </Styled>
);
```

Notice that the `Styled` component also accepts a `className` property. Its value will be merged with the dynamic class and passed to the child element. This allows for this scenario, where the child element will be injected. If you _can_ pass the class name directly to the child element, that is the recommended pattern.

## Create a style helper

Helper file: `helper.ts`

```tsx
import { css } from 'react-css-in-js';

export const hover = (color: string): string => css`
  /* @scope hover */
  &:hover {
    color: ${color};
  }
`;
```

The `@scope` pragma comment in the above helper allows you to set a default scope for any consumers which do not provide their own scope.

Use the helper's return value inside style tagged-templates.

```tsx
import { hover } from './hover';

render(
  <Styled>
    {css`
      color: blue;
      ${hover('red')}
    `}
    <div>Blue by default, and red when hovered.</div>
  </Styled>
);
```

## Advanced configuration

```tsx
import { configure } from 'react-css-in-js';

configure({
  // The injected CSS text will be pretty formatted when this option
  // is true. Defaults to false. This should not be significantly
  // slower to generate, but may result in larger styles which could
  // increase the transfer size when using server side rendering. It
  // will not affect class name hashes.
  pretty: true,

  // A custom style manager can be used to change how styles are
  // injected into the DOM, or to capture styles during server-side
  // rendering if the default SSR inline injection behavior isn't
  // suitable for your application.
  customStyleManager: myCustomStyleManager,

  // A custom hash function can be used for testing, enhanced
  // collision avoidance, etc.
  //
  // The default hash function is the same one used by Emotion and
  // styled-components ((https://github.com/darkskyapp/string-hash).
  customHashFunction: myCustomHashFunction,
});
```

_The `configure()` method MUST be called before rendering!_

It will have no effect if called after rendering, and a warning will be printed to the console.

## Why no auto-prefixing?

To keep the bundle size small, and to make sure you get exactly the styles you expect.

If you need to prefix and want to avoid repetition, write a helper function.

```tsx
const transform = (value: string): string => css`
  -webkit-transform: ${value};
  -ms-transform: ${value};
  transform: ${value};
`;

render(
  <Styled>
    {css`
      color: red;
      ${transform('rotate(30deg)')}
    `}
    <div>I am red and rotated.</div>
  </Styled>
);
```
