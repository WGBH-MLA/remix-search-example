import type { Hit as AlgoliaHit } from 'instantsearch.js'
import { Highlight, Snippet } from 'react-instantsearch'

type HitProps = {
  hit: AlgoliaHit<{
    objectID: number
    title: string
  }>
}

export const Hit = ({ hit }: HitProps) => {
  let route, label, type
  switch (true) {
    case 'exhibits_exhibitpage__body_edgengrams' in hit:
      label = 'Scholar Exhibit'
      route = '/exhibits/' + hit.objectID
      type = 'exhibit-tag'
      break
    case 'ov_collections_collection__introduction_edgengrams' in hit:
      label = 'Special Collection'
      route = '/collections/' + hit.objectID
      type = 'collection-tag'
      break
    default:
  }

  return (
    <a href={route}>
      <div className={`tag ${type}`}>{label}</div>
      <Highlight attribute="title" hit={hit} />
      <br />
      <Snippet attribute="exhibits_exhibitpage__body_edgengrams" hit={hit} />
      <Snippet
        attribute="ov_collections_collection__introduction_edgengrams"
        hit={hit}
      />
    </a>
  )
}
