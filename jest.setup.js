/* eslint-disable no-undef */
beforeEach(() => {
  Object.keys(window).forEach((key) => {
    if (key.startsWith('__RCIJ_')) {
      delete window[key];
    }
  });
});
