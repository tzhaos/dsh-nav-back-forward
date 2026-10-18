# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.2] - 2026-10-19

### Changed

- Use 14px titlebar buttons to fit the pair plus the rail-owned toggle before the native menu bar's
  48px leading area; vertically center the row on the menu height.

### Verified

- `node scripts/check.mjs`: 11 checks green.

## [1.3.1] - 2026-10-19

### Changed

- Shrink the titlebar Back/Forward buttons to 18px so the pair fits left of the rail-owned sidebar
  toggle without overlapping it.

### Verified

- `node scripts/check.mjs`: 11 checks green.

## [1.3.0] - 2026-10-19

### Changed

- Move the compact Back/Forward pair into the window titlebar (`top: 8px`), directly left of the
  sidebar toggle and the App/Edit menu row, instead of the content area below the titlebar.

### Verified

- `node scripts/check.mjs`: 11 checks green.

## [1.2.0] - 2026-10-19

### Changed

- Position the Back/Forward row from the sidebar toggle's actual box on mount, resize and mutations,
  so it shares that control's row instead of drifting when the layout changes.
- Remove the floating pill background/border from the navigation cluster.

### Verified

- `node scripts/check.mjs`: 11 checks green.

## [1.1.1] - 2026-10-19

### Changed

- Align Back/Forward with the content top row (`--dsh-frame-top-clearance + 6px`), directly beside
  the sidebar toggle instead of floating over the titlebar.

### Verified

- `node scripts/check.mjs`: 11 checks green.

## [1.1.0] - 2026-10-19

### Changed

- Pinned the Back/Forward controls to the window's top-left corner (`4px`/`4px`), immediately left
  of the sidebar expand/collapse control, instead of sitting below the titlebar clearance.

### Verified

- `node scripts/check.mjs`: 11 checks green.

## [1.0.0] - 2026-10-19

### Added

- Top-left Back/Forward controls for Session navigation.
- Local history with forward-branch truncation and failed-open rollback.
- `Alt+Left` / `Alt+Right` shortcuts.

### Verified

- `node scripts/check.mjs`: 11 checks green.
