import { createContext, useContext } from 'react'

export const ProgressContext = createContext(null)

export function useProgress() {
  return useContext(ProgressContext)
}

export const VERDICTS = {
  accepted: { label: 'Accepted', tone: 'success' },
  wrong_answer: { label: 'Wrong Answer', tone: 'error' },
  time_limit_exceeded: { label: 'Time Limit Exceeded', tone: 'warning' },
  compilation_error: { label: 'Compilation Error', tone: 'error' },
  runtime_error: { label: 'Runtime Error', tone: 'error' },
}

export function submissionDate(submission) {
  if (!submission.createdAt) return 'Saving…'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium', timeStyle: 'short',
  }).format(submission.createdAt.toDate())
}
