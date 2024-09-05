import Client from '@searchkit/instantsearch-client'
import Searchkit from 'searchkit'
import searchkit_options from '../data/searchkit.json'
import {
  InstantSearch,
  SearchBox,
  Hits,
  Index,
  InstantSearchSSRProvider,
  Pagination,
  HitsPerPage,
} from 'react-instantsearch'
import {
  Error,
  EmptyQueryBoundary,
  NoResultsBoundary,
  LoadingIndicator,
  EmptyQueryMessage,
} from './search-utils'
import { SearchErrorToast } from '../components/SearchErrorToast'
import { ScrollTo } from '../components/ScrollTo'
import { Hit } from '../components/Hit'
import { Carousel } from '../components/Carousel'
import { NoResults } from '../components/NoResults'
import { AAPBResults } from '../components/AAPBResults'
import { Refinements } from '../components/Refinements'
import { SearchProps } from '../routes/search'
import { Router, stateToRoute, routeToState } from '../components/Router'

const sk = new Searchkit(searchkit_options)

export const searchClient = Client(sk)
console.log('searchClient', searchClient)

export const Search = ({ serverState, serverUrl, aapb_host }: SearchProps) => {
  let timerId
  let timeout = 350

  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={searchClient}
        routing={{
          router: Router(serverUrl),
          stateMapping: { stateToRoute, routeToState },
        }}
        insights={false}
      >
        <Error />
        <SearchErrorToast />

        <ScrollTo className="max-w-6xl p-4 flex gap-4 m-auto">
          <SearchBox
            queryHook={(query, refine) => {
              // console.log('searchbox', query)
              // debounce the search input box
              clearTimeout(timerId)
              timerId = setTimeout(() => refine(query), timeout)
            }}
            className="search-box"
          />
          <div className="search-results">
            <EmptyQueryBoundary fallback={<EmptyQueryMessage />}>
              <AAPBResults aapb_host={aapb_host} />
              <LoadingIndicator />
              <Index indexName="wagtail__wagtailcore_page">
                <NoResultsBoundary fallback={<NoResults />}>
                  <h2>Open Vault results</h2>
                  <Refinements />
                  <Hits hitComponent={Hit} />
                  <Pagination />
                  Results per page
                  <HitsPerPage
                    items={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10', default: true },
                      { value: 20, label: '20' },
                      { value: 50, label: '50' },
                    ]}
                  />
                </NoResultsBoundary>
              </Index>
              <Index indexName="gbh-series">
                <NoResultsBoundary fallback={null}>
                  <h3>GBH Series results</h3>
                  <Carousel aapb_host={aapb_host} />
                </NoResultsBoundary>
              </Index>
            </EmptyQueryBoundary>
          </div>
        </ScrollTo>
      </InstantSearch>
    </InstantSearchSSRProvider>
  )
}
