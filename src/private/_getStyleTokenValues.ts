export function _getStyleTokenValues(token: readonly string[]): string[] {
  // A selector block opening.
  const chunks = [...token];
  const values: string[] = [];
  let value = '';
  let chunk: string | undefined;

  while (null != (chunk = chunks.shift())) {
    if (chunk === ',') {
      values.push(value);
      value = '';
    } else {
      value += chunk;
    }
  }

  values.push(value);

  return values;
}
