# 🎮 MONAD DOMINION - PIXEL ART DESIGN SYSTEM 🎮

## Overview
Monad Dominion has been transformed into a **TRUE RETRO PIXEL ART GAME** using the official Monad color palette with authentic 8-bit aesthetics.

---

## 🎨 Color Palette (Monad Official Colors)

### Primary Colors
- **Monad Off-White**: `#FBFAF9` / `rgba(251, 250, 249, 1)` - Primary text & highlights
- **Monad Purple**: `#836EF9` / `rgba(131, 110, 249, 1)` - Primary accent & faction 1
- **Monad Blue**: `#200052` / `rgba(32, 0, 82, 1)` - Deep backgrounds & shadows
- **Monad Berry**: `#A0055D` / `rgba(160, 5, 93, 1)` - Secondary accent & faction 2
- **Monad Black**: `#0E100F` / `rgba(14, 16, 15, 1)` - Base background
- **Pure White**: `#FFFFFF` / `rgba(255, 255, 255, 1)` - Bright highlights

### Derived Colors (for 3D effects)
- **Light Purple**: `#9B8BF9` - Highlights
- **Dark Purple**: `#6B5CE7` / `#7B5EE7` - Shadows
- **Light Berry**: `#C0076F` - Highlights
- **Dark Berry**: `#8B0451` - Shadows
- **Dark Gray**: `#1A1C1B` - Borders
- **Gold**: `#FFD700` - Player highlights

---

## 🔤 Typography

### Font Family
**Primary**: `'Press Start 2P'` - True retro pixel font
**Fallback**: `'Inter'`, `'Courier New'`, `monospace`

### Font Sizes
- **Base**: `8px` (small pixel text)
- **Buttons**: `10px`
- **Subtitles**: `12px`
- **Titles**: `16px`

### Font Rendering
```css
font-smooth: never;
-webkit-font-smoothing: none;
-moz-osx-font-smoothing: grayscale;
text-rendering: geometricPrecision;
image-rendering: pixelated;
```

### Text Shadows (Hard-edged Pixel Style)
- **Title**: `3px 3px 0 #836EF9, 6px 6px 0 #200052`
- **Subtitle**: `2px 2px 0 rgba(0, 0, 0, 0.8)`
- **Body**: `1px 1px 0 rgba(0, 0, 0, 0.8)`

---

## 🎯 Background System

