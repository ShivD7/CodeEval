import { VERDICTS } from '../progress.js'

const paths = {
  code: ['m8 5-6 7 6 7', 'm16 5 6 7-6 7', 'm14 3-4 18'],
  dashboard: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'],
  problems: ['M5 3h14v18H5z', 'M9 8h6', 'M9 12h6', 'M9 16h3'],
  calendar: ['M4 5h16v16H4z', 'M8 3v4', 'M16 3v4', 'M4 11h16'],
  history: ['M3 11a9 9 0 1 1 2 7', 'M3 4v7h7', 'M12 7v5l3 2'],
  user: ['M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0', 'M4 21v-2a8 8 0 0 1 16 0v2'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  close: ['m6 6 12 12', 'M18 6 6 18'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  back: ['M19 12H5', 'm11 6-6 6 6 6'],
  search: ['M10 3a7 7 0 1 0 0 14 7 7 0 1 0 0-14', 'm15 15 6 6'],
  check: ['m5 12 4 4L19 6'],
  error: ['M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18', 'm9 9 6 6', 'm15 9-6 6'],
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18', 'M12 7v5l3 2'],
  play: ['m8 4 12 8-12 8z'],
  send: ['m3 3 19 9-19 9 4-9z', 'M7 12h15'],
  chevron: ['m9 5 7 7-7 7'],
}

export function Icon({ name, size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" {...props}>
      {paths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  )
}

export function Difficulty({ value }) {
  return <span className={`difficulty difficulty-${value.toLowerCase()}`}>{value}</span>
}

export function Verdict({ value }) {
  const verdict = VERDICTS[value]
  const icon = value === 'accepted' ? 'check' : value === 'time_limit_exceeded' ? 'clock' : 'error'
  return <span className={`verdict verdict-${verdict.tone}`}><Icon name={icon} size={15} />{verdict.label}</span>
}
