export default defineNuxtPlugin(() => {
  // Enhanced Schema.org markup for better Google Gemini searchability
  const addOrganizationSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Whenext',
      'description': 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns',
      'url': 'https://whenext.app',
      'logo': 'https://whenext.app/logo.png',
      'sameAs': [
        'https://twitter.com/whenext',
        'https://github.com/whenext'
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        'availableLanguage': 'English'
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(schema)
    document.head.appendChild(script)
  }

  const addBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(schema)
    document.head.appendChild(script)
  }

  const addWebSiteSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Whenext',
      'description': 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns',
      'url': 'https://whenext.app',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://whenext.app/?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(schema)
    document.head.appendChild(script)
  }

  // Add schemas on client side
  if (process.client) {
    addOrganizationSchema()
    addWebSiteSchema()
    
    // Add breadcrumbs based on current route
    const router = useRouter()
    router.afterEach((to) => {
      const breadcrumbs = []
      breadcrumbs.push({ name: 'Home', url: 'https://whenext.app/' })
      
      if (to.path === '/faq') {
        breadcrumbs.push({ name: 'FAQ', url: 'https://whenext.app/faq' })
      }
      
      if (breadcrumbs.length > 1) {
        addBreadcrumbSchema(breadcrumbs)
      }
    })
  }
})
