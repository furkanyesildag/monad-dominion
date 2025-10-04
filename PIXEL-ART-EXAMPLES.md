# 🎮 PIXEL ART USAGE EXAMPLES 🎮

## Quick Reference Guide for Developers

---

## 🎨 Basic Text Styles

### Pixel Title
```tsx
<h1 className="pixel-title">MONAD DOMINION</h1>
```
**Result**: Large retro text with 3D shadow effect

### Pixel Subtitle
```tsx
<h2 className="pixel-subtitle">Choose Your Faction</h2>
```
**Result**: Medium retro text with shadow

### Pixel Body Text
```tsx
<p className="pixel-text">Click hexagons to claim territories!</p>
```
**Result**: Small readable pixel text

---

## 🔲 Pixel Borders & Containers

### Simple Pixel Border
```tsx
<div className="pixel-border" style={{ padding: '20px' }}>
  <p>Content with pixel border</p>
</div>
```

### Pixel Panel (Window Style)
```tsx
<div className="pixel-panel" style={{ padding: '30px' }}>
  <h3 className="pixel-subtitle">Panel Title</h3>
  <p className="pixel-text">Panel content goes here</p>
</div>
```
**Features**: Decorative title bar, checkerboard background, 3D border

---

## 🎮 Buttons

### Standard Pixel Button
```tsx
<button className="pixel-button">
  START GAME
</button>
```

### Custom Styled Button
```tsx
<button className="pixel-button" style={{
  background: `
    repeating-linear-gradient(
      0deg,
      #A0055D 0px, #A0055D 2px,
      #C0076F 2px, #C0076F 4px
    )
  `
}}>
  BERRY BUTTON
</button>
```

---

## ✨ Effects & Animations

### Glowing Element
```tsx
<div className="pixel-glow pixel-glow-anim">
  <span className="pixel-text">✨ Special Item</span>
</div>
```

### Blinking Text
```tsx
<span className="pixel-text pixel-blink">⚡ CRITICAL</span>
```

### Bouncing Icon
```tsx
<div className="pixel-bounce">
  <span style={{ fontSize: '32px' }}>🏆</span>
</div>
```

### Pulsing Button
```tsx
<button className="pixel-button pixel-pulse">
  CLAIM REWARD
</button>
```

---

## 🔷 Hex Tiles with Custom Patterns

### Purple Faction Pattern
```tsx
<div style={{
  width: '60px',
  height: '60px',
  background: `
    repeating-linear-gradient(
      0deg,
      #836EF9 0px, #836EF9 3px,
      #9B8BF9 3px, #9B8BF9 6px
    ),
    repeating-linear-gradient(
      90deg,
      #836EF9 0px, #836EF9 3px,
      #7B5EE7 3px, #7B5EE7 6px
    )
  `,
  backgroundSize: '6px 6px',
  border: '3px solid #836EF9',
  boxShadow: 'inset 2px 2px 0 rgba(255, 255, 255, 0.2), 3px 3px 0 rgba(131, 110, 249, 0.5)',
  imageRendering: 'pixelated'
}}>
  <div className="pixel-text">M</div>
</div>
```

---

## 🎨 Color Usage Examples

### Monad Purple Theme
```tsx
<div style={{
  background: '#836EF9',
  border: '4px solid #FBFAF9',
  color: '#FBFAF9',
  padding: '16px',
  imageRendering: 'pixelated'
}}>
  <span className="pixel-text">Purple Element</span>
</div>
```

### Monad Berry Theme
```tsx
<div style={{
  background: '#A0055D',
  border: '4px solid #FBFAF9',
  color: '#FBFAF9',
  padding: '16px',
  imageRendering: 'pixelated'
}}>
  <span className="pixel-text">Berry Element</span>
</div>
```

### Monad Blue Dark Theme
```tsx
<div style={{
  background: '#200052',
  border: '4px solid #836EF9',
  color: '#FBFAF9',
  padding: '16px',
  imageRendering: 'pixelated'
}}>
  <span className="pixel-text">Deep Blue Element</span>
</div>
```

---

## 🪟 Modal/Dialog Example

