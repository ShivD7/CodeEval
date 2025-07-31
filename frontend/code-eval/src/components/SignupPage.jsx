//password for outlook acc: csclub12!
import {React, useState, useContext} from 'react'
import './SignupPage.css'
import { Form, Input } from 'antd';
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {doCreateUserWithEmailAndPassword, doSignInWithGoogle} from '../firebase/auth';
import {useAuth} from '../contexts/authContext' 
import googleLogo from './googleLogo.jpeg'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import {auth} from "../firebase/firebase"
import Context from './Context.jsx'
const SignupPage = () => {
  const { setUserLoggedIn } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setSignUp] = useState(false)
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isSignUp) {
        setSignUp(true);

        try {
            const userCredentials = await doCreateUserWithEmailAndPassword(email, password);
            const user = userCredentials.user;
            updateProfile(user, {displayName: userName})
            alert("Verify e-mail then proceed to login!")
            await sendEmailVerification(user);
            setUserLoggedIn(false); // Set state to false before redirection
            setSignUp(false);
            navigate('/login'); // Redirect to the next page
        } catch (error) {
            setUserLoggedIn(false); // Set state to false before redirection
            setSignUp(false);

            alert("Error during sign up or verification: " + error.message);
        }
    }
    };


  const onGoogleSignIn = (e) => {
    e.preventDefault()
    try{
        if (!isSignUp){
            setSignUp(true)
            doSignInWithGoogle()
            setUserLoggedIn(false); // Set state to false before redirection
            setSignUp(false);
            navigate('/login'); // Redirect to the next page
        }
    } catch (error){
        setSignUp(false)
        setUserLoggedIn(false)
        alert("Error during sign up: " + error.message)
    }
  }

  const handleChangeUsername = (e) => {
    const newValue = e.target.value;
    setUserName(newValue);
  }

  const handleChangeEmail = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
  }
  const handlePassword = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
  }
  return (
      <div className = "signup-container">
          <div className = "signup-input-box">
              <h1 className = "signup-title">Sign-Up</h1>
              <Form layout="vertical">
              <Form.Item
                  label={<span style={{ color: '#00ffaa'}}>E-mail Address</span>}
                  name="e-mail"
                  rules={[
                  { required: true, message: 'Please input your e-mail!' },
                  ]}
                  help={<span style={{ color: '#00ffaa'}}>Please enter a valid e-mail!</span>}
                  style={{ marginBottom: 30, marginTop: 5, width: 200 }}
              >
                  <Input placeholder="example123@gmail.com" 
                  value = {email}
                  onChange = {handleChangeEmail}/>
              </Form.Item>
              <Form.Item
                  label={<span style={{ color: '#00ffaa'}}>Username</span>}
                  name="username"
                  rules={[
                  { required: true, message: 'Please input your username!' },
                  ]}
                  style={{ marginBottom: 30, marginTop: 5, width: 200 }}
              >
                  <Input placeholder="_example123" 
                  value = {userName}
                  onChange = {handleChangeUsername}/>
              </Form.Item>
              <Form.Item
                  label={<span style={{ color: '#00ffaa'}}>Password</span>}
                  name="password"
                  rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 8, max: 20, message: 'Must be 8–20 characters long.' }
                  ]}
                  help={<span style={{ color: '#00ffaa'}}>Must be 8–20 characters long.</span>}
                  style={{ marginBottom: 30, width: 200 }}
              >
                  <Input.Password placeholder=""
                  value = {password}
                  onChange = {handlePassword} />
              </Form.Item>
              </Form>
              <button className = "sign-up-button" onClick={onSubmit}>
                  Sign-Up
              </button>
              <hr className="signup-line"></hr>
              <p className = "signupSmallText">OR</p>    
              <button className="google-signup-btn" onClick={onGoogleSignIn} aria-label="Sign up with Google">
                  <img
                      src={googleLogo}
                      alt="Google logo"
                      className="google-icon"
                  />
                  
                  <span>Sign up with Google</span>
              </button>
              
              <h5 className = "sign-up">Already have an account? Log in <Link to="/login">here</Link></h5>
          </div>
      </div>
  )
}

export default SignupPage