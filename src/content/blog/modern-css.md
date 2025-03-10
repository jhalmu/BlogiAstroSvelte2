---
title: "Modern CSS Techniques"
date: "2023-12-18"
author: "Juha Halmu"
excerpt: "Discover the latest CSS features and techniques for modern web design"
tags: ["CSS", "Web Design", "Frontend"]
image:
  src: "/images/blog/modern-css.jpg"
  alt: "Modern CSS styling demonstration"
---

CSS has evolved significantly over the years. Let's explore some modern techniques that make styling websites easier and more powerful.

## CSS Grid and Flexbox

Modern CSS layout systems have revolutionized how we structure web pages.

### Flexbox

Perfect for one-dimensional layouts:

```css
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

### CSS Grid

Ideal for two-dimensional layouts:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}
```

## Custom Properties (CSS Variables)

CSS variables make our styles more maintainable:

```css
:root {
    --primary-color: #6b46c1;
    --spacing-unit: 1rem;
}

.button {
    background: var(--primary-color);
    padding: var(--spacing-unit);
}
```

## Modern Selectors

CSS4 selectors provide powerful ways to target elements:

```css
/* Target elements that contain specific text */
p:has(> strong) {
    font-weight: 500;
}

/* Style based on parent state */
.card:hover > img {
    transform: scale(1.1);
}
```

Remember to always consider browser support when using modern features!