```tsx
<div style={{
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: `
    repeating-linear-gradient(
      45deg,
      #200052 0px, #200052 4px,
      #0E100F 4px, #0E100F 8px
    )
  `,
  border: '4px solid',
  borderColor: '#FBFAF9 #836EF9 #836EF9 #FBFAF9',
  boxShadow: `
    inset 3px 3px 0 rgba(255, 255, 255, 0.2),
    inset -3px -3px 0 rgba(0, 0, 0, 0.4),
    8px 8px 0 rgba(0, 0, 0, 0.5)
  `,
  padding: '32px',
  imageRendering: 'pixelated'
}}>
  <h2 className="pixel-title" style={{ marginBottom: '20px' }}>
    GAME OVER
  </h2>
  <p className="pixel-text" style={{ marginBottom: '20px' }}>
    Final Score: 1000
  </p>
  <button className="pixel-button">
    CONTINUE
  </button>
</div>
```

---

## 📊 Stat Display

```tsx
<div className="pixel-panel" style={{ padding: '16px', width: '200px' }}>
  <div className="pixel-subtitle" style={{ marginBottom: '12px' }}>
    PLAYER STATS
  </div>
  
  <div style={{ marginBottom: '8px' }}>
    <span className="pixel-text">❤️ HP: </span>
    <span className="pixel-text" style={{ color: '#A0055D' }}>100</span>
  </div>
  
  <div style={{ marginBottom: '8px' }}>
    <span className="pixel-text">⚡ MP: </span>
    <span className="pixel-text" style={{ color: '#836EF9' }}>50</span>
  </div>
  
  <div>
    <span className="pixel-text">🏆 Score: </span>
    <span className="pixel-text" style={{ color: '#FFD700' }}>9999</span>
  </div>
</div>
```

---

## 🎯 Progress Bar (Pixel Style)

```tsx
<div style={{
  width: '200px',
  height: '20px',
  background: '#0E100F',
  border: '3px solid #836EF9',
  boxShadow: 'inset 2px 2px 0 rgba(0, 0, 0, 0.5)',
  position: 'relative',
  imageRendering: 'pixelated'
}}>
  {/* Progress fill */}
  <div style={{
    width: '60%',
    height: '100%',
    background: `
      repeating-linear-gradient(
        90deg,
        #836EF9 0px, #836EF9 4px,
        #9B8BF9 4px, #9B8BF9 8px
      )
    `,
    boxShadow: 'inset 2px 2px 0 rgba(255, 255, 255, 0.3)',
    imageRendering: 'pixelated'
  }}>
    <span className="pixel-text" style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#FBFAF9',
      textShadow: '1px 1px 0 #000'
    }}>
      60%
    </span>
  </div>
</div>
```

---

## 🎪 Badge/Label

```tsx
{/* Gold Badge */}
<span style={{
  display: 'inline-block',
  background: `
    repeating-linear-gradient(
      45deg,
      #FFD700 0px, #FFD700 2px,
      #FFA500 2px, #FFA500 4px
    )
  `,
  border: '3px solid',
  borderColor: '#FFF #CC8800 #CC8800 #FFF',
  color: '#000',
  padding: '8px 12px',
  fontFamily: "'Press Start 2P'",
  fontSize: '8px',
  boxShadow: `
    inset 2px 2px 0 rgba(255, 255, 255, 0.5),
    inset -2px -2px 0 rgba(0, 0, 0, 0.3),
    3px 3px 0 rgba(0, 0, 0, 0.5)
  `,
  imageRendering: 'pixelated'
}}>
  ⭐ WINNER
</span>
```

---

## 💬 Tooltip (Pixel Style)

```tsx
<div style={{
  position: 'absolute',
  background: '#200052',
  border: '3px solid #FBFAF9',
  padding: '12px',
  minWidth: '150px',
  boxShadow: `
    inset 2px 2px 0 rgba(255, 255, 255, 0.2),
    4px 4px 0 rgba(0, 0, 0, 0.5)
  `,
  imageRendering: 'pixelated',
  zIndex: 1000
}}>
  <div className="pixel-text" style={{ color: '#FFD700' }}>
    🛡️ SHIELD
  </div>
  <div className="pixel-text" style={{ marginTop: '8px', color: '#FBFAF9' }}>
    Protects from damage
  </div>
  <div className="pixel-text" style={{ marginTop: '4px', color: '#836EF9' }}>
    +50 Defense
  </div>
  
  {/* Arrow */}
  <div style={{
    position: 'absolute',
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #FBFAF9'
  }}/>
</div>
```

