import { useState, useEffect } from 'react';
import { KEY } from '../App';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // callback?.();

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

  return { movies, loading, error };
}
