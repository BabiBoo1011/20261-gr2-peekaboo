# Thiết kế cấu trúc JSON

Liên quan: CV2.2 (giai đoạn 2). Tệp schema: `shared/schemas/outline.schema.json`, `shared/schemas/scene.schema.json`. Danh sách dùng chung: `shared/constants.js`.

## 1. Hai loại dữ liệu

| | Dàn ý (outline) | Cảnh 3D (scene) |
| --- | --- | --- |
| Ai tạo | LLM (giai đoạn 3) | Hệ thống: tìm mô hình (giai đoạn 4) và sắp xếp cảnh (giai đoạn 5) |
| Nội dung | Chữ và **quan hệ không gian** giữa các vật | Mô hình được chọn, **toạ độ**, góc xoay, tỉ lệ, camera |
| Có toạ độ | Không | Có |
| Lưu ở đâu | Bảng lần sinh bài giảng (phục vụ RQ3) | Dữ liệu cảnh của slide, kiểu `JSONB` |

Tách hai loại để **LLM không bao giờ sinh con số toạ độ** (xem [06-khao-sat-nghien-cuu-lien-quan.md](06-khao-sat-nghien-cuu-lien-quan.md), mục 4.3).

## 2. Dàn ý

| Trường | Kiểu | Ràng buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `title` | chuỗi | 1–80 ký tự | Tên bài giảng |
| `slides` | mảng | 1–10 phần tử (BR01) | Các slide |
| `slides[].title` | chuỗi | 1–60 ký tự | Tiêu đề slide, tiếng Anh |
| `slides[].sentence` | chuỗi | 1–120 ký tự | Câu mẫu, tiếng Anh |
| `slides[].vocabulary` | mảng chuỗi | 1–6 từ | Từ vựng tiếng Anh của slide |
| `slides[].scene.objects` | mảng chuỗi | 1–4 vật (BR01), không trùng tên | Tên vật, tiếng Anh, chữ thường |
| `slides[].scene.relations` | mảng | tối đa 3 | Quan hệ không gian |
| `relations[].subject` | chuỗi | | Vật được đặt |
| `relations[].relation` | chuỗi | 1 trong 7 giới từ (BR02) | Giới từ |
| `relations[].object` | chuỗi | | Vật làm mốc |
| `relations[].object2` | chuỗi | chỉ dùng với *between* | Vật làm mốc thứ hai |

- LLM **chỉ sinh tiếng Anh**. Nghĩa tiếng Việt được ghép từ `nameVi` trong thư viện mô hình (CV3.2a), không dùng bản dịch của LLM.
- Schema dàn ý chỉ dùng các từ khoá Ollama hỗ trợ (`type`, `properties`, `required`, `enum`, `minItems`, `maxItems`…), vì cũng được gửi cho Ollama để ép cấu trúc đầu ra (CV3.2).

Ví dụ:

```json
{
  "title": "Prepositions in the classroom",
  "slides": [
    {
      "title": "Under",
      "sentence": "The cat is under the table.",
      "vocabulary": ["cat", "table", "under"],
      "scene": {
        "objects": ["cat", "table"],
        "relations": [{ "subject": "cat", "relation": "under", "object": "table" }]
      }
    },
    {
      "title": "Between",
      "sentence": "The ball is between the chair and the box.",
      "vocabulary": ["ball", "chair", "box", "between"],
      "scene": {
        "objects": ["ball", "chair", "box"],
        "relations": [{ "subject": "ball", "relation": "between", "object": "chair", "object2": "box" }]
      }
    }
  ]
}
```

## 3. Cảnh 3D

Quy ước toạ độ khớp với bước chuẩn hoá mô hình (CV1.3): đơn vị **mét**, trục **+Y hướng lên**, mặt trước của vật nhìn về **+Z**, gốc toạ độ của mỗi mô hình ở **giữa đáy**.

| Trường | Kiểu | Ý nghĩa |
| --- | --- | --- |
| `units`, `up`, `front` | hằng `"m"`, `"+Y"`, `"+Z"` | Ghi rõ quy ước để kiểm tra |
| `objects[].key` | chuỗi | Tên vật trong dàn ý |
| `objects[].modelId` | chuỗi hoặc `null` | id mô hình trong `catalog.json`; `null` = không tìm được mô hình, hiển thị thẻ chữ thay thế (BR09) |
| `objects[].position` | `[x, y, z]` | Vị trí giữa đáy của vật |
| `objects[].rotationY` | số, −180…180 | Góc xoay quanh trục đứng, đơn vị **độ** |
| `objects[].scale` | số > 0 | Tỉ lệ so với kích thước đã chuẩn hoá (1 = giữ nguyên) |
| `relations` | mảng | Chép từ dàn ý; *between* bắt buộc có `object2`, giới từ khác không được có |
| `camera.position`, `camera.target` | `[x, y, z]` | Góc nhìn mặc định (BR11) |
| `warnings` | mảng chuỗi | Ghi chú khi phải xử lý ngoại lệ (CV5.4) |

Ví dụ *The cat is under the table*: gầm bàn cao 0,64 m, con mèo cao 0,3 m (số liệu từ `catalog.json`) nên đặt vừa, không cần thu nhỏ.

```json
{
  "units": "m",
  "up": "+Y",
  "front": "+Z",
  "objects": [
    { "key": "table", "modelId": "table", "position": [0, 0, 0], "rotationY": 0, "scale": 1 },
    { "key": "cat", "modelId": "cat", "position": [0, 0, 0], "rotationY": 0, "scale": 1 }
  ],
  "relations": [{ "subject": "cat", "relation": "under", "object": "table" }],
  "camera": { "position": [1.6, 1.4, 2.6], "target": [0, 0.375, 0] },
  "warnings": []
}
```

## 4. Luật JSON Schema không kiểm tra được

Các luật sau kiểm tra bằng code ở CV3.3:

1. `subject`, `object`, `object2` phải nằm trong `objects` của cùng slide.
2. Có `object2` khi và chỉ khi giới từ là *between* (schema dàn ý không dùng được `if/then`, vì Ollama không hỗ trợ).
3. `subject` khác `object` và `object2`.
4. Câu mẫu phải chứa giới từ của quan hệ.
5. Vật nên có trong thư viện mô hình (đưa danh sách vật vào prompt ở CV3.1).

**Thử với Ollama (27/11/2026, `qwen2.5:7b`, 23 giây):** dàn ý trả về **hợp lệ theo schema** nhưng slide *between* vẫn sai: thiếu `object2`, vật tên `window2` không khớp câu mẫu và không có trong thư viện. Điều này cho thấy schema chỉ bảo đảm **cấu trúc**; các luật trên là bắt buộc.