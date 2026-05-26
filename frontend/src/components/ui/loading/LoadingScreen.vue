<!--
  LoadingScreen - dots morphing via SVG goo filter.
  Adapted from Uiverse.io by Sourcesketch.
-->
<script setup lang="ts">
defineProps<{ show: boolean }>()
</script>

<template>
  <Transition name="loader-fade">
    <div v-if="show" class="loader-overlay" role="status" aria-live="polite" aria-label="Đang tải">
      <!-- SVG goo filter -->
      <svg width="0" height="0" class="loader-svg">
        <defs>
          <filter id="loaderGoo">
            <feGaussianBlur stdDeviation="10" in="SourceGraphic" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
            />
          </filter>
        </defs>
      </svg>

      <div class="loader-container">
        <div class="loader-dot loader-dot-1" />
        <div class="loader-dot loader-dot-2" />
        <div class="loader-dot loader-dot-3" />
      </div>

      <div class="loader-caption">Đang tải...</div>
    </div>
  </Transition>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

:global(.dark) .loader-overlay {
  background: rgba(10, 14, 26, 0.85);
}

.loader-svg {
  position: absolute;
  width: 0;
  height: 0;
}

.loader-container {
  width: 200px;
  height: 200px;
  position: relative;
  filter: url('#loaderGoo');
  animation: loader-rotate 2s ease-in-out infinite;
}

.loader-dot {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.loader-dot-3 {
  background-color: #ef4444;
  animation: loader-dot-3-move 2s ease infinite, loader-index 6s ease infinite;
}

.loader-dot-2 {
  background-color: #2563eb;
  animation: loader-dot-2-move 2s ease infinite, loader-index 6s -4s ease infinite;
}

.loader-dot-1 {
  background-color: #f59e0b;
  animation: loader-dot-1-move 2s ease infinite, loader-index 6s -2s ease infinite;
}

@keyframes loader-dot-3-move {
  20%  { transform: scale(1); }
  45%  { transform: translateY(-18px) scale(0.45); }
  60%  { transform: translateY(-90px) scale(0.45); }
  80%  { transform: translateY(-90px) scale(0.45); }
  100% { transform: translateY(0)    scale(1); }
}

@keyframes loader-dot-2-move {
  20%  { transform: scale(1); }
  45%  { transform: translate(-16px, 12px) scale(0.45); }
  60%  { transform: translate(-80px, 60px) scale(0.45); }
  80%  { transform: translate(-80px, 60px) scale(0.45); }
  100% { transform: translateY(0) scale(1); }
}

@keyframes loader-dot-1-move {
  20%  { transform: scale(1); }
  45%  { transform: translate(16px, 12px) scale(0.45); }
  60%  { transform: translate(80px, 60px) scale(0.45); }
  80%  { transform: translate(80px, 60px) scale(0.45); }
  100% { transform: translateY(0) scale(1); }
}

@keyframes loader-rotate {
  55%  { transform: rotate(0deg); }
  80%  { transform: rotate(360deg); }
  100% { transform: rotate(360deg); }
}

@keyframes loader-index {
  0%, 100% { z-index: 3; }
  33.3%    { z-index: 2; }
  66.6%    { z-index: 1; }
}

.loader-caption {
  position: absolute;
  bottom: calc(50% - 160px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: hsl(215.4 16.3% 46.9%);
}

:global(.dark) .loader-caption {
  color: rgba(255, 255, 255, 0.6);
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.2s ease;
}
.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>
