import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        {results.length === 0 ? (
          <p className="text-muted">No results found.</p>
        ) : (
          results.map((album) => (
            <div className="col-md-4 mb-4" key={album.id}>
              <div className="card h-100 shadow-sm">
                <div
                  className="card-img-top"
                  style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{album.name}</h5>
                  <p
                    className="card-text"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '90%', // Increase this value to allow more characters
                    }}
                  >
                    <strong>Artist:</strong> {album.artists[0].name}
                  </p>
                  <p className="card-text">
                    <strong>Release Date:</strong> {new Date(album.release_date).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
