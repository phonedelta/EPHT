// Builds the vector version of the official EPHT logo from the geometry measured
// on the aspect-corrected raster (units: source pixels, logo height = 127).
import { writeFileSync } from 'node:fs'

const outDir = process.argv[2]
const f = (n) => Number(n.toFixed(2))

// --- measured geometry ------------------------------------------------------
// The crescent is the outer disc minus an identical disc shifted down-right.
const outer = { x: 88.75, y: 73.25, r: 65.45 }
const inner = { x: 96.47, y: 86.55, r: 65.45 }
const dot = { x: 49.24, y: 14.82, r: 9.0, halo: 11.2 }
const lines = { x1: 5.3, x2: 40.7, y1: 61.6, y2: 89.5, count: 14, width: 1.0 }
const cap = { top: 70.5, bottom: 89.9, bar: 3.2, stem: 4.0, midTop: 78.6, midBottom: 81.8 }

function intersections(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy)
  const k = (a.r ** 2 - b.r ** 2 + d ** 2) / (2 * d)
  const h = Math.sqrt(a.r ** 2 - k ** 2)
  const mx = a.x + (k * dx) / d, my = a.y + (k * dy) / d
  return [
    { x: mx + (h * dy) / d, y: my - (h * dx) / d },
    { x: mx - (h * dy) / d, y: my + (h * dx) / d },
  ]
}
const [p, q] = intersections(outer, inner)
const tail = p.y > q.y ? p : q
const tip = p.y > q.y ? q : p
const crescent = `M${f(tail.x)} ${f(tail.y)}A${outer.r} ${outer.r} 0 1 1 ${f(tip.x)} ${f(tip.y)}A${inner.r} ${inner.r} 0 0 0 ${f(tail.x)} ${f(tail.y)}Z`

// --- wordmark ---------------------------------------------------------------
const { top: T, bottom: B, bar, stem, midTop: M1, midBottom: M2 } = cap
const E = (() => {
  const x0 = 50.8, x1 = 70.3, r = 2.2
  return `M${f(x0 + r)} ${T}H${x1}V${f(T + bar)}H${f(x0 + stem)}V${M1}H${x1}V${M2}H${f(x0 + stem)}V${f(B - bar)}H${x1}V${B}H${f(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${f(B - r)}V${f(T + r)}A${r} ${r} 0 0 1 ${f(x0 + r)} ${T}Z`
})()
const P = (() => {
  const x0 = 75.8, x1 = 95.2, R = 2.9, ri = 0.7, ix1 = x1 - stem
  const outerPath = `M${x0} ${T}H${f(x1 - R)}A${R} ${R} 0 0 1 ${x1} ${f(T + R)}V${f(M2 - R)}A${R} ${R} 0 0 1 ${f(x1 - R)} ${M2}H${f(x0 + stem)}V${B}H${x0}Z`
  const hole = `M${f(x0 + stem)} ${f(T + bar)}V${M1}H${f(ix1 - ri)}A${ri} ${ri} 0 0 0 ${f(ix1)} ${f(M1 - ri)}V${f(T + bar + ri)}A${ri} ${ri} 0 0 0 ${f(ix1 - ri)} ${f(T + bar)}Z`
  return outerPath + hole
})()
const H = (() => {
  const x0 = 101.4, x1 = 121.0
  return `M${x0} ${T}H${f(x0 + stem)}V${M1}H${f(x1 - stem)}V${T}H${x1}V${B}H${f(x1 - stem)}V${M2}H${f(x0 + stem)}V${B}H${x0}Z`
})()
const Tt = (() => {
  const x0 = 126.8, x1 = 146.6, c = (x0 + x1) / 2
  return `M${x0} ${T}H${x1}V${f(T + bar)}H${f(c + stem / 2)}V${B}H${f(c - stem / 2)}V${f(T + bar)}H${x0}Z`
})()
const wordmark = [E, P, H, Tt].join('')

