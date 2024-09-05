import { Highlight, Hits } from 'react-instantsearch'

export const Carousel = ({ aapb_host }) => {
  const aapb_link = (title) => `${aapb_host}/catalog?f[series_titles][]=${title}&q=+(contributing_organizations: WGBH(MA) OR producing_organizations: WGBH Educational Foundation)&f[access_types][]=all`

  const SeriesHit = ({ hit }) => {
    return (
      <a href={aapb_link(hit.title)} target="_blank">
        <div className="tag">GBH Series</div>
        <Highlight attribute="title" hit={hit} />
      </a>
    )
  }
  

  return (
    <Hits
      hitComponent={SeriesHit}
      classNames={{
        list: 'series-carousel',
        item: 'series-carousel-item',
      }}
    />
  )
}
