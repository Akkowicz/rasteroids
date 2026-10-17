// Run: node --test tests/particles.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const game = require('./helpers/game.cjs');

test('expired particles are removed while surviving effects keep moving', () => {
  const g = game();
  g.run(`
    startGame(); asteroids = [];
    particles = [
      { x: 10, y: 20, vx: 4, vy: -2, life: 1, shade: 150 },
      { x: 30, y: 40, vx: 2, vy: 1, life: .01, shade: 160 },
      { x: 50, y: 60, vx: -4, vy: 2, life: .5, shade: 170 },
      { x: 70, y: 80, vx: 0, vy: 0, life: .05, shade: 180 },
    ];
    update(.05);
  `);
  assert.equal(g.run('particles.length'), 2);
  assert.equal(g.run('particles[0].x'), 10.2);
  assert.equal(g.run('particles[0].y'), 19.9);
  assert.equal(g.run('particles[0].life'), .95);
  assert.equal(g.run('particles[1].x'), 49.8);
  assert.equal(g.run('particles[1].life'), .45);
  g.run('update(1);');
  assert.equal(g.run('particles.length'), 0);
});

test('a minute of thrust keeps particle storage bounded and drains on release', () => {
  const g = game();
  g.run(`
    startGame(); ship.invincible = 10000;
    asteroids = [makeAsteroid(0, 0, 3)];
    asteroids[0].vx = asteroids[0].vy = 0;
    keys.add('ArrowUp');
    let peakParticles = 0;
    for (let i = 0; i < 3600; i++) {
      update(1 / 60);
      peakParticles = Math.max(peakParticles, particles.length);
    }
  `);
  // At 60 updates/second, 2 particles/update, and <.9s lifetime: at most 108.
  assert.ok(g.run('peakParticles') <= 108);
  assert.ok(g.run('particles.length') > 0);
  assert.equal(g.run('particles.every(p => p.life > 0)'), true);
  g.run('keys.clear(); for (let i = 0; i < 120; i++) update(1 / 60);');
  assert.equal(g.run('particles.length'), 0);
});

test('explosions expire, pause freezes effects, and restart clears them', () => {
  const g = game();
  g.run('startGame(); asteroids = []; burst(20, 30, 65);');
  assert.equal(g.run('particles.length'), 65);
  const initial = g.run('JSON.stringify(particles)');
  g.run('togglePause(); update(5);');
  assert.equal(g.run('JSON.stringify(particles)'), initial);
  g.run('togglePause(); update(1);');
  assert.equal(g.run('particles.length'), 0);
  g.run('burst(20, 30, 22); startGame();');
  assert.equal(g.run('particles.length'), 0);
});
