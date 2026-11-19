import { useEffect, useRef } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/editor/editor.api.js'
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker'
import 'monaco-editor/languages/definitions/python/register.js'
import 'monaco-editor/languages/definitions/javascript/register.js'
import 'monaco-editor/languages/definitions/cpp/register.js'
import 'monaco-editor/languages/definitions/java/register.js'

globalThis.MonacoEnvironment = { getWorker: () => new EditorWorker() }
loader.config({ monaco })

const tokens = getComputedStyle(document.documentElement)
const color = (name) => tokens.getPropertyValue(name).trim()

monaco.editor.defineTheme('codeeval-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': color('--editor-bg'),
    'editor.foreground': color('--text'),
    'editor.lineHighlightBackground': color('--editor-line'),
    'editorLineNumber.foreground': color('--muted'),
    'editorLineNumber.activeForeground': color('--accent'),
    'editor.selectionBackground': color('--editor-selection'),
    'editorCursor.foreground': color('--accent'),
  },
})

export default function CodeEditor({ language, code, onChange, panel }) {
  const editor = useRef(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => editor.current?.layout())
    return () => cancelAnimationFrame(frame)
  }, [panel])

  return (
    <Editor
      height="100%"
      theme="codeeval-dark"
      language={language}
      value={code}
      onMount={(instance) => { editor.current = instance }}
      loading={<p className="notice" role="status">Loading editor…</p>}
      onChange={(value) => onChange(value ?? '')}
      options={{
        ariaLabel: 'Solution code',
        automaticLayout: true,
        fontFamily: "'JetBrains Mono', Consolas, monospace",
        fontSize: 14,
        lineHeight: 23,
        minimap: { enabled: false },
        padding: { top: 14, bottom: 14 },
        scrollBeyondLastLine: false,
        tabSize: 4,
      }}
    />
  )
}
