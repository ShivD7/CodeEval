import Submission from './Submission'
import { useState, useRef, useContext } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import {Link} from 'react-router-dom'
import './SubmissionPage.css'
import Context from './Context.jsx'


const SubmissionPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef();
  const userData = useContext(Context);
  const submissionArr = userData.submissions;
  if (submissionArr.length ===0){
    return(
    <div className = "layout">
<button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: 20,
          left: collapsed ? 60 : 246,
          zIndex: 1000,
          backgroundColor: "#222",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          transition: "left 0.3s ease",
        }}
      >
        {collapsed ? "☰" : "✖"}
      </button>

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
      <div className="submission-container no-submissions">
        
        <div className="message-card">
          <h2>No Submissions Yet</h2>
          <p>
            You haven't submitted any solutions yet. Try solving a problem and submit your code
            to see the results here. Happy coding! 🚀
          </p>
        </div>
      </div>
    </div>
    )
  } else{
  return (
    <div className = "layout">
        <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
            position: "absolute",
            top: 20,
            left: collapsed ? 60 : 246,
            zIndex: 1000,
            backgroundColor: "#222",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            transition: "left 0.3s ease",
            }}
        >
            {collapsed ? "☰" : "✖"}
        </button>

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
        <div className = "submissions">
            {submissionArr
                .slice(-2) // get last 2 submissions
                .reverse() 
                .map((submission, index) => (

                <Submission
                    key={index}
                    code={submission[0]}
                    title={submission[1]}
                    resultString={submission[2]}
                />
                ))}
        </div>
    </div>
  )
}
}

export default SubmissionPage;