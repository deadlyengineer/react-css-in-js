export function _getJoinedSelectors(children: string[], parents?: string[]): string[] {
  if (!parents?.length) {
    return children;
  }

  return children.reduce<string[]>(
    (acc, child) => [
      ...acc,
      ...parents.map((parent) =>
        /&/.test(child) ? child.replace(/&/g, parent) : parent === ':root' ? child : parent + ' ' + child
      ),
    ],
    []
  );
}
