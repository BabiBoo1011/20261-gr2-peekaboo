# Khảo sát nghiên cứu liên quan

Liên quan: CV0.7 (giai đoạn 0, mốc M1)

Mỗi công trình ghi theo cùng một mẫu: thông tin trích dẫn, làm gì, làm thế nào, hạn chế, liên hệ với Peekaboo.

## 1. Sinh cảnh 3D từ văn bản

### 1.1 WordsEye (2001)

**Trích dẫn:** Bob Coyne, Richard Sproat. *WordsEye: An Automatic Text-to-Scene Conversion System.* SIGGRAPH 2001. DOI: [10.1145/383259.383316](https://doi.org/10.1145/383259.383316)

**Làm gì:** Chuyển một đoạn văn tiếng Anh thành **cảnh 3D tĩnh**, để người dùng phổ thông tạo cảnh 3D mà không cần học phần mềm đồ hoạ. Ví dụ: *"The cat is on the table. The animal is next to a bowl of apples."*

**Làm thế nào:**

1. **Phân tích câu:** gán nhãn từ loại, phân tích cú pháp bằng mô hình thống kê, chuyển sang cấu trúc phụ thuộc, rồi sang **biểu diễn ngữ nghĩa** gồm thực thể (danh từ), hành động (động từ), thuộc tính (tính từ), quan hệ (giới từ).
2. **Chọn mô hình 3D:** thư viện khoảng **2.000 mô hình** (mua bản quyền), mỗi mô hình gắn với từ trong **WordNet**, nên *cat*, *feline*, *mammal* đều tìm ra mô hình con mèo. Khi nhiều mô hình khớp thì **chọn ngẫu nhiên**.
3. **Thông tin bổ sung cho mỗi mô hình:** kích thước mặc định, các bộ phận, thuộc tính chức năng, và **thẻ không gian (spatial tags)**: vùng đánh dấu như *mặt trên* (top surface), *lòng chứa* (cup), *vùng gầm* (canopy area), *đế* (base).
4. **Đặt vị trí theo giới từ** bằng thẻ không gian, ví dụ:
   - *The bird is on the cat* → đặt **đế** của con chim lên **mặt trên** (lưng) con mèo.
   - *The elephant is under the chair* → đặt con voi vào **vùng gầm** của ghế, **thu nhỏ** nếu không vừa.
5. **Luật bổ sung ràng buộc ngầm:** *"The glass is next to the lamp"* (cây đèn ở trên bàn) → tự đặt cái cốc **lên bàn** chứ không để lơ lửng.
6. **Tự đặt camera** góc nhìn ba phần tư bao trọn các vật, rồi kết xuất hình.
7. **Không có mô hình phù hợp** → hiển thị chữ 3D của từ đó thay cho vật.

**Hạn chế:**

- Phân tích câu và đặt vị trí dựa trên **luật viết tay**: khó mở rộng (khoảng 1.300 danh từ), khó xử lý câu lạ.
- Chọn mô hình **ngẫu nhiên** trong các mô hình khớp, không xét mức độ phù hợp.
- Chỉ tạo **cảnh tĩnh, không tương tác**; thiếu kiến thức thường thức về môi trường.
- Kết quả có thể khác ý người dùng; bài báo **không có đánh giá định lượng**.
- Thư viện mô hình là bản thương mại.

**Liên hệ với Peekaboo:**

| | WordsEye | Peekaboo |
| --- | --- | --- |
| Đầu vào | Văn bản tiếng Anh tự do | Mô tả bài học bằng tiếng Việt hoặc tiếng Anh |
| Hiểu văn bản | Bộ phân tích cú pháp và luật viết tay | **LLM** sinh dàn ý JSON theo schema |
| Chọn mô hình | Tra WordNet, chọn ngẫu nhiên | **Kết hợp từ khoá và vector ngữ nghĩa**, có ngưỡng (RQ1) |
| Đặt vị trí | Thẻ không gian và luật | Hộp bao và **thuộc tính đặt vật** (mặt trên, chứa được, khoảng trống dưới gầm – CV1.4) |
| Đầu ra | Một hình tĩnh | **Bài giảng nhiều slide, cảnh 3D tương tác** (xoay, bấm vật, đổi giới từ, đố vui) |
| Mục đích | Tạo hình minh hoạ nói chung | **Dạy từ vựng và giới từ cho học sinh tiểu học** |
| Đánh giá | Không có số liệu | Thực nghiệm RQ1–RQ4 |

**Áp dụng cho Peekaboo:**

- Ý tưởng **thẻ không gian** của WordsEye là cơ sở cho các thuộc tính đặt vật ở CV1.4 (bàn có *mặt trên*, hộp có *lòng chứa*, ghế có *vùng gầm*).
- Hướng xử lý *under* khi vật quá to (thu nhỏ vật) và luật ràng buộc ngầm có thể dùng cho bộ sắp xếp cảnh (CV5.4).
- Thẻ chữ thay thế khi không có mô hình tương ứng với cách WordsEye hiển thị chữ 3D.
- Chính tác giả nêu **dạy ngôn ngữ** là một hướng ứng dụng (có ví dụ bài tập tiếng Anh lớp 1), nhưng không phát triển tiếp; Peekaboo đi theo đúng hướng này.

### 1.2 Học tri thức không gian từ dữ liệu (2014)

**Trích dẫn:** Angel X. Chang, Manolis Savva, Christopher D. Manning. *Learning Spatial Knowledge for Text to 3D Scene Generation.* EMNLP 2014, trang 2028–2038. Đại học Stanford.

**Làm gì:** Cũng sinh cảnh 3D từ văn bản như WordsEye, nhưng **tự suy ra những điều người viết không nói ra**. Ví dụ với câu *"There is a room with a chair and a computer"*, hệ thống tự thêm một cái **bàn làm việc** và đặt máy tính **lên bàn**, thay vì để máy tính dưới sàn. Tri thức này được **học từ dữ liệu cảnh 3D có sẵn**, không viết tay như WordsEye.

**Làm thế nào:** 4 bước.

1. **Phân tích câu thành "khung cảnh" (scene template):** dùng Stanford CoreNLP và một số mẫu cú pháp để lấy ra loại phòng, các vật, thuộc tính (màu…) và quan hệ không gian giữa các vật.
2. **Suy luận điều ngầm định** bằng các xác suất học từ một bộ dữ liệu cảnh 3D trong nhà:
   - Vật nào hay xuất hiện trong loại phòng nào (phòng bếp có dao, đĩa…).
   - **Vật nào thường đỡ vật nào** (sàn đỡ bàn, bàn đỡ đĩa, đĩa đỡ bánh).
   - Vật thường nằm trên **mặt nào** của vật đỡ (mặt trên, hay mặt đứng như tranh treo tường).
   - Vị trí tương đối thường gặp giữa hai vật (ghế thường ở trước bàn).
3. **Chọn mô hình 3D:** tìm trong kho mô hình 3D theo nhãn loại vật và từ khoá. Các mô hình đã được **chuẩn hoá tỉ lệ và cùng hướng "lên", hướng "trước"**.
4. **Sắp xếp cảnh:** chấm điểm mỗi cách bố trí theo mức hợp lý và mức thoả ràng buộc trong câu, cải thiện dần bằng thuật toán leo đồi, loại bố trí có vật chồng lấn.

**Hai phát hiện đáng chú ý về quan hệ không gian:**

- **Định nghĩa giới từ bằng hộp bao (bounding box):** *left_of*, *above*, *inside*, *supported_by*… được tính bằng mức chồng lấn và khoảng cách giữa hộp bao của hai vật. Nhóm tác giả còn cho người thật mô tả quan hệ giữa hai vật trong ảnh (*"The __ is __ the __"*) để học cách người ta thực sự dùng từ. Ví dụ *on* ứng với "được đỡ bởi" (điểm 0,86), *under* ứng với "đỡ" hoặc "ở dưới". Quan hệ học từ người dùng **chặt hơn** quan hệ định nghĩa sẵn: *above* chỉ dùng khi vật ở **ngay phía trên**, không dùng khi lệch sang bên.
- **Cùng một giới từ nhưng cách đặt khác nhau tuỳ vật:** *cup on the table* đặt cốc lên mặt bàn; *cup on the bookshelf* đặt lên một ngăn kệ; *poster on the wall* dán lên tường; *hat on the chair* đặt lên mặt ghế.
- **Trái, phải, trước, sau phụ thuộc góc nhìn:** đổi góc nhìn thì *"the chair to the right of the table"* chỉ sang một cái ghế khác.

**Hạn chế:**

- Xử lý văn bản theo chuỗi nhiều bước, **lỗi ở bước đầu lan sang bước sau** (phân tích cú pháp sai, không nhận ra "it" là "desk").
- Chỉ dùng vài mẫu cú pháp để lấy quan hệ, **kém chịu được cách diễn đạt khác**; chỉ xử lý quan hệ giữa **hai vật**.
- **Chọn sai mô hình khi phụ thuộc ngữ cảnh:** *"a lamp on the table"* lại chọn **đèn đứng trên sàn**; *"a bottle of wine"* lại chọn chai nước.
- Chỉ cho cảnh trong nhà; kết quả chủ yếu so sánh bằng hình ảnh.

**Liên hệ với Peekaboo:**

| | Chang và cộng sự (2014) | Peekaboo |
| --- | --- | --- |
| Hiểu văn bản | CoreNLP và mẫu cú pháp | LLM sinh JSON theo schema |
| Tri thức đặt vật | Học xác suất từ dữ liệu cảnh 3D | Quy tắc cho 7 giới từ dựa trên hộp bao và thuộc tính của vật |
| Chọn mô hình | Nhãn loại vật và từ khoá | Từ khoá kết hợp vector ngữ nghĩa |
| Phạm vi | Cảnh trong nhà, người dùng chung | Bài giảng tiếng Anh tiểu học, 5 chủ đề |
| Đầu ra | Một cảnh 3D | Bài giảng nhiều slide, cảnh tương tác |

**Áp dụng cho Peekaboo:**

- **Chuẩn hoá mô hình** (cùng tỉ lệ, cùng hướng lên và hướng trước) là bước bắt buộc trước khi sắp xếp cảnh. Điều này khớp với vấn đề phát hiện khi khảo sát nguồn mô hình 3D, làm căn cứ cho CV1.3.
- **Định nghĩa giới từ bằng hộp bao** là cách làm có cơ sở, dùng được cho bộ sắp xếp cảnh (CV5.2) và hàm kiểm tra quan hệ không gian (CV5.6).
- Thuộc tính **"vật đỡ"** và **mặt đỡ** khớp với thuộc tính đặt vật ở CV1.4.
- **Quyết định (17/11/2026): giới từ chỉ vị trí tính theo góc nhìn của người xem**, giống cách bài báo định nghĩa. Vì Peekaboo cho phép xoay cảnh, *behind* và *in front of* sẽ đổi nghĩa khi xoay (xoay 180° thì con mèo "ở sau cái bàn" thành "ở trước cái bàn"); cách xử lý khi người xem xoay cảnh sẽ chốt ở giai đoạn 5.
- **Lỗi chọn đèn bàn hay đèn đứng** cũng có thể xảy ra với Peekaboo, vì thư viện Kenney có cả `lampSquareTable` lẫn `lampSquareFloor`. Nên đưa ca này vào bộ dữ liệu RQ1.
- Đánh giá của bài báo chủ yếu bằng hình ảnh; Peekaboo đo bằng số liệu (RQ2 chấm tự động và có người kiểm tra).

## 2. Dùng LLM sinh bố cục cảnh

### 2.1 LayoutGPT (2023)

**Trích dẫn:** Weixi Feng, Wanrong Zhu, Tsu-jui Fu, Varun Jampani, Arjun Akula, Xuehai He, Sugato Basu, Xin Eric Wang, William Yang Wang. *LayoutGPT: Compositional Visual Planning and Generation with Large Language Models.* NeurIPS 2023. DOI: [10.52202/075280-0802](https://doi.org/10.52202/075280-0802)

**Làm gì:** Dùng **LLM làm "người lên bố cục"**: từ một câu mô tả, LLM sinh ra **vị trí và kích thước (hộp bao) của từng vật**. Bố cục này sau đó được dùng để:

- sinh **ảnh 2D** đúng số lượng và đúng vị trí (ví dụ *"three clocks under a concrete arch"*, *"a cat sitting on a basket under a bench"*);
- sắp xếp **đồ nội thất trong phòng 3D** theo loại phòng và kích thước phòng.

Không cần huấn luyện lại mô hình, chỉ cần viết prompt tốt.

**Làm thế nào:** prompt gồm 3 phần.

1. **Hướng dẫn nhiệm vụ:** mô tả nhiệm vụ, định dạng đầu ra, đơn vị đo, danh sách loại vật được dùng.
2. **Viết bố cục theo cú pháp CSS** (như định dạng trang web): mỗi vật là một khối có `width`, `height`, `top`, `left`; với 3D thêm `length`, `depth`, `orientation`. Lý do: LLM được học rất nhiều mã nguồn nên hiểu ý nghĩa từng con số tốt hơn khi viết theo dạng có tên thuộc tính.
3. **Chuẩn hoá đơn vị:** mọi giá trị quy về cùng một thang (tối đa 256px).

Ngoài ra, các **ví dụ mẫu (few-shot)** được chọn tự động: lấy những ví dụ **giống đề bài nhất** trong bộ dữ liệu, đặt ví dụ giống nhất ở cuối prompt. Với 3D, vật được lấy từ kho mô hình theo loại vật và kích thước rồi đặt vào phòng.

**Kết quả nổi bật:**

- Bố cục 2D: độ chính xác về **quan hệ không gian** của LayoutGPT dùng GPT-4 đạt **91,73%**, ngang với bố cục do **người vẽ (91,17%)**; ảnh sinh ra đúng hơn các mô hình sinh ảnh trực tiếp 20–40%.
- Phòng 3D: tỉ lệ cảnh có **đồ đặt ra ngoài phạm vi phòng** thấp hơn phương pháp có huấn luyện ATISS (phòng ngủ 43,26% so với 49,88%).
- **Thí nghiệm bỏ bớt thành phần (ablation):** với 3D, **chuẩn hoá đơn vị là yếu tố quan trọng nhất**; cú pháp CSS cũng giúp rõ rệt.

**Hạn chế:**

- **Vẫn đặt sai nhiều với 3D:** 43–64% cảnh có đồ vượt ra ngoài phòng; LLM đôi khi **chép nguyên con số** từ ví dụ mẫu dù kích thước phòng khác.
- Ít dùng các vật hiếm gặp trong ví dụ mẫu (ví dụ bàn trà trong phòng ngủ).
- Dùng **GPT-3.5 / GPT-4**: mô hình trả phí, chạy trên máy chủ của OpenAI.
- Bài không có mục hạn chế riêng; các hạn chế trên rút ra từ số liệu trong bài.

**Liên hệ với Peekaboo:**

| | LayoutGPT | Peekaboo |
| --- | --- | --- |
| Vai trò của LLM | Sinh **toạ độ, kích thước** từng vật | Chỉ sinh **dàn ý và quan hệ** (*cat – under – table*), không sinh toạ độ |
| Ai tính vị trí | LLM | **Bộ sắp xếp cảnh theo quy tắc** (hộp bao, thuộc tính đặt vật) |
| Định dạng đầu ra | Cú pháp CSS | JSON theo JSON Schema |
| Mô hình ngôn ngữ | GPT-3.5 / GPT-4 (trả phí) | Mô hình mã nguồn mở 7–8 tỉ tham số chạy trên máy cá nhân |
| Đầu ra | Ảnh 2D hoặc phòng 3D | Bài giảng nhiều slide, cảnh 3D tương tác |

**Áp dụng cho Peekaboo:**

- **Củng cố quyết định dùng đầu ra có cấu trúc rõ ràng:** bài báo cho thấy định dạng có tên thuộc tính (CSS) giúp LLM làm tốt hơn, phù hợp với kết quả thử nghiệm tuần 1 (thêm JSON Schema thì từ không ổn định lên 6/6 lần đúng cấu trúc).
- **Lý do không để LLM tự tính toạ độ:** ngay cả GPT-4 vẫn đặt đồ vượt ra ngoài phòng ở khoảng một nửa số cảnh 3D. Mô hình nhỏ chạy trên máy cá nhân chắc chắn còn kém hơn. Vì vậy Peekaboo chỉ để LLM chọn **quan hệ**, còn **vị trí do quy tắc tính**, đảm bảo luôn đúng (đánh giá ở RQ2).
- **Chọn ví dụ mẫu theo độ giống đề bài** có thể áp dụng cho prompt sinh dàn ý (CV3.1): ví dụ đề bài về đồ ăn thì chọn ví dụ mẫu về đồ ăn.
- **Cách đánh giá quan hệ không gian bằng tâm hộp bao** và bộ đề có mẫu cố định (kiểu *"A dog to the right of a bench"*) là cách tham khảo tốt cho bộ dữ liệu và cách chấm RQ2.

### 2.2 Holodeck (2024)

**Trích dẫn:** Yue Yang, Fan-Yun Sun, Luca Weihs, Eli VanderBilt, Alvaro Herrasti, Winson Han, Jiajun Wu, Nick Haber, Ranjay Krishna, Lingjie Liu, Chris Callison-Burch, Mark Yatskar, Aniruddha Kembhavi, Christopher Clark. *Holodeck: Language Guided Generation of 3D Embodied AI Environments.* CVPR 2024, trang 16227–16237. Bản đầy đủ có phụ lục: [arXiv:2312.09067](https://arxiv.org/abs/2312.09067)

**Làm gì:** Từ một câu mô tả (ví dụ *"apartment for a researcher with a cat"*, *"office of a professor who is a fan of Star Wars"*), **tự động sinh cả môi trường 3D** gồm sàn, tường, cửa, cửa sổ và đồ vật, dùng để huấn luyện robot ảo di chuyển trong nhà.

**Làm thế nào:** GPT-4 trả lời qua nhiều lượt hỏi, mỗi lượt cho một mô-đun. Prompt của mỗi mô-đun gồm: mô tả nhiệm vụ, định dạng đầu ra, **một ví dụ mẫu**.

1. **Sàn và tường:** GPT-4 đề xuất mặt bằng các phòng, vật liệu sàn và tường.
2. **Cửa ra vào, cửa sổ.**
3. **Chọn vật:** GPT-4 đề xuất vật kèm mô tả và kích thước (ví dụ *"multi-level cat tower, 60 × 60 × 180 cm"*); hệ thống **tìm mô hình phù hợp nhất trong kho khoảng 51.000 mô hình** (lấy từ Objaverse), xét **độ giống về hình ảnh, về chữ và về kích thước**. Các mô hình đã được GPT-4-Vision tự động gắn mô tả, tỉ lệ, hướng nhìn chuẩn.
4. **Sắp xếp theo ràng buộc:** GPT-4 **không sinh toạ độ**, mà sinh **quan hệ không gian** giữa các vật, ví dụ *"coffee table, in front of, sofa"*, chọn từ **10 loại ràng buộc định sẵn** (sát tường, giữa phòng, gần, xa, phía trước, cạnh, phía trên, trên mặt, thẳng hàng, quay mặt về). Thuật toán tìm kiếm theo chiều sâu đặt vật chính trước rồi đặt các vật còn lại, **bắt buộc không chồng lấn và không ra ngoài phòng**, chọn cách bố trí thoả nhiều ràng buộc nhất trong 30 giây.

**Kết quả nổi bật:**

- Đánh giá với **680 người** (học viên cao học). So với phương pháp sinh cảnh theo luật ProcTHOR, người đánh giá **thích Holodeck hơn** ở cách chọn vật (59,8%), cách bố trí (56,9%) và tổng thể (64,4%).
- **So sánh cách bố trí:** để LLM **tự sinh toạ độ** (kiểu LayoutGPT) cho kết quả **không tốt hơn đặt ngẫu nhiên** (điểm 0,364 so với 0,369), vì hay chồng lấn và ra ngoài phòng; cách **dùng ràng buộc** đạt **0,706**, tốt nhất.
- Robot ảo huấn luyện trên cảnh do Holodeck sinh tìm vật tốt hơn trong các loại phòng mới.

**Hạn chế:**

- Khó với cảnh cần bố trí phức tạp (nhà hàng) hoặc cần vật hiếm không có trong kho (máy X-quang nha khoa).
- Dùng **GPT-4 trả phí**: khoảng 0,2 USD và 3 phút cho mỗi phòng.
- Đánh giá chủ yếu bằng cảm nhận của người xem và điểm tương đồng ảnh – chữ; cảnh chỉ để nhìn và cho robot ảo, không dành cho người học.

**Liên hệ với Peekaboo:**

| | Holodeck | Peekaboo |
| --- | --- | --- |
| Vai trò của LLM | Chọn vật và **sinh quan hệ không gian**, không sinh toạ độ | Giống Holodeck: sinh dàn ý và quan hệ, không sinh toạ độ |
| Tính vị trí | Tìm kiếm thoả 10 loại ràng buộc mềm, ràng buộc cứng không chồng lấn | Quy tắc cho 7 giới từ dựa trên hộp bao, không chồng lấn |
| Tìm mô hình | Độ giống hình ảnh, chữ, kích thước trong kho khoảng 51.000 mô hình | Từ khoá kết hợp vector ngữ nghĩa trong thư viện khoảng 100 mô hình |
| Chuẩn bị mô hình | GPT-4-Vision tự gắn mô tả, tỉ lệ, hướng chuẩn | Chuẩn hoá bằng script, gắn tên và thẻ (CV1.3–CV1.5) |
| Mô hình ngôn ngữ | GPT-4 trả phí | Mô hình mã nguồn mở chạy trên máy cá nhân |
| Mục đích | Môi trường huấn luyện robot ảo | Bài giảng tiếng Anh cho học sinh tiểu học, có tương tác |

**Áp dụng cho Peekaboo:**

- **Bằng chứng mạnh nhất cho thiết kế "LLM chọn quan hệ, quy tắc tính vị trí":** chính thí nghiệm của Holodeck cho thấy để LLM tự sinh toạ độ **không hơn đặt ngẫu nhiên**, còn dùng ràng buộc tốt hơn hẳn.
- **Mẫu prompt 3 phần** (mô tả nhiệm vụ, định dạng, một ví dụ) khớp với cách viết prompt đã thử ở tuần 1 và dùng được cho CV3.1.
- **Ràng buộc cứng** (không chồng lấn, không ra ngoài phạm vi) tương ứng BR10 và CV5.5.
- **Đưa kích thước vào khi tìm mô hình** là ý tưởng hay cho RQ1, giúp phân biệt đèn bàn và đèn đứng (ca lỗi đã gặp ở mục 1.2).
- Peekaboo là bài toán **hẹp và kiểm soát được hơn** (7 giới từ, thư viện nhỏ đã chuẩn hoá), nên có thể dùng quy tắc xác định thay cho tìm kiếm tối ưu, chạy nhanh và kết quả lặp lại được.

## 3. Công cụ soạn bài giảng và học tiếng Anh

### 3.1 Công cụ tạo slide bằng AI

| Công cụ | Làm gì | Hạn chế đối với bài toán của Peekaboo |
| --- | --- | --- |
| **Gamma** ([gamma.app](https://gamma.app)) | Từ một câu lệnh, dàn ý hoặc tài liệu tải lên, sinh **bài trình chiếu hoàn chỉnh** trong khoảng một phút; có sinh ảnh minh hoạ bằng AI, nhiều giao diện, xuất PowerPoint/PDF | Minh hoạ là **ảnh 2D**, có thể sai chi tiết vị trí; không có cảnh 3D tương tác; nhiều chức năng cần trả phí; không dành riêng cho dạy học |
| **Copilot trong PowerPoint** ([hướng dẫn của Microsoft](https://support.microsoft.com/en-us/office/create-a-new-presentation-with-copilot-in-powerpoint-3222ee03-f5a4-4d27-8642-9c387ab4854d)) | Tạo bản nháp bài trình chiếu từ câu lệnh hoặc từ tệp, sau đó chỉnh sửa từng slide | Cần giấy phép Microsoft 365 Copilot; minh hoạ 2D; bản nháp chung chung, không theo trình độ học sinh |

**Nhận xét:** các công cụ này giải quyết tốt phần **"sinh dàn ý và trình bày"**, nhưng **không có minh hoạ 3D**, không bảo đảm hình minh hoạ đúng quan hệ không gian, và phần lớn là dịch vụ trả phí chạy trên máy chủ nước ngoài.

### 3.2 Công cụ dựng cảnh 3D cho giáo dục

**CoSpaces Edu** ([cospaces.io/edu](https://cospaces.io/edu/)): nền tảng trên trình duyệt để **học sinh và giáo viên tự dựng thế giới 3D**, kéo thả mô hình từ thư viện, lập trình tương tác bằng khối lệnh, xem bằng VR/AR trên điện thoại. Có bản miễn phí với chức năng cơ bản và bản Pro trả phí theo số tài khoản.

- **Điểm giống Peekaboo:** cảnh 3D tương tác trên trình duyệt, có thư viện mô hình, dùng trong lớp học.
- **Điểm khác:** mọi thứ **dựng bằng tay**; giáo viên phải tự chọn và kéo đặt từng vật, mất nhiều thời gian. Peekaboo **tự sinh** cảnh từ mô tả bằng lời.

### 3.3 Nghiên cứu dùng 3D, AR, VR dạy từ vựng và giới từ tiếng Anh

| Công trình | Nội dung | Kết quả chính |
| --- | --- | --- |
| Jung-Yu Lai, Li-Ting Chang. *Impacts of Augmented Reality Apps on First Graders' Motivation and Performance in English Vocabulary Learning.* SAGE Open, 2021. DOI: [10.1177/21582440211047549](https://doi.org/10.1177/21582440211047549) | Dùng ứng dụng AR dạy từ vựng tiếng Anh cho học sinh **lớp 1** | Theo tóm tắt: AR cải thiện rõ rệt **động lực học** và **kết quả học từ vựng** của học sinh |
| Che Samihah Che Dalim và cộng sự. *Using augmented reality with speech input for non-native children's language learning.* International Journal of Human-Computer Studies, tập 134, 2020. DOI: [10.1016/j.ijhcs.2019.10.002](https://doi.org/10.1016/j.ijhcs.2019.10.002) | Công cụ AR **TeachAR** dạy trẻ **4–6 tuổi** không phải người bản ngữ các từ về màu, hình và **quan hệ không gian**, có nhận dạng giọng nói; 120 trẻ tham gia | Trẻ học **từ trừu tượng (như quan hệ không gian) tốt hơn**, hứng thú cao, làm bài nhanh và dễ hơn cách truyền thống |
| Jorge Bacca-Acosta, Julian Tejada, Georgios Lampropoulos, Cecilia Avila. *A Comparative Eye-Tracking Study Between a Virtual Reality System and a Desktop Environment for Learning the Prepositions of Place in English.* CALICO Journal, 40(1), 2023. DOI: [10.1558/cj.22803](https://doi.org/10.1558/cj.22803) | So sánh học **giới từ chỉ vị trí** bằng VR và bằng ứng dụng 2D trên máy tính; 80 sinh viên đại học | Nhóm **VR học tốt hơn rõ rệt** nhóm 2D, nhưng mất nhiều thời gian hơn và mắc nhiều lỗi hơn khi thao tác. Giới từ dễ nhất là ***on***; khó nhất là ***below*** (2D) và ***behind*** (VR) |

**Nhận xét:**

- Các nghiên cứu cho thấy **minh hoạ 3D, AR, VR giúp học từ vựng và giới từ tốt hơn** và tăng hứng thú, nhất là với trẻ nhỏ. Đây là **căn cứ giáo dục** cho việc Peekaboo dùng cảnh 3D.
- Các công cụ trong các nghiên cứu này đều có **nội dung soạn sẵn cố định**; giáo viên **không tự tạo được bài mới**. Peekaboo giải quyết đúng điểm này.
- Kết quả *behind* là giới từ khó nhất trong VR khớp với vấn đề góc nhìn đã ghi ở mục 1.2: *behind* và *in front of* cần được xử lý cẩn thận khi người xem xoay cảnh.
- Phần lớn các nghiên cứu có mẫu nhỏ, ở một vài trường, nên kết luận chỉ mang tính tham khảo.

## 4. Tổng kết: vị trí của đề tài

### 4.1 So sánh tổng hợp

| | Sinh cảnh từ văn bản | Chọn mô hình từ kho có sẵn | Đặt vị trí đúng quan hệ không gian | LLM | Cảnh 3D tương tác | Dành cho dạy học | Giáo viên tự tạo bài mới | Miễn phí, chạy trên máy cá nhân |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| WordsEye (2001) | ✅ | ✅ | ✅ luật viết tay | ❌ | ❌ | ❌ | – | ❌ |
| Chang và cộng sự (2014) | ✅ | ✅ | ✅ học từ dữ liệu | ❌ | ❌ | ❌ | – | ❌ |
| LayoutGPT (2023) | ✅ | ✅ (3D) | ⚠️ LLM tự sinh toạ độ, hay sai | ✅ trả phí | ❌ | ❌ | – | ❌ |
| Holodeck (2024) | ✅ | ✅ | ✅ ràng buộc + tìm kiếm | ✅ trả phí | ⚠️ cho robot ảo | ❌ | – | ❌ |
| Gamma, Copilot | ✅ (slide) | ❌ | ❌ ảnh 2D | ✅ trả phí | ❌ | ⚠️ dùng chung | ✅ | ❌ |
| CoSpaces Edu | ❌ dựng tay | ✅ | ❌ đặt tay | ❌ | ✅ | ✅ | ✅ (tốn công) | ⚠️ |
| Ứng dụng AR/VR trong nghiên cứu | ❌ | – | – | ❌ | ✅ | ✅ | ❌ nội dung cố định | ⚠️ |
| **Peekaboo** | ✅ | ✅ | ✅ quy tắc theo giới từ | ✅ mã nguồn mở | ✅ | ✅ | ✅ | ✅ |

### 4.2 Khoảng trống đề tài giải quyết

- **Các hệ thống sinh cảnh 3D từ văn bản** (WordsEye, Chang 2014, LayoutGPT, Holodeck) nhắm tới người dùng chung hoặc huấn luyện robot, **chưa có hệ thống nào dành cho dạy học**; dù chính WordsEye đã nêu dạy ngôn ngữ là một hướng ứng dụng.
- **Các công cụ soạn slide bằng AI** (Gamma, Copilot) tạo bài trình chiếu nhanh nhưng chỉ có **ảnh 2D**, không bảo đảm đúng quan hệ không gian.
- **Các công cụ và nghiên cứu 3D/AR/VR trong giáo dục** cho thấy hiệu quả với từ vựng và giới từ, nhưng nội dung **dựng tay hoặc soạn sẵn**, giáo viên khó tự tạo bài mới.

**Peekaboo kết hợp các hướng trên:** giáo viên mô tả bài học bằng lời; LLM mã nguồn mở chạy trên máy cá nhân sinh dàn ý và **quan hệ không gian** (theo hướng Holodeck, tránh lỗi tự sinh toạ độ như LayoutGPT); hệ thống tìm mô hình trong thư viện đã chuẩn hoá và **đặt vị trí theo quy tắc** cho 7 giới từ (dựa trên ý tưởng hộp bao và thẻ không gian của WordsEye, Chang 2014); kết quả là bài giảng **3D tương tác** cho học sinh tiểu học, được **đánh giá bằng thực nghiệm** (RQ1–RQ4).

### 4.3 Bài học thiết kế rút ra

| Bài học | Nguồn | Áp dụng |
| --- | --- | --- |
| Không để LLM tự sinh toạ độ; để LLM chọn quan hệ, thuật toán tính vị trí | LayoutGPT, Holodeck | Luồng sinh bài giảng (mục 5), giai đoạn 5 |
| Mô hình cần thông tin bổ sung: kích thước chuẩn, vùng đặt vật (mặt trên, lòng chứa, gầm) | WordsEye, Chang 2014 | CV1.3, CV1.4 |
| Định nghĩa giới từ bằng hộp bao; quan hệ trước, sau phụ thuộc góc nhìn | Chang 2014, Bacca-Acosta 2023 | CV5.2, CV5.6; quyết định tính theo góc nhìn người xem |
| Đầu ra LLM có cấu trúc rõ ràng; prompt gồm mô tả nhiệm vụ, định dạng, ví dụ mẫu | LayoutGPT, Holodeck | CV3.1, CV3.2 |
| Tìm mô hình nên xét cả kích thước, không chỉ tên | Holodeck, lỗi đèn bàn – đèn đứng ở Chang 2014 | CV4, bộ dữ liệu RQ1 |
| Minh hoạ 3D giúp học giới từ, từ vựng tốt hơn, tăng hứng thú | Lai & Chang 2021, Che Dalim 2020, Bacca-Acosta 2023 | Cơ sở giáo dục cho đề tài, thiết kế RQ4 |
