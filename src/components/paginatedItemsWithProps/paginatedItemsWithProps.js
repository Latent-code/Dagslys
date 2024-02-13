import React, { Component, useState, useMemo } from 'react';


const PaginatedItemsWithProps = ({ array, renderItems }) => {
  const pageSize = 20;

  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const currentViewData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return array.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  return renderItems(array, pageSize, currentPage, handleChange, currentViewData)
};

export default PaginatedItemsWithProps;