import type { ReactNode } from 'react'
import { useInstantSearch } from 'react-instantsearch'

type NoResultsBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
}

export function NoResultsBoundary({
  children,
  fallback,
}: NoResultsBoundaryProps) {
  const { results } = useInstantSearch()

  // The `__isArtificial` flag makes sure to not display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return <>{children}</>
}

export function NoResults() {
  const { results } = useInstantSearch()

  return (
    <div className='no-results'>
      <h2>
        No results for <i>{results.query}</i>
      </h2>
      <p>Try using different keywords, or check your spelling.</p>
    </div>
  )
}
