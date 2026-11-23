# Danh sách vật trong thư viện

Liên quan: CV1.1 (giai đoạn 1). Nguồn mô hình: [05-khao-sat-nguon-mo-hinh-3d.md](05-khao-sat-nguon-mo-hinh-3d.md).

## Quy ước

- **id:** tiếng Anh, chữ thường, nối bằng `-`, không trùng; là tên tệp sau khi chuẩn hoá (`<id>.glb`).
- **Tệp nguồn:** `<thư mục trong assets/models/raw>` / `<tên tệp .glb không có đuôi>`. Viết tắt theo nguồn:
  - Kenney: `kn-<tên gói>` – `kn-furniture-kit` = `kenney_furniture-kit/Models/GLTF format`, `kn-cube-pets` = `kenney_cube-pets_1.0/Models/GLB format`, `kn-food-kit` = `kenney_food-kit/Models/GLB format`, `kn-toy-car-kit` = `kenney_toy-car-kit/Models/GLB format`.
  - Poly Pizza: `pp-<tên>` = `polypizza_<tên>`.
- **Vai trò cho giới từ:** **đỡ** (có mặt trên đặt đồ được, dùng cho *on*), **chứa** (có lòng bên trong, dùng cho *in*), **gầm** (có khoảng trống phía dưới, dùng cho *under*), **nhỏ** (vật nhỏ, thường làm chủ ngữ của câu).
- **Nghĩa (VI):** có từ chỉ loại (*cái*, *con*, *quả*…) để ghép câu nghĩa tiếng Việt (CV3.2a).

## 1. Lớp học (Classroom) – 16 vật

| STT | id | Từ vựng (EN) | Nghĩa (VI) | Tệp nguồn | Vai trò | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | desk | desk | cái bàn học | kn-furniture-kit / desk | đỡ, gầm | |
| 2 | chair | chair | cái ghế | kn-furniture-kit / chair | đỡ, gầm | Cao hơn `table` trước chuẩn hoá |
| 3 | table | table | cái bàn | kn-furniture-kit / table | đỡ, gầm | |
| 4 | book | book | quyển sách | kn-furniture-kit / books | nhỏ | Là một chồng sách |
| 5 | bookcase | bookcase | cái giá sách | kn-furniture-kit / bookcaseOpen | đỡ | Giá mở, đặt đồ lên từng ngăn |
| 6 | computer | computer | cái máy tính | kn-furniture-kit / computerScreen | nhỏ | |
| 7 | laptop | laptop | cái máy tính xách tay | kn-furniture-kit / laptop | nhỏ | |
| 8 | keyboard | keyboard | cái bàn phím | kn-furniture-kit / computerKeyboard | nhỏ | |
| 9 | bin | bin | cái thùng rác | kn-furniture-kit / trashcan | | Có nắp đóng, không chứa được |
| 10 | pencil | pencil | cái bút chì | pp-pencil / pencil | nhỏ | Nằm ngang; CC-BY |
| 11 | school-bag | school bag | cái cặp sách | pp-school-bag / school-bag | chứa | Cặp mở; CC-BY |
| 12 | bench | bench | cái ghế dài | kn-furniture-kit / bench | đỡ, gầm | |
| 13 | stool | stool | cái ghế đẩu | kn-furniture-kit / stoolBar | đỡ, gầm | |
| 14 | speaker | speaker | cái loa | kn-furniture-kit / speaker | nhỏ | |
| 15 | coat-rack | coat rack | cái giá treo áo | kn-furniture-kit / coatRackStanding | | |
| 16 | plant | plant | cái chậu cây | kn-furniture-kit / pottedPlant | nhỏ | |

## 2. Ngôi nhà (House) – 22 vật

