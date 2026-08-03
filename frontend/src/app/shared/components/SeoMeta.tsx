import React, { useEffect } from 'react'
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  createBreadcrumbJsonLd,
  type BreadcrumbSchemaItem,
} from '../seo/seo-config'

type SeoMetaProps = {
  title: string
  description: string
  canonical?: string
  ogType?: string
  ogImage?: string
  url?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  breadcrumbs?: BreadcrumbSchemaItem[]
}

function setMetaTag(name: string, content: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let element = document.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    if (isProperty) {
      element.setAttribute('property', name)
    } else {
      element.name = name
    }
    document.head.appendChild(element)
  }

  element.content = content
}

function setCanonicalLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

function setJsonLd(schemaData: Record<string, unknown> | Record<string, unknown>[]) {
  let script = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]#seo-jsonld')
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'seo-jsonld'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(schemaData, null, 2)
}

export default function SeoMeta({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  url,
  jsonLd,
  breadcrumbs,
}: SeoMetaProps) {
  useEffect(() => {
    document.title = title

    setMetaTag('description', description)
    setMetaTag('og:title', title, true)
    setMetaTag('og:description', description, true)
    setMetaTag('og:type', ogType, true)
    setMetaTag('og:site_name', SITE_NAME, true)
    setMetaTag('og:image', ogImage, true)
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', title)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', ogImage)

    const canonicalUrl = canonical || url || (typeof window !== 'undefined' ? window.location.href : '')
    if (canonicalUrl) {
      setCanonicalLink(canonicalUrl)
      setMetaTag('og:url', canonicalUrl, true)
    }

    const schemaObjects: Array<Record<string, unknown>> = []
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemaObjects.push(...jsonLd)
      } else {
        schemaObjects.push(jsonLd)
      }
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      schemaObjects.push(createBreadcrumbJsonLd(breadcrumbs))
    }

    if (schemaObjects.length > 0) {
      setJsonLd(schemaObjects.length === 1 ? schemaObjects[0] : schemaObjects)
    }
  }, [title, description, canonical, ogType, ogImage, url, jsonLd, breadcrumbs])

  return null
}
