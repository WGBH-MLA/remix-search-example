import { history } from 'instantsearch.js/cjs/lib/routers/index.js'
import type { UiState } from 'instantsearch.js'

type RouteState = {
  q?: string
  p?: number
  types?: string[]
  featured?: boolean
}

export const stateToRoute = (uiState: UiState) => {
  console.log('stateToRoute', uiState)
  let wagtail = uiState['wagtail__wagtailcore_page']
  return {
    q: uiState['']?.query,
    p: uiState['wagtail__wagtailcore_page']?.page,
    types: uiState['wagtail__wagtailcore_page']?.refinementList?.content_type,
    featured: uiState['wagtail__wagtailcore_page']?.toggle?.featured,
  }
}

export const routeToState = (routeState: RouteState) => {
  console.log('routeToState', routeState)
  return {
    '': {
      query: routeState.q,
    },
    wagtail__wagtailcore_page: {
      page: routeState.p,
      refinementList: { content_type: routeState.types },
      toggle: { featured: routeState.featured ? true : undefined},
    },
  }
}

export const Router = (serverUrl: URL) =>
  history({
    getLocation() {
      if (typeof window === 'undefined') {
        return new URL(serverUrl!) as unknown as Location
      }
      return window.location
    },
  })
