# Express.js REST API with Security Best Practices

REST API backend yang telah ditingkatkan dengan standar arsitektur bersih (*Clean Architecture: Routes -> Middlewares -> Controllers -> Services -> Database*) dan praktik keamanan Express.js serta OWASP.

---

## 🏛️ Struktur Database (ERD)

Berdasarkan skema diagram:
- **`category`**: `id`, `name`, `description`, `created_at`, `edited_at`
- **`suppliers`**: `id`, `name`, `phone`, `address`, `email`, `created_at`
- **`products`**: `id`, `code`, `name`, `category_id` (FK), `supplier_id` (FK), `price`, `stock`, `created_at`, `updated_at`
- **`users`**: `id`, `name`, `email`, `password`, `created_at`, `updated_at`

---

## 🔒 Security Best Practices yang Diterapkan

1. **HTTP Security Headers (`helmet`)**:
   - Proteksi XSS, Clickjacking (`X-Frame-Options`), MIME Sniffing (`X-Content-Type-Options`), dan HSTS.
   - Sembunyikan fingerprint framework dengan `app.disable('x-powered-by')`.

2. **Rate Limiting (`express-rate-limit`)**:
   - **Global Limiter**: 100 request / 15 menit per IP untuk seluruh rute `/api`.
   - **Auth Limiter**: 5 request / 15 menit per IP pada login user.

3. **CORS (Cross-Origin Resource Sharing)**:
   - Dikonfigurasi dinamis sesuai environment (`CORS_ORIGIN`).

4. **Payload Size Limiting (DoS Prevention)**:
   - Batas request body `10kb` (`express.json({ limit: '10kb' })`).

5. **Validasi & Sanitasi Input Terpusat**:
   - Validasi data pengguna, kategori, supplier, dan produk secara menyeluruh.
   - Pembersihan spasi (*trimming*), normalisasi huruf kecil pada email, dan format kode produk.

6. **Integritas Relasi & Proteksi Foreign Key**:
   - Pengecekan keberadaan `category_id` dan `supplier_id` sebelum membuat atau mengupdate produk.
   - Mencegah penghapusan kategori atau supplier yang masih terkait dengan produk.
   - Pengecekan keunikan kode produk (`code`).

7. **Password Hashing & Proteksi Data Sensitif**:
   - Menggunakan `bcrypt` dengan `SALT_ROUNDS=12`.
   - Query tidak pernah mengekspos hash password ke response JSON.

8. **Autentikasi JWT (JSON Web Token)**:
   - Endpoint mutasi (Create, Update, Delete) serta data user dilindungi dengan middleware `authenticate` (Bearer Token).

9. **SQL Injection Mitigation**:
   - Semua query ke database MariaDB menggunakan *parameterized queries* (`?`).

10. **Centralized Error & 404 Handling**:
    - Response JSON konsisten, stack trace disembunyikan pada production mode.

---

## 📌 Daftar Endpoint API

### 1. User & Auth (`/api/users`)
| Method | Endpoint | Proteksi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/login` | Public (Rate Limited) | Login user & generate JWT Token |
| `POST` | `/api/users` | Public (Validated) | Registrasi user baru |
| `GET` | `/api/users/profile` | Bearer Token | Profil user login |
| `GET` | `/api/users` | Bearer Token | Daftar user (paginasi: `?page=1&limit=10`) |
| `GET` | `/api/users/:id` | Bearer Token | Detail user spesifik |
| `PUT` | `/api/users/:id` | Bearer Token | Update user |
| `DELETE` | `/api/users/:id` | Bearer Token | Hapus user |

### 2. Category (`/api/categories`)
| Method | Endpoint | Proteksi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Daftar kategori (`?page=1&limit=10&search=`) |
| `GET` | `/api/categories/:id` | Public | Detail kategori berdasarkan ID |
| `POST` | `/api/categories` | Bearer Token | Tambah kategori baru |
| `PUT` | `/api/categories/:id` | Bearer Token | Update data kategori |
| `DELETE` | `/api/categories/:id` | Bearer Token | Hapus kategori (dicek relasi produknya) |

### 3. Supplier (`/api/suppliers`)
| Method | Endpoint | Proteksi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/suppliers` | Public | Daftar supplier (`?page=1&limit=10&search=`) |
| `GET` | `/api/suppliers/:id` | Public | Detail supplier berdasarkan ID |
| `POST` | `/api/suppliers` | Bearer Token | Tambah supplier baru |
| `PUT` | `/api/suppliers/:id` | Bearer Token | Update data supplier |
| `DELETE` | `/api/suppliers/:id` | Bearer Token | Hapus supplier (dicek relasi produknya) |

### 4. Product (`/api/products`)
| Method | Endpoint | Proteksi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Daftar produk (`?page=1&limit=10&search=&category_id=&supplier_id=`) |
| `GET` | `/api/products/:id` | Public | Detail produk lengkap dengan kategori & supplier |
| `POST` | `/api/products` | Bearer Token | Tambah produk baru (validasi relasi & kode unik) |
| `PUT` | `/api/products/:id` | Bearer Token | Update data produk |
| `DELETE` | `/api/products/:id` | Bearer Token | Hapus produk |

### 5. Utility
| Method | Endpoint | Proteksi | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Cek kesehatan server & koneksi database |