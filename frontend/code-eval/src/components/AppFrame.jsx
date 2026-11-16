import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSession } from '../session.js'

export default function AppFrame() {
  const { user, loading } = useSession()

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="wordmark" to="/home">
            <span className="wordmark-icon" aria-hidden="true">⌘</span>
            CodeEval
          </Link>
          <nav className="site-nav" aria-label="Main">
            <NavLink to="/home">Practice</NavLink>
            <NavLink to="/contests">Club Contest</NavLink>
            <NavLink to="/submissions">Submissions</NavLink>
          </nav>
          <div className="site-account">
            {!loading && <NavLink to={user ? '/settings' : '/login'}>{user ? 'Account' : 'Sign in'}</NavLink>}
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  )
}