| STT | id | Từ vựng (EN) | Nghĩa (VI) | Tệp nguồn | Vai trò | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | bed | bed | cái giường | kn-furniture-kit / bedSingle | đỡ, gầm | Có phép xoay bên trong mô hình |
| 2 | double-bed | double bed | cái giường đôi | kn-furniture-kit / bedDouble | đỡ, gầm | |
| 3 | bunk-bed | bunk bed | cái giường tầng | kn-furniture-kit / bedBunk | đỡ, gầm | |
| 4 | sofa | sofa | cái ghế sô-pha | kn-furniture-kit / loungeSofa | đỡ | |
| 5 | armchair | armchair | cái ghế bành | kn-furniture-kit / loungeChair | đỡ | |
| 6 | coffee-table | coffee table | cái bàn uống nước | kn-furniture-kit / tableCoffee | đỡ, gầm | |
| 7 | side-table | side table | cái tủ đầu giường | kn-furniture-kit / sideTable | đỡ | |
| 8 | lamp | lamp | cái đèn bàn | kn-furniture-kit / lampRoundTable | nhỏ | |
| 9 | floor-lamp | floor lamp | cái đèn đứng | kn-furniture-kit / lampSquareFloor | | Ca thử RQ1: đèn bàn – đèn đứng |
| 10 | television | television | cái ti vi | kn-furniture-kit / televisionModern | | Màn hình mỏng, không đặt đồ lên được |
| 11 | fridge | fridge | cái tủ lạnh | kn-furniture-kit / kitchenFridge | đỡ | Mô hình đóng cửa, chỉ đặt đồ lên nóc |
| 12 | cooker | cooker | cái bếp | kn-furniture-kit / kitchenStove | đỡ | |
| 13 | sink | sink | cái bồn rửa | kn-furniture-kit / kitchenSink | chứa | |
| 14 | microwave | microwave | cái lò vi sóng | kn-furniture-kit / kitchenMicrowave | đỡ | |
| 15 | cupboard | cupboard | cái tủ bếp | kn-furniture-kit / kitchenCabinet | đỡ | |
| 16 | bath | bath | cái bồn tắm | kn-furniture-kit / bathtub | chứa | |
| 17 | toilet | toilet | cái bồn cầu | kn-furniture-kit / toilet | | |
| 18 | mirror | mirror | cái gương | kn-furniture-kit / bathroomMirror | | Treo tường |
| 19 | washing-machine | washing machine | cái máy giặt | kn-furniture-kit / washer | đỡ | |
| 20 | pillow | pillow | cái gối | kn-furniture-kit / pillow | nhỏ, đỡ | |
| 21 | rug | rug | cái thảm | kn-furniture-kit / rugRound | đỡ | Rất mỏng, dùng cho *on* |
| 22 | box | box | cái hộp | kn-furniture-kit / cardboardBoxOpen | chứa | Hộp mở, hợp với *in* |

## 3. Con vật (Animals) – 20 vật

Toàn bộ lấy từ Cube Pets (mỗi con có 8 hoạt hình; texture để ngoài tệp, cần nhúng khi chuẩn hoá; kích thước gốc rất lớn so với đồ nội thất, cần thu nhỏ).

| STT | id | Từ vựng (EN) | Nghĩa (VI) | Tệp nguồn | Vai trò | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | cat | cat | con mèo | kn-cube-pets / animal-cat | nhỏ | |
| 2 | dog | dog | con chó | kn-cube-pets / animal-dog | nhỏ | |
| 3 | fish | fish | con cá | kn-cube-pets / animal-fish | nhỏ | Trùng tên với `fish` của Food Kit (ca thử RQ1) |
| 4 | bird | bird | con chim | kn-cube-pets / animal-parrot | nhỏ | Mô hình là con vẹt |
| 5 | chick | chick | con gà con | kn-cube-pets / animal-chick | nhỏ | |
| 6 | rabbit | rabbit | con thỏ | kn-cube-pets / animal-bunny | nhỏ | |
| 7 | monkey | monkey | con khỉ | kn-cube-pets / animal-monkey | nhỏ | |
| 8 | elephant | elephant | con voi | kn-cube-pets / animal-elephant | | Kích thước thực rất lớn |
| 9 | tiger | tiger | con hổ | kn-cube-pets / animal-tiger | | |
| 10 | lion | lion | con sư tử | kn-cube-pets / animal-lion | | |
| 11 | giraffe | giraffe | con hươu cao cổ | kn-cube-pets / animal-giraffe | | Kích thước thực rất lớn |
| 12 | cow | cow | con bò | kn-cube-pets / animal-cow | | |
| 13 | pig | pig | con lợn | kn-cube-pets / animal-pig | | |
| 14 | panda | panda | con gấu trúc | kn-cube-pets / animal-panda | | |
| 15 | penguin | penguin | con chim cánh cụt | kn-cube-pets / animal-penguin | nhỏ | |
| 16 | bee | bee | con ong | kn-cube-pets / animal-bee | nhỏ | Kích thước thực rất nhỏ, cần phóng to khi minh hoạ |
| 17 | crab | crab | con cua | kn-cube-pets / animal-crab | nhỏ | |
| 18 | fox | fox | con cáo | kn-cube-pets / animal-fox | nhỏ | |
| 19 | deer | deer | con hươu | kn-cube-pets / animal-deer | | |
| 20 | polar-bear | polar bear | con gấu Bắc Cực | kn-cube-pets / animal-polar | | |

## 4. Đồ ăn (Food) – 24 vật

Toàn bộ lấy từ Food Kit (texture để ngoài tệp, cần nhúng khi chuẩn hoá).

