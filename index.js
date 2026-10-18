/**
 * Host half of the nav-back-forward bundle.
 *
 * The plugin is pure browser UI: it tracks the session selected in the main
 * view and reopens earlier sessions from two top-left controls. The Host
 * process has nothing to install, but this entry exists so the Client module
 * registry discovers the browser bundle from an active Loader row.
 */
export function apply() {}
