<template>
  <div class="text-center py-16">
    <Icon :name="icon" :class="iconClass" />
    <h3 :class="titleClass">
      {{ title }}
    </h3>
    <p :class="descriptionClass">
      {{ description }}
    </p>

    <!-- Action Button -->
    <NuxtLink
      v-if="actionLink && actionText"
      :to="actionLink"
      :class="actionButtonClass"
    >
      <Icon :name="actionIcon" class="h-4 w-4 mr-2" />
      {{ actionText }}
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: 'heroicons:calendar-days'
  },
  iconClass: {
    type: String,
    default: 'h-16 w-16 text-gray-400 mx-auto mb-4'
  },
  title: {
    type: String,
    required: true
  },
  titleClass: {
    type: String,
    default: 'text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'
  },
  description: {
    type: String,
    required: true
  },
  descriptionClass: {
    type: String,
    default: 'text-gray-500 dark:text-gray-400'
  },
  actionLink: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: 'heroicons:arrow-left'
  },
  actionButtonClass: {
    type: String,
    default: 'inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
  }
})
</script>
