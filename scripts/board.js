import {
  circleCandidate,
  createStroke,
  deserializeScene,
  detectScribble,
  sceneTransform,
  serializeScene,
  straightCandidate,
  strokeTouchesGesture,
  toCircleStroke,
  toStraightStroke,
  transformPoint,
  VectorHistory
} from './board-model.js';
import {
  clampShapeCenter,
  createBoardShape,
  shapeGeometry,
  shapeSize,
  shapeTouchesGesture,
  SHAPE_LABELS
} from './board-shapes.js';
import { activeWorkspace } from './workspace/user-workspace.js';

const STORAGE_KEY = 'quiz-tsi-vector-board-v1';
const PREFS_KEY = 'quiz-tsi-board-gestures-v1';
const SHAPE_SIZE_KEY = 'quiz-tsi-board-shape-size-v1';

function workspaceStorage(area, fallback = localStorage) {
  try {
    const workspace = activeWorkspace();
    const readAll = () => workspace.read(area, {}) || {};
    return {
      getItem(key) {
        const values = readAll();
        return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : fallback.getItem(key);
      },
      setItem(key, value) {
        workspace.write(area, { ...readAll(), [key]: String(value) });
      },
      removeItem(key) {
        const values = readAll();
        delete values[key];
        workspace.write(area, values);
      }
    };
  } catch {
    return fallback;
  }
}

export class DrawingBoard {
  constructor({
    canvas,
    wrap,
    hint,
    tool,
    size,
    grid,
    straightToggle,
    scribbleToggle,
    storage = workspaceStorage('whiteboard'),
    onChange = () => {},
    onPlacementChange = () => {}
  }) {
    Object.assign(this, {
      canvas,
      wrap,
      hint,
      tool,
      size,
      grid,
      straightToggle,
      scribbleToggle,
      storage,
      onChange,
      onPlacementChange
    });
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.space = null;
    this.history = new VectorHistory();
    this.readOnly = false;

    let savedShapeSize;
    try {
      savedShapeSize = this.storage.getItem(SHAPE_SIZE_KEY);
    } catch {}
    this.shapeSize = ['small', 'medium', 'large'].includes(savedShapeSize) ? savedShapeSize : 'medium';

    this.load();
    this.bind();
    this.resize();
  }

  load() {
    try {
      const prefs = JSON.parse(this.storage.getItem(PREFS_KEY) || '{}');
      this.straightToggle.checked = (prefs.perfectShapes ?? prefs.straight) !== false;
      this.scribbleToggle.checked = prefs.scribble !== false;
      this.grid.checked = prefs.grid !== false;
      this.size.value = String(Math.min(24, Math.max(1, Number(prefs.size) || Number(this.size.value) || 3)));
      this.canvas.classList.toggle('no-grid', !this.grid.checked);
      this.wrap.classList.toggle('no-grid', !this.grid.checked);

      const saved = this.storage.getItem(STORAGE_KEY);
      if (saved) {
        const scene = deserializeScene(saved);
        this.space = scene.space;
        this.history = new VectorHistory(scene.strokes);
      }
    } catch {
      this.history = new VectorHistory();
    }
  }

  persist() {
    try {
      this.storage.setItem(STORAGE_KEY, serializeScene({ space: this.space, strokes: this.history.strokes }));
      this.storage.setItem(PREFS_KEY, JSON.stringify({
        perfectShapes: this.straightToggle.checked,
        straight: this.straightToggle.checked,
        scribble: this.scribbleToggle.checked,
        grid: this.grid.checked,
        size: Number(this.size.value)
      }));
      this.onChange(this.capture());
    } catch (error) {
      console.error('Sauvegarde du tableau impossible', error);
    }
  }

