import { useState } from 'react'
import { Link } from 'react-router-dom'
import { problems, problemsById, problemPath, weeklyProblem } from '../catalog.js'
import { hasDraft } from '../drafts.js'
import { submissionDate, useProgress } from '../progress.js'
import { useSession } from '../session.js'
import { Difficulty, Icon, Verdict } from './ui.jsx'
import './dashboard.css'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

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
  const progressUnavailable = user && (loading || error)

  function status(problemId) {
    if (solved.has(problemId)) return 'Solved'
    if (attempted.has(problemId)) return 'Attempted'
    if (!accountLoading && hasDraft(uid, problemId)) return 'Draft'
    return progressUnavailable ? 'Unavailable' : 'Unsolved'
  }

  const filtered = collection.filter((problem) => {
    const searchable = [problem.title, problem.group, ...problem.topics].join(' ').toLowerCase()
    return searchable.includes(query) && (!difficulty || problem.difficulty === difficulty)
      && (!statusFilter || status(problem.id) === statusFilter)
  })
  const featured = weeklyProblem()
  const featuredDraft = !accountLoading && hasDraft(uid, featured.id)
  const featuredSubmission = submissions.find(({ problemId }) => problemId === featured.id)
  const drafts = accountLoading ? [] : problems.filter((problem) => hasDraft(uid, problem.id))
  const resumeIds = [...new Set([
    ...drafts.map(({ id }) => id),
    ...submissions.filter(({ verdict }) => verdict !== 'accepted').map(({ problemId }) => problemId),
  ])].filter((id) => Object.hasOwn(problemsById, id)).slice(0, 3)

  function resumeState(id) {
    const previous = submissions.find(({ problemId }) => problemId === id)
    return !hasDraft(uid, id) && previous ? { submissionId: previous.id } : null
  }

  return (
    <div className="container dashboard">
      <header className="dashboard-heading">
        <h1>{contest ? 'Club Contest' : user?.displayName ? `Welcome back, ${user.displayName}.` : 'Your next problem starts here.'}</h1>
        <p className="muted">{contest ? 'Practice with problems from the club’s contest set.' : 'Build your skills for the Canadian Computing Competition.'}</p>
      </header>
      {!contest && (
        <>
          <section className="weekly-feature surface" aria-labelledby="weekly-title">
            <div className="weekly-content">
              <h2 id="weekly-title">Problem of the Week</h2>
              <div className="weekly-title"><h3>{featured.title}</h3><Difficulty value={featured.difficulty} /></div>
              <p>{featured.description}</p>
            </div>
            <Link className="button button-primary" to={problemPath(featured.id)}
              state={!featuredDraft && featuredSubmission ? { submissionId: featuredSubmission.id } : null}>
              {featuredDraft || featuredSubmission ? 'Continue' : 'Start problem'}<Icon name="arrow" size={16} />
            </Link>
          </section>
          <div className="practice-overview">
            {(user || resumeIds.length > 0) && <section className="continue-section" aria-labelledby="continue-title">
              <div className="section-heading"><h2 id="continue-title">Continue practicing</h2></div>
              {resumeIds.length > 0 ? (
                <ul className="compact-list">
                  {resumeIds.map((id) => (
                    <li key={id}>
                      <Link to={problemPath(id)} state={resumeState(id)}>
                        <span><strong>{problemsById[id].title}</strong><small>{status(id) === 'Draft' ? 'Draft on this device' : 'Previous attempt'}</small></span>
                        <Difficulty value={problemsById[id].difficulty} /><Icon name="chevron" size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="section-empty">{accountLoading ? 'Loading practice…' : 'Open a problem below. Your drafts will appear here.'}</p>}
            </section>}
            <section className="progress-section" aria-labelledby="progress-title">
              <div className="section-heading">
                <h2 id="progress-title">Your progress</h2>
                {user && !progressUnavailable && <span>{solved.size} / {problems.length} solved</span>}
              </div>
              {user ? progressUnavailable ? (
                <p className="section-empty" role={error ? 'alert' : 'status'}>{error ? 'Progress is unavailable. Try refreshing.' : 'Loading progress…'}</p>
              ) : (
                <dl className="difficulty-breakdown">
                  {DIFFICULTIES.map((value) => {
                    const group = problems.filter((problem) => problem.difficulty === value)
                    const count = group.filter(({ id }) => solved.has(id)).length
                    return <div key={value}><dt><Difficulty value={value} /></dt>
                      <dd><progress value={count} max={group.length} aria-label={`${value} problems solved`} />
                        <span>{count} / {group.length}</span></dd></div>
                  })}
                </dl>
              ) : (
                <p className="section-empty">{accountLoading ? 'Loading your account…' : <>
                  <Link to="/login" state={{ returnTo: '/home' }}>Sign in</Link> to save submissions and track solved problems.
                </>}</p>
              )}
            </section>
          </div>
          {user && <section className="recent-section" aria-labelledby="recent-title">
            <div className="section-heading"><h2 id="recent-title">Recent submissions</h2>
              {user && <Link className="subtle-link" to="/submissions">View all<Icon name="arrow" size={14} /></Link>}
            </div>
            {user && submissions.length > 0 ? (
              <ul className="recent-submissions">
                {submissions.slice(0, 3).map((submission) => (
                  <li key={submission.id}><Link to={`/submissions/${submission.id}`}>
                    <strong>{problemsById[submission.problemId]?.title ?? submission.problemId}</strong>
                    <Verdict value={submission.verdict} />
                    <time dateTime={submission.createdAt?.toDate().toISOString()}>{submissionDate(submission)}</time>
                    <Icon name="chevron" size={15} />
                  </Link></li>
                ))}
              </ul>
            ) : <p className="section-empty">{accountLoading || loading ? 'Loading submissions…'
              : error ? 'Submission history is unavailable. Try refreshing.'
                : user ? 'Submit a solution to see your latest results here.'
                  : 'Your submitted solutions will appear here after you sign in.'}</p>}
          </section>}
        </>
      )}
      <section className="dashboard-library" id="problem-library" aria-labelledby="library-title">
        <div className="library-heading section-heading">
          <h2 id="library-title">Problem library</h2>
          <span aria-live="polite">{filtered.length} {filtered.length === 1 ? 'problem' : 'problems'}</span>
        </div>
        <div className="library-filters">
          <label className="problem-search">
            <span className="sr-only">Search problems</span><Icon name="search" size={16} />
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
          <div className="problem-table">
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
                        {currentStatus === 'Solved' ? <Icon name="check" size={14} /> : <span className="status-dot" aria-hidden="true" />}
                        {currentStatus}
                      </span>
                      <Icon className="problem-arrow" name="chevron" size={14} />
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
