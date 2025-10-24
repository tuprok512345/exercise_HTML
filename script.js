document.addEventListener('DOMContentLoaded', function() {

    // --- SEARCH FORM LOGIC ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResult = document.getElementById('search-result');

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const query = searchInput.value.toLowerCase().trim();
            let response = '';

            if (query === '') {
                response = '🤔 Vui lòng nhập câu hỏi của bạn vào ô tìm kiếm.';
            } else if (query.includes('học phí')) {
                response = 'Chào bạn, hạn chót đóng học phí cho Học kỳ này là <strong>17:00 ngày 28/02/2026</strong>.';
            } else if (query.includes('lịch thi')) {
                response = 'Lịch thi cuối kỳ dự kiến công bố vào <strong>tuần thứ 10</strong> của học kỳ.';
            } else if (query.includes('ký túc xá') || query.includes('ktx')) {
                response = 'Đăng ký Ký túc xá bắt đầu từ ngày <strong>01/08/2026</strong>.';
            } else {
                response = 'Cảm ơn câu hỏi của bạn! Hãy thử hỏi về "học phí", "lịch thi" hoặc "ký túc xá".';
            }

            searchResult.innerHTML = response;
            searchResult.style.display = 'block';
        });
    }

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- LOGIN & REGISTER MODAL ---
    const authModal = document.getElementById('auth-modal');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginFormEl = document.getElementById('login-form');
    const registerFormEl = document.getElementById('register-form');
    const closeModalBtn = document.querySelector('.auth-modal__close');

    document.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', e => {
            const target = e.target.textContent.trim();
            if(target === "Đăng nhập") {
                authModal.style.display = "block";
                loginFormEl.style.display = "block";
                registerFormEl.style.display = "none";
                loginTab.classList.add('active');
                registerTab.classList.remove('active');
            } else if(target === "Đăng ký") {
                authModal.style.display = "block";
                loginFormEl.style.display = "none";
                registerFormEl.style.display = "block";
                loginTab.classList.remove('active');
                registerTab.classList.add('active');
            }
        });
    });

    closeModalBtn.addEventListener('click', () => { authModal.style.display = "none"; });
    document.querySelector('.auth-modal__overlay').addEventListener('click', () => { authModal.style.display = "none"; });

    loginTab.addEventListener('click', () => {
        loginFormEl.style.display = "block";
        registerFormEl.style.display = "none";
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    });
    registerTab.addEventListener('click', () => {
        loginFormEl.style.display = "none";
        registerFormEl.style.display = "block";
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    });

    // --- ACCOUNTS ---
    const defaultAccounts = [
        { username: "sinhvien1", email: "sinhvien1@unifaq.edu.vn", password: "123456" },
        { username: "admin", email: "admin@unifaq.edu.vn", password: "admin123" }
    ];

    function getStoredAccounts() {
        const stored = localStorage.getItem('accounts');
        if(stored) return JSON.parse(stored);
        return [...defaultAccounts];
    }

    function saveAccounts(accounts) {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    // --- LOGIN ---
    loginFormEl.addEventListener('submit', function(event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        const accounts = getStoredAccounts();
        const userFound = accounts.find(acc => (acc.username === usernameInput || acc.email === usernameInput) && acc.password === passwordInput);

        if(userFound) {
            localStorage.setItem('loggedInUser', JSON.stringify(userFound));
            window.location.href = "dashboard.html"; // chuyển sang dashboard
        } else {
            alert("❌ Sai tên đăng nhập hoặc mật khẩu! Vui lòng thử lại.");
        }

        loginFormEl.reset();
    });

    // --- REGISTER ---
    registerFormEl.addEventListener('submit', function(event) {
        event.preventDefault();
        const newUsername = document.getElementById('reg-username').value.trim();
        const newEmail = document.getElementById('reg-email').value.trim();
        const newPassword = document.getElementById('reg-password').value.trim();

        const accounts = getStoredAccounts();
        const exists = accounts.some(acc => acc.username === newUsername || acc.email === newEmail);

        if(exists) {
            alert("❌ Tên đăng nhập hoặc email đã tồn tại!");
        } else {
            accounts.push({ username: newUsername, email: newEmail, password: newPassword });
            saveAccounts(accounts);
            alert("🎉 Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
            registerFormEl.reset();
            loginTab.click();
        }
    });

});
