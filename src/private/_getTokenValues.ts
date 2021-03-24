export function _getTokenValues(token: readonly string[]): string[] {
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
