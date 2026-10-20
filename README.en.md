# dsh-nav-back-forward

[简体中文](README.md) | English

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web client plugin that adds
**Back / Forward** controls at the top-right of the sidebar column, inside the Windows caption row,
for navigating between recently opened conversations.

## Why

The main view shows one Session at a time. After switching conversations in the sidebar, returning to
the previous one means finding it again. This plugin records the session-switch history and exposes
browser-style back/forward controls.

## Behaviour

- Windows desktop: pinned in the caption row at the sidebar column's top-right, on the sidebar toggle's
  28px axis and at the same 28×28 size
- browser and macOS: keep the original window top-left seat
- hidden together with the column when the sidebar is collapsed
- records the main view's Session history
- Back reopens the previous Session; Forward reopens the next
- buttons disable when there is nowhere to go
- `Alt+Left` / `Alt+Right` keyboard shortcuts
- a new external navigation truncates the forward branch, like a browser
- records only Sessions; right-sidebar tabs, file tabs and scroll positions are not included

## Implementation

The plugin registers in `shell.overlay`:

1. subscribes to `uiSession.current` and appends the current Session id to a local history;
2. Back/Forward moves the history index and calls `uiWorkspace.openSession(id)`;
3. a new external navigation truncates the old forward branch;
4. a failed open restores the previous index.

Buttons use theme tokens and sit at the window top-left corner without the titlebar clearance offset.

## Install

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-nav-back-forward")
```

Or install the whole monorepo:

```powershell
git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
cd dsh-plugins
node scripts/install-all.mjs
```

Fully quit and relaunch DSH after installing.

## Known limitations

- Session switches only; right-sidebar tabs, file tabs and scroll positions are not tracked
- history lives for the current page lifetime only; a refresh restarts from the current Session
- depends on `uiSession.current` and `uiWorkspace.openSession()`
- the top-left position is fixed; titlebar layout changes may need CSS adjustments

## Development and tests

```sh
node scripts/check.mjs
```

The zero-dependency suite covers manifest/patch/locale/icon, history recording, Back/Forward, external
branch truncation, keyboard shortcuts and empty-history hiding — 11 checks.

## License

[MIT](LICENSE)
