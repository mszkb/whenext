<template>
  <span :class="['category-badge', getCategoryClass(category)]">
    {{ category }}
  </span>
</template>

<script setup>
const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

// Get category class for styling
const getCategoryClass = (category) => {
  const classMap = {
    tech: 'category-tech',
    gaming: 'category-gaming',
    entertainment: 'category-entertainment',
    ai: 'category-ai',
    'e-sports': 'category-e-sports',
    esports: 'category-e-sports',
    streaming: 'category-streaming',
    default: 'category-default'
  }

  return classMap[category.toLowerCase()] || classMap.default
}
</script>
