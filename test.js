/**
 * @jest-environment jsdom
 */

const { renderState, renderFaqs } = require('./app.js');

// Test Suite 1: Kiểm tra hàm renderFaqs
describe('renderFaqs', () => {
    it('should render a list of FAQs correctly', () => {
        // 1. Setup: Tạo một div ảo và dữ liệu giả
        document.body.innerHTML = '<div id="test-area"></div>';
        const displayArea = document.getElementById('test-area');
        const mockFaqs = [
            { question: 'Câu hỏi 1', answer: 'Trả lời 1' },
            { question: 'Câu hỏi 2', answer: 'Trả lời 2' }
        ];

        // 2. Act: Gọi hàm cần test
        renderFaqs(mockFaqs, displayArea);

        // 3. Assert: Kiểm tra kết quả
        const faqItems = displayArea.querySelectorAll('.faq-item');
        expect(faqItems.length).toBe(2); // Phải có 2 item được render
        expect(displayArea.innerHTML).toContain('Câu hỏi 1');
        expect(displayArea.innerHTML).toContain('Trả lời 2');
    });

    it('should render the empty state if faqs array is empty', () => {
        document.body.innerHTML = '<div id="test-area"></div>';
        const displayArea = document.getElementById('test-area');

        renderFaqs([], displayArea);

        // Kiểm tra xem thông báo "Không tìm thấy" có được hiển thị không
        expect(displayArea.innerHTML).toContain('Không tìm thấy câu hỏi nào');
    });
});

// Test Suite 2: Kiểm tra hàm renderState
describe('renderState', () => {
    it('should render the error state correctly', () => {
        document.body.innerHTML = '<div id="test-area"></div>';
        const displayArea = document.getElementById('test-area');
        const errorMessage = 'Không thể kết nối';

        renderState('error', errorMessage, displayArea);

        // Kiểm tra icon, tiêu đề và chi tiết của trạng thái lỗi
        expect(displayArea.innerHTML).toContain('❌'); // Icon Lỗi
        expect(displayArea.innerHTML).toContain('Lỗi Tải Dữ liệu!'); // Tiêu đề Lỗi
        expect(displayArea.innerHTML).toContain(errorMessage); // Chi tiết Lỗi
    });
});
