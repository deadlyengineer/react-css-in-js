import { h } from './h';

it('should generate hN tag selectors', () => {
  expect(h(1, 3)).toMatchInlineSnapshot(`"h1, h2, h3"`);
  expect(h(4, 6)).toMatchInlineSnapshot(`"h4, h5, h6"`);
  expect(h(1, 6)).toMatchInlineSnapshot(`"h1, h2, h3, h4, h5, h6"`);
  expect(h(3, 1)).toMatchInlineSnapshot(`"h1, h2, h3"`);
  expect(h(6, 4)).toMatchInlineSnapshot(`"h4, h5, h6"`);
  expect(h(6, 1)).toMatchInlineSnapshot(`"h1, h2, h3, h4, h5, h6"`);
  expect(h(6, 1)).toMatchInlineSnapshot(`"h1, h2, h3, h4, h5, h6"`);
  expect(h(3, 3)).toMatchInlineSnapshot(`"h3"`);
});
