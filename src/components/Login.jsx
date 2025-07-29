import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Login.module.css';
import googleLogo from '../assets/download.png';
import AppContext from '../Context/Context.jsx'
import API from '../axios.jsx';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setRole } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // If already logged in, prevent duplicate login
    if (localStorage.getItem('token') && localStorage.getItem('role')) {
      alert('You are already logged in.');
      navigate('/');
      return;
    }

    try {
      const response = await API.post('user/login', {
        username,
        password,
      });

      console.log(response)

      const token = response.data.token;
      const role = response.data.role;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Save role to context
      setRole(role);

      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.divider}>OR</div>

        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          <img
            src={googleLogo}
            alt="Google logo"
            className={styles.googleLogo}
          />
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
