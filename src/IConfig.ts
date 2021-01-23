export interface IConfig {
  /**
   * Pretty format CSS strings when set to true.
   */
  pretty: boolean;
  /**
   * Get a unique class name given a base class name and style text.
   */
  getClassName: (className: string, style: string) => string;
}
