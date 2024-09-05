import { renderToString } from 'react-dom/server'
import {
  RefinementList,
  getServerState,
  InstantSearchServerState,
} from 'react-instantsearch'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useRouteError } from '@remix-run/react'
import { Panel } from '../components/Panel'
import { Search } from '../components/search-ui'
import 'instantsearch.css/themes/algolia-min.css'
import '../styles/search.css'

export const meta: MetaFunction = ({ location }) => {
  const query = new URLSearchParams(
    location.search
  ).get("q")
  return [
    {
      title: `${query ? query + ' | ' : '' }Search GBH Open Vault`,
    },
    {
      name: 'description',
      content:
        'Search the GBH Open Vault catalog, Scholar Exhibits and Special Collections.',
    },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url
  const aapb_host = process.env.AAPB_HOST
  const serverState = await getServerState(
    <Search serverUrl={serverUrl} aapb_host={aapb_host} />,
    {
      renderToString,
    }
  )

  return json({
    serverState,
    serverUrl,
    aapb_host,
  })
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  )
}

export type SearchProps = {
  serverState?: InstantSearchServerState
  serverUrl?: URL
  aapb_host?: URL
}

export default function SearchPage() {
  const { serverState, serverUrl, aapb_host }: SearchProps = useLoaderData()
  return (
    <Search
      serverState={serverState}
      serverUrl={serverUrl}
      aapb_host={aapb_host}
    />
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.log('search error', error)
  return (
    <div>
      <h1>Search Error</h1>
      <h4>We're sorry! Search appears to be broken!</h4>
      <pre>{error.message}</pre>
    </div>
  )
}
