# Nhật ký tuần 1

Ngày: 14–15/11/2026 · Liên quan: CV0.4, CV0.5, CV0.6

Môi trường: laptop GPU RTX 4050 6 GB, RAM 16 GB · Ollama 0.40.16 · mô hình `qwen2.5:7b`, `llama3.1:8b`, `bge-m3`.

## 1. Sinh dàn ý với prompt đơn giản

`qwen2.5:7b`, 4 lần, đề bài tiếng Việt: *"Bài học về giới từ in, on, under cho học sinh lớp 3, dùng đồ vật trong lớp học, 3 slide"*, chỉ yêu cầu trả về JSON.

- Thời gian: 9,7–13,7 giây.
- Lỗi:
  - Câu viết bằng tiếng Việt hoặc trộn Anh – Việt (*"Bút chì on bàn học"*).
  - Hiểu "in" thành "in ấn" (*"Tôi in tên bạn trên trang giấy"*).
  - Cấu trúc JSON mỗi lần một kiểu.
  - Quan hệ không chuẩn (`"in trên"`, `"treo dưới"`).
  - Vật không dựng 3D được (`"tên bạn"`, `"đồ họa"`).

## 2. Sinh dàn ý với prompt cải tiến

Thêm JSON Schema (giới từ chỉ nhận 7 giá trị), prompt hệ thống tiếng Anh có luật và ví dụ mẫu, `temperature = 0.2`. Mỗi mô hình 3 lần.

| | `qwen2.5:7b` | `llama3.1:8b` |
| --- | --- | --- |
| Đúng cấu trúc, câu tiếng Anh, đủ giới từ | 3/3 | 3/3 |
| Thời gian | khoảng 11 giây | 8–9 giây (lần đầu 17,8 giây do nạp mô hình) |
| Ví dụ câu | *The book is in the desk.* | *The pencil is in the box.* |
| Cảnh hợp lý | Kém hơn | Tốt hơn |
| Nghĩa tiếng Việt | Sai: *ruler* → "Kéo", *eraser* → "Xà phòng viết" | Gần như đúng |

JSON Schema giải quyết được lỗi định dạng. Chưa đủ dữ liệu để kết luận mô hình nào tốt hơn (mới 1 đề bài).

## 3. Độ giống nhau giữa vector từ (`bge-m3`)

| Cặp từ | Cosin |
| --- | --- |
| cat ~ kitten | 0,769 |
| table ~ bàn | 0,733 |
| cat ~ table | 0,589 |
| cat ~ con mèo | **0,544** |

Vector của từ đơn lẻ chưa tin cậy: *cat* gần *table* hơn *con mèo*.

## 4. Quyết định thiết kế

- Dùng **JSON Schema** để ép cấu trúc dàn ý.
- **Không dùng nghĩa tiếng Việt do mô hình dịch**; tự ghép từ tên tiếng Việt trong `catalog.json`.
- **Đưa danh sách vật trong thư viện vào prompt** để mô hình chỉ chọn vật dựng được 3D.
- **Tìm mô hình 3D kết hợp từ khoá và ngữ nghĩa**; thử tạo vector từ mô tả đầy đủ thay vì một từ; chọn ngưỡng bằng thực nghiệm RQ1.

## 5. Khảo sát nguồn mô hình 3D (15/11)

Chi tiết: [05-khao-sat-nguon-mo-hinh-3d.md](../05-khao-sat-nguon-mo-hinh-3d.md).

- Khảo sát với 40 từ (8 từ mỗi chủ đề); *kite* không tìm được nên thay bằng *skateboard*.
- **Kenney** (4 gói: Furniture Kit, Cube Pets, Food Kit, Toy Car Kit, đều CC0) phủ 31/40 từ; thiếu hầu hết đồ chơi.
- **Poly Pizza** bổ sung 9 mô hình lẻ (6 CC-BY, 3 CC0), mỗi mô hình lưu kèm `license.txt`; dòng ghi công CC-BY được lưu trong tệp khảo sát.
- Tổng cộng phủ **40/40 từ**.
- Vấn đề phát hiện khi đo mô hình: tỉ lệ lệch nhau giữa các nguồn (con mèo cao gấp 5 lần cái bàn), gốc toạ độ không ở giữa đáy, một số mô hình nằm ngang, texture để ngoài tệp `.glb`. Đây là căn cứ cho bước chuẩn hoá (CV1.3).

## 6. Mốc M1

Ollama chạy được ✅ · Sinh dàn ý JSON đúng định dạng ✅ · Biết thời gian sinh (8–14 giây cho 3 slide) ✅ · Danh sách nguồn mô hình 3D ✅ (CV0.6)

Còn lại của giai đoạn 0: CV0.7 – khảo sát nghiên cứu liên quan.
