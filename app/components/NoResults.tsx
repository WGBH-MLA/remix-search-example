import { useInstantSearch } from 'react-instantsearch-core'

export function NoResults() {
  const { results } = useInstantSearch()

  return (
    <div className="no-results">
      <h2>
        No results for <i>{results.query}</i>
      </h2>
      <p>Try using different keywords, or check your spelling.</p>
    </div>
  )
}
