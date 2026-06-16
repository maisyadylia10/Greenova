/* ===== GREENOVA — RTH POLBAN v4 JavaScript FINAL ===== */

/* ============================================================
   STATE — semua data tersimpan localStorage
   ============================================================ */
const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  rm:  k => localStorage.removeItem(k)
};

const DB = {
  isLoggedIn: false,
  inventaris: {
    'z1-taman-an':  [{id:1,nama:'Kursi Taman',jml:3,kondisi:'Baik',ket:'Kayu jati'},{id:2,nama:'Lampu Taman',jml:2,kondisi:'Baik',ket:''},{id:3,nama:'Pohon Peneduh',jml:8,kondisi:'Baik',ket:'Trembesi & Mahoni'},{id:4,nama:'Tempat Sampah',jml:2,kondisi:'Cukup',ket:''}],
    'z1-pendopo':   [{id:1,nama:'Pohon Bambu',jml:12,kondisi:'Baik',ket:'Cluster bambu'},{id:2,nama:'Batu Alam Hias',jml:6,kondisi:'Baik',ket:''},{id:3,nama:'Lampu Solar',jml:1,kondisi:'Perlu Perbaikan',ket:'Baterai lemah'}],
    'z2-sc':        [{id:1,nama:'Tiang Lampu',jml:4,kondisi:'Baik',ket:''},{id:2,nama:'Pagar Besi',jml:1,kondisi:'Cukup',ket:'Sebagian berkarat'},{id:3,nama:'Papan Nama',jml:1,kondisi:'Baik',ket:''}],
    'z2-ilkasi':    [{id:1,nama:'Tiang Bendera',jml:3,kondisi:'Baik',ket:''},{id:2,nama:'Lampu Sorot',jml:6,kondisi:'Baik',ket:'Digunakan malam hari'},{id:3,nama:'Tempat Sampah',jml:4,kondisi:'Baik',ket:''},{id:4,nama:'Pohon Pinggiran',jml:15,kondisi:'Baik',ket:'Angsana & Kiara'}],
    'z3-voli':      [{id:1,nama:'Net Voli',jml:1,kondisi:'Cukup',ket:'Perlu penggantian'},{id:2,nama:'Tiang Net',jml:2,kondisi:'Baik',ket:''},{id:3,nama:'Lampu Lapangan',jml:4,kondisi:'Baik',ket:''}],
    'z3-basket':    [{id:1,nama:'Ring Basket',jml:2,kondisi:'Baik',ket:''},{id:2,nama:'Tiang Ring',jml:2,kondisi:'Baik',ket:''},{id:3,nama:'Lampu Lapangan',jml:4,kondisi:'Cukup',ket:'1 unit mati'}],
    'z3-bola':      [{id:1,nama:'Gawang Bola',jml:2,kondisi:'Cukup',ket:'Cat mulai pudar'},{id:2,nama:'Lampu Sorot',jml:8,kondisi:'Baik',ket:''},{id:3,nama:'Rumput Lapangan',jml:1,kondisi:'Baik',ket:'±7.140 m²'},{id:4,nama:'Pagar Keliling',jml:1,kondisi:'Baik',ket:''}],
    'z4-akuntansi': [{id:1,nama:'Kursi Taman',jml:2,kondisi:'Cukup',ket:'Cat mulai pudar'},{id:2,nama:'Lampu Taman',jml:1,kondisi:'Baik',ket:''},{id:3,nama:'Gazebo',jml:1,kondisi:'Baik',ket:'Kapasitas 8 orang'},{id:4,nama:'Pohon Sukun',jml:10,kondisi:'Baik',ket:''},{id:5,nama:'Pohon Beringin',jml:1,kondisi:'Baik',ket:'Pohon tua ±30 thn'}],
    'z4-edukasi':   [{id:1,nama:'Papan Label Tanaman',jml:24,kondisi:'Cukup',ket:'Beberapa pudar'},{id:2,nama:'Bangku Taman',jml:4,kondisi:'Baik',ket:''},{id:3,nama:'Tanaman Koleksi',jml:40,kondisi:'Baik',ket:'Berbagai spesies'},{id:4,nama:'Lampu Taman',jml:3,kondisi:'Baik',ket:''}]
  },
  maintLog: [],
  tanamanLog: [],
  nextInvId: {}
};

