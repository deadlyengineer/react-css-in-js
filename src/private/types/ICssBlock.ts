export const _AtRuleNone = 0;
export const _AtRuleSimple = 1;
export const _AtRuleNested = 2;
export const _AtRuleConditional = 3;
export interface ICssBlock {
  _prefix: string;
  _suffix: string;
  _indent: string;
  _isWritten: boolean;
  _isVirtual: boolean;
  _atRuleGroupLevel: typeof _AtRuleNone | typeof _AtRuleSimple | typeof _AtRuleNested | typeof _AtRuleConditional;
  _selectors?: string[];
}
