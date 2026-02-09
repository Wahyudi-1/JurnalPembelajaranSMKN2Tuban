/**
 * =================================================================
 * SCRIPT OTENTIKASI - SISTEM JURNAL & DISIPLIN GURU
 * =================================================================
 * @version 1.0 - Khusus untuk Halaman Login
 * @author Disesuaikan oleh AI untuk Proyek Anda
 *
 * Script ini mengelola semua logika untuk halaman login, termasuk:
 * - Login pengguna.
 * - Penanganan lupa password & reset password.
 * - Pengecekan sesi untuk mengalihkan pengguna yang sudah login.
 */

// ====================================================================
// TAHAP 1: KONFIGURASI SUPABASE (DIPERBARUI)
// ====================================================================

const SUPABASE_URL = 'https://lkxjgsgkajpaloswedck.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreGpnc2drYWpwYWxvc3dlZGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDEyMjQsImV4cCI6MjA4NjE3NzIyNH0.A2KeArJQz6TNtLauZSyurMit3IK4hClwdoy4_qicPUc';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ====================================================================
// TAHAP 2: FUNGSI PEMBANTU (UI HELPERS)
// ====================================================================

/**
 * Menampilkan atau menyembunyikan indikator loading.
 * @param {boolean} isLoading - True untuk menampilkan, false untuk menyembunyikan.
 */
function showLoading(isLoading) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) loader.style.display = isLoading ? 'flex' : 'none';
}

/**
 * Menampilkan pesan status (error, success, info) kepada pengguna.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - Tipe pesan ('info', 'success', 'error').
 * @param {number} duration - Durasi tampilan pesan dalam milidetik.
 */
function showStatusMessage(message, type = 'info', duration = 4000) {
    const statusEl = document.getElementById('statusMessage');
    if (!statusEl) { alert(message); return; }
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    window.scrollTo(0, 0);
    if (duration > 0) {
        setTimeout(() => { statusEl.style.display = 'none'; }, duration);
    }
}


// ====================================================================
// TAHAP 3: FUNGSI OTENTIKASI & MANAJEMEN SESI
// ====================================================================

/**
 * Memeriksa sesi pengguna. Jika sudah login, alihkan ke dashboard.
 */
async function checkSessionForLoginPage() {
    const { data: { session } } = await supabase.auth.getSession();
    // Jika ada sesi aktif dan URL tidak mengandung token recovery password,
    // berarti pengguna sudah login dan tidak seharusnya berada di halaman ini.
    if (session && !window.location.hash.includes('type=recovery')) {
        window.location.replace('dashboard.html');
    }
}

/**
 * Menangani proses login pengguna.
 */
async function handleLogin() {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        return showStatusMessage('Email dan password harus diisi.', 'error');
    }

    showLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    showLoading(false);

    if (error) {
        return showStatusMessage(`Login Gagal: ${error.message}`, 'error');
    }
    
    // Jika berhasil, pengalihan akan terjadi secara otomatis atau bisa ditambahkan di sini.
    window.location.href = 'dashboard.html';
}

/**
 * Menangani permintaan reset password.
 */
async function handleForgotPassword() {
    const emailEl = document.getElementById('username');
    const email = emailEl.value;

    if (!email) {
        return showStatusMessage('Silakan masukkan alamat email Anda, lalu klik "Lupa Password?".', 'error');
    }

    if (!confirm(`Anda akan mengirimkan link reset password ke alamat: ${email}. Lanjutkan?`)) {
        return;
    }

    showLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/index.html', // Arahkan kembali ke halaman login
    });
    showLoading(false);

    if (error) {
        return showStatusMessage(`Gagal mengirim email: ${error.message}`, 'error');
    }
    
    showStatusMessage('Email untuk reset password telah dikirim! Silakan periksa kotak masuk Anda.', 'success');
}

/**
 * Mengatur fungsi toggle untuk melihat/menyembunyikan password.
 */
function setupPasswordToggle() {
    const toggleIcon = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (!toggleIcon || !passwordInput) return;

    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>`;
    const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.94 5.94 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.288.822.822.083.083.083.083a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829l.822.822.083.083z"/><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 6.884-12-12 .708-.708 12 12-.708.708z"/></svg>`;
    
    toggleIcon.innerHTML = eyeIcon;
    toggleIcon.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleIcon.innerHTML = isPassword ? eyeSlashIcon : eyeIcon;
    });
}

/**
 * Mendengarkan perubahan status otentikasi, khususnya untuk password recovery.
 */
function setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
            const loginBox = document.querySelector('.login-box');
            const resetContainer = document.getElementById('resetPasswordContainer');
            if (!loginBox || !resetContainer) return;
            
            // Sembunyikan form login, tampilkan form reset password
            loginBox.style.display = 'none';
            resetContainer.style.display = 'grid';

            // Tambahkan event listener untuk form reset password
            document.getElementById('resetPasswordForm').onsubmit = async (e) => {
                e.preventDefault();
                const newPassword = document.getElementById('newPassword').value;
                if (!newPassword || newPassword.length < 6) {
                    return showStatusMessage('Password baru minimal 6 karakter.', 'error');
                }
                
                showLoading(true);
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                showLoading(false);
                
                if (error) {
                    return showStatusMessage(`Gagal memperbarui password: ${error.message}`, 'error');
                }
                
                showStatusMessage('Password berhasil diperbarui! Anda akan diarahkan ke halaman login.', 'success', 3000);
                setTimeout(() => { 
                    window.location.hash = ''; // Hapus token dari URL
                    window.location.reload(); 
                }, 3000);
            };
        }
    });
}


// ====================================================================
// TAHAP 4: INISIALISASI HALAMAN LOGIN
// ====================================================================

/**
 * Fungsi utama untuk menginisialisasi semua fungsionalitas di halaman login.
 */
function initLoginPage() {
    checkSessionForLoginPage();
    setupAuthListener();
    setupPasswordToggle();

    const loginForm = document.querySelector('.login-box form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleForgotPassword();
        });
    }
}

// --- Titik Masuk Aplikasi ---
// Jalankan fungsi inisialisasi setelah seluruh konten halaman dimuat.
document.addEventListener('DOMContentLoaded', initLoginPage);
