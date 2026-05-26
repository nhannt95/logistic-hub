<!--
  Isometric 3D container stack (pure SVG, no deps).
  Stacks 5 colored containers with oblique projection + shading + door details.
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Cont {
  x: number; y: number; w: number; h: number; d: number
  top: string; front: string; side: string
  label?: string
  delay?: number
}

// width:height ratio of a real 40' container is ~3.5:1; we use stylized 2:1 for art
const CONTAINERS: Cont[] = [
  // Bottom-back row (deeper, more saturated)
  { x: 80,  y: 320, w: 200, h: 80, d: 60,
    top: '#60a5fa', front: '#2563eb', side: '#1e3a8a', label: 'MSC',
    delay: 0 },
  { x: 280, y: 340, w: 200, h: 80, d: 60,
    top: '#fcd34d', front: '#d97706', side: '#92400e', label: 'ANL',
    delay: 0.1 },
  // Middle row
  { x: 130, y: 220, w: 200, h: 80, d: 60,
    top: '#fca5a5', front: '#dc2626', side: '#991b1b', label: 'OOCL',
    delay: 0.2 },
  { x: 330, y: 240, w: 200, h: 80, d: 60,
    top: '#6ee7b7', front: '#059669', side: '#065f46', label: 'YANG',
    delay: 0.3 },
  // Top container (gold accent, brand color)
  { x: 200, y: 120, w: 200, h: 80, d: 60,
    top: '#fde68a', front: '#f59e0b', side: '#b45309', label: 'HK',
    delay: 0.4 },
]

// Build polygon point strings for each container
function buildPaths(c: Cont) {
  const { x, y, w, h, d } = c
  const ox = d * 0.866 // ~cos30
  const oy = d * 0.5   // ~sin30
  return {
    top:   `${x},${y} ${x + ox},${y - oy} ${x + w + ox},${y - oy} ${x + w},${y}`,
    front: `${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`,
    side:  `${x + w},${y} ${x + w + ox},${y - oy} ${x + w + ox},${y - oy + h} ${x + w},${y + h}`,
  }
}

const items = computed(() =>
  CONTAINERS.map((c) => ({ ...c, paths: buildPaths(c) }))
)
</script>

<template>
  <svg
    viewBox="0 0 600 460"
    class="w-full h-auto drop-shadow-2xl"
    aria-hidden="true"
  >
    <!-- Ground shadow -->
    <ellipse cx="320" cy="430" rx="240" ry="14" fill="rgba(0,0,0,0.35)" />

    <g
      v-for="(c, i) in items"
      :key="i"
      class="iso-cont-3d"
      :style="{ animationDelay: (c.delay ?? 0) + 's' }"
    >
      <!-- Top face (lightest) -->
      <polygon :points="c.paths.top" :fill="c.top" />
      <!-- Front face (medium) -->
      <polygon :points="c.paths.front" :fill="c.front" />
      <!-- Side face (darkest) -->
      <polygon :points="c.paths.side" :fill="c.side" />

      <!-- Front face details: vertical ridges + door square + label -->
      <g :transform="`translate(${c.x}, ${c.y})`">
        <!-- vertical ridge lines (cargo corrugation effect) -->
        <line v-for="rx in [40, 80, 120, 160]" :key="rx"
              :x1="rx" :y1="2" :x2="rx" :y2="c.h - 2"
              stroke="rgba(0,0,0,0.18)" stroke-width="1.2" />
        <!-- door square at right -->
        <rect :x="c.w - 36" :y="c.h * 0.25" :width="28" :height="c.h * 0.5"
              fill="rgba(0,0,0,0.12)" rx="2" />
        <!-- label badge -->
        <rect x="10" :y="c.h - 22" :width="40" height="14" rx="2" fill="rgba(255,255,255,0.85)" />
        <text x="14" :y="c.h - 11" font-family="ui-monospace, monospace"
              font-size="9" font-weight="700" fill="#0a0e1a">{{ c.label }}</text>
      </g>

      <!-- Side face highlight strip -->
      <polygon
        :points="`${c.x + c.w},${c.y} ${c.x + c.w + c.d * 0.866},${c.y - c.d * 0.5} ${c.x + c.w + c.d * 0.866},${c.y - c.d * 0.5 + 5} ${c.x + c.w},${c.y + 5}`"
        fill="rgba(255,255,255,0.18)"
      />
    </g>
  </svg>
</template>

<style scoped>
.iso-cont-3d {
  animation: iso-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: center;
}

@keyframes iso-rise {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .iso-cont-3d { animation: none; }
}
</style>
