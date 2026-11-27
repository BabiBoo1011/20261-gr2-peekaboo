# Thiết kế API

Liên quan: CV2.4 (giai đoạn 2). Cấu trúc dữ liệu: [04-thiet-ke-json.md](04-thiet-ke-json.md); CSDL: [02-thiet-ke-csdl.md](02-thiet-ke-csdl.md).

## 1. Quy ước chung

- Mọi API bắt đầu bằng `/api`; dữ liệu gửi và nhận là JSON (`Content-Type: application/json`).
- Đường dẫn dùng **danh từ số nhiều, chữ thường**, nối bằng `-` (`/api/lessons`, `/api/generation-jobs`).
- Tên trường trong JSON dùng `camelCase` (`teacherId`, `shareEnabled`); server tự đổi sang `snake_case` khi làm việc với CSDL.
- **Xác thực:** đăng nhập trả về JWT; các API cần đăng nhập gửi kèm header `Authorization: Bearer <token>`. Token hết hạn sau 7 ngày. Đăng xuất = client xoá token (NFR03).
- **Phân quyền** luôn kiểm tra ở server (NFR03): giáo viên chỉ thao tác trên bài giảng của mình (BR04); API `/api/admin/...` chỉ dành cho quản trị viên.

### Mã trạng thái và định dạng lỗi

| Mã HTTP | Khi nào | `code` |
| --- | --- | --- |
| 200 | Thành công | |
| 201 | Tạo mới thành công | |
| 202 | Đã nhận yêu cầu, xử lý chạy nền | |
| 204 | Xoá thành công, không có nội dung trả về | |
| 400 | Dữ liệu gửi lên không hợp lệ | `VALIDATION_ERROR` |
| 401 | Chưa đăng nhập, token sai hoặc hết hạn | `UNAUTHORIZED` |
| 403 | Không có quyền, hoặc tài khoản bị khoá | `FORBIDDEN`, `ACCOUNT_LOCKED` |
| 404 | Không tìm thấy (kể cả bài giảng của người khác, để không lộ là bài đó có tồn tại) | `NOT_FOUND` |
| 409 | Trùng dữ liệu (ví dụ email đã đăng ký) | `CONFLICT` |
| 500 | Lỗi máy chủ | `SERVER_ERROR` |

```json
{ "error": "Email đã được đăng ký", "code": "CONFLICT" }
```

## 2. Danh sách API

Cột **Quyền**: K = khách (không cần đăng nhập), GV = giáo viên, QTV = quản trị viên.

### 2.1 Tài khoản

| Phương thức | Đường dẫn | Quyền | Mô tả | Chức năng |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | K | Đăng ký tài khoản giáo viên | F01 |
| POST | `/api/auth/login` | K | Đăng nhập, trả về token | F02 |
| GET | `/api/auth/me` | GV, QTV | Thông tin tài khoản đang đăng nhập | F02 |
| PUT | `/api/auth/password` | GV, QTV | Đổi mật khẩu | F03 |

### 2.2 Sinh bài giảng

| Phương thức | Đường dẫn | Quyền | Mô tả | Chức năng |
| --- | --- | --- | --- | --- |
| POST | `/api/lessons/generate` | GV | Gửi mô tả; trả ngay `jobId`, sinh chạy nền | F10–F13 |
| GET | `/api/generation-jobs/:jobId` | GV | Trạng thái và bước hiện tại của công việc sinh | F14 |

Các bước của công việc sinh: `outline` (sinh dàn ý) → `retrieval` (tìm mô hình) → `layout` (dựng cảnh) → `done`; lỗi thì `failed`. Trạng thái công việc chỉ giữ trong bộ nhớ server; kết quả lưu vào bảng `lessons`, `slides`, còn nhật ký lưu vào `generations`.

### 2.3 Bài giảng và slide

| Phương thức | Đường dẫn | Quyền | Mô tả | Chức năng |
| --- | --- | --- | --- | --- |
| GET | `/api/lessons?q=` | GV | Danh sách bài giảng của mình, tìm theo tiêu đề | F20 |
| GET | `/api/lessons/:id` | GV | Bài giảng kèm toàn bộ slide | F20, F22 |
| PATCH | `/api/lessons/:id` | GV | Sửa tiêu đề, khối lớp | F21 |
| DELETE | `/api/lessons/:id` | GV | Xoá bài giảng | F20 |
| PUT | `/api/lessons/:id/share` | GV | Bật hoặc tắt chia sẻ; bật thì tạo mã mới | F31 |
| POST | `/api/lessons/:id/slides` | GV | Thêm slide trống (tối đa 10, BR01) | F25 |
| PATCH | `/api/lessons/:id/slides/:slideId` | GV | Sửa chữ, đổi mô hình, chỉnh vị trí (gửi `scene` mới) | F21, F23, F24 |
| DELETE | `/api/lessons/:id/slides/:slideId` | GV | Xoá slide | F25 |
| PUT | `/api/lessons/:id/slides/order` | GV | Sắp xếp lại thứ tự slide | F25 |
| POST | `/api/lessons/:id/slides/:slideId/regenerate` | GV | Sinh lại một slide | F26 |

### 2.4 Cảnh 3D

