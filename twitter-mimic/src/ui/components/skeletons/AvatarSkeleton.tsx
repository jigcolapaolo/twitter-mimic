import React from 'react'
import ContentLoader from 'react-content-loader'

export function AvatarSkeleton () {
    return (
        <ContentLoader
          speed={2}
          width={180}
          height={80}
          viewBox="0 0 180 80"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <circle cx="90" cy="25" r="25" />
          <circle cx="105" cy="30" r="4" />
        </ContentLoader>
      )
}