import { isValidElement, Key, ReactElement } from 'react';
import { _metaKey } from './_constants';
import { Css } from '../types/Css';

type CssStyle = {
  _text: string;
  _key: Key | null;
};

function _isCssElement(value: unknown): value is ReactElement<{ [_metaKey]: string }> {
  return typeof value === 'object' && isValidElement(value) && typeof (value as Css).props[_metaKey] === 'string';
}

export function _getCssStyle(value: unknown): CssStyle | undefined {
  return _isCssElement(value) ? { _text: value.props[_metaKey], _key: value.key } : undefined;
}