const RTH_NAMES = {
  'z1-taman-an':'Taman Administrasi Niaga','z1-pendopo':'Taman Belakang Pendopo',
  'z2-sc':'Lapangan Samping SC','z2-ilkasi':'Lapangan Ilkasi',
  'z3-voli':'Lapangan Bola Voli','z3-basket':'Lapangan Basket','z3-bola':'Lapangan Bola',
  'z4-akuntansi':'Taman Akuntansi','z4-edukasi':'Taman Edukasi'
};

/* DATA TANAMAN */
const TANAMAN_DB = [
  {nama:'Pohon Trembesi',jenis:'pohon',zona:'z1',lokasi:'Zona 1 — Taman AN',desc:'Pohon peneduh besar dengan tajuk lebar. Tumbuh cepat dan efektif menyerap CO₂.',fungsi:'Peneduh, penyerap polusi, estetika'},
  {nama:'Pohon Mahoni',jenis:'pohon',zona:'z1',lokasi:'Zona 1 — Taman AN',desc:'Pohon kayu keras tropis dengan daun lebat. Cocok sebagai peneduh jalan dan taman.',fungsi:'Peneduh, kayu komersil, estetika'},
  {nama:'Bambu Clump',jenis:'semak',zona:'z1',lokasi:'Zona 1 — Taman Blk. Pendopo',desc:'Bambu berumpun yang membentuk cluster hijau alami sebagai pembatas visual.',fungsi:'Pembatas, resapan air, estetika'},
  {nama:'Pohon Angsana',jenis:'pohon',zona:'z2',lokasi:'Zona 2 — Lapangan Ilkasi',desc:'Pohon peneduh tepi lapangan dengan bunga kuning kecil. Akar kuat dan rindang.',fungsi:'Peneduh, estetika, penyerap debu'},
  {nama:'Pohon Kiara Payung',jenis:'pohon',zona:'z2',lokasi:'Zona 2 — Lapangan Ilkasi',desc:'Pohon dengan tajuk lebar berbentuk payung. Sangat baik sebagai pohon peneduh kampus.',fungsi:'Peneduh, estetika, penyerap panas'},
  {nama:'Rumput Lapangan',jenis:'rumput',zona:'z3',lokasi:'Zona 3 — Lapangan Bola',desc:'Rumput alami lapangan bola. Memerlukan pemangkasan rutin 1–2× per bulan.',fungsi:'Penutup tanah, resapan, olahraga'},
  {nama:'Pohon Sukun',jenis:'pohon',zona:'z4',lokasi:'Zona 4 — Taman Akuntansi',desc:'Pohon buah yang menghasilkan buah sukun. Daun lebar, memberikan naungan yang baik.',fungsi:'Peneduh, buah konsumsi, estetika'},
  {nama:'Pohon Beringin',jenis:'pohon',zona:'z4',lokasi:'Zona 4 — Taman Akuntansi',desc:'Pohon beringin tua ±30 tahun. Ikon taman dengan akar gantung yang khas.',fungsi:'Ikon visual, peneduh, penyerapan air'},
  {nama:'Tanaman Hias Koleksi',jenis:'semak',zona:'z4',lokasi:'Zona 4 — Taman Edukasi',desc:'Koleksi 40+ spesies tanaman hias dan edukatif berlabel. Digunakan sebagai media pembelajaran.',fungsi:'Edukasi, estetika, keanekaragaman hayati'},
  {nama:'Semak Hias',jenis:'semak',zona:'z1',lokasi:'Zona 1 — Taman Blk. Pendopo',desc:'Tanaman semak hias sebagai border dan pembatas area. Dipangkas rutin setiap bulan.',fungsi:'Estetika, pembatas, habitat satwa kecil'},
  {nama:'Pohon Peneduh Campuran',jenis:'pohon',zona:'z2',lokasi:'Zona 2 — Lapangan SC',desc:'Beberapa jenis pohon peneduh di tepi lapangan SC untuk menciptakan koridor hijau.',fungsi:'Peneduh, penyerap CO₂, estetika'},
  {nama:'Rumput Gajah Mini',jenis:'rumput',zona:'z1',lokasi:'Zona 1 — Taman AN',desc:'Rumput penutup tanah di area taman. Tumbuh rapat dan mudah perawatannya.',fungsi:'Penutup tanah, resapan air, estetika'}
];

