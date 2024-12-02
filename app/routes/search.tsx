import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import {
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  Pagination,
  RefinementList,
  SearchBox,
  useInstantSearch,
  getServerState,
  useSearchBox,
} from 'react-instantsearch'
import type { InstantSearchServerState } from 'react-instantsearch'
import { history } from 'instantsearch.js/cjs/lib/routers/index.js'
import 'instantsearch.css/themes/algolia-min.css'
import Searchkit from 'searchkit'
import Client from '@searchkit/instantsearch-client'

import searchkit_options from '../data/searchkit.json'
import Hit from '../components/Hit'
import { NoResultsBoundary, NoResults } from '../components/NoResultsBoundary'
import EmptyQueryBoundary from '../components/EmptyQueryBoundary'
import Suggestions from '../components/Suggestions'

const sk = new Searchkit(searchkit_options)

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  })

  return {
    serverState,
    serverUrl,
  }
}

type SearchProps = {
  serverState?: InstantSearchServerState
  serverUrl?: string
}

export const searchClient = Client(sk, {
  getQuery: (query, search_attributes) => {
    console.log('search query', query, search_attributes)
    return [
      {
        simple_query_string: {
          query,
        },
      },
    ]
  },
})

function Search({ serverState, serverUrl }: SearchProps) {
  let timerId: NodeJS.Timeout
  let timeout: number = 300

  return (
    // <InstantSearchSSRProvider {...serverState}>
    <InstantSearch
      searchClient={searchClient}
      indexName='wagtail__wagtailcore_page'
      routing={{
        router: history({
          getLocation() {
            if (typeof window === 'undefined') {
              return new URL(serverUrl!) as unknown as Location
            }

            return window.location
          },
        }),
      }}>
      {/* The EmptyQueryBoundary (pulled directly from the Instantsearch documentation) does not work with the Suggestions component, even though both work fine individually */}
      {/* <EmptyQueryBoundary fallback={<Suggestions />}></EmptyQueryBoundary> */}
      {/* <EmptyQueryBoundary fallback={null}>{<Suggestions />}</EmptyQueryBoundary> */}
      <Suggestions />

      <SearchBox
        queryHook={(query, search) => {
          // debounce the search input box
          console.log('searchbox', search)

          clearTimeout(timerId)
          timerId = setTimeout(() => search(query), timeout)
        }}
      />
      <NoResultsBoundary fallback={<NoResults />}>
        <Hits hitComponent={Hit} />
        <Pagination />
      </NoResultsBoundary>
    </InstantSearch>
    // </InstantSearchSSRProvider>
  )
}

export default () => {
  const { serverState, serverUrl } = useLoaderData()
  // console.log("serverState", serverState);
  return <Search serverState={serverState} serverUrl={serverUrl} />
}
