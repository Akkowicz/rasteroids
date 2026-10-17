const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

module.exports = function game() {
  const windowEvents = {}, documentEvents = {};
  const document = {
    hidden: false,
    createElement(name) {
      assert.equal(name, 'canvas');
      return {
        width: 0, height: 0,
        getContext: () => ({
          fillRect() {},
          createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
          putImageData() {},
        }),
      };
    },
    addEventListener(name, handler) { documentEvents[name] = handler; },
    getElementById: () => ({
      width: 480, height: 300, getContext: () => ({}),
      setAttribute() {}, focus() {}, addEventListener() {},
    }),
  };
  const context = vm.createContext({
    document,
    window: { addEventListener(name, handler) { windowEvents[name] = handler; } },
    HTMLButtonElement: class {}, performance: { now: () => 0 },
    requestAnimationFrame() {},
  });
  const html = readFileSync(require.resolve('../../index.html'), 'utf8');
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  return {
    run: code => vm.runInContext(code, context),
    key: code => windowEvents.keydown({ code, preventDefault() {} }),
    blur: () => windowEvents.blur?.(),
    visibility(hidden) { document.hidden = hidden; documentEvents.visibilitychange?.(); },
  };
};
