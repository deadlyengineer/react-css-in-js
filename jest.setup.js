const { _getConfig } = require('./src/private/_getConfig');

/* eslint-disable no-undef */
beforeEach(() => {
  _getConfig._locked = false;
  if (window.__RCIJ_STYLE_REFS__) window.__RCIJ_STYLE_REFS__.clear();
  if (window.__RCIJ_CONFIG__) window.__RCIJ_CONFIG__ = {};

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 0));
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((handle) => clearTimeout(handle));
  document.head.innerHTML = '';
  document.body.innerHTML = '<div id="root" />';
});
