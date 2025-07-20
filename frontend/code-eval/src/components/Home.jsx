import { useState, useRef } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import "./Home.css";
import {Link} from 'react-router-dom'


function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef();

  return (
    <div className="home-layout">
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
            <MenuItem component={<Link to="/monthlyQ1" />}>Problem #1</MenuItem>
            <MenuItem component={<Link to="/monthlyQ2" />}>Problem #2</MenuItem>
            <MenuItem component={<Link to="/monthlyQ3" />}>Problem #3</MenuItem>
            <MenuItem component={<Link to="/monthlyQ4" />}>Problem #4</MenuItem>
            <MenuItem component={<Link to="/monthlyQ5" />}>Problem #5</MenuItem>
          </SubMenu>
          <MenuItem component={<Link to="/submissions" />}>📈 Submissions</MenuItem>
          <MenuItem component={<Link to="/settings" />}>⚙️ Settings</MenuItem>
        </Menu>
      </Sidebar>

      <div className="home-content">
        <h1>Welcome to <span className="highlight">CodeEval</span></h1>
        <p>
          CodeEval is the official competitive programming platform for our CS Club.
          Every month, we host curated contests designed to challenge and sharpen your problem-solving skills.
          You can also tackle our weekly <strong>Problem of the Week (POW)</strong> to stay sharp and consistent.
        </p>
        <p>
          Whether you're a beginner looking to practice or a seasoned coder aiming for mastery,
          CodeEval provides a structured and supportive environment to grow.
        </p>
        <p>
          Track your submissions, compete with peers, and climb the leaderboard. Let’s level up together!
        </p>
      </div>
    </div>
  );
}

export default Home;
