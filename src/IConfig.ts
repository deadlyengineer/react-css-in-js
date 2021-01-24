export interface IConfig {
  /**
   * Pretty format CSS strings when set to true.
   */
  pretty: boolean;
  /**
   * Get a unique class name given a style name and a style string.
   */
  getClassName: (name: string, style: string) => string;
}