---

## 🎨 Styled Components Integration

### Creating Pixel-Perfect Components

```tsx
import styled from 'styled-components'

const PixelCard = styled.div`
  background: repeating-linear-gradient(
    45deg,
    #200052 0px, #200052 4px,
    #0E100F 4px, #0E100F 8px
  );
  border: 4px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  padding: 20px;
  box-shadow: 
    inset 3px 3px 0 rgba(255, 255, 255, 0.2),
    inset -3px -3px 0 rgba(0, 0, 0, 0.4),
    4px 4px 0 #836EF9,
    8px 8px 0 rgba(131, 110, 249, 0.3);
  image-rendering: pixelated;
  transition: none;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 
      inset 3px 3px 0 rgba(255, 255, 255, 0.3),
      inset -3px -3px 0 rgba(0, 0, 0, 0.5),
      6px 6px 0 #836EF9,
      10px 10px 0 rgba(131, 110, 249, 0.4);
  }
`

const PixelTitle = styled.h2`
  font-family: 'Press Start 2P', monospace;
  font-size: 14px;
  color: #FBFAF9;
  text-shadow: 
    2px 2px 0 #836EF9,
    4px 4px 0 #200052;
  margin-bottom: 16px;
  image-rendering: pixelated;
`

const PixelButton = styled.button`
  background: repeating-linear-gradient(
    0deg,
    #836EF9 0px, #836EF9 2px,
    #9B8BF9 2px, #9B8BF9 4px
  );
  border: 4px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  color: #FBFAF9;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  padding: 12px 20px;
  cursor: pointer;
  box-shadow: 
    inset 2px 2px 0 rgba(255, 255, 255, 0.3),
    inset -2px -2px 0 rgba(0, 0, 0, 0.3),
    4px 4px 0 #200052;
  transition: none;
  image-rendering: pixelated;
  
  &:hover {
    background: repeating-linear-gradient(
      0deg,
      #9B8BF9 0px, #9B8BF9 2px,
      #A0055D 2px, #A0055D 4px
    );
  }
  
  &:active {
    transform: translate(4px, 4px);
    box-shadow: 
      inset 2px 2px 0 rgba(0, 0, 0, 0.3),
      inset -2px -2px 0 rgba(255, 255, 255, 0.3);
  }
`

// Usage
<PixelCard>
  <PixelTitle>WELCOME</PixelTitle>
  <p className="pixel-text">Start your adventure!</p>
  <PixelButton>BEGIN</PixelButton>
</PixelCard>
```

---

## 🎯 Common Patterns

### 1. Icon + Text
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <span style={{ fontSize: '16px' }}>🏰</span>
  <span className="pixel-text">Territory Captured</span>
</div>
```

### 2. Stat Row
```tsx
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between',
  padding: '8px',
  background: 'rgba(131, 110, 249, 0.1)',
  border: '2px solid #836EF9'
}}>
  <span className="pixel-text">Wins</span>
  <span className="pixel-text" style={{ color: '#FFD700' }}>42</span>
</div>
```

### 3. Grid Layout
```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px'
}}>
  <button className="pixel-button">OPTION 1</button>
  <button className="pixel-button">OPTION 2</button>
  <button className="pixel-button">OPTION 3</button>
  <button className="pixel-button">OPTION 4</button>
</div>
```

---

## ⚠️ Important Notes

1. **Always include** `image-rendering: pixelated` on pixel art elements
2. **Never use** `transition` or smooth animations
3. **Use** multiples of 2-4px for sizes and spacing
4. **Avoid** border-radius (keep everything sharp)
5. **Test** in multiple browsers (rendering may vary)
6. **Use** Press Start 2P font for authentic retro feel
7. **Keep** color palette limited to Monad official colors

---

## 🚀 Quick Tips

- **Font Loading**: Ensure Press Start 2P loads before rendering
- **Performance**: Use `will-change: transform` for animated elements
- **Accessibility**: Ensure text remains readable at small sizes
- **Responsive**: Scale entire UI uniformly rather than individual elements
- **Z-Index**: Use layered shadows instead of high z-index values

---

**Happy Pixel Art Coding! 🎮✨**

