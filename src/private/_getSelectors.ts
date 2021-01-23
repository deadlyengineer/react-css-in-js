export function _getSelectors(current: string[], inherited: string[] = []): string[] {
  if (inherited.length === 0) {
    return current;
  } else if (current.length === 0) {
    return inherited;
  }

  return current.reduce<string[]>(
    (acc, current0) => [
      ...acc,
      ...inherited.map((inherited0) =>
        /&/.test(current0)
          ? current0.replace(/&/g, inherited0)
          : inherited0 === ':root'
          ? current0
          : `${inherited0} ${current0}`
      ),
    ],
    []
  );
}
