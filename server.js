const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint GET /kasus yang disederhanakan
// Langsung mengembalikan data bohongan tanpa query ke database
app.get('/kasus', (req, res) => {
  console.log("Endpoint /kasus dipanggil (versi simpel)");
  // Kirim data dummy/bohongan untuk ngetes
  res.status(200).json([
    { id: 1, Nama_kasus: "Testing Sukses 1" },
    { id: 2, Nama_kasus: "Testing Sukses 2" }
  ]);
});

// Endpoint POST /kasus yang disederhanakan
app.post('/kasus', (req, res) => {
    console.log("Endpoint POST /kasus dipanggil (versi simpel)");
    res.status(201).json({ message: "Data dummy berhasil diterima" });
});

// Jangan lupa export app-nya untuk Vercel
module.exports = app;