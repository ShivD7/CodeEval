export const LANGUAGES = {
  python: { label: 'Python', starter: '# Read from standard input and print the answer.\n' },
  javascript: { label: 'JavaScript', starter: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8');\n" },
  cpp: { label: 'C++', starter: '#include <iostream>\n\nint main() {\n    return 0;\n}\n' },
  java: { label: 'Java', starter: 'public class Main {\n    public static void main(String[] args) {\n    }\n}\n' },
}

const DEFAULT_LANGUAGE = 'python'

function key(uid, problemId, field) {
  return `codeeval:draft:${uid ?? 'guest'}:${problemId}:${field}`
}

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function readDraft(uid, problemId, language) {
  return read(key(uid, problemId, language))
}

export function writeDraft(uid, problemId, language, code) {
  return write(key(uid, problemId, language), code)
}

export function getDraftLanguage(uid, problemId) {
  const previous = read(key(uid, problemId, 'language'))
  return Object.hasOwn(LANGUAGES, previous) ? previous : DEFAULT_LANGUAGE
}

export function rememberLanguage(uid, problemId, language) {
  return write(key(uid, problemId, 'language'), language)
}

export function hasDraft(uid, problemId) {
  return Object.keys(LANGUAGES).some((language) => readDraft(uid, problemId, language) !== null)
}