/* TUGAS HARIAN DEFAULT */
const DEFAULT_TUGAS = [
  {id:'t1',nama:'Penyiraman Zona 1–2',meta:'TPP-001 — Ahmad Fauzi | 07.00–09.00',tim:'TPP-001'},
  {id:'t2',nama:'Penyiraman Zona 3–4',meta:'TPP-002 — Budi Santoso | 09.00–11.00',tim:'TPP-002'},
  {id:'t3',nama:'Penyiangan Gulma Zona 3',meta:'TPR-001 — Citra Lestari | Sesuai jadwal',tim:'TPR-001'},
  {id:'t4',nama:'Pemotongan Rumput Zona 4',meta:'TPM-001 — Dedi Saputra | Sesuai jadwal',tim:'TPM-001'},
  {id:'t5',nama:'Verifikasi & Evaluasi RTH',meta:'KOR-001 — Koordinator | Akhir hari',tim:'KOR-001'}
];

/* ============================================================
   INIT
   ============================================================ */
function init() {
  /* cek login dari localStorage */
  const saved = LS.get('greenova_login');
  if (saved && saved.loggedIn) {
    DB.isLoggedIn = true;
    applyLoggedInUI();
    showPage('beranda');
  } else {
    /* tampilkan halaman login fullscreen */
    showLoginScreen();
  }

  /* init nextInvId */
  Object.keys(DB.inventaris).forEach(k => {
    const ids = DB.inventaris[k].map(i => i.id);
    DB.nextInvId[k] = ids.length ? Math.max(...ids)+1 : 1;
  });

  /* load log dari localStorage */
  DB.maintLog   = LS.get('greenova_maintlog')   || [];
  DB.tanamanLog = LS.get('greenova_tanamanlog') || [];

  /* render tanaman DB */
  renderTanamanDB();

  /* render tugas harian */
  renderTugasHarian();

  /* charts */
  initCharts();

  /* progress bar animasi */
  setTimeout(() => {
    const fill = document.getElementById('progFill');
    if (fill) { fill.style.width='56.42%'; fill.textContent='56,42%'; fill.style.background='var(--g4)'; }
  }, 600);
}

/* ============================================================
   LOGIN SCREEN (halaman penuh, bukan modal)
   ============================================================ */
function showLoginScreen() {
  /* sembunyikan semua halaman & navbar */
  document.querySelectorAll('.page').forEach(p => p.style.display='none');
  document.querySelector('.navbar').style.display='none';
  document.querySelector('footer') && (document.querySelector('footer').style.display='none');

  /* tampilkan login screen */
  let ls = document.getElementById('loginScreen');
  if (!ls) {
    ls = document.createElement('div');
    ls.id = 'loginScreen';
    ls.innerHTML = `
      <div class="ls-overlay"></div>
      <div class="ls-card">
        <div class="ls-logo">
          <img src="https://upload.wikimedia.org/wikipedia/id/3/3e/Logo_Politeknik_Negeri_Bandung.svg" alt="POLBAN" onerror="this.style.display='none'">
        </div>
        <div class="ls-brand">GREENOVA</div>
        <div class="ls-subtitle">Sistem Informasi RTH POLBAN</div>
        <div class="ls-tagline">Greener Campus, Greater Impact.</div>
        <div class="ls-form">
          <div class="fg"><label>Username</label><input type="text" id="lsUser" placeholder="Masukkan username" autocomplete="username"></div>
          <div class="fg" style="margin-top:10px"><label>Password</label><input type="password" id="lsPass" placeholder="Masukkan password" onkeydown="if(event.key==='Enter')doLoginScreen()"></div>
          <div class="login-error" id="lsError">Username atau Password salah.</div>
          <button class="btn-submit" style="margin-top:1rem" onclick="doLoginScreen()">&#128275; Masuk</button>
          <div class="ls-hint">Hubungi koordinator RTH untuk mendapatkan akses login.</div>
        </div>
        <div class="ls-footer">© 2026 Kelompok 3 — 2B Manajemen Aset | POLBAN</div>
      </div>`;
    document.body.appendChild(ls);
  }
  ls.style.display = 'flex';
}

function doLoginScreen() {
  const u = document.getElementById('lsUser').value.trim();
  const p = document.getElementById('lsPass').value.trim();
  const err = document.getElementById('lsError');
  if (u === 'RTH-001' && p === 'Greenova2026') {
    err.classList.remove('show');
    DB.isLoggedIn = true;
    LS.set('greenova_login', { loggedIn: true });
    /* sembunyikan login screen, tampilkan app */
    document.getElementById('loginScreen').style.display = 'none';
    document.querySelectorAll('.page').forEach(p => p.style.removeProperty('display'));
    document.querySelector('.navbar').style.removeProperty('display');
    document.querySelector('footer') && document.querySelector('footer').style.removeProperty('display');
    applyLoggedInUI();
    showPage('beranda');
    toast('Selamat datang, Pengelola RTH POLBAN! &#127807;');
  } else {
    err.classList.add('show');
  }
}

