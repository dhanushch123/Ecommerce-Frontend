// Register.jsx
import React, { useState } from 'react';
import styles from './Register.module.css';
import Img from '../assets/site-ecommerce.jpg';
import API from '../axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    roles: '',
    email: '',
    mobileNumber: '',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.roles = [formData.roles]
      console.log("In submit method")
      const res = await API.post('user/register', formData);
      if (res.status === 201) {
        alert(res.data); // Shows: "User registered Successfully"
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration failed:', err.response.data);
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src={Img} alt="register" />
      </div>
      <div className={styles.formSection}>
        <h2>Register</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
          <div className={styles.gender}>
            <label>
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === 'MALE'}
                onChange={handleChange}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === 'FEMALE'}
                onChange={handleChange}
                required
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="OTHER"
                checked={formData.gender === 'OTHER'}
                onChange={handleChange}
                required
              />
              Other
            </label>
          </div>
          <button>Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
