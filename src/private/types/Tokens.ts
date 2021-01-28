export type TerminatorToken = ';' | '{' | '}';
export type Token = TerminatorToken | readonly string[];
export type Tokens = readonly Token[];
