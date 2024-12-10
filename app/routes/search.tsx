import type { LoaderFunction } from '@remix-run/node'

import {
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  DynamicWidgets,
  Index,
} from 'react-instantsearch'
import { history } from 'instantsearch.js/cjs/lib/routers/index.js'
import Searchkit from 'searchkit'
import Client from '@searchkit/instantsearch-client'
import 'instantsearch.css/themes/algolia-min.css'
import '../app.css'

import searchkit_options from '../data/searchkit'
import Hit from '../components/Hit'
import { NoResultsBoundary, NoResults } from '../components/NoResultsBoundary'
import EmptyQueryBoundary from '../components/EmptyQueryBoundary'
import Suggestions from '../components/Suggestions'
import { Panel, Tabs, Tab } from '../components'

const sk = new Searchkit(searchkit_options)

// export const loader: LoaderFunction = async ({}) => {}

type SearchProps = {}

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

export function Search({}: SearchProps) {
  let timerId: NodeJS.Timeout
  let timeout: number = 300

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName='wagtail__wagtailcore_page'
      routing={{
        router: history({
          cleanUrlOnDispose: false,
        }),
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}>
      <div className='Container'>
        <DynamicWidgets>
          <Panel header='Content Type'>
            <RefinementList attribute='content_type' />
          </Panel>
        </DynamicWidgets>
        <div className='Search'>
          <div className='Search-header'>
            <SearchBox
              queryHook={(query, search) => {
                // debounce the search input box
                console.log('searchbox', search)

                clearTimeout(timerId)
                timerId = setTimeout(() => search(query), timeout)
              }}
            />
          </div>

          <Tabs>
            <Tab title='Open Vault'>
              <EmptyQueryBoundary fallback={null}>{'full'}</EmptyQueryBoundary>
              {<Suggestions />}
              <NoResultsBoundary fallback={<NoResults />}>
                <Hits hitComponent={Hit} />
                <Pagination />
              </NoResultsBoundary>
            </Tab>
            <Tab title='GBH Series'>
              {<Suggestions />}
              <Index indexName='gbh-series'>
                <Hits hitComponent={Hit} />
                <Pagination />
              </Index>
            </Tab>
          </Tabs>
        </div>
      </div>
    </InstantSearch>
  )
}

export default () => {
  return <Search />
}
