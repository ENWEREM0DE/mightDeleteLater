# WMNM Platform - Styling Guide

Quick reference guide for using the new styling system throughout the application.

---

## 🎨 Color System

### Gradient Classes
```html
<!-- Primary gradient (blue) -->
<div className="gradient-primary">...</div>

<!-- Accent gradient (yellow) -->
<div className="gradient-accent">...</div>

<!-- Success gradient (green) -->
<div className="gradient-success">...</div>

<!-- Hero gradient (multi-color) -->
<div className="gradient-hero">...</div>

<!-- Card gradient (subtle white) -->
<div className="gradient-card">...</div>

<!-- Text gradient -->
<h1 className="text-gradient">Brand Text</h1>
```

### Category Colors
```html
<!-- Apply category class to element -->
<div className="category-plumbing">
  <div style={{ backgroundColor: "var(--category-bg)" }}>
    <Icon style={{ color: "var(--category-color)" }} />
  </div>
</div>

<!-- Available categories: -->
<!-- .category-plumbing (blue) -->
<!-- .category-electrical (yellow/amber) -->
<!-- .category-cleaning (green) -->
<!-- .category-moving (purple) -->
```

---

## ✨ Animation Classes

### Entrance Animations
```html
<!-- Fade in from bottom -->
<div className="animate-fadeIn">...</div>

<!-- Slide in from left -->
<div className="animate-slideInLeft">...</div>

<!-- Slide in from right -->
<div className="animate-slideInRight">...</div>

<!-- Slide in from top -->
<div className="animate-slideInDown">...</div>

<!-- Scale in -->
<div className="animate-scaleIn">...</div>

<!-- Float animation (continuous) -->
<div className="animate-float">...</div>

<!-- Pulse glow (continuous) -->
<div className="animate-pulse-glow">...</div>
```

### Staggered List Animations
```html
<!-- Parent container -->
<div className="stagger-fadeIn">
  <!-- Children will fade in with delay -->
  <div>Item 1</div> <!-- 0.1s delay -->
  <div>Item 2</div> <!-- 0.2s delay -->
  <div>Item 3</div> <!-- 0.3s delay -->
  <!-- ... up to 6 items with automatic delays -->
</div>

<!-- For more control, use inline style: -->
<div style={{ animationDelay: `${index * 0.1}s` }} className="animate-fadeIn">
  Item
</div>
```

---

## 🃏 Card Styles

### Basic Card with Hover
```html
<Card className="card-hover border-2">
  <CardContent>
    <!-- Content here -->
  </CardContent>
</Card>
```

### Card with Gradient
```html
<!-- Primary gradient card -->
<Card className="gradient-primary border-2 shadow-glow">
  <CardContent>
    <!-- White text recommended -->
  </CardContent>
</Card>

<!-- Subtle gradient card -->
<Card className="gradient-card border-2">
  <CardContent>
    <!-- Regular text color -->
  </CardContent>
</Card>
```

---

## 🔘 Button Styles

### Gradient Buttons
```html
<!-- Primary gradient button -->
<Button className="gradient-primary text-white btn-scale shadow-lg">
  Click Me
</Button>

<!-- Accent gradient button -->
<Button className="gradient-accent text-accent-foreground btn-scale shadow-lg">
  Click Me
</Button>
```

### Button with Hover Lift
```html
<Button className="hover-lift border-2">
  Lift on Hover
</Button>
```

### Icon Button with Scale
```html
<Button className="btn-scale gap-2">
  <Icon className="w-4 h-4" />
  Button Text
</Button>
```

---

## 📝 Form Elements

### Enhanced Input
```html
<div className="space-y-3">
  <Label htmlFor="input" className="text-base font-medium">
    Label Text
  </Label>
  <Input
    id="input"
    className="h-12 border-2 focus:border-primary transition-all"
    placeholder="Enter text..."
  />
</div>
```

### Form Layout
```html
<form className="space-y-6">
  <!-- Each field -->
  <div className="space-y-3">
    <Label>...</Label>
    <Input>...</Input>
  </div>
  
  <!-- Submit button -->
  <Button 
    type="submit"
    className="w-full h-12 gradient-primary text-white btn-scale shadow-lg text-lg font-semibold"
  >
    Submit
  </Button>
</form>
```

---

## 🎯 Glass Morphism

### Glass Effect
```html
<!-- Light glass -->
<div className="glass rounded-xl p-4">
  Content with blur
</div>

<!-- Dark glass (for dark mode) -->
<div className="glass-dark rounded-xl p-4">
  Content with blur
</div>
```

### Header with Glass
```html
<header className="glass shadow-sm">
  Header content
</header>
```

---

## 💫 Shadow Effects

### Shadow with Glow
```html
<!-- Primary glow -->
<div className="shadow-glow">...</div>

<!-- Accent glow -->
<div className="shadow-glow-accent">...</div>

<!-- Combined with gradient -->
<Card className="gradient-primary shadow-glow">
  ...
</Card>
```

---

## 📱 Responsive Utilities

### Hide/Show on Different Screens
```html
<!-- Hidden on mobile, visible on sm+ -->
<span className="hidden sm:inline">Desktop Text</span>

<!-- Visible on mobile, hidden on sm+ -->
<span className="sm:hidden">Mobile Text</span>

<!-- Grid responsive -->
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <!-- Adapts: 1 col mobile, 2 cols tablet, 3 cols desktop -->
</div>
```

---

