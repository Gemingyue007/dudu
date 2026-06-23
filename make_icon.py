"""生成吨吨吨应用图标 - 水滴主题"""
from PIL import Image, ImageDraw, ImageFilter
import math
import struct
import io

def create_water_drop(size):
    """绘制渐变水滴"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx = cy = size // 2
    r = size * 0.42

    # 水滴路径
    points = []
    for angle_deg in range(0, 360, 2):
        angle = math.radians(angle_deg)
        if 150 <= angle_deg <= 210:
            factor = 1 - (1 - 0.3) * abs(math.sin(angle))
        elif 330 <= angle_deg or angle_deg <= 30:
            factor = 1.05
        else:
            factor = 1.0
        x = cx + r * factor * math.cos(angle)
        y = cy + r * factor * math.sin(angle) + r * 0.15
        points.append((x, y))

    # 渐变多层叠加
    for i, (r_mult, g_mult, b_mult, alpha) in enumerate([
        (0.35, 0.55, 1.0, 0.95),
        (0.45, 0.65, 1.0, 0.80),
        (0.60, 0.80, 1.0, 0.50),
        (0.80, 0.90, 1.0, 0.30),
    ]):
        layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        layer_draw = ImageDraw.Draw(layer)
        offset = int(r * 0.08 * i)
        shifted = [(x - offset, y + offset) for x, y in points]
        layer_draw.polygon(shifted, fill=(
            int(50 * r_mult), int(120 * g_mult), int(255 * b_mult), int(255 * alpha)
        ))
        img = Image.alpha_composite(img, layer)

    # 高光
    highlight = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    hdraw = ImageDraw.Draw(highlight)
    hx = cx - r * 0.3
    hy = cy - r * 0.25
    hr = r * 0.25
    hdraw.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill=(255, 255, 255, 120))
    hdraw.ellipse([hx - hr * 0.5, hy - hr * 0.5, hx + hr * 0.5, hy + hr * 0.5], fill=(255, 255, 255, 160))
    img = Image.alpha_composite(img, highlight)

    # 二级高光
    h2 = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    h2d = ImageDraw.Draw(h2)
    h2x = cx - r * 0.15
    h2y = cy + r * 0.2
    h2r = r * 0.08
    h2d.ellipse([h2x - h2r, h2y - h2r, h2x + h2r, h2y + h2r], fill=(255, 255, 255, 80))
    img = Image.alpha_composite(img, h2)

    img = img.filter(ImageFilter.SMOOTH)
    return img


# 手动构造 ICO 文件（支持多尺寸）
sizes = [16, 24, 32, 48, 64, 128, 256]
images = [create_water_drop(s) for s in sizes]

# PNG 格式存储每个尺寸
png_data = []
for img in images:
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    png_data.append(buf.getvalue())

# 构造 ICO
ico_buf = io.BytesIO()
# ICO 头
ico_buf.write(struct.pack('<HHH', 0, 1, len(sizes)))
offset = 6 + len(sizes) * 16  # header + 每个目录项 16 字节
for i, s in enumerate(sizes):
    data = png_data[i]
    w = 0 if s > 255 else s  # ICO 用 0 表示 256
    h = 0 if s > 255 else s
    bpp = 32
    size = len(data)
    ico_buf.write(struct.pack('<BBBBHHII', w, h, 0, 0, 1, bpp, size, offset))
    offset += size

# 追加所有尺寸的 PNG 数据
for data in png_data:
    ico_buf.write(data)

with open('icon.ico', 'wb') as f:
    f.write(ico_buf.getvalue())

print('[OK] 图标已生成: icon.ico (' + str(len(sizes)) + ' sizes)')

# 高分辨率预览
preview = create_water_drop(512)
preview.save('icon_preview.png')
print('[OK] 预览图: icon_preview.png')
