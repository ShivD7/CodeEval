import { Link, useParams } from 'react-router-dom'
import { problemsById, problemPath } from '../catalog.js'
import { LANGUAGES } from '../drafts.js'
import { submissionDate, useProgress, VERDICTS } from '../progress.js'
import { useSession } from '../session.js'
import './history.css'

function Verdict({ submission }) {
  const verdict = VERDICTS[submission.verdict]
  return <span className={`verdict verdict-${verdict.tone}`}>{verdict.label}</span>
}

export default function SubmissionHistory() {
  const { user, loading: accountLoading } = useSession()
  const { submissions, loading, error } = useProgress()
  const { submissionId } = useParams()
  const submission = submissions.find(({ id }) => id === submissionId)
  const returnTo = submissionId ? `/submissions/${submissionId}` : '/submissions'

  return (
    <section className="container history">
      {submissionId && <Link className="subtle-link" to="/submissions">← All submissions</Link>}
      <h1>{submission ? problemsById[submission.problemId]?.title ?? submission.problemId : 'Submissions'}</h1>
      {accountLoading || loading ? <p className="notice" role="status">Loading submissions…</p>
        : !user ? (
          <div className="surface empty-state">
            <p>Sign in to view your saved submissions.</p>
            <Link className="button button-primary" to="/login" state={{ returnTo }}>Sign in</Link>
          </div>
        ) : error ? (
          <p className="notice error-notice" role="alert">Submission history is unavailable. Try refreshing.</p>
        ) : submission ? (
          <>
            <div className="submission-details surface">
              <Verdict submission={submission} />
              <span>{submission.passed} / {submission.total} tests passed</span>
              <span>{LANGUAGES[submission.language].label}</span>
              <time dateTime={submission.createdAt?.toDate().toISOString()}>{submissionDate(submission)}</time>
              {problemsById[submission.problemId] && (
                <Link className="button button-primary" to={problemPath(submission.problemId)}
                  state={{ submissionId: submission.id }}>Open in editor</Link>
              )}
            </div>
            <pre className="surface submission-code"><code>{submission.code}</code></pre>
          </>
        ) : submissionId || submissions.length === 0 ? (
          <div className="surface empty-state">
            <p>{submissionId ? 'This submission could not be found.' : 'Your submitted solutions will appear here.'}</p>
            <Link className="button button-secondary" to={submissionId ? '/submissions' : '/home'}>
              {submissionId ? 'Back to submissions' : 'Browse problems'}
            </Link>
          </div>
        ) : (
          <ul className="surface submission-list">
            {submissions.map((attempt) => (
              <li key={attempt.id}>
                <Link to={`/submissions/${attempt.id}`}>
                  <strong>{problemsById[attempt.problemId]?.title ?? attempt.problemId}</strong>
                  <Verdict submission={attempt} />
                  <span>{LANGUAGES[attempt.language].label}</span>
                  <time dateTime={attempt.createdAt?.toDate().toISOString()}>{submissionDate(attempt)}</time>
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
    </section>
  )
}
