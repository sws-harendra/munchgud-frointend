🚀 MUNCHGUD ECOMMERCE — WORLD-CLASS REDESIGN MASTER PROMPT
> Paste this entire prompt into Cursor, v0, Lovable, or any AI coding tool.
---
PROJECT CONTEXT
You are redesigning MunchGud (munchgud.com) — a premium Indian makhana (fox nuts/lotus seeds) snack brand from Bihar. The brand sells roasted, healthy, flavoured makhana snacks (Peri Peri, Cream & Onion, and more). It is a Next.js ecommerce site. Modify existing code — do NOT rebuild from scratch.
Brand Identity
Colors: Deep forest green (`#1B4332`), warm orange (`#E07B2A`), off-white cream (`#FAF7F0`), golden yellow (`#F4C430`)
Tagline: "Munch Gud. Feel Gud."
Tone: Premium, healthy, earthy, modern Indian — like the love child of Nykaa and a Darjeeling tea brand
Products: Roasted Peri Peri Makhana, Cream & Onion Makhana (₹169 / 50g), sourced directly from Bihar farms
---
DESIGN PHILOSOPHY
Create a luxury organic ecommerce experience — think Aesop meets Indian street food. The design must feel:
Mobile-first (60%+ users are on mobile)
Cinematic — full-bleed visuals, bold typography, immersive sections
Earthy premium — not sterile SaaS, not garish FMCG. Think hand-crafted, farm-to-table luxury
Conversion-first — every section should guide users toward buying
---
TYPOGRAPHY
Use Google Fonts (import in `_document.tsx` or `layout.tsx`):
Display / Hero headlines: `Playfair Display` (serif, bold, elegant)
Sub-headings: `DM Serif Display` or `Cormorant Garamond`
Body / UI text: `DM Sans` (clean, modern, readable)
Accent labels: `Space Mono` (for tags, badges, prices)
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&family=Space+Mono:wght@400;700&display=swap');
```
---
COLOR SYSTEM (Tailwind + CSS Variables)
Add to `globals.css`:
```css
:root {
  --color-forest:    #1B4332;
  --color-forest-light: #2D6A4F;
  --color-orange:    #E07B2A;
  --color-orange-light: #F4A45A;
  --color-cream:     #FAF7F0;
  --color-cream-dark: #F0EAD6;
  --color-gold:      #F4C430;
  --color-charcoal:  #1A1A1A;
  --color-muted:     #6B7280;
}
```
Add to `tailwind.config.js`:
```js
colors: {
  forest: '#1B4332',
  'forest-light': '#2D6A4F',
  orange: '#E07B2A',
  'orange-light': '#F4A45A',
  cream: '#FAF7F0',
  'cream-dark': '#F0EAD6',
  gold: '#F4C430',
}
```
---
GLOBAL STYLES (`globals.css`)
```css
* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  font-family: 'DM Sans', sans-serif;
}

body {
  background-color: var(--color-cream);
  color: var(--color-charcoal);
  overflow-x: hidden;
}

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* Grain texture overlay for earthy feel */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}

/* Smooth fade-in animation */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.animate-fade-up {
  animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-cream-dark); }
::-webkit-scrollbar-thumb { background: var(--color-forest); border-radius: 3px; }
```
---
COMPONENT REDESIGNS
1. ANNOUNCEMENT BAR (Top)
```tsx
// components/AnnouncementBar.tsx
export default function AnnouncementBar() {
  return (
    <div className="bg-forest text-cream-dark text-xs md:text-sm py-2.5 px-4 text-center font-['DM_Sans'] tracking-wide">
      <span className="animate-pulse mr-2">🌿</span>
      Free Shipping on All Orders · No COD Charges on Prepaid
      <span className="animate-pulse ml-2">🌿</span>
    </div>
  )
}
```
---
2. NAVBAR
```tsx
// components/Navbar.tsx
// Sticky, glassmorphism on scroll, mobile hamburger menu

