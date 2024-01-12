import React, { Component } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';

function NoResultsBoundary({ children }) {
  const { results } = useInstantSearch()


  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        <NoResults />
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}

function NoResults() {
  const { indexUiState } = useInstantSearch()

  if (Object.keys(indexUiState).length === 0) {
    return
  } else {
    return (
      <div>
        <p style={{margin : "0", color: "#FFD115"}}>
          No results for <q>{indexUiState.query}</q>.
        </p>
      </div>
    )
  }
}

export default NoResultsBoundary;