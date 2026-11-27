# Peekaboo

Công cụ soạn bài giảng trực quan có minh hoạ 3D cho học sinh tiểu học học tiếng Anh.

Giáo viên chỉ cần mô tả nội dung bài học bằng lời; hệ thống tự sinh dàn ý, chọn mô hình 3D phù hợp từ thư viện và sắp xếp thành cảnh 3D đúng ý nghĩa (ví dụ *"The cat is under the table"*). Bài giảng được trình chiếu trên trình duyệt, người xem có thể xoay cảnh, bấm vào vật để nghe từ và chơi đố vui vị trí.

## Thông tin đề tài

- **Học phần:** Nghiên cứu tốt nghiệp – Kỳ 2026.1
- **Sinh viên:** Đinh Đức Mạnh – MSSV 20235774
- **Giảng viên hướng dẫn:** Nguyễn Duy Hiệp

## Tài liệu

| Tài liệu | Nội dung |
| --- | --- |
| [Quy ước dự án](docs/00-quy-uoc-du-an.md) | Cấu trúc thư mục, quy ước đặt tên, quy ước commit |
| [Mô tả dự án](docs/01-mo-ta-du-an.md) | Bối cảnh, mục tiêu, phạm vi, chức năng, câu hỏi nghiên cứu, kế hoạch |

## Bản thử nghiệm

[`prototype/slide-3d-demo.html`](prototype/slide-3d-demo.html) – một slide 3D dựng bằng Three.js với hình khối đơn giản. Mở trực tiếp bằng Chrome hoặc Edge (cần kết nối mạng để tải thư viện Three.js).

## Công nghệ dự kiến

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | ReactJS, Three.js (React Three Fiber) |
| Backend | Node.js, Express |
| Cơ sở dữ liệu | PostgreSQL |
| Mô hình ngôn ngữ | Mô hình mã nguồn mở chạy cục bộ bằng Ollama |
| Mô hình 3D | Tệp `.glb` từ các kho có giấy phép CC0 |

## Cài đặt và chạy

**Cần có:** Node.js 20.19 trở lên, PostgreSQL, Ollama (đã tải `qwen2.5:7b` và `bge-m3`).

1. Tạo CSDL (nhập mật khẩu tài khoản `postgres` khi được hỏi):

   ```bash
   createdb -U postgres peekaboo
   ```

2. Chép `server/.env.example` thành `server/.env`, thay `MAT_KHAU` bằng mật khẩu PostgreSQL của máy.

3. Cài thư viện cho server và client:

   ```bash
   npm --prefix server install
   npm --prefix client install
   ```

4. Chạy server (cổng 3001) và client (cổng 5173), mỗi lệnh ở một cửa sổ terminal:

   ```bash
   npm --prefix server run dev
   npm --prefix client run dev
   ```

5. Mở <http://localhost:5173>. Đầu trang hiện trạng thái Server, PostgreSQL, Ollama; bên trái là danh sách mô hình, bấm vào để xem mô hình 3D.

Các script xử lý thư viện mô hình (chuẩn hoá, đo, tạo ảnh xem trước) nằm trong `scripts/`, xem chú thích đầu mỗi tệp.

## Trạng thái

Đang ở **giai đoạn 2 – Thiết kế và khung dự án** (xem mục 12 trong [tài liệu mô tả](docs/01-mo-ta-du-an.md)).
