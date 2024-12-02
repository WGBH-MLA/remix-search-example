import { useSearchBox } from 'react-instantsearch'

export default ({ children, fallback }) => {
  const { query } = useSearchBox()

  if (!query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}
