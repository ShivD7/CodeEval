import Editor from "@monaco-editor/react";
import { useState, useRef, useContext } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from 'react-pro-sidebar';
import './ProblemPage.css';
import { Link, useLocation } from "react-router-dom";
import Context from './Context.jsx'

function ProblemPage({title, description}) {
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [outputHeight, setOutputHeight] = useState(200);
  const resizing = useRef(false);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef(null);
  const [code, setCode] = useState("// Write your code here");
  const location = useLocation();
  const userData = useContext(Context);
  const handleRun = async () => {
    setShowOutput(true);
    const submissionArr = userData.submissions;
    const currentpath = location.pathname;
    console.log(code);
    try {
      const response = await fetch("http://localhost:3001/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: btoa(code),
          language: language,
          path: currentpath
        })
      });

      const data = await response.json();
      setOutput(data.output);  // assuming backend responds with { output: "..." }
      submissionArr.push([code, title, data.output]);
    } catch (error) {
      console.error("Error sending code:", error);
      setOutput("Failed to execute code.");
    }
  };




  const handleCloseOutput = () => {
    setOutput('');
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
    <div className="page-wrapper">
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          top: 20,
          left: collapsed ? 60 : 220,
          zIndex: 1000,
          backgroundColor: '#222',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          transition: 'left 0.3s ease',
        }}
      >
        {collapsed ? '☰' : '✖'}
      </button>

      {/* Sidebar with rootStyles */}
      <Sidebar
        collapsed={collapsed}
        ref={sidebarRef}
        width="246px"
        collapsedWidth="60px"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            height: "100vh",
            backgroundColor: "#121212",
            color: "#ffffff",
            borderRight: "1px solid #2a2a2a",
            transition: "width 0.3s ease",
          },
          [`.${menuClasses.button}`]: {
            color: "#ffffff",
            fontSize: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
          },
          [`.${menuClasses.button}:hover`]: {
            backgroundColor: "#2a2a2a",
            color: "#00ffaa",
          },
          [`.${menuClasses.subMenuContent}`]: {
            backgroundColor: "#181818",
            paddingLeft: "1rem",
          },
        }}
      >
        <Menu>
          <MenuItem component={<Link to="/home" />}>🏠 Home</MenuItem>
          <SubMenu label="POWs">
            <MenuItem component={<Link to="/pow1" />}>POW #1</MenuItem>
            <MenuItem component={<Link to="/pow2" />}>POW #2</MenuItem>
            <MenuItem component={<Link to="/pow3" />}>POW #3</MenuItem>
            <MenuItem component={<Link to="/pow4" />}>POW #4</MenuItem>
          </SubMenu>
          <SubMenu label="Monthly Contest">
            <MenuItem component={<Link to="/contest1" />}>Problem #1</MenuItem>
            <MenuItem component={<Link to="/contest2" />}>Problem #2</MenuItem>
            <MenuItem component={<Link to="/contest3" />}>Problem #3</MenuItem>
            <MenuItem component={<Link to="/contest4" />}>Problem #4</MenuItem>
            <MenuItem component={<Link to="/contest5" />}>Problem #5</MenuItem>
          </SubMenu>
          <MenuItem component={<Link to="/submissions" />}>📈 Submissions</MenuItem>
          <MenuItem component={<Link to="/settings" />}>⚙️ Settings</MenuItem>
        </Menu>
      </Sidebar>

      <div className="left-panel">
        <h2>{title}</h2>
        <p>{description}</p>
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
            defaultValue="#Write your code here"
            theme="vs-dark"
            value = {code}
            onChange={(value) => setCode(value ?? "")}
            
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

export default ProblemPage;
