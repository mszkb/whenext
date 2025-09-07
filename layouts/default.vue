<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <Icon name="heroicons:clock" class="h-8 w-8 text-blue-600" />
            <span class="text-xl font-bold gradient-text">Whenext</span>
          </NuxtLink>
          
          <!-- Navigation Links -->
          <div class="flex items-center space-x-6">
            <NuxtLink
              to="/"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              :class="{ 'text-blue-600 dark:text-blue-400 font-medium': $route.path === '/' }"
            >
              Countdowns
            </NuxtLink>
            <NuxtLink
              to="/history"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              :class="{ 'text-blue-600 dark:text-blue-400 font-medium': $route.path === '/history' }"
            >
              History
            </NuxtLink>
            <NuxtLink
              to="/faq"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              :class="{ 'text-blue-600 dark:text-blue-400 font-medium': $route.path === '/faq' }"
            >
              FAQ
            </NuxtLink>
            
            <!-- Dark Mode Toggle -->
            <UButton
              icon="heroicons:sun"
              color="gray"
              variant="ghost"
              @click="toggleDarkMode"
              class="dark:hidden"
            />
            <UButton
              icon="heroicons:moon"
              color="gray"
              variant="ghost"
              @click="toggleDarkMode"
              class="hidden dark:inline-flex"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- About -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About Whenext</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.
              Never miss important releases and announcements again.
            </p>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  All Countdowns
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/history" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Event History
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/faq" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  FAQ
                </NuxtLink>
              </li>
              <li>
                <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Categories -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Categories</h3>
            <div class="flex flex-wrap gap-2">
              <span class="category-badge category-tech">Tech</span>
              <span class="category-badge category-gaming">Gaming</span>
              <span class="category-badge category-entertainment">Entertainment</span>
            </div>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            © {{ new Date().getFullYear() }} Whenext. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const colorMode = useColorMode()

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// SEO Meta for layout
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { name: 'format-detection', content: 'telephone=no' }
  ]
})
</script>
