// =================================================================
// TAHAP 1: IMPORT PERKAKAS YANG UDAH DI-INSTALL
// =================================================================
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// =================================================================
// TAHAP 2: INISIALISASI & KONFIGURASI DASAR
// =================================================================
const app = express();

// Gunakan 'cors' biar API bisa diakses dari mana aja (termasuk FlutterFlow)
app.use(cors());

// Gunakan 'express.json()' biar API kita ngerti cara baca data format JSON
// yang nanti dikirim dari aplikasi FlutterFlow
app.use(express.json());

// =================================================================
// TAHAP 3: KONFIGURASI KONEKSI KE DATABASE MYSQL
// =================================================================
// Ganti bagian ini dengan data koneksi MySQL lu sendiri
const db = mysql.createConnection({
    host: 'localhost',          // Biasanya 'localhost' kalau database di komputer yang sama
    user: 'root',               // Username MySQL lu, defaultnya seringkali 'root'
    password: '',    // GANTI DENGAN PASSWORD MYSQL LU
    database: 'dashboard_mr01',     // GANTI DENGAN NAMA DATABASE LU
    port: DB_PORT,
    ssl: {
        rejectUnauthorized: true // Ini wajib untuk Aiven
      }  
});

// Cek koneksi ke database pas pertama kali API jalan
db.connect(err => {
    if (err) {
        console.error('!!! KONEKSI KE DATABASE GAGAL !!!');
        console.error(err);
        return;
    }
    console.log('>>> Berhasil terkoneksi ke database MySQL.');
});

// =================================================================
// TAHAP 4: BIKIN ENDPOINT (PINTU-PINTU API)
// =================================================================

// Pintu #1: GET /kasus -> Buat ambil SEMUA data kasus
app.get('/kasus', (req, res) => {
    const sql = "SELECT * FROM kasus_mr01";
    db.query(sql, (err, data) => {
        // Kalau ada error pas query, kirim pesan error
        if (err) {
            console.error("Error di GET /kasus:", err);
            return res.status(500).json({ message: "Gagal mengambil data dari server." });
        }
        // Kalau berhasil, kirim semua datanya dalam format JSON
        console.log("Sukses melayani GET /kasus");
        return res.json(data);
    });
});

// Pintu #2: POST /kasus -> Buat nyimpen SATU data kasus baru
app.post('/kasus', (req, res) => {
    // req.body berisi data JSON yang dikirim dari FlutterFlow
    console.log("Menerima data baru:", req.body);
    
    // Ini cuma contoh beberapa kolom, lu harus lengkapin sesuai tabel lu
    const { 
        Kabupaten, 
        Nomor_EPID, 
        Nama_kasus,
        Jenis_kelamin,
        // ... LENGKAPI SEMUA KOLOM LAINNYA DI SINI
        Keadaan_saat_ini 
    } = req.body;

    const sql = `INSERT INTO kasus_mr01 
                 (Kabupaten, Nomor_EPID, Nama_kasus, Jenis_kelamin, Keadaan_saat_ini) 
                 VALUES (?)`;
    
    const values = [
        Kabupaten, 
        Nomor_EPID,
        Nama_kasus,
        Jenis_kelamin,
        // ... LENGKAPI SEMUA NILAI LAINNYA DI SINI SESUAI URUTAN
        Keadaan_saat_ini
    ];

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error di POST /kasus:", err);
            return res.status(500).json({ message: "Gagal menyimpan data." });
        }
        console.log("Sukses menyimpan data baru dengan ID:", result.insertId);
        return res.status(201).json({ message: "Data berhasil dibuat!", insertId: result.insertId });
    });
});

// TAMBAHKAN BARIS INI SEBAGAI PENGGANTINYA
module.exports = app;