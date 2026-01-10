import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, setUser }) => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Hanya Admin yang mengambil data seluruh user dari backend
    if (user.role === 'ADMIN') {
      axios.get('http://localhost:3000/api/admin/users')
        .then(res => setAllUsers(res.data))
        .catch(err => console.error("Gagal ambil data admin:", err));
    }
  }, [user.role]);

  const generateKey = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/generate-key', { userId: user.id });
      const updatedUser = { ...user, api_key: res.data.api_key };
      
      // Update data di localStorage dan State agar tampilan langsung berubah
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("API Key Berhasil Dibuat!");
    } catch (err) { 
      alert("Gagal generate key"); 
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const tdStyle = { border: '1px solid #E8D1C5', padding: '12px', textAlign: 'left' };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto' }}>
      {/* Header Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#452829', margin: 0 }}>Savory Dashboard</h1>
        <button onClick={logout} style={{ color: '#452829', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      <div style={{ background: '#452829', color: 'white', padding: '15px 25px', borderRadius: '12px', marginBottom: '30px' }}>
        <p style={{ margin: 0 }}>
          Selamat Datang, <strong>{user.username}</strong>! 
          <span style={{ marginLeft: '10px', fontSize: '0.8em', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
            Role: {user.role}
          </span>
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        {user.role === 'ADMIN' ? (
          /* TAMPILAN KHUSUS ADMIN - MONITORING USER */
          <div style={{ background: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #E8D1C5', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#452829', marginTop: 0, marginBottom: '20px' }}>Monitoring List User & API Key</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F3E8DF', color: '#452829' }}>
                    <th style={tdStyle}>ID</th>
                    <th style={tdStyle}>Username</th>
                    <th style={tdStyle}>Email</th>
                    <th style={tdStyle}>API Key Terdaftar</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length > 0 ? (
                    allUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #F3E8DF' }}>
                        <td style={tdStyle}>{u.id}</td>
                        <td style={tdStyle}>{u.username}</td>
                        <td style={tdStyle}>{u.email}</td>
                        <td style={tdStyle}>
                          <code style={{ background: '#F3E8DF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em' }}>
                            {u.api_key || 'Belum Ada'}
                          </code>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Memuat data user...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* TAMPILAN KHUSUS USER BIASA - MANAJEMEN KEY */
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #E8D1C5', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#452829', marginTop: 0 }}>API Key Manager</h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>Gunakan API Key ini untuk mengakses pencarian resep global di menu Explorer.</p>
            
            <div style={{ 
              background: '#F3E8DF', 
              padding: '20px', 
              margin: '20px 0', 
              fontFamily: 'monospace', 
              borderRadius: '10px', 
              fontSize: '1.2em', 
              fontWeight: 'bold', 
              color: '#452829', 
              border: '2px dashed #452829',
              wordBreak: 'break-all'
            }}>
              {user.api_key || 'Silakan Generate Key Baru'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={generateKey} style={{ background: '#452829', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                GENERATE / REFRESH API KEY
              </button>
              <button onClick={() => navigate('/recipes')} style={{ background: '#E8D1C5', color: '#452829', padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                BUKA EXPLORER RESEP →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;