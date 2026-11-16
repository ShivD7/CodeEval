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

monaco.editor.defineTheme('codeeval-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#101620',
    'editor.foreground': '#ecf1f8',
    'editor.lineHighlightBackground': '#1a2433',
    'editorLineNumber.foreground': '#8999ad',
    'editorLineNumber.activeForeground': '#a5d9a5',
    'editor.selectionBackground': '#375046',
    'editorCursor.foreground': '#a5d9a5',
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
        fontFamily: "'IBM Plex Mono', Consolas, monospace",
        fontSize: 14,
        minimap: { enabled: false },
        padding: { top: 14, bottom: 14 },
        scrollBeyondLastLine: false,
        tabSize: 4,
      }}
    />
  )
}
