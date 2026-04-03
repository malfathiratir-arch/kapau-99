# 🍛 Rumah Makan Kapau 99 - Full Stack Food Ordering App

Aplikasi pemesanan makanan online lengkap seperti GrabFood, dibangun dengan React + Node.js + MongoDB.

---

## 🛠️ Tech Stack

| Layer     | Teknologi                          |
|-----------|------------------------------------|
| Frontend  | React (Vite) + Tailwind CSS        |
| Backend   | Node.js + Express                  |
| Database  | MongoDB + Mongoose                 |
| Auth      | JWT + bcryptjs                     |
| Storage   | Cloudinary (upload gambar)         |
| HTTP      | Axios                              |
| Routing   | React Router v6                    |

---

## 📁 Struktur Project

```
kapau99/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js     # Konfigurasi Cloudinary & Multer
│   │   └── seed.js           # Script untuk isi data awal
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── petugasController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── auth.js           # JWT protect, adminOnly, staffOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Menu.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── order.js
│   │   ├── petugas.js
│   │   └── ai.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── MenuCard.jsx
    │   │   ├── CartFloating.jsx
    │   │   └── AiChat.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Menu.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── MenuManagement.jsx
    │   │   ├── OrderManagement.jsx
    │   │   └── PetugasManagement.jsx
    │   ├── services/
    │   │   └── api.js          # Axios instance + semua API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 🚀 Cara Install & Menjalankan

### Prasyarat
- **Node.js** v18+ (download: https://nodejs.org)
- **MongoDB** (local atau MongoDB Atlas)
- **Akun Cloudinary** (gratis di https://cloudinary.com)

---

### 1️⃣ Clone / Extract Project

```bash
# Jika dari zip:
unzip kapau99.zip
cd kapau99
```

---

### 2️⃣ Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env dari contoh
cp .env.example .env
```

Edit file `.env` dengan nilai yang benar:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kapau99
JWT_SECRET=kapau99_super_secret_jwt_key_2024
JWT_EXPIRE=7d

# Dari dashboard Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxxx
CLOUDINARY_API_KEY=xxxxxx
CLOUDINARY_API_SECRET=xxxxxx
```

#### Cara mendapatkan Cloudinary credentials:
1. Daftar di https://cloudinary.com (gratis)
2. Login → Dashboard
3. Copy `Cloud Name`, `API Key`, dan `API Secret`

---

### 3️⃣ Isi Data Awal (Seed)

```bash
# Pastikan MongoDB sudah running
npm run seed
```

Ini akan membuat:
- 3 akun demo (admin, petugas, user)
- 12 menu sample (makanan, minuman, nasi)

**Akun Demo:**
| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@kapau99.com      | password123 |
| Petugas | petugas@kapau99.com    | password123 |
| User    | user@kapau99.com       | password123 |

---

### 4️⃣ Jalankan Backend

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Backend berjalan di: `http://localhost:5000`

---

### 5️⃣ Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env
```

Isi `.env` frontend:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 6️⃣ Jalankan Frontend

```bash
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

---

## 🎯 Fitur Lengkap

### 👤 USER (Pelanggan)
- ✅ Register & Login
- ✅ Browse menu (Makanan, Minuman, Nasi)
- ✅ Pencarian menu real-time
- ✅ Tambah ke keranjang dengan jumlah & catatan
- ✅ Edit/hapus item keranjang
- ✅ Checkout dengan form lengkap
- ✅ Pilih metode bayar (COD, Transfer, E-Wallet)
- ✅ Riwayat pesanan dengan detail lengkap
- ✅ AI Chat floating (kanan bawah)

### 👨‍🍳 PETUGAS
- ✅ Login khusus petugas
- ✅ Dashboard statistik
- ✅ CRUD menu + upload gambar ke Cloudinary
- ✅ Kelola pesanan (update status)

### 👑 ADMIN
- ✅ Semua fitur petugas
- ✅ Lihat statistik pendapatan
- ✅ Tambah / hapus petugas
- ✅ Full control semua data