| Phương thức | Đường dẫn | Quyền | Mô tả | Chức năng |
| --- | --- | --- | --- | --- |
| POST | `/api/layout` | K | Nhận danh sách vật và quan hệ, trả về cảnh 3D đã sắp xếp | F35, F36, F23 |

### 2.5 Xem bài giảng được chia sẻ

| Phương thức | Đường dẫn | Quyền | Mô tả | Chức năng |
| --- | --- | --- | --- | --- |
| GET | `/api/shared/:shareCode` | K | Bài giảng chỉ xem; trả 404 nếu mã sai hoặc đã tắt chia sẻ (BR05) | F32 |

### 2.6 Thư viện mô hình

| Phương thức | Đường dẫn | Quyền | Mô tả | Chức năng |
| --- | --- | --- | --- | --- |
| GET | `/api/models?topic=&q=` | GV, QTV | Duyệt thư viện theo chủ đề, tìm theo tên; không trả mô hình bị ẩn (trừ QTV) | F41 |
| GET | `/api/models/:id` | K | Thông tin một mô hình, kể cả mô hình bị ẩn (bài giảng cũ vẫn hiển thị, BR08) | F22, F32 |
| GET | `/api/models/search?q=` | GV | Gợi ý mô hình cho một khái niệm (tìm kết hợp từ khoá và ngữ nghĩa) | F12, F23 |

### 2.7 Quản trị

| Phương thức | Đường dẫn | Quyền | Mô tả | Chức năng |
| --- | --- | --- | --- | --- |
| POST | `/api/admin/models` | QTV | Tải lên tệp `.glb` và thông tin mô hình (`multipart/form-data`) | F40 |
| PATCH | `/api/admin/models/:id` | QTV | Sửa thông tin, ẩn hoặc hiện mô hình | F42 |
| GET | `/api/admin/users` | QTV | Danh sách tài khoản | F43 |
| PATCH | `/api/admin/users/:id` | QTV | Khoá hoặc mở khoá tài khoản | F43 |

### 2.8 Tệp tĩnh và kiểm tra hệ thống

| Phương thức | Đường dẫn | Quyền | Mô tả |
| --- | --- | --- | --- |
| GET | `/models/:id.glb` | K | Tệp mô hình đã chuẩn hoá |
| GET | `/previews/:id.png` | K | Ảnh xem trước |
| GET | `/api/health` | K | Trạng thái server, PostgreSQL, Ollama (đã có từ CV2.6) |

## 3. Ví dụ chi tiết

### Đăng nhập

```http
POST /api/auth/login
{ "email": "co.lan@example.com", "password": "..." }
```

```json
200
{
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "email": "co.lan@example.com", "displayName": "Cô Lan", "role": "TEACHER" }
}
```

### Sinh bài giảng và theo dõi tiến trình

```http
POST /api/lessons/generate
Authorization: Bearer <token>
{ "request": "Bài học về giới từ in, on, under cho học sinh lớp 3, dùng đồ vật trong lớp học", "grade": 3, "slideCount": 5 }
```

```json
202
{ "jobId": "b7f3c2" }
```

Client gọi lại mỗi giây:

```http
GET /api/generation-jobs/b7f3c2
```

```json
200
{ "status": "running", "step": "retrieval", "attempts": 1 }
```

Khi xong:

```json
200
{ "status": "done", "step": "done", "lessonId": 12 }
```

Khi thất bại sau 3 lần thử (BR03):

```json
200
{ "status": "failed", "step": "outline", "error": "Không sinh được dàn ý hợp lệ sau 3 lần thử, hãy sửa lại mô tả" }
```

### Lấy bài giảng

```http
GET /api/lessons/12
```

```json
200
{
  "id": 12,
  "title": "Prepositions in the classroom",
  "grade": 3,
  "shareEnabled": false,
  "slides": [
    {
      "id": 40,
      "position": 1,
      "title": "Under",
      "sentence": "The cat is under the table.",
      "vocabulary": [{ "en": "cat", "vi": "con mèo" }, { "en": "table", "vi": "cái bàn" }],
      "scene": { "units": "m", "up": "+Y", "front": "+Z", "objects": ["..."], "relations": ["..."], "camera": {}, "warnings": [] }
    }
  ]
}
```

`scene` có cấu trúc theo `shared/schemas/scene.schema.json`; server kiểm tra lại bằng schema này mỗi khi `PATCH` một slide.

### Sắp xếp cảnh (đổi giới từ)

```http
POST /api/layout
{
  "objects": [{ "key": "cat", "modelId": "cat" }, { "key": "table", "modelId": "table" }],
  "relations": [{ "subject": "cat", "relation": "on", "object": "table" }]
}
```

```json
200
{ "scene": { "units": "m", "up": "+Y", "front": "+Z", "objects": ["..."], "relations": ["..."], "camera": {}, "warnings": [] } }
```

## 4. Thứ tự làm

| Giai đoạn | API |
| --- | --- |
| 3–5 (lõi nghiên cứu) | Chạy bằng dòng lệnh trước; `/api/layout`, `/api/models/search` |
| 6 (ứng dụng web) | Tài khoản, sinh bài giảng, bài giảng và slide, thư viện |
| 6 (nếu kịp) | Chia sẻ, quản trị, sinh lại slide |