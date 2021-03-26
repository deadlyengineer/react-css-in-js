/* eslint-disable no-undef */
beforeEach(() => {
  Object.keys(window).forEach((key) => {
    if (key.startsWith('__RCIJ_')) {
      delete window[key];
    }
  });

  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 0));
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((handle) => clearTimeout(handle));
});
