import React from 'react'
import SeoMeta from '../../shared/components/SeoMeta'
import { DEFAULT_DESCRIPTION, SITE_NAME } from '../../shared/seo/seo-config'

export default function HomeSeo() {
  return (
    <SeoMeta
      title={`${SITE_NAME} | Discover Gilgit-Baltistan`}
      description={DEFAULT_DESCRIPTION}
      canonical={`${window.location.origin}/`}
      url={`${window.location.origin}/`}
      ogType="website"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${window.location.origin}/`,
        description: DEFAULT_DESCRIPTION,
      }}
      breadcrumbs={[
        { name: 'Home', item: `${window.location.origin}/` },
      ]}
    />
  )
}