/* login modal (dari navbar) */
function openLoginModal() {
  if (DB.isLoggedIn) { toast('Anda sudah login sebagai Pengelola.'); return; }
  /* redirect ke login screen */
  showLoginScreen();
}
function closeLoginModal() { /* tidak digunakan, pakai login screen */ }
function doLogin() { doLoginScreen(); }

function logout() {
  DB.isLoggedIn = false;
  LS.rm('greenova_login');
  toast('Anda telah keluar. Sampai jumpa!');
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.style.display='none');
    document.querySelector('.navbar').style.display='none';
    document.querySelector('footer') && (document.querySelector('footer').style.display='none');
    showLoginScreen();
  }, 1000);
}

function applyLoggedInUI() {
  const rb = document.getElementById('roleBadge');
  const bl = document.getElementById('btnLogin');
  const bo = document.getElementById('btnLogout');
  const mq = document.getElementById('maintQuickAction');
  if (rb) rb.style.display = 'inline';
  if (bl) bl.style.display = 'none';
  if (bo) bo.style.display = 'inline';
  if (mq) mq.style.display = 'flex';
  renderMaintLog();
  renderTanamanLog();
  updateDashboard();
}

/* ============================================================
   PAGE NAV
   ============================================================ */
function showPage(id) {
  if (!DB.isLoggedIn) { showLoginScreen(); return; }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + id);
  if (el) { el.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
  const map = {
    beranda:'Beranda','zona':'Peta & Zona RTH',peta:'Peta',
    'dasar-hukum':'Dasar Hukum','data-lahan':'Data Lahan',
    'db-tanaman':'Database Tanaman',dokumentasi:'Dokumentasi',maintenance:'Maintenance'
  };
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.classList.toggle('active', a.textContent.trim() === (map[id]||''))
  );
}

/* ============================================================
   TOAST
   ============================================================ */
function toast(msg) {
  const el = document.getElementById('toast');
  el.innerHTML = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3800);
}

/* ============================================================
   GALLERY
   ============================================================ */
function filterGal(btn, cat) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gal-item').forEach(item => {
    item.style.display = (cat==='all' || item.dataset.cat===cat) ? 'block' : 'none';
  });
}
function openPhoto(name, desc, src) {
  document.getElementById('lbImg').src = src;
  document.getElementById('lbName').textContent = name;
  document.getElementById('lbDesc').textContent = desc;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id==='lightbox') closeLightbox();
});

/* ============================================================
   ZONA TOGGLE
   ============================================================ */
function toggleZona(n) {
  const c = document.getElementById('zcontent'+n);
  const t = document.getElementById('ztoggle'+n);
  const open = c.style.display==='block';
  c.style.display = open ? 'none' : 'block';
  t.textContent = open ? '▼' : '▲';
}

/* ============================================================
   INVENTARISASI
   ============================================================ */
let currentInvKey = null;

function openInv(key) {
  currentInvKey = key;
  document.getElementById('invTitle').textContent = '📋 Inventarisasi — ' + (RTH_NAMES[key]||key);
  document.getElementById('invSubtitle').textContent = 'Data aset dan fasilitas di area ini.' + (DB.isLoggedIn?' Anda dapat menambah/menghapus item.':' Login untuk mengedit.');
  document.getElementById('invFormArea').style.display = DB.isLoggedIn ? 'block' : 'none';
  renderInvList(key);
  document.getElementById('invModal').classList.add('open');
}
function closeInvModal() { document.getElementById('invModal').classList.remove('open'); currentInvKey=null; }
document.getElementById('invModal').addEventListener('click', e => { if(e.target.id==='invModal') closeInvModal(); });

