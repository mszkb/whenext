export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.siteUrl || 'https://whenext.app'
  
  const robots = `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseURL}/sitemap.xml

# Crawl-delay to be respectful to search engines
Crawl-delay: 1

# Additional directives for better SEO
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`

  setHeader(event, 'Content-Type', 'text/plain')
  return robots
})
