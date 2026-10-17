# Rasteroids

A deliberately imperfect Asteroids clone for learning GitHub and LLM coding agents. One HTML file, a 480 × 300 raster canvas, monochrome pixels, and no dependencies. The game is playable; the bugs and inefficient code are exercises.

## Play

Open `index.html` directly in a modern desktop browser. No install, build, network connection, or server is required. For a local HTTP preview:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. A keyboard is required; touch controls are not implemented.

| Key | Action |
| --- | --- |
| Enter | Start, retry, or resume |
| ← / A and → / D | Rotate |
| ↑ / W | Thrust |
| Space | Fire |
| P | Pause / resume |
| R | Restart |

Shoot large rocks into smaller rocks. Large / medium / small rocks award 20 / 50 / 100 points. Clear a sector to advance; you have three ships and a short invulnerability window after respawning. Best score lasts for the current page session.

## Workshop

Pick an item from the [GitHub issue queue](https://github.com/Akkowicz/rasteroids/issues), reproduce it, and ask a coding agent to help investigate. Work on a branch, make one focused change, explain how you verified it, and open a pull request. Keep the dependency-free, single-page game intact unless an issue explicitly proposes otherwise.

All six original intentional defects have been fixed in the current source. Held controls are released on focus loss, the static background and CRT grain are cached, new runs reset the score, and pausing freezes bullets. Expired particles are removed in place, and bloom uses a reusable quarter-resolution canvas instead of a full-frame JavaScript pixel convolution.

The original defects remain available in Git history for workshop exercises. The particle leak is described in [#5](https://github.com/Akkowicz/rasteroids/issues/5) and [#13](https://github.com/Akkowicz/rasteroids/issues/13); the bloom regression is described in [#16](https://github.com/Akkowicz/rasteroids/issues/16).

To verify the performance fixes, hold thrust for a minute, then release it and wait for the effects to expire: `particles.length` in DevTools should return to zero. Compare browser Performance recordings against a revision containing the original bloom regression to inspect the improvement. Performance varies by browser and machine; the FPS readout is measured.

Feature requests cover [selectable colors (#6)](https://github.com/Akkowicz/rasteroids/issues/6), [sound (#7)](https://github.com/Akkowicz/rasteroids/issues/7), and [saving high scores (#8)](https://github.com/Akkowicz/rasteroids/issues/8). Those features are deliberately absent. The interface adapts to small screens, but the game currently requires a keyboard.

## Tests

Run `node --test tests/*.cjs` with Node.js to verify focus-loss input cleanup, fresh input after returning, preserved inertia, particle expiration, bounded effects during sustained thrust, and pause/restart behavior. Tests execute the game script with a minimal DOM stub and require no dependencies. Also check application and browser-tab switching and the bloom appearance in a desktop browser.

## Source map

All styling, markup, rendering, input, and game logic live in `index.html`. Functions such as `startGame`, `togglePause`, `update`, and `draw` use plain JavaScript. The `assets/icon.svg` file belongs to the original repository scaffold; the game itself is self-contained.

Created in [T3 Code](https://t3.codes).
