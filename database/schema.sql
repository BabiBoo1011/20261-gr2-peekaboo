-- CSDL Peekaboo (CV2.3). Thiết kế chi tiết: docs/02-thiet-ke-csdl.md
-- Chạy: psql -U postgres -d peekaboo -f database/schema.sql
-- CẢNH BÁO: tệp này XOÁ và tạo lại toàn bộ bảng; chỉ dùng khi đang phát triển.

BEGIN;

DROP TABLE IF EXISTS generations, slides, lessons, model_embeddings, models, users CASCADE;
DROP FUNCTION IF EXISTS set_updated_at();

-- Tự cập nhật cột updated_at mỗi khi sửa một dòng
CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Người dùng: giáo viên và quản trị viên (F01–F03, F43)
CREATE TABLE users (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         text        NOT NULL,
  display_name  text        NOT NULL CHECK (length(display_name) BETWEEN 1 AND 100),
  password_hash text        NOT NULL,                       -- bcrypt (NFR03)
  role          text        NOT NULL DEFAULT 'TEACHER' CHECK (role IN ('TEACHER', 'SYSTEM_ADMIN')),
  is_locked     boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);
-- Email không phân biệt hoa thường: A@x.com và a@x.com là một
CREATE UNIQUE INDEX users_email_key ON users (lower(email));

-- Thư viện mô hình 3D (F40–F42); id trùng với id trong assets/models/catalog.json
CREATE TABLE models (
  id          text        PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_en     text        NOT NULL,
  name_vi     text        NOT NULL,
  topic       text        NOT NULL CHECK (topic IN ('classroom', 'house', 'animals', 'food', 'toys')),
  tags_en     text[]      NOT NULL DEFAULT '{}',
  tags_vi     text[]      NOT NULL DEFAULT '{}',
  bbox        real[]      NOT NULL CHECK (array_length(bbox, 1) = 3),  -- [rộng, cao, sâu] (m)
  placement   jsonb       NOT NULL DEFAULT '{}',          -- surface / under / container (CV1.4)
  source_url  text        NOT NULL,
  author      text        NOT NULL,
  license     text        NOT NULL,
  attribution text,                                       -- dòng ghi công khi giấy phép là CC-BY (NFR04)
  is_hidden   boolean     NOT NULL DEFAULT false,         -- BR08: ẩn chứ không xoá
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (cardinality(tags_en) >= 1)                       -- BR06: ít nhất 1 thẻ
);

-- Vector ngữ nghĩa của mô hình (CV4.2); mỗi mô hình có nhiều loại vector để so sánh ở RQ1
CREATE TABLE model_embeddings (
  model_id        text        NOT NULL REFERENCES models (id) ON DELETE CASCADE,
  kind            text        NOT NULL CHECK (kind IN ('name', 'full')),  -- tên đơn lẻ / mô tả đầy đủ
  embedding_model text        NOT NULL,                                   -- ví dụ bge-m3
  vector          real[]      NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (model_id, kind, embedding_model)
);

-- Bài giảng (F10, F20, F31)
CREATE TABLE lessons (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  teacher_id    bigint      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title         text        NOT NULL CHECK (length(title) BETWEEN 1 AND 80),
  request_text  text        NOT NULL,                     -- mô tả giáo viên nhập ban đầu
  grade         smallint    CHECK (grade BETWEEN 1 AND 5),
  share_enabled boolean     NOT NULL DEFAULT false,
  share_code    text        UNIQUE,                       -- mã trong đường liên kết chia sẻ (BR05)
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CHECK (NOT share_enabled OR share_code IS NOT NULL)     -- bật chia sẻ thì phải có mã
);
CREATE INDEX lessons_teacher_idx ON lessons (teacher_id, updated_at DESC);
CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Slide (F21–F25); nội dung chữ ở các cột, cảnh 3D theo shared/schemas/scene.schema.json
CREATE TABLE slides (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lesson_id   bigint      NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
  position    smallint    NOT NULL CHECK (position BETWEEN 1 AND 10),   -- BR01
  title       text        NOT NULL,
  sentence    text        NOT NULL,
  vocabulary  jsonb       NOT NULL DEFAULT '[]',          -- [{ "en": "cat", "vi": "con mèo" }]
  scene       jsonb       NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  -- DEFERRABLE: cho phép đổi chỗ hai slide trong cùng một giao dịch (F25)
  CONSTRAINT slides_lesson_position_key UNIQUE (lesson_id, position) DEFERRABLE INITIALLY DEFERRED
);
CREATE TRIGGER slides_updated_at BEFORE UPDATE ON slides
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Nhật ký mỗi lần sinh dàn ý (CV3.4, dữ liệu cho RQ3)
CREATE TABLE generations (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lesson_id    bigint      REFERENCES lessons (id) ON DELETE SET NULL,  -- trống khi chạy thực nghiệm
  request_text text        NOT NULL,
  llm_model    text        NOT NULL,                      -- ví dụ qwen2.5:7b
  outline      jsonb,                                     -- dàn ý trả về lần cuối
  attempts     smallint    NOT NULL CHECK (attempts BETWEEN 1 AND 3),   -- BR03
  duration_ms  integer     NOT NULL CHECK (duration_ms >= 0),
  status       text        NOT NULL CHECK (status IN ('SUCCESS', 'FAILED')),
  error        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (status = 'FAILED' OR outline IS NOT NULL)        -- thành công thì phải có dàn ý
);
CREATE INDEX generations_lesson_idx ON generations (lesson_id);

COMMIT;