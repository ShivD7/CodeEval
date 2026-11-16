import { VERDICTS } from './progress.js'

const apiUrl = (import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://127.0.0.1:3001' : 'https://codeeval-mish.onrender.com')).replace(/\/+$/, '')

export async function evaluateCode(input, signal) {
  const response = await fetch(`${apiUrl}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || 'The grader did not respond. Try again.')

  const valid = result && Object.hasOwn(VERDICTS, result.verdict)
    && Number.isInteger(result.passed) && Number.isInteger(result.total)
    && (input.mode === 'samples'
      ? Array.isArray(result.cases) && result.cases.every((item) => Object.hasOwn(VERDICTS, item.verdict))
      : Number.isInteger(result.hiddenPassed) && Number.isInteger(result.hiddenTotal))

  if (!valid) throw new Error('The grader returned an unexpected response. Try again.')
  return result
}
