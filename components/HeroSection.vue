<template>
  <section :class="[
    'text-white py-16 md:py-20',
    gradientClass
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 :class="[
        'font-bold mb-6',
        titleSizeClass
      ]">
        <span v-if="highlightText" class="text-yellow-300">{{ highlightText }}</span>
        <span v-else>{{ title }}</span>
      </h1>
      <p :class="[
        'max-w-3xl mx-auto',
        descriptionSizeClass
      ]">
        {{ description }}
      </p>

      <!-- Stats Row -->
      <div v-if="stats" class="flex justify-center items-center space-x-4 mt-6 text-lg">
        <Icon :name="stats.icon" class="h-6 w-6" />
        <span>{{ stats.text }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  highlightText: {
    type: String,
    default: ''
  },
  gradient: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'gray', 'purple', 'green'].includes(value)
  },
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['large', 'medium'].includes(value)
  },
  stats: {
    type: Object,
    default: null
  }
})

// Computed classes based on props
const gradientClass = computed(() => {
  const gradients = {
    blue: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
    gray: 'bg-gradient-to-br from-gray-600 via-slate-600 to-zinc-600',
    purple: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    green: 'bg-gradient-to-r from-green-600 to-teal-600'
  }
  return gradients[props.gradient] || gradients.blue
})

const titleSizeClass = computed(() => {
  return props.size === 'large'
    ? 'text-4xl md:text-5xl lg:text-6xl'
    : 'text-3xl md:text-4xl'
})

const descriptionSizeClass = computed(() => {
  return props.size === 'large'
    ? 'text-xl md:text-2xl text-blue-100'
    : 'text-lg text-gray-200'
})
</script>
