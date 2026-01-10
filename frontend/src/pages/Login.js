import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Gagal! Cek email/password.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#452829', textAlign: 'center' }}>Savory Secrets</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={btnStyle}>MASUK</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Belum punya akun? <Link to="/register" style={{ color: '#452829', fontWeight: 'bold' }}>Daftar</Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '15px', border: '1px solid #E8D1C5', width: '350px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E8D1C5', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', background: '#452829', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default Login;