-- Kiểm tra nhanh các ràng buộc sau khi tạo bảng (CV2.3). Mọi thay đổi bị huỷ ở cuối (ROLLBACK).
-- Chạy: psql -U postgres -d peekaboo -f database/check.sql
-- Kết quả mong đợi: mọi dòng ở cột "ket_qua" là DUNG.
\set ON_ERROR_STOP on
BEGIN;

INSERT INTO users (email, display_name, password_hash) VALUES ('co.lan@example.com', 'Cô Lan', 'x');
INSERT INTO models (id, name_en, name_vi, topic, tags_en, bbox, source_url, author, license)
VALUES ('cat', 'cat', 'con mèo', 'animals', '{kitty}', '{0.22,0.3,0.32}', 'https://kenney.nl/assets', 'Kenney', 'CC0');
INSERT INTO lessons (teacher_id, title, request_text, grade)
VALUES ((SELECT id FROM users WHERE email = 'co.lan@example.com'), 'Prepositions', 'Bài học về in, on, under', 3);

CREATE TEMP TABLE results (truong_hop text, ket_qua text);

-- Chạy một câu lệnh phải bị từ chối; ghi DUNG nếu bị từ chối, SAI nếu lọt qua
CREATE FUNCTION pg_temp.must_fail(label text, stmt text) RETURNS void AS $$
BEGIN
  BEGIN
    EXECUTE stmt;
    INSERT INTO results VALUES (label, 'SAI: không bị chặn');
  EXCEPTION WHEN others THEN
    INSERT INTO results VALUES (label, 'DUNG');
  END;
END;
$$ LANGUAGE plpgsql;

DO $do$
BEGIN
PERFORM pg_temp.must_fail('email trùng (khác hoa thường)',
  $q$INSERT INTO users (email, display_name, password_hash) VALUES ('CO.LAN@example.com', 'X', 'x')$q$);
PERFORM pg_temp.must_fail('vai trò không hợp lệ',
  $q$INSERT INTO users (email, display_name, password_hash, role) VALUES ('a@b.c', 'X', 'x', 'STUDENT')$q$);
PERFORM pg_temp.must_fail('mô hình thiếu thẻ (BR06)',
  $q$INSERT INTO models (id, name_en, name_vi, topic, bbox, source_url, author, license) VALUES ('dog', 'dog', 'con chó', 'animals', '{1,1,1}', 'u', 'a', 'CC0')$q$);
PERFORM pg_temp.must_fail('chủ đề không hợp lệ',
  $q$INSERT INTO models (id, name_en, name_vi, topic, tags_en, bbox, source_url, author, license) VALUES ('car2', 'car', 'xe', 'cars', '{x}', '{1,1,1}', 'u', 'a', 'CC0')$q$);
PERFORM pg_temp.must_fail('hộp bao không đủ 3 chiều',
  $q$INSERT INTO models (id, name_en, name_vi, topic, tags_en, bbox, source_url, author, license) VALUES ('dog', 'dog', 'con chó', 'animals', '{x}', '{1,1}', 'u', 'a', 'CC0')$q$);
PERFORM pg_temp.must_fail('id mô hình sai quy ước',
  $q$INSERT INTO models (id, name_en, name_vi, topic, tags_en, bbox, source_url, author, license) VALUES ('Teddy Bear', 'x', 'x', 'toys', '{x}', '{1,1,1}', 'u', 'a', 'CC0')$q$);
PERFORM pg_temp.must_fail('bật chia sẻ mà không có mã (BR05)',
  $q$UPDATE lessons SET share_enabled = true$q$);
PERFORM pg_temp.must_fail('khối lớp 6',
  $q$UPDATE lessons SET grade = 6$q$);
PERFORM pg_temp.must_fail('slide thứ 11 (BR01)',
  $q$INSERT INTO slides (lesson_id, position, title, sentence, scene) SELECT id, 11, 't', 's', '{}' FROM lessons$q$);
PERFORM pg_temp.must_fail('lần sinh thử quá 3 lần (BR03)',
  $q$INSERT INTO generations (request_text, llm_model, attempts, duration_ms, status) VALUES ('r', 'm', 4, 1, 'FAILED')$q$);
PERFORM pg_temp.must_fail('sinh thành công nhưng không có dàn ý',
  $q$INSERT INTO generations (request_text, llm_model, attempts, duration_ms, status) VALUES ('r', 'm', 1, 1, 'SUCCESS')$q$);
END
$do$;

-- Hai slide trùng thứ tự bị chặn (ràng buộc DEFERRABLE, kiểm tra ngay bằng SET CONSTRAINTS)
DO $$
BEGIN
  INSERT INTO slides (lesson_id, position, title, sentence, scene) SELECT id, 1, 'a', 's', '{}' FROM lessons;
  INSERT INTO slides (lesson_id, position, title, sentence, scene) SELECT id, 1, 'b', 's', '{}' FROM lessons;
  SET CONSTRAINTS slides_lesson_position_key IMMEDIATE;
  INSERT INTO results VALUES ('hai slide trùng thứ tự', 'SAI: không bị chặn');
EXCEPTION WHEN unique_violation THEN
  INSERT INTO results VALUES ('hai slide trùng thứ tự', 'DUNG');
END $$;
SET CONSTRAINTS slides_lesson_position_key DEFERRED;

-- Đổi chỗ slide 1 và 2 trong một giao dịch phải được phép (F25)
INSERT INTO slides (lesson_id, position, title, sentence, scene) SELECT id, 1, 'a', 's', '{}' FROM lessons;
INSERT INTO slides (lesson_id, position, title, sentence, scene) SELECT id, 2, 'b', 's', '{}' FROM lessons;
UPDATE slides SET position = 3 - position;
SET CONSTRAINTS slides_lesson_position_key IMMEDIATE;
INSERT INTO results SELECT 'đổi chỗ hai slide', CASE WHEN string_agg(title, '' ORDER BY position) = 'ba' THEN 'DUNG' ELSE 'SAI' END FROM slides;

-- updated_at tự đổi khi sửa bài giảng
UPDATE lessons SET updated_at = now() - interval '1 day';
UPDATE lessons SET title = 'Prepositions 2';
INSERT INTO results SELECT 'updated_at tự cập nhật', CASE WHEN updated_at > now() - interval '1 minute' THEN 'DUNG' ELSE 'SAI' END FROM lessons;

-- Xoá giáo viên thì xoá luôn bài giảng và slide; nhật ký sinh giữ lại với lesson_id = NULL
INSERT INTO generations (lesson_id, request_text, llm_model, outline, attempts, duration_ms, status)
SELECT id, 'r', 'qwen2.5:7b', '{}', 1, 20000, 'SUCCESS' FROM lessons;
DELETE FROM users;
INSERT INTO results SELECT 'xoá giáo viên: xoá bài giảng, slide',
  CASE WHEN (SELECT count(*) FROM lessons) = 0 AND (SELECT count(*) FROM slides) = 0 THEN 'DUNG' ELSE 'SAI' END;
INSERT INTO results SELECT 'xoá giáo viên: giữ nhật ký sinh',
  CASE WHEN (SELECT count(*) FROM generations WHERE lesson_id IS NULL) = 1 THEN 'DUNG' ELSE 'SAI' END;

SELECT * FROM results;
ROLLBACK;