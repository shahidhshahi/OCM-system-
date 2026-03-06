// =============================================
//  SNMV OCM – Core Application Logic
// =============================================

// ---------- Data Store ----------
const DEFAULT_USERS = [
  { id: 'STU001', password: 'student123', role: 'student', name: 'Arun Kumar', dept: 'Computer Science', year: '3rd Year', email: 'arun@snmv.edu.in', phone: '9876543210' },
  { id: 'STU002', password: 'student123', role: 'student', name: 'Priya Devi', dept: 'Mathematics', year: '2nd Year', email: 'priya@snmv.edu.in', phone: '9876543211' },
  { id: 'STU003', password: 'student123', role: 'student', name: 'Ravi Shankar', dept: 'Physics', year: '1st Year', email: 'ravi@snmv.edu.in', phone: '9876543212' },
  { id: 'admin', password: 'admin@2024', role: 'admin', name: 'Dr. S. Meenakshi', dept: 'Administration', year: '', email: 'admin@snmv.edu.in', phone: '9876543200' }
];

function initDatabase() {
  if (!localStorage.getItem('ocm_users')) {
    localStorage.setItem('ocm_users', JSON.stringify(DEFAULT_USERS));
  }
}

// Call on script load
initDatabase();

function getAllUsers() {
  return JSON.parse(localStorage.getItem('ocm_users') || '[]');
}

function saveUser(user) {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem('ocm_users', JSON.stringify(users));
}

let COMPLAINTS = [
  { id: 'CMP-2024-001', studentId: 'STU001', studentName: 'Arun Kumar', dept: 'Computer Science', category: 'Academic', subject: 'Lab equipment not working', description: 'The computers in Lab 3 are not functioning properly. Many systems crash frequently during practicals.', priority: 'high', status: 'resolved', date: '2024-11-10', updatedDate: '2024-11-15', response: 'Issue has been resolved. New systems have been installed in Lab 3.', attachments: [] },
  { id: 'CMP-2024-002', studentId: 'STU001', studentName: 'Arun Kumar', dept: 'Computer Science', category: 'Facilities', subject: 'Canteen food quality issue', description: 'The quality of food served in the canteen has deteriorated significantly over the past few weeks.', priority: 'medium', status: 'in-progress', date: '2024-11-20', updatedDate: '2024-11-22', response: 'Forwarded to canteen management for review.', attachments: [] },
  { id: 'CMP-2024-003', studentId: 'STU002', studentName: 'Priya Devi', dept: 'Mathematics', category: 'Transport', subject: 'Bus route not covering all stops', description: 'The college bus on Route 4 is skipping Gandhipuram stop regularly, causing inconvenience.', priority: 'medium', status: 'pending', date: '2024-11-25', updatedDate: '2024-11-25', response: '', attachments: [] },
  { id: 'CMP-2024-004', studentId: 'STU003', studentName: 'Ravi Shankar', dept: 'Physics', category: 'Academic', subject: 'Exam hall seating issue', description: 'The seating arrangement in Hall B is cramped and uncomfortable for 3-hour exams.', priority: 'low', status: 'pending', date: '2024-11-28', updatedDate: '2024-11-28', response: '', attachments: [] },
  { id: 'CMP-2024-005', studentId: 'STU002', studentName: 'Priya Devi', dept: 'Mathematics', category: 'Hostel', subject: 'Water supply issue in hostel', description: 'Irregular water supply in the girls hostel, especially during morning hours (6–8 AM).', priority: 'high', status: 'in-progress', date: '2024-12-01', updatedDate: '2024-12-03', response: 'Plumber team has been assigned to fix the pipeline issue.', attachments: [] },
  { id: 'CMP-2024-006', studentId: 'STU001', studentName: 'Arun Kumar', dept: 'Computer Science', category: 'Library', subject: 'Insufficient reference books', description: 'The library lacks sufficient copies of Data Structures reference books by Cormen and Sedgewick.', priority: 'low', status: 'resolved', date: '2024-12-05', updatedDate: '2024-12-10', response: '10 new copies have been procured and added to the library.', attachments: [] }
];

let currentUser = null;
let cmpCounter = COMPLAINTS.length + 1;

// ---------- Auth ----------
function getUser(id, pass) {
  const users = getAllUsers();
  return users.find(u => (u.id === id || u.email === id) && u.password === pass) || null;
}

function switchAuthTab(tab) {
  const loginBtn = document.getElementById('tabLoginBtn');
  const regBtn = document.getElementById('tabRegisterBtn');
  if (loginBtn) loginBtn.classList.toggle('active', tab === 'login');
  if (regBtn) regBtn.classList.toggle('active', tab === 'register');

  const loginView = document.getElementById('loginView');
  const regView = document.getElementById('registerView');
  if (loginView) loginView.style.display = tab === 'login' ? 'block' : 'none';
  if (regView) regView.style.display = tab === 'register' ? 'block' : 'none';
}