## 🎭 Common Patterns

### Page Header
```html
<div className="animate-fadeIn">
  <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
    Page Title 👋
  </h1>
  <p className="text-lg text-muted-foreground">
    Description text
  </p>
</div>
```

### Stat Card
```html
<Card className="border-2 card-hover gradient-success">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white/80">Label</p>
        <p className="text-3xl font-bold text-white mt-1">$1,234</p>
        <p className="text-xs text-white/90 flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3" />
          Subtext
        </p>
      </div>
      <div className="bg-white/20 p-4 rounded-2xl">
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Professional List Item
```html
<Card className="border-2 card-hover cursor-pointer group">
  <CardContent className="p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
          Title
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">4.8</span>
          </div>
        </div>
      </div>
      <Button className="gradient-primary text-white btn-scale">
        Action
      </Button>
    </div>
  </CardContent>
</Card>
```

### User Badge in Header
```html
<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
  <span className="text-sm font-medium">{userName}</span>
</div>
```

### Quick Action Bar
```html
<Card className="border-2 gradient-primary shadow-glow">
  <CardContent className="p-4">
    <div className="flex items-center gap-4">
      <h3 className="font-bold text-white text-lg">⚡ Section Title</h3>
      <div className="flex-1 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" className="gap-2 btn-scale">
          <Icon className="w-4 h-4" />
          Action 1
        </Button>
        <Button variant="secondary" size="sm" className="gap-2 btn-scale">
          <Icon className="w-4 h-4" />
          Action 2
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

### Category Card
```html
<Card className={`card-hover category-plumbing border-2 hover:border-[var(--category-color)] transition-colors`}>
  <CardContent className="p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div 
        className="rounded-2xl p-4 group-hover:scale-110 transition-transform shadow-md" 
        style={{ backgroundColor: "var(--category-bg)" }}
      >
        <Icon className="w-10 h-10" style={{ color: "var(--category-color)" }} />
      </div>
      <Badge variant="secondary" className="animate-pulse-glow">
        Popular
      </Badge>
    </div>
    <div>
      <h3 className="text-xl font-bold group-hover:text-[var(--category-color)] transition-colors">
        Service Name
      </h3>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
  </CardContent>
</Card>
```

---

## 🚀 Performance Tips

### Optimal Animation Usage
```html
<!-- ✅ Good: Animate on mount -->
<div className="animate-fadeIn">Content</div>

<!-- ✅ Good: Stagger children -->
<div className="stagger-fadeIn">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- ⚠️ Avoid: Too many concurrent animations -->
<!-- Keep animations to 6-10 elements at once -->
```

### Gradient Performance
```html
<!-- ✅ Good: Use gradient classes -->
<div className="gradient-primary">...</div>

<!-- ⚠️ Avoid: Inline gradient styles -->
<!-- Can impact performance with many elements -->
```

---

## 🎨 Color Values Reference

```css
Primary: oklch(0.28 0.08 240) /* Dark blue */
Accent: oklch(0.88 0.18 95)  /* Yellow */
Success: oklch(0.65 0.15 145) /* Green */

Category Colors:
- Plumbing: oklch(0.55 0.15 230) /* Blue */
- Electrical: oklch(0.75 0.15 85) /* Yellow */
- Cleaning: oklch(0.65 0.15 145) /* Green */
- Moving: oklch(0.55 0.15 280) /* Purple */
```

---

## 🔧 Customization

### Adding New Animation Delays
```html
<!-- For items beyond the 6 default stagger items -->
<div 
  className="animate-fadeIn" 
  style={{ animationDelay: '0.7s' }}
>
  Item 7
</div>
```

### Custom Category Color
```css
/* In globals.css */
.category-custom {
  --category-color: oklch(0.65 0.15 300);
  --category-bg: oklch(0.65 0.15 300 / 0.1);
}
```

### Adjusting Animation Speed
```html
<!-- Override animation duration -->
<div 
  className="animate-fadeIn" 
  style={{ animationDuration: '0.3s' }}
>
  Faster animation
</div>
```

---

## 📚 Best Practices

1. **Always use gradient classes** instead of inline styles for consistency
2. **Combine animations** - Use both entrance and hover animations
3. **Stagger wisely** - Don't stagger more than 10 items
4. **Match gradients to purpose** - Primary for main CTAs, accent for secondary
5. **Add hover states** - Use `card-hover`, `btn-scale`, or `hover-lift`
6. **Use proper spacing** - `space-y-6` for forms, `space-y-4` for lists
7. **Icon sizing** - Use w-4 h-4 for buttons, w-8 h-8 for feature cards
8. **Glass morphism sparingly** - Best for overlays and headers
9. **Responsive text** - Use `text-4xl md:text-5xl` for titles
10. **Test animations** - Ensure they don't impact perceived performance

---

## 🎯 Quick Checklist for New Pages

- [ ] Page container has gradient background
- [ ] Header section has `animate-fadeIn`
- [ ] Lists use `stagger-fadeIn` on container
- [ ] Cards have `card-hover` class
- [ ] Buttons use gradient classes or `btn-scale`
- [ ] Forms have enhanced input styling
- [ ] Icons are properly sized
- [ ] Responsive utilities applied
- [ ] Proper spacing between sections
- [ ] Text hierarchy is clear (gradient on h1, proper sizes)

---

This guide provides all the essential patterns and utilities to maintain consistent, beautiful styling throughout the WMNM platform!