  bind() {
    this.canvas.addEventListener('pointerdown', event => this.begin(event), { passive: false });
    this.canvas.addEventListener('pointermove', event => this.move(event), { passive: false });
    this.canvas.addEventListener('pointerup', event => this.end(event), { passive: false });
    this.canvas.addEventListener('pointercancel', event => this.cancelPointer(event), { passive: false });

    for (const name of ['touchstart', 'touchmove']) {
      this.canvas.addEventListener(name, event => event.preventDefault(), { passive: false });
    }
    document.addEventListener('gesturestart', event => event.preventDefault(), { passive: false });

    this.grid.addEventListener('change', () => {
      this.canvas.classList.toggle('no-grid', !this.grid.checked);
      this.wrap.classList.toggle('no-grid', !this.grid.checked);
      this.persist();
    });
    this.size.addEventListener('input', () => this.persist());
    for (const input of [this.straightToggle, this.scribbleToggle]) {
      input.addEventListener('change', () => this.persist());
    }

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.resize(), 100);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') this.cancelShapePlacement();
    });
  }

  resize() {
    const bounds = this.wrap.getBoundingClientRect();
    const dpr = Math.max(1, devicePixelRatio || 1);
    if (!this.space) this.space = { width: bounds.width, height: bounds.height };
    this.dpr = dpr;
    this.canvas.width = Math.round(bounds.width * dpr);
    this.canvas.height = Math.round(bounds.height * dpr);
    this.canvas.style.width = `${bounds.width}px`;
    this.canvas.style.height = `${bounds.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.transform = sceneTransform(this.space, bounds.width, bounds.height);
    this.redraw();
  }

  point(event) {
    const bounds = this.canvas.getBoundingClientRect();
    const transform = this.transform;
    return {
      x: (event.clientX - bounds.left - transform.offsetX) / transform.scale,
      y: (event.clientY - bounds.top - transform.offsetY) / transform.scale,
      pressure: event.pressure > 0 ? event.pressure : 0.5,
      time: event.timeStamp || performance.now()
    };
  }

  drawShape(shape, preview = false) {
    const geometry = shapeGeometry(shape);
    const transform = this.transform;
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = preview ? 0.48 : 1;
    this.ctx.setLineDash(preview ? [6, 5] : []);
    this.ctx.strokeStyle = preview ? '#2563eb' : '#334155';
    this.ctx.fillStyle = preview ? '#2563eb' : '#334155';
    this.ctx.lineWidth = Math.max(1, 1.25 * transform.scale);

    for (const path of geometry.paths) {
      const start = transformPoint(path.from, transform);
      const end = transformPoint(path.to, transform);
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    }
    for (const circle of geometry.circles) {
      const center = transformPoint(circle, transform);
      this.ctx.beginPath();
      this.ctx.arc(center.x, center.y, circle.r * transform.scale, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    this.ctx.font = `${Math.max(11, 12 * transform.scale)}px -apple-system, sans-serif`;
    this.ctx.textBaseline = 'middle';
    for (const item of geometry.labels) {
      this.ctx.textAlign = item.align;
      const point = transformPoint(item, transform);
      this.ctx.fillText(item.text, point.x, point.y);
    }
    this.ctx.restore();
  }

  drawStroke(stroke, clear = false) {
    if (clear) this.redraw();
    if (stroke.type === 'shape') {
      this.drawShape(stroke);
      return;
    }

    const points = stroke.points.map(point => transformPoint(point, this.transform));
    if (!points.length) return;
    const erase = stroke.tool === 'eraser';
    this.ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
    this.ctx.strokeStyle = '#111';

    for (let index = 1; index < points.length; index += 1) {
      this.ctx.lineWidth = (erase ? stroke.width * 3 : Math.max(1, stroke.width * (0.75 + points[index].pressure * 0.55))) * this.transform.scale;
      this.ctx.beginPath();
      this.ctx.moveTo(points[index - 1].x, points[index - 1].y);
      this.ctx.lineTo(points[index].x, points[index].y);
      this.ctx.stroke();
    }

    if (points.length === 1) {
      this.ctx.lineWidth = stroke.width * this.transform.scale;
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      this.ctx.lineTo(points[0].x + 0.01, points[0].y + 0.01);
      this.ctx.stroke();
    }
  }

  redraw(preview) {
    const bounds = this.canvas.getBoundingClientRect();
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, bounds.width, bounds.height);
    for (const stroke of this.history.strokes) this.drawStroke(stroke);
    if (preview) preview.type === 'shape' ? this.drawShape(preview, true) : this.drawStroke(preview);
    this.hint.classList.toggle('hidden', this.history.strokes.length > 0 || Boolean(preview));
  }

  begin(event) {
    if (this.readOnly) return;
    if (this.shapeKind) {
      if (event.pointerType !== 'pen') return;
      event.preventDefault();
      event.stopPropagation();
      this.drawing = true;
      this.pointerId = event.pointerId;
      this.canvas.setPointerCapture(event.pointerId);
      this.activeShape = this.previewShape(this.point(event));
      this.redraw(this.activeShape);
      return;
    }
    if (event.pointerType === 'touch') return;
    event.preventDefault();
    event.stopPropagation();
    this.drawing = true;
    this.pointerId = event.pointerId;
    this.canvas.setPointerCapture(event.pointerId);
    this.active = createStroke({ tool: this.tool.value, points: [this.point(event)], width: Number(this.size.value) });
    this.lastMotion = performance.now();
    this.snapPreview = null;
    this.armHold();
  }

  armHold() {
    clearTimeout(this.holdTimer);
    if (this.active.tool !== 'pen' || !this.straightToggle.checked) return;
    this.holdTimer = setTimeout(() => {
      if (!this.drawing || performance.now() - this.lastMotion < 450) return;
      if (circleCandidate(this.active.points)) {
        this.snapPreview = 'circle';
        this.active = toCircleStroke(this.active);
      } else if (straightCandidate(this.active.points)) {
        this.snapPreview = 'line';
        this.active = toStraightStroke(this.active);
      } else {
        return;
      }
      this.redraw(this.active);
      this.canvas.classList.add('line-snapped');
    }, 500);
  }

  move(event) {
    if (!this.drawing || event.pointerId !== this.pointerId) return;
    event.preventDefault();
    if (this.activeShape) {
      this.activeShape = this.previewShape(this.point(event));
      this.redraw(this.activeShape);
      return;
    }
    const point = this.point(event);
    const last = this.active.points.at(-1);
    if (Math.hypot(point.x - last.x, point.y - last.y) < 0.7) return;
    this.lastMotion = performance.now();
    if (this.snapPreview === 'circle') return;
    if (this.snapPreview === 'line') {
      this.active = toStraightStroke(this.active, point);
      this.redraw(this.active);
    } else {
      this.active = createStroke({ ...this.active, points: [...this.active.points, point] });
      this.drawStroke(createStroke({ ...this.active, points: [last, point] }));
      this.armHold();
    }
  }

  end(event) {
    if (!this.drawing || event.pointerId !== this.pointerId) return;
    event.preventDefault();
    clearTimeout(this.holdTimer);
    this.drawing = false;
    if (this.canvas.hasPointerCapture(this.pointerId)) this.canvas.releasePointerCapture(this.pointerId);
    this.pointerId = null;

    if (this.activeShape) {
      const shape = this.activeShape;
      this.activeShape = null;
      this.history.perform({ added: [shape], removed: [] });
      this.redraw();
      this.persist();
      this.finishShapePlacement();
      return;
    }

    this.canvas.classList.remove('line-snapped');
    const active = this.active;
    this.active = null;
    if (active.points.length < 2) {
      this.redraw();
      return;
    }

    if (active.tool === 'eraser') {
      const removed = this.history.strokes.filter(stroke => stroke.type === 'shape'
        ? shapeTouchesGesture(stroke, active, active.width * 3)
        : strokeTouchesGesture(stroke, active, active.width * 3));
      if (removed.length) this.history.perform({ added: [], removed });
      this.redraw();
    } else {
      const handwriting = this.history.strokes.filter(stroke => stroke.type !== 'shape');
      const scribble = this.scribbleToggle.checked && !this.snapPreview
        ? detectScribble(active, handwriting)
        : { isScribble: false };
      if (scribble.isScribble) this.history.perform({ added: [], removed: scribble.touched });
      else this.history.perform({ added: [active], removed: [] });
      this.redraw();
    }
    this.persist();
  }

  previewShape(center) {
    const bounds = this.canvas.getBoundingClientRect();
    const visible = { width: bounds.width / this.transform.scale, height: bounds.height / this.transform.scale };
    const size = shapeSize(this.shapeKind, visible, this.shapeSize);
    const placed = clampShapeCenter(center, size, this.space);
    return createBoardShape({ kind: this.shapeKind, ...placed, ...size });
  }

  selectShape(kind, size = this.shapeSize) {
    if (this.readOnly) return false;
    shapeSize(kind, { width: 1000, height: 1000 }, size);
    this.cancelShapePlacement();
    this.shapeKind = kind;
    this.shapeSize = size;
    this.storage.setItem(SHAPE_SIZE_KEY, size);
    this.tool.value = 'pen';
    this.canvas.classList.add('shape-placement');
    this.onPlacementChange({ active: true, kind, label: SHAPE_LABELS[kind], size });
    return true;
  }

  finishShapePlacement() {
    this.shapeKind = null;
    this.tool.value = 'pen';
    this.canvas.classList.remove('shape-placement');
    this.onPlacementChange({ active: false, placed: true });
  }

  cancelShapePlacement() {
    const changed = Boolean(this.shapeKind || this.activeShape);
    if (this.drawing && this.activeShape && this.canvas.hasPointerCapture(this.pointerId)) {
      this.canvas.releasePointerCapture(this.pointerId);
    }
    if (this.activeShape) {
      this.drawing = false;
      this.pointerId = null;
      this.activeShape = null;
      this.redraw();
    }
    this.shapeKind = null;
    this.canvas.classList.remove('shape-placement');
    if (changed) this.onPlacementChange({ active: false, cancelled: true });
    return changed;
  }

  cancelPointer(event) {
    if (!this.drawing || event.pointerId !== this.pointerId) return;
    if (this.activeShape) {
      event.preventDefault();
      this.cancelShapePlacement();
      return;
    }
    this.end(event);
  }

  undo() {
    if (this.history.undo()) {
      this.redraw();
      this.persist();
    }
  }

  redo() {
    if (this.history.redo()) {
      this.redraw();
      this.persist();
    }
  }

  clear(store = true) {
    this.cancelShapePlacement();
    const removed = [...this.history.strokes];
    if (store && removed.length) this.history.perform({ added: [], removed });
    else if (!store) this.history = new VectorHistory();
    this.redraw();
    this.persist();
  }

  capture() {
    const parsed = deserializeScene({
      version: 2,
      space: this.space,
      strokes: Array.isArray(this.history?.strokes) ? this.history.strokes : []
    }, { fallbackSpace: this.space, tolerant: true });
    return { version: 2, space: parsed.space, strokes: parsed.strokes };
  }

  restore(scene) {
    this.cancelShapePlacement();
    const parsed = deserializeScene(scene, { fallbackSpace: this.space, tolerant: true });
    this.space = parsed.space;
    this.history = new VectorHistory(parsed.strokes);
    this.redraw();
    return parsed;
  }

  setReadOnly(value) {
    this.cancelShapePlacement();
    this.readOnly = value === true;
    this.canvas.setAttribute('aria-readonly', String(this.readOnly));
  }
}
