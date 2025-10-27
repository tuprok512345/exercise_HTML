// Đây là file mà file test của bạn đang cố gắng "import".
// Tôi tạo ra các hàm này để file test có thể chạy.

function renderFaqs(faqs = [], displayArea) {
  if (faqs.length === 0) {
    displayArea.innerHTML = '<p class="text-gray-500">Không tìm thấy câu hỏi nào.</p>';
    return;
  }

  displayArea.innerHTML = faqs
    .map(
      (faq) => `
    <div class="faq-item p-4 mb-2 border rounded-lg shadow-sm">
      <h3 class="font-semibold text-lg">${faq.question}</h3>
      <p class="text-gray-700 mt-1">${faq.answer}</p>
    </div>
  `
    )
    .join('');
}

function renderState(state, message, displayArea) {
  if (state === 'error') {
    displayArea.innerHTML = `
      <div class="p-4 rounded-lg bg-red-100 text-red-700 text-center">
        <span class="text-2xl">❌</span>
        <h3 class="font-bold text-lg mt-2">Lỗi Tải Dữ liệu!</h3>
        <p>${message}</p>
      </div>
    `;
  }
}

// Chúng ta cần export các hàm này để file test có thể "require"
module.exports = {
  renderState,
  renderFaqs,
};
