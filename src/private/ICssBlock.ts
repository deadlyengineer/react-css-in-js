export interface ICssBlock {
  _identifier: string;
  _indent: string;
  _isWritten: boolean;
  _isVirtual: boolean;
  _allowNesting: boolean;
  _selectors?: string[];
}
