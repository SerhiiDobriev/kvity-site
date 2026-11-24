"""
Собирает маленький шрифт "Jost UA" только с украинскими буквами і ї є ґ І Ї Є Ґ,
нарисованными из глифов самого Jost (чтобы буквы не выпадали из стиля):
  і = i, ї = ï, І = I, Ї = Ï       (те же формы, что в латинице)
  є = зеркальная э, Є = зеркальная Э
  ґ = г + вертикальный «крючок» вверх, Ґ = Г + крючок
Мастера 300/400/500/600 собираются в один переменный шрифт (как сам Jost), иначе браузер путает начертания.
Запуск (нужен fonttools + brotli): python -I tools/build-jost-ua.py site/fonts <tmp_dir>  ->  site/fonts/jost-ua.woff2 (переменный, 300–600)
"""
import sys, os, copy
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.reverseContourPen import ReverseContourPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.areaPen import AreaPen
from fontTools.pens.boundsPen import BoundsPen

fonts = sys.argv[1]
WEIGHTS = [300, 400, 500, 600]


def record(gs, name):
    p = DecomposingRecordingPen(gs)
    gs[name].draw(p)
    return p


def contours(rec):
    """split recording into contours -> list of lists of (op, args)"""
    out, cur = [], []
    for op, args in rec.value:
        cur.append((op, args))
        if op in ("closePath", "endPath"):
            out.append(cur); cur = []
    return out


def pts_of(rec):
    pts = []
    for op, args in rec.value:
        for a in args:
            pts.append(a)
    return pts


def build(w):
    lat = instancer.instantiateVariableFont(TTFont(os.path.join(fonts, "jost-latin.woff2")), {"wght": w})
    cyr = instancer.instantiateVariableFont(TTFont(os.path.join(fonts, "jost-cyrillic.woff2")), {"wght": w})
    lgs, cgs = lat.getGlyphSet(), cyr.getGlyphSet()
    lm, cm = lat["hmtx"].metrics, cyr["hmtx"].metrics

    glyphs, metrics = {}, {}

    def put(name, rec, adv, transform=None, reverse=False, extra=None):
        pen = TTGlyphPen(None)
        target = ReverseContourPen(pen) if reverse else pen
        if transform:
            target = TransformPen(target, transform)
        rec.replay(target)
        if extra:
            extra(pen)
        g = pen.glyph()
        glyphs[name] = g
        metrics[name] = adv

    # empty .notdef
    p = TTGlyphPen(None); glyphs[".notdef"] = p.glyph(); metrics[".notdef"] = (500, 0)

    # і ї І Ї — копии латиницы
    for src, dst in [("i", "uni0456"), ("idieresis", "uni0457"), ("I", "uni0406"), ("Idieresis", "uni0407")]:
        put(dst, record(lgs, src), lm[src])

    # є Є — зеркальные э Э (горизонтально, с сохранением ширины)
    for src, dst in [("uni044D", "uni0454"), ("uni042D", "uni0404")]:
        adv, lsb = cm[src]
        put(dst, record(cgs, src), cm[src], transform=(-1, 0, 0, 1, adv, 0), reverse=True)

    # ґ Ґ — г Г + крючок вверх на правом конце верхней перекладины
    for src, dst, hook_h in [("uni0433", "uni0491", 0.30), ("uni0413", "uni0490", 0.20)]:
        rec = record(cgs, src)
        bp = BoundsPen(cgs); cgs[src].draw(bp)
        xmin, ymin, xmax, ymax = bp.bounds
        pts = pts_of(rec)
        # толщина основного (вертикального) штриха: две крайние левые x на базовой линии
        base_x = sorted({round(x) for x, y in pts if abs(y - ymin) < 2})
        stem = (base_x[1] - base_x[0]) if len(base_x) >= 2 else 0.1 * (xmax - xmin)
        # нижний край перекладины у правого конца
        right_y = sorted({round(y) for x, y in pts if abs(x - xmax) < 2})
        bar_bottom = right_y[0] if right_y else ymax - stem
        # ориентация контуров исходника, чтобы прямоугольник был той же
        ap = AreaPen(cgs); cgs[src].draw(ap)
        cw = ap.value < 0  # в fontTools отрицательная площадь = по часовой (как у внешних контуров TrueType)
        height = (ymax - ymin)
        x0, x1 = xmax - stem * 0.92, xmax
        y0, y1 = bar_bottom, ymax + height * hook_h

        def hook(pen, x0=x0, x1=x1, y0=y0, y1=y1, cw=cw):
            pts_r = [(x0, y0), (x0, y1), (x1, y1), (x1, y0)]  # по часовой
            if not cw:
                pts_r = pts_r[::-1]
            pen.moveTo(pts_r[0])
            for q in pts_r[1:]:
                pen.lineTo(q)
            pen.closePath()

        put(dst, rec, cm[src], extra=hook)

    order = [".notdef", "uni0456", "uni0457", "uni0406", "uni0407", "uni0454", "uni0404", "uni0491", "uni0490"]
    cmap = {0x456: "uni0456", 0x457: "uni0457", 0x406: "uni0406", 0x407: "uni0407",
            0x454: "uni0454", 0x404: "uni0404", 0x491: "uni0491", 0x490: "uni0490"}
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf({n: glyphs[n] for n in order})
    # lsb пересчитается из контуров
    gl = fb.font["glyf"]
    hm = {}
    for n in order:
        g = gl[n]
        g.recalcBounds(gl)
        hm[n] = (metrics[n][0], getattr(g, "xMin", 0) or 0)
    fb.setupHorizontalMetrics(hm)
    hh = lat["hhea"]
    fb.setupHorizontalHeader(ascent=hh.ascent, descent=hh.descent, lineGap=hh.lineGap)
    fb.setupNameTable({"familyName": "Jost UA", "styleName": str(w)})
    o = lat["OS/2"]
    fb.setupOS2(usWeightClass=w, sTypoAscender=o.sTypoAscender, sTypoDescender=o.sTypoDescender,
                sTypoLineGap=o.sTypoLineGap, usWinAscent=o.usWinAscent, usWinDescent=o.usWinDescent,
                fsSelection=o.fsSelection, sxHeight=getattr(o, "sxHeight", 0), sCapHeight=getattr(o, "sCapHeight", 0))
    fb.setupPost()
    out = os.path.join(TMP, "master-%d.ttf" % w)
    fb.font.save(out)
    return out


TMP = sys.argv[2]
from fontTools.designspaceLib import DesignSpaceDocument, AxisDescriptor, SourceDescriptor
from fontTools import varLib
ds = DesignSpaceDocument()
ax = AxisDescriptor(); ax.tag = "wght"; ax.name = "Weight"; ax.minimum = 300; ax.default = 400; ax.maximum = 600
ds.addAxis(ax)
for w in WEIGHTS:
    s = SourceDescriptor(); s.path = build(w); s.location = {"Weight": w}; s.familyName = "Jost UA"
    if w == 400: s.copyInfo = True
    ds.addSource(s)
vf, _, _ = varLib.build(ds)
vf.flavor = "woff2"
out = os.path.join(fonts, "jost-ua.woff2")
vf.save(out)
print(out, os.path.getsize(out), "bytes")
