# React CSS-in-JS

[![gh-stars](https://badgen.net/github/stars/Shakeskeyboarde/react-css-in-js?color=black)](https://github.com/Shakeskeyboarde/react-css-in-js)
[![npm-version](https://badgen.net/npm/v/react-css-in-js?color=red)](https://www.npmjs.com/package/react-css-in-js)
[![npm-license](https://badgen.net/npm/license/react-css-in-js?color=red)](https://opensource.org/licenses/ISC)
[![npm-types](https://badgen.net/npm/types/react-css-in-js?color=red)](https://www.npmjs.com/package/react-css-in-js)
[![npm-downloads](https://badgen.net/npm/dw/react-css-in-js?color=red)](https://www.npmjs.com/package/react-css-in-js)
[![bf-size](https://badgen.net/bundlephobia/minzip/react-css-in-js@latest?color=blue)](https://bundlephobia.com/result?p=react-css-in-js@latest)
[![bf-deps](https://badgen.net/bundlephobia/dependency-count/react-css-in-js@latest?color=blue)](https://bundlephobia.com/result?p=react-css-in-js@latest)

<big>A library designed for styling React components with tagged template strings. It provides a great developer experience in addition to having a tiny footprint, supporting all CSS features, and requiring zero configuration. It can even be used in component libraries.</big>

### Links

- <a href="https://react-css-in-js.com">Homepage</a>
- <a href="https://github.com/Shakeskeyboarde/react-css-in-js" target="_blank">GitHub</a> - _Please star if you find this project interesting!_
- <a href="https://www.npmjs.com/package/react-css-in-js" target="_blank">NPM</a>
- <a href="https://codesandbox.io/s/react-css-in-js-iup6f" target="_blank">Sandbox</a>

## Getting Started

A `Styled` wrapper creates a "styling context" where you compose `css` tagged template style strings and the components which are styled. This keeps component styles directly adjacent to the components being styled, while still giving you complete control over your React component markup.

```tsx
import { css, Styled } from 'react-css-in-js';

const color = 'white';

render(
  <Styled>
    {css`
      padding: 32px;
      color: black;
      background-color: hotpink;
      font-size: 24px;
      border-radius: 4px;
      &:hover {
        color: ${color};
      }
    `}
    <div>Hover to change color.</div>
  </Styled>
);
```

## Re-styling
  
Any component that accepts a class name can be styled. So, to make your pre-styled component support _re-styling_, give it a `className` property and pass that property value through to the internal `Styled` component.

**IMPORTANT:** When a pre-styled component accepts a class name, _do not concatenate, stringify, or otherwise modify the class name string!_ The class name injected by a `Styled` component is actually a boxed string with style metadata attached. This metadata allows child `Styled` components to give the outer styles a higher precedence. If the boxed class name string is un-boxed, it will lose its metadata and style overriding may not work as expected.

```tsx
interface IMyComponentProps {
  className?: string;
}

function MyComponent(props: IMyComponentProps): ReactElement {
  return (
    <Styled className={props.className}>
      {css`
        color: red;
      `}
      <div className={'my-component'}>Hello, world!</div>
    </Styled>
  );
}
```

Now your custom component can be (re-)styled just like any plain HTML (eg. `<div>`) element.

```tsx
<Styled>
  {css`
    color: blue;
  `}
  <MyComponent />
</Styled>
```

This works even when adding other class names.

```tsx
<Styled>
  {css`
    color: blue;
  `}
  <MyComponent className={'other class names'} />
</Styled>
```

## Global Styles

Global styling is similar to styling components, except you use the `Style` component (instead of `Styled`), and it should only have tagged template children (no component children).

```tsx
import { css, Style } from 'react-css-in-js';

render(
  <Style>
    {css`
      html, body {
        padding: 0;
        margin: 0;
      }
    `}
  </Style>
);
```

## Advanced Configuration

This library is designed to require zero-configuration. Class names are stable and have a very high probability of uniqueness, and server-side rendering works out of the box. But, there are always cases where the defaults need a little modification.

```tsx
import {
  configure,
  defaultCssPrinter,
  defaultStyleManager,
  defaultHashFunction
} from 'react-css-in-js';

configure({
  // A custom CSS printer can be used to change how CSS rules are
  // formatted. You could use it to minify or add auto-prefixing.
  customCssPrinter: defaultCssPrinter,

  // A custom style manager can be used to change how styles are
  // injected into the DOM, or to capture styles during server-side
  // rendering if the default SSR inline injection behavior isn't
  // suitable for your application.
  //
  // By default, no (undefined) style manager is used during SSR,
  // which causes style elements to be injected inline, adjacent to
  // the element being styled. These inlined styles will be moved to
  // the document head on the client side, prior to React
  // rehydration.
  customStyleManager: defaultStyleManager,

  // A custom hash function can be used for testing, enhanced
  // collision avoidance, etc.
  //
  // The default hash function is the same one used by Emotion and
  // styled-components: https://github.com/darkskyapp/string-hash
  customHashFunction: defaultHashFunction,
});
```

_Configuration must be done before rendering!_

It will have no effect if done after rendering, and a warning will be printed to the console.

## Feature Highlights

- Supports nested selectors with SCSS-like parent references (`&`)
- Supports all CSS at-rules (eg. `@media`, `@font-face`, `@keyframes`, etc.)
- Supports class name hash and style injection customization (See the [configure](https://react-css-in-js.com#configure) function).
- Styles are injected on first render and de-duplicated (cached) when used repeatedly.
- Styles are removed (GC-ed) when unused.
- Class names are stable (deterministic) to support SSR and testing.
- SSR (server-side rendering) "just works" with zero-configuration.
- Works with concurrent mode.
- No extra compilation is required, so it works anywhere.
- No runtime dependencies.
- Tiny bundle size.

### In comparison to other libraries

Like [@emotion/react](https://www.npmjs.com/package/@emotion/react), but you don't have to use a special JSX pragma or worry about [css property gotchas](https://emotion.sh/docs/css-prop#gotchas).

Like [styled-components](https://styled-components.com) or [@emotion/styled](https://www.npmjs.com/package/@emotion/styled), except you still control the React markup, SSR works without any configuration, and you don't have to create multiple components to have styled component children.

Like [styled-jsx](https://www.npmjs.com/package/styled-jsx), but you don't need a babel plugin, styles precede styled components, and you can style more than one component at a time.

It can be used in component libraries, because it's small, has no dependencies, and requires no setup.
