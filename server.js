// server.js - Template untuk Vercel Serverless Function

// 1. Impor semua yang dibutuhkan
// Pastikan baris ini ada di paling atas untuk membaca file .env
require('dotenv').config(); 
const express = require('express');
const getDbConnection = require('./lib/db'); // Asumsi file db.js ada di folder /lib

// 2. Inisialisasi aplikasi Express
const app = express();
// Middleware untuk ngebolehin Express baca body dalam format JSON dari request
app.use(express.json()); 

// 3. DEFINISIKAN SEMUA RUTE (ROUTES) LU DI SINI

// Contoh rute selamat datang untuk halaman utama
app.get('/', (req, res) => {
  res.status(200).send('API Server is running! Koneksi ke database berhasil.');
});

// Endpoint untuk MENAMBAH data kasus baru
app.post('/kasus', async (req, res) => {
  // Ambil data yang dikirim dari frontend (FlutterFlow)
  const {
    nomor_epid,
    nama_kasus,
    jenis_kelamin,
    tgl_lahir, // Asumsi format YYYY-MM-DD
    alamat,
    kecamatan,
    kelurahan
  } = req.body;

  // Validasi sederhana (pastikan data penting ada)
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
    const values = [
      nomor_epid,
      nama_kasus,
      jenis_kelamin,
      tgl_lahir,
      alamat,
      kecamatan,
      kelurahan,
      'Hidup' // Ngasih nilai default
    ];

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

// Nanti kalau lu mau bikin rute GET /kasus, POST /login, dll, taro di sini juga...
// app.get('/kasus', ...)
// app.post('/login', ...)


// 4. EKSPOR APLIKASI EXPRESS-NYA
// Vercel akan otomatis mengambil 'app' ini dan menjalankannya sebagai serverless function.
// Kita TIDAK perlu `app.listen()`.
module.exports = app;