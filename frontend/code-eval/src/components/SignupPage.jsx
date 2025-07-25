import {React, useState} from 'react'
import './SignupPage.css'
import { Form, Input } from 'antd';
import {Link, Navigate} from 'react-router-dom'
import {doCreateUserWithEmailAndPassword, doSignInWithGoogle} from '../firebase/auth';
import {useAuth} from '../contexts/authContext' 
import googleLogo from './googleLogo.jpeg'
const SignupPage = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setSignUp] = useState(false)
  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isSignUp){
        setSignUp(true)
        await doCreateUserWithEmailAndPassword(email, password)
    }

  }

  const onGoogleSignIn = (e) => {
    e.preventDefault()
    if (!isSignUp){
        setSignUp(true)
        doSignInWithGoogle().catch(err => {
            setSignUp(false)
        })
    }
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
    <div className = "main-container">
        {userLoggedIn && (<Navigate to={'/home'} replace = {true}/>)}
        <div className = "input-box">
            <h1 className = "main-title">Sign-Up</h1>
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
            <button className = "log-in-button" onClick={onSubmit}>
                Sign-Up
            </button>
            <hr className="line"></hr>
            <p className = "smallText">OR</p>    
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