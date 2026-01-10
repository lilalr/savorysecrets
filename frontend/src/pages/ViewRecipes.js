import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewRecipes = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State baru untuk fitur Show Response
  const [rawResponse, setRawResponse] = useState(null);
  const [viewMode, setViewMode] = useState('visual'); // 'visual' atau 'response'

  const searchRecipes = async () => {
    if (!query) return;
    setLoading(true);
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    
    try {
      const res = await axios.get(url);
      
      // Simpan data teknis untuk fitur Show Response
      setRawResponse({
        call: url,
        code: res.status,
        headers: res.headers,
        body: res.data
      });

      setRecipes(res.data.meals || []);
      setViewMode('visual'); // Reset ke tampilan visual setiap kali cari baru
    } catch (err) {
      alert("Gagal mengambil data dari TheMealDB.");
    } finally {
      setLoading(false);
    }
  };

  const codeBoxStyle = {
    background: '#2d2d2d',
    color: '#a6e22e',
    padding: '15px',
    borderRadius: '8px',
    overflowX: 'auto', // Tetap ada scrollbar jika teks sangat panjang
    whiteSpace: 'pre-wrap', // INI KUNCINYA: agar teks otomatis pindah ke baris baru (wrap)
    wordBreak: 'break-all', // Memastikan kata yang sangat panjang tidak merusak layout
    fontFamily: 'monospace',
    marginBottom: '20px',
    textAlign: 'left',
    fontSize: '14px',
    maxWidth: '100%', // Memastikan tidak lebih lebar dari kontainer putihnya
    boxSizing: 'border-box'
  };

  const cardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    border: '1px solid #E8D1C5',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto', backgroundColor: '#FDF8F5', minHeight: '100vh' }}>
      <Link to="/dashboard" style={{ color: '#452829', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Kembali ke Dashboard
      </Link>
      
      <h1 style={{ color: '#452829', marginTop: '20px' }}>TheMealDB Explorer 🍲</h1>
      <p style={{ color: '#666' }}>Cari resep masakan dunia (Gunakan Bahasa Inggris: Chicken, Beef, Dessert).</p>

      {/* Box Pencarian */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #E8D1C5', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Cari resep... (contoh: Chicken)" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E8D1C5', boxSizing: 'border-box', marginBottom: '10px' }}
        />
        <button 
          onClick={searchRecipes} 
          style={{ width: '100%', padding: '12px', background: '#452829', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'MENCARI...' : 'CARI RESEP'}
        </button>

        {/* Tombol Show Response */}
        {rawResponse && (
          <button 
            onClick={() => setViewMode(viewMode === 'visual' ? 'response' : 'visual')}
            style={{ marginTop: '10px', width: '100%', padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            {viewMode === 'visual' ? 'Show Response' : 'Show Recipes'}
          </button>
        )}
      </div>

      {/* KONTEN UTAMA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        {/* TAMPILAN 1: VISUAL (KARTU RESEP) */}
        {viewMode === 'visual' && (
          recipes.length > 0 ? (
            recipes.map((r) => (
              <div key={r.idMeal} style={cardStyle}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <img src={r.strMealThumb} alt={r.strMeal} style={{ width: '150px', height: '150px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ margin: '0 0 5px 0', color: '#452829' }}>{r.strMeal}</h2>
                    <span style={{ background: '#E8D1C5', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', marginRight: '5px' }}>{r.strCategory}</span>
                    <span style={{ background: '#F3E8DF', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>{r.strArea}</span>
                    <p style={{ fontSize: '14px', color: '#555', marginTop: '15px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.strInstructions}
                    </p>
                  </div>
                </div>
                {r.strYoutube && (
                  <a href={r.strYoutube} target="_blank" rel="noopener noreferrer" style={{ textAlign: 'center', background: '#FF0000', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                    Tonton Tutorial YouTube 🎥
                  </a>
                )}
              </div>
            ))
          ) : (
            !loading && <p style={{ textAlign: 'center', color: '#999' }}>Ketik nama bahan/masakan dan klik Cari.</p>
          )
        )}

        {/* TAMPILAN 2: RESPONSE (DEVELOPER VIEW) */}
        {viewMode === 'response' && rawResponse && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #E8D1C5' }}>
            <h3 style={{ color: '#452829' }}>Call</h3>
            <div style={codeBoxStyle}>{rawResponse.call}</div>

            <h3 style={{ color: '#452829' }}>Response Code</h3>
            <div style={codeBoxStyle}>{rawResponse.code}</div>

            <h3 style={{ color: '#452829' }}>Response Headers</h3>
            <pre style={codeBoxStyle}>{JSON.stringify(rawResponse.headers, null, 2)}</pre>

            <h3 style={{ color: '#452829' }}>Response Body</h3>
            <pre style={codeBoxStyle}>{JSON.stringify(rawResponse.body, null, 2)}</pre>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewRecipes;