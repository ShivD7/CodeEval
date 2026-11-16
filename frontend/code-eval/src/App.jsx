import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import AccountAccess from './components/AccountAccess.jsx'
import AccountSettings from './components/AccountSettings.jsx'
import AppFrame from './components/AppFrame.jsx'
import PracticeDashboard from './components/PracticeDashboard.jsx'
import ProgressProvider from './components/ProgressProvider.jsx'
import SolvingWorkspace from './components/SolvingWorkspace.jsx'
import SubmissionHistory from './components/SubmissionHistory.jsx'
import { problemsById, problemPath } from './catalog.js'
import { useSession } from './session.js'

function NotFound() {
  return (
    <section className="container history">
      <h1>Page not found</h1>
      <Link className="subtle-link" to="/home">← Browse problems</Link>
    </section>
  )
}

function ProblemRoute({ legacy = false }) {
  const { problemId } = useParams()
  if (!Object.hasOwn(problemsById, problemId)) return <NotFound />
  if (legacy) return <Navigate to={problemPath(problemId)} replace />
  return <SolvingWorkspace problem={problemsById[problemId]} />
}

export default function App() {
  const { user } = useSession()

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ProgressProvider key={user?.uid ?? 'guest'} uid={user?.uid}>
        <Routes>
          <Route element={<AppFrame />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<PracticeDashboard />} />
            <Route path="contests" element={<PracticeDashboard key="contest" contest />} />
            <Route path="problems/:problemId" element={<ProblemRoute />} />
            <Route path="submissions/:submissionId?" element={<SubmissionHistory />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="login" element={<AccountAccess />} />
            <Route path="signup" element={<AccountAccess key="signup" signUp />} />
            <Route path=":problemId" element={<ProblemRoute legacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ProgressProvider>
    </BrowserRouter>
  )
}
