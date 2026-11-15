import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.abspath(r"c:\Users\J_jolam\Downloads\HireSmart AI\docs\logo")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. First, create pure SVG versions (infinite resolution vector format)
FULL_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120" width="1040" height="240">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="60%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#4f46e5" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Icon Box -->
  <g filter="url(#glow)">
    <rect x="20" y="20" width="80" height="80" rx="22" fill="url(#bgGrad)" />
  </g>
  
  <!-- Lightning Bolt Icon -->
  <path d="M63.3 35 L40 60 L56.7 60 L53.3 85 L76.7 56.7 L60 56.7 Z" 
        fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Brand Typography -->
  <text x="120" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="44" font-weight="800" fill="url(#textGrad)" letter-spacing="-1">HireSmart <tspan fill="#4f46e5" font-weight="900">AI</tspan></text>
  <text x="122" y="94" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="700" fill="#475569" letter-spacing="3.5">INTELLIGENT RECRUITMENT</text>
</svg>
"""

ICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#4f46e5" flood-opacity="0.35" />
    </filter>
  </defs>
  <g filter="url(#glow)">
    <rect x="25" y="25" width="150" height="150" rx="42" fill="url(#bgGrad)" />
  </g>
  <path d="M106.6 52.5 L60 100 L93.4 100 L86.6 147.5 L133.4 93.4 L100 93.4 Z" 
        fill="white" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""

with open(os.path.join(OUTPUT_DIR, "hiresmart_logo_full.svg"), "w", encoding="utf-8") as f:
    f.write(FULL_SVG)

with open(os.path.join(OUTPUT_DIR, "hiresmart_logo_icon.svg"), "w", encoding="utf-8") as f:
    f.write(ICON_SVG)

print("SVGs saved successfully.")

# 2. Render high-res PNGs using Pillow with 4x supersampling for ultra-crisp edges
def draw_lightning(draw, x, y, size, scale):
    # Normalized coords for lightning bolt:
    # Top point: (0.55, 0.15)
    # Mid-left inner: (0.25, 0.52)
    # Mid-left outer: (0.47, 0.52)
    # Bottom point: (0.43, 0.85)
    # Mid-right outer: (0.75, 0.48)
    # Mid-right inner: (0.53, 0.48)
    points = [
        (x + 0.55 * size, y + 0.15 * size),
        (x + 0.25 * size, y + 0.52 * size),
        (x + 0.47 * size, y + 0.52 * size),
        (x + 0.43 * size, y + 0.85 * size),
        (x + 0.75 * size, y + 0.48 * size),
        (x + 0.53 * size, y + 0.48 * size)
    ]
    draw.polygon(points, fill=(255, 255, 255, 255))

# Generate Icon PNG (512x512)
SCALE = 4
DIM = 512 * SCALE
img_icon = Image.new("RGBA", (DIM, DIM), (0, 0, 0, 0))
draw = ImageDraw.Draw(img_icon)

# Draw rounded rectangle with gradient
rect_x0, rect_y0 = int(0.125 * DIM), int(0.125 * DIM)
rect_x1, rect_y1 = int(0.875 * DIM), int(0.875 * DIM)
radius = int(0.22 * DIM)

# Draw gradient inside rounded rectangle
mask = Image.new("L", (DIM, DIM), 0)
draw_mask = ImageDraw.Draw(mask)
draw_mask.rounded_rectangle([rect_x0, rect_y0, rect_x1, rect_y1], radius=radius, fill=255)

grad = Image.new("RGBA", (DIM, DIM))
for y in range(DIM):
    ratio = y / DIM
    # Interpolate from #4f46e5 (79, 70, 229) to #8b5cf6 (139, 92, 246)
    r = int(79 + ratio * (139 - 79))
    g = int(70 + ratio * (92 - 70))
    b = int(229 + ratio * (246 - 229))
    draw_grad = ImageDraw.Draw(grad)
    draw_grad.line([(0, y), (DIM, y)], fill=(r, g, b, 255))

img_icon = Image.composite(grad, img_icon, mask)
draw_final = ImageDraw.Draw(img_icon)

# Draw lightning bolt inside
box_size = rect_x1 - rect_x0
draw_lightning(draw_final, rect_x0, rect_y0, box_size, SCALE)

# Downsample for supersampled antialiasing
icon_final = img_icon.resize((512, 512), Image.Resampling.LANCZOS)
icon_png_path = os.path.join(OUTPUT_DIR, "hiresmart_logo_icon.png")
icon_final.save(icon_png_path, "PNG")
print(f"Saved: {icon_png_path}")

# 3. Generate Full Logo PNG (Icon + "HireSmart AI" + "INTELLIGENT RECRUITMENT") (1400 x 360)
WIDTH, HEIGHT = 1400 * SCALE, 360 * SCALE
img_full = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))

# Place the icon
icon_dim_on_full = int(240 * SCALE)
icon_resized = img_icon.resize((icon_dim_on_full, icon_dim_on_full), Image.Resampling.LANCZOS)
icon_pos_x = int(60 * SCALE)
icon_pos_y = int(60 * SCALE)
img_full.paste(icon_resized, (icon_pos_x, icon_pos_y), icon_resized)

# Draw Text using available Windows fonts (Segoe UI or Arial Bold)
draw_full = ImageDraw.Draw(img_full)

font_candidates = [
    r"C:\Windows\Fonts\segoeuib.ttf",  # Segoe UI Bold
    r"C:\Windows\Fonts\arialbd.ttf",   # Arial Bold
]
font_path_bold = next((f for f in font_candidates if os.path.exists(f)), None)

font_sub_candidates = [
    r"C:\Windows\Fonts\segoeui.ttf",   # Segoe UI Regular
    r"C:\Windows\Fonts\arial.ttf",     # Arial
]
font_path_reg = next((f for f in font_sub_candidates if os.path.exists(f)), None)

text_start_x = icon_pos_x + icon_dim_on_full + int(50 * SCALE)

if font_path_bold:
    font_main = ImageFont.truetype(font_path_bold, int(110 * SCALE))
    font_sub = ImageFont.truetype(font_path_bold, int(28 * SCALE))
    
    # Draw "HireSmart "
    main_text_y = int(85 * SCALE)
    draw_full.text((text_start_x, main_text_y), "HireSmart ", fill=(15, 23, 42, 255), font=font_main)
    
    # Measure width of "HireSmart " to place "AI"
    bbox = draw_full.textbbox((text_start_x, main_text_y), "HireSmart ", font=font_main)
    ai_x = bbox[2]
    draw_full.text((ai_x, main_text_y), "AI", fill=(79, 70, 229, 255), font=font_main)
    
    # Draw subtitle "INTELLIGENT RECRUITMENT" with letter-spacing simulation
    sub_text = "I N T E L L I G E N T   R E C R U I T M E N T"
    sub_text_y = main_text_y + int(125 * SCALE)
    draw_full.text((text_start_x + int(4 * SCALE), sub_text_y), sub_text, fill=(71, 85, 105, 255), font=font_sub)
else:
    print("Default fonts used")

full_final = img_full.resize((1400, 360), Image.Resampling.LANCZOS)
full_png_path = os.path.join(OUTPUT_DIR, "hiresmart_logo_full.png")
full_final.save(full_png_path, "PNG")
print(f"Saved: {full_png_path}")

# 4. Also create a white background version for Word (so it looks clean regardless of page background)
white_bg = Image.new("RGBA", full_final.size, (255, 255, 255, 255))
white_bg.paste(full_final, (0, 0), full_final)
cover_png_path = os.path.join(OUTPUT_DIR, "hiresmart_logo_cover_white.png")
white_bg.convert("RGB").save(cover_png_path, "PNG")
print(f"Saved: {cover_png_path}")

print("All logo formats generated successfully!")

