import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LANGUAGES, getDraftLanguage, readDraft, rememberLanguage, writeDraft } from '../drafts.js'
import { saveSubmission } from '../firebase/submissions.js'
import { evaluateCode } from '../grading.js'
import { useProgress, VERDICTS } from '../progress.js'
import { useSession } from '../session.js'
import './workspace.css'

const CodeEditor = lazy(() => import('./CodeEditor.jsx'))
const TABS = ['Description', 'Editor']

function ProblemStatement({ problem }) {
  return (
    <>
      <div className="statement-heading">
        <div className="statement-meta">
          <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span>{problem.topics.join(' · ')}</span>
        </div>
        <h1>{problem.title}</h1>
      </div>
      <p>{problem.description}</p>
      <div className="statement-section">
        <h2>Input</h2>
        <p>{problem.input}</p>
      </div>
      <div className="statement-section">
        <h2>Output</h2>
        <p>{problem.output}</p>
      </div>
      <div className="statement-section">
        <h2>Constraints</h2>
        <ul>{problem.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
      </div>
      <div className="statement-section">
        <h2>Examples</h2>
        <div className="example-list">
          {problem.samples.map((sample, index) => (
            <div className="sample-example" key={sample.input}>
              <h3>Example {index + 1}</h3>
              <dl>
                <div><dt>Input</dt><dd><pre>{sample.input}</pre></dd></div>
                <div><dt>Output</dt><dd><pre>{sample.output}</pre></dd></div>
              </dl>
              {sample.explanation && <p>{sample.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Results({ evaluation, activeMode, gradingError, saveState, retrySave }) {
  const result = evaluation?.result
  const verdict = result && VERDICTS[result.verdict]
  return (
    <section className="results-panel" aria-labelledby="results-heading">
      <header>
        <h2 id="results-heading">Results</h2>
        {evaluation && !activeMode && <span>{evaluation.mode === 'samples' ? 'Samples' : 'Submission'}</span>}
      </header>
      <div className="results-body">
        {activeMode ? <p className="notice" role="status">{activeMode === 'samples' ? 'Running samples…' : 'Grading submission…'}</p>
          : gradingError ? <p className="notice error-notice" role="alert">{gradingError}</p>
            : result ? (
              <>
                <div className="result-summary" role="status">
                  <strong className={`verdict verdict-${verdict.tone}`}>{verdict.label}</strong>
                  <span>{result.passed} / {result.total} {evaluation.mode === 'samples' ? 'samples' : 'tests'} passed</span>
                  {evaluation.mode === 'submit' && <span>{result.hiddenPassed} / {result.hiddenTotal} hidden tests passed</span>}
                </div>
                {result.cases && (
                  <div className="sample-results">
                    {result.cases.map((item) => (
                      <details key={item.number} open={item.verdict !== 'accepted' || undefined}>
                        <summary>
                          <strong>Sample {item.number}</strong>
                          <span className={`verdict verdict-${VERDICTS[item.verdict].tone}`}>{VERDICTS[item.verdict].label}</span>
                          {item.timeMs !== null && <span>{item.timeMs} ms</span>}
                        </summary>
                        <dl>
                          <div><dt>Expected output</dt><dd><pre>{evaluation.samples[item.number - 1]?.output}</pre></dd></div>
                          <div><dt>Your output</dt><dd><pre>{item.output || '(empty)'}</pre></dd></div>
                          {item.diagnostic && <div><dt>Diagnostics</dt><dd><pre>{item.diagnostic}</pre></dd></div>}
                        </dl>
                      </details>
                    ))}
                  </div>
                )}
              </>
            ) : <p className="notice">Run the examples to check your output, or submit to grade against all tests.</p>}
        {saveState?.status === 'saving' && <p className="notice" role="status">Saving to your history…</p>}
        {saveState?.status === 'saved' && (
          <p className="notice">Saved to <Link to={`/submissions/${saveState.id}`}>submission history</Link>.</p>
        )}
        {saveState?.status === 'failed' && (
          <div className="save-error">
            <p className="notice error-notice" role="alert">The verdict is ready, but the submission could not be saved.</p>
            <button className="button button-secondary" type="button" onClick={retrySave}>Retry save</button>
          </div>
        )}
      </div>
    </section>
  )
}

function ProblemEditor({ problem, uid, previous, resumeGuestDraft }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [initialDraft] = useState(() => {
    const guestLanguage = getDraftLanguage(null, problem.id)
    const guestCode = uid && resumeGuestDraft && !previous ? readDraft(null, problem.id, guestLanguage) : null
    const language = previous?.language ?? (guestCode === null ? getDraftLanguage(uid, problem.id) : guestLanguage)
    return { language, storedCode: readDraft(uid, problem.id, language), guestCode }
  })
  const [language, setLanguage] = useState(initialDraft.language)
  const [code, setCode] = useState(() => previous?.code ?? initialDraft.guestCode
    ?? initialDraft.storedCode ?? LANGUAGES[language].starter)
  const [draftStatus, setDraftStatus] = useState(() => {
    if (previous) return 'Saved submission'
    if (initialDraft.guestCode !== null) return 'Resumed from your draft'
    return initialDraft.storedCode === null ? '' : 'Draft saved on this device'
  })
  const [tab, setTab] = useState(previous || resumeGuestDraft ? 'Editor' : 'Description')
  const [activeMode, setActiveMode] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [gradingError, setGradingError] = useState('')
  const [saveState, setSaveState] = useState(null)
  const request = useRef(null)
  const tabList = useRef(null)

  useEffect(() => () => request.current?.abort(), [])

  useEffect(() => {
    if (initialDraft.guestCode !== null && readDraft(uid, problem.id, initialDraft.language) === null) {
      writeDraft(uid, problem.id, initialDraft.language, initialDraft.guestCode)
      rememberLanguage(uid, problem.id, initialDraft.language)
    }
  }, [initialDraft, problem.id, uid])

  function changeLanguage(nextLanguage) {
    const draft = readDraft(uid, problem.id, nextLanguage)
    setLanguage(nextLanguage)
    rememberLanguage(uid, problem.id, nextLanguage)
    setCode(draft ?? LANGUAGES[nextLanguage].starter)
    setDraftStatus(draft === null ? '' : 'Draft saved on this device')
  }

  function changeCode(nextCode) {
    setCode(nextCode)
    rememberLanguage(uid, problem.id, language)
    setDraftStatus(writeDraft(uid, problem.id, language, nextCode)
      ? 'Draft saved on this device' : 'Draft could not be saved')
  }

  async function persist(attempt) {
    setSaveState({ status: 'saving', attempt })
    try {
      const saved = await saveSubmission(uid, problem.id, attempt.language, attempt.code, attempt.result)
      setSaveState((current) => current?.attempt === attempt ? { status: 'saved', id: saved.id, attempt } : current)
    } catch {
      setSaveState((current) => current?.attempt === attempt ? { status: 'failed', attempt } : current)
    }
  }

  async function grade(mode) {
    if (request.current) return
    if (mode === 'submit' && !uid) {
      navigate('/login', { state: { returnTo: location.pathname, continueGuestDraft: true } })
      return
    }
    if (!code.trim()) {
      setEvaluation(null)
      setGradingError('Enter some code before running it.')
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    request.current = controller
    setActiveMode(mode)
    setGradingError('')
    setEvaluation(null)
    if (mode === 'submit') setSaveState(null)

    try {
      const result = await evaluateCode({ problemId: problem.id, language, code, mode }, controller.signal)
      if (controller.signal.aborted) return
      setEvaluation({ mode, result, samples: problem.samples })
      if (mode === 'submit') void persist({ code, language, result })
    } catch (error) {
      setGradingError(controller.signal.aborted ? 'The grader took too long to respond. Try again.'
        : error instanceof TypeError ? 'Could not reach the grading service. Try again.' : error.message)
    } finally {
      clearTimeout(timeout)
      request.current = null
      setActiveMode(null)
    }
  }

  function moveTab(event) {
    const next = {
      ArrowLeft: tab === 'Editor' ? 'Description' : 'Editor',
      ArrowRight: tab === 'Editor' ? 'Description' : 'Editor',
      Home: 'Description',
      End: 'Editor',
    }[event.key]

    if (next) {
      event.preventDefault()
      setTab(next)
      tabList.current.querySelector(`#tab-${next.toLowerCase()}`)?.focus()
    }
  }

  return (
    <div className="workspace">
      <div className="workspace-breadcrumb">
        <Link className="subtle-link" to={problem.group === 'Club Contest' ? '/contests' : '/home'}>← {problem.group}</Link>
        <span aria-hidden="true">/</span><span>{problem.title}</span>
      </div>
      <div className="workspace-tabs surface" role="tablist" aria-label="Problem workspace" ref={tabList} onKeyDown={moveTab}>
        {TABS.map((item) => (
          <button type="button" role="tab" aria-selected={tab === item} tabIndex={tab === item ? 0 : -1}
            id={`tab-${item.toLowerCase()}`} aria-controls={`panel-${item.toLowerCase()}`}
            onClick={() => setTab(item)} key={item}>{item}</button>
        ))}
      </div>
      <div className="workspace-grid">
        <section className="surface workspace-statement" role="tabpanel" id="panel-description"
          aria-labelledby="tab-description" data-active={tab === 'Description'} tabIndex={0}>
          <ProblemStatement problem={problem} />
        </section>
        <section className="surface workspace-editor" role="tabpanel" id="panel-editor"
          aria-labelledby="tab-editor" data-active={tab === 'Editor'}>
          <div className="editor-toolbar">
            <select aria-label="Language" value={language} disabled={Boolean(activeMode)}
              onChange={(event) => changeLanguage(event.target.value)}>
              {Object.entries(LANGUAGES).map(([value, { label }]) => <option value={value} key={value}>{label}</option>)}
            </select>
            <div className="editor-actions">
              <button className="button button-secondary" type="button" disabled={Boolean(activeMode)}
                onClick={() => grade('samples')}>Run Samples</button>
              <button className="button button-primary" type="button" disabled={Boolean(activeMode)}
                onClick={() => grade('submit')}>{uid ? 'Submit' : 'Sign in to submit'}</button>
            </div>
          </div>
          <div className="editor-canvas">
            <div className="editor-host">
              <Suspense fallback={<p className="notice" role="status">Loading editor…</p>}>
                <CodeEditor key={language} language={language} code={code} onChange={changeCode} panel={tab} />
              </Suspense>
            </div>
          </div>
          {draftStatus && <p className="draft-note">{draftStatus}</p>}
          <Results evaluation={evaluation} activeMode={activeMode} gradingError={gradingError}
            saveState={saveState} retrySave={() => persist(saveState.attempt)} />
        </section>
      </div>
    </div>
  )
}

export default function SolvingWorkspace({ problem }) {
  const { user, loading: accountLoading } = useSession()
  const { submissions, loading } = useProgress()
  const location = useLocation()
  const previousId = location.state?.submissionId
  if (accountLoading || (previousId && loading)) {
    return <p className="container page-notice" role="status">Loading workspace…</p>
  }

  const previous = previousId && submissions.find(({ id, problemId }) => id === previousId && problemId === problem.id)
  return <ProblemEditor key={`${problem.id}:${user?.uid ?? 'guest'}:${location.key}:${previous?.id ?? ''}`}
    uid={user?.uid} problem={problem} previous={previous} resumeGuestDraft={location.state?.resumeGuestDraft} />
}
