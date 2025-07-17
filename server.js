require('dotenv').config();

// Debug environment variables
console.log('=== DEBUG ENV VARS ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('====================');

const express = require('express');

// Pastikan path ke file db.js ini sudah benar
const getDbConnection = require('./db'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca body JSON
app.use(express.json());

// =================================
// == SEMUA RUTE API TARO DI SINI ==
// =================================

// Rute utama untuk tes
app.get('/', (req, res) => {
  res.send('API Server is running!');
});

// Rute untuk mengambil semua data kasus
app.get('/kasus', async (req, res) => {
  try {
    const db = await getDbConnection();
    const sql = "SELECT * FROM `data_mr01_serang` ORDER BY id DESC;";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Gagal mengambil data:', error);
    res.status(500).json({ message: "Error: Gagal mengambil data dari database." });
  }
});

// Rute untuk menambah data kasus baru
app.post('/kasus', async (req, res) => {
  const { nomor_epid, nama_kasus, jenis_kelamin, tgl_lahir, alamat, kecamatan, kelurahan } = req.body;

  if (!nomor_epid || !nama_kasus || !tgl_lahir) {
    return res.status(400).json({ message: 'Error: nomor_epid, nama_kasus, dan tgl_lahir wajib diisi.' });
  }

  try {
    const db = await getDbConnection();
    const sql = `
      INSERT INTO data_mr01_serang 
      (nomor_epid, nama_kasus, jenis_kelamin, tgl_lahir, alamat, kecamatan, kelurahan, keadaan_saat_ini) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [nomor_epid, nama_kasus, jenis_kelamin, tgl_lahir, alamat, kecamatan, kelurahan, 'Hidup'];
    const [result] = await db.query(sql, values);
    res.status(201).json({ 
      message: 'Data kasus baru berhasil dibuat!', 
      insertedId: result.insertId 
    });
  } catch (error) {
    console.error('Gagal memasukkan data kasus baru:', error);
    res.status(500).json({ message: 'Error: Gagal menyimpan data ke database.' });
  }
});

// =================================
// == JALANKAN SERVER ==
// =================================
app.listen(PORT, () => {
  console.log(`>>> Server berhasil jalan di port ${PORT}`);
});