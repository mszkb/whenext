<template>
  <div>
    <!-- Hero Section -->
    <HeroSection
      title="Frequently Asked Questions"
      description="Everything you need to know about Whenext and how our countdown system works."
      gradient="purple"
      size="medium"
    />

    <!-- FAQ Content -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-8">
          <div
            v-for="(faq, index) in faqs"
            :key="faq.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <button
              @click="toggleFAQ(faq.id)"
              class="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded-xl"
              :aria-expanded="openFAQs.includes(faq.id)"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                {{ faq.question }}
              </h3>
              <Icon
                :name="openFAQs.includes(faq.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                class="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
              />
            </button>
            
            <div
              v-show="openFAQs.includes(faq.id)"
              class="px-6 pb-6"
            >
              <div class="prose prose-gray dark:prose-invert max-w-none">
                <div v-html="faq.answer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// SEO Meta
useHead({
  title: 'FAQ - Whenext Multi Countdown App',
  meta: [
    { name: 'description', content: 'Frequently asked questions about Whenext countdown app, including how our confidence scoring works and where our data comes from.' }
  ]
})
// Reactive data
const openFAQs = ref([])

// FAQ data
const faqs = [
  {
    id: 'what-is-whenext',
    question: 'What is Whenext?',
    answer: `
      <p>Whenext is a comprehensive countdown application that tracks upcoming events across technology, gaming, and entertainment industries. We provide real-time countdowns with confidence scoring to help you stay informed about important releases, announcements, and events.</p>
      <p>Our platform aggregates information from reliable sources and presents it in an easy-to-understand format, complete with countdown timers and reliability indicators.</p>
    `
  },
  {
    id: 'data-sources',
    question: 'Where does the countdown data come from?',
    answer: `
      <p>Our event data comes from a variety of trusted sources including:</p>
      <ul>
        <li><strong>Official Company Announcements:</strong> Direct statements from Apple, Google, Tesla, Netflix, and other major companies</li>
        <li><strong>Industry Publications:</strong> Tech news sites, gaming magazines, entertainment trade publications</li>
        <li><strong>Regulatory Filings:</strong> SEC filings, trademark applications, and other legal documents</li>
        <li><strong>Historical Patterns:</strong> Analysis of past release cycles and company behavior</li>
        <li><strong>Insider Reports:</strong> Verified leaks and reports from industry insiders</li>
      </ul>
      <p>All data is manually curated and verified by our team before being added to the platform. We continuously monitor sources for updates and adjust dates as new information becomes available.</p>
    `
  },
  {
    id: 'confidence-scoring',
    question: 'How does the confidence scoring system work?',
    answer: `
      <p>Our confidence scoring system rates the reliability of each countdown on a scale from 0% to 100%:</p>
      <ul>
        <li><strong>90-100% (High Confidence):</strong> Official announcement with confirmed date and time</li>
        <li><strong>70-89% (Medium-High Confidence):</strong> Strong indication from reliable sources or established patterns</li>
        <li><strong>50-69% (Medium Confidence):</strong> Educated guess based on industry patterns and reliable speculation</li>
        <li><strong>0-49% (Low Confidence):</strong> Pure speculation or very uncertain information</li>
      </ul>
      <p>This system helps you understand how reliable each countdown is, allowing you to make informed decisions about which events to prioritize.</p>
    `
  },
  {
    id: 'update-frequency',
    question: 'How often is the data updated?',
    answer: `
      <p>We update our countdown data regularly to ensure accuracy:</p>
      <ul>
        <li><strong>Real-time Updates:</strong> Countdown timers update every second for precise tracking</li>
        <li><strong>Daily Monitoring:</strong> We check all major sources daily for new announcements or date changes</li>
        <li><strong>Immediate Updates:</strong> When official announcements are made, we update the data within hours</li>
        <li><strong>Weekly Reviews:</strong> Comprehensive review of all events to verify accuracy and adjust confidence scores</li>
      </ul>
      <p>If an event date changes or is cancelled, we immediately update the information and notify users through our platform.</p>
    `
  },
  {
    id: 'categories',
    question: 'What categories of events do you track?',
    answer: `
      <p>Currently, we track events across three main categories:</p>
      <ul>
        <li><strong>Technology:</strong> Product launches, software releases, conference announcements, and major tech industry events</li>
        <li><strong>Gaming:</strong> Video game releases, console launches, gaming events, and industry announcements</li>
        <li><strong>Entertainment:</strong> Movie releases, TV show premieres, streaming service launches, and entertainment industry events</li>
      </ul>
      <p>We're constantly expanding our coverage and plan to add more categories based on user feedback and demand.</p>
    `
  },
  {
    id: 'accuracy',
    question: 'How accurate are your countdowns?',
    answer: `
      <p>The accuracy of our countdowns depends on the reliability of the source information:</p>
      <ul>
        <li><strong>Official Dates:</strong> 95%+ accuracy for officially announced events</li>
        <li><strong>Industry Reports:</strong> 70-85% accuracy for well-sourced industry reports</li>
        <li><strong>Estimated Dates:</strong> 40-60% accuracy for dates based on patterns and speculation</li>
      </ul>
      <p>We always indicate the confidence level for each countdown, and we recommend paying closer attention to high-confidence events for planning purposes.</p>
    `
  },
  {
    id: 'mobile-app',
    question: 'Is there a mobile app available?',
    answer: `
      <p>Currently, Whenext is available as a responsive web application that works perfectly on mobile devices. Our web app provides:</p>
      <ul>
        <li>Full functionality on smartphones and tablets</li>
        <li>Responsive design that adapts to your screen size</li>
        <li>Fast loading times and smooth performance</li>
        <li>Offline capabilities for viewing cached countdowns</li>
      </ul>
      <p>We're considering developing dedicated mobile apps for iOS and Android based on user demand. Stay tuned for updates!</p>
    `
  },
  {
    id: 'notifications',
    question: 'Can I get notifications for upcoming events?',
    answer: `
      <p>Currently, our notification system is in development. We're planning to implement:</p>
      <ul>
        <li><strong>Browser Notifications:</strong> Real-time alerts when events are approaching</li>
        <li><strong>Email Alerts:</strong> Customizable email notifications for events you're tracking</li>
        <li><strong>Custom Timing:</strong> Set how far in advance you want to be notified</li>
        <li><strong>Category Filters:</strong> Choose which types of events you want notifications for</li>
      </ul>
      <p>This feature will be available in a future update. Follow our social media or check back regularly for announcements!</p>
    `
  },
  {
    id: 'suggest-events',
    question: 'Can I suggest events to track?',
    answer: `
      <p>Absolutely! We welcome community suggestions for new events to track. Here's how you can contribute:</p>
      <ul>
        <li><strong>Contact Form:</strong> Use our contact form to suggest new events with source links</li>
        <li><strong>Social Media:</strong> Reach out to us on our social media channels</li>
        <li><strong>Email:</strong> Send suggestions directly to our team</li>
      </ul>
      <p>When suggesting events, please include:</p>
      <ul>
        <li>Event name and description</li>
        <li>Expected date (if known)</li>
        <li>Source of information</li>
        <li>Why it would be valuable to track</li>
      </ul>
      <p>We review all suggestions and add qualifying events to our tracking list.</p>
    `
  }
]

// Methods
const toggleFAQ = (id) => {
  const index = openFAQs.value.indexOf(id)
  if (index > -1) {
    openFAQs.value.splice(index, 1)
  } else {
    openFAQs.value.push(id)
  }
}

// Schema.org structured data for FAQ
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'name': 'Whenext FAQ',
        'description': 'Frequently asked questions about Whenext countdown app',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer.replace(/<[^>]*>/g, '') // Strip HTML for schema
          }
        }))
      })
    }
  ]
})
</script>

<style scoped>
.prose ul {
  @apply list-disc list-inside space-y-1;
}

.prose li {
  @apply text-gray-600 dark:text-gray-300;
}

.prose strong {
  @apply font-semibold text-gray-900 dark:text-gray-100;
}

.prose p {
  @apply text-gray-600 dark:text-gray-300 leading-relaxed mb-4;
}
</style>
