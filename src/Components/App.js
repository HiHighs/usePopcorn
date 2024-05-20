import { useEffect, useState } from 'react';

import NavBar from './Header/NavBar.js';
import Search from './Header/Search.js';
import NumResults from './Header/NumResults.js';
import Box from './Main/Box.js';
import Main from './Main/Main.js';
import Loader from './Main/Loader.js';
import MovieList from './Main/MovieList.js';
import MovieDetails from './Main/MovieDetails.js';
import WatchedSummary from './Main/WatchedSummary.js';
import WatchedMoviesList from './Main/WatchedMoviesList.js';
import ErrorMessage from './Main/ErrorMessage.js';
import { useMovies } from './Main/useMovies.js';
import { useLocalStorageState } from './Main/useLocalStorageState.js';

export const KEY = '407b2657';

export default function App() {
  //const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const { movies, loading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], 'watched');

  // Select movie in search result
  function handleSelectMovie(id) {
    if (id === selectedId) setSelectedId(null);
    else setSelectedId(id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    // Update user rating if already in watched list
    const watchedMovie = watched.find((w) => w.imdbID === movie.imdbID);
    if (watchedMovie) watchedMovie.userRating = movie.userRating;
    else setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar movies={movies}>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {loading ? <Loader /> : <MovieList movies={movies} />} */}
          {loading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
