import { connectStateResults } from 'react-instantsearch-dom';

import React, { Component } from 'react';


const StateResults = ({ searchResults }) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;
  const nbHits = searchResults && searchResults.nbHits;
  
  return (
    <div>
      <div hidden={!hasResults}>There are {nbHits} results</div>
      <div hidden={hasResults}>There is no results</div>
    </div>
  );
};

const CustomStateResults = connectStateResults(StateResults);

export default CustomStateResults