import {React, useState} from 'react'
import './LoginPage.css'
import { Form, Input } from 'antd';
import {Link, Navigate} from 'react-router-dom'
import {doSignInWithEmailAndPassword, doSignInWithGoogle} from '../firebase/auth';
import {useAuth} from '../contexts/authContext'
import googleLogo from './googleLogo.jpeg' 
const LoginPage = () => {
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleChangeEmail = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
  };

  const handleChangePassword = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
  };

  const handleSwap = (e) => {
    e.preventDefault()
    setIsSigningIn(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isSigningIn){
        setIsSigningIn(true)
        const userCredentials = await doSignInWithEmailAndPassword(email, password);
        const user = userCredentials.user;
        if (!user.emailVerified){
          setUserLoggedIn(false)
          setIsSigningIn(false)
          alert("E-mail not verified!")
        }
    }
  }

  const onGoogleSignIn = (e) => {
    e.preventDefault()
    if (!isSigningIn){
        setIsSigningIn(true)
        doSignInWithGoogle().catch(err => {
            setIsSigningIn(false)
        })
    }
  }
  return (
    <div className = "main-container">
        {userLoggedIn && (<Navigate to={'/home'} replace = {true}/>)}
        <div className = "input-box">
            <h1 className = "main-title">Log-in</h1>
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
                 onChange = {handleChangeEmail}
                 />
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
                 onChange = {handleChangePassword}/>
            </Form.Item>
            </Form>
            <button className = "log-in-button"
            onClick = {onSubmit}>
                Log-In
            </button>
            <hr className="line"></hr>
            <p className = "smallText">OR</p>    
            <button className="google-signup-btn" onClick={onGoogleSignIn} aria-label="Log in with Google">
                <img
                    src={googleLogo}
                    alt="Google logo"
                    className="google-icon"
                />
                
                <span>Log in with Google</span>
            </button>
            <h5 className = "sign-up">Don't have an account? Sign up <Link to="/signup">here</Link></h5>
            <button onClick = {handleSwap}>swap</button>
        </div>
    </div>
  )
}

export default LoginPage