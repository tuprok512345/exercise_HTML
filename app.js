const DATA_FILE = 'faqs.json';
let allFaqsData = []; // Biến toàn cục để lưu trữ dữ liệu, dùng cho việc lọc

/**
 * Hiển thị các trạng thái (Loading, Error, Empty) vào một khu vực trên DOM.
 * @param {string} state - Tên của trạng thái ('loading', 'error', 'empty').
 * @param {string} message - Chi tiết thông báo.
 * @param {HTMLElement} displayArea - Phần tử DOM để hiển thị.
 */
function renderState(state, message, displayArea) {
    if (!displayArea) return;

    let icon = '';
    let title = '';

    switch (state) {
        case 'loading':
            icon = '⏳';
            title = 'Đang Tải Dữ liệu...';
            break;
        case 'error':
            icon = '❌';
            title = 'Lỗi Tải Dữ liệu!';
            break;
        case 'empty':
            icon = '🤷';
            title = 'Không có dữ liệu.';
            break;
    }

    displayArea.innerHTML = `
        <div class="state-message state-message--${state}" aria-live="polite">
            <div class="state-message__icon">${icon}</div>
            <h3 class="state-message__title">${title}</h3>
            <p class="state-message__details">${message}</p>
        </div>
    `;
}

/**
 * Render danh sách các câu hỏi FAQ ra DOM.
 * @param {Array<object>} faqs - Mảng các đối tượng FAQ.
 * @param {HTMLElement} displayArea - Phần tử DOM để hiển thị.
 */
function renderFaqs(faqs, displayArea) {
    if (!displayArea) return;

    if (!faqs || faqs.length === 0) {
        renderState('empty', 'Không tìm thấy câu hỏi nào phù hợp với từ khóa bạn tìm kiếm.', displayArea);
        return;
    }

    const faqListHTML = faqs.map(faq => `
        <details class="faq-item">
            <summary class="faq-item__question">❓ ${faq.question}</summary>
            <div class="faq-item__answer">
                <p>✅ ${faq.answer}</p>
            </div>
        </details>
    `).join('');

    displayArea.innerHTML = faqListHTML;
}

/**
 * Lọc danh sách FAQ dựa trên từ khóa từ ô tìm kiếm.
 */
function filterFaqs() {
    const searchInput = document.getElementById('header-search-input');
    const displayArea = document.getElementById('data-display-area');
    if (!searchInput || !displayArea) return;

    const keyword = searchInput.value.toLowerCase().trim();

    if (!keyword) {
        renderFaqs(allFaqsData, displayArea);
        return;
    }

    const filteredFaqs = allFaqsData.filter(faq =>
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword)
    );

    renderFaqs(filteredFaqs, displayArea);
}

/**
 * Hàm chính: Tải dữ liệu từ file JSON và khởi động ứng dụng.
 */
async function main() {
    const displayArea = document.getElementById('data-display-area');
    const searchInput = document.getElementById('header-search-input');
    if (!displayArea) return;

    renderState('loading', 'Vui lòng chờ trong giây lát...', displayArea);

    try {
        const response = await fetch(DATA_FILE);
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            renderState('empty', `Tệp dữ liệu ${DATA_FILE} bị trống hoặc không đúng định dạng.`, displayArea);
            return;
        }

        allFaqsData = data; // Lưu dữ liệu vào biến toàn cục
        renderFaqs(allFaqsData, displayArea);

        // Thêm sự kiện tìm kiếm sau khi có dữ liệu
        if (searchInput) {
            searchInput.addEventListener('keyup', filterFaqs);
        }

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        renderState('error', `Không thể tải dữ liệu từ ${DATA_FILE}. Chi tiết: ${error.message}`, displayArea);
    }
}

// Chạy hàm chính khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', main);

// Export các hàm cần thiết cho việc kiểm thử với Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderState, renderFaqs };
}
