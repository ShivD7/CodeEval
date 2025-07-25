//password for outlook acc: csclub!
import {React, useState} from 'react'
import './SignupPage.css'
import { Form, Input } from 'antd';
import {Link, Navigate} from 'react-router-dom'
import {doCreateUserWithEmailAndPassword, doSignInWithGoogle} from '../firebase/auth';
import {useAuth} from '../contexts/authContext' 
import googleLogo from './googleLogo.jpeg'
import { sendEmailVerification } from 'firebase/auth'
const SignupPage = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setSignUp] = useState(false)
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(isSignUp);

    if (!isSignUp) {
        setSignUp(true);

        try {
        const userCredentials = await doCreateUserWithEmailAndPassword(email, password);
        const user = userCredentials.user;

        console.log("User created:", user);

        await sendEmailVerification(user);
        console.log("Verification email sent");
        } catch (error) {
        console.error("Error during sign up or verification:", error.message);
        }
    }
    };


  const onGoogleSignIn = (e) => {
    e.preventDefault()
    if (!isSignUp){
        setSignUp(true)
        doSignInWithGoogle().catch(err => {
            setSignUp(false)
        })
    }
  }

  const changeState = (e) => {
    e.preventDefault()
    setSignUp(false)
  }

  const handleChangeEmail = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
  }
  const handleChangePassword = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
  }
  return (
      <div className = "signup-container">
          {userLoggedIn && (<Navigate to={'/login'} replace = {true}/>)}
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
                  style={{ marginBottom: 60, marginTop: 5, width: 200 }}
              >
                  <Input placeholder="example123@gmail.com" 
                  value = {email}
                  onChange = {handleChangeEmail}/>
              </Form.Item>
              <Form.Item
                  label={<span style={{ color: '#00ffaa'}}>Password</span>}
                  name="password"
                  rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 8, max: 20, message: 'Must be 8–20 characters long.' }
                  ]}
                  help={<span style={{ color: '#00ffaa'}}>Must be 8–20 characters long.</span>}
                  style={{ marginBottom: 50, width: 200 }}
              >
                  <Input.Password placeholder=""
                  value = {password}
                  onChange = {handleChangePassword} />
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