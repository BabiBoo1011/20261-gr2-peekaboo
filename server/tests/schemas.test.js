// Kiểm thử JSON Schema của dàn ý và cảnh 3D (CV2.2). Chạy: npm test (trong thư mục server)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import { PREPOSITIONS, MAX_SLIDES, MAX_OBJECTS_PER_SLIDE } from '../../shared/constants.js';

const SCHEMAS = path.resolve(import.meta.dirname, '../../shared/schemas');
const readSchema = (name) => JSON.parse(fs.readFileSync(path.join(SCHEMAS, name), 'utf8'));

const ajv = new Ajv({ allErrors: true });
const outlineSchema = readSchema('outline.schema.json');
const sceneSchema = readSchema('scene.schema.json');
const validateOutline = ajv.compile(outlineSchema);
const validateScene = ajv.compile(sceneSchema);

// Dàn ý đúng: 2 slide, có một slide dùng "between"
const validOutline = () => ({
  title: 'Prepositions in the classroom',
  slides: [
    {
      title: 'Under',
      sentence: 'The cat is under the table.',
      vocabulary: ['cat', 'table', 'under'],
      scene: {
        objects: ['cat', 'table'],
        relations: [{ subject: 'cat', relation: 'under', object: 'table' }],
      },
    },
    {
      title: 'Between',
      sentence: 'The ball is between the chair and the box.',
      vocabulary: ['ball', 'chair', 'box', 'between'],
      scene: {
        objects: ['ball', 'chair', 'box'],
        relations: [{ subject: 'ball', relation: 'between', object: 'chair', object2: 'box' }],
      },
    },
  ],
});

// Cảnh đúng: con mèo dưới gầm bàn (kích thước lấy từ catalog.json)
const validScene = () => ({
  units: 'm',
  up: '+Y',
  front: '+Z',
  objects: [
    { key: 'table', modelId: 'table', position: [0, 0, 0], rotationY: 0, scale: 1 },
    { key: 'cat', modelId: 'cat', position: [0, 0, 0], rotationY: 0, scale: 1 },
  ],
  relations: [{ subject: 'cat', relation: 'under', object: 'table' }],
  camera: { position: [1.6, 1.4, 2.6], target: [0, 0.375, 0] },
  warnings: [],
});

test('dàn ý đúng thì hợp lệ', () => {
  assert.ok(validateOutline(validOutline()), ajv.errorsText(validateOutline.errors));
});

test('dàn ý sai thì bị từ chối', async (t) => {
  const cases = {
    'giới từ không hỗ trợ (above)': (o) => { o.slides[0].scene.relations[0].relation = 'above'; },
    [`quá ${MAX_SLIDES} slide`]: (o) => { o.slides = Array(MAX_SLIDES + 1).fill(o.slides[0]); },
    [`quá ${MAX_OBJECTS_PER_SLIDE} vật trong một slide`]: (o) => { o.slides[0].scene.objects = ['cat', 'table', 'ball', 'box', 'chair']; },
    'thiếu câu mẫu': (o) => { delete o.slides[0].sentence; },
    'vật bị trùng tên': (o) => { o.slides[0].scene.objects = ['cat', 'cat']; },
    'có trường lạ (LLM tự thêm nghĩa tiếng Việt)': (o) => { o.slides[0].meaning_vi = 'Con mèo ở dưới cái bàn.'; },
  };
  for (const [name, breakIt] of Object.entries(cases)) {
    await t.test(name, () => {
      const outline = validOutline();
      breakIt(outline);
      assert.equal(validateOutline(outline), false);
    });
  }
});

test('danh sách giới từ trong schema khớp với shared/constants.js', () => {
  const inOutline = outlineSchema.properties.slides.items.properties.scene.properties.relations.items.properties.relation.enum;
  const inScene = sceneSchema.properties.relations.items.properties.relation.enum;
  assert.deepEqual(inOutline, PREPOSITIONS);
  assert.deepEqual(inScene, PREPOSITIONS);
});

test('giới hạn số slide và số vật khớp với shared/constants.js', () => {
  const slides = outlineSchema.properties.slides;
  assert.equal(slides.maxItems, MAX_SLIDES);
  assert.equal(slides.items.properties.scene.properties.objects.maxItems, MAX_OBJECTS_PER_SLIDE);
  assert.equal(sceneSchema.properties.objects.maxItems, MAX_OBJECTS_PER_SLIDE);
});

test('cảnh đúng thì hợp lệ', () => {
  assert.ok(validateScene(validScene()), ajv.errorsText(validateScene.errors));
});

test('cảnh: vật không tìm được mô hình (modelId = null) vẫn hợp lệ', () => {
  const scene = validScene();
  scene.objects[1].modelId = null;
  assert.ok(validateScene(scene), ajv.errorsText(validateScene.errors));
});

test('cảnh sai thì bị từ chối', async (t) => {
  const cases = {
    'between thiếu object2': (s) => { s.relations[0] = { subject: 'cat', relation: 'between', object: 'table' }; },
    'object2 dùng với giới từ khác between': (s) => { s.relations[0].object2 = 'chair'; },
    'toạ độ thiếu một trục': (s) => { s.objects[0].position = [0, 0]; },
    'tỉ lệ bằng 0': (s) => { s.objects[0].scale = 0; },
    'sai quy ước trục': (s) => { s.up = '+Z'; },
  };
  for (const [name, breakIt] of Object.entries(cases)) {
    await t.test(name, () => {
      const scene = validScene();
      breakIt(scene);
      assert.equal(validateScene(scene), false);
    });
  }
});