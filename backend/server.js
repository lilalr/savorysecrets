const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middleware wajib agar frontend bisa kirim data
app.use(cors());
app.use(express.json());

// Endpoint untuk mengambil semua user (Hanya untuk Admin)
app.get('/api/admin/users', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT username, email, api_key, role FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Gagal mengambil data user" });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await pool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', 
            [username, email, hashed]
        );
        res.json({ success: true, message: "User Terdaftar!" });
    } catch (err) {
        res.status(500).json({ error: "Registrasi Gagal (Username/Email mungkin sudah ada)" });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ message: "User tidak ditemukan" });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        
        if (!match) return res.status(401).json({ message: "Password salah!" });

        // Kirim data user ke frontend untuk disimpan di localStorage
        res.json({ 
            success: true, 
            user: { id: user.id, username: user.username, role: user.role, api_key: user.api_key } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/generate-key', async (req, res) => {
    const { userId } = req.body;
    const newKey = crypto.randomBytes(16).toString('hex');
    try {
        await pool.execute('UPDATE users SET api_key = ? WHERE id = ?', [newKey, userId]);
        res.json({ success: true, api_key: newKey });
    } catch (err) {
        res.status(500).json({ error: "Gagal membuat API Key" });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, email, api_key, role FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/recipes/search', async (req, res) => {
    const { api_key, q } = req.query;
    try {
        // Validasi Key
        const [user] = await pool.execute('SELECT id FROM users WHERE api_key = ?', [api_key]);
        if (user.length === 0) return res.status(401).json({ message: "API Key Tidak Valid atau Salah" });

        // Cari Resep berdasarkan bahan di tabel ingredients
        const [recipes] = await pool.execute(
            `SELECT DISTINCT r.* FROM recipes r 
             JOIN ingredients i ON r.id = i.recipe_id 
             WHERE i.name LIKE ?`, 
            [`%${q}%`]
        );
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`👉 Link API: http://localhost:${PORT}`);
});