function setRole(role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(role === 'student' ? 'studentRoleBtn' : 'adminRoleBtn');
  if (btn) btn.classList.add('active');
  const slider = document.getElementById('toggleSlider');
  if (slider) slider.style.left = role === 'admin' ? 'calc(50%)' : '4px';
  const label = document.getElementById('loginIdLabel');
  if (label) label.textContent = role === 'student' ? 'Student ID / Email' : 'Admin Username';
  document.getElementById('loginForm').dataset.role = role;
}

function handleLogin(e) {
  e.preventDefault();
  const id = document.getElementById('loginId').value.trim();
  const pass = document.getElementById('loginPass').value;
  const role = document.getElementById('loginForm').dataset.role || 'student';
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  errEl.style.display = 'none';
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loader').style.display = 'inline';

  setTimeout(() => {
    const user = getUser(id, pass);
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-loader').style.display = 'none';

    if (!user) {
      errEl.textContent = '❌ Invalid credentials. Please try again.';
      errEl.style.display = 'block';
      return;
    }
    if (user.role !== role) {
      errEl.textContent = `❌ This account is not a ${role} account.`;
      errEl.style.display = 'block';
      return;
    }
    localStorage.setItem('ocmUser', JSON.stringify(user));
    window.location.href = user.role === 'admin' ? 'admin.html' : 'student.html';
  }, 900);
}

function togglePassword(inputId = 'loginPass') {
  const inp = document.getElementById(inputId);
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const dept = document.getElementById('regDept').value;
  const year = document.getElementById('regYear').value;
  const phone = document.getElementById('regPhone').value.trim();
  const pass = document.getElementById('regPass').value;
  const errEl = document.getElementById('regError');
  const btn = document.getElementById('registerBtn');

  errEl.style.display = 'none';

  if (!name || !email || !dept || !year || !phone || !pass) {
    errEl.textContent = '❌ All fields are required.';
    errEl.style.display = 'block';
    return;
  }

  const users = getAllUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    errEl.textContent = '❌ Email is already registered.';
    errEl.style.display = 'block';
    return;
  }

  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loader').style.display = 'inline';

  setTimeout(() => {
    const stuCount = users.filter(u => u.role === 'student').length;
    const newId = `STU${String(stuCount + 1).padStart(3, '0')}`;

    const newUser = {
      id: newId,
      password: pass,
      role: 'student',
      name: name,
      dept: dept,
      year: year,
      email: email,
      phone: phone
    };

    saveUser(newUser);

    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-loader').style.display = 'none';

    document.getElementById('registerForm').reset();
    showToast(`Registration successful! Your Student ID is ${newId}`, 'success');

    setTimeout(() => {
      switchAuthTab('login');
      const loginIdInput = document.getElementById('loginId');
      if (loginIdInput) loginIdInput.value = email;
    }, 1500);

  }, 1000);
}

function showForgotModal() {
  document.getElementById('forgotModal').style.display = 'flex';
}
function closeForgotModal() {
  document.getElementById('forgotModal').style.display = 'none';
}
function sendReset() {
  showToast('Password reset link sent! Check your email.', 'success');
  closeForgotModal();
}

// ---------- Session ----------
function requireAuth(role) {
  const raw = localStorage.getItem('ocmUser');
  if (!raw) { window.location.href = 'index.html'; return null; }
  const user = JSON.parse(raw);
  if (role && user.role !== role) { window.location.href = 'index.html'; return null; }
  currentUser = user;
  return user;
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('ocmUser');
    window.location.href = 'index.html';
  }
}

// ---------- Complaint Helpers ----------
function getStudentComplaints(studentId) {
  return COMPLAINTS.filter(c => c.studentId === studentId);
}

function generateId() {
  const year = new Date().getFullYear();
  return `CMP-${year}-${String(cmpCounter++).padStart(3, '0')}`;
}

function addComplaint(data) {
  const c = { ...data, id: generateId(), date: today(), updatedDate: today(), response: '', attachments: [] };
  COMPLAINTS.unshift(c);
  return c;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusBadge(s) {
  const map = { pending: 'badge-pending', 'in-progress': 'badge-in-progress', resolved: 'badge-resolved', rejected: 'badge-rejected' };
  const labels = { pending: 'Pending', 'in-progress': 'In Progress', resolved: 'Resolved', rejected: 'Rejected' };
  return `<span class="badge ${map[s] || ''}">${labels[s] || s}</span>`;
}

function priorityTag(p) {
  return `<span class="priority-tag priority-${p}">${p}</span>`;
}

// ---------- Toast ----------
function showToast(msg, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '✅'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ---------- Modal Helpers ----------
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
