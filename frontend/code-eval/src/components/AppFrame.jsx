import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { problemsById } from '../catalog.js'
import { useSession } from '../session.js'
import { Icon } from './ui.jsx'

function Navigation({ onNavigate }) {
  const { pathname, hash } = useLocation()
  const items = [
    { to: '/home', label: 'Dashboard', icon: 'dashboard', active: pathname === '/home' && !hash },
    { to: '/home#problem-library', label: 'Problems', icon: 'problems', active: pathname === '/home' && Boolean(hash) || pathname.startsWith('/problems/') },
    { to: '/contests', label: 'Contests / Weekly Practice', icon: 'calendar', active: pathname === '/contests' },
    { to: '/submissions', label: 'Submissions', icon: 'history', active: pathname.startsWith('/submissions') },
    { to: '/settings', label: 'Profile', icon: 'user', active: pathname === '/settings' },
  ]

  return (
    <nav className="primary-nav" aria-label="Main">
      {items.map((item) => (
        <Link key={item.label} to={item.to} onClick={onNavigate}
          className={item.active ? 'active' : undefined} aria-current={item.active ? 'page' : undefined}>
          <Icon name={item.icon} /><span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default function AppFrame() {
  const { user, loading } = useSession()
  const { pathname, hash } = useLocation()
  const drawer = useRef(null)
  const menuButton = useRef(null)
  const problem = problemsById[pathname.split('/')[2]]
  const context = problem?.title ?? (pathname === '/home' ? 'Practice'
    : pathname === '/contests' ? 'Club Contest'
      : pathname.startsWith('/submissions') ? 'Submissions'
        : pathname === '/settings' ? 'Profile'
          : pathname === '/signup' ? 'Create an account' : pathname === '/login' ? 'Sign in' : 'CodeEval')

  useEffect(() => {
    if (hash === '#problem-library') {
      document.getElementById('problem-library')?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1001px)')
    const closeOnDesktop = () => {
      if (desktop.matches) drawer.current?.close()
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  function closeDrawer() {
    drawer.current?.close()
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="desktop-sidebar">
        <Link className="wordmark" to="/home"><Icon name="code" size={22} />CodeEval</Link>
        <Navigation />
        <p className="sidebar-footer">Centennial CVI<br /><span>Computer Science Club</span></p>
      </aside>
      <div className="app-content">
        <header className="site-header">
          <div className="header-context">
            <button ref={menuButton} className="icon-button mobile-menu" aria-label="Open navigation" type="button"
              aria-haspopup="dialog" aria-controls="navigation-drawer"
              onClick={() => {
                drawer.current.showModal()
                drawer.current.querySelector('button').focus()
              }}><Icon name="menu" /></button>
            <span className="context-root">CodeEval</span><span className="context-divider" aria-hidden="true">/</span>
            <span className="context-current">{context}</span>
          </div>
          {!loading && <NavLink className="header-account" to={user ? '/settings' : '/login'}>
            <Icon name="user" size={16} />{user ? user.displayName || 'Account' : 'Sign in'}
          </NavLink>}
        </header>
        <main id="main-content" tabIndex={-1}><Outlet /></main>
      </div>
      <dialog className="navigation-drawer" id="navigation-drawer" ref={drawer} aria-label="Navigation"
        onClick={(event) => { if (event.target === drawer.current) closeDrawer() }}
        onClose={() => menuButton.current?.focus()}>
        <div className="drawer-content">
          <div className="drawer-heading">
            <Link className="wordmark" to="/home" onClick={closeDrawer}><Icon name="code" size={22} />CodeEval</Link>
            <button className="icon-button" type="button" aria-label="Close navigation" onClick={closeDrawer}><Icon name="close" /></button>
          </div>
          <Navigation onNavigate={closeDrawer} />
          <p className="sidebar-footer">Centennial CVI<br /><span>Computer Science Club</span></p>
        </div>
      </dialog>
    </div>
  )
}
