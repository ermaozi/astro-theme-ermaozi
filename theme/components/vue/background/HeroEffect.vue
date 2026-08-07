<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<{ effect: string, config?: Record<string, unknown> }>()
const effects = {
  beams: defineAsyncComponent(() => import('./Beams.vue')),
  'dark-veil': defineAsyncComponent(() => import('./DarkVeil.vue')),
  'dot-grid': defineAsyncComponent(() => import('./DotGrid.vue')),
  'hyper-speed': defineAsyncComponent(() => import('./HyperSpeed.vue')),
  iridescence: defineAsyncComponent(() => import('./Iridescence.vue')),
  lightning: defineAsyncComponent(() => import('./Lightning.vue')),
  'liquid-ether': defineAsyncComponent(() => import('./LiquidEther.vue')),
  orb: defineAsyncComponent(() => import('./Orb.vue')),
  'pixel-blast': defineAsyncComponent(() => import('./PixelBlast.vue')),
  prism: defineAsyncComponent(() => import('./Prism.vue')),
}
const component = computed(() => effects[props.effect as keyof typeof effects])
</script>

<template><component :is="component" v-if="component" v-bind="config || {}" /></template>
