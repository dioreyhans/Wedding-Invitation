// Data untuk menyimpan ucapan
let ucapanData = [];
let currentPage = 1;
const itemsPerPage = 5;

// Objek untuk pagination
const pagination = {
    next: function() {
        currentPage++;
        displayUcapan();
    },
    previous: function() {
        if (currentPage > 1) {
            currentPage--;
            displayUcapan();
        }
    }
};

// Fungsi untuk mengirim ucapan baru
function kirim() {
    const nama = document.getElementById('formnama').value.trim();
    const hadiran = document.getElementById('hadiran').value;
    const pesan = document.getElementById('formpesan').value.trim();
    
    // Validasi form
    if (!nama) {
        alert('Silakan isi nama Anda');
        return;
    }
    
    if (hadiran === '0') {
        alert('Silakan konfirmasi kehadiran Anda');
        return;
    }
    
    if (!pesan) {
        alert('Silakan tulis ucapan dan doa Anda');
        return;
    }
    
    // Buat objek ucapan baru
    const ucapan = {
        id: Date.now(),
        nama: nama,
        hadiran: hadiran,
        pesan: pesan,
        tanggal: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Simpan ke array
    ucapanData.unshift(ucapan); // Tambahkan di awal array
    
    // Reset form
    document.getElementById('formnama').value = '';
    document.getElementById('hadiran').value = '0';
    document.getElementById('formpesan').value = '';
    
    // Simpan ke localStorage
    localStorage.setItem('ucapanData', JSON.stringify(ucapanData));
    
    // Tampilkan ucapan
    currentPage = 1;
    displayUcapan();
    
    alert('Terima kasih atas ucapan dan doanya!');
}

// Fungsi untuk menampilkan ucapan
function displayUcapan() {
    // Ambil data dari localStorage jika ada
    const savedData = localStorage.getItem('ucapanData');
    if (savedData) {
        ucapanData = JSON.parse(savedData);
    }
    
    const daftarucapan = document.getElementById('daftarucapan');
    daftarucapan.innerHTML = '';
    
    // Hitung total halaman
    const totalPages = Math.ceil(ucapanData.length / itemsPerPage);
    
    // Update status pagination
    document.getElementById('previous').classList.toggle('disabled', currentPage === 1);
    document.getElementById('next').classList.toggle('disabled', currentPage === totalPages || ucapanData.length === 0);
    
    // Potong data untuk halaman saat ini
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUcapan = ucapanData.slice(startIndex, endIndex);
    
    if (currentUcapan.length === 0) {
        daftarucapan.innerHTML = '<div class="text-center py-3">Belum ada ucapan</div>';
        return;
    }
    
    // Buat elemen untuk setiap ucapan
    currentUcapan.forEach(ucapan => {
        const ucapanElement = document.createElement('div');
        ucapanElement.className = 'card border-0 shadow-sm mb-3';
        ucapanElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title mb-0">${ucapan.nama}</h5>
                    <small class="text-muted">${ucapan.tanggal}</small>
                </div>
                <div class="d-flex align-items-center mb-2">
                    <span class="badge ${ucapan.hadiran === '1' ? 'bg-success' : 'bg-secondary'} me-2">
                        ${ucapan.hadiran === '1' ? 'Hadir' : 'Berhalangan'}
                    </span>
                </div>
                <p class="card-text">${ucapan.pesan}</p>
            </div>
        `;
        daftarucapan.appendChild(ucapanElement);
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    displayUcapan();
    
    // Sembunyikan tombol balasan yang tidak digunakan
    document.getElementById('batal').style.display = 'none';
    document.getElementById('kirimbalasan').style.display = 'none';
});