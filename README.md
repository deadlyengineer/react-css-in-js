# React CSS-in-JS

[![stars](https://badgen.net/github/stars/ChrisAckerman/react-css-in-js?color=black)](https://github.com/ChrisAckerman/react-css-in-js)
[![npm](https://badgen.net/npm/v/react-css-in-js?color=red)](https://www.npmjs.com/package/react-css-in-js)
[![license](https://badgen.net/npm/license/react-css-in-js?color=red)](https://opensource.org/licenses/ISC)
[![downloads](https://badgen.net/npm/types/react-css-in-js?color=red)](https://www.npmjs.com/package/react-css-in-js)
[![downloads](https://badgen.net/npm/dw/react-css-in-js?color=red)](https://www.npmjs.com/package/react-css-in-js)
[![license](https://badgen.net/bundlephobia/minzip/react-css-in-js?color=blue)](https://bundlephobia.com/result?p=react-css-in-js)

Minimal React css-in-js for any component which accepts a `className` property, using tagged templates, and no special compilation steps.

- [Homepage](https://react-css-in-js.com)
- [Sandbox](https://codesandbox.io/s/react-css-in-js-iup6f)


## Getting Started

```tsx
import { css, Styled } from 'react-css-in-js';

const color = 'white';

render(
  <Styled>
    {css`
      color: black;
      background-color: hotpink;
      &:hover {
        color: ${color};
      }
    `}
    <div>Hover to change color.</div>
  </Styled>
);
```

## Re-styling
  
Any component that accepts a class name can be re-styled. So, to make your pre-styled component support _re-styling_, give it a `className` property, and pass the property value to the `<Styled>` component (**not** to a Styled component child).

<details>

<summary><em>Why should I pass the <code>className</code> to the Styled component?</em></summary>

<small>The inner Styled component will give higher precedence to a dynamic class injected by an outer Styled component, which allows outer styles to override inner styles. The injected class should also not be stringified or concatenated with other classes, because that would remove the Styled metadata from the class. If the injected class is just a plain string, it will be added to all Styled child components as-is.</small>

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

Global styling is similar to styling components, except you use the `<Style>` component (instead of `<Styled>`), and it should only have tagged template children (no component children).

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

_The `configure()` method MUST be called before rendering!_

It will have no effect if called after rendering, and a warning will be printed to the console.

## Feature Highlights

- Supports all CSS at-rules (eg. `@import`, `@font-face`, `@keyframes`, etc.)
- Supports SCSS-like rule nesting with parent selector references (`&`)
- Supports class name hash and style injection customization (See the [configure](https://react-css-in-js.com#configure) function).
- Styles are de-duplicated (cached) when used repeatedly.
- Styles are removed (GC-ed) when unused.
- Class names are stable (deterministic) to support SSR and testing.
- SSR (server-side rendering) is supported with zero-configuration.
- No extra compilation is required, so it works in all tool-chains.
- There are zero runtime dependencies.
- The bundle size is very small.

### In comparison to other libraries

Like [@emotion/react](https://www.npmjs.com/package/@emotion/react), but you don't have to use a special JSX pragma or worry about [css property gotchas](https://emotion.sh/docs/css-prop#gotchas).

Like [styled-components](https://styled-components.com) or [@emotion/styled](https://www.npmjs.com/package/@emotion/styled), except you have direct control over how component props become HTML element attributes, SSR works without any configuration, and you don't have to create multiple components to add integral children. All the patterns you can use with styled components are still there, but now they're visible. Need an `as` prop? Give your component an `as` prop. It's not automatic, _and that's a good thing._

Like [styled-jsx](https://www.npmjs.com/package/styled-jsx), but you don't need a babel plugin or the `<style jsx>` wrapper around the style. Also, the style more intuitively _precedes_ the styled component it applies to.

_Slightly_ more verbose than Emotion's `css` prop or styled-components, but in return you get less magic, the full flexibility and simplicity of plain React, and a shallower learning curve.

It can be used with any tech stack, because no babel plugins or compilation are required. It can be used in component libraries, because it's small, has no dependencies, and requires no setup.

_Less than half the size of both the [styled-components](https://bundlephobia.com/result?p=styled-components) and [@emotion/react](https://bundlephobia.com/result?p=@emotion/react) packages._

<style>
  summary {
    cursor: pointer;
  }
</style>