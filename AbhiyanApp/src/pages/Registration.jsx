import React, { useState } from 'react';
import "../css/Reg_style.css";
import { useNavigate } from 'react-router-dom';

const Registration = ({toRegisteration,toParent}) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '' });
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const nav=useNavigate();
  const handleToggleMode = () => {
    setIsSignUpMode((prevMode) => !prevMode);
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpForm),
      });
      const data = await response.json();

      if (response.ok) {
        toRegisteration(signUpForm.email)
        nav("/pages/details.js"); // Redirect on success
      } else {
        alert(data.error);
      }
    }
   catch (error) {
      console.error('Error:', error);
      alert('An error occurred while signing up.');
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInForm),
      });
      const data = await response.json();

      if (response.ok) {
        //alert(data.message);
        toParent(data.details);
        nav("/pages/Recommend.js"); // Redirect on success
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while signing in.');
    }
  };

  return (

    /*<div className={`cont ${isSignUpMode ? 's--signup' : ''}`}>*/
    <div className={`cont ${isSignUpMode ? 's--signup' : ''}`}>
      <div className="form sign-in">
        <h2>Welcome</h2>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={signInForm.email}
            onChange={handleSignInChange}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={signInForm.password}
            onChange={handleSignInChange}
          />
        </label>
        <p className="forgot-pass">Forgot password?</p>
        <button type="button" className="submit" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>Don't have an account? Please Sign up!</h3>
          </div>
          <div className="img__text m--in">
            <h3>If you already have an account, just sign in.</h3>
          </div>
          <div className="img__btn" onClick={handleToggleMode}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>
        <div className="form sign-up">
          <h2>Create your Account</h2>
          <label>
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={signUpForm.name}
              onChange={handleSignUpChange}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={signUpForm.email}
              onChange={handleSignUpChange}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={signUpForm.password}
              onChange={handleSignUpChange}
            />
          </label>
          <button type="button" className="submit" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </div>

  );

  // return (
  //   <div>
  //   <h1>hello from reg</h1>
  //  </div>

  // )
}

export default Registration;
