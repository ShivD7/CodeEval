import catalog from '../../../backend/catalog.json'

export const problems = catalog.problems
export const problemsById = Object.fromEntries(problems.map((problem) => [problem.id, problem]))

const clubDateFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function weeklyProblem(date = new Date()) {
  const parts = Object.fromEntries(clubDateFormat.formatToParts(date).map(({ type, value }) => [type, value]))
  const dateAtUtcMidnight = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day))
  const elapsedWeeks = Math.floor((dateAtUtcMidnight - Date.parse(catalog.rotation.epoch)) / 604_800_000)
  const { problemIds } = catalog.rotation
  return problemsById[problemIds[Math.max(0, elapsedWeeks) % problemIds.length]]
}

export function problemPath(id) {
  return `/problems/${id}`
}