### Layered Pixel Grid Background
1. **Base Gradient**: Radial gradient from Monad Blue to Black
2. **4x4 Pixel Grid**: Checkerboard pattern (#0E100F ↔ #1A1C1B)
3. **Large Blocks**: 32px repeating Monad Purple blocks
4. **Diagonal Pattern**: 48px repeating Monad Berry diagonal stripes

### Animation
```css
animation: pixelShift 30s linear infinite;
/* Shifts all layers at different speeds */
```

---

## 🔲 Pixel Border System

### Standard Border (3D Effect)
```css
border: 4px solid;
border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9; /* Top-Left light, Bottom-Right dark */
box-shadow: 
  inset 2px 2px 0 rgba(255, 255, 255, 0.3),
  inset -2px -2px 0 rgba(0, 0, 0, 0.3);
```

### Enhanced Shadow
```css
box-shadow: 
  4px 0 0 #836EF9,
  0 4px 0 #836EF9,
  4px 4px 0 #836EF9,
  8px 8px 0 rgba(131, 110, 249, 0.6);
```

### Glow Effect (Stepped)
```css
box-shadow: 
  0 0 0 2px #836EF9,
  0 0 0 4px #A0055D,
  0 0 0 6px rgba(131, 110, 249, 0.5),
  0 0 16px rgba(131, 110, 249, 0.4);
```

---

## 🎮 Button System

### Pixel Button Style
```css
background: 
  repeating-linear-gradient(
    0deg,
    #836EF9 0px, #836EF9 2px,
    #9B8BF9 2px, #9B8BF9 4px
  );
border: 4px solid;
border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
padding: 12px 20px;
font-family: 'Press Start 2P';
font-size: 10px;
```

### Hover State
- Background changes to Purple+Berry mix
- Enhanced 3D shadow effect
- Border lightens on top-left

### Active State
```css
transform: translate(4px, 4px);
box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.3);
```

---

## 🪟 Panel System (Pixel Windows)

### Base Style
```css
background: 
  repeating-linear-gradient(
    45deg,
    #200052 0px, #200052 4px,
    #0E100F 4px, #0E100F 8px
  );
border: 4px solid;
border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
```

### Title Bar (::before)
```css
height: 8px;
background: repeating-linear-gradient(
  90deg,
  #836EF9 0px, #836EF9 4px,
  #9B8BF9 4px, #9B8BF9 8px
);
border-bottom: 2px solid #FBFAF9;
```

---

## 🔷 Hex Grid Tiles

### Faction Color Patterns

#### Faction 1 (Cmty) - Purple
```css
background: 
  repeating-linear-gradient(
    0deg,
    #836EF9 0px, #836EF9 3px,
    #9B8BF9 3px, #9B8BF9 6px
  ),
  repeating-linear-gradient(
    90deg,
    #836EF9 0px, #836EF9 3px,
    #7B5EE7 3px, #7B5EE7 6px
  );
background-size: 6px 6px;
```

#### Faction 2 (Eco) - Berry
```css
background: 
  repeating-linear-gradient(
    0deg,
    #A0055D 0px, #A0055D 3px,
    #C0076F 3px, #C0076F 6px
  ),
  repeating-linear-gradient(
    90deg,
    #A0055D 0px, #A0055D 3px,
    #8B0451 3px, #8B0451 6px
  );
```

#### Faction 3 (Dev) - White
```css
background: 
  repeating-linear-gradient(
    0deg,
    #FBFAF9 0px, #FBFAF9 3px,
    #FFFFFF 3px, #FFFFFF 6px
  ),
  repeating-linear-gradient(
    90deg,
    #FBFAF9 0px, #FBFAF9 3px,
    #E8E7E6 3px, #E8E7E6 6px
  );
```

#### Faction 4 (Xyz) - Black
```css
background: 
  repeating-linear-gradient(
    0deg,
    #0E100F 0px, #0E100F 3px,
    #1A1C1B 3px, #1A1C1B 6px
  ),
  repeating-linear-gradient(
    90deg,
    #0E100F 0px, #0E100F 3px,
    #0A0C0B 3px, #0A0C0B 6px
  );
```

### Tile Borders & Shadows
- **Default**: 3px solid #836EF9
- **Player's Faction**: 4px solid #FFD700 (gold highlight)
- **3D Effect**: Inset highlights + hard drop shadow

### Monad Symbol (Center Icon)
- Size: 24px × 24px
- Font: Press Start 2P, 12px
- Border: 3px with 3D effect
- Content: Letter "M"
- Pixelated background pattern

---

## 🎬 Animations

### Pixel Blink
```css
@keyframes pixelBlink {
  0%, 45% { opacity: 1; }
  50%, 95% { opacity: 0; }
  100% { opacity: 1; }
}
animation: pixelBlink 1s steps(2, end) infinite;
```

### Pixel Bounce
```css
@keyframes pixelBounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-8px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-4px); }
}
animation: pixelBounce 0.8s steps(4, end) infinite;
```

### Pixel Glow
```css
@keyframes pixelGlow {
  0%, 100% { 
    box-shadow: 
      0 0 0 2px #836EF9,
      0 0 0 4px rgba(131, 110, 249, 0.5),
      4px 4px 0 #200052;
  }
  50% { 
    box-shadow: 
      0 0 0 2px #A0055D,
      0 0 0 4px rgba(160, 5, 93, 0.5),
      0 0 0 6px rgba(131, 110, 249, 0.3),
      4px 4px 0 #200052,
      8px 8px 0 rgba(160, 5, 93, 0.3);
  }
}
```

### Pixel Pulse
```css
@keyframes pixelPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

---

## 📜 Scrollbar

### Pixel-Perfect Scrollbar
```css
::-webkit-scrollbar {
  width: 16px;
}

::-webkit-scrollbar-track {
  background: repeating-linear-gradient(
    0deg,
    #0E100F 0px, #0E100F 4px,
    #1A1C1B 4px, #1A1C1B 8px
  );
  border: 2px solid #836EF9;
}

::-webkit-scrollbar-thumb {
  background: repeating-linear-gradient(
    0deg,
    #836EF9 0px, #836EF9 4px,
    #9B8BF9 4px, #9B8BF9 8px
  );
  border: 2px solid;
  border-color: #FBFAF9 #200052 #200052 #FBFAF9;
}
```

---

## 🎨 Utility Classes

### Available Classes
```css
.pixel-border     /* Standard pixel border with 3D effect */
.pixel-shadow     /* Hard-edged pixel shadow */
.pixel-glow       /* Stepped glow effect */
.pixel-button     /* Complete pixel button style */
.pixel-panel      /* Pixel window/panel style */
.pixel-title      /* Large pixel title text */
.pixel-subtitle   /* Medium pixel subtitle text */
.pixel-text       /* Small pixel body text */
.pixel-blink      /* Blinking animation */
.pixel-bounce     /* Bouncing animation */
.pixel-glow-anim  /* Glowing animation */
.pixel-pulse      /* Pulsing animation */
```

---

## 🔧 Implementation Notes

### Critical CSS Rules
1. **Always use** `image-rendering: pixelated` on pixel art elements
2. **Never use** `transition` properties (instant state changes only)
3. **Always use** hard-edged shadows (no blur on pixel shadows)
4. **Use** stepped animations for smooth pixel movement
5. **Avoid** anti-aliasing on text and graphics

### Responsive Considerations
- Pixel sizes are fixed (no relative units for pixel perfection)
- Use `transform: scale()` for responsive sizing if needed
- Maintain pixel grid alignment at all sizes

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support (use `-moz-crisp-edges`)
- Safari: Partial support (some rendering differences)

---

## 🎮 Component-Specific Styles

### HexGrid
- **Tile Size**: 60×60px hexagons
- **Clip Path**: Hexagon polygon
- **Border**: 3-4px with faction colors
- **Background**: Checkerboard pixel pattern (6×6px grid)

### Game Stats
- **Font**: Press Start 2P, 8-10px
- **Panels**: Pixel window style with title bars
- **Borders**: 4px with 3D effect

### Buttons
- **Height**: Auto (with 12px padding)
- **Font Size**: 10px
- **Border**: 4px 3D style
- **Shadow**: 4px hard drop shadow

### Modals
- **Background**: Pixel pattern with Monad Blue/Black
- **Border**: 4px with glow effect
- **Font**: Press Start 2P throughout

---

## 🌟 Best Practices

1. **Consistent Pixel Grid**: Always use multiples of 2-4px for sizes
2. **Hard Edges**: Never use border-radius (except 0px)
3. **Limited Color Palette**: Stick to Monad official colors
4. **Chunky Shadows**: Use 4px+ offset shadows
5. **Retro Fonts**: Press Start 2P for all UI text
6. **No Blur**: Avoid blur effects completely
7. **Instant Transitions**: No smooth animations
8. **Stepped Animations**: Use `steps()` easing function

---

## 📚 Resources

### Fonts
- **Press Start 2P**: Google Fonts
- **Inter**: Fallback for complex text

### Inspiration
- Nintendo Game Boy UI
- Super Nintendo menus
- Classic arcade cabinets
- 8-bit console aesthetics

---

## 🚀 Future Enhancements

- [ ] Add pixel art character sprites
- [ ] Create pixel art sound effects
- [ ] Add CRT scanline overlay option
- [ ] Implement color palette swap feature
- [ ] Add more pixel animations (explode, shimmer)
- [ ] Create pixel art loading screens
- [ ] Add retro game music integration

---

**Last Updated**: October 2025
**Design System Version**: 2.0 - Full Pixel Art Implementation
**Monad Color Palette**: Official v1.0

