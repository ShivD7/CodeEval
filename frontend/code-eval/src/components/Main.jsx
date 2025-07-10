import Editor from "@monaco-editor/react";
import { useState, useRef } from "react";
import './Main.css';

function Main() {
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [outputHeight, setOutputHeight] = useState(200);
  const resizing = useRef(false);

  const handleRun = () => {
    setOutput(`Output for ${language} code:\nHello, world!`);
    setShowOutput(true);
  };

  const handleCloseOutput = () => {
    setShowOutput(false);
  };

  const startResize = (e) => {
    e.preventDefault();
    resizing.current = true;
    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  };

  const doResize = (e) => {
    if (resizing.current) {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < window.innerHeight - 100) {
        setOutputHeight(newHeight);
      }
    }
  };

  const stopResize = () => {
    resizing.current = false;
    document.removeEventListener("mousemove", doResize);
    document.removeEventListener("mouseup", stopResize);
  };

  return (
    <div className="main-container">
      <div className="left-panel">
        <h2>Problem Title Placeholder</h2>
        <p>Problem description goes here.</p>
      </div>

      <div className="right-panel">
        <div className="controls">
          <h5>Choose a language:</h5>
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <button className="run-button" onClick={handleRun}>▶️ RUN</button>
        </div>

        <div className="editor-wrapper">
          <Editor
            height="100%"
            width="100%"
            language={language}
            defaultValue="// Write your code here"
            theme="vs-dark"
          />

          {showOutput && (
            <div
              className="floating-output"
              style={{ height: `${outputHeight}px` }}
            >
              <div
                className="resize-handle"
                onMouseDown={startResize}
                title="Drag to resize"
              />
              <div className="output-header">
                <span>Output</span>
                <button className="close-output" onClick={handleCloseOutput}>
                  ✖
                </button>
              </div>
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
