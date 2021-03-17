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
  
Any component that accepts a class name can be styled. So, to make your pre-styled component support _re-styling_, give it a `className` property, and pass the property value to the `Styled` component (**not** to a `Styled` component child).

<details>

<summary style="cursor: pointer;"><em>Why should I pass the <code>className</code> to the <code>Styled</code> component?</em></summary>

<small style="display: block; margin-left: 1.5em">The inner `Styled` component will give higher precedence to a dynamic class injected by an outer `Styled` component, which allows outer styles to override inner styles. The injected class should also not be stringified or concatenated with other classes, because that would remove the style metadata from the class. If the injected class is just a plain string, it will be added to all styled child components as-is.</small>

</details>&nbsp;

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
import { configure } from 'react-css-in-js';

configure({
  // The injected CSS text will be pretty formatted when this option
  // is true, or minified if it's false. Defaults to true in the
  // browser, and false otherwise. Pretty formatting should not be
  // significantly slower to generate, but may result in larger
  // styles which could increase the transfer size when using server
  // side rendering. It does not affect class name hashes.
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
  // styled-components: https://github.com/darkskyapp/string-hash
  customHashFunction: myCustomHashFunction,
});
```

_Configuration must be done before rendering!_

It will have no effect if done after rendering, and a warning will be printed to the console.

## Feature Highlights

- Supports nested selectors with SCSS-like parent references (`&`)
- Supports all CSS at-rules (eg. `@media`, `@font-face`, `@keyframes`, etc.)
- Supports class name hash and style injection customization (See the [configure](https://react-css-in-js.com#configure) function).
- Styles are de-duplicated (cached) when used repeatedly.
- Styles are removed (GC-ed) when unused.
- Class names are stable (deterministic) to support SSR and testing.
- SSR (server-side rendering) "just works" with zero-configuration.
- No extra compilation is required, so it works anywhere.
- No runtime dependencies.
- Tiny bundle size.

### In comparison to other libraries

Like [@emotion/react](https://www.npmjs.com/package/@emotion/react), but you don't have to use a special JSX pragma or worry about [css property gotchas](https://emotion.sh/docs/css-prop#gotchas).

Like [styled-components](https://styled-components.com) or [@emotion/styled](https://www.npmjs.com/package/@emotion/styled), except you have direct control over how component props become HTML element attributes, SSR works without any configuration, and you don't have to create multiple components to add integral children. All the patterns you can use with styled components are still there, but now they're visible. Need an `as` prop? Give your component an `as` prop. It's not automatic, _and that's a good thing._

Like [styled-jsx](https://www.npmjs.com/package/styled-jsx), but you don't need a babel plugin or the `<style jsx>` wrapper around the style. Also, the style more intuitively _precedes_ the styled component it applies to.

_Slightly_ more verbose than Emotion's `css` prop or styled-components, but in return you get less magic, the full flexibility and simplicity of plain React, and a shallower learning curve.

It can be used with any tech stack, because no babel plugins or compilation are required. It can be used in component libraries, because it's small, has no dependencies, and requires no setup.

_Less than half the size of both the [styled-components](https://bundlephobia.com/result?p=styled-components) and [@emotion/react](https://bundlephobia.com/result?p=@emotion/react) packages._
