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

export const KEY = '407b2657';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

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

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovie() {
      try {
        // reset error first
        setError('');
        setLoading(true);
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        ).then((data) => data.json());

        if (response.Response !== 'True') throw new Error(response.Error);

        setMovies(response.Search);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovie();

    return function () {
      controller.abort();
    };
  }, [query]);

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
