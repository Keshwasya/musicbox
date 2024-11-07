import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchResults from './SearchResults';
import axios from 'axios';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search`, { params: { query } });
      setResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]); // Set to an empty array on error
    }
  };

  return (
    <div className="container text-center my-4">
      <h1>Album Search</h1>
      <SearchResults results={results} />
    </div>
  );
};

export default SearchPage;