// --- striped block behind the crescent --------------------------------------
const pitch = (lines.y2 - lines.y1) / (lines.count - 1)
const stripes = Array.from({ length: lines.count }, (_, i) => `M${lines.x1} ${f(lines.y1 + i * pitch)}H${lines.x2}`).join('')

const gradient = { x1: 34, y1: 112, x2: 122, y2: 6, stops: [[0, '#5AAEC4'], [0.32, '#7CC1D4'], [0.62, '#9DD6E4'], [1, '#B8E3EE']] }
const palette = {
  positive: { ink: '#0E1216', stripeTop: '#DDE0E1', stripeBottom: '#A9AEB1' },
  negative: { ink: '#FFFFFF', stripeTop: '#3A4A52', stripeBottom: '#7E9099' },
}
const viewBox = '3.5 4 147.5 110.5'
const iconBox = '16.3 -9.4 139 139'

writeFileSync(`${outDir}/geometry.json`, JSON.stringify({
  viewBox, iconBox, crescent, wordmark, stripes, dot, lines, gradient, palette,
  tail: { x: f(tail.x), y: f(tail.y) }, tip: { x: f(tip.x), y: f(tip.y) },
}, null, 2))

function svg(colors, { box = viewBox, withWordmark = true, title = 'EPHT', style = '', dotClass = '' } = {}) {
  const [, , w, h] = box.split(' ').map(Number)
  const stops = gradient.stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" width="${f(w * 4)}" height="${f(h * 4)}" role="img" aria-label="${title}"><title>${title}</title>${style}<defs>` +
    `<linearGradient id="c" gradientUnits="userSpaceOnUse" x1="${gradient.x1}" y1="${gradient.y1}" x2="${gradient.x2}" y2="${gradient.y2}">${stops}</linearGradient>` +
    `<linearGradient id="s" gradientUnits="userSpaceOnUse" x1="0" y1="${lines.y1}" x2="0" y2="${lines.y2}"><stop offset="0" stop-color="${colors.stripeTop}"/><stop offset=".55" stop-color="${colors.stripeBottom}"/></linearGradient>` +
    `<mask id="h" maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="127"><rect width="160" height="127" fill="#fff"/><circle cx="${dot.x}" cy="${dot.y}" r="${dot.halo}"/></mask>` +
    `<clipPath id="k"><path d="${crescent}"/></clipPath></defs>` +
    (withWordmark ? `<path d="${stripes}" fill="none" stroke="url(#s)" stroke-width="${lines.width}"/>` : '') +
    `<path d="${crescent}" fill="url(#c)" mask="url(#h)"/>` +
    (withWordmark ? `<path d="${stripes}" fill="none" stroke="#2E8AA3" stroke-opacity=".22" stroke-width="${lines.width}" clip-path="url(#k)"/>` : '') +
    `<circle${dotClass} cx="${dot.x}" cy="${dot.y}" r="${dot.r}" fill="${colors.ink}"/>` +
    (withWordmark ? `<path d="${wordmark}" fill="${colors.ink}" fill-rule="evenodd"/>` : '') +
    `</svg>\n`
}

const fullTitle = 'EPHT — École Privée d’Hôtellerie et de Tourisme'
writeFileSync(`${outDir}/logo-epht.svg`, svg(palette.positive, { title: fullTitle }))
writeFileSync(`${outDir}/logo-epht-negatif.svg`, svg(palette.negative, { title: fullTitle }))
// Square emblem for the favicon: the dot follows the browser's colour scheme.
writeFileSync(`${outDir}/icon.svg`, svg(palette.positive, {
  box: iconBox, withWordmark: false, dotClass: ' class="d"',
  style: '<style>@media (prefers-color-scheme:dark){.d{fill:#fff}}</style>',
}))
console.log('tail', f(tail.x), f(tail.y), '| tip', f(tip.x), f(tip.y))