### 🤖 AI Chat
- Keyword-based response (tanpa OpenAI)
- Bisa jawab: menu, harga, rekomendasi, cara pesan, pembayaran
- Quick reply buttons

---

## 🔗 API Endpoints

### Auth
```
POST /api/auth/register          - Daftar user baru
POST /api/auth/login             - Login semua role
GET  /api/auth/me                - Info user login (JWT)
POST /api/auth/create-petugas    - Buat petugas (Admin only)
```

### Menu
```
GET    /api/menu                 - Semua menu (filter: category, search)
GET    /api/menu/:id             - Detail menu
POST   /api/menu                 - Tambah menu (Petugas/Admin)
PUT    /api/menu/:id             - Edit menu (Petugas/Admin)
DELETE /api/menu/:id             - Hapus menu (Petugas/Admin)
```

### Order
```
POST /api/order                  - Buat pesanan (User)
GET  /api/order                  - Semua pesanan (Petugas/Admin)
GET  /api/order/stats            - Statistik (Admin)
GET  /api/order/user/me          - Riwayat pesanan user
PUT  /api/order/:id/status       - Update status (Petugas/Admin)
```

### Petugas
```
GET    /api/petugas              - Daftar petugas (Admin)
DELETE /api/petugas/:id          - Hapus petugas (Admin)
```

### AI
```
POST /api/ai/chat                - Kirim pesan ke AI
```

---

## 🎨 Halaman Frontend

| Path                    | Deskripsi            | Akses       |
|-------------------------|----------------------|-------------|
| `/`                     | Home                 | Publik      |
| `/menu`                 | Daftar menu          | Publik      |
| `/cart`                 | Keranjang            | User login  |
| `/checkout`             | Checkout             | User        |
| `/orders`               | Riwayat pesanan      | User        |
| `/login`                | Login                | Guest       |
| `/register`             | Register             | Guest       |
| `/dashboard`            | Dashboard staff      | Petugas/Admin |
| `/menu-management`      | Kelola menu          | Petugas/Admin |
| `/order-management`     | Kelola pesanan       | Petugas/Admin |
| `/petugas-management`   | Kelola petugas       | Admin only  |

---

## 🐛 Troubleshooting

**MongoDB tidak terhubung:**
```bash
# Pastikan MongoDB service berjalan
# Windows: services.msc → MongoDB
# Mac/Linux:
sudo systemctl start mongod
# atau
brew services start mongodb-community
```

**Cloudinary error saat upload:**
- Cek kembali `.env` backend, pastikan 3 nilai Cloudinary sudah benar
- Cek ukuran file (max 5MB)

**CORS error:**
- Pastikan frontend berjalan di port 5173 atau 3000
- Cek konfigurasi CORS di `server.js`

**Port sudah dipakai:**
```bash
# Ganti PORT di .env backend
PORT=5001
```

---

## 📦 Dependencies Utama

### Backend
- `express` - Web framework
- `mongoose` - ODM MongoDB
- `bcryptjs` - Hash password
- `jsonwebtoken` - JWT auth
- `cloudinary` - Cloud image storage
- `multer` + `multer-storage-cloudinary` - Upload handling
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Frontend
- `react` + `react-dom` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `react-hot-toast` - Notifications
- `tailwindcss` - Utility CSS

---

## 💡 Tips Pengembangan Lanjutan

1. **Tambah OpenAI** - Ganti `aiController.js` dengan OpenAI API untuk respon lebih cerdas
2. **Real-time** - Tambah Socket.io untuk notifikasi pesanan real-time
3. **Rating** - Tambah fitur rating & review menu
4. **Promo** - Tambah sistem voucher & diskon
5. **Notifikasi** - Integrasi WhatsApp API untuk notifikasi pesanan

---

Selamat menggunakan Rumah Makan Kapau 99! 🍛
