# Khảo sát nguồn mô hình 3D

Ngày khảo sát: 15/11/2026 · Liên quan: CV0.6 (giai đoạn 0, mốc M1)

Mục đích: tìm nguồn mô hình 3D để xây thư viện cho 5 chủ đề từ vựng (lớp học, ngôi nhà, con vật, đồ ăn, đồ chơi).

## 1. Tiêu chí đánh giá

| Tiêu chí | Yêu cầu |
| --- | --- |
| Giấy phép | Ưu tiên CC0; chấp nhận CC-BY nếu ghi công đầy đủ |
| Định dạng | Có `.glb` hoặc chuyển đổi được |
| Phong cách | Low-poly, màu tươi, đơn giản, đồng bộ giữa các mô hình |
| Dung lượng | Dưới 2 MB mỗi mô hình |
| Độ phủ chủ đề | Có nhiều vật thuộc 5 chủ đề |
| Nội dung | Phù hợp trẻ em |

## 2. Danh sách từ dùng để khảo sát

40 từ, 8 từ mỗi chủ đề.

| Chủ đề | Từ vựng |
| --- | --- |
| Lớp học | table, chair, book, pencil, desk, computer, bookcase, school bag |
| Ngôi nhà | bed, sofa, lamp, box, television, fridge, pillow, plant |
| Con vật | cat, dog, bird, fish, rabbit, monkey, elephant, tiger |
| Đồ ăn | apple, banana, cake, egg, orange, bread, carrot, ice cream |
| Đồ chơi | ball, teddy bear, toy car, doll, robot, skateboard, plane, ship |

## 3. Kết quả theo nguồn

### 3.1 Kenney (kenney.nl)

| Gói | Phiên bản | Giấy phép | Số mô hình `.glb` | Dung lượng TB / lớn nhất | Tam giác | Texture |
| --- | --- | --- | --- | --- | --- | --- |
| Furniture Kit | 2.0 (2018) | CC0 | 140 | 13,7 KB / 70 KB | 60–600 | Không dùng, màu phẳng |
| Cube Pets | 2.0 (2026) | CC0 | 24 | 137 KB / 171 KB | 420–690 | Tệp ngoài `colormap.png` |
| Food Kit | 2.0 (2024) | CC0 | 200 | 16,4 KB / 113 KB | 44–1.200 | Tệp ngoài `colormap.png` |
| Toy Car Kit | 1.2 (2025) | CC0 | 157 (8 mẫu xe dùng được, còn lại là đường đua) | 25,5 KB / 119 KB | khoảng 1.100 | Tệp ngoài `colormap.png` |

- Phủ được **31/40 từ**; thiếu toàn bộ đồ chơi (trừ toy car) và *pencil*, *school bag*.
- Mỗi con vật trong Cube Pets có sẵn 8 hoạt hình (đi, đứng yên…).

### 3.2 Poly Pizza (poly.pizza)

Giấy phép tính theo **từng mô hình**.

| Từ | Mô hình | Tác giả | Giấy phép | Dung lượng | Tam giác |
| --- | --- | --- | --- | --- | --- |
| pencil | Pencil | Poly by Google | CC-BY 3.0 | 14 KB | 432 |
| ball | Simple soccer football | Smirnoff Alexander | CC-BY 3.0 | 534 KB | 13.200 |
| teddy bear | Bear | jiang liu | CC-BY 3.0 | 138 KB | 5.110 |
| doll | Doll | CreativeTrio | CC0 | 95 KB | 1.234 |
| school bag | Open Backpack | Emmett "TawpShelf" Baber | CC-BY 3.0 | 64 KB | 714 |
| robot | Animated Robot | Quaternius | CC0 | 392 KB | 3.237 |
| plane | Airplane | Poly by Google | CC-BY 3.0 | 189 KB | 11.287 |
| ship | Sail Ship | Quaternius | CC0 | 209 KB | 3.938 |
| skateboard | Skateboard | Poly by Google | CC-BY 3.0 | 1.122 KB | 756 |

- Phủ thêm **8/40 từ**; độ chi tiết và phong cách khác nhau nhiều giữa các tác giả.

## 4. Độ phủ 40 từ

| Chủ đề | Độ phủ |
| --- | --- |
| Lớp học | 8/8 |
| Ngôi nhà | 8/8 |
| Con vật | 8/8 |
| Đồ ăn | 8/8 |
| Đồ chơi | 8/8 |
| **Tổng** | **40/40** |

## 5. Vấn đề phát hiện khi đo mô hình

| Vấn đề | Ví dụ | Hướng xử lý (CV1.3) |
| --- | --- | --- |
| Tỉ lệ giữa các gói không thống nhất | `table` cao 0,33; `animal-cat` cao 1,71 (gấp 5 lần cái bàn); `teddy-bear` cao 699 | Chuẩn hoá theo kích thước thực tương đối (BR07) |
| Gốc toạ độ không ở giữa đáy | Furniture Kit: gốc ở góc; `ball`, `pencil`, `school-bag`: gốc ở giữa vật; `teddy-bear`: lệch rất xa | Dời gốc toạ độ về giữa đáy |
| Hướng đặt sai | `pencil`, `doll` đang nằm ngang | Xoay về đúng hướng |
| Texture để ngoài tệp `.glb` | Cube Pets, Food Kit, Toy Car Kit dùng `Textures/colormap.png` | Nhúng texture vào `.glb` |
| Độ chi tiết chênh lệch | Kenney 44–1.200 tam giác; `ball` 13.200, `airplane` 11.287 | Cân nhắc giảm số tam giác hoặc thay mô hình |
| Trùng tên khác nghĩa | `animal-fish` (con cá) và `fish` (cá để ăn) | Đưa vào bộ dữ liệu RQ1 làm ca thử từ nhiều nghĩa |

## 6. Ghi công các mô hình CC-BY

Thư mục `assets/models/raw/` không được đưa lên Git, nên dòng ghi công được lưu lại tại đây. Khi xây thư viện (giai đoạn 1), thông tin này chuyển vào `assets/models/catalog.json` và hiển thị trong ứng dụng (NFR04).

- Pencil by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/3Sd2klX0_s4)
- Simple soccer football by Smirnoff Alexander [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/57u6P7Sr7K0)
- Bear by jiang liu [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/3Eb9oLfZYIc)
- Open Backpack by Emmett "TawpShelf" Baber [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/26m92LMKK4e)
- Airplane by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/a3XrQkLNna9)
- Skateboard by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/7Dfn4VtTCWY)

Các mô hình CC0 (không bắt buộc ghi công): toàn bộ 4 gói Kenney; Doll by CreativeTrio (https://poly.pizza/m/YUAwclCDrF); Animated Robot by Quaternius (https://poly.pizza/m/QCm7qe9uNJ); Sail Ship by Quaternius (https://poly.pizza/m/cIzO4MBPqI).

## 7. Kết luận

- **Nguồn chính:** [Kenney](https://kenney.nl/)
- **Nguồn bổ sung:** [Poly Pizza](https://poly.pizza/)