function renderInvList(key) {
  const list = DB.inventaris[key]||[];
  const kls = k => k==='Baik'?'badge-ok':k==='Perlu Perbaikan'?'badge-bad':'badge-warn';
  if (!list.length) { document.getElementById('invList').innerHTML='<div class="inv-empty">Belum ada data inventaris.</div>'; return; }
  document.getElementById('invList').innerHTML = `
    <table class="inv-table">
      <thead><tr><th>#</th><th>Nama Item</th><th>Jumlah</th><th>Kondisi</th><th>Keterangan</th>${DB.isLoggedIn?'<th>Aksi</th>':''}</tr></thead>
      <tbody>${list.map((item,i)=>`
        <tr>
          <td>${i+1}</td><td style="font-weight:600">${item.nama}</td>
          <td>${item.jml}</td>
          <td><span class="${kls(item.kondisi)}">${item.kondisi}</span></td>
          <td style="color:#888;font-size:12px">${item.ket||'–'}</td>
          ${DB.isLoggedIn?`<td><button class="btn-del-inv" onclick="hapusInv('${key}',${item.id})" title="Hapus">🗑</button></td>`:''}
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function tambahInv() {
  const key  = currentInvKey;
  const nama = document.getElementById('invNama').value.trim();
  const jml  = parseInt(document.getElementById('invJml').value)||1;
  const kond = document.getElementById('invKondisi').value;
  const ket  = document.getElementById('invKet').value.trim();
  if (!nama) { toast('Masukkan nama item inventaris.'); return; }
  if (!DB.inventaris[key]) DB.inventaris[key]=[];
  if (!DB.nextInvId[key]) DB.nextInvId[key]=1;
  DB.inventaris[key].push({id:DB.nextInvId[key]++,nama,jml,kondisi:kond,ket});
  ['invNama','invJml','invKet'].forEach(id=>document.getElementById(id).value='');
  renderInvList(key);
  toast('Item inventaris ditambahkan!');
}

function hapusInv(key, id) {
  DB.inventaris[key]=DB.inventaris[key].filter(i=>i.id!==id);
  renderInvList(key);
  toast('Item dihapus.');
}

/* ============================================================
   DATABASE TANAMAN
   ============================================================ */
function renderTanamanDB(cat='all') {
  const grid = document.getElementById('tanamanDbGrid');
  if (!grid) return;
  const list = cat==='all' ? TANAMAN_DB : TANAMAN_DB.filter(t=>t.zona===cat||t.jenis===cat);
  if (!list.length) { grid.innerHTML='<p class="empty-msg">Tidak ada data tanaman ditemukan.</p>'; return; }
  grid.innerHTML = list.map(t=>`
    <div class="tanaman-db-card">
      <div class="tdb-nama">${t.nama}</div>
      <div class="tdb-jenis">${t.jenis.charAt(0).toUpperCase()+t.jenis.slice(1)}</div>
      <div class="tdb-desc">${t.desc}</div>
      <div class="tdb-info">
        <span class="tdb-badge">&#127757; ${t.lokasi}</span>
        <span class="tdb-badge">&#127807; ${t.fungsi}</span>
      </div>
    </div>`).join('');
}
function filterTanaman(btn, cat) {
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderTanamanDB(cat);
}

/* ============================================================
   TUGAS HARIAN (checklist, tersimpan localStorage)
   ============================================================ */
function getTugasStatus() {
  const today = new Date().toISOString().split('T')[0];
  const saved = LS.get('greenova_tugas_'+today) || {};
  return saved;
}
function saveTugasStatus(status) {
  const today = new Date().toISOString().split('T')[0];
  LS.set('greenova_tugas_'+today, status);
}

function renderTugasHarian() {
  const container = document.getElementById('tugasList');
  if (!container) return;
  const status = getTugasStatus();
  container.innerHTML = DEFAULT_TUGAS.map(t => {
    const done = status[t.id]===true;
    return `
      <div class="tugas-item${done?' done':''}" id="tugas-${t.id}">
        <input type="checkbox" class="tugas-checkbox" id="cb-${t.id}"
          ${done?'checked':''} onchange="toggleTugas('${t.id}',this.checked)">
        <div class="tugas-body">
          <div class="tugas-nama">${t.nama}</div>
          <div class="tugas-meta">${t.meta}</div>
        </div>
        ${done
          ? '<span class="badge-done">&#10003; Selesai</span>'
          : `<button class="btn-selesai-tugas" onclick="selesaikanTugas('${t.id}')">Selesai</button>`}
      </div>`;
  }).join('');
  updateTugasProgress();
}

function toggleTugas(id, checked) {
  const status = getTugasStatus();
  status[id] = checked;
  saveTugasStatus(status);
  renderTugasHarian();
  if (checked) toast('Tugas ditandai selesai! ✅');
}

function selesaikanTugas(id) {
  toggleTugas(id, true);
}

function updateTugasProgress() {
  const status = getTugasStatus();
  const done  = DEFAULT_TUGAS.filter(t=>status[t.id]===true).length;
  const total = DEFAULT_TUGAS.length;
  const pct   = Math.round((done/total)*100);
  const bar   = document.getElementById('tugasProgBar');
  const count = document.getElementById('tugasProgCount');
  if (bar)   bar.style.width = pct+'%';
  if (count) count.textContent = `${done} dari ${total} tugas selesai`;
}

/* ============================================================
   PENANAMAN
   ============================================================ */
function openTanamanModal() {
  if (!DB.isLoggedIn) { toast('Login sebagai Pengelola untuk mencatat penanaman.'); return; }
  document.getElementById('tnTgl').value = new Date().toISOString().split('T')[0];
  renderTanamanLogModal();
  document.getElementById('tanamanModal').classList.add('open');
}
function closeTanamanModal() { document.getElementById('tanamanModal').classList.remove('open'); }
document.getElementById('tanamanModal').addEventListener('click', e=>{ if(e.target.id==='tanamanModal') closeTanamanModal(); });

function tambahTanaman() {
  if (!DB.isLoggedIn) return;
  const nama   = document.getElementById('tnNama').value.trim();
  const jml    = parseInt(document.getElementById('tnJml').value)||1;
  const lokasi = document.getElementById('tnLokasi').value;
  const tgl    = document.getElementById('tnTgl').value;
  const pj     = document.getElementById('tnPJ').value.trim();
  const cat    = document.getElementById('tnCatatan').value.trim();
  if (!nama||!pj) { toast('Nama tanaman dan penanggung jawab wajib diisi.'); return; }
  const entry = {id:Date.now(),nama,jml,lokasi,tgl,pj,cat,waktu:new Date().toLocaleString('id-ID')};
  DB.tanamanLog.unshift(entry);
  LS.set('greenova_tanamanlog', DB.tanamanLog);
  ['tnNama','tnJml','tnPJ','tnCatatan'].forEach(id=>document.getElementById(id).value='');
  renderTanamanLogModal();
  renderTanamanLog();
  updateDashboard();
  toast(`✅ Penanaman ${jml}× ${nama} di ${lokasi} dicatat!`);
}

function renderTanamanLogModal() {
  const c = document.getElementById('tanamanLogModal');
  if (!c) return;
  if (!DB.tanamanLog.length) { c.innerHTML='<p style="font-size:12px;color:#aaa;font-style:italic">Belum ada log penanaman.</p>'; return; }
  c.innerHTML = DB.tanamanLog.slice(0,4).map(t=>`
    <div class="tanaman-card">
      <div class="tanaman-nama">&#127807; ${t.jml}× ${t.nama}</div>
      <div class="tanaman-meta">${t.lokasi} | ${fmtTgl(t.tgl)} | PJ: ${t.pj}</div>
    </div>`).join('');
}

/* ============================================================
   MAINTENANCE MODAL & LOG
   ============================================================ */
function openMaintModal() {
  if (!DB.isLoggedIn) { toast('Login sebagai Pengelola untuk mencatat maintenance.'); return; }
  document.getElementById('mTgl').value = new Date().toISOString().split('T')[0];
  document.getElementById('maintModal').classList.add('open');
}
function closeMaintModal() {
  document.getElementById('maintModal').classList.remove('open');
  document.getElementById('maintForm').reset();
}
document.getElementById('maintModal').addEventListener('click', e=>{if(e.target.id==='maintModal') closeMaintModal();});

function submitMaint(e) {
  e.preventDefault();
  const lokasi  = document.getElementById('mLokasi').value;
  const jenis   = document.getElementById('mJenis').value;
  const tgl     = document.getElementById('mTgl').value;
  const tim     = document.getElementById('mTim').value;
  const status  = document.getElementById('mStatus').value;
  const kondisi = document.getElementById('mKondisi').value;
  const catatan = document.getElementById('mCatatan').value.trim();
  if (!lokasi||!jenis||!tim) { toast('Mohon lengkapi field wajib.'); return; }
  DB.maintLog.unshift({id:Date.now(),lokasi,jenis,tgl,tim,status,kondisi,catatan,dicatat:new Date().toLocaleString('id-ID'),selesai:status==='Disetujui'});
  LS.set('greenova_maintlog', DB.maintLog);
  closeMaintModal();
  renderMaintLog();
  updateDashboard();
  toast(`✅ Maintenance "${jenis}" di ${lokasi} berhasil dicatat!`);
}

/* Tandai selesai langsung dari log */
function tandaiSelesaiMaint(id) {
  const m = DB.maintLog.find(x=>x.id===id);
  if (m) {
    m.status  = 'Disetujui';
    m.selesai = true;
    m.tglSelesai = new Date().toLocaleString('id-ID');
    LS.set('greenova_maintlog', DB.maintLog);
    renderMaintLog();
    updateDashboard();
    toast(`✅ Maintenance "${m.jenis}" di ${m.lokasi} ditandai selesai!`);
  }
}

function hapusMaintLog(id) {
  DB.maintLog = DB.maintLog.filter(x=>x.id!==id);
  LS.set('greenova_maintlog', DB.maintLog);
  renderMaintLog();
  updateDashboard();
  toast('Log maintenance dihapus.');
}

function renderMaintLog() {
  const c = document.getElementById('maintLogList');
  if (!c) return;
  if (!DB.maintLog.length) { c.innerHTML='<p class="empty-msg">Belum ada log. Login sebagai Pengelola lalu klik "Catat Maintenance".</p>'; return; }
  const badge = document.getElementById('logBadge');
  if (badge) badge.textContent = DB.maintLog.length+' catatan';
  const stClass = s => s==='Disetujui'?'badge-ok':s==='Dalam Proses'?'badge-warn':s==='Menunggu Verifikasi'?'badge-info':'badge-bad';
  c.innerHTML = DB.maintLog.map(m=>`
    <div class="log-card${m.kondisi==='Perlu Perhatian'?' perlu':''}${m.selesai?' done':''}">
      <div class="log-header">
        <div style="flex:1;min-width:0">
          <div class="log-lokasi">${m.lokasi}</div>
          <div class="log-jenis">&#128295; ${m.jenis}</div>
          <div class="log-meta">&#128197; ${fmtTgl(m.tgl)} &nbsp;|&nbsp; &#128100; ${m.tim} &nbsp;|&nbsp; Kondisi: ${m.kondisi}</div>
          ${m.catatan?`<div class="log-meta">Catatan: ${m.catatan}</div>`:''}
          ${m.selesai?`<div class="log-meta" style="color:var(--g4);font-weight:700">&#10003; Selesai: ${m.tglSelesai||'–'}</div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
          <span class="${stClass(m.status)}">${m.status}</span>
          ${!m.selesai?`<button class="btn-selesai-tugas" onclick="tandaiSelesaiMaint(${m.id})">&#10003; Selesai</button>`:'<span class="badge-done">&#10003; Done</span>'}
          <button class="btn-del-inv" onclick="hapusMaintLog(${m.id})" title="Hapus">&#128465;</button>
        </div>
      </div>
    </div>`).join('');
}

function renderTanamanLog() {
  const c = document.getElementById('tanamanLogList');
  if (!c) return;
  if (!DB.tanamanLog.length) { c.innerHTML='<p class="empty-msg">Belum ada log penanaman.</p>'; return; }
  c.innerHTML = DB.tanamanLog.map(t=>`
    <div class="tanaman-card">
      <div class="tanaman-nama">&#127807; ${t.jml}× ${t.nama}</div>
      <div class="tanaman-meta">${t.lokasi}</div>
      <div class="tanaman-meta">&#128197; ${fmtTgl(t.tgl)} &nbsp;|&nbsp; PJ: ${t.pj}${t.cat?' | '+t.cat:''}</div>
    </div>`).join('');
}

/* ============================================================
   DASHBOARD UPDATE
   ============================================================ */
function updateDashboard() {
  const el1 = document.getElementById('statMaintLog');
  const el2 = document.getElementById('statTanaman');
  if (el1) el1.textContent = DB.maintLog.length;
  if (el2) el2.textContent = DB.tanamanLog.reduce((a,t)=>a+t.jml,0);
}

/* ============================================================
   TAB SWITCHER
   ============================================================ */
function switchPTab(btn, panelId) {
  const wrap = btn.closest('.ptabs');
  if (wrap) wrap.querySelectorAll('.ptab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  const section = btn.closest('section')||document.body;
  section.querySelectorAll('.ptab-panel').forEach(p=>p.classList.remove('active'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

/* ============================================================
   HELPER
   ============================================================ */
function fmtTgl(tgl) {
  if (!tgl) return '–';
  try { return new Date(tgl).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}); }
  catch { return tgl; }
}

/* ============================================================
   CHARTS (Canvas API — tanpa library)
   ============================================================ */
function initCharts() {
  /* Pie chart — distribusi lahan */
  const pie = document.getElementById('chartLahan');
  if (pie) {
    const ctx = pie.getContext('2d');
    const data   = [199269,32156,14844];
    const total  = data.reduce((a,b)=>a+b,0);
    const colors = ['#4CAF50','#37474F','#90A4AE'];
    const cx=130,cy=90,r=72; let start=-Math.PI/2;
    data.forEach((v,i)=>{
      const angle=(v/total)*2*Math.PI;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+angle);ctx.closePath();
      ctx.fillStyle=colors[i];ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
      start+=angle;
    });
    ctx.beginPath();ctx.arc(cx,cy,r*.46,0,2*Math.PI);ctx.fillStyle='#fff';ctx.fill();
    ctx.fillStyle='#37474F';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText('246.269',cx,cy-4);
    ctx.fillStyle='#888';ctx.font='10px sans-serif';ctx.fillText('m² total',cx,cy+12);
  }

  /* Bar chart — RTH per zona */
  const bar = document.getElementById('chartZona');
  if (bar) {
    const ctx   = bar.getContext('2d');
    const vals  = [1950,7300,7992,1500];
    const labels= ['Zona 1','Zona 2','Zona 3','Zona 4'];
    const colors= ['#4CAF50','#1976D2','#F57C00','#7B1FA2'];
    const maxVal= Math.max(...vals)*1.15;
    const w=bar.width,h=bar.height,padL=10,padB=30,padT=12;
    const chartH=h-padB-padT,barW=(w-padL*2)/vals.length;
    vals.forEach((v,i)=>{
      const bh=(v/maxVal)*chartH,x=padL+i*barW+barW*.1,bwi=barW*.8,y=padT+chartH-bh;
      ctx.fillStyle=colors[i];
      if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x,y,bwi,bh,[4,4,0,0]);ctx.fill();}
      else ctx.fillRect(x,y,bwi,bh);
      ctx.fillStyle='#555';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText((v/1000).toFixed(1)+'k',x+bwi/2,y-4);
      ctx.fillStyle='#888';ctx.font='9px sans-serif';
      ctx.fillText(labels[i],x+bwi/2,h-8);
    });
  }
}

/* ============================================================
   LOGIN SCREEN CSS (injected dynamically)
   ============================================================ */
(function injectLoginCSS() {
  const style = document.createElement('style');
  style.textContent = `
  #loginScreen{
    position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#1B5E20 0%,#2E7D32 50%,#388E3C 100%);
    padding:1rem;
  }
  .ls-card{
    background:#fff;border-radius:20px;padding:2.5rem 2rem;max-width:380px;width:100%;
    box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;position:relative;z-index:2;
  }
  .ls-logo img{width:72px;height:72px;object-fit:contain;margin-bottom:1rem}
  .ls-brand{font-size:28px;font-weight:800;color:#1B5E20;letter-spacing:-1px}
  .ls-subtitle{font-size:13px;color:#666;margin-top:2px}
  .ls-tagline{font-size:12px;color:#4CAF50;font-style:italic;font-weight:600;margin-top:2px;margin-bottom:1.5rem}
  .ls-form .fg{text-align:left}
  .ls-form .fg label{font-size:12px;font-weight:700;color:#37474F}
  .ls-form .fg input{width:100%;border:1.5px solid #ddd;border-radius:8px;padding:10px 12px;font-size:13px;font-family:inherit;outline:none;transition:border .2s}
  .ls-form .fg input:focus{border-color:#4CAF50;box-shadow:0 0 0 3px rgba(76,175,80,.1)}
  .ls-hint{display:flex;justify-content:center;gap:1.5rem;margin-top:1rem;font-size:11px;color:#888;flex-wrap:wrap}
  .ls-hint strong{color:#2E7D32}
  .ls-footer{font-size:10px;color:#bbb;margin-top:1.5rem}
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   BOOT
   ============================================================ */
if (document.readyState==='loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* shortcut ke tab tanaman dari halaman zona */
function gotoTanamanTab() {
  showPage('dokumentasi');
  setTimeout(() => {
    const btn = document.querySelector('[onclick*="dtab-tanaman"]');
    if (btn) switchPTab(btn, 'dtab-tanaman');
  }, 100);
}