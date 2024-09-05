import { useSearchBox, Pagination } from 'react-instantsearch'
import { useInstantSearch } from 'react-instantsearch-core'

export const EmptyQueryMessage = () => <>
  <h2>Search Open Vault</h2>
</>

export function Error() {
  const { error } = useInstantSearch({ catchError: true })

  if (error) {
    return <>Search error: {error.message}</>
  }
}

export const LoadingIndicator = () => {
  const { status } = useInstantSearch()

  if (status === 'stalled') {
    return (
      <>
        <p>Loading search results</p>
      </>
    )
  }
  return null
}

export function Pager() {
  const { query } = useSearchBox()

  return <>{query && <Pagination />}</>
}

export const EmptyQueryBoundary = ({ children, fallback }) => {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}

export function NoResultsBoundary({ children, fallback }) {
  const { results } = useInstantSearch()
  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}

export const NoResults = () => {
  const { results } = useInstantSearch()
  return (
    <>
      <h2>
        No results for <i>{results.query}</i>
      </h2>
      <p>Try using different keywords, or check your spelling.</p>
    </>
  )
}
