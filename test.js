/**
 * @jest-environment jsdom
 */

// Sửa từ "import" thành "require"
const { renderState, renderFaqs } = require('./app.js');

// Test Suite 1: Kiểm tra hàm renderFaqs
describe('renderFaqs', () => {
  it('should render a list of FAQs correctly', () => {
    document.body.innerHTML = '<div id="test-area"></div>';
    const displayArea = document.getElementById('test-area');
    const mockFaqs = [
      { question: 'Câu hỏi 1', answer: 'Trả lời 1' },
      { question: 'Câu hỏi 2', answer: 'Trả lời 2' },
    ];

    renderFaqs(mockFaqs, displayArea);

    const faqItems = displayArea.querySelectorAll('.faq-item');
    expect(faqItems.length).toBe(2);
    expect(displayArea.innerHTML).toContain('Câu hỏi 1');
    expect(displayArea.innerHTML).toContain('Trả lời 2');
  });

  it('should render the empty state if faqs array is empty', () => {
    document.body.innerHTML = '<div id="test-area"></div>';
    const displayArea = document.getElementById('test-area');

    renderFaqs([], displayArea);

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

    expect(displayArea.innerHTML).toContain('❌');
    expect(displayArea.innerHTML).toContain('Lỗi Tải Dữ liệu!');
    expect(displayArea.innerHTML).toContain(errorMessage);
  });
});
