# Quy ước dự án Peekaboo

Tài liệu này quy định cấu trúc thư mục, cách đặt tên và cách viết commit để toàn bộ dự án thống nhất từ đầu đến cuối.

## 1. Cấu trúc thư mục

Đây là **cấu trúc đích** của dự án. Thư mục nào chỉ được tạo khi bắt đầu làm tới giai đoạn tương ứng (cột "Tạo ở" – xem kế hoạch mục 12 trong [tài liệu mô tả](01-mo-ta-du-an.md)), không tạo sẵn thư mục rỗng.

```
20261-gr2-peekaboo/
├── README.md                  Giới thiệu dự án, cách cài đặt và chạy
├── .gitignore
│
├── docs/                      Tài liệu (tiếng Việt)
│   ├── 00-quy-uoc-du-an.md
│   ├── 01-mo-ta-du-an.md
│   ├── 02-thiet-ke-csdl.md
│   ├── 03-thiet-ke-api.md
│   ├── 04-thiet-ke-json.md        Cấu trúc dàn ý và cảnh 3D
│   ├── images/                    Sơ đồ, ảnh chụp màn hình
│   └── nhat-ky/                   Nhật ký kỹ thuật, báo cáo tiến độ hằng tuần
│
├── prototype/                 Bản thử nghiệm nhanh, không dùng cho sản phẩm
│
├── client/                    Frontend: ReactJS + React Three Fiber
│   └── src/
│       ├── pages/                 Các màn hình
│       ├── components/            Thành phần giao diện dùng chung
│       ├── scene/                 Hiển thị cảnh 3D, camera, tương tác
│       ├── api/                   Hàm gọi backend
│       └── utils/
│
├── server/                    Backend: Node.js + Express
│   ├── src/
│   │   ├── routes/                Khai báo API
│   │   ├── controllers/           Nhận request, trả response
│   │   ├── services/              Nghiệp vụ chính
│   │   │   ├── llm/                   Sinh dàn ý (gọi Ollama)
│   │   │   ├── retrieval/             Tìm mô hình 3D
│   │   │   └── layout/                Bộ sắp xếp cảnh
│   │   ├── db/                    Kết nối PostgreSQL, câu truy vấn
│   │   └── middlewares/           Xác thực, phân quyền, xử lý lỗi
│   └── tests/                 Kiểm thử tự động
│
├── shared/                    Dùng chung cho client và server
│   ├── schemas/                   JSON Schema của dàn ý và cảnh 3D
│   └── constants.js               Giới từ, chủ đề, mã trạng thái
│
├── database/
│   ├── schema.sql                 Tạo bảng
│   └── seed.sql                   Dữ liệu mẫu
│
├── assets/
│   └── models/                Thư viện mô hình 3D
│       ├── raw/                   Tệp gốc tải về (KHÔNG đưa lên Git)
│       ├── processed/             Tệp .glb đã chuẩn hoá
│       ├── previews/              Ảnh xem trước
│       └── catalog.json           Thông tin mô hình
│
├── scripts/                   Script chạy tay (chuẩn hoá mô hình, tạo vector, tạo tài khoản quản trị)
│
└── experiments/               Thực nghiệm (mục 8 tài liệu mô tả)
    ├── data/                      Bộ dữ liệu RQ1, RQ2, RQ3
    ├── run/                       Script chạy từng câu hỏi nghiên cứu
    └── results/                   Bảng số liệu, biểu đồ
```

### Thư mục được tạo ở giai đoạn nào

| Thư mục | Tạo ở | Cách tạo |
| --- | --- | --- |
| `docs/`, `prototype/` | Giai đoạn 0 | Đã có |
| `docs/nhat-ky/`, `docs/images/` | Khi cần | Tạo tay |
| `assets/models/`, `scripts/`, `experiments/data/` | Giai đoạn 1 | Tạo tay |
| `database/`, `shared/` | Giai đoạn 2 | Tạo tay |
| `client/` | Giai đoạn 2 (CV2.6) | Dùng công cụ tạo dự án React; **không tạo tay trước** |
| `server/` | Giai đoạn 2 (CV2.6) | Khởi tạo dự án Node.js rồi tạo dần thư mục con |
| `experiments/run/`, `experiments/results/` | Giai đoạn 4 trở đi | Tạo tay |

### Nguyên tắc

