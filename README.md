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

There are **five intentional defects** in the baseline. Instructors can search `index.html` for `LESSON` to find their locations; learners can start with just the issue descriptions.

| Tag | Intentional problem | Suggested verification |
| --- | --- | --- |
| [`BUG-RESTART` · #1](https://github.com/Akkowicz/rasteroids/issues/1) | Restart and retry keep the previous score. | Score a hit, restart, check for zero. |
| [`BUG-PAUSE` · #2](https://github.com/Akkowicz/rasteroids/issues/2) | Bullets keep moving and expire while paused. | Fire, pause immediately, wait, resume. |
| [`BUG-FOCUS` · #3](https://github.com/Akkowicz/rasteroids/issues/3) | Losing window focus does not release held controls. | Hold thrust, switch windows, release, return. |
| [`PERF-BACKGROUND` · #4](https://github.com/Akkowicz/rasteroids/issues/4) | Every frame allocates and sorts 48,000 stars and processes the full framebuffer. | Record a browser Performance profile; compare before/after on the same hardware. |
| [`PERF-PARTICLES` · #5](https://github.com/Akkowicz/rasteroids/issues/5) | Expired particles accumulate and are revisited forever. | Hold thrust for a minute; inspect `particles.length` in DevTools, then release and wait. |

Performance varies by browser and machine. The starfield and grain perform real redundant work rather than adding an artificial delay. The FPS readout is measured. The particle leak grows with play; reloading clears it.

Feature requests cover [selectable colors (#6)](https://github.com/Akkowicz/rasteroids/issues/6), [sound (#7)](https://github.com/Akkowicz/rasteroids/issues/7), and [saving high scores (#8)](https://github.com/Akkowicz/rasteroids/issues/8). Those features are deliberately absent. The interface adapts to small screens, but the game currently requires a keyboard.

## Source map

All styling, markup, rendering, input, and game logic live in `index.html`. Functions such as `startGame`, `togglePause`, `update`, and `draw` use plain JavaScript. The `assets/icon.svg` file belongs to the original repository scaffold; the game itself is self-contained.

Created in [T3 Code](https://t3.codes).
