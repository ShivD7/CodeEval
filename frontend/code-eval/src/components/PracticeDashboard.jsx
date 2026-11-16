import { useState } from 'react'
import { Link } from 'react-router-dom'
import { problems, problemPath, weeklyProblem } from '../catalog.js'
import { hasDraft } from '../drafts.js'
import { useProgress } from '../progress.js'
import { useSession } from '../session.js'
import './dashboard.css'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function Difficulty({ value }) {
  return <span className={`difficulty difficulty-${value.toLowerCase()}`}>{value}</span>
}

export default function PracticeDashboard({ contest = false }) {
  const { user, loading: accountLoading } = useSession()
  const { submissions, loading, error } = useProgress()
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const uid = user?.uid
  const attempted = new Set(submissions.map(({ problemId }) => problemId))
  const solved = new Set(submissions.filter(({ verdict }) => verdict === 'accepted').map(({ problemId }) => problemId))
  const collection = contest ? problems.filter((problem) => problem.group === 'Club Contest') : problems
  const query = search.trim().toLowerCase()

  function status(problemId) {
    if (solved.has(problemId)) return 'Solved'
    if (attempted.has(problemId)) return 'Attempted'
    if (!accountLoading && hasDraft(uid, problemId)) return 'Draft'
    return 'Unsolved'
  }

  const filtered = collection.filter((problem) => {
    const searchable = [problem.title, problem.group, ...problem.topics].join(' ').toLowerCase()
    return searchable.includes(query) && (!difficulty || problem.difficulty === difficulty)
      && (!statusFilter || status(problem.id) === statusFilter)
  })
  const featured = weeklyProblem()
  const featuredDraft = !accountLoading && hasDraft(uid, featured.id)
  const featuredSubmission = submissions.find(({ problemId }) => problemId === featured.id)

  return (
    <div className="container dashboard">
      {contest ? (
        <header className="dashboard-heading">
          <h1>Club Contest</h1>
          <p className="muted">Practice with problems from the club’s contest set.</p>
        </header>
      ) : (
        <section className="dashboard-top" aria-label="Weekly problem and progress">
          <div className="surface weekly-feature">
            <div className="featured-label"><span aria-hidden="true" />Problem of the Week</div>
            <h1>{featured.title}</h1>
            <p>{featured.description}</p>
            <div className="featured-actions">
              <Link className="button button-primary" to={problemPath(featured.id)}
                state={!featuredDraft && featuredSubmission ? { submissionId: featuredSubmission.id } : null}>
                {featuredDraft || featuredSubmission ? 'Continue' : 'Start problem'} <span aria-hidden="true">→</span>
              </Link>
              <Difficulty value={featured.difficulty} />
            </div>
          </div>
          <aside className="surface progress-card">
            <h2>Your progress</h2>
            {user ? (
              <>
                <p className="progress-total"><strong>{loading || error ? '—' : solved.size}</strong><span> / {problems.length} solved</span></p>
                <progress value={solved.size} max={problems.length} aria-label="Problems solved" />
                {loading || error
                  ? <p className="notice">{error ? 'Progress is unavailable.' : 'Loading progress…'}</p>
                  : <Link to="/submissions">View submissions <span aria-hidden="true">→</span></Link>}
              </>
            ) : (
              <>
                <p className="notice">{accountLoading ? 'Loading your account…' : 'Sign in to save submissions and track solved problems.'}</p>
                {!accountLoading && <Link to="/login" state={{ returnTo: '/home' }}>Sign in <span aria-hidden="true">→</span></Link>}
              </>
            )}
          </aside>
        </section>
      )}
      <section className="dashboard-library" aria-labelledby="library-title">
        <div className="library-heading">
          <h2 id="library-title">Problem library</h2>
          <span aria-live="polite">{filtered.length} {filtered.length === 1 ? 'problem' : 'problems'}</span>
        </div>
        <div className="library-filters">
          <label className="problem-search">
            <span className="sr-only">Search problems</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or topic" />
          </label>
          <select aria-label="Filter by difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="">All difficulties</option>
            {DIFFICULTIES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {['Unsolved', 'Draft', 'Attempted', 'Solved'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        {filtered.length > 0 ? (
          <div className="surface problem-table">
            <div className="problem-grid problem-table-head" aria-hidden="true">
              <span>Problem</span><span>Difficulty</span><span>Topics</span><span>Status</span><span />
            </div>
            <ul className="problem-rows">
              {filtered.map((problem) => {
                const currentStatus = status(problem.id)
                return (
                  <li key={problem.id}>
                    <Link className="problem-grid problem-row" to={problemPath(problem.id)}>
                      <span className="problem-title">{problem.title}</span>
                      <Difficulty value={problem.difficulty} />
                      <span className="problem-topics">{problem.topics.join(' · ')}</span>
                      <span className={`problem-status status-${currentStatus.toLowerCase()}`}>
                        <span aria-hidden="true" />{currentStatus}
                      </span>
                      <span className="problem-arrow" aria-hidden="true">↗</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <div className="surface empty-state">
            <p>No problems match your filters.</p>
            <button className="button button-secondary" type="button" onClick={() => {
              setSearch('')
              setDifficulty('')
              setStatusFilter('')
            }}>Clear filters</button>
          </div>
        )}
      </section>
    </div>
  )
}
