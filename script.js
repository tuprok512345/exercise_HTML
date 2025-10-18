document.addEventListener('DOMContentLoaded', function() {

    // --- SEARCH FORM LOGIC (GIỮ NGUYÊN) ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResult = document.getElementById('search-result');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn form gửi đi theo cách truyền thống

        const query = searchInput.value.toLowerCase().trim();
        let response = '';

        if (query === '') {
            response = '🤔 Vui lòng nhập câu hỏi của bạn vào ô tìm kiếm.';
        } else if (query.includes('học phí')) {
            response = 'Chào bạn, hạn chót đóng học phí cho Học kỳ này là <strong>17:00 ngày 28/02/2026</strong>. Bạn có thể thanh toán qua cổng thanh toán trực tuyến của trường.';
        } else if (query.includes('lịch thi')) {
            response = 'Lịch thi cuối kỳ dự kiến sẽ được công bố vào <strong>tuần thứ 10</strong> của học kỳ. Bạn vui lòng theo dõi thông báo trên trang web của phòng Đào tạo nhé.';
        } else if (query.includes('ký túc xá') || query.includes('ktx')) {
            response = 'Việc đăng ký Ký túc xá cho năm học mới sẽ bắt đầu từ ngày <strong>01/08/2026</strong>. Sinh viên có thể đăng ký trực tuyến tại trang web của Trung tâm Dịch vụ Sinh viên.';
        } else {
            response = 'Cảm ơn câu hỏi của bạn! Hiện tại tôi vẫn đang học hỏi. Câu trả lời chi tiết hơn sẽ sớm được cập nhật. Bạn thử hỏi về "học phí", "lịch thi" hoặc "ký túc xá" xem sao nhé!';
        }

        // Hiển thị kết quả
        searchResult.innerHTML = response;
        searchResult.style.display = 'block';
    });


    // --- CONTACT FORM LOGIC (NÂNG CẤP VỚI VALIDATION) ---
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    
    // Lấy các thẻ span báo lỗi
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    
    // Lấy div thông báo trạng thái
    const statusMessage = document.getElementById('form-status-message');
    
    // Lấy nút submit
    const submitButton = contactForm.querySelector('.contact__button');

    // Hàm kiểm tra định dạng email (Regex)
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn form gửi đi

        // 1. Reset trạng thái
        let isValid = true;
        nameError.textContent = '';
        emailError.textContent = '';
        statusMessage.textContent = '';
        statusMessage.className = '';
        nameInput.classList.remove('contact__input--invalid');
        emailInput.classList.remove('contact__input--invalid');

        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();

        // 2. Kiểm tra Tên
        if (nameValue === '') {
            nameError.textContent = 'Vui lòng nhập tên của bạn.';
            nameInput.classList.add('contact__input--invalid');
            isValid = false;
        }

        // 3. Kiểm tra Email
        if (emailValue === '') {
            emailError.textContent = 'Vui lòng nhập email của bạn.';
            emailInput.classList.add('contact__input--invalid');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            emailError.textContent = 'Định dạng email không hợp lệ.';
            emailInput.classList.add('contact__input--invalid');
            isValid = false;
        }

        // 4. Xử lý kết quả
        if (isValid) {
            // THÀNH CÔNG
            statusMessage.textContent = `Cảm ơn ${nameValue}! Chúng tôi sẽ gửi thông tin đến ${emailValue} ngay khi có. ✨`;
            statusMessage.classList.add('status--success');

            // Vô hiệu hóa form để tránh gửi lại
            nameInput.disabled = true;
            emailInput.disabled = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Đã đăng ký!';
            
        } else {
            // THẤT BẠI
            statusMessage.textContent = 'Vui lòng kiểm tra lại thông tin bạn đã nhập.';
            statusMessage.classList.add('status--error');
        }
    });

});