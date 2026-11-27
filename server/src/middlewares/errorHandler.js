// Đường dẫn không tồn tại
export function notFound(req, res) {
  res.status(404).json({ error: 'Không tìm thấy' });
}

// Lỗi chưa được xử lý ở controller: ghi log, trả 500
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Lỗi máy chủ' });
}
