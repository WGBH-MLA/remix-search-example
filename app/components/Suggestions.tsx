import { useSearchBox } from 'react-instantsearch'

export const default_suggestions = [
  'Julia Child',
  'Louis Lyons',
  'Boston',
  'Arthur',
  'NOVA',
  'Civil Rights',
  'Vietnam',
  'WGBH',
  'Cooking',
  'Music',
]

function shuffle(array) {
  // Fisher-Yates shuffle algorithm (AKA Knuth shuffle)
  // Blatantly stolen from https://stackoverflow.com/a/2450976/19192178
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
}

export const SearchLink = (query) => {
  const { refine } = useSearchBox()

  return (
    <div
      onClick={(event) => {
        refine(query)
      }}>
      {query}
    </div>
  )
}

export default () => {
  const { query } = useSearchBox()
  shuffle(default_suggestions)
  const suggestions = (
    <>
      <h4>Search suggestions:</h4>
      <ul>
        {default_suggestions.slice(0, 4).map((query) => (
          <li>{SearchLink(query)}</li>
        ))}
      </ul>
    </>
  )

  if (!query) return <>{suggestions}</>
}
