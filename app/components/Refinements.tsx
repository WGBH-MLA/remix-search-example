import {
  CurrentRefinements,
  ToggleRefinement,
  useInstantSearch,
  ClearRefinements,
  RefinementList,
} from 'react-instantsearch'
const ATTRIBUTES = { content_type: 'Type', featured: 'Featured' }

// Labels for content types
const CONTENT_TYPES = {
  'exhibits.ExhibitPage': 'Scholar Exhibits',
  'ov_collections.Collection': 'Special Collections',
}
export const transformContentTypes = items =>
  items
    .filter(item => item.value in CONTENT_TYPES)
    .map(item => {
      if (item.label in CONTENT_TYPES) {
        return { ...item, label: CONTENT_TYPES[item.label] }
      }
    })

export const transformItems = items =>
  // transform refinement Labels
  items.map(item => {
    console.log('refinement', item)
    if (item.attribute in ATTRIBUTES) {
      // if this is an attribute we track, transform the label for each refinement
      item.refinements = item.refinements.map(refinement => {
        if (refinement.value in CONTENT_TYPES) {
          // Transform the refinement label
          return {
            ...refinement,
            label: CONTENT_TYPES[refinement.value],
          }
        }
        return refinement // return the original refinement if it's not in CONTENT_TYPES
      })
      return { ...item, label: ATTRIBUTES[item.attribute] }
    }
    return item // return the original item if its attribute is not in ATTRIBUTES
  })

export const HiddenClearRefinements = () => {
  const { indexUiState } = useInstantSearch()

  if (indexUiState.refinementList) {
    return <ClearRefinements />
  }
}

export const Refinements = () => (
  <>
    <CurrentRefinements transformItems={transformItems} />
    <HiddenClearRefinements />
    <ToggleRefinement attribute="featured" label="Featured" />
    <RefinementList
      attribute="content_type"
      transformItems={transformContentTypes}
    />
  </>
)
