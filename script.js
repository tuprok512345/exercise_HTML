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

    if (authModal) { // Thêm kiểm tra
        document.querySelectorAll('.header__nav-link').forEach(link => {
            link.addEventListener('click', e => {
                const target = e.target.textContent.trim();
                if(target === "Đăng nhập") {
                    e.preventDefault();
                    authModal.style.display = "block";
                    loginFormEl.style.display = "block";
                    registerFormEl.style.display = "none";
                    loginTab.classList.add('active');
                    registerTab.classList.remove('active');
                } else if(target === "Đăng ký") {
                    e.preventDefault();
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
    }

    // --- LOGIN (ĐÃ SỬA DÙNG fetch VỚI NODE.JS) ---
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', function(event) {
            event.preventDefault();
            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            fetch('/api/login', { // <-- SỬA LỖI 1: Đổi 'login.php' thành '/api/login'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput
                })
            })
            .then(async response => { // Dùng async để lấy .json()
                const data = await response.json();
                if (response.ok) { // Status 200-299
                    // Đăng nhập thành công, chuyển hướng
                    window.location.href = "dashboard.html";
                } else {
                    // Lỗi từ server (400, 401, 404, 500)
                    showCustomAlert("❌ " + data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Lỗi kết nối máy chủ.', 'error');
            });

            // Không reset form ngay để user có thể sửa
            // loginFormEl.reset(); 
        });
    }

    // --- REGISTER (ĐÃ SỬA DÙNG fetch VỚI NODE.JS) ---
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', function(event) {
            event.preventDefault();
            const newName = document.getElementById('reg-name').value.trim(); // <-- SỬA LỖI 2: Lấy thêm 'name'
            const newUsername = document.getElementById('reg-username').value.trim();
            const newEmail = document.getElementById('reg-email').value.trim();
            const newPassword = document.getElementById('reg-password').value.trim();

            fetch('/api/register', { // <-- SỬA LỖI 1: Đổi 'register.php' thành '/api/register'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName, // <-- SỬA LỖI 2: Gửi thêm 'name'
                    username: newUsername,
                    email: newEmail,
                    password: newPassword
                })
            })
            .then(async response => {
                const data = await response.json();
                if (response.ok) { // Status 201
                    showCustomAlert("🎉 Đăng ký thành công! Vui lòng đăng nhập.", 'success');
                    registerFormEl.reset();
                    loginTab.click(); // Chuyển sang tab đăng nhập
                } else {
                    // Lỗi từ server (400, 409, 500)
                    showCustomAlert("❌ " + data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomAlert('Lỗi kết nối máy chủ.', 'error');
            });
        });
    }

    // --- HÀM THÔNG BÁO TÙY CHỈNH (Thay thế alert) ---
    function showCustomAlert(message, type = 'info') {
        let alertBox = document.getElementById('custom-alert');
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'custom-alert';
            document.body.appendChild(alertBox);
        }
        
        alertBox.textContent = message;
        alertBox.style.display = 'block';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.padding = '15px 25px';
        alertBox.style.borderRadius = '8px';
        alertBox.style.zIndex = '1001';
        alertBox.style.color = 'white';
        alertBox.style.backgroundColor = (type === 'error') ? '#d9534f' : '#5cb85c';
        alertBox.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';

        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    }
});