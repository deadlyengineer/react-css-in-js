const { _metaKey } = require('./src/private/_constants');
const { _getConfig } = require('./src/private/_getConfig');
const { _getStyleRefCounter } = require('./src/private/_getStyleRefCounter');

/* eslint-disable no-undef */
beforeEach(() => {
  // Reset the library global state.
  _getConfig._locked = false;
  _getStyleRefCounter._instance = undefined;
  if (window[_metaKey]) {
    window[_metaKey].s.clear();
    window[_metaKey].c = {};
  }

  // Mock browser animation functions.
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 0));
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((handle) => clearTimeout(handle));

  // Reset JSDOM.
  document.head.innerHTML = '';
  document.body.innerHTML = '<div id="root" />';
});
