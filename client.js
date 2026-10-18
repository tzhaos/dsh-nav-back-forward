/**
 * Nav Back/Forward — browser half of `dsh-nav-back-forward`.
 *
 * DSH remembers the active Session in `uiSession.current`, but the main view
 * has no Back/Forward affordance. This plugin keeps a local history of Session
 * ids and reopens an earlier/later one through `uiWorkspace.openSession()`.
 *
 * The history is intentionally session-level: right-sidebar tabs, file tabs and
 * scroll positions are not included.
 *
 * @module dsh-nav-back-forward/client
 */

window.__ModuleLoader__.load({
  id: 'dsh-nav-back-forward',
  factory(require) {
    const React = require('react')
    const { useEffect, useState } = React
    const h = React.createElement

    const NS = 'navBackForward'

    const zh = {
      'nav.back': '后退',
      'nav.forward': '前进',
      'nav.backTitle': '后退到上一个会话（Alt+←）',
      'nav.forwardTitle': '前进到下一个会话（Alt+→）',
    }

    const en = {
      'nav.back': 'Back',
      'nav.forward': 'Forward',
      'nav.backTitle': 'Back to the previous conversation (Alt+Left)',
      'nav.forwardTitle': 'Forward to the next conversation (Alt+Right)',
    }

    /** @param {unknown} value - current binding value. @returns {string|undefined} session id. */
    function sessionIdOf(value) {
      if (typeof value === 'string' && value !== '') return value
      if (value !== null && typeof value === 'object') {
        if (typeof value.key === 'string' && value.key !== '') return value.key
        if (typeof value.sessionId === 'string' && value.sessionId !== '') return value.sessionId
      }
      return undefined
    }

    /**
     * Keep an id history for the main-view Session binding.
     * @param {{current: object}} uiSession - session binding service.
     * @param {{openSession: Function}} uiWorkspace - workspace navigation service.
     * @returns {object} history controller.
     */
    function createNavigation(uiSession, uiWorkspace) {
      const listeners = new Set()
      let entries = []
      let index = -1
      let disposed = false

      const snapshot = () => ({
        canBack: index > 0,
        canForward: index >= 0 && index < entries.length - 1,
        entries: entries.slice(),
        index,
      })
      const notify = () => {
        if (disposed) return
        const value = snapshot()
        for (const listener of listeners) listener(value)
      }
      const record = () => {
        if (disposed) return
        const id = sessionIdOf(uiSession.current.value)
        if (id === undefined) return
        if (index >= 0 && entries[index] === id) return
        if (id === entries[index + 1]) {
          index += 1
          notify()
          return
        }
        entries = entries.slice(0, index + 1)
        entries.push(id)
        index = entries.length - 1
        notify()
      }
      const unsubscribe = typeof uiSession.current.subscribe === 'function'
        ? uiSession.current.subscribe(record)
        : () => {}
      record()

      const go = (delta) => {
        if (disposed) return
        const targetIndex = index + delta
        if (targetIndex < 0 || targetIndex >= entries.length) return
        const target = entries[targetIndex]
        const previous = index
        index = targetIndex
        notify()
        try {
          const result = uiWorkspace.openSession(target)
          if (result !== null && result !== undefined && typeof result.catch === 'function') {
            result.catch(() => {
              index = previous
              notify()
            })
          }
        } catch {
          index = previous
          notify()
        }
      }

      return {
        getSnapshot: snapshot,
        subscribe(listener) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
        back: () => go(-1),
        forward: () => go(1),
        dispose() {
          disposed = true
          listeners.clear()
          unsubscribe?.()
        },
      }
    }

    /** Chevron icon. @param {boolean} forward - direction. @returns {object} SVG element. */
    function Chevron({ forward }) {
      return h('svg', {
        viewBox: '0 0 16 16',
        width: 15,
        height: 15,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      }, h('path', { d: forward ? 'M5.5 3.5 10 8l-4.5 4.5' : 'M10.5 3.5 6 8l4.5 4.5' }))
    }

    /**
     * Two top-left controls backed by the session history.
     * @param {object} props - navigation controller and translator.
     * @returns {object|null} controls, or null before a session is known.
     */
    function NavControls({ nav, t }) {
      const [state, setState] = useState(nav.getSnapshot())
      useEffect(() => nav.subscribe(setState), [nav])
      useEffect(() => {
        const onKeyDown = (event) => {
          if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
          if (event.key === 'ArrowLeft') {
            event.preventDefault?.()
            nav.back()
          } else if (event.key === 'ArrowRight') {
            event.preventDefault?.()
            nav.forward()
          }
        }
        document.addEventListener('keydown', onKeyDown, true)
        return () => document.removeEventListener('keydown', onKeyDown, true)
      }, [nav])
      if (state.entries.length === 0) return null
      return h('div', { className: 'dshnb-nav', 'data-dshnb-nav': '' },
        h('button', {
          type: 'button',
          className: 'dshnb-button',
          'aria-label': t('nav.back'),
          title: t('nav.backTitle'),
          disabled: !state.canBack,
          onClick: () => nav.back(),
        }, h(Chevron, { forward: false })),
        h('button', {
          type: 'button',
          className: 'dshnb-button',
          'aria-label': t('nav.forward'),
          title: t('nav.forwardTitle'),
          disabled: !state.canForward,
          onClick: () => nav.forward(),
        }, h(Chevron, { forward: true })))
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'nav-back-forward: dictionaries')
      ctx.effect(() => {
        if (typeof document === 'undefined' || typeof document.createElement !== 'function') return () => {}
        const style = document.createElement('style')
        style.dataset.dshPlugin = 'dsh-nav-back-forward'
        style.textContent = `.dshnb-nav {
  position: fixed;
  left: 4px;
  top: 4px;
  z-index: 96;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 86%, transparent);
  border: 1px solid var(--dsw-alias-border-l2);
  box-shadow: var(--dsw-elevation-soft);
  -webkit-app-region: no-drag;
}
.dshnb-button {
  box-sizing: border-box;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dshnb-button:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dshnb-button:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
.dshnb-button:disabled {
  opacity: .35;
  cursor: default;
}
`
        document.head?.appendChild?.(style)
        return () => style.remove?.()
      }, 'nav-back-forward: styles')

      const uiSession = typeof ctx.get === 'function' ? ctx.get('uiSession') : undefined
      const uiWorkspace = typeof ctx.get === 'function' ? ctx.get('uiWorkspace') : undefined
      if (uiSession?.current === undefined || typeof uiWorkspace?.openSession !== 'function') return
      const nav = createNavigation(uiSession, uiWorkspace)
      ctx.effect(() => () => nav.dispose(), 'nav-back-forward: history subscription')
      ctx.effect(() => ctx.slots.register({
        name: 'shell.overlay',
        id: 'nav-back-forward.controls',
        locale: NS,
        inject: () => ({ nav }),
      }, NavControls), 'nav-back-forward: controls')
    }

    return {
      inject: ['slots', 'locale'],
      apply,
    }
  },
})
