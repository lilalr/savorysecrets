import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/register', formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login');
    } catch (err) {
      alert("Registrasi Gagal! Username atau Email mungkin sudah digunakan.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center' }}>Daftar</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Username" style={inputStyle} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email" style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" style={btnStyle}>DAFTAR</button>
        </form>
        <p style={{ textAlign: 'center' }}>Sudah punya akun? <Link to="/login" style={{ color: '#452829' }}>Login</Link></p>
      </div>
    </div>
  );
};

// Style (bisa dipindah ke App.css nanti)
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' };
const cardStyle = { background: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #E8D1C5', width: '350px' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #E8D1C5', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', background: '#452829', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default Register;