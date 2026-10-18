# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