- **`server/src/services/`** tách theo 3 bộ phận nghiên cứu: `llm/` (giai đoạn 3), `retrieval/` (giai đoạn 4), `layout/` (giai đoạn 5).
- **`shared/`** là nơi duy nhất định nghĩa cấu trúc JSON và danh sách giới từ, chủ đề; client và server cùng đọc từ đây.
- **`experiments/`** tách khỏi code ứng dụng để chạy lại thực nghiệm độc lập.
- **`prototype/`** chỉ chứa bản thử nghiệm; không import code từ đây vào sản phẩm.

## 2. Quy ước đặt tên

| Đối tượng | Quy ước | Ví dụ |
| --- | --- | --- |
| Thư mục | chữ thường, nối bằng `-` | `nhat-ky`, `experiments` |
| Tệp tài liệu | đánh số + chữ thường không dấu, nối bằng `-` | `02-thiet-ke-csdl.md` |
| Tệp code JavaScript | `camelCase` | `layoutEngine.js`, `retrievalService.js` |
| Thành phần React | `PascalCase` | `SlideEditor.jsx`, `SceneViewer.jsx` |
| Biến, hàm | tiếng Anh, `camelCase` | `findBestModel()` |
| Hằng số | chữ hoa, nối bằng `_` | `MAX_SLIDES`, `SUPPORTED_PREPOSITIONS` |
| Tệp dữ liệu, mô hình 3D | chữ thường, nối bằng `-` | `rq1-concepts.json`, `school-desk.glb` |
| Nhật ký tuần | `tuan-XX.md` | `docs/nhat-ky/tuan-01.md` |

**Quy tắc chung:**

- Mọi tên tệp và thư mục **không dấu, không dấu cách**.
- Tên trong code và nội dung commit viết bằng **tiếng Anh**; chú thích trong code và nội dung tài liệu viết bằng **tiếng Việt**.

## 3. Quy ước commit

Commit viết **hoàn toàn bằng tiếng Anh**. Mỗi commit bắt đầu bằng một từ khoá cho biết loại thay đổi, sau đó là mô tả ngắn:

```
<từ khoá>: <mô tả ngắn bằng tiếng Anh>
```

| Từ khoá | Dùng khi | Ví dụ |
| --- | --- | --- |
| `feat:` | Thêm chức năng | `feat: add placement rule for "under"` |
| `fix:` | Sửa lỗi | `fix: prevent cat from sinking into floor with "under"` |
| `docs:` | Sửa tài liệu | `docs: update phase 5 plan` |
| `exp:` | Thực nghiệm | `exp: run RQ1 with hybrid retrieval` |
| `test:` | Thêm hoặc sửa kiểm thử | `test: cover all 7 prepositions in layout engine` |
| `refactor:` | Sửa cấu trúc code, không đổi chức năng | `refactor: extract Ollama client into its own module` |
| `chore:` | Cấu hình, dọn dẹp | `chore: add .gitignore` |

**Cách viết mô tả:**

- Dùng **động từ nguyên mẫu ở đầu câu**, như đang ra lệnh: `add`, `fix`, `update`, `remove`, `rename`, `move` (viết `add login page`, không viết `added login page` hay `adds login page`).
- Viết **chữ thường** ở đầu mô tả, **không có dấu chấm** ở cuối.
- Ngắn gọn, **không quá 72 ký tự**.
- Nếu cần giải thích thêm, để trống một dòng rồi viết phần thân (body), cũng bằng tiếng Anh.

**Nguyên tắc:**

- Mỗi commit chỉ chứa **một thay đổi có ý nghĩa**; không gom nhiều việc khác nhau vào một commit.
- Commit và đưa lên GitHub **hằng ngày** (mục 12.5 tài liệu mô tả).
- **Không bao giờ commit tệp `.env`** hoặc mật khẩu, khoá bí mật.

## 4. Mô hình 3D trên Git

- Chỉ đưa lên Git tệp **đã chuẩn hoá** trong `assets/models/processed/` (mỗi tệp dưới 2 MB).
- Tệp gốc tải về để trong `assets/models/raw/`; thư mục này đã được chặn trong `.gitignore`.
- Mỗi mô hình phải có trong `catalog.json` kèm **đường dẫn nguồn** và **giấy phép**, để có thể tải lại tệp gốc và ghi công đúng giấy phép.