"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-cream/90 backdrop-blur-md shadow-md py-3'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="MunchGud" width={140} height={40} className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-['DM_Sans'] font-medium text-forest">
          <Link href="/products" className="hover:text-orange transition-colors">Shop</Link>
          <Link href="/aboutus" className="hover:text-orange transition-colors">About</Link>
          <Link href="/contactus" className="hover:text-orange transition-colors">Contact</Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-forest text-cream hover:bg-orange transition-colors">
              🛒
            </div>
          </Link>
          <Link href="/authentication/login" className="hidden md:block bg-orange text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-light transition-all hover:shadow-lg hover:-translate-y-0.5">
            Login
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5"
          >
            <span className={`block h-0.5 w-6 bg-forest transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-forest transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-forest transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-cream/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 font-['DM_Sans'] text-forest font-medium border-t border-cream-dark">
          <Link href="/products" onClick={() => setMenuOpen(false)}>🌾 Shop All</Link>
          <Link href="/aboutus" onClick={() => setMenuOpen(false)}>🌿 About Us</Link>
          <Link href="/contactus" onClick={() => setMenuOpen(false)}>📞 Contact</Link>
          <Link href="/authentication/login" className="bg-orange text-white text-center py-2.5 rounded-full" onClick={() => setMenuOpen(false)}>Login</Link>
        </div>
      </div>
    </nav>
  )
}
```
---
3. HERO SECTION (Homepage)
```tsx
// components/HeroSection.tsx
// Full-screen cinematic hero with animated text and floating product image

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-forest overflow-hidden flex items-center">
      
      {/* Background pattern - lotus motif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gold blur-3xl" />
      </div>

      {/* Diagonal green-to-cream split at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-cream" style={{clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text */}
        <div className="text-cream animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 rounded-full px-4 py-1.5 text-orange text-sm font-['Space_Mono'] mb-6">
            🌾 Direct from Bihar Farms
          </div>
          <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-black leading-tight mb-6">
            Snack<br />
            <span className="text-gold italic">Guilt-Free.</span><br />
            Feel Gud.
          </h1>
          <p className="text-cream/70 text-lg md:text-xl font-['DM_Sans'] font-light max-w-md mb-10 leading-relaxed">
            Premium roasted makhana — packed with protein, gluten-free, and bursting with bold flavours. The snack that loves you back. 🌿
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/products" className="bg-orange text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Shop Now →
            </a>
            <a href="/aboutus" className="border-2 border-cream/40 text-cream px-8 py-4 rounded-full font-semibold text-lg hover:border-cream hover:bg-cream/10 transition-all duration-300">
              Our Story
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-12">
            {['🔥 Non-Fried', '💪 Protein Rich', '✅ Gluten Free', '🌾 Natural'].map(b => (
              <span key={b} className="text-sm text-cream/60 font-['DM_Sans']">{b}</span>
            ))}
          </div>
        </div>

        {/* Right: Product image with floating elements */}
        <div className="relative flex justify-center">
          <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
            {/* Glowing circle behind product */}
            <div className="absolute inset-0 rounded-full bg-orange/20 blur-2xl scale-110" />
            <img
              src="/peri_peri.png"
              alt="MunchGud Makhana"
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            />
          </div>
          {/* Floating badge */}
          <div className="absolute top-8 -right-4 md:right-0 bg-gold text-forest rounded-2xl p-3 shadow-xl font-['Space_Mono'] text-center rotate-6 animate-bounce">
            <div className="text-2xl font-black">₹169</div>
            <div className="text-xs font-bold">/ 50g Pack</div>
          </div>
          <div className="absolute bottom-12 -left-4 bg-cream text-forest rounded-2xl px-4 py-2 shadow-xl font-['DM_Sans'] text-sm font-semibold -rotate-3">
            500K+ Happy Snackers 🎉
          </div>
        </div>
      </div>
    </section>
  )
}

// Add to globals.css:
// @keyframes float {
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-16px); }
// }
```
---
4. FLAVOR CARDS (Product Section)
```tsx
// components/FlavorSection.tsx
const flavors = [
  {
    name: 'Peri Peri Spicy Blast',
    tagline: 'Bold. Spicy. Irresistible.',
    description: 'Premium fox nuts roasted to perfection and tossed in bold peri peri spices for a spicy, tangy hit.',
    price: '₹169',
    weight: '50g',
    emoji: '🌶️',
    bgColor: 'bg-gradient-to-br from-orange to-[#C0392B]',
    textColor: 'text-white',
    href: '/products?category=3',
    img: '/peri_peri.png',
  },
  {
    name: 'Cream & Onion',
    tagline: 'Smooth. Savory. Addictive.',
    description: 'Lightly roasted fox nuts coated with rich cream and onion seasoning for an irresistible crunch.',
    price: '₹169',
    weight: '50g',
    emoji: '🧅',
    bgColor: 'bg-gradient-to-br from-forest to-forest-light',
    textColor: 'text-cream',
    href: '/products?category=2',
    img: '/cream_onion.png',
  },
]

export default function FlavorSection() {
  return (
    <section className="bg-cream py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-orange font-['Space_Mono'] text-sm tracking-widest uppercase">Choose Your Flavour</span>
          <h2 className="text-4xl md:text-6xl font-['Playfair_Display'] font-black text-forest mt-3">
            Wholesome. Bold.<br />
            <span className="italic text-orange">Always Roasted.</span>
          </h2>
          <p className="text-muted mt-4 max-w-xl mx-auto font-['DM_Sans'] text-lg">
            Every pack is roasted in olive oil — never fried. Real ingredients, real flavour, zero guilt.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {flavors.map((flavor) => (
            <div key={flavor.name} className={`group relative ${flavor.bgColor} rounded-3xl overflow-hidden p-8 md:p-10 cursor-pointer hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl`}>
              
              {/* Product Image */}
              <img
                src={flavor.img}
                alt={flavor.name}
                className="absolute right-0 bottom-0 w-48 md:w-64 object-contain opacity-90 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500"
              />

              {/* Content */}
              <div className={`relative z-10 max-w-[60%] ${flavor.textColor}`}>
                <span className="text-4xl mb-4 block">{flavor.emoji}</span>
                <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold leading-tight mb-2">{flavor.name}</h3>
                <p className="font-['Space_Mono'] text-sm opacity-70 mb-4">{flavor.tagline}</p>
                <p className="font-['DM_Sans'] text-sm opacity-80 mb-8 leading-relaxed">{flavor.description}</p>
                
                <div className="flex items-end gap-4">
                  <div>
                    <div className="font-['Space_Mono'] text-3xl font-bold">{flavor.price}</div>
                    <div className="text-xs opacity-60 font-['DM_Sans']">{flavor.weight} pack</div>
                  </div>
                  <a
                    href={flavor.href}
                    className="ml-auto bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold font-['DM_Sans'] transition-all hover:shadow-lg"
                  >
                    Shop Now →
                  </a>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-6 right-6 bg-gold text-forest text-xs font-['Space_Mono'] font-bold px-3 py-1 rounded-full">
                ROASTED NOT FRIED
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```
---
5. WHY MUNCHGUD — Features Strip
```tsx
// components/FeaturesStrip.tsx
const features = [
  { icon: '🌾', title: 'Direct from Farms', desc: 'Sourced from Bihar's finest makhana farms' },
  { icon: '🔥', title: 'Roasted Not Fried', desc: 'Olive oil roasted, never deep-fried' },
  { icon: '💪', title: 'Protein Rich', desc: 'High protein, gluten-free superfood' },
  { icon: '🚚', title: 'Free Shipping', desc: 'Pan-India delivery on all orders' },
]

export default function FeaturesStrip() {
  return (
    <section className="bg-forest py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="text-center group">
            <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 inline-block">{f.icon}</div>
            <h4 className="font-['DM_Sans'] font-bold text-gold text-sm md:text-base mb-1">{f.title}</h4>
            <p className="font-['DM_Sans'] text-cream/60 text-xs md:text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```
---
6. ABOUT SECTION
```tsx
// components/AboutSection.tsx
export default function AboutSection() {
  return (
    <section className="bg-cream-dark py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Image collage */}
        <div className="relative h-[480px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img src="/peri_peri.png" alt="Makhana field" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-gold text-forest rounded-2xl px-6 py-4 shadow-2xl font-['Space_Mono']">
            <div className="text-3xl font-black">500K+</div>
            <div className="text-xs font-bold mt-0.5">Happy Buyers</div>
          </div>
          <div className="absolute top-6 left-6 bg-cream text-forest rounded-xl px-4 py-3 font-['DM_Sans'] text-sm font-semibold shadow-lg">
            🌾 Bihar's Finest Makhana
          </div>
        </div>

        {/* Text */}
        <div>
          <span className="text-orange font-['Space_Mono'] text-sm tracking-widest uppercase">Our Story</span>
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-black text-forest mt-3 mb-6 leading-tight">
            Born in Bihar,<br />
            <span className="italic text-orange">Made for India.</span>
          </h2>
          <p className="font-['DM_Sans'] text-charcoal/70 text-lg leading-relaxed mb-6">
            At MunchGud™, we believe snacking should be both delicious and healthy. We source premium makhana directly from Bihar's farms — roasting each batch to perfection and coating with unique, bold flavours.
          </p>
          <p className="font-['DM_Sans'] text-charcoal/60 leading-relaxed mb-8">
            Makhana has been part of the Indian diet for centuries — naturally light, high in protein, gluten-free, and crunchy. We're bringing it into your everyday snacking routine.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {['Non-Fried ✓', 'Gluten Free ✓', 'High Protein ✓', 'No Preservatives ✓'].map(t => (
              <span key={t} className="bg-forest/10 text-forest rounded-full px-4 py-1.5 text-sm font-['DM_Sans'] font-medium">{t}</span>
            ))}
          </div>
          <a href="/aboutus" className="inline-block bg-forest text-cream px-8 py-4 rounded-full font-['DM_Sans'] font-semibold hover:bg-forest-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            Read Our Story →
          </a>
        </div>
      </div>
    </section>
  )
}
```
---
7. TESTIMONIALS SECTION
```tsx
// components/Testimonials.tsx
const reviews = [
  { name: 'Priya S.', city: 'Mumbai', rating: 5, text: 'These are genuinely addictive. Peri peri flavour is next level and I love that it\'s not fried. Finally a snack I don\'t feel guilty about!' },
  { name: 'Rahul M.', city: 'Delhi', rating: 5, text: 'Ordered for my kids who are junk food addicts. They love the Cream & Onion and I love that it\'s healthy. Win win!' },
  { name: 'Ananya K.', city: 'Bangalore', rating: 5, text: 'Been snacking on these at work. Protein-rich, light, and satisfying. The packaging is beautiful too. Worth every rupee.' },
]

export default function Testimonials() {
  return (
    <section className="bg-forest py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-orange font-['Space_Mono'] text-sm tracking-widest uppercase">Reviews</span>
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-black text-cream mt-3">
            500K+ Snackers <span className="italic text-gold">Love Us</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-cream/10 backdrop-blur border border-cream/10 rounded-2xl p-6 hover:bg-cream/15 transition-all duration-300">
              <div className="flex mb-4">
                {'★★★★★'.split('').map((s, j) => (
                  <span key={j} className="text-gold text-lg">{s}</span>
                ))}
              </div>
              <p className="font-['DM_Sans'] text-cream/80 leading-relaxed mb-6 italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange/30 flex items-center justify-center text-orange font-bold font-['DM_Sans']">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-['DM_Sans'] font-semibold text-cream text-sm">{r.name}</div>
                  <div className="font-['DM_Sans'] text-cream/50 text-xs">{r.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```
---
8. FOOTER
```tsx
// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand */}
        <div className="md:col-span-2">
          <img src="/logo.png" alt="MunchGud" className="h-10 w-auto mb-4 brightness-0 invert" />
          <p className="font-['DM_Sans'] text-cream/60 text-sm leading-relaxed max-w-sm mb-6">
            Premium roasted makhana packed with bold flavors and irresistible crunch. Munch Gud. Feel Gud.
          </p>
          <div className="flex gap-3">
            {['Instagram', 'Facebook', 'Twitter'].map(s => (
              <a key={s} href="#" className="w-10 h-10 rounded-full bg-cream/10 hover:bg-orange transition-colors flex items-center justify-center text-xs font-['Space_Mono']">
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-['DM_Sans'] font-bold text-gold mb-4 text-sm tracking-wider uppercase">Shop</h4>
          <ul className="space-y-2 font-['DM_Sans'] text-cream/60 text-sm">
            <li><a href="/products" className="hover:text-orange transition-colors">All Products</a></li>
            <li><a href="/products?category=3" className="hover:text-orange transition-colors">Peri Peri Makhana</a></li>
            <li><a href="/products?category=2" className="hover:text-orange transition-colors">Cream & Onion</a></li>
            <li><a href="#" className="hover:text-orange transition-colors">Combo Packs</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-['DM_Sans'] font-bold text-gold mb-4 text-sm tracking-wider uppercase">Company</h4>
          <ul className="space-y-2 font-['DM_Sans'] text-cream/60 text-sm">
            <li><a href="/aboutus" className="hover:text-orange transition-colors">About Us</a></li>
            <li><a href="/contactus" className="hover:text-orange transition-colors">Contact</a></li>
            <li><a href="/refund-policy" className="hover:text-orange transition-colors">Refund Policy</a></li>
            <li><a href="/privacy-policy" className="hover:text-orange transition-colors">Privacy Policy</a></li>
            <li><a href="/terms&conditions" className="hover:text-orange transition-colors">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-['DM_Sans'] text-cream/40 text-xs">© 2026 MunchGud™. All rights reserved.</p>
        <div className="font-['DM_Sans'] text-cream/40 text-xs flex gap-4">
          <span>📧 munchgud@gmail.com</span>
          <span>📞 +91 84462 74791</span>
        </div>
      </div>
    </footer>
  )
}
```
---
9. PRODUCT CARD (for /products page)
```tsx
// components/ProductCard.tsx
interface Props {
  name: string
  price: number
  image: string
  category: string
  href: string
}

export default function ProductCard({ name, price, image, category, href }: Props) {
  return (
    <div className="group bg-cream rounded-2xl overflow-hidden border border-cream-dark hover:border-orange/30 hover:shadow-xl transition-all duration-400 hover:-translate-y-1">
      
      {/* Image */}
      <div className="relative bg-cream-dark h-56 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-forest text-cream text-xs font-['Space_Mono'] px-3 py-1 rounded-full">
          ROASTED
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-orange text-xs font-['Space_Mono'] tracking-wide uppercase mb-1">{category}</p>
        <h3 className="font-['Playfair_Display'] font-bold text-forest text-lg mb-3">{name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-['Space_Mono'] text-2xl font-bold text-charcoal">₹{price}</span>
            <span className="text-muted text-xs font-['DM_Sans'] ml-1">/ 50g</span>
          </div>
          <a href={href} className="bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-['DM_Sans'] font-semibold hover:bg-orange transition-colors duration-300">
            Add to Cart
          </a>
        </div>
      </div>
    </div>
  )
}
```
---
10. SCROLL REVEAL WRAPPER
```tsx
// components/ScrollReveal.tsx
"use client"
import { useEffect, useRef, ReactNode } from 'react'

export default function ScrollReveal({ children, delay = 0 }: { children: ReactNode, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-8')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
```
---
HOMEPAGE ASSEMBLY (`app/page.tsx`)
```tsx
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesStrip from '@/components/FeaturesStrip'
import FlavorSection from '@/components/FlavorSection'
import AboutSection from '@/components/AboutSection'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <FeaturesStrip />
      <ScrollReveal><FlavorSection /></ScrollReveal>
      <ScrollReveal delay={100}><AboutSection /></ScrollReveal>
      <ScrollReveal delay={200}><Testimonials /></ScrollReveal>
      <Footer />
    </main>
  )
}
```
---
ADDITIONAL CSS ANIMATIONS (add to `globals.css`)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-16px); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.shimmer-text {
  background: linear-gradient(90deg, #1B4332, #E07B2A, #F4C430, #1B4332);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
```
---
QUICK WINS CHECKLIST
Apply these immediately across all pages:
[ ] Replace all `font-sans` with `font-['DM_Sans']`
[ ] Replace all generic buttons with rounded-full pill buttons
[ ] Add `transition-all duration-300` to all interactive elements
[ ] Replace plain `<img>` with Next.js `<Image>` for performance
[ ] Add `hover:-translate-y-1` to all cards
[ ] Set page background to `bg-cream` (`#FAF7F0`) instead of white
[ ] Make all headings use `font-['Playfair_Display']`
[ ] Add `scroll-behavior: smooth` to `html`
[ ] Add loading skeleton shimmer to product fetches
---
DEPENDENCIES TO INSTALL
```bash
npm install framer-motion lucide-react
# Optional for extra animations:
npm install @headlessui/react
```
---
Brand: MunchGud™ | Stack: Next.js + Tailwind CSS | Style: Luxury Organic Indian Ecommerce