// Run: node --test tests/focus.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function game() {
  const windowEvents = {}, documentEvents = {};
  const document = {
    hidden: false,
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
  const html = readFileSync(require.resolve('../index.html'), 'utf8');
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  return {
    run: code => vm.runInContext(code, context),
    key: code => windowEvents.keydown({ code, preventDefault() {} }),
    blur: () => windowEvents.blur?.(),
    visibility(hidden) { document.hidden = hidden; documentEvents.visibilitychange?.(); },
  };
}

for (const [name, loseFocus, returnFocus] of [
  ['window blur', g => g.blur(), () => {}],
  ['hidden document', g => g.visibility(true), g => g.visibility(false)],
]) {
  test(`${name} releases movement and fire without keyup; fresh input works`, () => {
    const g = game();
    g.run('startGame(); asteroids = [];');
    for (const code of ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyD', 'Space']) g.key(code);
    assert.equal(g.run('keys.size'), 7);
    loseFocus(g);
    assert.equal(g.run('keys.size'), 0);
    returnFocus(g);
    const angle = g.run('ship.angle');
    g.run('update(.05);');
    assert.equal(g.run('ship.angle'), angle);
    assert.equal(g.run('Math.hypot(ship.vx, ship.vy)'), 0);
    assert.equal(g.run('particles.length'), 0);
    assert.equal(g.run('bullets.length'), 0);
    g.key('ArrowUp'); g.key('ArrowLeft'); g.key('Space');
    g.run('update(.05);');
    assert.notEqual(g.run('ship.angle'), angle);
    assert.ok(g.run('Math.hypot(ship.vx, ship.vy)') > 0);
    assert.ok(g.run('particles.length') > 0);
    assert.equal(g.run('bullets.length'), 1);
  });
}

test('visible-document notification preserves active input', () => {
  const g = game();
  g.key('ArrowUp');
  g.visibility(false);
  assert.equal(g.run("keys.has('ArrowUp')"), true);
});

test('blur preserves normal ship inertia', () => {
  const g = game();
  g.run('startGame(); asteroids = []; ship.vx = 30;');
  g.key('ArrowUp'); g.blur();
  g.run('update(.05);');
  assert.ok(g.run('ship.vx') > 0);
  assert.equal(g.run('ship.vy'), 0);
});
