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

## Trạng thái

Đang ở **giai đoạn 0 – Chuẩn bị và khảo sát** (xem mục 12 và 13 trong [tài liệu mô tả](docs/01-mo-ta-du-an.md)). Hướng dẫn cài đặt và chạy sẽ được bổ sung khi có mã nguồn ứng dụng.