| STT | id | Từ vựng (EN) | Nghĩa (VI) | Tệp nguồn | Vai trò | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | apple | apple | quả táo | kn-food-kit / apple | nhỏ | |
| 2 | banana | banana | quả chuối | kn-food-kit / banana | nhỏ | |
| 3 | orange | orange | quả cam | kn-food-kit / orange | nhỏ | |
| 4 | pear | pear | quả lê | kn-food-kit / pear | nhỏ | |
| 5 | lemon | lemon | quả chanh | kn-food-kit / lemon | nhỏ | |
| 6 | strawberry | strawberry | quả dâu tây | kn-food-kit / strawberry | nhỏ | |
| 7 | grapes | grapes | chùm nho | kn-food-kit / grapes | nhỏ | |
| 8 | watermelon | watermelon | quả dưa hấu | kn-food-kit / watermelon | nhỏ | |
| 9 | tomato | tomato | quả cà chua | kn-food-kit / tomato | nhỏ | |
| 10 | carrot | carrot | củ cà rốt | kn-food-kit / carrot | nhỏ | |
| 11 | egg | egg | quả trứng | kn-food-kit / egg | nhỏ | |
| 12 | bread | bread | lát bánh mì | kn-food-kit / bread | nhỏ | Lát bánh mì phẳng |
| 13 | cake | cake | cái bánh ngọt | kn-food-kit / cake | nhỏ | |
| 14 | cookie | cookie | cái bánh quy | kn-food-kit / cookie | nhỏ | |
| 15 | donut | donut | cái bánh vòng | kn-food-kit / donut | nhỏ | |
| 16 | ice-cream | ice cream | cây kem | kn-food-kit / ice-cream | nhỏ | |
| 17 | pizza | pizza | cái bánh pizza | kn-food-kit / pizza | nhỏ | |
| 18 | burger | burger | cái bánh hamburger | kn-food-kit / burger | nhỏ | |
| 19 | sandwich | sandwich | cái bánh sandwich | kn-food-kit / sandwich | nhỏ | |
| 20 | cheese | cheese | miếng phô mai | kn-food-kit / cheese | nhỏ | |
| 21 | milk | milk | hộp sữa | kn-food-kit / carton | nhỏ | Mô hình là hộp giấy |
| 22 | plate | plate | cái đĩa | kn-food-kit / plate | đỡ | |
| 23 | bowl | bowl | cái bát | kn-food-kit / bowl | chứa | |
| 24 | cup | cup | cái cốc | kn-food-kit / cup | chứa | |

## 5. Đồ chơi (Toys) – 9 vật

| STT | id | Từ vựng (EN) | Nghĩa (VI) | Tệp nguồn | Vai trò | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | ball | ball | quả bóng | pp-ball / ball | nhỏ | 13.200 tam giác, tâm ở giữa; CC-BY |
| 2 | teddy-bear | teddy bear | con gấu bông | pp-teddy-bear / teddy-bear | nhỏ | Đơn vị rất lớn, lệch xa gốc toạ độ; CC-BY |
| 3 | doll | doll | con búp bê | pp-doll / doll | nhỏ | Có thể đang nằm, cần kiểm tra hướng |
| 4 | robot | robot | con rô-bốt | pp-robot / robot | nhỏ | 14 hoạt hình |
| 5 | ship | ship | con thuyền | pp-ship / ship | | Thuyền buồm, tâm lệch |
| 6 | plane | plane | cái máy bay | pp-airplane / airplane | | Đơn vị rất lớn; 11.287 tam giác; CC-BY |
| 7 | skateboard | skateboard | cái ván trượt | pp-skateboard / skateboard | đỡ | Tệp 1,1 MB; CC-BY |
| 8 | car | car | cái ô tô | kn-toy-car-kit / vehicle-racer | nhỏ | |
| 9 | truck | truck | cái xe tải | kn-toy-car-kit / vehicle-truck | nhỏ | |

## 6. Tổng hợp

| Chủ đề | Số vật | Vật đỡ | Vật chứa | Vật có gầm |
| --- | --- | --- | --- | --- |
| Lớp học | 16 | 6 | 1 | 5 |
| Ngôi nhà | 22 | 14 | 3 | 4 |
| Con vật | 20 | 0 | 0 | 0 |
| Đồ ăn | 24 | 1 | 2 | 0 |
| Đồ chơi | 9 | 1 | 0 | 0 |
| **Tổng** | **91** | | | |

- Con vật, đồ ăn, đồ chơi chủ yếu là **vật nhỏ**, nên bài giới từ của các chủ đề này **ghép với vật đỡ, vật chứa của lớp học và ngôi nhà** (ví dụ *The cat is under the bed*, *The apple is in the bowl*, *The ball is in the box*).
- Toàn bộ 91 tệp nguồn đã có trong `assets/models/raw/`.

## 7. Từ vựng phổ biến còn thiếu mô hình

Các từ hay gặp trong sách giáo khoa tiếng Anh tiểu học nhưng chưa có mô hình trong các nguồn đã tải. Tìm thêm trên Poly Pizza để đạt khoảng 100 vật, ưu tiên theo thứ tự:

| Chủ đề | Từ còn thiếu |
| --- | --- |
| Lớp học | board, ruler, eraser, pen, pencil case, notebook, clock, crayon |
| Đồ chơi | kite, train, yo-yo, blocks, puzzle |
| Ngôi nhà | wardrobe, door, window, clock |
